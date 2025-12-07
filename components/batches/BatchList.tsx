
import React from 'react';
import { Batch } from '../../types';
import { Play, Pause, Square, Download, Trash2, Info, FileSpreadsheet, Loader2 } from 'lucide-react';

interface BatchListProps {
  batches: Batch[];
  onRun: (id: string) => void;
  onStop: (id: string) => void;
  onDownload: (batch: Batch) => void;
  onDelete: (id: string) => void;
}

const BatchList: React.FC<BatchListProps> = ({ batches, onRun, onStop, onDownload, onDelete }) => {
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
          case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
          case 'Running': return 'bg-blue-100 text-blue-700 border-blue-200';
          case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
          case 'Stopped': return 'bg-red-100 text-red-700 border-red-200';
          case 'Paused': return 'bg-orange-100 text-orange-700 border-orange-200';
          default: return 'bg-gray-100 text-gray-700 border-gray-200';
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
                        <tr key={batch.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs text-gray-600">{batch.id}</td>
                            <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                                <FileSpreadsheet size={16} className="text-green-600" />
                                {batch.fileName}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                                <span className="font-semibold text-gray-900">{batch.validContacts}</span> / {batch.totalContacts}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1.5 w-fit ${getStatusColor(batch.executionStatus)}`}>
                                    {batch.executionStatus === 'Running' && <Loader2 size={10} className="animate-spin" />}
                                    {batch.executionStatus}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{batch.workflow}</td>
                            
                            {/* Run Button */}
                            <td className="px-6 py-4 text-center">
                                <button 
                                    onClick={() => onRun(batch.id)}
                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed" 
                                    disabled={batch.executionStatus === 'Running' || batch.executionStatus === 'Completed'}
                                    title="Run Batch"
                                >
                                    <Play size={16} />
                                </button>
                            </td>

                            {/* Stop Button */}
                            <td className="px-6 py-4 text-center">
                                <button 
                                    onClick={() => onStop(batch.id)}
                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed" 
                                    disabled={batch.executionStatus !== 'Running'}
                                    title="Stop Batch"
                                >
                                    <Square size={16} />
                                </button>
                            </td>

                            {/* Download Button */}
                            <td className="px-6 py-4 text-center">
                                <button 
                                    onClick={() => onDownload(batch)}
                                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                                    title="Download Report"
                                >
                                    <Download size={16} />
                                </button>
                            </td>

                            <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{batch.createdAt}</td>
                            
                            {/* Delete Button */}
                            <td className="px-6 py-4 text-center">
                                <button 
                                    onClick={() => onDelete(batch.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Delete Batch"
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
