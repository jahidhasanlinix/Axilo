
import React, { useState } from 'react';
import { ApiKey } from '../types';
import { PlusCircle, Trash2, Key, Info } from 'lucide-react';
import CreateKeyModal from './developers/CreateKeyModal';

interface DevelopersProps {
  apiKeys: ApiKey[];
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKey[]>>;
}

const Developers: React.FC<DevelopersProps> = ({ apiKeys, setApiKeys }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateKey = (newKey: ApiKey) => {
    setApiKeys(prev => [newKey, ...prev]);
    setIsModalOpen(false);
  };

  const handleDeleteKey = (id: string) => {
    if (confirm('Are you sure you want to delete this API Key? This action cannot be undone and any applications using this key will stop working.')) {
        setApiKeys(prev => prev.filter(k => k.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="max-w-3xl">
            <h2 className="text-lg font-bold text-gray-900">Developers</h2>
            <p className="text-sm text-gray-500 mt-1">
                These keys can be used to read and write data to Axilo. Please do not share these keys and make sure you store them somewhere secure.
            </p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
        >
           <PlusCircle size={16} /> Create a new API Key
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">Key Identifier</th>
                <th className="px-6 py-3">API Key</th>
                <th className="px-6 py-3">Created By</th>
                <th className="px-6 py-3">Last accessed</th>
                <th className="px-6 py-3">Created At</th>
                <th className="px-6 py-3 text-center">Delete key</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {apiKeys.length > 0 ? (
                apiKeys.map(key => (
                  <tr key={key.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{key.name}</td>
                    <td className="px-6 py-4 font-mono text-gray-600">{key.maskedKey}</td>
                    <td className="px-6 py-4 text-gray-600">{key.createdBy}</td>
                    <td className="px-6 py-4 text-gray-600">{key.lastAccessed}</td>
                    <td className="px-6 py-4 text-gray-600">{key.createdAt}</td>
                    <td className="px-6 py-4 text-center">
                        <button 
                            onClick={() => handleDeleteKey(key.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded hover:bg-red-50"
                        >
                            <Trash2 size={16} />
                        </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                            <Key size={24} />
                        </div>
                        <p className="font-medium text-gray-600">No keys found.</p>
                        <p className="text-xs text-gray-400">Create a key to get started with the API.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <CreateKeyModal 
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleCreateKey}
        />
      )}
    </div>
  );
};

export default Developers;
