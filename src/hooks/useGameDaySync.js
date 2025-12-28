import { useEffect, useCallback } from 'react';
import { gameDayService } from '../services/gameDayService';

export const useGameDaySync = (currentGameDay) => {
  const syncPlayers = useCallback(async (players) => {
    if (!currentGameDay?.id) return;

    try {
      const existingPlayers = await gameDayService.getPlayersByGameDay(currentGameDay.id);
      const existingPlayerMap = new Map(existingPlayers.map(p => [p.id, p]));

      console.log('Syncing players:', players.length, 'players');
      console.log('Existing players in DB:', existingPlayers.length);

      for (const player of players) {
        const existingPlayer = existingPlayerMap.get(player.id);

        if (existingPlayer) {
          console.log(`Updating player ${player.name} with team ${player.team_name}`);
          if (existingPlayer.team_name !== player.team_name && player.team_name) {
            await gameDayService.updatePlayer(player.id, { team_name: player.team_name });
          }
        } else if (player.team_name) {
          console.log(`Adding new player ${player.name} to team ${player.team_name}`);
          await gameDayService.addPlayer(currentGameDay.id, player.name, player.team_name);
        }
      }

      console.log('Players sync complete');
    } catch (error) {
      console.error('Error syncing players:', error);
    }
  }, [currentGameDay]);

  const syncMatches = useCallback(async (matches) => {
    if (!currentGameDay?.id) return matches;

    try {
      const existingMatches = await gameDayService.getMatchesByGameDay(currentGameDay.id);
      const existingMatchMap = new Map(existingMatches.map(m => [m.match_number, m]));

      for (const match of matches) {
        const existingMatch = existingMatchMap.get(match.id);

        if (!existingMatch) {
          await gameDayService.createMatch(currentGameDay.id, {
            match_number: match.id,
            team1: match.team1,
            team2: match.team2,
            score1: match.score1 || 0,
            score2: match.score2 || 0,
            penalty_score1: match.penaltyScore1,
            penalty_score2: match.penaltyScore2,
            winner: match.winner,
            match_type: match.type || 'regular',
            played: match.played || false
          });
        } else {
          await gameDayService.updateMatch(existingMatch.id, {
            score1: match.score1 || 0,
            score2: match.score2 || 0,
            penalty_score1: match.penaltyScore1,
            penalty_score2: match.penaltyScore2,
            winner: match.winner,
            played: match.played || false
          });
        }
      }

      // Fetch updated matches with dbIds
      const updatedMatches = await gameDayService.getMatchesByGameDay(currentGameDay.id);
      return matches.map(match => {
        const dbMatch = updatedMatches.find(m => m.match_number === match.id);
        return {
          ...match,
          dbId: dbMatch?.id
        };
      });
    } catch (error) {
      console.error('Error syncing matches:', error);
      return matches;
    }
  }, [currentGameDay]);

  const syncGoalEvent = useCallback(async (playerId, playerName, teamName, matchId, minute) => {
    console.log('⚽ syncGoalEvent called:', { playerId, playerName, teamName, matchId, minute });
    console.log('⚽ currentGameDay:', currentGameDay);

    if (!currentGameDay?.id) {
      console.log('⚽ No currentGameDay, returning null');
      return null;
    }

    try {
      console.log('⚽ Getting matches for game day:', currentGameDay.id);
      const matches = await gameDayService.getMatchesByGameDay(currentGameDay.id);
      console.log('⚽ Matches found:', matches.length);

      const match = matches.find(m => m.match_number === matchId);
      console.log('⚽ Match found:', match);

      if (!match) {
        console.error('Match not found:', matchId);
        return null;
      }

      console.log('⚽ Saving goal event to database...');
      const event = await gameDayService.addGoalEvent(
        match.id,
        currentGameDay.id,
        playerId,
        playerName,
        teamName,
        minute
      );
      console.log('⚽ Goal event saved:', event);

      // Return event with match_number for proper mapping
      return {
        ...event,
        match_number: matchId
      };
    } catch (error) {
      console.error('Error syncing goal event:', error);
      return null;
    }
  }, [currentGameDay]);

  const removeGoalEvent = useCallback(async (eventId) => {
    try {
      await gameDayService.deleteMatchEvent(eventId);
    } catch (error) {
      console.error('Error removing goal event:', error);
    }
  }, []);

  const syncVestAssignment = useCallback(async (teamName) => {
    if (!currentGameDay?.id) return;

    try {
      await gameDayService.setVestAssignment(currentGameDay.id, teamName);
    } catch (error) {
      console.error('Error syncing vest assignment:', error);
    }
  }, [currentGameDay]);

  const updateGameDaySettings = useCallback(async (settings) => {
    if (!currentGameDay?.id) return;

    try {
      await gameDayService.updateGameDay(currentGameDay.id, {
        tournament_type: settings.tournamentType,
        active_teams: settings.activeTeams,
        current_winner_team: settings.currentWinnerTeam
      });
    } catch (error) {
      console.error('Error updating game day settings:', error);
    }
  }, [currentGameDay]);

  const syncActiveMatch = useCallback(async (matchId) => {
    if (!currentGameDay?.id) return;

    try {
      await gameDayService.updateGameDay(currentGameDay.id, {
        active_match_id: matchId
      });
    } catch (error) {
      console.error('Error updating active match:', error);
    }
  }, [currentGameDay]);

  return {
    syncPlayers,
    syncMatches,
    syncGoalEvent,
    removeGoalEvent,
    syncVestAssignment,
    updateGameDaySettings,
    syncActiveMatch
  };
};
