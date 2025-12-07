
import React, { useState } from 'react';
import { ConnectedProvider, ProviderDefinition } from '../types';
import { PROVIDER_REGISTRY } from '../data/providers';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import ProviderCard from './providers/ProviderCard';
import ConnectProviderModal from './providers/ConnectProviderModal';

interface ProvidersProps {
  connectedProviders: ConnectedProvider[];
  setConnectedProviders: React.Dispatch<React.SetStateAction<ConnectedProvider[]>>;
}

const Providers: React.FC<ProvidersProps> = ({ connectedProviders, setConnectedProviders }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<ProviderDefinition | null>(null);

  const handleConnect = (providerId: string, config: Record<string, string>) => {
      const newConnection: ConnectedProvider = {
          providerId,
          config,
          connectedAt: new Date().toISOString(),
          status: 'active'
      };
      
      // Remove existing if any (re-connect)
      const others = connectedProviders.filter(p => p.providerId !== providerId);
      setConnectedProviders([...others, newConnection]);
  };

  const handleDisconnect = (providerId: string) => {
      if (confirm('Are you sure you want to disconnect this provider? Agents using this provider might stop working.')) {
          setConnectedProviders(prev => prev.filter(p => p.providerId !== providerId));
      }
  };

  const filteredProviders = PROVIDER_REGISTRY.filter(provider => 
      provider.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="max-w-3xl">
            <h2 className="text-lg font-bold text-gray-900">Providers</h2>
            <p className="text-sm text-gray-500 mt-1">
                Add keys securely to connect your own Providers within Axilo.
            </p>
        </div>
        <div className="flex items-center gap-2">
             <button className="bg-white border border-gray-300 p-2 rounded-md hover:bg-gray-50">
                 <SlidersHorizontal size={18} className="text-gray-600" />
             </button>
        </div>
      </div>

      <div className="mb-6">
          <div className="relative max-w-sm">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
             <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter providers..." 
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
             />
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
        {filteredProviders.map(provider => {
            const isConnected = connectedProviders.some(cp => cp.providerId === provider.id);
            return (
                <ProviderCard 
                    key={provider.id}
                    definition={provider}
                    isConnected={isConnected}
                    onConnect={() => setSelectedProvider(provider)}
                    onDisconnect={() => handleDisconnect(provider.id)}
                />
            );
        })}
      </div>

      {filteredProviders.length === 0 && (
          <div className="text-center py-20 bg-white border border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">No providers found matching your search.</p>
          </div>
      )}

      {selectedProvider && (
          <ConnectProviderModal 
            provider={selectedProvider}
            onClose={() => setSelectedProvider(null)}
            onConnect={handleConnect}
          />
      )}
    </div>
  );
};

export default Providers;
