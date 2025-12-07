
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Phone, MessageSquare, Mail, Clock, GitBranch, Edit, Trash2 } from 'lucide-react';
import { WorkflowNodeData } from '../../types';

interface WorkflowNodeProps {
  data: WorkflowNodeData;
}

const WorkflowNode: React.FC<WorkflowNodeProps> = ({ data }) => {
  const getIcon = () => {
    switch (data.type) {
      case 'Call': return <Phone size={20} className="text-blue-600" />;
      case 'SMS': return <MessageSquare size={20} className="text-purple-600" />;
      case 'Email': return <Mail size={20} className="text-orange-600" />;
      case 'Wait': return <Clock size={20} className="text-gray-600" />;
      case 'Condition': return <GitBranch size={20} className="text-teal-600" />;
      default: return <Phone size={20} className="text-blue-600" />;
    }
  };

  return (
    <div className="w-[280px] bg-white rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-shadow group relative">
      <div className="p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-gray-900 truncate">{data.label}</h3>
          <p className="text-sm text-gray-500 truncate">{data.delay || 'No delay'}</p>
        </div>
      </div>
      
      <div className="flex border-t border-gray-100">
        <button 
          onClick={data.onEdit}
          className="flex-1 py-2 text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 rounded-bl-lg"
        >
          <Edit size={12} /> Edit
        </button>
        <div className="w-[1px] bg-gray-100"></div>
        <button 
          onClick={data.onDelete}
          className="flex-1 py-2 text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 rounded-br-lg"
        >
          <Trash2 size={12} />
        </button>
      </div>

      <div className="absolute top-1/2 -left-2 transform -translate-y-1/2">
        <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-blue-400 !border-2 !border-white" />
      </div>
      <div className="absolute top-1/2 -right-2 transform -translate-y-1/2">
        <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-blue-400 !border-2 !border-white" />
      </div>
    </div>
  );
};

export default memo(WorkflowNode);
