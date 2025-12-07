
import React from 'react';
import { Agent, CallConfig } from '../types';
import { ChevronDown, ExternalLink } from 'lucide-react';

interface CallTabProps {
  agent: Agent;
  updateAgent: (updates: Partial<Agent>) => void;
}

const CallTab: React.FC<CallTabProps> = ({ agent, updateAgent }) => {

  const updateCallConfig = (updates: Partial<CallConfig>) => {
    updateAgent({
      callConfig: { ...agent.callConfig, ...updates }
    });
  };

  return (
    <div className="space-y-10 max-w-4xl animate-in fade-in duration-300">
      
      {/* Telephony Provider */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Telephony Provider</label>
        <div className="relative">
            <select
                value={agent.callConfig?.telephonyProvider}
                onChange={(e) => updateCallConfig({ telephonyProvider: e.target.value })}
                className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            >
                <option value="Plivo">Plivo</option>
                <option value="Twilio">Twilio</option>
                <option value="Vonage">Vonage</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* DTMF */}
      <div>
         <div className="flex items-start justify-between">
            <div className="max-w-xl">
                <h4 className="font-bold text-gray-900 text-sm mb-1">Enable Keypad Inputs (DTMF)</h4>
                <p className="text-sm font-semibold text-gray-700 mb-1">Allow caller to interact using keypad inputs.</p>
                <p className="text-xs text-gray-500">
                    When enabled, the agent can take input directly via the user's phone keypad during the call.
                    Prompt the user to push inputs via keypad and ask them to finish by # for the agent to capture the input.
                </p>
            </div>
            <div className="relative inline-block w-10 h-6 align-middle select-none transition duration-200 ease-in mt-1">
                <input 
                    type="checkbox" 
                    name="dtmf-toggle" 
                    id="dtmf-toggle" 
                    checked={agent.callConfig?.dtmfEnabled}
                    onChange={(e) => updateCallConfig({ dtmfEnabled: e.target.checked })}
                    className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 ease-in-out"
                    style={{ 
                        right: agent.callConfig?.dtmfEnabled ? '2px' : 'auto', 
                        left: agent.callConfig?.dtmfEnabled ? 'auto' : '2px',
                        top: '4px',
                        borderColor: 'transparent'
                    }}
                />
                <label 
                    htmlFor="dtmf-toggle" 
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${agent.callConfig?.dtmfEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                ></label>
            </div>
         </div>
      </div>

      <hr className="border-gray-200" />

      {/* Voicemail Detection */}
      <div>
         <h3 className="text-sm font-bold text-gray-900 mb-4">Voicemail detection</h3>
         <div className="flex items-center justify-between gap-12">
            <div className="flex-1">
                 <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-sm text-gray-700 font-medium">Automatically disconnect call on voicemail detection</h4>
                        <p className="text-xs text-gray-500 mt-1">Time allotted to analyze if the call has been answered by a machine. The default value is 2500 ms.</p>
                    </div>
                    <div className="relative inline-block w-10 h-6 align-middle select-none transition duration-200 ease-in flex-shrink-0 ml-4">
                        <input 
                            type="checkbox" 
                            name="vm-toggle" 
                            id="vm-toggle" 
                            checked={agent.callConfig?.voicemailDetection}
                            onChange={(e) => updateCallConfig({ voicemailDetection: e.target.checked })}
                            className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 ease-in-out"
                            style={{ 
                                right: agent.callConfig?.voicemailDetection ? '2px' : 'auto', 
                                left: agent.callConfig?.voicemailDetection ? 'auto' : '2px',
                                top: '4px',
                                borderColor: 'transparent'
                            }}
                        />
                        <label 
                            htmlFor="vm-toggle" 
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${agent.callConfig?.voicemailDetection ? 'bg-blue-600' : 'bg-gray-300'}`}
                        ></label>
                    </div>
                 </div>
            </div>
            <div className="flex-1">
                <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-gray-900">Time (seconds)</label>
                    <span className="text-sm text-gray-500">{agent.callConfig?.voicemailTimeout}</span>
                </div>
                <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    step="0.5"
                    value={agent.callConfig?.voicemailTimeout}
                    onChange={(e) => updateCallConfig({ voicemailTimeout: parseFloat(e.target.value) })}
                    disabled={!agent.callConfig?.voicemailDetection}
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${agent.callConfig?.voicemailDetection ? 'bg-blue-100 accent-blue-600' : 'bg-gray-100 accent-gray-400'}`}
                />
            </div>
         </div>
      </div>

      <hr className="border-gray-200" />

      {/* Call hangup modes */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-6">Call hangup modes</h3>
        
        {/* Silence Hangup */}
        <div className="flex items-center justify-between gap-12 mb-8">
            <div className="flex-1 flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-bold text-gray-900">Hangup calls on user silence</h4>
                    <p className="text-xs text-gray-500 mt-1">Call will hangup if the user is not speaking</p>
                </div>
                <div className="relative inline-block w-10 h-6 align-middle select-none transition duration-200 ease-in flex-shrink-0 ml-4">
                    <input 
                        type="checkbox" 
                        name="silence-toggle" 
                        id="silence-toggle" 
                        checked={agent.callConfig?.hangupOnSilence}
                        onChange={(e) => updateCallConfig({ hangupOnSilence: e.target.checked })}
                        className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 ease-in-out"
                        style={{ 
                            right: agent.callConfig?.hangupOnSilence ? '2px' : 'auto', 
                            left: agent.callConfig?.hangupOnSilence ? 'auto' : '2px',
                            top: '4px',
                            borderColor: 'transparent'
                        }}
                    />
                    <label 
                        htmlFor="silence-toggle" 
                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${agent.callConfig?.hangupOnSilence ? 'bg-blue-600' : 'bg-gray-300'}`}
                    ></label>
                </div>
            </div>
            <div className="flex-1">
                <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-gray-900">Time (seconds)</label>
                    <span className="text-sm text-gray-500">{agent.callConfig?.silenceTimeout}</span>
                </div>
                <input 
                    type="range" 
                    min="5" 
                    max="60" 
                    step="1"
                    value={agent.callConfig?.silenceTimeout}
                    onChange={(e) => updateCallConfig({ silenceTimeout: parseInt(e.target.value) })}
                    disabled={!agent.callConfig?.hangupOnSilence}
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${agent.callConfig?.hangupOnSilence ? 'bg-blue-100 accent-blue-600' : 'bg-gray-100 accent-gray-400'}`}
                />
            </div>
        </div>

        {/* Prompt Hangup */}
        <div className="flex items-start justify-between gap-12">
            <div className="flex-1 flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        Hangup calls using a prompt 
                        <a href="#" className="text-blue-600 text-xs font-normal flex items-center gap-0.5">See examples <ExternalLink size={10} /></a>
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">Call will hangup as per the provided prompt</p>
                </div>
                <div className="relative inline-block w-10 h-6 align-middle select-none transition duration-200 ease-in flex-shrink-0 ml-4">
                    <input 
                        type="checkbox" 
                        name="prompt-toggle" 
                        id="prompt-toggle" 
                        checked={agent.callConfig?.hangupOnPrompt}
                        onChange={(e) => updateCallConfig({ hangupOnPrompt: e.target.checked })}
                        className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 ease-in-out"
                        style={{ 
                            right: agent.callConfig?.hangupOnPrompt ? '2px' : 'auto', 
                            left: agent.callConfig?.hangupOnPrompt ? 'auto' : '2px',
                            top: '4px',
                            borderColor: 'transparent'
                        }}
                    />
                    <label 
                        htmlFor="prompt-toggle" 
                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${agent.callConfig?.hangupOnPrompt ? 'bg-blue-600' : 'bg-gray-300'}`}
                    ></label>
                </div>
            </div>
            <div className="flex-1">
                <textarea 
                    rows={4}
                    value={agent.callConfig?.hangupPrompt}
                    onChange={(e) => updateCallConfig({ hangupPrompt: e.target.value })}
                    disabled={!agent.callConfig?.hangupOnPrompt}
                    placeholder="You are an AI assistant determining if a conversation is complete..."
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none resize-none ${!agent.callConfig?.hangupOnPrompt ? 'bg-gray-50 text-gray-400' : 'bg-white text-gray-700 focus:ring-2 focus:ring-blue-500'}`}
                />
            </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Call hangup message */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Call hangup message</label>
        <input 
            type="text"
            value={agent.callConfig?.hangupMessage}
            onChange={(e) => updateCallConfig({ hangupMessage: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <p className="mt-1 text-xs text-gray-500">Provide the final agent message just before hanging up.</p>
      </div>

      {/* Call Termination */}
      <div>
         <label className="block text-sm font-bold text-gray-900 mb-4">Call Termination</label>
         <div className="flex items-center gap-6">
            <div className="flex-1">
                 <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 flex justify-between items-center">
                    <span>The call ends after <strong>{agent.callConfig?.maxCallDuration} seconds</strong> of call time</span>
                    <div className="flex flex-col gap-0.5">
                        <ChevronDown size={14} className="text-gray-400 rotate-180" />
                        <ChevronDown size={14} className="text-gray-400" />
                    </div>
                 </div>
            </div>
            <div className="flex-1">
                <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-gray-900">Time (seconds)</label>
                    <span className="text-sm text-gray-500">{agent.callConfig?.maxCallDuration}</span>
                </div>
                <input 
                    type="range" 
                    min="60" 
                    max="3600" 
                    step="60"
                    value={agent.callConfig?.maxCallDuration}
                    onChange={(e) => updateCallConfig({ maxCallDuration: parseInt(e.target.value) })}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
            </div>
         </div>
      </div>
    </div>
  );
};

export default CallTab;
