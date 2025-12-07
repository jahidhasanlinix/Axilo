
import React, { useState } from 'react';
import { TeamMember, Role } from '../../types';
import { Plus, User, Trash2 } from 'lucide-react';
import InviteMemberModal from './InviteMemberModal';

interface TeamMembersTabProps {
  members: TeamMember[];
  onInvite: (email: string, role: Role) => void;
  onRemove: (id: string) => void;
}

const TeamMembersTab: React.FC<TeamMembersTabProps> = ({ members, onInvite, onRemove }) => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const handleInvite = (email: string, role: Role) => {
    onInvite(email, role);
    setIsInviteModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-end">
        <button 
            onClick={() => setIsInviteModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
        >
           <Plus size={16} /> Invite member
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {members.length > 0 ? (
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Role</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {members.map(member => (
                        <tr key={member.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{member.email}</td>
                            <td className="px-6 py-4 text-gray-600">{member.role}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                                    member.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {member.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button 
                                    onClick={() => onRemove(member.id)}
                                    className="text-gray-400 hover:text-red-600 transition-colors"
                                    title="Remove member"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <div className="p-12 text-center text-gray-500">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User size={24} className="text-gray-400" />
                </div>
                <p>No team members found.</p>
            </div>
        )}
      </div>

      {isInviteModalOpen && (
        <InviteMemberModal 
            onClose={() => setIsInviteModalOpen(false)} 
            onInvite={handleInvite} 
        />
      )}
    </div>
  );
};

export default TeamMembersTab;