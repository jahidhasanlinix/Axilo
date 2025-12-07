
import React from 'react';
import { HelpCircle, DollarSign, Menu } from 'lucide-react';

interface TopBarProps {
  title: string;
  subtitle: string;
  onAddFunds?: () => void;
  balance?: number;
  onMenuClick?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ title, subtitle, onAddFunds, balance = 5.00, onMenuClick }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 fixed top-0 right-0 z-10 transition-[left] duration-300 left-0 md:left-64">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate max-w-[150px] sm:max-w-none">{title}</h1>
          <p className="text-xs text-gray-500 hidden sm:block">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="hidden sm:inline">Available balance:</span> <span className="font-semibold text-gray-900">${balance.toFixed(2)}</span>
        </div>
        <button 
          onClick={onAddFunds}
          className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <DollarSign size={16} />
          <span className="hidden sm:inline">Add funds</span>
        </button>
        <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <HelpCircle size={16} />
          Help
        </button>
      </div>
    </header>
  );
};

export default TopBar;
