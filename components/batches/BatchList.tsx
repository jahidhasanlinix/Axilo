
import React from 'react';
import { Batch } from '../../types';
import { Play, Pause, Square, Download, Trash2, Info } from 'lucide-react';

interface BatchListProps {
  batches: Batch[];
  onDelete: (id: string) => void;
}

const BatchList: React.FC<BatchListProps> = ({ batches, onDelete }) => {
  if (batches.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Info size={32} className="text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-900">No batches found</p>
            <p className="text-sm text-gray-500 mt-1">Upload a CSV file to get started with this agent.</p>
        </div>
    );
  }

  const getStatusColor = (status: Batch['executionStatus']) => {
      switch (status) {
          case 'Completed': return 'bg-green-100 text-green-700';
          case 'Running': return 'bg-blue-100 text-blue-700';
          case 'Pending': return 'bg-yellow-100 text-yellow-700';
          default: return 'bg-gray-100 text-gray-700';
      }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-3">Batch ID</th>
                        <th className="px-6 py-3">File name</th>
                        <th className="px-6 py-3">Uploaded contacts <span className="text-xs font-normal text-gray-400 block">(# valid / # total)</span></th>
                        <th className="px-6 py-3">Execution Status</th>
                        <th className="px-6 py-3">Batch Status</th>
                        <th className="px-6 py-3">Workflow</th>
                        <th className="px-6 py-3 text-center">Run now</th>
                        <th className="px-6 py-3 text-center">Stop batch</th>
                        <th className="px-6 py-3 text-center">Download report</th>
                        <th className="px-6 py-3">Created at</th>
                        <th className="px-6 py-3 text-center">Delete batch</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {batches.map(batch => (
                        <tr key={batch.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-mono text-xs text-gray-600">{batch.id}</td>
                            <td className="px-6 py-4 font-medium text-gray-900">{batch.fileName}</td>
                            <td className="px-6 py-4 text-gray-600">
                                {batch.validContacts} / {batch.totalContacts}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(batch.executionStatus)}`}>
                                    {batch.executionStatus}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-gray-700">{batch.batchStatus}</span>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{batch.workflow}</td>
                            <td className="px-6 py-4 text-center">
                                <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-30" disabled={batch.executionStatus === 'Running' || batch.executionStatus === 'Completed'}>
                                    <Play size={16} />
                                </button>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-30" disabled={batch.executionStatus !== 'Running'}>
                                    <Square size={16} />
                                </button>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                                    <Download size={16} />
                                </button>
                            </td>
                            <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{batch.createdAt}</td>
                            <td className="px-6 py-4 text-center">
                                <button 
                                    onClick={() => onDelete(batch.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default BatchList;