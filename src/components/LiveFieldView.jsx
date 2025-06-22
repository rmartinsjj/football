import React, { useState, useEffect, useRef } from 'react';
import { useTimer } from '../hooks/useTimer';

const LiveFieldView = ({ 
  match, 
  onUpdateMatch, 
  onEndMatch, 
  onGoBack,
  teams = [],
  players = [] 
}) => {
  const [homeScore, setHomeScore] = useState(match?.homeScore || 0);
  const [awayScore, setAwayScore] = useState(match?.awayScore || 0);
  const [isMatchActive, setIsMatchActive] = useState(match?.status === 'live');
  const [showResults, setShowResults] = useState(false);
  const [matchEvents, setMatchEvents] = useState(match?.events || []);
  const [showTiebreaker, setShowTiebreaker] = useState(false);
  const [tiebreakerType, setTiebreakerType] = useState('');
  const [showPenaltyShootout, setShowPenaltyShootout] = useState(false);
  const [penaltyScore, setPenaltyScore] = useState({ home: 0, away: 0 });
  const [showGoalkeeperConfig, setShowGoalkeeperConfig] = useState(false);
  const [goalkeepers, setGoalkeepers] = useState({
    home: null,
    away: null
  });

  const { 
    time, 
    isRunning, 
    start: startTimer, 
    pause: pauseTimer, 
    reset: resetTimer 
  } = useTimer(0);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartMatch = () => {
    setIsMatchActive(true);
    startTimer();
    onUpdateMatch({
      ...match,
      status: 'live',
      startTime: new Date().toISOString()
    });
  };

  const handlePauseMatch = () => {
    pauseTimer();
  };

  const handleResumeMatch = () => {
    startTimer();
  };

  const handleEndMatch = () => {
    setIsMatchActive(false);
    pauseTimer();
    setShowResults(true);
    
    const finalMatch = {
      ...match,
      homeScore,
      awayScore,
      status: 'completed',
      endTime: new Date().toISOString(),
      duration: time,
      events: matchEvents
    };
    
    onUpdateMatch(finalMatch);
  };

  const handleCloseResults = () => {
    setShowResults(false);
    onGoBack();
  };

  const addGoal = (team, playerId = null) => {
    const newEvent = {
      id: Date.now(),
      type: 'goal',
      team,
      playerId,
      time: formatTime(time),
      timestamp: new Date().toISOString()
    };

    setMatchEvents(prev => [...prev, newEvent]);

    if (team === 'home') {
      setHomeScore(prev => prev + 1);
    } else {
      setAwayScore(prev => prev + 1);
    }
  };

  const removeLastGoal = (team) => {
    const lastGoalIndex = matchEvents
      .map((event, index) => ({ ...event, originalIndex: index }))
      .reverse()
      .findIndex(event => event.type === 'goal' && event.team === team);

    if (lastGoalIndex !== -1) {
      const actualIndex = matchEvents.length - 1 - lastGoalIndex;
      const newEvents = matchEvents.filter((_, index) => index !== actualIndex);
      setMatchEvents(newEvents);

      if (team === 'home' && homeScore > 0) {
        setHomeScore(prev => prev - 1);
      } else if (team === 'away' && awayScore > 0) {
        setAwayScore(prev => prev - 1);
      }
    }
  };

  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : `Time ${teamId}`;
  };

  const getPlayerName = (playerId) => {
    const player = players.find(p => p.id === playerId);
    return player ? player.name : 'Jogador';
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full text-center text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-6">Resultado Final</h2>
          
          <div className="bg-white bg-opacity-20 rounded-2xl p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold">{getTeamName(match.homeTeam)}</h3>
                <div className="text-4xl font-bold mt-2">{homeScore}</div>
              </div>
              
              <div className="text-2xl font-bold">VS</div>
              
              <div className="text-center">
                <h3 className="text-lg font-semibold">{getTeamName(match.awayTeam)}</h3>
                <div className="text-4xl font-bold mt-2">{awayScore}</div>
              </div>
            </div>
            
            <div className="text-sm opacity-75">
              Duração: {formatTime(time)}
            </div>
          </div>

          {matchEvents.length > 0 && (
            <div className="bg-white bg-opacity-20 rounded-2xl p-4 mb-6">
              <h4 className="font-semibold mb-3">Eventos da Partida</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {matchEvents.map((event, index) => (
                  <div key={index} className="text-sm flex justify-between">
                    <span>{event.time}</span>
                    <span>⚽ {getTeamName(event.team === 'home' ? match.homeTeam : match.awayTeam)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleCloseResults}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Fechar Resultados
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-4">
      {/* Header */}
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-4 mb-4 text-white">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={onGoBack}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors"
          >
            ← Voltar
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold">Partida Ao Vivo</h1>
            <div className="text-lg font-mono">{formatTime(time)}</div>
          </div>
          
          <div className="w-20"></div>
        </div>

        {/* Teams and Score */}
        <div className="flex justify-between items-center">
          <div className="text-center flex-1">
            <h2 className="text-lg font-semibold">{getTeamName(match.homeTeam)}</h2>
            <div className="text-4xl font-bold mt-2">{homeScore}</div>
          </div>
          
          <div className="text-2xl font-bold mx-4">VS</div>
          
          <div className="text-center flex-1">
            <h2 className="text-lg font-semibold">{getTeamName(match.awayTeam)}</h2>
            <div className="text-4xl font-bold mt-2">{awayScore}</div>
          </div>
        </div>
      </div>

      {/* Match Controls */}
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-4 mb-4">
        <div className="flex justify-center space-x-4 mb-4">
          {!isMatchActive ? (
            <button
              onClick={handleStartMatch}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Iniciar Partida
            </button>
          ) : (
            <>
              {isRunning ? (
                <button
                  onClick={handlePauseMatch}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  Pausar
                </button>
              ) : (
                <button
                  onClick={handleResumeMatch}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  Retomar
                </button>
              )}
              
              <button
                onClick={handleEndMatch}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Finalizar Partida
              </button>
            </>
          )}
        </div>
      </div>

      {/* Goal Controls */}
      {isMatchActive && (
        <div className="space-y-4">
          {/* Home Team Goals */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-4">
            <h3 className="text-white text-lg font-semibold mb-3 text-center">
              {getTeamName(match.homeTeam)}
            </h3>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => addGoal('home')}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                + Gol
              </button>
              <button
                onClick={() => removeLastGoal('home')}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                disabled={homeScore === 0}
              >
                - Gol
              </button>
            </div>
          </div>

          {/* Away Team Goals */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-4">
            <h3 className="text-white text-lg font-semibold mb-3 text-center">
              {getTeamName(match.awayTeam)}
            </h3>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => addGoal('away')}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                + Gol
              </button>
              <button
                onClick={() => removeLastGoal('away')}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                disabled={awayScore === 0}
              >
                - Gol
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Match Events */}
      {matchEvents.length > 0 && (
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-4 mt-4">
          <h3 className="text-white text-lg font-semibold mb-3">Eventos da Partida</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {matchEvents.map((event, index) => (
              <div key={index} className="bg-white bg-opacity-20 rounded-lg p-2 text-white text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-mono">{event.time}</span>
                  <span>⚽ {getTeamName(event.team === 'home' ? match.homeTeam : match.awayTeam)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveFieldView;