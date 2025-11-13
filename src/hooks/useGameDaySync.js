import { useEffect, useCallback } from 'react';
import { gameDayService } from '../services/gameDayService';

export const useGameDaySync = (currentGameDay) => {
  const syncPlayers = useCallback(async (players) => {
    if (!currentGameDay?.id) return;

    try {
      const existingPlayers = await gameDayService.getPlayersByGameDay(currentGameDay.id);
      const existingPlayerIds = new Set(existingPlayers.map(p => p.id));

      for (const player of players) {
        if (!existingPlayerIds.has(player.id) && player.team_name) {
          await gameDayService.addPlayer(currentGameDay.id, player.name, player.team_name);
        }
      }
    } catch (error) {
      console.error('Error syncing players:', error);
    }
  }, [currentGameDay]);

  const syncMatches = useCallback(async (matches) => {
    if (!currentGameDay?.id) return;

    try {
      const existingMatches = await gameDayService.getMatchesByGameDay(currentGameDay.id);
      const existingMatchNumbers = new Set(existingMatches.map(m => m.match_number));

      for (const match of matches) {
        if (!existingMatchNumbers.has(match.id)) {
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
        } else if (match.dbId) {
          await gameDayService.updateMatch(match.dbId, {
            score1: match.score1 || 0,
            score2: match.score2 || 0,
            penalty_score1: match.penaltyScore1,
            penalty_score2: match.penaltyScore2,
            winner: match.winner,
            played: match.played || false
          });
        }
      }
    } catch (error) {
      console.error('Error syncing matches:', error);
    }
  }, [currentGameDay]);

  const syncGoalEvent = useCallback(async (playerId, playerName, teamName, matchId, minute) => {
    if (!currentGameDay?.id) return null;

    try {
      const matches = await gameDayService.getMatchesByGameDay(currentGameDay.id);
      const match = matches.find(m => m.match_number === matchId);

      if (!match) {
        console.error('Match not found:', matchId);
        return null;
      }

      const event = await gameDayService.addGoalEvent(
        match.id,
        currentGameDay.id,
        playerId,
        playerName,
        teamName,
        minute
      );

      return event;
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

  return {
    syncPlayers,
    syncMatches,
    syncGoalEvent,
    removeGoalEvent,
    syncVestAssignment,
    updateGameDaySettings
  };
};
