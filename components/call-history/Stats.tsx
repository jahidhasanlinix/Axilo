
import React, { useMemo } from 'react';
import { Phone, Clock } from 'lucide-react';
import { CallExecution } from '../../types';

interface StatsProps {
  logs: CallExecution[];
}

const Stats: React.FC<StatsProps> = ({ logs }) => {
  const stats = useMemo(() => {
    const totalExecutions = logs.length;
    const totalCost = logs.reduce((acc, log) => acc + log.total_cost, 0);
    const totalDuration = logs.reduce((acc, log) => acc + log.conversation_duration, 0);
    
    const completed = logs.filter(l => l.status === 'completed').length;
    const failed = logs.filter(l => l.status === 'failed').length;
    const noAnswer = logs.filter(l => l.status === 'no-answer').length;
    
    const avgCost = totalExecutions > 0 ? totalCost / totalExecutions : 0;
    const avgDuration = totalExecutions > 0 ? totalDuration / totalExecutions : 0;

    return {
        totalExecutions,
        totalCost,
        totalDuration,
        completed,
        failed,
        noAnswer,
        avgCost,
        avgDuration
    };
  }, [logs]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500 font-medium mb-1 flex items-center justify-between">
             Total Executions <Phone size={14} className="text-gray-400"/>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalExecutions}</div>
          <div className="text-xs text-gray-400 mt-1">All call attempts</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
           <div className="text-sm text-gray-500 font-medium mb-1">Total Cost</div>
           <div className="text-2xl font-bold text-gray-900">${stats.totalCost.toFixed(2)}</div>
           <div className="text-xs text-gray-400 mt-1">Total campaign spend</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
           <div className="text-sm text-gray-500 font-medium mb-1 flex items-center justify-between">
              Total Duration <Clock size={14} className="text-gray-400"/>
           </div>
           <div className="text-2xl font-bold text-gray-900">{stats.totalDuration}s</div>
           <div className="text-xs text-gray-400 mt-1">Total call time</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
           <div className="text-sm text-gray-500 font-medium mb-1">Status Counts</div>
           <div className="flex flex-wrap gap-1 mt-2">
               {stats.completed > 0 && (
                   <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Completed: {stats.completed}</div>
               )}
               {stats.failed > 0 && (
                   <div className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">Failed: {stats.failed}</div>
               )}
               {stats.noAnswer > 0 && (
                   <div className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">No Answer: {stats.noAnswer}</div>
               )}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
           <div className="text-sm text-gray-500 font-medium mb-1">Avg Cost</div>
           <div className="text-2xl font-bold text-gray-900">${stats.avgCost.toFixed(2)}</div>
           <div className="text-xs text-gray-400 mt-1">Average cost per call</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
           <div className="text-sm text-gray-500 font-medium mb-1 flex items-center justify-between">
             Avg Duration <Clock size={14} className="text-gray-400"/>
           </div>
           <div className="text-2xl font-bold text-gray-900">{stats.avgDuration.toFixed(1)}s</div>
           <div className="text-xs text-gray-400 mt-1">Average call length</div>
        </div>
      </div>
    </>
  );
};

export default Stats;
