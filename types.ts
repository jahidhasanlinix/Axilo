
export interface LLMConfig {
  provider: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export interface TranscriberConfig {
  provider: string;
  model: string;
  keywords: string;
}

export interface VoiceConfig {
  provider: string;
  model: string;
  bufferSize: number;
  speedRate: number;
  similarityBoost: number;
  stability: number;
  styleExaggeration: number;
}

export interface EngineConfig {
  preciseTranscript: boolean;
  interruptWords: number;
  responseRate: string;
  endpointing: number;
  linearDelay: number;
  checkUserOnline: boolean;
  userOnlineMessage: string;
  invokeMessageAfter: number;
}

export interface CallConfig {
  telephonyProvider: string;
  dtmfEnabled: boolean;
  voicemailDetection: boolean;
  voicemailTimeout: number;
  hangupOnSilence: boolean;
  silenceTimeout: number;
  hangupOnPrompt: boolean;
  hangupPrompt: string;
  hangupMessage: string;
  maxCallDuration: number;
}

export type ToolType = 'transfer_call' | 'get_calendar' | 'book_calendar' | 'custom';

export interface Tool {
  id: string;
  type: ToolType;
  name: string;
  description: string;
  config: {
    phoneNumber?: string;
    calendarId?: string;
    apiKey?: string;
    url?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: string;
    payload?: string;
  };
}

export interface CustomAnalyticsItem {
  id: string;
  name: string;
  prompt: string;
}

export interface AnalyticsConfig {
  summarization: boolean;
  extraction: boolean;
  extractionSchema: string;
  customAnalytics: CustomAnalyticsItem[];
  webhookUrl: string;
}

export interface Agent {
  id: string;
  name: string;
  status: 'draft' | 'active';
  welcomeMessage: string;
  prompt: string;
  voice: string;
  language: string;
  costPerMin: number;
  llmConfig: LLMConfig;
  knowledgeBases: string[];
  transcriberConfig: TranscriberConfig;
  voiceConfig: VoiceConfig;
  engineConfig: EngineConfig;
  callConfig: CallConfig;
  analyticsConfig: AnalyticsConfig;
  tools: Tool[];
}

export interface Batch {
  id: string;
  agentId: string;
  fileName: string;
  validContacts: number;
  totalContacts: number;
  executionStatus: 'Pending' | 'Running' | 'Completed' | 'Paused' | 'Stopped';
  batchStatus: 'Active' | 'Archived';
  workflow: string;
  createdAt: string;
  scheduledAt?: string;
}

export interface Voice {
  id: string;
  name: string;
  provider: string; // e.g., 'ElevenLabs', 'Deepgram', 'PlayHT'
  accent: string;
  gender: 'Male' | 'Female';
  description: string;
  previewText: string;
  isAdded: boolean;
  tags: string[];
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  maskedKey: string;
  createdBy: string;
  lastAccessed: string;
  createdAt: string;
}

export type ProviderCategory = 'LLM' | 'TTS' | 'STT' | 'Tools' | 'Telephony';

export interface ProviderField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'url';
  placeholder: string;
  description?: string;
  required?: boolean;
}

export interface ProviderDefinition {
  id: string;
  name: string;
  category: ProviderCategory;
  description?: string;
  icon?: string; // We will use this to determine which icon to render or URL
  fields: ProviderField[];
  helpText?: string;
  documentationLink?: string;
}

export interface ConnectedProvider {
  providerId: string;
  config: Record<string, string>;
  connectedAt: string;
  status: 'active' | 'error';
}

// Workflow Types
export interface WorkflowNodeData {
  label: string;
  type: 'Call' | 'SMS' | 'Email' | 'Wait' | 'Condition';
  delay?: string;
  description?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export interface Workflow {
  id: string;
  title: string;
  description: string;
  nodes: any[]; // ReactFlow Nodes
  edges: any[]; // ReactFlow Edges
  createdAt: string;
  updatedAt: string;
}

// Campaign Types
export interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused';
  agentId: string;
  workflowId: string;
  fileName: string;
  createdAt: string;
  scheduledAt?: string;
  stats: {
    total: number;
    completed: number;
    connected: number;
    failed: number;
  };
}

