
import React, { useState } from 'react';
import { X, CheckCircle2, Loader2, CreditCard, Zap } from 'lucide-react';
import { PAYMENT_PLANS, PRICING_TIERS } from '../../data/pricing';
import { paymentService } from '../../services/paymentService';

interface AddFundsModalProps {
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

const AddFundsModal: React.FC<AddFundsModalProps> = ({ onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'add_funds' | 'auto_recharge'>('add_funds');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('pay_as_you_go');
  const [selectedTierId, setSelectedTierId] = useState<string>('tier_10');
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto Recharge State
  const [rechargeAmount, setRechargeAmount] = useState<number>(10);
  const [thresholdAmount, setThresholdAmount] = useState<number>(10);

  const selectedTier = PRICING_TIERS.find(t => t.id === selectedTierId);

  const handlePayment = async () => {
    if (!selectedTier) return;
    
    setIsProcessing(true);
    try {
        const result = await paymentService.processPayment(selectedTier.amount);
        if (result.success) {
            // Success animation or delay could go here
            onSuccess(selectedTier.amount);
            onClose();
        } else {
            alert('Payment failed: ' + result.message);
        }
    } catch (error) {
        alert('An error occurred during payment processing.');
    } finally {
        setIsProcessing(false);
    }
  };

  const handleSaveAutoRecharge = async () => {
      setIsProcessing(true);
      await paymentService.configureAutoRecharge(rechargeAmount, thresholdAmount);
      setIsProcessing(false);
      alert('Auto-recharge settings saved!');
      onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 pb-0">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Manage payments</h2>
                    <p className="text-sm text-gray-500">Manage automated payments and adding credits to your account</p>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={24} />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-lg mt-6">
                <button
                    onClick={() => setActiveTab('add_funds')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'add_funds' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Add Funds
                </button>
                <button
                    onClick={() => setActiveTab('auto_recharge')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'auto_recharge' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Auto Recharge
                </button>
            </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
            {activeTab === 'add_funds' && (
                <div className="space-y-6">
                    {/* Plan Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        {PAYMENT_PLANS.map(plan => (
                            <div 
                                key={plan.id}
                                onClick={() => setSelectedPlanId(plan.id)}
                                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                    selectedPlanId === plan.id 
                                        ? 'border-blue-600 bg-blue-50' 
                                        : 'border-gray-200 hover:border-blue-200'
                                }`}
                            >
                                {plan.recommended && (
                                    <span className="absolute -top-3 -right-2 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200 uppercase tracking-wide">
                                        Recommended
                                    </span>
                                )}
                                <div className="flex items-start gap-3">
                                    <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center ${
                                        selectedPlanId === plan.id ? 'border-blue-600' : 'border-gray-300'
                                    }`}>
                                        {selectedPlanId === plan.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">{plan.name}</h4>
                                        <p className="text-xs text-gray-500 mt-1 leading-snug">{plan.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <hr className="border-gray-100" />

                    {/* Amount Selection Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        {PRICING_TIERS.map(tier => (
                            <div 
                                key={tier.id}
                                onClick={() => setSelectedTierId(tier.id)}
                                className={`p-4 rounded-lg border cursor-pointer transition-all relative ${
                                    selectedTierId === tier.id 
                                        ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' 
                                        : 'border-gray-200 hover:border-blue-300'
                                }`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                        selectedTierId === tier.id ? 'border-blue-600' : 'border-gray-300'
                                    }`}>
                                        {selectedTierId === tier.id && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                                    </div>
                                    <span className="font-bold text-gray-900 text-sm">Pay ${tier.amount}</span>
                                </div>
                                
                                <div className="pl-6">
                                    <p className="text-xs text-gray-500">
                                        Add {tier.credits.toLocaleString()} credits
                                    </p>
                                    {selectedTierId === tier.id && (
                                        <p className="font-bold text-gray-900 text-sm mt-0.5">
                                            {(tier.credits + (tier.bonusText ? parseInt(tier.bonusText) / 100 * tier.credits : 0)).toLocaleString()} credits
                                        </p>
                                    )}
                                    {tier.bonusText && (
                                        <span className="mt-2 inline-block px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded border border-blue-200">
                                            {tier.bonusText}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'auto_recharge' && (
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Recharge Amount ($)</label>
                        <p className="text-xs text-gray-500 mb-2">Auto-recharge with amount (minimum: $10)</p>
                        <input 
                            type="number"
                            min="10"
                            value={rechargeAmount}
                            onChange={(e) => setRechargeAmount(Math.max(10, parseInt(e.target.value)))}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Trigger When Balance Falls Below ($)</label>
                        <p className="text-xs text-gray-500 mb-2">Auto-recharge when balance drops below this amount (minimum: $10)</p>
                        <input 
                            type="number"
                            min="10"
                            value={thresholdAmount}
                            onChange={(e) => setThresholdAmount(Math.max(10, parseInt(e.target.value)))}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-medium"
                        />
                    </div>

                    <p className="text-sm text-gray-600">
                        Automatically <span className="text-blue-600 font-medium underline decoration-dotted">charge ${rechargeAmount}</span> when your balance drops <span className="text-blue-600 font-medium underline decoration-dotted">below ${thresholdAmount}</span>.
                    </p>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end">
            {activeTab === 'add_funds' ? (
                <button 
                    onClick={handlePayment}
                    disabled={isProcessing || !selectedTier}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
                    Add ${selectedTier?.amount} to balance
                </button>
            ) : (
                <button 
                    onClick={handleSaveAutoRecharge}
                    disabled={isProcessing}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                    Enable auto recharge
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default AddFundsModal;
