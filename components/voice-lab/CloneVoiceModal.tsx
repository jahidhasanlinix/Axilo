
import React, { useState } from 'react';
import { X, Upload, Mic } from 'lucide-react';
import { Voice } from '../../types';

interface CloneVoiceModalProps {
  onClose: () => void;
  onClone: (newVoice: Partial<Voice>) => void;
}

const CloneVoiceModal: React.FC<CloneVoiceModalProps> = ({ onClose, onClone }) => {
  const [provider, setProvider] = useState('Elevenlabs');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (!name || !file) return;

    onClone({
        name,
        provider,
        description,
        accent: 'Custom Cloned Voice',
        gender: 'Male', // Default for demo
        previewText: 'This is a preview of your newly cloned voice.',
        tags: ['cloned', 'custom']
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-1">Clone Voices</h2>
        <p className="text-sm text-gray-500 mb-6">Clone your own voices</p>

        <div className="space-y-5">
            <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Choose Voice Provider</label>
                <select 
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                    <option value="Elevenlabs">Elevenlabs</option>
                    <option value="Deepgram">Deepgram</option>
                    <option value="PlayHT">PlayHT</option>
                    <option value="Cartesia">Cartesia</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">New Voice Name</label>
                <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., 'Project Narration Voice'"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Description</label>
                <input 
                    type="text" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., 'Young female british accent'"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-1">
                        Import Voice Sample <span className="text-gray-400 font-normal">?</span>
                    </label>
                    <div className="relative border border-gray-300 rounded-md px-3 py-2 bg-white flex items-center">
                         <input 
                            type="file" 
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => e.target.files && setFile(e.target.files[0])}
                         />
                         <span className="text-sm font-semibold mr-2">Choose File</span>
                         <span className="text-sm text-gray-500 truncate">{file ? file.name : 'No file chosen'}</span>
                    </div>
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-900 mb-2">Sample Language</label>
                     <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        <option>Select Language</option>
                        <option>English</option>
                        <option>Hindi</option>
                    </select>
                </div>
            </div>
        </div>

        <div className="mt-8 flex justify-end">
             <button 
                onClick={handleSubmit}
                disabled={!file || !name}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
             >
                <Mic size={16} /> Clone voice
             </button>
        </div>

      </div>
    </div>
  );
};

export default CloneVoiceModal;