export enum Tab {
  AGENT = 'Agent',
  LLM = 'LLM',
  AUDIO = 'Audio',
  ENGINE = 'Engine',
  CALL = 'Call',
  TOOLS = 'Tools',
  ANALYTICS = 'Analytics',
  INBOUND = 'Inbound'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type View = 'agent-setup' | 'call-history' | 'my-numbers' | 'knowledge-base' | 'batches' | 'voice-lab' | 'developers' | 'providers' | 'workflows' | 'campaigns' | 'documentation';

// Detailed Call History Types

export interface UsageBreakdown {
    llmModel: Record<string, { input: number; output: number }>;
    llmTokens: number;
    transcriber_model: string;
    synthesizer_provider: string;
    transcriber_provider: string;
}

export interface CostBreakdown {
    llm: number;
    network: number;
    platform: number;
    synthesizer: number;
    transcriber: number;
    total?: number;
    llm_breakdown?: Record<string, number>;
}

export interface CallExecution {
  id: string;
  agent_id: string;
  batch_id: string | null;
  created_at: string;
  updated_at: string;
  scheduled_at: string | null;
  conversation_duration: number;
  total_cost: number;
  transcript: string;
  usage_breakdown: UsageBreakdown;
  cost_breakdown: CostBreakdown;
  summary: string | null;
  status: 'completed' | 'failed' | 'no-answer' | 'ongoing';
  user_number: string | null;
  provider: string;
  conversation_type?: 'Inbound' | 'Outbound' | 'websocket'; 
  hangup_by?: 'User' | 'Agent' | null;
  recording_url?: string;
  error_message?: string | null;
}

export interface PhoneNumber {
  id: string;
  number: string;
  agentId?: string;
  telephony: string;
  boughtOn: string;
  renewsOn: string;
  monthlyRent: number;
}

export interface VerifiedNumber {
  id: string;
  phoneNumber: string;
  status: 'Verified' | 'Pending';
  createdAt: string;
}

export interface KnowledgeBaseItem {
  id: string;
  source: string;
  type: 'PDF' | 'URL' | 'Text';
  created: string;
  status: 'indexed' | 'processing' | 'error';
}

// Payment & Pricing Types
export interface PricingTier {
  id: string;
  amount: number;
  credits: number;
  bonusText?: string;
  popular?: boolean;
}

export interface PaymentPlan {
  id: 'pay_as_you_go' | 'fixed_pricing';
  name: string;
  description: string;
  recommended?: boolean;
}

// Team Types
export type Role = 'Admin' | 'Editor' | 'Viewer';

export interface TeamMember {
  id: string;
  email: string;
  role: Role;
  status: 'active' | 'invited';
  joinedAt?: string;
}

// Compliance Types
export type ComplianceStatus = 'Pending' | 'Approved' | 'Rejected';

export interface ComplianceApplication {
  id: string;
  applicationName: string; // Usually derived from First + Last Name or Company
  firstName: string;
  lastName: string;
  companyName: string;
  taxIdNumber: string; // EIN for US, GST/PAN for others
  status: ComplianceStatus;
  dateAdded: string;
  documents: {
    businessDoc?: string; // Generic business registration/IRS letter
  };
}

// Invoice Types
export type InvoiceStatus = 'Subscription Cancelled' | 'Due' | 'Subscription Active' | 'Fulfilled';
export type InvoiceItemType = 'Phone number' | 'Credits';

export interface Invoice {
  id: string;
  itemValue: string; // e.g. "1000 Credits" or "+1 555..."
  itemType: InvoiceItemType;
  totalAmount: number;
  status: InvoiceStatus;
  createdOn: string;
  downloadUrl: string;
}

// Authentication
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}
