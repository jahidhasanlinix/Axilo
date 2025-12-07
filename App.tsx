
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import LandingPage from './components/LandingPage';
import AgentSetup from './components/AgentSetup';
import CallHistory from './components/CallHistory';
import MyNumbers from './components/MyNumbers';
import KnowledgeBase from './components/KnowledgeBase';
import Batches from './components/Batches';
import VoiceLab from './components/VoiceLab';
import Developers from './components/Developers';
import Providers from './components/Providers';
import Workflows from './components/Workflows';
import Campaigns from './components/Campaigns';
import AddFundsModal from './components/payments/AddFundsModal';
import SettingsModal from './components/settings/SettingsModal';
import { useAuth } from './contexts/AuthContext';
import { Agent, View, KnowledgeBaseItem, Batch, Voice, ApiKey, ConnectedProvider, Workflow, Campaign, TeamMember, PhoneNumber } from './types';

const MOCK_AGENTS: Agent[] = [
  {
    id: 'ag_12345',
    name: 'My New Agent',
    status: 'draft',
    welcomeMessage: 'Hello from Axilo. How can I help you today?',
    prompt: 'You are a helpful agent. You will help the customer with their queries and doubts. You will never speak more than 2 sentences. Keep your responses concise.',
    voice: 'Kore',
    language: 'English',
    costPerMin: 0.098,
    llmConfig: {
      provider: 'Google',
      model: 'gemini-2.5-flash',
      maxTokens: 450,
      temperature: 0.2
    },
    knowledgeBases: [],
    transcriberConfig: {
        provider: 'Deepgram',
        model: 'nova-3',
        keywords: 'Bruce:100'
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
        responseRate: 'Custom',
        endpointing: 150,
        linearDelay: 650,
        checkUserOnline: true,
        userOnlineMessage: 'Hey, are you still there?',
        invokeMessageAfter: 8
    },
    callConfig: {
        telephonyProvider: 'Plivo',
        dtmfEnabled: false,
        voicemailDetection: true,
        voicemailTimeout: 2.5,
        hangupOnSilence: true,
        silenceTimeout: 10,
        hangupOnPrompt: false,
        hangupPrompt: 'Determine if the conversation is complete.',
        hangupMessage: 'Call will now disconnect',
        maxCallDuration: 820
    },
    analyticsConfig: {
        summarization: true,
        extraction: false,
        extractionSchema: 'user_name : Yield the name of the user.\n\npayment_mode : If user is paying by cash, yield cash. If they are paying by card yield card. Else yield NA',
        customAnalytics: [],
        webhookUrl: ''
    },
    tools: []
  },
  {
      id: '3f694da8-6c02-41c6-b940-050651e5f662',
      name: 'Admissions Agent',
      status: 'active',
      welcomeMessage: 'Hello, Axilo University admissions.',
      prompt: 'You are an admissions officer.',
      voice: 'Sarah',
      language: 'English',
      costPerMin: 0.12,
      llmConfig: { provider: 'Azure', model: 'gpt-4', maxTokens: 200, temperature: 0.5 },
      knowledgeBases: [],
      transcriberConfig: { provider: 'Deepgram', model: 'nova-2', keywords: '' },
      voiceConfig: { provider: 'Elevenlabs', model: 'eleven_turbo_v2_5', bufferSize: 200, speedRate: 1.0, similarityBoost: 0.5, stability: 0.5, styleExaggeration: 0 },
      engineConfig: { preciseTranscript: true, interruptWords: 1, responseRate: 'Normal', endpointing: 500, linearDelay: 0, checkUserOnline: false, userOnlineMessage: '', invokeMessageAfter: 0 },
      callConfig: { telephonyProvider: 'Twilio', dtmfEnabled: true, voicemailDetection: false, voicemailTimeout: 0, hangupOnSilence: false, silenceTimeout: 0, hangupOnPrompt: true, hangupPrompt: 'Bye', hangupMessage: 'Bye', maxCallDuration: 600 },
      analyticsConfig: { summarization: true, extraction: true, extractionSchema: '', customAnalytics: [], webhookUrl: '' },
      tools: []
  }
];

