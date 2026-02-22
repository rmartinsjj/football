import { supabase } from '../lib/supabase';

export const gameDayService = {
  async createGameDay(gameDate, tournamentType = 'championship', activeTeams = ['Flamengo', 'Cruzeiro', 'Corinthians', 'Palmeiras']) {
    console.log('🎮 Creating game day:', { gameDate, tournamentType, activeTeams });

    try {
      const { data: existingGameDays, error: checkError } = await supabase
        .from('game_days')
        .select('id, is_active')
        .eq('is_active', true)
        .maybeSingle();

      if (checkError) {
        console.error('❌ Error checking existing games:', checkError);
        throw new Error(`Erro ao verificar jogos existentes: ${checkError.message}`);
      }

      if (existingGameDays) {
        console.log('📝 Deactivating existing game:', existingGameDays.id);
        const { error: updateError } = await supabase
          .from('game_days')
          .update({ is_active: false })
          .eq('id', existingGameDays.id);

        if (updateError) {
          console.error('❌ Error deactivating game:', updateError);
        }
      }

      console.log('✨ Inserting new game day...');
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

      if (error) {
        console.error('❌ Error creating game day:', error);
        throw new Error(`Erro ao criar jogo: ${error.message || 'Erro desconhecido'}`);
      }

      console.log('✅ Game day created successfully:', data);

      console.log('🧹 Clearing old data from new game day...');
      await this.clearAllGameDayData(data.id);

      return data;
    } catch (err) {
      console.error('❌ Exception in createGameDay:', err);
      throw err;
    }
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

  async clearAllGameDayData(gameDayId) {
    console.log('🧹 Clearing all data for game day:', gameDayId);

    try {
      await supabase.from('match_events').delete().eq('game_day_id', gameDayId);
      console.log('✅ Cleared match_events');

      await supabase.from('matches').delete().eq('game_day_id', gameDayId);
      console.log('✅ Cleared matches');

      await supabase.from('players').delete().eq('game_day_id', gameDayId);
      console.log('✅ Cleared players');

      await supabase.from('vest_assignments').delete().eq('game_day_id', gameDayId);
      console.log('✅ Cleared vest_assignments');

      const { error } = await supabase
        .from('game_days')
        .update({ active_match: null })
        .eq('id', gameDayId);

      if (error) {
        console.error('❌ Error clearing active_match:', error);
      } else {
        console.log('✅ Cleared active_match');
      }

      console.log('✅ All data cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing game day data:', error);
      throw error;
    }
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
