import React from 'react';
import { Target, Minus } from 'lucide-react';
import Header from '../components/Header';
import { TEAM_COLORS } from '../constants';

const ScorersScreen = ({ matchEvents, setMatchEvents, onBack }) => {
  const getGoalScorers = () => {
    const scorers = {};
    matchEvents.forEach(event => {
      const key = `${event.playerId}-${event.playerName}`;
      if (!scorers[key]) {
        scorers[key] = {
          playerId: event.playerId,
          playerName: event.playerName,
          teamName: event.teamName,
          goals: 0
        };
      }
      scorers[key].goals++;
    });
    
    return Object.values(scorers).sort((a, b) => b.goals - a.goals);
  };

  const removeGoal = (eventId) => {
    setMatchEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const goalScorers = getGoalScorers();
  
  return (
    <div className="min-h-screen">
      <Header title="Artilheiros" showBack={true} onBack={onBack} />
      
      <div className="p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Tabela de Artilheiros</h3>
          </div>
          
          <div className="space-y-1">
            {goalScorers.length === 0 ? (
              <div className="p-8 text-center">
                <Target size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum gol marcado ainda</p>
              </div>
            ) : (
              goalScorers.map((scorer, index) => (
                <div
                  key={`${scorer.playerId}-${scorer.playerName}`}
                  className={`p-4 ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500' :
                    index === 1 ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-gray-400' :
                    index === 2 ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-400' :
                    'hover:bg-gray-50'
                  } transition-colors`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl font-bold text-gray-600">{index + 1}º</span>
                        {index === 0 && <span className="text-lg">👑</span>}
                        {index === 1 && <span className="text-lg">🥈</span>}
                        {index === 2 && <span className="text-lg">🥉</span>}
                      </div>
                      <div className={`w-4 h-4 ${TEAM_COLORS[scorer.teamName]?.bg || 'bg-gray-500'} rounded-full`}></div>
                      <div>
                        <span className="font-bold text-gray-900">{scorer.playerName}</span>
                        <div className="text-sm text-gray-500">{scorer.teamName}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{scorer.goals}</div>
                      <div className="text-sm text-gray-500">gols</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-3">Todos os Gols do Torneio</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {matchEvents.length === 0 ? (
              <div className="text-center py-4">
                <span className="text-gray-500 text-sm">Nenhum gol marcado ainda</span>
              </div>
            ) : (
              matchEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">⚽</span>
                    <div>
                      <div className="font-medium text-gray-900">{event.playerName}</div>
                      <div className="text-sm text-gray-500">
                        {event.teamName} • Jogo {event.matchId} • {event.minute}'
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeGoal(event.id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScorersScreen;