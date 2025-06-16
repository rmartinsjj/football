import React from 'react';
import { Play, Pause, RotateCcw, Goal } from 'lucide-react';
import { TEAM_COLORS } from '../constants';

const MatchHeader = ({
  currentMatch,
  timer,
  formatTime,
  activeMatch,
  isTimerRunning,
  startMatchTimer,
  pauseTimer,
  resumeTimer,
  resetTimer,
  finishMatch,
  showNextGameButton,
  goToNextGame,
  showGoalkeeperConfig,
  setShowGoalkeeperConfig,
  showPenaltyShootout,
  penaltyScore
}) => {
  return (
    <div className="bg-gray-800 p-3">
      {/* Header com Times, Jogo, Tempo e Controles */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`w-6 h-6 ${TEAM_COLORS[currentMatch.team1].bg} rounded-full`}></div>
          <span className="text-white font-bold text-sm">{currentMatch.team1}</span>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {currentMatch.score1 || 0} × {currentMatch.score2 || 0}
          </div>
          {showPenaltyShootout && (
            <div className="text-yellow-400 text-xs mt-1">
              Pênaltis: {penaltyScore.team1} × {penaltyScore.team2}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-white font-bold text-sm">{currentMatch.team2}</span>
          <div className={`w-6 h-6 ${TEAM_COLORS[currentMatch.team2].bg} rounded-full`}></div>
        </div>
      </div>

      {/* Linha com Jogo, Tempo, Goleiros e Controles */}
      <div className="flex items-center justify-center space-x-3 mb-3">
        <span className="text-white font-bold text-sm">Jogo {currentMatch.id}</span>
        
        <span className="text-green-400 font-bold text-sm">
          {activeMatch === currentMatch.id ? formatTime(timer) : '00:00'}
        </span>
        
        {/* Ícone da Trave com Goleiros */}
        <button
          onClick={() => setShowGoalkeeperConfig(!showGoalkeeperConfig)}
          className="text-yellow-400 hover:text-yellow-300 transition-colors"
          title="Configurar goleiros"
        >
          <Goal size={16} />
        </button>
        
        {/* Controles do Jogo - Ultra Minimalistas */}
        {activeMatch !== currentMatch.id ? (
          <button
            onClick={() => startMatchTimer(currentMatch.id)}
            className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white w-6 h-6 rounded-full flex items-center justify-center transition-colors"
            title="Iniciar"
          >
            <Play size={12} />
          </button>
        ) : (
          <div className="flex items-center space-x-1">
            {!isTimerRunning ? (
              <button
                onClick={resumeTimer}
                className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                title="Play"
              >
                <Play size={12} />
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800 text-white w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                title="Pause"
              >
                <Pause size={12} />
              </button>
            )}
            <button
              onClick={() => resetTimer()}
              className="bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white w-6 h-6 rounded-full flex items-center justify-center transition-colors"
              title="Reset"
            >
              <RotateCcw size={12} />
            </button>
            <button
              onClick={finishMatch}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-2 h-6 rounded-full flex items-center justify-center transition-colors text-xs font-medium"
              title="Finalizar"
            >
              ✓
            </button>
            {showNextGameButton && (
              <button
                onClick={goToNextGame}
                className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-2 h-6 rounded-full flex items-center justify-center transition-colors text-xs font-medium"
                title="Próximo Jogo"
              >
                ▶
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchHeader;