import React, { useState } from 'react';
import { INITIAL_MATCHES, INITIAL_TEAMS } from './constants';
import { useTimer } from './hooks/useTimer';
import { TIMER_DURATION } from './constants';

// Screen Components
import HomeScreen from './screens/HomeScreen';
import PlayersScreen from './screens/PlayersScreen';
import TeamsScreen from './screens/TeamsScreen';
import MatchesScreen from './screens/MatchesScreen';
import StandingsScreen from './screens/StandingsScreen';
import ScorersScreen from './screens/ScorersScreen';
import ColeteScreen from './screens/ColeteScreen';
import SettingsScreen from './screens/SettingsScreen';

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
  
  // Settings state
  const [settings, setSettings] = useState({
    normalMatchTime: TIMER_DURATION.NORMAL_MATCH / 60, // Convert to minutes
    finalMatchTime: TIMER_DURATION.FINAL_MATCH / 60, // Convert to minutes
    numberOfTeams: 4,
    tournamentType: 'championship', // 'championship' or 'winner-stays'
    currentWinnerTeam: null, // For winner-stays mode
  });

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
  } = useTimer(settings);

  // Prevent zoom on mount
  React.useEffect(() => {
    // Disable zoom on iOS
    const preventDefault = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    
    const preventZoom = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };
    
    // Add event listeners
    document.addEventListener('touchstart', preventDefault, { passive: false });
    document.addEventListener('touchmove', preventDefault, { passive: false });
    document.addEventListener('wheel', preventZoom, { passive: false });
    document.addEventListener('keydown', preventZoom);
    
    // Cleanup
    return () => {
      document.removeEventListener('touchstart', preventDefault);
      document.removeEventListener('touchmove', preventDefault);
      document.removeEventListener('wheel', preventZoom);
      document.removeEventListener('keydown', preventZoom);
    };
  }, []);

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
            settings={settings}
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
            settings={settings}
            setSettings={setSettings}
            onBack={handleBackToHome}
          />
        );
      
      case 'standings':
        return (
          <StandingsScreen
            matches={matches}
            settings={settings}
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
      
      case 'settings':
        return (
          <SettingsScreen
            settings={settings}
            setSettings={setSettings}
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
            settings={settings}
          />
        );
    }
  };

  return (
    <div className="w-full min-h-screen relative overflow-x-hidden" style={{ touchAction: 'pan-y' }}>
      {renderCurrentScreen()}
    </div>
  );
};

export default App;