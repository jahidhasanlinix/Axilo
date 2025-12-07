
import React, { useState } from 'react';
import { Agent, Tool, ToolType } from '../types';
import { Plus, Trash2, PhoneForwarded, Calendar, Code, ChevronDown, ExternalLink, Settings2, Edit2 } from 'lucide-react';

interface ToolsTabProps {
  agent: Agent;
  updateAgent: (updates: Partial<Agent>) => void;
}

const TOOL_TEMPLATES: { type: ToolType; label: string; icon: any; defaultName: string; defaultDesc: string }[] = [
  { 
    type: 'transfer_call', 
    label: 'Transfer Call', 
    icon: PhoneForwarded, 
    defaultName: 'transferCall', 
    defaultDesc: 'Transfers the call to a human agent or a specific department.' 
  },
  { 
    type: 'get_calendar', 
    label: 'Fetch Calendar Slots', 
    icon: Calendar, 
    defaultName: 'checkAvailability', 
    defaultDesc: 'Checks for available time slots in the calendar for a given date.' 
  },
  { 
    type: 'book_calendar', 
    label: 'Book Calendar Slots', 
    icon: Calendar, 
    defaultName: 'bookSlot', 
    defaultDesc: 'Books a specific time slot in the calendar for the user.' 
  },
  { 
    type: 'custom', 
    label: 'Custom Function', 
    icon: Code, 
    defaultName: 'customFunction', 
    defaultDesc: 'Executes a custom API call.' 
  }
];

const ToolsTab: React.FC<ToolsTabProps> = ({ agent, updateAgent }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ToolType>('transfer_call');
  const [editingToolId, setEditingToolId] = useState<string | null>(null);
  
  // State for the tool being added or edited
  const [toolForm, setToolForm] = useState<Partial<Tool>>({});

  const handleAddToolStart = () => {
    const template = TOOL_TEMPLATES.find(t => t.type === selectedTemplate);
    if (!template) return;

    setToolForm({
      id: `tool_${Date.now()}`,
      type: template.type,
      name: template.defaultName,
      description: template.defaultDesc,
      config: {
        method: 'POST' // Default for custom
      }
    });
    setEditingToolId('NEW');
  };

  const handleEditToolStart = (tool: Tool) => {
    setToolForm({ ...tool });
    setEditingToolId(tool.id);
  };

  const handleSaveTool = () => {
    if (!toolForm.name || !toolForm.type) return;

    const newTool = toolForm as Tool;
    let newTools = [...(agent.tools || [])];

    if (editingToolId === 'NEW') {
      newTools.push(newTool);
    } else {
      newTools = newTools.map(t => t.id === editingToolId ? newTool : t);
    }

    updateAgent({ tools: newTools });
    setEditingToolId(null);
    setToolForm({});
  };

  const handleDeleteTool = (id: string) => {
    const newTools = agent.tools.filter(t => t.id !== id);
    updateAgent({ tools: newTools });
  };

  const updateToolForm = (updates: Partial<Tool>) => {
    setToolForm(prev => ({ ...prev, ...updates }));
  };

  const updateToolConfig = (updates: any) => {
    setToolForm(prev => ({
      ...prev,
      config: { ...prev.config, ...updates }
    }));
  };

  // Render configuration fields based on tool type
  const renderConfigFields = () => {
    switch (toolForm.type) {
      case 'transfer_call':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transfer Phone Number</label>
              <input
                type="text"
                value={toolForm.config?.phoneNumber || ''}
                onChange={(e) => updateToolConfig({ phoneNumber: e.target.value })}
                placeholder="+1 234 567 8900"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">The destination number to forward the call to.</p>
            </div>
          </div>
        );
      case 'get_calendar':
      case 'book_calendar':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Calendar Provider</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-1 focus:ring-blue-500 outline-none">
                <option>Google Calendar</option>
                <option>Cal.com</option>
                <option>Calendly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Key / Auth Token</label>
              <input
                type="password"
                value={toolForm.config?.apiKey || ''}
                onChange={(e) => updateToolConfig({ apiKey: e.target.value })}
                placeholder="Enter API Key"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            {toolForm.type === 'book_calendar' && (
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Calendar ID / Slug</label>
                  <input
                    type="text"
                    value={toolForm.config?.calendarId || ''}
                    onChange={(e) => updateToolConfig({ calendarId: e.target.value })}
                    placeholder="primary or user/event-type"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                  />
               </div>
            )}
          </div>
        );
      case 'custom':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                <select
                  value={toolForm.config?.method || 'POST'}
                  onChange={(e) => updateToolConfig({ method: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-1 focus:ring-blue-500 outline-none"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="text"
                  value={toolForm.config?.url || ''}
                  onChange={(e) => updateToolConfig({ url: e.target.value })}
                  placeholder="https://api.example.com/v1/resource"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Headers (JSON)</label>
              <textarea
                rows={2}
                value={toolForm.config?.headers || ''}
                onChange={(e) => updateToolConfig({ headers: e.target.value })}
                placeholder='{"Authorization": "Bearer token"}'
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-xs focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payload Schema (JSON)</label>
              <textarea
                rows={3}
                value={toolForm.config?.payload || ''}
                onChange={(e) => updateToolConfig({ payload: e.target.value })}
                placeholder='{"type": "object", "properties": { ... }}'
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-xs focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-300">
      
      {/* Intro */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            Function Tools for LLM Models 
            <a href="#" className="text-blue-600 text-xs font-normal underline flex items-center">See examples <ExternalLink size={10} className="ml-0.5"/></a>
        </h3>
        <p className="text-sm text-gray-600 mt-2 max-w-3xl">
          Connect external tools or APIs that your language model can call during conversations. 
          This allows the LLM to retrieve real-time data, perform calculations, or trigger actions dynamically.
        </p>
      </div>

      {/* Add Tool Section */}
      {!editingToolId && (
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <label className="block text-sm font-bold text-gray-900 mb-2">Choose functions</label>
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <select
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value as ToolType)}
                        className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                        {TOOL_TEMPLATES.map(t => (
                            <option key={t.type} value={t.type}>{t.label}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
                <button 
                    onClick={handleAddToolStart}
                    className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Plus size={18} /> Add function
                </button>
            </div>
        </div>
      )}

      {/* Editing Area */}
      {editingToolId && (
        <div className="bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden ring-1 ring-blue-500">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex justify-between items-center">
                <h4 className="font-bold text-blue-900 flex items-center gap-2">
                    <Settings2 size={18} />
                    {editingToolId === 'NEW' ? 'Configure New Tool' : 'Edit Tool Configuration'}
                </h4>
                <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-white border border-blue-200 rounded text-blue-700 uppercase font-bold tracking-wider">
                        {TOOL_TEMPLATES.find(t => t.type === toolForm.type)?.label}
                    </span>
                </div>
            </div>
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Function Name</label>
                        <input
                            type="text"
                            value={toolForm.name || ''}
                            onChange={(e) => updateToolForm({ name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                            placeholder="e.g. transferCall"
                        />
                        <p className="text-xs text-gray-500 mt-1">The name the LLM uses to call this function.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                            type="text"
                            value={toolForm.description || ''}
                            onChange={(e) => updateToolForm({ description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                            placeholder="Briefly describe what this tool does..."
                        />
                    </div>
                </div>
                
                <div className="border-t border-gray-100 pt-6">
                    <h5 className="text-sm font-bold text-gray-900 mb-4">Configuration</h5>
                    {renderConfigFields()}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button 
                        onClick={() => { setEditingToolId(null); setToolForm({}); }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 text-sm font-medium hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSaveTool}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                    >
                        Save Function
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Tools List */}
      <div className="space-y-4">
        {agent.tools && agent.tools.length > 0 && !editingToolId && (
             <h4 className="text-sm font-bold text-gray-900">Active Functions</h4>
        )}
        
        {agent.tools && agent.tools.map(tool => {
            const template = TOOL_TEMPLATES.find(t => t.type === tool.type);
            const Icon = template?.icon || Code;

            return (
                <div key={tool.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-start justify-between group hover:border-blue-300 transition-colors">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <Icon size={20} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="font-bold text-gray-900">{tool.name}</h4>
                                <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded border border-gray-200 uppercase tracking-wide">
                                    {template?.label || 'Custom'}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                            {/* Snippet of config */}
                            <div className="mt-3 text-xs text-gray-400 font-mono bg-gray-50 p-2 rounded inline-block">
                                {tool.type === 'transfer_call' && `To: ${tool.config?.phoneNumber}`}
                                {(tool.type === 'get_calendar' || tool.type === 'book_calendar') && `API: ${tool.config?.apiKey ? '********' : 'Not set'}`}
                                {tool.type === 'custom' && `${tool.config?.method} ${tool.config?.url}`}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => handleEditToolStart(tool)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Edit"
                        >
                            <Edit2 size={16} />
                        </button>
                        <button 
                            onClick={() => handleDeleteTool(tool.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            );
        })}

        {(!agent.tools || agent.tools.length === 0) && !editingToolId && (
            <div className="text-center py-10 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500 text-sm">No functions added yet.</p>
                <p className="text-gray-400 text-xs mt-1">Add a function to let your agent interact with the world.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ToolsTab;
