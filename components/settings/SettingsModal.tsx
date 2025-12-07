
import React, { useState } from 'react';
import { X, HelpCircle, DollarSign } from 'lucide-react';
import { TeamMember, Role } from '../../types';
import AccountInfoTab from './AccountInfoTab';
import TeamMembersTab from './TeamMembersTab';
import ComplianceTab from './ComplianceTab';
import InvoicesTab from './InvoicesTab';

interface SettingsModalProps {
  onClose: () => void;
  onAddFunds: () => void;
  balance: number;
  teamMembers: TeamMember[];
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onAddFunds, balance, teamMembers, setTeamMembers }) => {
  const [activeTab, setActiveTab] = useState<'Account' | 'Team' | 'Compliance' | 'Invoices'>('Account');

  const handleInviteMember = (email: string, role: Role) => {
    const newMember: TeamMember = {
        id: `tm_${Date.now()}`,
        email,
        role,
        status: 'invited',
        joinedAt: new Date().toLocaleDateString()
    };
    setTeamMembers([...teamMembers, newMember]);
  };

  const handleRemoveMember = (id: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
        setTeamMembers(prev => prev.filter(m => m.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl h-[80vh] flex flex-col relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200">
            <div>
                <h2 className="text-xl font-bold text-gray-900">Workplace settings</h2>
                <p className="text-sm text-gray-500 mt-1">Manage workplace members, account information and view invoices</p>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200">
                    <span>Available balance: <span className="font-semibold text-gray-900">${balance.toFixed(2)}</span></span>
                </div>
                <button 
                    onClick={onAddFunds}
                    className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    <DollarSign size={16} /> Add more funds
                </button>
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors ml-2">
                    <X size={24} />
                </button>
            </div>
        </div>

        {/* Tabs */}
        <div className="px-8 border-b border-gray-200">
            <div className="flex gap-8">
                {['Account information', 'Team Members', 'Compliance settings', 'Invoices'].map((tabLabel) => {
                    const tabKey = tabLabel.split(' ')[0] as any; // Simple mapping
                    const isActive = activeTab === tabKey || (tabKey === 'Account' && activeTab === 'Account');
                    
                    return (
                        <button
                            key={tabLabel}
                            onClick={() => setActiveTab(tabKey)}
                            className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                                isActive 
                                    ? 'border-blue-600 text-blue-600' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tabLabel}
                        </button>
                    )
                })}
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
            {activeTab === 'Account' && <AccountInfoTab />}
            
            {activeTab === 'Team' && (
                <TeamMembersTab 
                    members={teamMembers} 
                    onInvite={handleInviteMember}
                    onRemove={handleRemoveMember}
                />
            )}

            {activeTab === 'Compliance' && (
                <ComplianceTab />
            )}

            {activeTab === 'Invoices' && (
                <InvoicesTab />
            )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
