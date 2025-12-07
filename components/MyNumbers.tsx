
import React, { useState } from 'react';
import PurchasedNumbersTab from './my-numbers/PurchasedNumbersTab';
import VerifiedNumbersTab from './my-numbers/VerifiedNumbersTab';
import { PhoneNumber } from '../types';

interface MyNumbersProps {
  phoneNumbers?: PhoneNumber[];
  setPhoneNumbers?: React.Dispatch<React.SetStateAction<PhoneNumber[]>>;
}

const MyNumbers: React.FC<MyNumbersProps> = ({ phoneNumbers = [], setPhoneNumbers }) => {
  const [activeTab, setActiveTab] = useState<'purchased' | 'verified'>('purchased');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
          <h2 className="text-2xl font-bold text-gray-900">
              {activeTab === 'purchased' ? 'My phone numbers' : 'My verified phone numbers'}
          </h2>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
          <div className="flex gap-8">
              <button
                  onClick={() => setActiveTab('purchased')}
                  className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'purchased' 
                          ? 'border-blue-600 text-blue-600' 
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                  Purchased numbers
              </button>
              <button
                  onClick={() => setActiveTab('verified')}
                  className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'verified' 
                          ? 'border-blue-600 text-blue-600' 
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                  Verified numbers
              </button>
          </div>
      </div>

      {/* Content */}
      <div className="animate-in fade-in duration-300">
          {activeTab === 'purchased' ? (
              <PurchasedNumbersTab 
                numbers={phoneNumbers}
                setNumbers={setPhoneNumbers}
              />
          ) : (
              <VerifiedNumbersTab />
          )}
      </div>
    </div>
  );
};

export default MyNumbers;
