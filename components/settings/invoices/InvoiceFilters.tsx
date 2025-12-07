
import React from 'react';
import { Calendar } from 'lucide-react';
import { InvoiceStatus, InvoiceItemType } from '../../../types';

interface InvoiceFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  statusFilter: InvoiceStatus | 'All Statuses';
  onStatusChange: (val: InvoiceStatus | 'All Statuses') => void;
  typeFilter: InvoiceItemType | 'All Item Types';
  onTypeChange: (val: InvoiceItemType | 'All Item Types') => void;
  dateRange: string;
}

const InvoiceFilters: React.FC<InvoiceFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  dateRange
}) => {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex-1 max-w-xs">
        <input 
            type="text" 
            placeholder="Filter by Invoice ID..." 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="flex-shrink-0">
        <select 
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as any)}
            className="px-3 py-2 border border-blue-500 rounded-md text-sm text-gray-700 bg-white focus:outline-none ring-1 ring-blue-500"
        >
            <option value="All Statuses">All Statuses</option>
            <option value="Subscription Cancelled">Subscription Cancelled</option>
            <option value="Due">Due</option>
            <option value="Subscription Active">Subscription Active</option>
            <option value="Fulfilled">Fulfilled</option>
        </select>
      </div>

      <div className="flex-shrink-0">
        <select 
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <option value="All Item Types">All Item Types</option>
            <option value="Phone number">Phone number</option>
            <option value="Credits">Credits</option>
        </select>
      </div>

      <div className="flex-shrink-0 relative">
         <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700">
             <Calendar size={16} className="text-gray-500" />
             <span>{dateRange}</span>
         </div>
      </div>
    </div>
  );
};

export default InvoiceFilters;
