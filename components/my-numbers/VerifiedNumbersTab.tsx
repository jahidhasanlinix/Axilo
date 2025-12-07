
import React, { useState } from 'react';
import { VerifiedNumber } from '../../types';
import { Phone, Trash2, CheckCircle2 } from 'lucide-react';
import VerifyNumberModal from './VerifyNumberModal';

const VerifiedNumbersTab: React.FC = () => {
  const [verifiedNumbers, setVerifiedNumbers] = useState<VerifiedNumber[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVerify = (data: Omit<VerifiedNumber, 'id' | 'status' | 'createdAt'>) => {
      const newNumber: VerifiedNumber = {
          id: `vn_${Date.now()}`,
          phoneNumber: data.phoneNumber,
          status: 'Verified',
          createdAt: new Date().toLocaleDateString()
      };
      setVerifiedNumbers(prev => [newNumber, ...prev]);
  };

  const handleRemove = (id: string) => {
      if (confirm('Are you sure you want to remove this verified number?')) {
          setVerifiedNumbers(prev => prev.filter(n => n.id !== id));
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
          <p className="text-sm text-gray-500 max-w-2xl">
              Phone numbers to which calls can be made while the account is in trial.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm"
          >
             Verify phone number
          </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">Phone Number</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3 text-right">Remove Phone number</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {verifiedNumbers.length > 0 ? (
                verifiedNumbers.map(num => (
                  <tr key={num.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{num.phoneNumber}</td>
                    <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                            <CheckCircle2 size={12} /> {num.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{num.createdAt}</td>
                    <td className="px-6 py-4 text-right">
                        <button 
                            onClick={() => handleRemove(num.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <p>No verified phone numbers added yet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
          <VerifyNumberModal 
            onClose={() => setIsModalOpen(false)}
            onVerify={handleVerify}
          />
      )}
    </div>
  );
};

export default VerifiedNumbersTab;
