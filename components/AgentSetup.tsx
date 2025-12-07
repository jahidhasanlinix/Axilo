
import React, { useState } from 'react';
import { Agent, Tab, ChatMessage, View, PhoneNumber } from '../types';
import { 
  Search, 
  Plus, 
  Upload, 
  Copy, 
  Share2, 
  PhoneIncoming, 
  PhoneOutgoing, 
  ExternalLink, 
  Wand2, 
  Play,
  MessageSquare,
  Mic,
  X,
  Bot,
  FilePlus2,
  Settings,
  ChevronDown,
  Info,
  PlusCircle,
  Volume2,
  Globe,
  User,
  ShoppingCart,
  Calendar,
  Bell,
  Building,
  Truck,
  FileText,
  Check,
  MoreVertical
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import AudioTab from './AudioTab';
import EngineTab from './EngineTab';
import CallTab from './CallTab';
import ToolsTab from './ToolsTab';
import AnalyticsTab from './AnalyticsTab';
import PlaceCallModal from './agent-setup/PlaceCallModal';
import InboundAgentModal from './agent-setup/InboundAgentModal';
import { PREBUILT_AGENTS } from '../data/prebuiltAgents';

interface AgentSetupProps {
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
  onNavigate?: (view: View) => void;
  phoneNumbers?: PhoneNumber[];
  onUpdatePhoneNumber?: (numberId: string, agentId: string) => void;
}

const LLM_PROVIDERS: Record<string, string[]> = {
  'Google': ['gemini-2.5-flash', 'gemini-1.5-pro', 'gemini-1.0-pro'],
  'OpenAI': ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo', 'gpt-4o-mini'],
  'Azure': ['gpt-4.1-mini cluster', 'gpt-4', 'gpt-35-turbo'],
  'Anthropic': ['claude-3-5-sonnet', 'claude-3-opus', 'claude-3-haiku'],
  'Groq': ['llama3-70b', 'mixtral-8x7b']
};

const KNOWLEDGE_BASES = ['Company Policies PDF', 'Product Manual v2', 'Sales Script 2025', 'Support FAQs'];

// Helper defaults for new agents
const DEFAULT_CONFIGS = {
    transcriberConfig: {
        provider: 'Deepgram',
        model: 'nova-3',
        keywords: ''
    },
    voiceConfig: {
        provider: 'Elevenlabs',
        model: 'eleven_turbo_v2_5',
        bufferSize: 250,
        speedRate: 1.0,
        similarityBoost: 0.75,
        stability: 0.5,
        styleExaggeration: 0.0
    },
    engineConfig: {
        preciseTranscript: true,
        interruptWords: 2,
        responseRate: 'Normal',
        endpointing: 500,
        linearDelay: 0,
        checkUserOnline: true,
        userOnlineMessage: 'Are you still there?',
        invokeMessageAfter: 10
    },
    callConfig: {
        telephonyProvider: 'Plivo',
        dtmfEnabled: false,
        voicemailDetection: true,
        voicemailTimeout: 2.5,
        hangupOnSilence: true,
        silenceTimeout: 10,
        hangupOnPrompt: false,
        hangupPrompt: '',
        hangupMessage: 'Goodbye.',
        maxCallDuration: 600
    },
    analyticsConfig: {
        summarization: true,
        extraction: false,
        extractionSchema: '',
        customAnalytics: [],
        webhookUrl: ''
    },
    tools: []
}

const AgentSetup: React.FC<AgentSetupProps> = ({ agents, setAgents, onNavigate, phoneNumbers = [], onUpdatePhoneNumber }) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || '');
  const [activeTab, setActiveTab] = useState<Tab>(Tab.AGENT);
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // New Agent Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buildMode, setBuildMode] = useState<'auto' | 'prebuilt'>('auto');
  const [isBuilding, setIsBuilding] = useState(false);
  
  // Edit Agent Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editAgentInput, setEditAgentInput] = useState('');
  
  // Import Agent Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importData, setImportData] = useState({ id: '', name: '' });

  // Place Call Modal State
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  // Inbound Agent Modal State
  const [isInboundModalOpen, setIsInboundModalOpen] = useState(false);
  
  // Auto Build Form State
  const [formData, setFormData] = useState({
    name: '',
    languages: [] as string[],
    objective: '',
    nextSteps: '',
    context: '',
    transcript: ''
  });

  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  const updateAgent = (updates: Partial<Agent>) => {
    setAgents(prev => prev.map(agent => 
      agent.id === selectedAgentId ? { ...agent, ...updates } : agent
    ));
  };

  const updateLLMConfig = (updates: Partial<Agent['llmConfig']>) => {
    if (!selectedAgent) return;
    updateAgent({
      llmConfig: { ...selectedAgent.llmConfig, ...updates }
    });
  };

  // Triggered from Edit Modal
  const handleModifyAgent = async () => {
    if (!selectedAgent?.prompt || !editAgentInput.trim()) return;
    setIsGenerating(true);
    try {
      const refined = await geminiService.modifyPrompt(selectedAgent.prompt, editAgentInput);
      updateAgent({ prompt: refined });
      setIsEditModalOpen(false);
      setEditAgentInput('');
    } catch (e) {
      alert("Failed to modify prompt");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVoicePreview = async () => {
    if (!selectedAgent?.welcomeMessage) return;
    await geminiService.previewVoice(selectedAgent.welcomeMessage, selectedAgent.voice);
  };

  const handleChat = async () => {
    if (!chatInput.trim() || !selectedAgent) return;
    const newMessage: ChatMessage = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, newMessage]);
    setChatInput("");
    setIsChatting(true);

    const response = await geminiService.chatWithAgent(
      selectedAgent.prompt, 
      [...chatMessages, newMessage], 
      newMessage.text
    );

    setChatMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsChatting(false);
  };

  const handleCopyId = () => {
    if (selectedAgent) {
        navigator.clipboard.writeText(selectedAgent.id);
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // Helper to calculate estimated cost dynamically
  const calculateEstimatedCost = (agent: Agent) => {
    let baseCost = 0.05; // Platform base
    
    // LLM Cost variance
    if (agent.llmConfig.model.includes('gpt-4')) baseCost += 0.05;
    else if (agent.llmConfig.model.includes('gemini-1.5-pro')) baseCost += 0.04;
    else if (agent.llmConfig.model.includes('claude-3-opus')) baseCost += 0.06;
    else baseCost += 0.01; // Flash/Haiku/Mini

    // Voice Cost variance
    if (agent.voiceConfig.provider === 'Elevenlabs') baseCost += 0.03;
    else if (agent.voiceConfig.provider === 'PlayHT') baseCost += 0.025;
    else baseCost += 0.01; // Deepgram/Cartesia

    // Telephony
    if (agent.callConfig.telephonyProvider === 'Twilio') baseCost += 0.015;
    else baseCost += 0.01;

    return baseCost.toFixed(3);
  };

  // --- Modal Handlers ---

  const toggleLanguage = (lang: string) => {
    setFormData(prev => {
      const exists = prev.languages.includes(lang);
      if (exists) return { ...prev, languages: prev.languages.filter(l => l !== lang) };
      return { ...prev, languages: [...prev.languages, lang] };
    });
  };

  const createBaseAgent = (overrides: Partial<Agent>): Agent => {
      return {
          id: `ag_${Date.now()}`,
          name: 'New Agent',
          status: 'draft',
          welcomeMessage: 'Hello',
          prompt: 'You are a helpful assistant',
          voice: 'Kore',
          language: 'English',
          costPerMin: 0.05,
          llmConfig: { provider: 'Google', model: 'gemini-2.5-flash', maxTokens: 450, temperature: 0.2 },
          knowledgeBases: [],
          ...DEFAULT_CONFIGS,
          ...overrides
      }
  }

  const handleCreateFromScratch = () => {
    const newAgent = createBaseAgent({ name: formData.name || 'New Agent' });
    setAgents(prev => [...prev, newAgent]);
    setSelectedAgentId(newAgent.id);
    setIsModalOpen(false);
    resetForm();
  };

  const handleCreatePrebuilt = (agentTemplate: typeof PREBUILT_AGENTS[0]) => {
      const newAgent = createBaseAgent({
          name: agentTemplate.name,
          welcomeMessage: agentTemplate.welcomeMessage,
          prompt: agentTemplate.prompt,
          costPerMin: 0.098
      });
      setAgents(prev => [...prev, newAgent]);
      setSelectedAgentId(newAgent.id);
      setIsModalOpen(false);
      resetForm();
  };

  const handleAutoBuild = async () => {
    if (!formData.name || !formData.objective) {
      alert("Please fill in the Name and Objective fields.");
      return;
    }
    
    setIsBuilding(true);
    try {
      const result = await geminiService.autoBuildAgent({
        name: formData.name,
        languages: formData.languages.length ? formData.languages : ['English'],
        objective: formData.objective,
        nextSteps: formData.nextSteps,
        context: formData.context,
        transcript: formData.transcript
      });

      const newAgent = createBaseAgent({
        name: result.name,
        welcomeMessage: result.welcomeMessage,
        prompt: result.prompt,
        language: formData.languages[0] || 'English',
        costPerMin: 0.098
      });

      setAgents(prev => [...prev, newAgent]);
      setSelectedAgentId(newAgent.id);
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      alert("Failed to generate agent. Please try again.");
    } finally {
      setIsBuilding(false);
    }
  };

  const handleImportAgent = () => {
    if (!importData.id) {
        alert("Please enter an Agent ID");
        return;
    }
    const newAgent = createBaseAgent({
        id: importData.id,
        name: importData.name || 'Imported Agent',
        status: 'draft',
        costPerMin: 0.08
    });

    setAgents(prev => [...prev, newAgent]);
    setSelectedAgentId(newAgent.id);
    setIsImportModalOpen(false);
    setImportData({ id: '', name: '' });
  };

  const handlePlaceCall = (phoneNumber: string, provider: string) => {
      alert(`Initiating call to ${phoneNumber} via ${provider}... (Simulation)`);
  };

  const handleSaveInboundNumber = (phoneNumberId: string) => {
      if (selectedAgent && onUpdatePhoneNumber) {
          onUpdatePhoneNumber(phoneNumberId, selectedAgent.id);
      }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      languages: [],
      objective: '',
      nextSteps: '',
      context: '',
      transcript: ''
    });
    setBuildMode('auto');
  };

  // --- Renders ---

  const renderEditAgentModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative">
            <button 
                onClick={() => setIsEditModalOpen(false)} 
                className="absolute right-6 top-6 text-gray-400 hover:text-gray-600"
            >
                <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Edit Your Agent</h2>
            <p className="text-gray-500 mb-6">Describe the changes you want to make to your agent</p>
            
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Describe Your Changes *</label>
                <div className="relative">
                    <textarea 
                        rows={4}
                        value={editAgentInput}
                        onChange={(e) => setEditAgentInput(e.target.value)}
                        placeholder="Describe all the changes you want to make to your agent. Be specific about what should be added, removed, or modified..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    />
                    <div className="absolute right-3 bottom-3 flex gap-2">
                         <div className="bg-teal-100 text-teal-600 p-1.5 rounded-full">
                            <Wand2 size={16} />
                         </div>
                    </div>
                </div>
            </div>
            
            <div className="flex justify-end gap-3">
                <button 
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleModifyAgent}
                    disabled={isGenerating || !editAgentInput.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                    {isGenerating ? 'Generating...' : 'Re-generate Prompt'}
                </button>
            </div>
        </div>
    </div>
  );

  const renderNewAgentModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Select your use case and let AI build your agent</h2>
            <p className="text-sm text-gray-500 mt-1">You can always modify & edit it later.</p>
          </div>
          <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 pb-0">
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setBuildMode('auto')}
              className={`flex-1 py-4 px-4 rounded-lg border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                buildMode === 'auto' 
                  ? 'border-blue-600 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-blue-200 text-gray-600'
              }`}
            >
              <Settings size={24} className={buildMode === 'auto' ? 'text-blue-600' : 'text-gray-400'} />
              <span className="font-semibold">Auto Build Agent</span>
            </button>
            <button 
              onClick={() => setBuildMode('prebuilt')}
              className={`flex-1 py-4 px-4 rounded-lg border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                buildMode === 'prebuilt' 
                  ? 'border-blue-600 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-blue-200 text-gray-600'
              }`}
            >
              <FilePlus2 size={24} className={buildMode === 'prebuilt' ? 'text-blue-600' : 'text-gray-400'} />
              <span className="font-semibold">Pre built Agents</span>
            </button>
          </div>
        </div>

        <div className="p-6 flex-1">
          {buildMode === 'auto' ? (
            <div className="space-y-5">
              <p className="text-sm text-gray-600">Tell us about your ideal agent and we'll help you build it step by step.</p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name of Agent *</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter agent name" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Languages *</label>
                <div className="flex gap-4">
                  {['English', 'Hindi'].map(lang => (
                    <label key={lang} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.languages.includes(lang)}
                        onChange={() => toggleLanguage(lang)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                      />
                      <span className="text-sm text-gray-700">{lang}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">What do you want to achieve in this call? *</label>
                <textarea 
                  rows={3}
                  value={formData.objective}
                  onChange={(e) => setFormData({...formData, objective: e.target.value})}
                  placeholder="Be descriptive as you would to a human who you are asking to lead the call..." 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ideal Next Steps after this call *</label>
                <textarea 
                  rows={2}
                  value={formData.nextSteps}
                  onChange={(e) => setFormData({...formData, nextSteps: e.target.value})}
                  placeholder="Describe what should happen after the call is completed..." 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">FAQs / Business Documents / Any information</label>
                <textarea 
                  rows={2}
                  value={formData.context}
                  onChange={(e) => setFormData({...formData, context: e.target.value})}
                  placeholder="Add any relevant FAQs, business documents, or additional information..." 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sample Transcript</label>
                <textarea 
                  rows={2}
                  value={formData.transcript}
                  onChange={(e) => setFormData({...formData, transcript: e.target.value})}
                  placeholder="Provide a sample conversation transcript to help guide the agent..." 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PREBUILT_AGENTS.map((agent) => (
                    <div 
                        key={agent.id}
                        onClick={() => handleCreatePrebuilt(agent)}
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md cursor-pointer transition-all bg-white group"
                    >
                        <div className="flex items-start gap-3">
                            <div className="text-gray-400 group-hover:text-blue-600 mt-1">
                                <agent.icon size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 text-sm mb-1">{agent.name}</h3>
                                <p className="text-xs text-gray-500 leading-snug">{agent.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          )}
        </div>

        {buildMode === 'auto' && (
            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            <div className="flex items-center justify-end gap-3 mb-4">
                <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
                >
                Cancel
                </button>
                <button 
                onClick={handleAutoBuild}
                disabled={isBuilding}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                {isBuilding ? (
                    <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Building Agent...
                    </>
                ) : (
                    'Generate Agent'
                )}
                </button>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm">
                <span className="text-gray-500">Or</span>
                <button 
                onClick={handleCreateFromScratch}
                className="text-blue-600 font-medium hover:underline"
                >
                I want to create an agent from scratch
                </button>
            </div>
            </div>
        )}
        
        {buildMode === 'prebuilt' && (
            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-center">
                 <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Or</span>
                    <button 
                    onClick={handleCreateFromScratch}
                    className="text-blue-600 font-medium hover:underline"
                    >
                    I want to create an agent from scratch
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );

  const renderImportModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Import agent</h3>
                    <p className="text-sm text-gray-500">Enter <span className="bg-gray-100 px-1 rounded font-mono text-xs">agent_id</span> to import it</p>
                </div>
                <button onClick={() => setIsImportModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                </button>
            </div>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Agent ID</label>
                    <input 
                        type="text" 
                        value={importData.id}
                        onChange={(e) => setImportData({...importData, id: e.target.value})}
                        placeholder="agent_id to be imported"
                        className="w-full px-3 py-2 border border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        autoFocus
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Agent Name</label>
                    <input 
                        type="text" 
                        value={importData.name}
                        onChange={(e) => setImportData({...importData, name: e.target.value})}
                        placeholder="A name for the imported agent"
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <button 
                    onClick={handleImportAgent}
                    className="bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Import this agent
                </button>
            </div>
        </div>
    </div>
  );

  if (!selectedAgent && agents.length === 0 && !isModalOpen && !isImportModalOpen) {
      return (
          <div className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-500 mb-4">You have no agents yet.</p>
              <div className="flex gap-2">
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                    Create your first agent
                </button>
                <button 
                    onClick={() => setIsImportModalOpen(true)}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md"
                >
                    Import Agent
                </button>
              </div>
              {isModalOpen && renderNewAgentModal()}
              {isImportModalOpen && renderImportModal()}
          </div>
      )
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 h-full items-stretch">
        {/* Left Column: Agent List */}
        <div className="w-full lg:w-80 flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm shrink-0 h-[300px] lg:h-auto">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Your Agents</h2>
            <div className="flex gap-2 mb-4">
              <button 
                onClick={() => setIsImportModalOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Upload size={16} /> Import
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Plus size={16} /> New Agent
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search agents..." 
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {agents.map(agent => (
              <div 
                key={agent.id}
                onClick={() => setSelectedAgentId(agent.id)}
                className={`px-3 py-3 cursor-pointer rounded-md border transition-all ${
                  selectedAgentId === agent.id 
                    ? 'bg-blue-50 border-blue-200 shadow-sm' 
                    : 'bg-white border-transparent hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-semibold text-sm ${selectedAgentId === agent.id ? 'text-blue-800' : 'text-gray-900'}`}>{agent.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                    <span className="font-mono bg-gray-100 px-1 rounded">{agent.id.substring(0, 8)}...</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Column: Agent Editor */}
        <div className="flex-1 flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden min-h-[500px]">
          {/* Agent Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col xl:flex-row justify-between items-start mb-6 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedAgent?.name}</h1>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleCopyId}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-200 text-sm font-medium text-gray-700 transition-colors"
                  >
                     <Copy size={14} /> 
                     {copiedId ? 'Copied!' : 'Agent ID'}
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-gray-50 rounded-md border border-gray-200 text-sm font-medium text-gray-700 transition-colors">
                     <Share2 size={14} /> Share
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button 
                    onClick={() => setIsCallModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
                >
                  <PhoneOutgoing size={18} /> Get call from agent
                </button>
                <button 
                    onClick={() => setIsInboundModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap"
                >
                  <PhoneIncoming size={18} /> Set inbound agent
                </button>
              </div>
            </div>

            {/* Cost Bar */}
            {selectedAgent && (
                <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                            <Info size={14} className="text-gray-400" />
                            <span>Cost per min: <span className="font-bold text-gray-900">~ ${calculateEstimatedCost(selectedAgent)}</span></span>
                        </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-2.5 w-full flex rounded-full overflow-hidden bg-gray-200 mb-3">
                        <div className="w-[15%] bg-teal-500" title="Transcriber"></div>
                        <div className="w-[35%] bg-red-400" title="LLM"></div>
                        <div className="w-[20%] bg-gray-700" title="Voice"></div>
                        <div className="w-[10%] bg-yellow-400" title="Telephony"></div>
                        <div className="w-[20%] bg-blue-500" title="Platform"></div>
                    </div>
                    
                    {/* Legend */}
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span> Transcriber
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span> LLM
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-gray-700"></span> Voice
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span> Telephony
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Platform
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-gray-200 overflow-x-auto pb-1">
              {Object.values(Tab).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Editor Content */}
          <div className="p-6 flex-1 overflow-y-auto">
            {activeTab === Tab.AGENT && selectedAgent && (
              <div className="space-y-6 max-w-3xl animate-in fade-in duration-300">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Agent Welcome Message
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={selectedAgent.welcomeMessage}
                      onChange={(e) => updateAgent({ welcomeMessage: e.target.value })}
                      className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button 
                        onClick={handleVoicePreview}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                        title="Preview Voice"
                    >
                      <Play size={18} />
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    This will be the initial message from the agent. You can use variables here using {"{variable_name}"}
                  </p>
                </div>

                <div className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      Agent Prompt
                    </label>
                    <button 
                      onClick={() => setIsEditModalOpen(true)}
                      disabled={isGenerating}
                      className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <Wand2 size={12} />
                      AI Edit
                    </button>
                  </div>
                  <textarea
                    value={selectedAgent.prompt}
                    onChange={(e) => updateAgent({ prompt: e.target.value })}
                    rows={12}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm leading-relaxed"
                  />
                  <div className="mt-2 flex flex-col sm:flex-row justify-between items-start text-xs text-gray-500 gap-2">
                     <p className="flex-1">
                        You can define variables in the prompt using <span className="font-mono bg-gray-100 px-1 py-0.5 rounded border border-gray-200 text-gray-600">{`{variable_name}`}</span>. 
                        Use <span className="font-mono bg-gray-100 px-1 py-0.5 rounded border border-gray-200 text-gray-600">@</span> to mention function calling.
                     </p>
                     <div className="flex gap-2">
                        <span className="bg-gray-100 px-2 py-1 rounded border border-gray-200">{"{name}"}</span>
                        <span className="bg-gray-100 px-2 py-1 rounded border border-gray-200">{"{email}"}</span>
                        <span className="bg-gray-100 px-2 py-1 rounded border border-gray-200">{"{phone}"}</span>
                     </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* New Modular Tabs */}
            {activeTab === Tab.AUDIO && selectedAgent && (
                <AudioTab agent={selectedAgent} updateAgent={updateAgent} />
            )}
            
            {activeTab === Tab.ENGINE && selectedAgent && (
                <EngineTab agent={selectedAgent} updateAgent={updateAgent} />
            )}
            
            {activeTab === Tab.CALL && selectedAgent && (
                <CallTab agent={selectedAgent} updateAgent={updateAgent} />
            )}

            {activeTab === Tab.TOOLS && selectedAgent && (
                <ToolsTab agent={selectedAgent} updateAgent={updateAgent} />
            )}

            {activeTab === Tab.ANALYTICS && selectedAgent && (
                <AnalyticsTab agent={selectedAgent} updateAgent={updateAgent} />
            )}
            
            {activeTab === Tab.LLM && selectedAgent && (
                <div className="space-y-8 max-w-4xl animate-in fade-in duration-300">
                    <div className="space-y-1">
                        <label className="block text-sm font-bold text-gray-900">Choose LLM model</label>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <select 
                                        value={selectedAgent.llmConfig?.provider || 'Google'}
                                        onChange={(e) => updateLLMConfig({ provider: e.target.value, model: LLM_PROVIDERS[e.target.value][0] })}
                                        className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {Object.keys(LLM_PROVIDERS).map(provider => (
                                            <option key={provider} value={provider}>{provider}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="relative">
                                    <select 
                                        value={selectedAgent.llmConfig?.model || 'gemini-2.5-flash'}
                                        onChange={(e) => updateLLMConfig({ model: e.target.value })}
                                        className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {LLM_PROVIDERS[selectedAgent.llmConfig?.provider || 'Google']?.map(model => (
                                            <option key={model} value={model}>{model}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-bold text-gray-900">Tokens generated on each LLM output</label>
                                <span className="text-sm text-gray-500">{selectedAgent.llmConfig?.maxTokens || 450}</span>
                            </div>
                            <input 
                                type="range" 
                                min="10" 
                                max="2048" 
                                value={selectedAgent.llmConfig?.maxTokens || 450}
                                onChange={(e) => updateLLMConfig({ maxTokens: parseInt(e.target.value) })}
                                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            <p className="mt-2 text-xs text-gray-500 leading-tight">
                                Increasing tokens enables longer responses to be queued for speech generation but increases latency
                            </p>
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-bold text-gray-900">Temperature</label>
                                <span className="text-sm text-gray-500">{selectedAgent.llmConfig?.temperature || 0.2}</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="1" 
                                step="0.1"
                                value={selectedAgent.llmConfig?.temperature || 0.2}
                                onChange={(e) => updateLLMConfig({ temperature: parseFloat(e.target.value) })}
                                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            <p className="mt-2 text-xs text-gray-500 leading-tight">
                                Increasing temperature enables heightened creativity, but increases chance of deviation from prompt
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Add knowledge base (Multi-select)</label>
                        <div className="relative">
                            <select 
                                multiple
                                className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                            >
                                {KNOWLEDGE_BASES.map(kb => (
                                    <option key={kb} value={kb} className="py-1">{kb}</option>
                                ))}
                            </select>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple knowledge bases.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                            Add FAQs & Guardrails 
                            <a href="#" className="text-blue-600 text-xs font-normal underline">Learn more <ExternalLink size={10} className="inline"/></a>
                        </label>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                            <PlusCircle size={16} /> Add a new block for FAQs & Guardrails
                        </button>
                    </div>
                </div>
            )}

            {activeTab !== Tab.AGENT && activeTab !== Tab.LLM && activeTab !== Tab.AUDIO && activeTab !== Tab.ENGINE && activeTab !== Tab.CALL && activeTab !== Tab.TOOLS && activeTab !== Tab.ANALYTICS && (
              <div className="flex items-center justify-center h-full text-gray-400">
                Placeholder for {activeTab} settings
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Actions & Chat */}
        <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0">
          {/* Actions Card */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <button 
              onClick={() => onNavigate && onNavigate('call-history')}
              className="w-full flex items-center justify-between px-3 py-2 mb-4 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              See all call logs <ExternalLink size={14} />
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full mb-3 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 shadow-sm transition-colors"
            >
              <Plus size={18} /> Create Agent
            </button>
            <div className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
                <span className="rotate-180 inline-block">↺</span> Last updated a few seconds ago
            </div>
          </div>

          {/* Chat / Test Card */}
          <div className="flex-1 bg-white flex flex-col rounded-lg border border-gray-200 shadow-sm overflow-hidden h-[500px] lg:h-auto">
            <div className="p-3 border-b border-gray-100 bg-gray-50 text-center">
              <button className="w-full py-2 bg-white border border-gray-200 text-blue-600 font-medium rounded text-sm shadow-sm">
                Chat with agent
              </button>
              <p className="mt-2 text-xs text-gray-500 flex items-center justify-center gap-1">
                <span className="text-yellow-500">💡</span> Chat is the fastest way to test and refine the agent.
              </p>
            </div>
            
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {chatMessages.length === 0 && (
                <div className="text-center text-gray-400 text-sm mt-10">
                  Start typing to test your agent...
                </div>
              )}
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatting && (
                <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-bl-none">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                      </div>
                    </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-200">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Type a message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                />
                <button 
                  onClick={handleChat}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                >
                  <MessageSquare size={16} />
                </button>
              </div>
            </div>

            {/* Web Call Test Button */}
            <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
              <button 
                onClick={handleVoicePreview}
                className="w-full py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                Test via web call <Mic size={14} className="text-gray-400"/>
              </button>
              <p className="mt-1 text-xs text-gray-400">
                Test your agent with voice calls (TTS Preview)
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Modals */}
      {isModalOpen && renderNewAgentModal()}
      {isImportModalOpen && renderImportModal()}
      {isEditModalOpen && renderEditAgentModal()}
      {isCallModalOpen && (
          <PlaceCallModal 
            onClose={() => setIsCallModalOpen(false)}
            onCall={handlePlaceCall}
            onBuyNumberClick={() => {
                setIsCallModalOpen(false);
                if (onNavigate) onNavigate('my-numbers');
            }}
          />
      )}
      {isInboundModalOpen && selectedAgent && (
          <InboundAgentModal 
            agent={selectedAgent}
            phoneNumbers={phoneNumbers || []}
            onClose={() => setIsInboundModalOpen(false)}
            onSave={handleSaveInboundNumber}
            onBuyNumberClick={() => {
                setIsInboundModalOpen(false);
                if (onNavigate) onNavigate('my-numbers');
            }}
          />
      )}
    </>
  );
};

export default AgentSetup;
