
import React, { useState } from 'react';
import { X, Loader2, MessageSquare, Check } from 'lucide-react';
import { VerifiedNumber } from '../../types';

interface VerifyNumberModalProps {
  onClose: () => void;
  onVerify: (number: Omit<VerifiedNumber, 'id' | 'status' | 'createdAt'>) => void;
}

const COUNTRIES = [
  { code: 'US', prefix: '+1' },
  { code: 'IN', prefix: '+91' },
  { code: 'GB', prefix: '+44' },
];

const VerifyNumberModal: React.FC<VerifyNumberModalProps> = ({ onClose, onVerify }) => {
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!phoneNumber) return;
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep('otp');
  };

  const handleVerifyOtp = async () => {
    if (!otp) return;
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onVerify({
        phoneNumber: `${countryCode} ${phoneNumber}`
    });
    
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-1">Verify phone numbers</h2>
        <p className="text-sm text-gray-500 mb-6">While in trial - you can verify your phone numbers to enable calls.</p>

        {step === 'input' ? (
            <div className="space-y-6">
                <div className="flex gap-3">
                    <select 
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-24 px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                    >
                        {COUNTRIES.map(c => (
                            <option key={c.code} value={c.prefix}>{c.code} {c.prefix}</option>
                        ))}
                    </select>
                    <input 
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter phone number"
                        className="flex-1 px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                </div>

                <div className="flex justify-end">
                    <button 
                        onClick={handleSendOtp}
                        disabled={!phoneNumber || isLoading}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <MessageSquare size={16} />}
                        Send OTP for verification
                    </button>
                </div>
            </div>
        ) : (
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP sent to {countryCode} {phoneNumber}</label>
                    <input 
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="1234"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm tracking-widest text-center font-mono text-lg"
                        maxLength={4}
                        autoFocus
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button 
                        onClick={() => setStep('input')}
                        className="px-4 py-2.5 border border-gray-300 rounded-md font-medium text-sm hover:bg-gray-50 text-gray-700"
                    >
                        Back
                    </button>
                    <button 
                        onClick={handleVerifyOtp}
                        disabled={otp.length !== 4 || isLoading}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                        Verify
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default VerifyNumberModal;
