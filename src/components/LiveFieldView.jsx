import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Users } from 'lucide-react';
import { TEAM_COLORS } from '../constants';

const LiveFieldView = ({ 
  matches,
  setMatches,
  teams,
  matchEvents,
  timer,
  isTimerRunning,
  activeMatch,
  setActiveMatch,
  startMatchTimer,
  pauseTimer,
  resumeTimer,
  resetTimer,
  formatTime,
  addGoal,
  removeGoal,
  updateMatchScore
}) => {
  const [goalkeepers, setGoalkeepers] = useState({ 
    left: { name: 'Goleiro 1' }, 
    right: { name: 'Goleiro 2' } 
  });
  const [showGoalkeeperConfig, setShowGoalkeeperConfig] = useState(false);

  const currentMatch = matches.find(m => m.id === activeMatch) || matches.find(m => !m.played) || matches[0];
  const remainingMatches = matches.filter(m => m.id > currentMatch.id);
  const completedMatches = matches.filter(m => m.id < currentMatch.id && m.played);
  
  const team1Players = teams[currentMatch.team1] || [];
  const team2Players = teams[currentMatch.team2] || [];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 ${TEAM_COLORS[currentMatch.team1].bg} rounded-full`}></div>
            <span className="text-white font-bold">{currentMatch.team1}</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 text-white text-sm mb-1">
              <span>Jogo {currentMatch.id}</span>
              <span className="text-green-400 font-bold">
                {activeMatch === currentMatch.id ? formatTime(timer) : '00:00'}
              </span>
            </div>
            <div className="text-3xl font-bold text-white">
              {currentMatch.score1 || 0} × {currentMatch.score2 || 0}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white font-bold">{currentMatch.team2}</span>
            <div className={`w-8 h-8 ${TEAM_COLORS[currentMatch.team2].bg} rounded-full`}></div>
          </div>
        </div>

        <div className="flex justify-center space-x-2">
          {activeMatch !== currentMatch.id ? (
            <button
              onClick={() => startMatchTimer(currentMatch.id)}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-1 transition-colors"
            >
              <Play size={12} />
              <span>Play</span>
            </button>
          ) : (
            <>
              {!isTimerRunning ? (
                <button
                  onClick={resumeTimer}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-1 transition-colors"
                >
                  <Play size={12} />
                  <span>Play</span>
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-1 transition-colors"
                >
                  <Pause size={12} />
                  <span>Pause</span>
                </button>
              )}
              <button
                onClick={() => resetTimer()}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-1 transition-colors"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
              <button
                onClick={() => {
                  const updatedMatch = { ...currentMatch, played: true };
                  setMatches(prev => prev.map(m => m.id === currentMatch.id ? updatedMatch : m));
                  setActiveMatch(null);
                  const nextMatch = matches.find(m => m.id > currentMatch.id && !m.played);
                  if (nextMatch) {
                    setTimeout(() => startMatchTimer(nextMatch.id), 500);
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-1 transition-colors"
              >
                <span>✓</span>
                <span>Finalizar</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-gray-800 mx-4 mb-2 rounded-xl p-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white text-sm font-medium">Goleiros desta partida:</span>
          <button
            onClick={() => setShowGoalkeeperConfig(!showGoalkeeperConfig)}
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            {showGoalkeeperConfig ? '▼' : '▶'} Editar nomes
          </button>
        </div>

        {showGoalkeeperConfig && (
          <div className="grid grid-cols-2 gap-3">
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
                className="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
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
                className="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="Nome do goleiro"
              />
            </div>
          </div>
        )}
      </div>

      {/* Football Field */}
      <div className="relative bg-green-600 mx-4 my-4 rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 225">
          <g opacity="0.7">
            <line x1="0" y1="0" x2="380" y2="45" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round"/>
            <line x1="0" y1="15" x2="400" y2="60" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="0" y1="30" x2="400" y2="75" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round"/>
            <line x1="0" y1="45" x2="400" y2="90" stroke="#FCD34D" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="0" y1="60" x2="400" y2="105" stroke="#FCD34D" strokeWidth="1" strokeLinecap="round"/>
          </g>
        </svg>

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 225">
          <rect x="10" y="10" width="380" height="205" fill="none" stroke="white" strokeWidth="2"/>
          <line x1="200" y1="10" x2="200" y2="215" stroke="white" strokeWidth="2"/>
          <circle cx="200" cy="112.5" r="25" fill="none" stroke="white" strokeWidth="2"/>
          <rect x="10" y="60" width="40" height="105" fill="none" stroke="white" strokeWidth="2"/>
          <rect x="350" y="60" width="40" height="105" fill="none" stroke="white" strokeWidth="2"/>
          <rect x="10" y="85" width="15" height="55" fill="none" stroke="white" strokeWidth="2"/>
          <rect x="375" y="85" width="15" height="55" fill="none" stroke="white" strokeWidth="2"/>
          <rect x="5" y="95" width="5" height="35" fill="white"/>
          <rect x="390" y="95" width="5" height="35" fill="white"/>
        </svg>

        {/* Goalkeepers */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: '6%', top: '50%' }}
        >
          <div className="w-6 h-6 bg-yellow-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
            <span className="text-white text-[8px] font-bold">G</span>
          </div>
          <div className="absolute top-7 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-[8px] px-1 py-0.5 rounded whitespace-nowrap max-w-16 truncate">
            {goalkeepers.left.name}
          </div>
        </div>
        
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: '94%', top: '50%' }}
        >
          <div className="w-6 h-6 bg-yellow-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
            <span className="text-white text-[8px] font-bold">G</span>
          </div>
          <div className="absolute top-7 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-[8px] px-1 py-0.5 rounded whitespace-nowrap max-w-16 truncate">
            {goalkeepers.right.name}
          </div>
        </div>

        {/* Team 1 Players */}
        {team1Players.slice(0, 5).map((player, index) => {
          const positions = [
            { x: '18%', y: '25%' },
            { x: '18%', y: '75%' },
            { x: '30%', y: '40%' },
            { x: '30%', y: '60%' },
            { x: '42%', y: '50%' }
          ];
          const pos = positions[index] || { x: '20%', y: '50%' };
          
          return (
            <div
              key={player.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ left: pos.x, top: pos.y }}
              onClick={() => addGoal(player.id, player.name, currentMatch.team1, currentMatch.id)}
            >
              <div className={`w-6 h-6 ${TEAM_COLORS[currentMatch.team1].bg} rounded-full border-2 border-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform`}>
                <Users size={12} className="text-white" />
              </div>
              <div className="absolute top-7 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-[8px] px-1 py-0.5 rounded whitespace-nowrap max-w-16 truncate">
                {player.name}
              </div>
            </div>
          );
        })}

        {/* Team 2 Players */}
        {team2Players.slice(0, 5).map((player, index) => {
          const positions = [
            { x: '82%', y: '25%' },
            { x: '82%', y: '75%' },
            { x: '70%', y: '40%' },
            { x: '70%', y: '60%' },
            { x: '58%', y: '50%' }
          ];
          const pos = positions[index] || { x: '80%', y: '50%' };
          
          return (
            <div
              key={player.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ left: pos.x, top: pos.y }}
              onClick={() => addGoal(player.id, player.name, currentMatch.team2, currentMatch.id)}
            >
              <div className={`w-6 h-6 ${TEAM_COLORS[currentMatch.team2].bg} rounded-full border-2 border-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform`}>
                <Users size={12} className="text-white" />
              </div>
              <div className="absolute top-7 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-[8px] px-1 py-0.5 rounded whitespace-nowrap max-w-16 truncate">
                {player.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Match Goals */}
      <div className="bg-gray-800 mx-4 mb-4 rounded-2xl p-4">
        <h3 className="text-white font-bold mb-3">
          Gols da Partida
        </h3>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {matchEvents
            .filter(event => event.matchId === currentMatch.id)
            .map((event) => (
              <div key={event.id} className="flex items-center justify-between bg-gray-700 rounded-lg p-2">
                <div className="flex items-center space-x-2">
                  <span className="text-white text-sm">⚽</span>
                  <span className="text-white text-sm">{event.playerName}</span>
                  <span className="text-gray-400 text-xs">({event.teamName})</span>
                  <span className="text-gray-400 text-xs">{event.minute}'</span>
                </div>
                <button
                  onClick={() => removeGoal(event.id)}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  ❌
                </button>
              </div>
            ))}
          {matchEvents.filter(event => event.matchId === currentMatch.id).length === 0 && (
            <div className="text-center py-2">
              <span className="text-gray-400 text-sm">Nenhum gol marcado ainda</span>
            </div>
          )}
        </div>
      </div>

      {/* Score Update */}
      <div className="bg-gray-800 mx-4 mb-4 rounded-2xl p-4">
        <h3 className="text-white font-bold mb-3 text-center">Atualizar Placar</h3>
        <div className="flex items-center justify-center space-x-6">
          <div className="text-center">
            <div className="text-white font-medium mb-2">{currentMatch.team1}</div>
            <input
              type="number"
              min="0"
              value={currentMatch.score1 || ''}
              onChange={(e) => {
                updateMatchScore(currentMatch.id, currentMatch.team1, e.target.value);
              }}
              onFocus={(e) => e.target.select()}
              className="w-16 h-16 text-2xl font-bold text-center border-2 border-gray-600 bg-gray-700 text-white rounded-xl focus:border-blue-500 focus:outline-none"
              placeholder="0"
              inputMode="numeric"
            />
          </div>
          <div className="text-white text-2xl font-bold">×</div>
          <div className="text-center">
            <div className="text-white font-medium mb-2">{currentMatch.team2}</div>
            <input
              type="number"
              min="0"
              value={currentMatch.score2 || ''}
              onChange={(e) => {
                updateMatchScore(currentMatch.id, currentMatch.team2, e.target.value);
              }}
              onFocus={(e) => e.target.select()}
              className="w-16 h-16 text-2xl font-bold text-center border-2 border-gray-600 bg-gray-700 text-white rounded-xl focus:border-blue-500 focus:outline-none"
              placeholder="0"
              inputMode="numeric"
            />
          </div>
        </div>
      </div>

      {/* Upcoming Matches */}
      <div className="bg-gray-800 mx-4 mb-4 rounded-2xl p-4">
        <h3 className="text-white font-bold mb-3">
          Próximos Jogos ({remainingMatches.length} restantes)
        </h3>
        <div className="space-y-2" style={{ maxHeight: '200px', overflowY: 'auto', overflowX: 'hidden' }}>
          {remainingMatches.length > 0 ? remainingMatches.map((match) => (
            <div key={match.id} className={`flex items-center justify-between rounded-xl p-3 ${
              match.played ? 'bg-green-700' : 'bg-gray-700'
            }`}>
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  match.played 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-600 text-white'
                }`}>
                  Jogo {match.id}
                </span>
                <span className="text-white text-sm">
                  {match.played 
                    ? `${match.team1} ${match.score1 || 0} × ${match.score2 || 0} ${match.team2}`
                    : `${match.team1} × ${match.team2}`
                  }
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {match.played ? (
                  <span className="text-green-400 text-xs">✓ Finalizado</span>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveMatch(match.id);
                      startMatchTimer(match.id, match.id > 12);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs transition-colors"
                  >
                    Iniciar
                  </button>
                )}
              </div>
            </div>
          )) : (
            <div className="text-center py-4">
              <span className="text-gray-400 text-sm">Este é o último jogo do torneio!</span>
            </div>
          )}
        </div>

        {completedMatches.length > 0 && (
          <>
            <h4 className="text-white font-medium mt-4 mb-2 text-sm">
              Jogos Anteriores ({completedMatches.length} finalizados)
            </h4>
            <div className="space-y-1" style={{ maxHeight: '120px', overflowY: 'auto', overflowX: 'hidden' }}>
              {completedMatches.slice(-3).map((match) => (
                <div key={match.id} className="flex items-center justify-between bg-gray-700 rounded-lg p-2">
                  <div className="flex items-center space-x-2">
                    <span className="bg-gray-600 text-white px-2 py-0.5 rounded text-xs">
                      Jogo {match.id}
                    </span>
                    <span className="text-white text-xs">
                      {match.team1} {match.score1 || 0} × {match.score2 || 0} {match.team2}
                    </span>
                  </div>
                  <span className="text-green-400 text-xs">✓</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LiveFieldView;