import { supabase } from '../lib/supabase';

export const gameDayService = {
  async createGameDay(gameDate, tournamentType = 'championship', activeTeams = ['Vermelho', 'Azul', 'Brasil', 'Verde Branco']) {
    const { data: existingGameDays, error: checkError } = await supabase
      .from('game_days')
      .select('id, is_active')
      .eq('is_active', true)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingGameDays) {
      await supabase
        .from('game_days')
        .update({ is_active: false })
        .eq('id', existingGameDays.id);
    }

    const { data, error } = await supabase
      .from('game_days')
      .insert({
        game_date: gameDate,
        tournament_type: tournamentType,
        active_teams: activeTeams,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getActiveGameDay() {
    const { data, error } = await supabase
      .from('game_days')
      .select('*')
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getAllGameDays() {
    const { data, error } = await supabase
      .from('game_days')
      .select('*')
      .order('game_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  async setActiveGameDay(gameDayId) {
    await supabase
      .from('game_days')
      .update({ is_active: false })
      .neq('id', gameDayId);

    const { data, error } = await supabase
      .from('game_days')
      .update({ is_active: true })
      .eq('id', gameDayId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateGameDay(gameDayId, updates) {
    const { data, error } = await supabase
      .from('game_days')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', gameDayId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteGameDay(gameDayId) {
    const { error } = await supabase
      .from('game_days')
      .delete()
      .eq('id', gameDayId);

    if (error) throw error;
  },

  async addPlayer(gameDayId, playerName, teamName) {
    const { data, error } = await supabase
      .from('players')
      .insert({
        name: playerName,
        team_name: teamName,
        game_day_id: gameDayId
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getPlayersByGameDay(gameDayId) {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('game_day_id', gameDayId)
      .order('team_name', { ascending: true });

    if (error) throw error;
    return data;
  },

  async updatePlayer(playerId, updates) {
    const { data, error } = await supabase
      .from('players')
      .update(updates)
      .eq('id', playerId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletePlayer(playerId) {
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', playerId);

    if (error) throw error;
  },

  async createMatch(gameDayId, matchData) {
    const { data, error } = await supabase
      .from('matches')
      .insert({
        game_day_id: gameDayId,
        ...matchData
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getMatchesByGameDay(gameDayId) {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('game_day_id', gameDayId)
      .order('match_number', { ascending: true });

    if (error) throw error;
    return data;
  },

  async updateMatch(matchId, updates) {
    const { data, error } = await supabase
      .from('matches')
      .update(updates)
      .eq('id', matchId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async addGoalEvent(matchId, gameDayId, playerId, playerName, teamName, minute) {
    const { data, error } = await supabase
      .from('match_events')
      .insert({
        match_id: matchId,
        game_day_id: gameDayId,
        player_id: playerId,
        player_name: playerName,
        team_name: teamName,
        minute: minute
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getMatchEventsByGameDay(gameDayId) {
    const { data, error } = await supabase
      .from('match_events')
      .select('*')
      .eq('game_day_id', gameDayId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  async deleteMatchEvent(eventId) {
    const { error } = await supabase
      .from('match_events')
      .delete()
      .eq('id', eventId);

    if (error) throw error;
  },

  async setVestAssignment(gameDayId, teamName) {
    await supabase
      .from('vest_assignments')
      .delete()
      .eq('game_day_id', gameDayId);

    const { data, error } = await supabase
      .from('vest_assignments')
      .insert({
        game_day_id: gameDayId,
        team_name: teamName
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getVestAssignment(gameDayId) {
    const { data, error } = await supabase
      .from('vest_assignments')
      .select('*')
      .eq('game_day_id', gameDayId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
};
