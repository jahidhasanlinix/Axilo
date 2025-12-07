
import React from 'react';
import { Agent, EngineConfig } from '../types';
import { ChevronDown } from 'lucide-react';

interface EngineTabProps {
  agent: Agent;
  updateAgent: (updates: Partial<Agent>) => void;
}

const EngineTab: React.FC<EngineTabProps> = ({ agent, updateAgent }) => {

  const updateEngineConfig = (updates: Partial<EngineConfig>) => {
    updateAgent({
      engineConfig: { ...agent.engineConfig, ...updates }
    });
  };

  return (
    <div className="space-y-10 max-w-4xl animate-in fade-in duration-300">
      
      {/* Transcription & interruptions */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-6">Transcription & interruptions</h3>
        <div className="flex justify-between items-start gap-12">
            <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-bold text-gray-900">Generate precise transcript</label>
                    <div className="relative inline-block w-10 h-6 align-middle select-none transition duration-200 ease-in">
                        <input 
                            type="checkbox" 
                            name="toggle" 
                            id="precise-toggle" 
                            checked={agent.engineConfig?.preciseTranscript}
                            onChange={(e) => updateEngineConfig({ preciseTranscript: e.target.checked })}
                            className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 ease-in-out"
                            style={{ 
                                right: agent.engineConfig?.preciseTranscript ? '2px' : 'auto', 
                                left: agent.engineConfig?.preciseTranscript ? 'auto' : '2px',
                                top: '4px',
                                borderColor: 'transparent'
                            }}
                        />
                        <label 
                            htmlFor="precise-toggle" 
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${agent.engineConfig?.preciseTranscript ? 'bg-blue-600' : 'bg-gray-300'}`}
                        ></label>
                    </div>
                </div>
                <p className="text-xs text-gray-500 mb-1">Agent will try to generate more precise transcripts during interruptions</p>
                <a href="#" className="text-xs text-blue-600 underline">Learn more</a>
            </div>

            <div className="flex-1">
                <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-gray-900">Number of words to wait for before interrupting</label>
                    <span className="text-sm text-gray-500">{agent.engineConfig?.interruptWords}</span>
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max="10" 
                    step="1"
                    value={agent.engineConfig?.interruptWords}
                    onChange={(e) => updateEngineConfig({ interruptWords: parseInt(e.target.value) })}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                    Agent will not consider interruptions until {agent.engineConfig?.interruptWords} words are spoken (If recipient says "Stopwords" such as Stop, Wait, Hold On, agent will pause by default)
                </p>
            </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Voice Response Rate Configuration */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-6">Voice Response Rate Configuration</h3>
        <div className="grid grid-cols-3 gap-8">
            <div className="col-span-1">
                <label className="block text-sm font-bold text-gray-900 mb-2">Response Rate</label>
                <div className="relative">
                    <select
                        value={agent.engineConfig?.responseRate}
                        onChange={(e) => updateEngineConfig({ responseRate: e.target.value })}
                        className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="Normal">Normal</option>
                        <option value="Fast">Fast</option>
                        <option value="Custom">Custom</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
            </div>
            
            <div className="col-span-1">
                <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-gray-900">Endpointing (in ms)</label>
                    <span className="text-sm text-gray-500">{agent.engineConfig?.endpointing}</span>
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max="1000" 
                    step="10"
                    value={agent.engineConfig?.endpointing}
                    onChange={(e) => updateEngineConfig({ endpointing: parseInt(e.target.value) })}
                    disabled={agent.engineConfig?.responseRate !== 'Custom'}
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${agent.engineConfig?.responseRate !== 'Custom' ? 'bg-gray-100 accent-gray-400' : 'bg-blue-100 accent-blue-600'}`}
                />
                <p className="mt-2 text-xs text-gray-500">Number of milliseconds your agent will wait before generating response.</p>
            </div>

            <div className="col-span-1">
                <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-gray-900">Linear delay (in ms)</label>
                    <span className="text-sm text-gray-500">{agent.engineConfig?.linearDelay}</span>
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max="2000" 
                    step="50"
                    value={agent.engineConfig?.linearDelay}
                    onChange={(e) => updateEngineConfig({ linearDelay: parseInt(e.target.value) })}
                    disabled={agent.engineConfig?.responseRate !== 'Custom'}
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${agent.engineConfig?.responseRate !== 'Custom' ? 'bg-gray-100 accent-gray-400' : 'bg-blue-100 accent-blue-600'}`}
                />
                <p className="mt-2 text-xs text-gray-500">Linear delay accounts for long pauses mid-sentence.</p>
            </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* User Online Detection */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-6">User Online Detection</h3>
        
        <div className="border border-gray-200 rounded-lg p-5 mb-4">
             <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-gray-900 text-sm">Check if user is online</h4>
                    <p className="text-xs text-gray-500 mt-1">Agent will check if the user is online if there's no reply from the user</p>
                </div>
                <div className="relative inline-block w-10 h-6 align-middle select-none transition duration-200 ease-in">
                    <input 
                        type="checkbox" 
                        name="online-toggle" 
                        id="online-toggle" 
                        checked={agent.engineConfig?.checkUserOnline}
                        onChange={(e) => updateEngineConfig({ checkUserOnline: e.target.checked })}
                        className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 ease-in-out"
                        style={{ 
                            right: agent.engineConfig?.checkUserOnline ? '2px' : 'auto', 
                            left: agent.engineConfig?.checkUserOnline ? 'auto' : '2px',
                            top: '4px',
                            borderColor: 'transparent'
                        }}
                    />
                    <label 
                        htmlFor="online-toggle" 
                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${agent.engineConfig?.checkUserOnline ? 'bg-blue-600' : 'bg-gray-300'}`}
                    ></label>
                </div>
             </div>
        </div>

        {agent.engineConfig?.checkUserOnline && (
            <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                <div className="grid grid-cols-2 gap-8 items-center">
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">User is online message</label>
                        <input 
                            type="text"
                            value={agent.engineConfig?.userOnlineMessage}
                            onChange={(e) => updateEngineConfig({ userOnlineMessage: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-bold text-gray-900">Invoke message after (seconds)</label>
                            <span className="text-sm text-gray-500">{agent.engineConfig?.invokeMessageAfter}</span>
                        </div>
                        <input 
                            type="range" 
                            min="1" 
                            max="30" 
                            step="1"
                            value={agent.engineConfig?.invokeMessageAfter}
                            onChange={(e) => updateEngineConfig({ invokeMessageAfter: parseInt(e.target.value) })}
                            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default EngineTab;
