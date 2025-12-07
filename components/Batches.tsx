
import React, { useState, useEffect } from 'react';
import { Agent, Batch } from '../types';
import { ChevronDown, FileSpreadsheet } from 'lucide-react';
import UploadBatchModal from './batches/UploadBatchModal';
import BatchList from './batches/BatchList';

interface BatchesProps {
  agents: Agent[];
  batches: Batch[];
  setBatches: React.Dispatch<React.SetStateAction<Batch[]>>;
}

const Batches: React.FC<BatchesProps> = ({ agents, batches, setBatches }) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Initialize selected agent
  useEffect(() => {
    if (agents.length > 0 && !selectedAgentId) {
        setSelectedAgentId(agents[0].id);
    }
  }, [agents, selectedAgentId]);

  const selectedAgent = agents.find(a => a.id === selectedAgentId);
  const agentBatches = batches.filter(b => b.agentId === selectedAgentId);

  const handleCreateBatch = (newBatchData: Partial<Batch>) => {
    const newBatch: Batch = {
        id: `batch_${Date.now()}`,
        agentId: selectedAgentId,
        fileName: newBatchData.fileName || 'unknown.csv',
        validContacts: newBatchData.validContacts || 0,
        totalContacts: newBatchData.totalContacts || 0,
        executionStatus: 'Pending',
        batchStatus: 'Active',
        workflow: newBatchData.workflow || 'Standard',
        createdAt: newBatchData.createdAt || new Date().toLocaleDateString(),
        scheduledAt: newBatchData.scheduledAt
    };
    
    setBatches(prev => [newBatch, ...prev]);
    setIsUploadModalOpen(false);
  };

  const handleDeleteBatch = (id: string) => {
      if (confirm('Are you sure you want to delete this batch?')) {
          setBatches(prev => prev.filter(b => b.id !== id));
      }
  };

  if (agents.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p>You need to create an agent before managing batches.</p>
          </div>
      )
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
              <div className="relative w-80">
                  <select
                      value={selectedAgentId}
                      onChange={(e) => setSelectedAgentId(e.target.value)}
                      className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  >
                      {agents.map(agent => (
                          <option key={agent.id} value={agent.id}>{agent.name}</option>
                      ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
          </div>
          
          <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-blue-600 hover:underline">Download a template sheet: link</a>
              <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
              >
                  <FileSpreadsheet size={16} /> Upload Batch
              </button>
          </div>
      </div>
      
      {/* Batch List Content */}
      <div className="animate-in fade-in duration-300">
          <BatchList 
            batches={agentBatches} 
            onDelete={handleDeleteBatch} 
          />
      </div>
      
      {/* Empty State / Select Prompt if needed, though handled by default selection */}
      {!selectedAgent && (
          <div className="text-center py-10 text-gray-500">
              Select an agent to view its batches.
          </div>
      )}

      {/* Modals */}
      {isUploadModalOpen && selectedAgent && (
          <UploadBatchModal 
            agent={selectedAgent} 
            onClose={() => setIsUploadModalOpen(false)} 
            onCreateBatch={handleCreateBatch} 
          />
      )}
    </div>
  );
};

export default Batches;