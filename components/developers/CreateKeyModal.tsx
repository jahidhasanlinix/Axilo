
import React, { useState, useEffect } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { ApiKey } from '../../types';

interface CreateKeyModalProps {
  onClose: () => void;
  onConfirm: (key: ApiKey) => void;
}

const CreateKeyModal: React.FC<CreateKeyModalProps> = ({ onClose, onConfirm }) => {
  const [generatedKey, setGeneratedKey] = useState('');
  const [keyName, setKeyName] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate a random key on mount
    const randomHex = Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2);
    setGeneratedKey(`bn-${randomHex}`);
    
    // Generate a random default name
    const adjectives = ['green', 'blue', 'fast', 'smart', 'quiet', 'brave'];
    const nouns = ['bruce', 'wayne', 'stark', 'rogers', 'parker', 'kent'];
    const randomName = `${adjectives[Math.floor(Math.random() * adjectives.length)]}-${nouns[Math.floor(Math.random() * nouns.length)]}-${Math.floor(Math.random() * 10000)}`;
    setKeyName(randomName);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    const newKey: ApiKey = {
        id: `key_${Date.now()}`,
        name: keyName,
        key: generatedKey,
        maskedKey: `${generatedKey.substring(0, 6)}...${generatedKey.substring(generatedKey.length - 4)}`,
        createdBy: 'eng.user', // Mock user
        lastAccessed: 'Never',
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };
    onConfirm(newKey);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-2">Your API Key</h2>
        <p className="text-sm text-gray-500 mb-6">This will be the only time you can see your API key.</p>

        <div className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">API Key</label>
                <div className="flex gap-2">
                    <div className="flex-1 bg-blue-50 border border-blue-100 rounded-md px-3 py-2.5 text-sm font-mono text-gray-700 break-all select-all">
                        {generatedKey}
                    </div>
                    <button 
                        onClick={handleCopy}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 flex items-center justify-center transition-colors"
                        title="Copy to clipboard"
                    >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Key Name</label>
                <input 
                    type="text" 
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600">
                Please save it somewhere safe and accessible. <br/>
                If you lose your API key, you will need to generate a new one.
            </div>
        </div>

        <div className="mt-8 flex justify-end">
             <button 
                onClick={handleConfirm}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm w-full"
             >
                I have copied and saved the API Key
             </button>
        </div>

      </div>
    </div>
  );
};

export default CreateKeyModal;
