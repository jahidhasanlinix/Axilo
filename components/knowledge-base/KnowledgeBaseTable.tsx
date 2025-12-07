
import React from 'react';
import { KnowledgeBaseItem } from '../../types';
import { Trash2, FileText, Globe, Loader, CheckCircle, AlertCircle } from 'lucide-react';

interface KnowledgeBaseTableProps {
  items: KnowledgeBaseItem[];
  onDelete: (id: string) => void;
}

const KnowledgeBaseTable: React.FC<KnowledgeBaseTableProps> = ({ items, onDelete }) => {
  const getStatusBadge = (status: KnowledgeBaseItem['status']) => {
    switch (status) {
      case 'indexed':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
            <CheckCircle size={12} /> Indexed
          </span>
        );
      case 'processing':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
            <Loader size={12} className="animate-spin" /> Processing
          </span>
        );
      case 'error':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
            <AlertCircle size={12} /> Error
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 w-[200px]">RAG ID</th>
              <th className="px-6 py-3">Source</th>
              <th className="px-6 py-3 w-[100px]">Type</th>
              <th className="px-6 py-3 w-[200px]">Created</th>
              <th className="px-6 py-3 w-[150px]">Status</th>
              <th className="px-6 py-3 w-[100px] text-center">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.length > 0 ? (
              items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                       {item.type === 'PDF' ? <FileText size={16} className="text-red-500" /> : <Globe size={16} className="text-blue-500" />}
                       <span className="truncate max-w-[300px]" title={item.source}>{item.source}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.type}</td>
                  <td className="px-6 py-4 text-gray-600">{item.created}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onDelete(item.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                      title="Delete Knowledge Base"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                        <FileText size={24} />
                    </div>
                    <p className="text-sm font-medium text-gray-600">No knowledge bases found</p>
                    <p className="text-xs text-gray-400 max-w-xs mx-auto">Upload a PDF or add a URL to give your agent more context.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KnowledgeBaseTable;
