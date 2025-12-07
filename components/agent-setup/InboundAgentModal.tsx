
import React, { useState, useEffect } from 'react';
import { X, Phone, ShoppingCart, Check } from 'lucide-react';
import { Agent, PhoneNumber } from '../../types';

interface InboundAgentModalProps {
  agent: Agent;
  phoneNumbers: PhoneNumber[];
  onClose: () => void;
  onSave: (phoneNumberId: string) => void;
  onBuyNumberClick: () => void;
}

const InboundAgentModal: React.FC<InboundAgentModalProps> = ({ 
  agent, 
  phoneNumbers, 
  onClose, 
  onSave, 
  onBuyNumberClick 
}) => {
  const [selectedNumberId, setSelectedNumberId] = useState<string>('');

  // Filter numbers: allow numbers that are unassigned OR assigned to this specific agent
  const availableNumbers = phoneNumbers.filter(
    n => !n.agentId || n.agentId === agent.id
  );

  // Set initial selection if agent already has a number
  useEffect(() => {
    const currentNumber = phoneNumbers.find(n => n.agentId === agent.id);
    if (currentNumber) {
      setSelectedNumberId(currentNumber.id);
    } else if (availableNumbers.length > 0) {
      setSelectedNumberId(availableNumbers[0].id);
    }
  }, [agent.id, phoneNumbers]);

  const handleSave = () => {
    if (selectedNumberId) {
      onSave(selectedNumberId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-1 leading-snug pr-8">
          Set phone number for your <span className="text-blue-600 bg-blue-50 px-1 rounded">{agent.name}</span> agent
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Please choose a number which the agent will answer, or <button onClick={onBuyNumberClick} className="underline decoration-dotted text-gray-600 hover:text-blue-600">buy a new number</button>.
        </p>

        {availableNumbers.length > 0 ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Select Phone Number</label>
              <div className="relative">
                <select
                  value={selectedNumberId}
                  onChange={(e) => setSelectedNumberId(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-300 pl-4 pr-10 py-2.5 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="" disabled>Select a number</option>
                  {availableNumbers.map(num => (
                    <option key={num.id} value={num.id}>
                      {num.number} ({num.telephony})
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <Phone size={16} />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Only numbers not currently assigned to other agents are shown.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={handleSave}
                disabled={!selectedNumberId}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Check size={16} /> Assign Number
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-200 shadow-sm">
                <Phone size={20} className="text-gray-400" />
            </div>
            <p className="text-gray-900 font-medium mb-1">No available numbers found</p>
            <p className="text-xs text-gray-500 mb-4 px-4">
              You don't have any free phone numbers to assign to this agent.
            </p>
            <button 
              onClick={onBuyNumberClick}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 mx-auto"
            >
              <ShoppingCart size={16} /> Buy phone numbers
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InboundAgentModal;
