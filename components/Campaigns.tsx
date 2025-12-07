
import React, { useState } from 'react';
import { Campaign, Agent, Workflow } from '../types';
import { Search, PlusCircle, RotateCw } from 'lucide-react';
import CampaignList from './campaigns/CampaignList';
import CreateCampaignModal from './campaigns/CreateCampaignModal';

interface CampaignsProps {
  campaigns: Campaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  agents: Agent[];
  workflows: Workflow[];
}

const Campaigns: React.FC<CampaignsProps> = ({ campaigns, setCampaigns, agents, workflows }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredCampaigns = campaigns.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCampaign = (newCampaignData: Partial<Campaign>) => {
    const newCampaign: Campaign = {
        id: `camp_${Date.now()}`,
        name: newCampaignData.name || 'New Campaign',
        description: newCampaignData.description || '',
        status: 'draft',
        agentId: newCampaignData.agentId || '',
        workflowId: newCampaignData.workflowId || '',
        fileName: newCampaignData.fileName || '',
        createdAt: new Date().toLocaleDateString(),
        stats: {
            total: 100, // Mock
            completed: 0,
            connected: 0,
            failed: 0
        }
    };
    setCampaigns(prev => [newCampaign, ...prev]);
    setIsCreateModalOpen(false);
  };

  const handleDeleteCampaign = (id: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
        setCampaigns(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
       {/* Actions Bar */}
       <div className="flex justify-between items-center">
            <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Search campaigns..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                />
            </div>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors">
                <RotateCw size={18} />
            </button>
       </div>

       {/* Create Campaign Banner/Button */}
       <div 
         onClick={() => setIsCreateModalOpen(true)}
         className="bg-white border border-gray-200 border-dashed rounded-lg p-4 flex items-center justify-between cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group"
       >
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <PlusCircle size={20} />
              </div>
              <div>
                  <h3 className="font-bold text-gray-900 text-sm group-hover:text-blue-700">Create New Campaign</h3>
                  <p className="text-xs text-gray-500">Click to create a new campaign and start reaching out to your contacts.</p>
              </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:text-blue-600">
              <PlusCircle size={18} />
          </div>
       </div>

       {/* Campaign List */}
       <div className="animate-in fade-in duration-300">
          <CampaignList 
            campaigns={filteredCampaigns}
            agents={agents}
            workflows={workflows}
            onDelete={handleDeleteCampaign}
          />
       </div>

       {/* Create Modal */}
       {isCreateModalOpen && (
           <CreateCampaignModal 
                agents={agents}
                workflows={workflows}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateCampaign}
           />
       )}
    </div>
  );
};

export default Campaigns;
