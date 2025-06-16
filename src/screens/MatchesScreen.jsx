import React, { useState } from 'react';
import Header from '../components/Header';
import MatchesList from '../components/MatchesList';
import LiveFieldView from '../components/LiveFieldView';

const MatchesScreen = ({ 
  matches, 
  setMatches,
  teams,
  matchEvents,
  setMatchEvents,
  timer,
  isTimerRunning,
  activeMatch,
  setActiveMatch,
  startMatchTimer,
  pauseTimer,
  resumeTimer,
  resetTimer,
  formatTime,
  onBack 
}) => {
  const [viewMode, setViewMode] = useState('field');

  const updateMatchScore = (matchId, team, score) => {
    setMatches(prev => prev.map(match => {
      if (match.id === matchId) {
        const updated = { ...match };
        const numericScore = score === '' ? null : parseInt(score) || 0;
        
        if (match.team1 === team) {
          updated.score1 = numericScore;
        } else {
          updated.score2 = numericScore;
        }
        
        // Marcar como jogado apenas se ambos os placares estão preenchidos
        updated.played = (updated.score1 !== null && updated.score1 !== '') && 
                        (updated.score2 !== null && updated.score2 !== '');
        
        return updated;
      }
      return match;
    }));
  };

  const addGoal = (playerId, playerName, teamName, matchId) => {
    // Adicionar evento de gol
    const goalEvent = {
      id: Date.now(),
      playerId,
      playerName,
      teamName,
      matchId,
      minute: Math.floor((timer > 0 ? ((activeMatch === matchId ? (7*60 - timer) : 0)) : 0) / 60) + 1
    };
    
    setMatchEvents(prev => [...prev, goalEvent]);
    
    // Atualizar placar
    const currentMatch = matches.find(m => m.id === matchId);
    if (currentMatch) {
      if (currentMatch.team1 === teamName) {
        updateMatchScore(matchId, teamName, (currentMatch.score1 || 0) + 1);
      } else {
        updateMatchScore(matchId, teamName, (currentMatch.score2 || 0) + 1);
      }
    }
  };

  const removeGoal = (eventId) => {
    const eventToRemove = matchEvents.find(e => e.id === eventId);
    if (eventToRemove) {
      const currentMatch = matches.find(m => m.id === eventToRemove.matchId);
      if (currentMatch) {
        if (currentMatch.team1 === eventToRemove.teamName) {
          updateMatchScore(eventToRemove.matchId, eventToRemove.teamName, Math.max(0, (currentMatch.score1 || 0) - 1));
        } else {
          updateMatchScore(eventToRemove.matchId, eventToRemove.teamName, Math.max(0, (currentMatch.score2 || 0) - 1));
        }
      }
    }
    setMatchEvents(prev => prev.filter(e => e.id !== eventId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Jogos" showBack={true} onBack={onBack} />
      
      <div className="p-4 bg-white border-b border-gray-100">
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setViewMode('field')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'field' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600'
            }`}
          >
            Campo ao Vivo
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'list' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600'
            }`}
          >
            Lista de Jogos
          </button>
        </div>
      </div>

      {viewMode === 'field' ? (
        <LiveFieldView 
          matches={matches}
          setMatches={setMatches}
          teams={teams}
          matchEvents={matchEvents}
          timer={timer}
          isTimerRunning={isTimerRunning}
          activeMatch={activeMatch}
          setActiveMatch={setActiveMatch}
          startMatchTimer={startMatchTimer}
          pauseTimer={pauseTimer}
          resumeTimer={resumeTimer}
          resetTimer={resetTimer}
          formatTime={formatTime}
          addGoal={addGoal}
          removeGoal={removeGoal}
          updateMatchScore={updateMatchScore}
        />
      ) : (
        <MatchesList 
          matches={matches}
          timer={timer}
          isTimerRunning={isTimerRunning}
          activeMatch={activeMatch}
          startMatchTimer={startMatchTimer}
          pauseTimer={pauseTimer}
          resumeTimer={resumeTimer}
          resetTimer={resetTimer}
          formatTime={formatTime}
          updateMatchScore={updateMatchScore}
        />
      )}
    </div>
  );
};

export default MatchesScreen;