import React from 'react';
import { ArrowLeft, Menu } from 'lucide-react';

const Header = ({ title, showBack = false, onBack }) => (
  <div className="bg-white shadow-sm border-b border-gray-100 px-4 py-4 flex items-center justify-between">
    <div className="flex items-center space-x-3">
      {showBack && (
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
      )}
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
    </div>
    <Menu size={24} className="text-gray-600" />
  </div>
);

export default Header;