const INITIAL_KB_ITEMS: KnowledgeBaseItem[] = [
    {
        id: 'rag_123456789',
        source: 'Company_Policy_v2.pdf',
        type: 'PDF',
        created: 'Dec 05, 2025, 10:30 AM',
        status: 'indexed'
    },
    {
        id: 'rag_987654321',
        source: 'https://axilo.ai/docs',
        type: 'URL',
        created: 'Dec 06, 2025, 02:15 PM',
        status: 'processing'
    }
];

const INITIAL_BATCHES: Batch[] = [
    {
        id: 'batch_101',
        agentId: 'ag_12345',
        fileName: 'leads_q4_2025.csv',
        validContacts: 150,
        totalContacts: 152,
        executionStatus: 'Completed',
        batchStatus: 'Active',
        workflow: 'Standard Call',
        createdAt: 'Dec 01, 2025'
    },
    {
        id: 'batch_102',
        agentId: 'ag_12345',
        fileName: 'follow_up_dec.csv',
        validContacts: 45,
        totalContacts: 50,
        executionStatus: 'Running',
        batchStatus: 'Active',
        workflow: 'Follow Up',
        createdAt: 'Dec 06, 2025'
    }
];

const INITIAL_VOICES: Voice[] = [
    {
        id: 'v_maya',
        name: 'Maya - Young Australian Female',
        provider: 'Elevenlabs',
        accent: 'Young Female Australian accent',
        gender: 'Female',
        description: 'Perfect for casual conversation and narrations.',
        previewText: 'This is the text you can play using Maya - Young Australian Female',
        isAdded: true,
        tags: ['young', 'casual']
    },
    {
        id: 'v_amritanshu',
        name: 'Amritanshu Professional voice',
        provider: 'Elevenlabs',
        accent: 'Indian accent',
        gender: 'Male',
        description: 'Professional tone suitable for business calls.',
        previewText: 'This is the text you can play using Amritanshu Professional voice',
        isAdded: false,
        tags: ['professional', 'business']
    },
    {
        id: 'v_saira',
        name: 'Saira - Young Casual Voice',
        provider: 'Elevenlabs',
        accent: 'Indian accent',
        gender: 'Female',
        description: 'Friendly and approachable young voice.',
        previewText: 'This is the text you can play using Saira - Young Casual Voice',
        isAdded: false,
        tags: ['casual', 'friendly']
    },
    {
        id: 'v_eva',
        name: 'Eva Kintsugi',
        provider: 'Elevenlabs',
        accent: 'Malay accent',
        gender: 'Female',
        description: 'Soft and calm voice for support.',
        previewText: 'This is the text you can play using Eva Kintsugi',
        isAdded: true,
        tags: ['calm', 'support']
    },
    {
        id: 'v_santa',
        name: 'Santa Claus',
        provider: 'Elevenlabs',
        accent: 'American accent',
        gender: 'Male',
        description: 'Deep, jolly voice for holiday themes.',
        previewText: 'This is the text you can play using Santa Claus',
        isAdded: false,
        tags: ['fun', 'character']
    },
    {
        id: 'v_charlie',
        name: 'Charlie',
        provider: 'Deepgram',
        accent: 'Australian accent',
        gender: 'Male',
        description: 'Clear and distinct Australian male voice.',
        previewText: 'This is the text you can play using Charlie',
        isAdded: false,
        tags: ['clear', 'narrative']
    },
     {
        id: 'v_george',
        name: 'George',
        provider: 'Deepgram',
        accent: 'British accent',
        gender: 'Male',
        description: 'Refined British accent for formal contexts.',
        previewText: 'This is the text you can play using George',
        isAdded: false,
        tags: ['formal', 'refined']
    },
     {
        id: 'v_callum',
        name: 'Callum',
        provider: 'Elevenlabs',
        accent: 'American accent',
        gender: 'Male',
        description: 'Standard American male voice.',
        previewText: 'This is the text you can play using Callum',
        isAdded: true,
        tags: ['standard', 'male']
    },
    {
        id: 'v_sonic',
        name: 'Sonic',
        provider: 'Cartesia',
        accent: 'American accent',
        gender: 'Male',
        description: 'Fast, energetic, and ultra-low latency voice.',
        previewText: 'This is Sonic, powered by Cartesia. I speak incredibly fast.',
        isAdded: false,
        tags: ['fast', 'energetic', 'low-latency']
    }
];

const INITIAL_WORKFLOWS: Workflow[] = [
    {
        id: 'wf_1',
        title: 'Call with 1 Retry',
        description: 'Initial call followed by one retry if unanswered',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-05',
        nodes: [
            { id: '1', type: 'customStep', position: { x: 100, y: 100 }, data: { label: 'Call', type: 'Call', delay: 'Start immediately' } },
            { id: '2', type: 'customStep', position: { x: 500, y: 100 }, data: { label: 'Call', type: 'Call', delay: '1 hour delay' } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#4ade80' } }
        ]
    },
    {
        id: 'wf_2',
        title: 'Call with 2 Retries',
        description: 'Initial call followed by up to two retries if unanswered',
        createdAt: '2025-01-02',
        updatedAt: '2025-01-06',
        nodes: [
             { id: '1', type: 'customStep', position: { x: 50, y: 150 }, data: { label: 'Call 1', type: 'Call', delay: 'Start immediately' } },
             { id: '2', type: 'customStep', position: { x: 350, y: 50 }, data: { label: 'Retry 1', type: 'Call', delay: '30 mins delay' } },
             { id: '3', type: 'customStep', position: { x: 350, y: 250 }, data: { label: 'SMS', type: 'SMS', delay: 'Send if no answer' } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2', animated: true },
            { id: 'e1-3', source: '1', target: '3', animated: true }
        ]
    }
];

const INITIAL_CAMPAIGNS: Campaign[] = [
    // Empty initially
];

const App: React.FC = () => {
  // Navigation State
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<View>('agent-setup');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Data State
  const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS);
  const [kbItems, setKbItems] = useState<KnowledgeBaseItem[]>(INITIAL_KB_ITEMS);
  const [batches, setBatches] = useState<Batch[]>(INITIAL_BATCHES);
  const [voices, setVoices] = useState<Voice[]>(INITIAL_VOICES);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [connectedProviders, setConnectedProviders] = useState<ConnectedProvider[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>(INITIAL_WORKFLOWS);
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
      { id: 'tm_1', email: 'eng.user@company.com', role: 'Admin', status: 'active', joinedAt: '2025-01-01' }
  ]);
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [balance, setBalance] = useState(5.00);
  
  // Modal State
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleAddFunds = (amount: number) => {
      setBalance(prev => prev + amount);
  };

  const handleNavigate = (view: View) => {
      setCurrentView(view);
      setIsMobileMenuOpen(false); // Close menu on navigation
  };

  const handleUpdatePhoneNumber = (numberId: string, agentId: string) => {
      setPhoneNumbers(prev => prev.map(num => 
          num.id === numberId ? { ...num, agentId: agentId } : 
          (num.agentId === agentId && agentId !== '') ? { ...num, agentId: '' } : num
      ));
  };

  const getPageInfo = () => {
    switch (currentView) {
      case 'agent-setup': return { title: 'Agent setup', subtitle: 'Fine tune your agents' };
      case 'call-history': return { title: 'Agent conversations', subtitle: 'Displays all historical conversations with agents' };
      case 'my-numbers': return { title: 'My phone numbers', subtitle: 'Buy and view your phone numbers' };
      case 'knowledge-base': return { title: 'Knowledge Base', subtitle: 'Manage knowledge base entries and upload PDFs' };
      case 'batches': return { title: 'Agent Batches', subtitle: 'Displays all batches from agents' };
      case 'voice-lab': return { title: 'Voices', subtitle: 'Explore and test voices' };
      case 'developers': return { title: 'Developers', subtitle: 'Manage API keys and developer settings' };
      case 'providers': return { title: 'Providers', subtitle: 'Add keys securely to connect your own Providers' };
      case 'workflows': return { title: 'Workflows', subtitle: 'Choose from our pre-built workflows or create your own' };
      case 'campaigns': return { title: 'Campaigns', subtitle: 'Create and manage your campaigns' };
      default: return { title: 'Dashboard', subtitle: 'Welcome to Axilo' };
    }
  };

  const { title, subtitle } = getPageInfo();

  if (!isAuthenticated) {
      return <LandingPage onGetStarted={() => {}} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        onAddFunds={() => setIsAddFundsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      <div className="flex-1 md:ml-64 w-full transition-all duration-300">
        <TopBar 
            title={title} 
            subtitle={subtitle} 
            balance={balance}
            onAddFunds={() => setIsAddFundsOpen(true)}
            onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        
        <main className="pt-20 px-4 sm:px-6 pb-6 h-screen overflow-y-auto w-full">
           {/* Notification Banner */}
           <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span>You're currently on a trial plan, which limits outbound calls to your verified phone numbers. To unlock full calling access, please upgrade by adding funds to your account.</span>
              <button 
                onClick={() => setIsAddFundsOpen(true)}
                className="underline font-medium hover:text-blue-800 whitespace-nowrap"
              >
                  Add funds
              </button>
           </div>

           {/* View Content */}
           <div className="h-[calc(100%-60px)]">
             {currentView === 'agent-setup' && (
                <AgentSetup 
                    agents={agents} 
                    setAgents={setAgents} 
                    onNavigate={setCurrentView} 
                    phoneNumbers={phoneNumbers}
                    onUpdatePhoneNumber={handleUpdatePhoneNumber}
                />
             )}
             {currentView === 'call-history' && <CallHistory agents={agents} />}
             {currentView === 'my-numbers' && (
                 <MyNumbers 
                    phoneNumbers={phoneNumbers} 
                    setPhoneNumbers={setPhoneNumbers} 
                 />
             )}
             {currentView === 'knowledge-base' && (
                <KnowledgeBase items={kbItems} setItems={setKbItems} />
             )}
             {currentView === 'batches' && (
                <Batches agents={agents} batches={batches} setBatches={setBatches} />
             )}
             {currentView === 'voice-lab' && (
                <VoiceLab voices={voices} setVoices={setVoices} />
             )}
             {currentView === 'developers' && (
                <Developers apiKeys={apiKeys} setApiKeys={setApiKeys} />
             )}
             {currentView === 'providers' && (
                <Providers connectedProviders={connectedProviders} setConnectedProviders={setConnectedProviders} />
             )}
             {currentView === 'workflows' && (
                <Workflows workflows={workflows} setWorkflows={setWorkflows} />
             )}
             {currentView === 'campaigns' && (
                <Campaigns 
                    campaigns={campaigns} 
                    setCampaigns={setCampaigns}
                    agents={agents}
                    workflows={workflows}
                />
             )}
             
             {/* Placeholder for other views */}
             {['documentation'].includes(currentView) && (
               <div className="flex items-center justify-center h-full text-gray-400">
                 Work in progress: {title}
               </div>
             )}
           </div>
        </main>
      </div>

      {/* Global Modals */}
      {isAddFundsOpen && (
          <AddFundsModal 
            onClose={() => setIsAddFundsOpen(false)}
            onSuccess={handleAddFunds}
          />
      )}

      {isSettingsOpen && (
          <SettingsModal 
            onClose={() => setIsSettingsOpen(false)}
            onAddFunds={() => setIsAddFundsOpen(true)}
            balance={balance}
            teamMembers={teamMembers}
            setTeamMembers={setTeamMembers}
          />
      )}
    </div>
  );
};

export default App;
