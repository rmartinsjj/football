import React from 'react';

const LiveFieldViewGoalkeeperConfig = ({ 
  goalkeepers, 
  setGoalkeepers, 
  isVisible,
  hasAutoGoalkeepers = false,
  totalPlayers = 0
}) => {
  if (!isVisible) return null;

  return (
    <div className="dark-card rounded-xl p-3 shadow-sm">
      <div className="mb-3">
        <h5 className="text-white text-xs font-medium mb-1">Goleiros desta partida:</h5>
        {hasAutoGoalkeepers && (
          <p className="text-yellow-400 text-xs">
            ⚽ {totalPlayers} jogadores - Goleiros automáticos ativados
          </p>
        )}
        {!hasAutoGoalkeepers && (
          <p className="text-gray-400 text-xs">
            👤 {totalPlayers} jogadores - Goleiros externos
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Goleiro Esquerdo:</label>
          <input
            type="text"
            value={goalkeepers.left.name}
            disabled={hasAutoGoalkeepers && goalkeepers.left.isPlayer}
            onChange={(e) => {
              if (!hasAutoGoalkeepers || !goalkeepers.left.isPlayer) {
                setGoalkeepers(prev => ({
                  ...prev,
                  left: { ...prev.left, name: e.target.value }
                }));
              }
            }}
            className={`w-full px-2 py-1 text-white text-xs rounded border focus:outline-none ${
              hasAutoGoalkeepers && goalkeepers.left.isPlayer
                ? 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gray-600 border-gray-500 focus:border-blue-500'
            }`}
            placeholder="Nome do goleiro"
          />
          {hasAutoGoalkeepers && goalkeepers.left.isPlayer && (
            <p className="text-yellow-400 text-xs mt-1">🤖 Jogador automático</p>
          )}
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Goleiro Direito:</label>
          <input
            type="text"
            value={goalkeepers.right.name}
            disabled={hasAutoGoalkeepers && goalkeepers.right.isPlayer}
            onChange={(e) => {
              if (!hasAutoGoalkeepers || !goalkeepers.right.isPlayer) {
                setGoalkeepers(prev => ({
                  ...prev,
                  right: { ...prev.right, name: e.target.value }
                }));
              }
            }}
            className={`w-full px-2 py-1 text-white text-xs rounded border focus:outline-none ${
              hasAutoGoalkeepers && goalkeepers.right.isPlayer
                ? 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gray-600 border-gray-500 focus:border-blue-500'
            }`}
            placeholder="Nome do goleiro"
          />
          {hasAutoGoalkeepers && goalkeepers.right.isPlayer && (
            <p className="text-yellow-400 text-xs mt-1">🤖 Jogador automático</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveFieldViewGoalkeeperConfig;