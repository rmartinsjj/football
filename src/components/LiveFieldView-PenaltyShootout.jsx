import React from 'react';

const LiveFieldViewPenaltyShootout = ({
  isVisible,
  currentMatch,
  penaltyScore,
  addPenaltyGoal,
  removePenaltyGoal,
  finishPenaltyShootout,
  onCancel
}) => {
  if (!isVisible) return null;

  return (
    <div className="dark-card rounded-xl p-4 shadow-sm border-2 border-yellow-500">
      <div className="text-center mb-3">
        <h3 className="text-yellow-200 font-bold text-sm mb-1">⚽ DISPUTA DE PÊNALTIS</h3>
        <p className="text-yellow-300 text-xs">Jogo empatado! Marque os gols dos pênaltis:</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Time 1 Penalties */}
        <div className="text-center">
          <h4 className="text-white font-bold text-sm mb-2">{currentMatch.team1}</h4>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <button
              onClick={() => removePenaltyGoal('team1')}
              className="bg-red-600 hover:bg-red-700 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            >
              -
            </button>
            <div className="bg-gray-700 text-white font-bold text-xl w-12 h-12 rounded-full flex items-center justify-center">
              {penaltyScore.team1}
            </div>
            <button
              onClick={() => addPenaltyGoal('team1')}
              className="bg-green-600 hover:bg-green-700 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            >
              +
            </button>
          </div>
        </div>
        
        {/* Time 2 Penalties */}
        <div className="text-center">
          <h4 className="text-white font-bold text-sm mb-2">{currentMatch.team2}</h4>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <button
              onClick={() => removePenaltyGoal('team2')}
              className="bg-red-600 hover:bg-red-700 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            >
              -
            </button>
            <div className="bg-gray-700 text-white font-bold text-xl w-12 h-12 rounded-full flex items-center justify-center">
              {penaltyScore.team2}
            </div>
            <button
              onClick={() => addPenaltyGoal('team2')}
              className="bg-green-600 hover:bg-green-700 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            >
              +
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={finishPenaltyShootout}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-medium transition-colors"
        >
          🏆 Finalizar Pênaltis
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-lg transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default LiveFieldViewPenaltyShootout;