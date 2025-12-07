
import React, { useState } from 'react';
import { Voice } from '../../types';
import { Play, Pause, Plus, Check, Trash2 } from 'lucide-react';

interface VoiceCardProps {
  voice: Voice;
  onToggleAdd: (id: string) => void;
}

const VoiceCard: React.FC<VoiceCardProps> = ({ voice, onToggleAdd }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(voice.previewText);
    // Try to find a matching voice in the browser to make it sound slightly different if possible
    // This is just for demo simulation; normally we would play an audio file
    const voices = window.speechSynthesis.getVoices();
    const specificVoice = voices.find(v => v.name.includes(voice.gender) || v.lang.includes('en'));
    if (specificVoice) utterance.voice = specificVoice;
    
    utterance.onend = () => setIsPlaying(false);
    
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-gray-900 text-sm">{voice.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{voice.accent} by {voice.provider.toLowerCase()}</p>
        </div>
        <button
          onClick={() => onToggleAdd(voice.id)}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
            voice.isAdded 
              ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
              : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600'
          }`}
        >
          {voice.isAdded ? (
            <>
              <Trash2 size={12} /> Remove
            </>
          ) : (
            <>
              <Plus size={12} /> Add Voice
            </>
          )}
        </button>
      </div>

      <div className="mt-4 flex-1">
        <div className="relative">
             <input 
                type="text" 
                readOnly 
                value={voice.previewText}
                className="w-full text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded p-3 pr-10 focus:outline-none"
             />
             <button 
                onClick={handlePlay}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
             >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
             </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceCard;
