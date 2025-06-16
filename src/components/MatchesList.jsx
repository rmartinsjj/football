import React from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { TEAM_COLORS } from '../constants';

const MatchesList = ({ 
  matches,
  timer,
  isTimerRunning,
  activeMatch,
  startMatchTimer,
  pauseTimer,
  resumeTimer,
  resetTimer,
  formatTime,
  updateMatchScore
}) => {
  return (
    <div className="p-6">
      {activeMatch && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-4 text-white mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <span className="font-bold">⏱️ Jogo {activeMatch}</span>
              <span className="text-2xl font-bold">{formatTime(timer)}</span>
            </div>
            <div className="flex space-x-2">
              {!isTimerRunning ? (
                <button
                  onClick={resumeTimer}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-lg flex items-center space-x-1 transition-all text-sm"
                >
                  <Play size={12} />
                  <span>Play</span>
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-lg flex items-center space-x-1 transition-all text-sm"
                >
                  <Pause size={12} />
                  <span>Pause</span>
                </button>
              )}
              <button
                onClick={() => resetTimer()}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-lg flex items-center space-x-1 transition-all text-sm"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {matches.map((match) => (
          <div key={match.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                  Jogo {match.id}
                </span>
                {match.played && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    ✓ Finalizado
                  </span>
                )}
              </div>
              <button
                onClick={() => startMatchTimer(match.id, match.id > 12)}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-xl text-sm flex items-center space-x-2 transition-colors"
              >
                <Clock size={14} />
                <span>{match.id > 12 ? '10min' : '7min'}</span>
              </button>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-center flex-1">
                <div className={`bg-gradient-to-r ${TEAM_COLORS[match.team1].gradient} text-white p-3 rounded-xl mb-3`}>
                  <span className="font-bold">{match.team1}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  value={match.score1 || ''}
                  onChange={(e) => updateMatchScore(match.id, match.team1, e.target.value)}
                  className="w-16 h-16 text-3xl font-bold text-center border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="0"
                />
              </div>
              
              <div className="px-6">
                <div className="text-2xl font-bold text-gray-400">×</div>
              </div>
              
              <div className="text-center flex-1">
                <div className={`bg-gradient-to-r ${TEAM_COLORS[match.team2].gradient} text-white p-3 rounded-xl mb-3`}>
                  <span className="font-bold">{match.team2}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  value={match.score2 || ''}
                  onChange={(e) => updateMatchScore(match.id, match.team2, e.target.value)}
                  className="w-16 h-16 text-3xl font-bold text-center border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchesList;