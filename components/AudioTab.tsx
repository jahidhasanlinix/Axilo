
import React from 'react';
import { Agent, VoiceConfig, TranscriberConfig } from '../types';
import { Volume2, Globe, ChevronDown, Play, ExternalLink } from 'lucide-react';

interface AudioTabProps {
  agent: Agent;
  updateAgent: (updates: Partial<Agent>) => void;
}

const LANGUAGES = ['English', 'Hindi', 'Spanish', 'Portuguese', 'French'];
const VOICES = ['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr', 'Neha P - Slightly Imperfect', 'Sarah - Professional'];
const PROVIDERS = ['Elevenlabs', 'Deepgram', 'PlayHT', 'Azure', 'Google', 'Cartesia'];
const TRANSCRIBER_PROVIDERS = ['Deepgram', 'AssemblyAI', 'Google STT', 'Azure STT'];
const TRANSCRIBER_MODELS = ['nova-3', 'nova-2', 'enhanced', 'base'];
const VOICE_MODELS = ['eleven_turbo_v2_5', 'eleven_multilingual_v2', 'standard_v1', 'sonic-english'];

const AudioTab: React.FC<AudioTabProps> = ({ agent, updateAgent }) => {
  
  const updateVoiceConfig = (updates: Partial<VoiceConfig>) => {
    updateAgent({
      voiceConfig: { ...agent.voiceConfig, ...updates }
    });
  };

  const updateTranscriberConfig = (updates: Partial<TranscriberConfig>) => {
    updateAgent({
      transcriberConfig: { ...agent.transcriberConfig, ...updates }
    });
  };

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-300">
      
      {/* Language Section */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            Language
        </label>
        <div className="relative">
            <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
            <select
                value={agent.language}
                onChange={(e) => updateAgent({ language: e.target.value })}
                className="w-full appearance-none bg-white border border-gray-300 pl-10 pr-4 py-2.5 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            >
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Transcriber Section */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Select transcriber</h3>
        <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
                <div className="relative">
                    <select
                        value={agent.transcriberConfig?.provider}
                        onChange={(e) => updateTranscriberConfig({ provider: e.target.value })}
                        className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        {TRANSCRIBER_PROVIDERS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                <div className="relative">
                    <select
                        value={agent.transcriberConfig?.model}
                        onChange={(e) => updateTranscriberConfig({ model: e.target.value })}
                        className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        {TRANSCRIBER_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
            <input 
                type="text"
                value={agent.transcriberConfig?.keywords}
                onChange={(e) => updateTranscriberConfig({ keywords: e.target.value })}
                placeholder="Enter certain keywords/proper nouns you'd want to boost..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Boost specific words like names or technical terms (Format: Word:Intensity)</p>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Voice Section */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Select voice</h3>
        <div className="grid grid-cols-12 gap-6 mb-6">
            <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
                <div className="relative">
                    <select
                        value={agent.voiceConfig?.provider}
                        onChange={(e) => updateVoiceConfig({ provider: e.target.value })}
                        className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        {PROVIDERS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
            </div>
            <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                <div className="relative">
                    <select
                        value={agent.voiceConfig?.model}
                        onChange={(e) => updateVoiceConfig({ model: e.target.value })}
                        className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        {VOICE_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
            </div>
            <div className="col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Voice</label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <select
                            value={agent.voice} // Keeping primary voice selection sync'd with main agent prop
                            onChange={(e) => updateAgent({ voice: e.target.value })}
                            className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            {VOICES.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                    <button className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700">
                        <Play size={18} />
                    </button>
                    <button className="flex items-center gap-1 px-3 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium text-gray-700 whitespace-nowrap">
                        Add voices <ExternalLink size={14} />
                    </button>
                </div>
            </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-8">
            {/* Buffer Size */}
            <div>
                <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-gray-900">Buffer Size</label>
                    <span className="text-sm text-gray-500">{agent.voiceConfig?.bufferSize} ms</span>
                </div>
                <input 
                    type="range" 
                    min="50" 
                    max="500" 
                    value={agent.voiceConfig?.bufferSize}
                    onChange={(e) => updateVoiceConfig({ bufferSize: parseInt(e.target.value) })}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <p className="mt-2 text-xs text-gray-500">Increasing buffer size lets the agent speak longer fluently, but raises latency</p>
            </div>

            {/* Speed Rate */}
            <div>
                <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-gray-900">Speed rate</label>
                    <span className="text-sm text-gray-500">{agent.voiceConfig?.speedRate}x</span>
                </div>
                <input 
                    type="range" 
                    min="0.5" 
                    max="2.0" 
                    step="0.1"
                    value={agent.voiceConfig?.speedRate}
                    onChange={(e) => updateVoiceConfig({ speedRate: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <p className="mt-2 text-xs text-gray-500">The speed control feature lets you adjust how fast or slow your agent speaks.</p>
            </div>

            {/* Similarity Boost */}
            <div>
                <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-gray-900">Similarity Boost</label>
                    <span className="text-sm text-gray-500">{agent.voiceConfig?.similarityBoost}</span>
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05"
                    value={agent.voiceConfig?.similarityBoost}
                    onChange={(e) => updateVoiceConfig({ similarityBoost: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <p className="mt-2 text-xs text-gray-500">Controls how strictly the AI matches the original voice during replication</p>
            </div>

            {/* Stability */}
            <div>
                <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-gray-900">Stability</label>
                    <span className="text-sm text-gray-500">{agent.voiceConfig?.stability}</span>
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05"
                    value={agent.voiceConfig?.stability}
                    onChange={(e) => updateVoiceConfig({ stability: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <p className="mt-2 text-xs text-gray-500">Controls voice stability and randomness between generations</p>
            </div>

             {/* Style Exaggeration */}
             <div className="col-span-1">
                <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-gray-900">Style Exaggeration</label>
                    <span className="text-sm text-gray-500">{agent.voiceConfig?.styleExaggeration}</span>
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1"
                    value={agent.voiceConfig?.styleExaggeration}
                    onChange={(e) => updateVoiceConfig({ styleExaggeration: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <p className="mt-2 text-xs text-gray-500">Controls the style exaggeration of the voice</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AudioTab;
