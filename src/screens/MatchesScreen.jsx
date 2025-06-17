import React, { useState } from 'react';
import Header from '../components/Header';
import MatchesList from '../components/MatchesList';
import LiveFieldView from '../components/LiveFieldView';
import { handleWinnerStaysMatch } from '../utils/tournamentUtils';

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
  setOnTimerFinished,
  startMatchTimer,
  pauseTimer,
  resumeTimer,
  resetTimer,
  formatTime,
  settings,
  setSettings,
  setCurrentScreen,
  onBack 
}) => {
  const [viewMode, setViewMode] = useState('field');
  const activeTeams = settings?.activeTeams || ['Vermelho', 'Azul', 'Brasil', 'Verde Branco'];
  
  // Filter matches to only include active teams, but keep playoff structure
  const filteredMatches = matches.filter(match => {
    // Always keep playoff matches (they will be populated with correct teams)
    if (match.type === 'final' || match.type === 'third_place') {
      return true;
    }
    // For regular matches, only include if both teams are active
    return activeTeams.includes(match.team1) && activeTeams.includes(match.team2);
  });

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
        
        // NÃO marcar como jogado automaticamente - só quando apertar "Finalizar"
        // updated.played permanece como estava
        
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
    const currentMatch = filteredMatches.find(m => m.id === matchId);
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
    <div className="min-h-screen overflow-x-hidden pb-24">
      <Header title="Jogos" showBack={true} onBack={onBack} setCurrentScreen={setCurrentScreen} />
      
      {/* Content with proper top padding to account for fixed header */}
      <div className="pt-20 p-3 dark-card border-b border-gray-700 mx-3 rounded-t-xl">
        <div className="flex bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setViewMode('field')}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'field' 
                ? 'bg-gray-600 text-white shadow-sm' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Campo ao Vivo
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'list' 
                ? 'bg-gray-600 text-white shadow-sm' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Lista de Jogos
          </button>
        </div>
      </div>

      {viewMode === 'field' ? (
        <LiveFieldView 
          matches={filteredMatches}
          setMatches={setMatches}
          teams={teams}
          matchEvents={matchEvents}
          timer={timer}
          isTimerRunning={isTimerRunning}
          activeMatch={activeMatch}
          setActiveMatch={setActiveMatch}
          setOnTimerFinished={setOnTimerFinished}
          startMatchTimer={startMatchTimer}
          pauseTimer={pauseTimer}
          resumeTimer={resumeTimer}
          resetTimer={resetTimer}
          formatTime={formatTime}
          addGoal={addGoal}
          removeGoal={removeGoal}
          updateMatchScore={updateMatchScore}
          settings={settings}
          setSettings={setSettings}
        />
      ) : (
        <MatchesList 
          matches={filteredMatches}
          timer={timer}
          isTimerRunning={isTimerRunning}
          activeMatch={activeMatch}
          startMatchTimer={startMatchTimer}
          pauseTimer={pauseTimer}
          resumeTimer={resumeTimer}
          resetTimer={resetTimer}
          formatTime={formatTime}
          updateMatchScore={updateMatchScore}
          settings={settings}
        />
      )}
    </div>
  );
};

export default MatchesScreen;