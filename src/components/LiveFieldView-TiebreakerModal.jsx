import React from 'react';
import { X, BarChart3, Shuffle } from 'lucide-react';
import { TEAM_COLORS } from '../constants';

const LiveFieldViewTiebreakerModal = ({ 
  isOpen, 
  onClose, 
  tiebreakerTeams, 
  standings, 
  onDecision 
}) => {
  if (!isOpen) return null;

  const handleDecision = (method) => {
    onDecision(method);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-xs w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">⚽ Desempate</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-gray-600 text-sm mb-4">
            Times empatados em pontos. Como resolver?
          </p>

          {/* Tied Teams */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            {tiebreakerTeams.map((teamName) => {
              const teamStats = standings.find(s => s.team === teamName);
              return (
                <div key={teamName} className="flex items-center justify-between py-1">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 ${TEAM_COLORS[teamName].bg} rounded-full`}></div>
                    <span className="text-sm font-medium">{teamName}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {teamStats.points}pts | {teamStats.goalDiff > 0 ? '+' : ''}{teamStats.goalDiff}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Options */}
          <div className="space-y-2">
            <button
              onClick={() => handleDecision('goals')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg flex items-center space-x-3 transition-colors"
            >
              <BarChart3 size={18} />
              <div className="text-left">
                <div className="font-medium">Saldo de Gols</div>
                <div className="text-xs opacity-90">Critério técnico</div>
              </div>
            </button>

            <button
              onClick={() => handleDecision('draw')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg flex items-center space-x-3 transition-colors"
            >
              <Shuffle size={18} />
              <div className="text-left">
                <div className="font-medium">Sortear</div>
                <div className="text-xs opacity-90">Sorteio aleatório</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveFieldViewTiebreakerModal;