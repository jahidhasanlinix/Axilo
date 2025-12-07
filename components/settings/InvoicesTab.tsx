
import React, { useState } from 'react';
import { Invoice, InvoiceStatus, InvoiceItemType } from '../../types';
import InvoiceFilters from './invoices/InvoiceFilters';
import InvoiceList from './invoices/InvoiceList';

// Mock Data
const MOCK_INVOICES: Invoice[] = [
    {
        id: 'inv_102938',
        itemValue: '+1 (555) 123-4567',
        itemType: 'Phone number',
        totalAmount: 1.15,
        status: 'Fulfilled',
        createdOn: 'Dec 15, 2025',
        downloadUrl: '#'
    },
    {
        id: 'inv_102939',
        itemValue: '10,000 Credits',
        itemType: 'Credits',
        totalAmount: 100.00,
        status: 'Subscription Active',
        createdOn: 'Dec 10, 2025',
        downloadUrl: '#'
    },
    {
        id: 'inv_102940',
        itemValue: '5,000 Credits',
        itemType: 'Credits',
        totalAmount: 50.00,
        status: 'Due',
        createdOn: 'Dec 05, 2025',
        downloadUrl: '#'
    },
    {
        id: 'inv_102941',
        itemValue: '+1 (555) 987-6543',
        itemType: 'Phone number',
        totalAmount: 1.15,
        status: 'Subscription Cancelled',
        createdOn: 'Nov 28, 2025',
        downloadUrl: '#'
    }
];

const InvoicesTab: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'All Statuses'>('All Statuses');
  const [typeFilter, setTypeFilter] = useState<InvoiceItemType | 'All Item Types'>('All Item Types');
  const [dateRange] = useState('Dec 02, 2025 - Dec 18, 2025');

  const filteredInvoices = invoices.filter(inv => {
      const matchesSearch = inv.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All Statuses' || inv.status === statusFilter;
      const matchesType = typeFilter === 'All Item Types' || inv.itemType === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="animate-in fade-in duration-300">
      <InvoiceFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        dateRange={dateRange}
      />
      <InvoiceList invoices={filteredInvoices} />
    </div>
  );
};

export default InvoicesTab;
