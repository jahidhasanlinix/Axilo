
import React, { useState } from 'react';
import { X, Download } from 'lucide-react';
import { Voice } from '../../types';

interface ImportVoiceModalProps {
  onClose: () => void;
  onImport: (newVoice: Partial<Voice>) => void;
}

const ImportVoiceModal: React.FC<ImportVoiceModalProps> = ({ onClose, onImport }) => {
  const [provider, setProvider] = useState('Elevenlabs');
  const [voiceId, setVoiceId] = useState('');

  const handleSubmit = () => {
    if (!voiceId) return;

    onImport({
        id: voiceId,
        name: 'Imported Voice ' + voiceId.substring(0, 4),
        provider,
        accent: 'Unknown',
        gender: 'Female',
        description: 'Imported from external provider',
        previewText: 'This is a preview of your imported voice.',
        tags: ['imported']
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-1">Import Voices</h2>
        <p className="text-sm text-gray-500 mb-6">Import additional voices or your own custom voices</p>

        <div className="space-y-5">
            <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Choose Voice Provider</label>
                <select 
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-500 rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                    <option value="Elevenlabs">Elevenlabs</option>
                    <option value="Deepgram">Deepgram</option>
                    <option value="PlayHT">PlayHT</option>
                    <option value="Cartesia">Cartesia</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Import Voice ID</label>
                <input 
                    type="text" 
                    value={voiceId}
                    onChange={(e) => setVoiceId(e.target.value)}
                    placeholder="Enter Voice ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900">Import from connected account</span>
                <div className="relative inline-block w-10 h-6 align-middle select-none transition duration-200 ease-in">
                    <input 
                        type="checkbox" 
                        name="toggle" 
                        id="toggle" 
                        className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 ease-in-out left-0.5 top-1"
                    />
                    <label 
                        htmlFor="toggle" 
                        className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-200 cursor-pointer"
                    ></label>
                </div>
            </div>
        </div>

        <div className="mt-8 flex justify-end">
             <button 
                onClick={handleSubmit}
                disabled={!voiceId}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
             >
                <Download size={16} /> Import voice
             </button>
        </div>

      </div>
    </div>
  );
};

export default ImportVoiceModal;
