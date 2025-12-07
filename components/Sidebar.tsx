
import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Phone, 
  Database, 
  Layers, 
  Mic, 
  Code2, 
  Box, 
  GitBranch, 
  Megaphone, 
  FileText, 
  Settings,
  ChevronRight,
  LogOut,
  CreditCard,
  UserCheck
} from 'lucide-react';
import { View } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onAddFunds: () => void;
  onOpenSettings: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onAddFunds, onOpenSettings, isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const menuItems: { icon: any, label: string, view: View }[] = [
    { icon: LayoutDashboard, label: 'Agent Setup', view: 'agent-setup' },
    { icon: Phone, label: 'Call History', view: 'call-history' },
    { icon: Phone, label: 'My numbers', view: 'my-numbers' },
    { icon: Database, label: 'Knowledge Base', view: 'knowledge-base' },
    { icon: Layers, label: 'Batches', view: 'batches' },
    { icon: Mic, label: 'Voice Lab', view: 'voice-lab' },
    { icon: Code2, label: 'Developers', view: 'developers' },
    { icon: Box, label: 'Providers', view: 'providers' },
    { icon: GitBranch, label: 'Workflows', view: 'workflows' },
    { icon: Megaphone, label: 'Campaigns', view: 'campaigns' },
    { icon: FileText, label: 'Documentation', view: 'documentation' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity"
          onClick={onClose}
        ></div>
      )}

      <div className={`w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed top-0 left-0 z-30 transition-transform duration-300 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
              <span className="text-xl font-bold text-gray-800 tracking-tight">AXILO</span>
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Platform</div>
          <nav className="space-y-1 px-2">
            {menuItems.map((item) => (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentView === item.view 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-100 relative" ref={profileMenuRef}>
          {isProfileMenuOpen && (
              <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 py-1 overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-200">
                  <button 
                      onClick={() => { setIsProfileMenuOpen(false); onAddFunds(); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                      <CreditCard size={16} className="text-gray-400" /> Recharge Account
                  </button>
                  <button 
                      onClick={() => { setIsProfileMenuOpen(false); onOpenSettings(); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                      <Settings size={16} className="text-gray-400" /> Account Settings
                  </button>
                  <button 
                      onClick={() => { setIsProfileMenuOpen(false); onNavigate('my-numbers'); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                      <UserCheck size={16} className="text-gray-400" /> Verified numbers
                  </button>
                  <div className="h-px bg-gray-100 my-1"></div>
                  <button 
                    onClick={logout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                      <LogOut size={16} /> Logout
                  </button>
              </div>
          )}
          
          <div 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${isProfileMenuOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden">
                {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                    <Settings size={16} />
                )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
            </div>
            <ChevronRight size={16} className={`text-gray-400 transition-transform ${isProfileMenuOpen ? '-rotate-90' : ''}`} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
