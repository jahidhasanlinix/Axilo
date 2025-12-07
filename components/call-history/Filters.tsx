
import React from 'react';
import { RotateCw, Download, Calendar } from 'lucide-react';
import { Agent } from '../../types';

interface FiltersProps {
  agents: Agent[];
  selectedAgentId: string;
  onSelectAgent: (id: string) => void;
  selectedBatch: string;
  onSelectBatch: (batch: string) => void;
  dateRange: string;
  onRefresh: () => void;
}

const Filters: React.FC<FiltersProps> = ({ 
  agents, 
  selectedAgentId, 
  onSelectAgent, 
  selectedBatch, 
  onSelectBatch,
  dateRange,
  onRefresh
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
         {/* Agent Selector */}
         <select 
            value={selectedAgentId} 
            onChange={(e) => onSelectAgent(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
         >
           <option value="all">All Agents</option>
           {agents.map(agent => (
             <option key={agent.id} value={agent.id}>{agent.name}</option>
           ))}
         </select>
         
         {/* Batch Selector */}
         <select 
            value={selectedBatch} 
            onChange={(e) => onSelectBatch(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
         >
           <option value="all">Choose batch</option>
           <option value="batch_a">Batch A</option>
           <option value="batch_b">Batch B</option>
         </select>
         
         {/* Date Range Picker (Mocked) */}
         <div className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-700 flex items-center gap-2 cursor-pointer hover:bg-gray-50">
           <Calendar size={14} className="text-gray-500" />
           <span>{dateRange}</span>
         </div>
      </div>
      
      <div className="flex gap-2">
        <button 
            onClick={onRefresh}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <RotateCw size={16} /> Refresh
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          <Download size={16} /> Download records
        </button>
      </div>
    </div>
  );
};

export default Filters;
