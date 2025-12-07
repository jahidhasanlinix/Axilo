
import React from 'react';
import { Invoice } from '../../../types';
import { Download, ChevronDown } from 'lucide-react';

interface InvoiceListProps {
  invoices: Invoice[];
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices }) => {
  const getStatusColor = (status: Invoice['status']) => {
      switch (status) {
          case 'Fulfilled': return 'bg-green-100 text-green-700';
          case 'Subscription Active': return 'bg-blue-100 text-blue-700';
          case 'Due': return 'bg-yellow-100 text-yellow-700';
          case 'Subscription Cancelled': return 'bg-red-100 text-red-700';
          default: return 'bg-gray-100 text-gray-700';
      }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-3">Invoice ID</th>
                        <th className="px-6 py-3">Item value</th>
                        <th className="px-6 py-3">Item type</th>
                        <th className="px-6 py-3">Total amount (USD)</th>
                        <th className="px-6 py-3 text-center">Download invoice</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-center">Action</th>
                        <th className="px-6 py-3 whitespace-nowrap">Created on <ChevronDown size={14} className="inline ml-1" /></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {invoices.length > 0 ? (
                        invoices.map(invoice => (
                            <tr key={invoice.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-mono text-xs text-gray-600">{invoice.id}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{invoice.itemValue}</td>
                                <td className="px-6 py-4 text-gray-600">{invoice.itemType}</td>
                                <td className="px-6 py-4 text-gray-900 font-medium">${invoice.totalAmount.toFixed(2)}</td>
                                <td className="px-6 py-4 text-center">
                                    <button className="text-blue-600 hover:text-blue-800 transition-colors">
                                        <Download size={18} className="mx-auto" />
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                                        {invoice.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button className="text-gray-400 hover:text-blue-600 text-xs font-medium">View</button>
                                </td>
                                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{invoice.createdOn}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={8} className="px-6 py-16 text-center text-gray-500">
                                No invoices found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default InvoiceList;
