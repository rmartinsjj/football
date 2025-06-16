import React from 'react';

const LiveFieldViewGoalkeeperConfig = ({ 
  goalkeepers, 
  setGoalkeepers, 
  isVisible 
}) => {
  if (!isVisible) return null;

  return (
    <div className="bg-gray-700 rounded-lg p-3 mb-3">
      <h5 className="text-white text-xs font-medium mb-2">Goleiros desta partida:</h5>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Goleiro Esquerdo:</label>
          <input
            type="text"
            value={goalkeepers.left.name}
            onChange={(e) => {
              setGoalkeepers(prev => ({
                ...prev,
                left: { name: e.target.value }
              }));
            }}
            className="w-full px-2 py-1 bg-gray-600 text-white text-xs rounded border border-gray-500 focus:border-blue-500 focus:outline-none"
            placeholder="Nome do goleiro"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Goleiro Direito:</label>
          <input
            type="text"
            value={goalkeepers.right.name}
            onChange={(e) => {
              setGoalkeepers(prev => ({
                ...prev,
                right: { name: e.target.value }
              }));
            }}
            className="w-full px-2 py-1 bg-gray-600 text-white text-xs rounded border border-gray-500 focus:border-blue-500 focus:outline-none"
            placeholder="Nome do goleiro"
          />
        </div>
      </div>
    </div>
  );
};

export default LiveFieldViewGoalkeeperConfig;