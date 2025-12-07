
import { ProviderDefinition } from '../types';

export const PROVIDER_REGISTRY: ProviderDefinition[] = [
    // --- LLM Providers ---
    {
        id: 'openai',
        name: 'OpenAI',
        category: 'LLM',
        description: 'Connect your OpenAI account for GPT models.',
        helpText: 'Please make sure your OpenAI account is Tier 3 or above.',
        documentationLink: 'https://platform.openai.com/docs/guides/rate-limits/usage-tiers',
        fields: [
            { key: 'api_key', label: 'OpenAI API Key', type: 'password', placeholder: 'sk-...', required: true }
        ]
    },
    {
        id: 'azure_openai',
        name: 'Azure OpenAI',
        category: 'LLM',
        description: 'Enterprise-grade AI with Azure OpenAI Service.',
        fields: [
            { key: 'api_key', label: 'Azure OpenAI API Key', type: 'password', placeholder: 'Enter azure openai api key', required: true },
            { key: 'base_url', label: 'Azure OpenAI API Base URL', type: 'url', placeholder: 'https://your-resource.openai.azure.com/', description: 'Should be http/https URL', required: true },
            { key: 'api_version', label: 'Azure OpenAI API Version', type: 'text', placeholder: '2023-05-15', required: true },
            { key: 'model', label: 'Azure OpenAI Model', type: 'text', placeholder: 'azure/<your deployment name>', description: 'Format: azure/<deployment_name>', required: true }
        ]
    },
    {
        id: 'openrouter',
        name: 'OpenRouter',
        category: 'LLM',
        description: 'Unified interface for various LLMs.',
        fields: [
            { key: 'api_key', label: 'OpenRouter API Key', type: 'password', placeholder: 'sk-or-...', required: true }
        ]
    },
    {
        id: 'perplexity',
        name: 'Perplexity',
        category: 'LLM',
        description: 'Real-time knowledge and information.',
        fields: [
            { key: 'api_key', label: 'Perplexity API Key', type: 'password', placeholder: 'pplx-...', required: true }
        ]
    },
    {
        id: 'sarvam',
        name: 'Sarvam',
        category: 'LLM',
        description: 'Indian language focused LLMs.',
        fields: [
            { key: 'api_key', label: 'Sarvam API Key', type: 'password', placeholder: 'Enter sarvam api key', required: true }
        ]
    },

    // --- TTS Providers ---
    {
        id: 'elevenlabs',
        name: 'ElevenLabs',
        category: 'TTS',
        description: 'High quality AI voice synthesis.',
        helpText: 'Please make sure your Elevenlabs account subscription is Pro or above.',
        documentationLink: 'https://elevenlabs.io/app/subscription',
        fields: [
            { key: 'api_key', label: 'ElevenLabs API Key', type: 'password', placeholder: 'Enter elevenlabs api key', required: true }
        ]
    },
    {
        id: 'cartesia',
        name: 'Cartesia',
        category: 'TTS',
        description: 'Ultra-low latency speech synthesis.',
        fields: [
            { key: 'api_key', label: 'Cartesia API Key', type: 'password', placeholder: 'Enter cartesia api key', required: true }
        ]
    },
    {
        id: 'rime',
        name: 'Rime',
        category: 'TTS',
        description: 'Next-gen speech synthesis.',
        fields: [
            { key: 'api_key', label: 'Rime API Key', type: 'password', placeholder: 'Enter rime api key', required: true }
        ]
    },

    // --- STT Providers ---
    {
        id: 'deepgram',
        name: 'Deepgram',
        category: 'STT',
        description: 'Fast and accurate speech recognition.',
        fields: [
            { key: 'api_key', label: 'Deepgram API Key', type: 'password', placeholder: 'Enter deepgram api key', required: true }
        ]
    },

    // --- Telephony Providers ---
    {
        id: 'twilio',
        name: 'Twilio',
        category: 'Telephony',
        description: 'Communication APIs for SMS, Voice, and Video.',
        fields: [
            { key: 'account_sid', label: 'Account SID', type: 'text', placeholder: 'AC...', required: true },
            { key: 'auth_token', label: 'Auth Token', type: 'password', placeholder: 'Enter auth token', required: true },
            { key: 'phone_number', label: 'Phone Number', type: 'text', placeholder: '+1234567890', required: true }
        ]
    },
    {
        id: 'exotel',
        name: 'Exotel',
        category: 'Telephony',
        description: 'Cloud telephony platform.',
        fields: [
            { key: 'api_key', label: 'Exotel API Key', type: 'password', placeholder: 'Enter exotel api key', required: true },
            { key: 'api_token', label: 'Exotel API Token', type: 'password', placeholder: 'Enter exotel api token', required: true },
            { key: 'account_sid', label: 'Exotel Account SID', type: 'text', placeholder: 'Enter exotel account sid', required: true },
            { key: 'domain', label: 'Exotel Domain', type: 'text', placeholder: 'api.exotel.com', required: true },
            { key: 'phone_number', label: 'Exotel Phone Number', type: 'text', placeholder: 'Enter exotel phone number', required: true },
            { key: 'app_id', label: 'Exotel Outbound App ID', type: 'text', placeholder: 'Enter exotel outbound app id', required: true }
        ]
    },
    {
        id: 'plivo',
        name: 'Plivo',
        category: 'Telephony',
        description: 'Global communications platform.',
        fields: [
            { key: 'auth_id', label: 'Auth ID', type: 'text', placeholder: 'MA...', required: true },
            { key: 'auth_token', label: 'Auth Token', type: 'password', placeholder: 'Enter auth token', required: true }
        ]
    },

    // --- Tools/Other ---
    {
        id: 'cal_com',
        name: 'Cal.com',
        category: 'Tools',
        description: 'Scheduling infrastructure for everyone.',
        fields: [
            { key: 'api_key', label: 'Cal.com API Key', type: 'password', placeholder: 'cal_...', required: true }
        ]
    },
    {
        id: 'ai_sensy',
        name: 'Ai Sensy',
        category: 'Tools',
        description: 'WhatsApp Marketing & Automation.',
        fields: [
            { key: 'api_key', label: 'Ai Sensy API Key', type: 'password', placeholder: 'Enter ai sensy api key', required: true }
        ]
    }
];
