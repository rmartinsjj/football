export const TEAM_COLORS = {
  'Vermelho': { bg: 'bg-red-500', gradient: 'from-red-500 to-red-600', text: 'text-red-600' },
  'Azul': { bg: 'bg-blue-500', gradient: 'from-blue-500 to-blue-600', text: 'text-blue-600' },
  'Brasil': { bg: 'bg-yellow-500', gradient: 'from-yellow-500 to-yellow-600', text: 'text-yellow-600' },
  'Verde Branco': { bg: 'bg-green-500', gradient: 'from-green-500 to-green-600', text: 'text-green-600' }
};

export const AVAILABLE_TEAMS = ['Vermelho', 'Azul', 'Brasil', 'Verde Branco'];

export const INITIAL_MATCHES = [
  // Regular season matches (1-12)
  { id: 1, team1: 'Vermelho', team2: 'Azul', score1: null, score2: null, played: false, type: 'regular' },
  { id: 2, team1: 'Verde Branco', team2: 'Brasil', score1: null, score2: null, played: false, type: 'regular' },
  { id: 3, team1: 'Verde Branco', team2: 'Vermelho', score1: null, score2: null, played: false, type: 'regular' },
  { id: 4, team1: 'Brasil', team2: 'Azul', score1: null, score2: null, played: false, type: 'regular' },
  { id: 5, team1: 'Verde Branco', team2: 'Azul', score1: null, score2: null, played: false, type: 'regular' },
  { id: 6, team1: 'Vermelho', team2: 'Brasil', score1: null, score2: null, played: false, type: 'regular' },
  { id: 7, team1: 'Azul', team2: 'Vermelho', score1: null, score2: null, played: false, type: 'regular' },
  { id: 8, team1: 'Brasil', team2: 'Verde Branco', score1: null, score2: null, played: false, type: 'regular' },
  { id: 9, team1: 'Vermelho', team2: 'Verde Branco', score1: null, score2: null, played: false, type: 'regular' },
  { id: 10, team1: 'Azul', team2: 'Brasil', score1: null, score2: null, played: false, type: 'regular' },
  { id: 11, team1: 'Azul', team2: 'Verde Branco', score1: null, score2: null, played: false, type: 'regular' },
  { id: 12, team1: 'Brasil', team2: 'Vermelho', score1: null, score2: null, played: false, type: 'regular' },
  
  // Playoff matches (13-14) - will be populated dynamically based on standings
  { id: 13, team1: 'TBD', team2: 'TBD', score1: null, score2: null, played: false, type: 'third_place', name: 'Disputa 3º Lugar' },
  { id: 14, team1: 'TBD', team2: 'TBD', score1: null, score2: null, played: false, type: 'final', name: 'Final' }
];

export const INITIAL_TEAMS = {
  Vermelho: [],
  Azul: [],
  Brasil: [],
  'Verde Branco': []
};

export const TIMER_DURATION = {
  NORMAL_MATCH: 7 * 60, // 7 minutes in seconds (default)
  FINAL_MATCH: 10 * 60  // 10 minutes in seconds (default)
};