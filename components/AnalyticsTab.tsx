
import React, { useState } from 'react';
import { Agent, AnalyticsConfig, CustomAnalyticsItem } from '../types';
import { Plus, Trash2, ExternalLink } from 'lucide-react';

interface AnalyticsTabProps {
  agent: Agent;
  updateAgent: (updates: Partial<Agent>) => void;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ agent, updateAgent }) => {
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [newCustomItem, setNewCustomItem] = useState({ name: '', prompt: '' });

  const updateAnalyticsConfig = (updates: Partial<AnalyticsConfig>) => {
    updateAgent({
      analyticsConfig: { ...agent.analyticsConfig, ...updates }
    });
  };

  const handleAddCustomAnalytic = () => {
    if (!newCustomItem.name || !newCustomItem.prompt) return;
    
    const newItem: CustomAnalyticsItem = {
      id: `ca_${Date.now()}`,
      name: newCustomItem.name,
      prompt: newCustomItem.prompt
    };

    updateAnalyticsConfig({
      customAnalytics: [...agent.analyticsConfig.customAnalytics, newItem]
    });

    setNewCustomItem({ name: '', prompt: '' });
    setIsAddingCustom(false);
  };

  const handleDeleteCustomAnalytic = (id: string) => {
    updateAnalyticsConfig({
      customAnalytics: agent.analyticsConfig.customAnalytics.filter(item => item.id !== id)
    });
  };

  return (
    <div className="space-y-10 max-w-4xl animate-in fade-in duration-300">
      
      {/* Post call tasks */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Post call tasks</h3>
        <p className="text-sm text-gray-500 mb-6">Choose tasks to get executed after the agent conversation is complete</p>
        
        {/* Summarization */}
        <div className="flex items-center justify-between gap-12 mb-6">
            <div className="flex-1">
                <h4 className="text-sm font-bold text-gray-900">Summarization</h4>
                <p className="text-xs text-gray-500 mt-1">Generate a summary of the conversation automatically.</p>
            </div>
            <div className="relative inline-block w-10 h-6 align-middle select-none transition duration-200 ease-in flex-shrink-0">
                <input 
                    type="checkbox" 
                    name="summary-toggle" 
                    id="summary-toggle" 
                    checked={agent.analyticsConfig?.summarization}
                    onChange={(e) => updateAnalyticsConfig({ summarization: e.target.checked })}
                    className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 ease-in-out"
                    style={{ 
                        right: agent.analyticsConfig?.summarization ? '2px' : 'auto', 
                        left: agent.analyticsConfig?.summarization ? 'auto' : '2px',
                        top: '4px',
                        borderColor: 'transparent'
                    }}
                />
                <label 
                    htmlFor="summary-toggle" 
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${agent.analyticsConfig?.summarization ? 'bg-blue-600' : 'bg-gray-300'}`}
                ></label>
            </div>
        </div>

        {/* Extraction */}
        <div className="flex items-start justify-between gap-12">
            <div className="flex-1">
                <h4 className="text-sm font-bold text-gray-900">Extraction</h4>
                <p className="text-xs text-gray-500 mt-1">Extract structured information from the conversation according to a custom prompt provided</p>
            </div>
            <div className="flex gap-4 flex-1">
                <div className="relative inline-block w-10 h-6 align-middle select-none transition duration-200 ease-in flex-shrink-0 mt-1">
                    <input 
                        type="checkbox" 
                        name="extraction-toggle" 
                        id="extraction-toggle" 
                        checked={agent.analyticsConfig?.extraction}
                        onChange={(e) => updateAnalyticsConfig({ extraction: e.target.checked })}
                        className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 ease-in-out"
                        style={{ 
                            right: agent.analyticsConfig?.extraction ? '2px' : 'auto', 
                            left: agent.analyticsConfig?.extraction ? 'auto' : '2px',
                            top: '4px',
                            borderColor: 'transparent'
                        }}
                    />
                    <label 
                        htmlFor="extraction-toggle" 
                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${agent.analyticsConfig?.extraction ? 'bg-blue-600' : 'bg-gray-300'}`}
                    ></label>
                </div>
                <div className="flex-1">
                    <textarea 
                        rows={5}
                        value={agent.analyticsConfig?.extractionSchema}
                        onChange={(e) => updateAnalyticsConfig({ extractionSchema: e.target.value })}
                        disabled={!agent.analyticsConfig?.extraction}
                        placeholder="user_name : Yield the name of the user..."
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none resize-none font-mono ${
                          !agent.analyticsConfig?.extraction ? 'bg-gray-50 text-gray-400' : 'bg-white text-gray-700 focus:ring-2 focus:ring-blue-500'
                        }`}
                    />
                </div>
            </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Custom Analytics */}
      <div>
         <h3 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
            Custom Analytics 
            <span className="text-xs font-normal text-gray-500">Post call tasks to extract data from the call</span>
         </h3>
         
         <div className="space-y-3 mt-4">
             {agent.analyticsConfig?.customAnalytics.map(item => (
                 <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md">
                     <div className="flex-1">
                         <div className="font-bold text-sm text-gray-900">{item.name}</div>
                         <div className="text-xs text-gray-500 truncate max-w-lg">{item.prompt}</div>
                     </div>
                     <button 
                        onClick={() => handleDeleteCustomAnalytic(item.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                     >
                         <Trash2 size={16} />
                     </button>
                 </div>
             ))}

             {isAddingCustom ? (
                 <div className="p-4 bg-gray-50 border border-blue-200 rounded-md space-y-3">
                     <input 
                        type="text" 
                        placeholder="Analytics Name (e.g., Customer Mood)"
                        value={newCustomItem.name}
                        onChange={(e) => setNewCustomItem({...newCustomItem, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                     />
                     <textarea 
                        rows={2}
                        placeholder="Prompt to extract this data (e.g., Was the customer happy, angry, or neutral?)"
                        value={newCustomItem.prompt}
                        onChange={(e) => setNewCustomItem({...newCustomItem, prompt: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                     />
                     <div className="flex justify-end gap-2">
                         <button 
                            onClick={() => setIsAddingCustom(false)}
                            className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded"
                         >
                             Cancel
                         </button>
                         <button 
                            onClick={handleAddCustomAnalytic}
                            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded"
                         >
                             Add
                         </button>
                     </div>
                 </div>
             ) : (
                <button 
                    onClick={() => setIsAddingCustom(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    <Plus size={16} /> Extract custom analytics
                </button>
             )}
         </div>
      </div>

      <hr className="border-gray-200" />

      {/* Webhook */}
      <div>
         <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1">
             Push all execution data to webhook 
             <a href="#" className="text-blue-600 text-xs font-normal flex items-center gap-0.5 underline">See all events <ExternalLink size={10} /></a>
         </h3>
         <p className="text-xs text-gray-500 mb-4">Automatically receive all execution data for this agent using webhook</p>
         
         <input 
            type="text"
            value={agent.analyticsConfig?.webhookUrl}
            onChange={(e) => updateAnalyticsConfig({ webhookUrl: e.target.value })}
            placeholder="Your webhook URL"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
         />
      </div>
    </div>
  );
};

export default AnalyticsTab;
