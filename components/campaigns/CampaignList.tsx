
import React from 'react';
import { Campaign, Agent, Workflow } from '../../types';
import { Play, Pause, Square, Trash2, Megaphone } from 'lucide-react';

interface CampaignListProps {
  campaigns: Campaign[];
  agents: Agent[];
  workflows: Workflow[];
  onDelete: (id: string) => void;
}

const CampaignList: React.FC<CampaignListProps> = ({ campaigns, agents, workflows, onDelete }) => {
  if (campaigns.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center py-24 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <Megaphone size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No campaigns found</h3>
            <p className="text-sm text-gray-500">Get started by creating your first campaign</p>
        </div>
    );
  }

  const getStatusColor = (status: Campaign['status']) => {
      switch (status) {
          case 'completed': return 'bg-green-100 text-green-700';
          case 'running': return 'bg-blue-100 text-blue-700';
          case 'scheduled': return 'bg-yellow-100 text-yellow-700';
          case 'paused': return 'bg-orange-100 text-orange-700';
          default: return 'bg-gray-100 text-gray-700';
      }
  };

  const getAgentName = (id: string) => agents.find(a => a.id === id)?.name || 'Unknown Agent';
  const getWorkflowTitle = (id: string) => workflows.find(w => w.id === id)?.title || 'Unknown Workflow';

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-3">Campaign Name</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Agent</th>
                        <th className="px-6 py-3">Workflow</th>
                        <th className="px-6 py-3">Progress</th>
                        <th className="px-6 py-3">Created At</th>
                        <th className="px-6 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {campaigns.map(campaign => (
                        <tr key={campaign.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">
                                {campaign.name}
                                {campaign.description && <div className="text-xs text-gray-500 truncate max-w-[200px]">{campaign.description}</div>}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(campaign.status)}`}>
                                    {campaign.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{getAgentName(campaign.agentId)}</td>
                            <td className="px-6 py-4 text-gray-600">{getWorkflowTitle(campaign.workflowId)}</td>
                            <td className="px-6 py-4 min-w-[150px]">
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                                    <div 
                                        className="bg-blue-600 h-1.5 rounded-full" 
                                        style={{ width: `${(campaign.stats.completed / campaign.stats.total) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="text-xs text-gray-500 flex justify-between">
                                    <span>{campaign.stats.completed}/{campaign.stats.total} completed</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{campaign.createdAt}</td>
                            <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    {campaign.status === 'running' ? (
                                        <button className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded" title="Pause">
                                            <Pause size={16} />
                                        </button>
                                    ) : (
                                        <button className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded" title="Start">
                                            <Play size={16} />
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => onDelete(campaign.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default CampaignList;
