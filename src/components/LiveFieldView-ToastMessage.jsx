import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const LiveFieldViewToastMessage = ({ 
  message, 
  type = 'success', 
  isVisible, 
  onClose, 
  duration = 3000 
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-600" />;
      case 'info':
        return <Info size={20} className="text-blue-600" />;
      default:
        return <CheckCircle size={20} className="text-green-600" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-900 border-green-600';
      case 'error':
        return 'bg-red-900 border-red-600';
      case 'info':
        return 'bg-blue-900 border-blue-600';
      default:
        return 'bg-green-900 border-green-600';
    }
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 max-w-sm w-full px-4">
      <div className={`${getBgColor()} border rounded-lg p-3 shadow-lg flex items-center space-x-3`}>
        {getIcon()}
        <span className="text-white text-sm flex-1">{message}</span>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-700 rounded-full transition-colors"
        >
          <X size={16} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default LiveFieldViewToastMessage;