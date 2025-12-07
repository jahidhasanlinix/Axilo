
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

  // Simulation Effect: Automatically complete running batches after 10 seconds to simulate processing
  useEffect(() => {
    const interval = setInterval(() => {
        setBatches(prevBatches => 
            prevBatches.map(batch => {
                if (batch.executionStatus === 'Running') {
                    // Random chance to complete to simulate work
                    if (Math.random() > 0.8) {
                        return { ...batch, executionStatus: 'Completed' };
                    }
                }
                return batch;
            })
        );
    }, 3000);

    return () => clearInterval(interval);
  }, [setBatches]);

  const selectedAgent = agents.find(a => a.id === selectedAgentId);
  const agentBatches = batches.filter(b => b.agentId === selectedAgentId);

  const handleCreateBatch = (newBatchData: Partial<Batch>) => {
    const total = newBatchData.totalContacts || 0;
    const valid = newBatchData.validContacts || total; // Assuming all valid for mock if not specified

    const newBatch: Batch = {
        id: `batch_${Date.now()}`,
        agentId: selectedAgentId,
        fileName: newBatchData.fileName || 'contacts.csv',
        validContacts: valid,
        totalContacts: total,
        executionStatus: newBatchData.executionStatus || 'Pending',
        batchStatus: 'Active',
        workflow: newBatchData.workflow || 'Standard Call',
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        scheduledAt: newBatchData.scheduledAt
    };
    
    setBatches(prev => [newBatch, ...prev]);
    setIsUploadModalOpen(false);
  };

  const handleDeleteBatch = (id: string) => {
      if (confirm('Are you sure you want to delete this batch? All call records associated with it will remain in call history.')) {
          setBatches(prev => prev.filter(b => b.id !== id));
      }
  };

  const handleRunBatch = (id: string) => {
      setBatches(prev => prev.map(b => b.id === id ? { ...b, executionStatus: 'Running' } : b));
  };

  const handleStopBatch = (id: string) => {
      setBatches(prev => prev.map(b => b.id === id ? { ...b, executionStatus: 'Stopped' } : b));
  };

  const handleDownloadReport = (batch: Batch) => {
      // Simulate creating a CSV report
      const headers = "Phone Number,Status,Duration,Cost,Sentiment\n";
      let content = headers;
      
      const statuses = ['Completed', 'No Answer', 'Failed', 'Voicemail'];
      const sentiments = ['Positive', 'Neutral', 'Negative'];

      for (let i = 0; i < batch.totalContacts; i++) {
          const phone = `+1555${Math.floor(Math.random() * 9000000) + 1000000}`;
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          const duration = status === 'Completed' ? Math.floor(Math.random() * 300) : 0;
          const cost = (duration / 60) * 0.12;
          const sentiment = status === 'Completed' ? sentiments[Math.floor(Math.random() * sentiments.length)] : '-';
          
          content += `${phone},${status},${duration}s,$${cost.toFixed(2)},${sentiment}\n`;
      }

      const blob = new Blob([content], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${batch.fileName}-${batch.id}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
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
          
          <div className="text-sm text-gray-500">
              Download a template sheet: <a 
                  href="https://docs.google.com/spreadsheets/d/16e7bEWqlWTVjCWDyurk6ZcRL8CtRwhCtuT0SQvkqNiQ/edit?usp=sharing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
              >
                  link
              </a>
          </div>

          <div className="flex items-center gap-6">
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
            onRun={handleRunBatch}
            onStop={handleStopBatch}
            onDownload={handleDownloadReport}
            onDelete={handleDeleteBatch} 
          />
      </div>
      
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
