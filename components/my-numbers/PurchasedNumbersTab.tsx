
import React, { useState } from 'react';
import { PhoneNumber } from '../../types';
import { Search, X, Plus, Trash2, Phone, Loader2 } from 'lucide-react';
import CreateComplianceModal from '../settings/compliance/CreateComplianceModal';

const COUNTRIES = [
  { code: 'US', name: 'United States', prefix: '+1' },
  { code: 'IN', name: 'India', prefix: '+91' },
  { code: 'GB', name: 'United Kingdom', prefix: '+44' },
  { code: 'CA', name: 'Canada', prefix: '+1' },
  { code: 'AU', name: 'Australia', prefix: '+61' },
];

interface PurchasedNumbersTabProps {
  numbers?: PhoneNumber[];
  setNumbers?: React.Dispatch<React.SetStateAction<PhoneNumber[]>>;
}

const PurchasedNumbersTab: React.FC<PurchasedNumbersTabProps> = ({ numbers = [], setNumbers }) => {
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [searchPattern, setSearchPattern] = useState('');
  const [availableNumbers, setAvailableNumbers] = useState<string[]>([]);
  const [selectedNumberToBuy, setSelectedNumberToBuy] = useState('');
  
  // Temp state to hold the number while filling compliance
  const [pendingNumber, setPendingNumber] = useState<string | null>(null);

  const handleSearch = () => {
    setIsLoading(true);
    setAvailableNumbers([]);
    setSelectedNumberToBuy('');

    // Simulate API search delay
    setTimeout(() => {
      const generatedNumbers = Array.from({ length: 5 }).map(() => {
        const prefix = selectedCountry.prefix;
        const areaCode = searchPattern ? searchPattern : Math.floor(Math.random() * 900) + 100;
        const middle = Math.floor(Math.random() * 900) + 100;
        const end = Math.floor(Math.random() * 9000) + 1000;
        return `${prefix} ${areaCode}${middle}${end}`;
      });
      setAvailableNumbers(generatedNumbers);
      setIsLoading(false);
    }, 1000);
  };

  const handlePurchaseClick = () => {
    if (!selectedNumberToBuy) return;
    setPendingNumber(selectedNumberToBuy);
    setIsModalOpen(false);
    setIsComplianceModalOpen(true);
  };

  const handleComplianceSubmit = (data: any) => {
    // Simulate successful compliance check and purchase
    if (pendingNumber && setNumbers) {
        const newNumber: PhoneNumber = {
            id: `pn_${Date.now()}`,
            number: pendingNumber,
            telephony: 'Twilio',
            boughtOn: new Date().toLocaleDateString(),
            renewsOn: new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString(),
            monthlyRent: 5.00,
            agentId: ''
        };
        setNumbers(prev => [...prev, newNumber]);
    }
    
    // Reset
    setIsComplianceModalOpen(false);
    setPendingNumber(null);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSearchPattern('');
    setAvailableNumbers([]);
    setSelectedNumberToBuy('');
    setPendingNumber(null);
  };

  const handleDelete = (id: string) => {
    if (setNumbers) {
        setNumbers(prev => prev.filter(n => n.id !== id));
    }
  };

  const handleUnlink = (id: string) => {
      if (setNumbers) {
          setNumbers(prev => prev.map(n => n.id === id ? { ...n, agentId: '' } : n));
      }
  };

  // Calculate renewal date for display
  const renewalDate = new Date();
  renewalDate.setFullYear(renewalDate.getFullYear() + 1); // Mocking 1 year or 1 month based on requirement, screenshots says 2026 so ~1 year or month logic.
  const renewalDateString = renewalDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
        >
           <Plus size={16} /> Buy phone number
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">Phone number</th>
                <th className="px-6 py-3">Agent answering this phone number</th>
                <th className="px-6 py-3">Telephony</th>
                <th className="px-6 py-3">Bought on</th>
                <th className="px-6 py-3">Renews on</th>
                <th className="px-6 py-3">Monthly rent</th>
                <th className="px-6 py-3">Unlink agent from phone</th>
                <th className="px-6 py-3">Delete phone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {numbers.length > 0 ? (
                numbers.map(num => (
                  <tr key={num.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{num.number}</td>
                    <td className="px-6 py-4">
                      {num.agentId ? (
                         <span className="text-blue-600 font-medium cursor-pointer">Agent {num.agentId}</span>
                      ) : (
                         <span className="text-gray-400 italic">No agent linked</span>
                      )}
                    </td>
                    <td className="px-6 py-4">{num.telephony}</td>
                    <td className="px-6 py-4">{num.boughtOn}</td>
                    <td className="px-6 py-4">{num.renewsOn}</td>
                    <td className="px-6 py-4">${num.monthlyRent.toFixed(2)}</td>
                    <td className="px-6 py-4">
                        <button 
                            onClick={() => handleUnlink(num.id)}
                            className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-50" 
                            disabled={!num.agentId}
                        >
                            Unlink
                        </button>
                    </td>
                    <td className="px-6 py-4">
                        <button 
                            onClick={() => handleDelete(num.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                        <Phone size={32} className="text-gray-300" />
                        <p>You haven't purchased any numbers yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Buy Number Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative animate-in zoom-in-95 duration-200">
                <button 
                    onClick={handleCloseModal}
                    className="absolute right-6 top-6 text-gray-400 hover:text-gray-600"
                >
                    <X size={24} />
                </button>
                
                <h2 className="text-xl font-bold text-gray-900 mb-1">Buy phone number</h2>
                <p className="text-sm text-gray-500 mb-6">Select your country and optionally add a pattern.</p>

                <div className="text-sm text-gray-600 mb-6 leading-relaxed">
                    For example, to search for phone numbers in the US starting with a 615 prefix, specify 615. Search results will be in the form "{selectedCountry.prefix}615XXXXXX"
                </div>

                <div className="flex gap-3 mb-4">
                    <div className="w-[180px]">
                        <select 
                            value={selectedCountry.code}
                            onChange={(e) => setSelectedCountry(COUNTRIES.find(c => c.code === e.target.value) || COUNTRIES[0])}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                        >
                            {COUNTRIES.map(c => (
                                <option key={c.code} value={c.code}>{c.code.toLowerCase()} {c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1">
                        <input 
                            type="text" 
                            placeholder="Pattern: 615"
                            value={searchPattern}
                            onChange={(e) => setSearchPattern(e.target.value.replace(/\D/g, ''))}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                    </div>
                    <button 
                        onClick={handleSearch}
                        disabled={isLoading}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2 min-w-[90px] justify-center"
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <><Search size={16} /> Search</>}
                    </button>
                </div>

                <div className="mb-6">
                    {availableNumbers.length > 0 ? (
                        <select 
                            value={selectedNumberToBuy}
                            onChange={(e) => setSelectedNumberToBuy(e.target.value)}
                            className="w-full px-3 py-2.5 border border-blue-500 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                        >
                             <option value="" disabled>Select phone number</option>
                             {availableNumbers.map(num => (
                                 <option key={num} value={num}>{num}</option>
                             ))}
                        </select>
                    ) : (
                        <div className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm text-gray-400 bg-gray-50 cursor-not-allowed">
                            Select phone number
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-end pt-4 border-t border-gray-100">
                    <button 
                        onClick={handlePurchaseClick}
                        disabled={!selectedNumberToBuy}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                    >
                        Purchase number for $5 / month
                    </button>
                    <p className="text-xs text-gray-500">
                        Your subscription will automatically renew on {renewalDateString}.
                    </p>
                </div>
            </div>
        </div>
      )}

      {/* Compliance Modal Triggered by Purchase */}
      {isComplianceModalOpen && (
          <CreateComplianceModal 
            onClose={() => setIsComplianceModalOpen(false)}
            onCreate={handleComplianceSubmit}
          />
      )}
    </div>
  );
};

export default PurchasedNumbersTab;
