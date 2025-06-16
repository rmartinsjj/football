import React from 'react';
import { ArrowLeft, Menu } from 'lucide-react';

const Header = ({ title, showBack = false, onBack }) => (
  <div className="bg-white shadow-sm border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
    <div className="flex items-center space-x-3">
      {showBack && (
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors active:bg-gray-200"
        >
          <ArrowLeft size={22} className="text-gray-600" />
        </button>
      )}
      <h1 className="text-lg font-bold text-gray-900 truncate">{title}</h1>
    </div>
    <Menu size={22} className="text-gray-600" />
  </div>
);

export default Header;