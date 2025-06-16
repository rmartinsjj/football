import React, { useState } from 'react';
import { INITIAL_MATCHES, INITIAL_TEAMS } from './constants';
import { useTimer } from './hooks/useTimer';

// Screen Components
import HomeScreen from './screens/HomeScreen';
import PlayersScreen from './screens/PlayersScreen';
import TeamsScreen from './screens/TeamsScreen';
import MatchesScreen from './screens/MatchesScreen';
import StandingsScreen from './screens/StandingsScreen';
import ScorersScreen from './screens/ScorersScreen';
import ColeteScreen from './screens/ColeteScreen';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [matches, setMatches] = useState(INITIAL_MATCHES);
  const [tournamentStarted, setTournamentStarted] = useState(false);
  const [matchEvents, setMatchEvents] = useState([]);
  
  // Colete state
  const [coleteParticipants, setColeteParticipants] = useState([]);
  const [immunePlayer, setImmunePlayer] = useState(null);
  const [coleteWinner, setColeteWinner] = useState(null);

  // Timer hook
  const {
    timer,
    isTimerRunning,
    activeMatch,
    setActiveMatch,
    setOnTimerFinished,
    startMatchTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    formatTime
  } = useTimer();

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            players={players}
            matches={matches}
            setCurrentScreen={setCurrentScreen}
            coleteWinner={coleteWinner}
          />
        );
      
      case 'players':
        return (
          <PlayersScreen
            players={players}
            setPlayers={setPlayers}
            onBack={handleBackToHome}
          />
        );
      
      case 'teams':
        return (
          <TeamsScreen
            players={players}
            teams={teams}
            setTeams={setTeams}
            tournamentStarted={tournamentStarted}
            setTournamentStarted={setTournamentStarted}
            onBack={handleBackToHome}
          />
        );
      
      case 'matches':
        return (
          <MatchesScreen
            matches={matches}
            setMatches={setMatches}
            teams={teams}
            matchEvents={matchEvents}
            setMatchEvents={setMatchEvents}
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
            onBack={handleBackToHome}
          />
        );
      
      case 'standings':
        return (
          <StandingsScreen
            matches={matches}
            onBack={handleBackToHome}
          />
        );
      
      case 'scorers':
        return (
          <ScorersScreen
            matchEvents={matchEvents}
            setMatchEvents={setMatchEvents}
            onBack={handleBackToHome}
          />
        );
      
      case 'colete':
        return (
          <ColeteScreen
            players={players}
            teams={teams}
            matches={matches}
            coleteParticipants={coleteParticipants}
            setColeteParticipants={setColeteParticipants}
            immunePlayer={immunePlayer}
            setImmunePlayer={setImmunePlayer}
            coleteWinner={coleteWinner}
            setColeteWinner={setColeteWinner}
            onBack={handleBackToHome}
          />
        );
      
      default:
        return (
          <HomeScreen
            players={players}
            matches={matches}
            setCurrentScreen={setCurrentScreen}
            coleteWinner={coleteWinner}
          />
        );
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto min-h-screen relative">
      {renderCurrentScreen()}
    </div>
  );
};

export default App;