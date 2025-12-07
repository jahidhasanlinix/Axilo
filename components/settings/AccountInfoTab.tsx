
import React from 'react';
import { ExternalLink } from 'lucide-react';

const AccountInfoTab: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Pricing Information */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
            Pricing information 
            <a href="#" className="text-blue-600 text-xs font-normal underline flex items-center gap-0.5">
                Learn more about how pricing works <ExternalLink size={10} />
            </a>
        </h3>
        
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-3">Component</th>
                        <th className="px-6 py-3">Price (in cents)</th>
                        <th className="px-6 py-3">Pulse (in seconds)</th>
                        <th className="px-6 py-3">Price (per minute in cents)</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">Voice agent cost</td>
                        <td className="px-6 py-4 text-gray-600">pay as you go</td>
                        <td className="px-6 py-4 text-gray-600">60s</td>
                        <td className="px-6 py-4 text-gray-600">pay as you go</td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">Telephony</td>
                        <td className="px-6 py-4 text-gray-600">pay as you go</td>
                        <td className="px-6 py-4 text-gray-600">60s</td>
                        <td className="px-6 py-4 text-gray-600">pay as you go</td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">Axilo Platform</td>
                        <td className="px-6 py-4 text-gray-600">2</td>
                        <td className="px-6 py-4 text-gray-600">60s</td>
                        <td className="px-6 py-4 text-gray-600">2</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>

      {/* Concurrency Information */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
            Concurrency information
            <a href="#" className="text-blue-600 text-xs font-normal underline flex items-center gap-0.5">
                Learn more about concurrency tiers <ExternalLink size={10} />
            </a>
        </h3>
        
        <div className="grid grid-cols-2 gap-8">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500 font-medium mb-1">Current ongoing calls</div>
                <div className="text-2xl font-bold text-gray-900">0</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500 font-medium mb-1">Total concurrency</div>
                <div className="text-2xl font-bold text-gray-900">2</div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfoTab;
