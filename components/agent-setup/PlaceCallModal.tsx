
import React, { useState } from 'react';
import { X, Phone, Loader2 } from 'lucide-react';

interface PlaceCallModalProps {
  onClose: () => void;
  onCall: (phoneNumber: string, provider: string) => void;
  onBuyNumberClick: () => void;
}

const COUNTRIES = [
  { code: 'US', name: 'United States', prefix: '+1' },
  { code: 'IN', name: 'India', prefix: '+91' },
  { code: 'GB', name: 'United Kingdom', prefix: '+44' },
  { code: 'CA', name: 'Canada', prefix: '+1' },
  { code: 'AU', name: 'Australia', prefix: '+61' },
];

const PlaceCallModal: React.FC<PlaceCallModalProps> = ({ onClose, onCall, onBuyNumberClick }) => {
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [provider, setProvider] = useState('Axilo managed phone numbers');
  const [isCalling, setIsCalling] = useState(false);

  const handleCall = () => {
    if (!phoneNumber) return;
    
    setIsCalling(true);
    // Simulate API call delay
    setTimeout(() => {
        onCall(`${country.prefix} ${phoneNumber}`, provider);
        setIsCalling(false);
        onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-1">Place outbound calls</h2>
        <p className="text-sm text-gray-500 mb-6">
            Enter phone numbers with country code<br/>
            (for example: +16282774700)
        </p>

        <div className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Calling to:</label>
                <div className="flex gap-3">
                    <select 
                        value={country.code}
                        onChange={(e) => setCountry(COUNTRIES.find(c => c.code === e.target.value) || COUNTRIES[0])}
                        className="w-24 px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                    >
                        {COUNTRIES.map(c => (
                            <option key={c.code} value={c.code}>{c.code}</option>
                        ))}
                    </select>
                    <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
                            {country.prefix}
                        </span>
                        <input 
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            placeholder="Enter phone number"
                            autoFocus
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Calls can be made using:</label>
                <select 
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                >
                    <option>Axilo managed phone numbers</option>
                    <option>My Custom Numbers</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">
                    You can <button onClick={onBuyNumberClick} className="underline decoration-dotted text-gray-600 hover:text-blue-600 font-medium">purchase phone numbers</button> to start making calls from your own custom numbers.
                </p>
            </div>
        </div>

        <div className="mt-8 flex justify-end">
             <button 
                onClick={handleCall}
                disabled={!phoneNumber || isCalling}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
             >
                {isCalling ? <Loader2 size={16} className="animate-spin" /> : 'Place call'}
             </button>
        </div>

      </div>
    </div>
  );
};

export default PlaceCallModal;
