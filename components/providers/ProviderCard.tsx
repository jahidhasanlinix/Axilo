
import React from 'react';
import { ProviderDefinition, ConnectedProvider } from '../../types';
import { Link, CheckCircle2, Bot, Mic, AudioWaveform, Phone, Wrench, Plug } from 'lucide-react';

interface ProviderCardProps {
  definition: ProviderDefinition;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ definition, isConnected, onConnect, onDisconnect }) => {
  
  const getIcon = () => {
      // Mapping categories to icons since we don't have brand logos
      switch (definition.category) {
          case 'LLM': return <Bot size={24} className="text-purple-600" />;
          case 'TTS': return <AudioWaveform size={24} className="text-orange-500" />;
          case 'STT': return <Mic size={24} className="text-red-500" />;
          case 'Telephony': return <Phone size={24} className="text-green-600" />;
          case 'Tools': return <Wrench size={24} className="text-blue-500" />;
          default: return <Plug size={24} className="text-gray-500" />;
      }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                {getIcon()}
            </div>
            <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider border border-gray-200 px-1.5 py-0.5 rounded">{definition.category}</span>
                <h3 className="text-lg font-bold text-gray-900 mt-1">{definition.name}</h3>
            </div>
        </div>
      </div>
      
      {/* Description can be here if needed */}
      {/* <p className="text-sm text-gray-500 mb-4">{definition.description}</p> */}

      <div className="flex justify-end mt-4">
          {isConnected ? (
              <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1.5 rounded-md text-sm font-medium">
                      <CheckCircle2 size={16} /> Connected
                  </div>
                  <button 
                    onClick={onDisconnect}
                    className="text-gray-400 hover:text-red-500 text-sm font-medium transition-colors"
                  >
                      Disconnect
                  </button>
              </div>
          ) : (
              <button 
                onClick={onConnect}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors text-sm"
              >
                  <Link size={16} /> Connect
              </button>
          )}
      </div>
    </div>
  );
};

export default ProviderCard;
