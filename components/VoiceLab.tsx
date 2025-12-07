
import React, { useState } from 'react';
import { Voice } from '../types';
import { Search, ChevronDown, Copy, Download } from 'lucide-react';
import VoiceCard from './voice-lab/VoiceCard';
import CloneVoiceModal from './voice-lab/CloneVoiceModal';
import ImportVoiceModal from './voice-lab/ImportVoiceModal';

interface VoiceLabProps {
  voices: Voice[];
  setVoices: React.Dispatch<React.SetStateAction<Voice[]>>;
}

const VoiceLab: React.FC<VoiceLabProps> = ({ voices, setVoices }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English (United States)');
  const [selectedProvider, setSelectedProvider] = useState('All');
  
  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Filter Logic
  const filteredVoices = voices.filter(voice => {
    const matchesSearch = voice.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          voice.accent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvider = selectedProvider === 'All' || voice.provider === selectedProvider;
    // Mock language matching based on accent description for this demo
    // const matchesLanguage = selectedLanguage === 'All' || voice.accent.includes(selectedLanguage.split(' ')[0]);
    
    return matchesSearch && matchesProvider;
  });

  const toggleAddVoice = (id: string) => {
    setVoices(prev => prev.map(v => v.id === id ? { ...v, isAdded: !v.isAdded } : v));
  };

  const handleCloneVoice = (newVoiceData: Partial<Voice>) => {
    const newVoice: Voice = {
        id: `v_cloned_${Date.now()}`,
        name: newVoiceData.name || 'Cloned Voice',
        provider: newVoiceData.provider || 'Elevenlabs',
        accent: newVoiceData.accent || 'Custom',
        gender: newVoiceData.gender || 'Female',
        description: newVoiceData.description || '',
        previewText: newVoiceData.previewText || 'Preview text',
        isAdded: true,
        tags: newVoiceData.tags || ['custom']
    };
    setVoices([newVoice, ...voices]);
    setIsCloneModalOpen(false);
  };

  const handleImportVoice = (newVoiceData: Partial<Voice>) => {
    const newVoice: Voice = {
        id: newVoiceData.id || `v_imported_${Date.now()}`,
        name: newVoiceData.name || 'Imported Voice',
        provider: newVoiceData.provider || 'Elevenlabs',
        accent: newVoiceData.accent || 'Unknown',
        gender: newVoiceData.gender || 'Female',
        description: newVoiceData.description || '',
        previewText: newVoiceData.previewText || 'Preview text',
        isAdded: true,
        tags: newVoiceData.tags || ['imported']
    };
    setVoices([newVoice, ...voices]);
    setIsImportModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        {/* Filters */}
        <div className="flex items-center gap-3 flex-1">
             <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Search voice, accent ..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                />
             </div>
             
             <div className="relative">
                <select 
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 pl-4 pr-8 py-2 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    <option>English (United States)</option>
                    <option>English (UK)</option>
                    <option>Hindi</option>
                    <option>Spanish</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
             </div>

             <div className="relative">
                <select 
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 pl-4 pr-8 py-2 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    <option value="All">All Providers</option>
                    <option value="Elevenlabs">Elevenlabs</option>
                    <option value="Deepgram">Deepgram</option>
                    <option value="PlayHT">PlayHT</option>
                    <option value="Cartesia">Cartesia</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
             </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
             <button 
                onClick={() => setIsCloneModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
             >
                <Copy size={16} /> Clone voices
             </button>
             <button 
                onClick={() => setIsImportModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
             >
                <Download size={16} /> Import voices
             </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredVoices.map(voice => (
             <VoiceCard key={voice.id} voice={voice} onToggleAdd={toggleAddVoice} />
         ))}
      </div>

      {filteredVoices.length === 0 && (
          <div className="text-center py-20 text-gray-500">
              No voices found matching your filters.
          </div>
      )}

      {/* Modals */}
      {isCloneModalOpen && (
          <CloneVoiceModal onClose={() => setIsCloneModalOpen(false)} onClone={handleCloneVoice} />
      )}
      
      {isImportModalOpen && (
          <ImportVoiceModal onClose={() => setIsImportModalOpen(false)} onImport={handleImportVoice} />
      )}
    </div>
  );
};

export default VoiceLab;
