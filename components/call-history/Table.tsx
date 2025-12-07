
import React from 'react';
import { CallExecution } from '../../types';
import { Search, ChevronLeft, ChevronRight, FileText, Mic, FileJson, ArrowUpRight } from 'lucide-react';

interface TableProps {
  logs: CallExecution[];
  onViewDetails: (log: CallExecution) => void;
}

const Table: React.FC<TableProps> = ({ logs, onViewDetails }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-100">
         <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
               type="text" 
               placeholder="Search by Execution id" 
               className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
         </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
           <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
             <tr>
               <th className="px-4 py-3">Execution ID</th>
               <th className="px-4 py-3">User Number</th>
               <th className="px-4 py-3">Conversation type</th>
               <th className="px-4 py-3">Duration (s)</th>
               <th className="px-4 py-3">Hangup by</th>
               <th className="px-4 py-3">Batch</th>
               <th className="px-4 py-3">Timestamp</th>
               <th className="px-4 py-3">Cost</th>
               <th className="px-4 py-3">Status</th>
               <th className="px-4 py-3">Conversation data</th>
               <th className="px-4 py-3">Trace data</th>
               <th className="px-4 py-3">Raw data</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-gray-100">
             {logs.map(log => (
               <tr key={log.id} className="hover:bg-gray-50 group">
                  <td className="px-4 py-3 text-blue-600 font-medium font-mono text-xs flex items-center gap-2">
                      {log.id.substring(0, 8)}...
                      <button className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" title="Copy ID">
                          <FileText size={12} />
                      </button>
                  </td>
                  <td className="px-4 py-3 text-gray-900">{log.user_number || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{log.conversation_type || 'websocket chat'}</td>
                  <td className="px-4 py-3 text-gray-900">{log.conversation_duration}</td>
                  <td className="px-4 py-3 text-gray-600">{log.hangup_by || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{log.batch_id || '-'}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute:'2-digit' })}
                  </td>
                  <td className="px-4 py-3 text-gray-900">${log.total_cost.toFixed(3)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                      log.status === 'completed' ? 'bg-green-100 text-green-700' : 
                      log.status === 'no-answer' ? 'bg-yellow-100 text-yellow-700' : 
                      log.status === 'ongoing' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                     <div className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded cursor-pointer transition-colors w-fit">
                        <span className="font-semibold text-xs">Recordings</span>
                        <ArrowUpRight size={12} className="text-gray-500" />
                        <span className="text-[10px] text-gray-500 block">transcripts, etc</span>
                     </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                     <ExternalLink size={16} className="cursor-pointer hover:text-blue-600" />
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                     <FileJson 
                        size={16} 
                        className="cursor-pointer hover:text-blue-600" 
                        onClick={() => onViewDetails(log)}
                     />
                  </td>
               </tr>
             ))}
             {logs.length === 0 && (
               <tr>
                 <td colSpan={12} className="px-4 py-8 text-center text-gray-500">
                   No records found
                 </td>
               </tr>
             )}
           </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-4">
         <div className="flex items-center gap-2">
           <span className="text-sm text-gray-600">Rows per page</span>
           <select className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none">
             <option>20</option>
             <option>50</option>
           </select>
         </div>
         <div className="flex items-center gap-2 text-sm text-gray-600">
           <span>Page 1 of 1</span>
           <div className="flex">
             <button className="p-1 border border-gray-300 rounded-l hover:bg-gray-50 disabled:opacity-50" disabled><ChevronLeft size={16} /></button>
             <button className="p-1 border-l-0 border border-gray-300 rounded-r hover:bg-gray-50 disabled:opacity-50" disabled><ChevronRight size={16} /></button>
           </div>
         </div>
      </div>
    </div>
  );
};

// Helper for icon
const ExternalLink = ({ size, className }: { size: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
)

export default Table;
