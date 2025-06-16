export const TEAM_COLORS = {
  'Vermelho': { bg: 'bg-red-500', gradient: 'from-red-500 to-red-600', text: 'text-red-600' },
  'Azul': { bg: 'bg-blue-500', gradient: 'from-blue-500 to-blue-600', text: 'text-blue-600' },
  'Brasil': { bg: 'bg-yellow-500', gradient: 'from-yellow-500 to-yellow-600', text: 'text-yellow-600' },
  'Verde Branco': { bg: 'bg-green-500', gradient: 'from-green-500 to-green-600', text: 'text-green-600' }
};

export const INITIAL_MATCHES = [
  { id: 1, team1: 'Vermelho', team2: 'Azul', score1: null, score2: null, played: false },
  { id: 2, team1: 'Verde Branco', team2: 'Brasil', score1: null, score2: null, played: false },
  { id: 3, team1: 'Verde Branco', team2: 'Vermelho', score1: null, score2: null, played: false },
  { id: 4, team1: 'Brasil', team2: 'Azul', score1: null, score2: null, played: false },
  { id: 5, team1: 'Verde Branco', team2: 'Azul', score1: null, score2: null, played: false },
  { id: 6, team1: 'Vermelho', team2: 'Brasil', score1: null, score2: null, played: false },
  { id: 7, team1: 'Azul', team2: 'Vermelho', score1: null, score2: null, played: false },
  { id: 8, team1: 'Brasil', team2: 'Verde Branco', score1: null, score2: null, played: false },
  { id: 9, team1: 'Vermelho', team2: 'Verde Branco', score1: null, score2: null, played: false },
  { id: 10, team1: 'Azul', team2: 'Brasil', score1: null, score2: null, played: false },
  { id: 11, team1: 'Azul', team2: 'Verde Branco', score1: null, score2: null, played: false },
  { id: 12, team1: 'Brasil', team2: 'Vermelho', score1: null, score2: null, played: false }
];

export const INITIAL_TEAMS = {
  Vermelho: [],
  Azul: [],
  Brasil: [],
  'Verde Branco': []
};

export const TIMER_DURATION = {
  NORMAL_MATCH: 7 * 60, // 7 minutes in seconds
  FINAL_MATCH: 10 * 60  // 10 minutes in seconds
};