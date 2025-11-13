import React, { useState, useEffect } from 'react';
import { INITIAL_MATCHES, INITIAL_TEAMS, AVAILABLE_TEAMS } from './constants';
import { useTimer } from './hooks/useTimer';
import { useGameDaySync } from './hooks/useGameDaySync';
import { TIMER_DURATION } from './constants';
import { initializeWinnerStaysMode } from './utils/tournamentUtils';
import { gameDayService } from './services/gameDayService';

// Screen Components
import GameDayHomeScreen from './screens/GameDayHomeScreen';
import GameMenuScreen from './screens/GameMenuScreen';
import PlayersScreen from './screens/PlayersScreen';
import TeamsScreen from './screens/TeamsScreen';
import MatchesScreen from './screens/MatchesScreen';
import StandingsScreen from './screens/StandingsScreen';
import ScorersScreen from './screens/ScorersScreen';
import ColeteScreen from './screens/ColeteScreen';
import SettingsScreen from './screens/SettingsScreen';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [currentGameDay, setCurrentGameDay] = useState(null);
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [matches, setMatches] = useState(INITIAL_MATCHES);
  const [tournamentStarted, setTournamentStarted] = useState(false);
  const [matchEvents, setMatchEvents] = useState([]);
  const [isLoadingGameDay, setIsLoadingGameDay] = useState(true);
  
  // Colete state
  const [coleteParticipants, setColeteParticipants] = useState([]);
  const [immunePlayer, setImmunePlayer] = useState(null);
  const [coleteWinner, setColeteWinner] = useState(null);
  
  // Settings state
  const [settings, setSettings] = useState({
    normalMatchTime: TIMER_DURATION.NORMAL_MATCH / 60, // Convert to minutes
    finalMatchTime: TIMER_DURATION.FINAL_MATCH / 60, // Convert to minutes
    numberOfTeams: 4,
    activeTeams: AVAILABLE_TEAMS.slice(0, 4), // First 4 teams by default
    tournamentType: 'championship', // 'championship' or 'winner-stays'
    currentWinnerTeam: null, // For winner-stays mode
  });

  // Initialize winner-stays mode when tournament type changes
  React.useEffect(() => {
    if (settings.tournamentType === 'winner-stays' && matches.length === INITIAL_MATCHES.length) {
      // Only initialize if we're still using the default championship matches
      const { matches: winnerStaysMatches, currentWinner } = initializeWinnerStaysMode(teams, settings.activeTeams);
      if (winnerStaysMatches.length > 0) {
        setMatches(winnerStaysMatches);
        setSettings(prev => ({
          ...prev,
          currentWinnerTeam: currentWinner
        }));
      }
    } else if (settings.tournamentType === 'championship' && matches.some(m => m.type === 'winner-stays')) {
      // Reset to championship matches if switching back
      setMatches(INITIAL_MATCHES);
      setSettings(prev => ({
        ...prev,
        currentWinnerTeam: null
      }));
    }
  }, [settings.tournamentType, settings.activeTeams]);
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

  const {
    syncPlayers,
    syncMatches,
    syncGoalEvent,
    removeGoalEvent,
    syncVestAssignment,
    updateGameDaySettings,
    syncActiveMatch
  } = useGameDaySync(currentGameDay);

  useEffect(() => {
    checkForActiveGameDay();
  }, []);

  const checkForActiveGameDay = async () => {
    try {
      const activeGameDay = await gameDayService.getActiveGameDay();
      if (activeGameDay) {
        await loadGameDayData(activeGameDay);
      }
    } catch (error) {
      console.error('Error checking for active game day:', error);
    } finally {
      setIsLoadingGameDay(false);
    }
  };

  const loadGameDayData = async (gameDay) => {
    try {
      setCurrentGameDay(gameDay);

      const [playersData, matchesData, eventsData, vestData] = await Promise.all([
        gameDayService.getPlayersByGameDay(gameDay.id),
        gameDayService.getMatchesByGameDay(gameDay.id),
        gameDayService.getMatchEventsByGameDay(gameDay.id),
        gameDayService.getVestAssignment(gameDay.id)
      ]);

      if (playersData && playersData.length > 0) {
        setPlayers(playersData);

        // Agrupar jogadores por time (apenas os que têm team_name)
        const playersWithTeams = playersData.filter(p => p.team_name);
        if (playersWithTeams.length > 0) {
          const teamGroups = playersWithTeams.reduce((acc, player) => {
            if (!acc[player.team_name]) {
              acc[player.team_name] = [];
            }
            acc[player.team_name].push(player);
            return acc;
          }, {});
          setTeams(teamGroups);
          setTournamentStarted(true);
        }
      }

      if (matchesData && matchesData.length > 0) {
        const formattedMatches = matchesData.map(match => ({
          id: match.match_number,
          dbId: match.id,
          team1: match.team1,
          team2: match.team2,
          score1: match.score1,
          score2: match.score2,
          penaltyScore1: match.penalty_score1,
          penaltyScore2: match.penalty_score2,
          winner: match.winner,
          type: match.match_type,
          played: match.played
        }));
        setMatches(formattedMatches);
      }

      if (eventsData && eventsData.length > 0) {
        const formattedEvents = eventsData
          .map(event => {
            const match = matchesData.find(m => m.id === event.match_id);
            if (!match) return null; // Skip events without valid match

            return {
              id: event.id,
              matchId: match.match_number,
              playerId: event.player_id,
              playerName: event.player_name,
              teamName: event.team_name,
              minute: event.minute
            };
          })
          .filter(event => event !== null); // Remove null entries
        setMatchEvents(formattedEvents);
      }

      if (vestData) {
        setColeteWinner(vestData.team_name);
      }

      setSettings(prev => ({
        ...prev,
        tournamentType: gameDay.tournament_type,
        activeTeams: gameDay.active_teams || prev.activeTeams,
        currentWinnerTeam: gameDay.current_winner_team
      }));

      // Restore active match or find next unplayed match
      if (gameDay.active_match_id) {
        setActiveMatch(gameDay.active_match_id);
      } else if (matchesData && matchesData.length > 0) {
        // Find first unplayed match
        const nextMatch = matchesData.find(m => !m.played);
        if (nextMatch) {
          setActiveMatch(nextMatch.match_number);
        }
      }
    } catch (error) {
      console.error('Error loading game day data:', error);
    }
  };

  const handleGameCreated = async (gameDay) => {
    await loadGameDayData(gameDay);
    setCurrentScreen('menu');
  };

  React.useEffect(() => {
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

    document.addEventListener('touchstart', preventDefault, { passive: false });
    document.addEventListener('touchmove', preventDefault, { passive: false });
    document.addEventListener('wheel', preventZoom, { passive: false });
    document.addEventListener('keydown', preventZoom);

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

  const handleBackToMenu = () => {
    if (currentGameDay) {
      setCurrentScreen('menu');
    } else {
      setCurrentScreen('home');
    }
  };

  const renderCurrentScreen = () => {
    if (isLoadingGameDay) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Carregando...</p>
          </div>
        </div>
      );
    }

    switch (currentScreen) {
      case 'home':
        return (
          <GameDayHomeScreen
            onGameSelected={handleGameCreated}
            currentGameDay={currentGameDay}
            players={players}
            matches={matches}
            coleteWinner={coleteWinner}
            settings={settings}
            setCurrentScreen={setCurrentScreen}
          />
        );

      case 'menu':
        return (
          <GameMenuScreen
            currentGameDay={currentGameDay}
            players={players}
            matches={matches}
            coleteWinner={coleteWinner}
            settings={settings}
            setCurrentScreen={setCurrentScreen}
            onBack={() => setCurrentScreen('home')}
          />
        );
      
      case 'players':
        return (
          <PlayersScreen
            players={players}
            setPlayers={setPlayers}
            setCurrentScreen={setCurrentScreen}
            onBack={handleBackToMenu}
            currentGameDay={currentGameDay}
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
            settings={settings}
            setCurrentScreen={setCurrentScreen}
            onBack={handleBackToMenu}
            currentGameDay={currentGameDay}
            syncPlayers={syncPlayers}
            syncMatches={syncMatches}
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
            setCurrentScreen={setCurrentScreen}
            onBack={handleBackToMenu}
            currentGameDay={currentGameDay}
            syncMatches={syncMatches}
            syncGoalEvent={syncGoalEvent}
            removeGoalEvent={removeGoalEvent}
            updateGameDaySettings={updateGameDaySettings}
            syncActiveMatch={syncActiveMatch}
          />
        );
      
      case 'standings':
        return (
          <StandingsScreen
            matches={matches}
            settings={settings}
            setCurrentScreen={setCurrentScreen}
            onBack={handleBackToMenu}
          />
        );
      
      case 'scorers':
        return (
          <ScorersScreen
            matchEvents={matchEvents}
            setMatchEvents={setMatchEvents}
            setCurrentScreen={setCurrentScreen}
            onBack={handleBackToMenu}
          />
        );
      
      case 'colete':
        return (
          <ColeteScreen
            players={players}
            teams={teams}
            matches={matches}
            settings={settings}
            coleteParticipants={coleteParticipants}
            setColeteParticipants={setColeteParticipants}
            immunePlayer={immunePlayer}
            setImmunePlayer={setImmunePlayer}
            coleteWinner={coleteWinner}
            setColeteWinner={setColeteWinner}
            setCurrentScreen={setCurrentScreen}
            onBack={handleBackToMenu}
            syncVestAssignment={syncVestAssignment}
          />
        );
      
      case 'settings':
        return (
          <SettingsScreen
            settings={settings}
            setSettings={setSettings}
            setCurrentScreen={setCurrentScreen}
            onBack={handleBackToHome}
          />
        );
      
      default:
        return (
          <GameDayHomeScreen
            onGameSelected={handleGameCreated}
            currentGameDay={currentGameDay}
            players={players}
            matches={matches}
            coleteWinner={coleteWinner}
            settings={settings}
            setCurrentScreen={setCurrentScreen}
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