
import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { Role } from '../../types';

interface InviteMemberModalProps {
  onClose: () => void;
  onInvite: (email: string, role: Role) => void;
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ onClose, onInvite }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('Viewer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onInvite(email, role);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-1">Invite member</h2>
        <p className="text-sm text-gray-500 mb-6">Invite a new member to your team.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Email address</label>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="bob@yourcompany.com"
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Role</label>
                <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                    <option value="Admin">Admin</option>
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
                </select>
            </div>

            <div className="flex justify-end pt-4">
                <button 
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                >
                    <UserPlus size={16} /> Send invitation
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default InviteMemberModal;