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
  updateMatchScore,
  settings
}) => {
  const isWinnerStaysMode = settings?.tournamentType === 'winner-stays';
  const activeTeams = settings?.activeTeams || ['Vermelho', 'Azul', 'Brasil', 'Verde Branco'];
  
  // Filter matches based on tournament type
  const filteredMatches = matches.filter(match => 
    activeTeams.includes(match.team1) && activeTeams.includes(match.team2)
  );
  
  const displayMatches = isWinnerStaysMode 
    ? filteredMatches.filter(m => m.type === 'winner-stays' || !m.type) // Show winner-stays matches or matches without type (for backward compatibility)
    : filteredMatches; // Show all matches for championship mode
  
  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      {activeMatch && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-4 text-white mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <span className="font-bold">⏱️ Jogo {activeMatch}</span>
              <span className="text-xl font-bold">{formatTime(timer)}</span>
            </div>
            <div className="flex space-x-2">
              {!isTimerRunning ? (
                <button
                  onClick={resumeTimer}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 w-6 h-6 rounded-full flex items-center justify-center transition-all"
                >
                  <Play size={12} />
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 w-6 h-6 rounded-full flex items-center justify-center transition-all"
                >
                  <Pause size={12} />
                </button>
              )}
              <button
                onClick={() => resetTimer()}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 w-6 h-6 rounded-full flex items-center justify-center transition-all"
              >
                <RotateCcw size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Winner-stays mode info */}
      {isWinnerStaysMode && settings.currentWinnerTeam && (
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-4 text-white mb-4">
          <div className="text-center">
            <h3 className="font-bold text-lg mb-1">🏆 Time que Fica</h3>
            <p className="text-purple-200">{settings.currentWinnerTeam}</p>
          </div>
        </div>
      )}

      {/* Show message if no matches available for winner-stays */}
      {isWinnerStaysMode && displayMatches.length === 0 && (
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">⚡</div>
          <h3 className="text-white font-bold text-lg mb-2">Modo Quem Ganha Fica</h3>
          <p className="text-gray-400 mb-4">Nenhum desafio ativo no momento.</p>
          <p className="text-gray-500 text-sm">
            Os desafios são gerados automaticamente quando um jogo é finalizado.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {displayMatches.filter(match => !isWinnerStaysMode || !match.played).map((match) => (
          <div key={match.id} className="bg-gray-800 rounded-xl border border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  match.type === 'winner-stays' ? 'bg-purple-700 text-purple-200' : 'bg-gray-700 text-gray-300'
                }`}>
                  {match.type === 'winner-stays' ? `⚡ Desafio ${match.id}` : `Jogo ${match.id}`}
                </span>
                {match.played && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    ✓ Finalizado
                  </span>
                )}
              </div>
              <button
                onClick={() => startMatchTimer(match.id, match.id > 12 || match.type === 'winner-stays')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors"
              >
                <Clock size={14} />
                <span>{match.id > 12 || match.type === 'winner-stays' ? '10min' : '7min'}</span>
              </button>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-center flex-1">
                <div className={`bg-gradient-to-r ${TEAM_COLORS[match.team1]?.gradient || 'from-gray-500 to-gray-600'} text-white p-3 rounded-xl mb-3`}>
                  <span className="font-bold">{match.team1}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  value={match.score1 || ''}
                  onChange={(e) => updateMatchScore(match.id, match.team1, e.target.value)}
                  className="w-16 h-16 text-3xl font-bold text-center border-2 border-gray-600 bg-gray-700 text-white rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="0"
                />
              </div>
              
              <div className="px-6">
                <div className="text-2xl font-bold text-gray-300">×</div>
              </div>
              
              <div className="text-center flex-1">
                <div className={`bg-gradient-to-r ${TEAM_COLORS[match.team2]?.gradient || 'from-gray-500 to-gray-600'} text-white p-3 rounded-xl mb-3`}>
                  <span className="font-bold">{match.team2}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  value={match.score2 || ''}
                  onChange={(e) => updateMatchScore(match.id, match.team2, e.target.value)}
                  className="w-16 h-16 text-3xl font-bold text-center border-2 border-gray-600 bg-gray-700 text-white rounded-xl focus:border-blue-500 focus:outline-none"
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