
import React, { useState } from 'react';
import { CallExecution } from '../../types';
import { X, Copy, Check } from 'lucide-react';

interface CallDetailsProps {
  log: CallExecution;
  onClose: () => void;
}

const CallDetails: React.FC<CallDetailsProps> = ({ log, onClose }) => {
  const [activeTab, setActiveTab] = useState<'transcript' | 'json'>('json');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm transition-opacity" onClick={onClose}>
      <div 
        className="w-[800px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
        onClick={e => e.stopPropagation()} 
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div>
                <h2 className="text-lg font-bold text-gray-900">Call Details</h2>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-mono mt-1">
                    <span>ID: {log.id}</span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-600">{log.status}</span>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                <X size={20} />
            </button>
        </div>

        <div className="flex border-b border-gray-200 px-4">
            <button 
                onClick={() => setActiveTab('json')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'json' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                Raw JSON
            </button>
            <button 
                onClick={() => setActiveTab('transcript')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'transcript' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                Transcript
            </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50 p-6 relative">
            {activeTab === 'json' && (
                <div className="relative">
                    <button 
                        onClick={handleCopy}
                        className="absolute right-2 top-2 p-2 bg-white border border-gray-200 rounded shadow-sm hover:bg-gray-50 text-gray-600 z-10"
                        title="Copy JSON"
                    >
                        {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    </button>
                    <pre className="text-xs font-mono bg-white p-4 rounded-lg border border-gray-200 overflow-x-auto shadow-sm text-gray-800 leading-5">
                        {JSON.stringify(log, null, 2)}
                    </pre>
                </div>
            )}

            {activeTab === 'transcript' && (
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
                    {log.transcript.split('\n').map((line, idx) => {
                        const isUser = line.toLowerCase().startsWith('user:');
                        const isAssistant = line.toLowerCase().startsWith('assistant:');
                        
                        if (!line.trim()) return null;

                        return (
                            <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                                    isUser ? 'bg-blue-50 text-blue-900 rounded-br-none' : 
                                    isAssistant ? 'bg-gray-100 text-gray-800 rounded-bl-none' : 'bg-white text-gray-500 italic'
                                }`}>
                                    <span className="font-bold text-xs block mb-1 opacity-70">
                                        {isUser ? 'User' : isAssistant ? 'Agent' : 'System'}
                                    </span>
                                    {line.replace(/^(user:|assistant:)\s*/i, '')}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CallDetails;
