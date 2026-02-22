export const TEAM_COLORS = {
  'Flamengo': { bg: 'bg-red-600', gradient: 'from-red-600 to-red-700', text: 'text-red-600' },
  'Cruzeiro': { bg: 'bg-blue-600', gradient: 'from-blue-600 to-blue-700', text: 'text-blue-600' },
  'Corinthians': { bg: 'bg-black', gradient: 'from-black to-gray-800', text: 'text-gray-400' },
  'Palmeiras': { bg: 'bg-green-600', gradient: 'from-green-600 to-green-700', text: 'text-green-600' }
};

export const AVAILABLE_TEAMS = ['Flamengo', 'Cruzeiro', 'Corinthians', 'Palmeiras'];

export const INITIAL_MATCHES = [
  // Regular season matches (1-12)
  { id: 1, team1: 'Flamengo', team2: 'Cruzeiro', score1: null, score2: null, played: false, type: 'regular' },
  { id: 2, team1: 'Palmeiras', team2: 'Corinthians', score1: null, score2: null, played: false, type: 'regular' },
  { id: 3, team1: 'Palmeiras', team2: 'Flamengo', score1: null, score2: null, played: false, type: 'regular' },
  { id: 4, team1: 'Corinthians', team2: 'Cruzeiro', score1: null, score2: null, played: false, type: 'regular' },
  { id: 5, team1: 'Palmeiras', team2: 'Cruzeiro', score1: null, score2: null, played: false, type: 'regular' },
  { id: 6, team1: 'Flamengo', team2: 'Corinthians', score1: null, score2: null, played: false, type: 'regular' },
  { id: 7, team1: 'Cruzeiro', team2: 'Flamengo', score1: null, score2: null, played: false, type: 'regular' },
  { id: 8, team1: 'Corinthians', team2: 'Palmeiras', score1: null, score2: null, played: false, type: 'regular' },
  { id: 9, team1: 'Flamengo', team2: 'Palmeiras', score1: null, score2: null, played: false, type: 'regular' },
  { id: 10, team1: 'Cruzeiro', team2: 'Corinthians', score1: null, score2: null, played: false, type: 'regular' },
  { id: 11, team1: 'Cruzeiro', team2: 'Palmeiras', score1: null, score2: null, played: false, type: 'regular' },
  { id: 12, team1: 'Corinthians', team2: 'Flamengo', score1: null, score2: null, played: false, type: 'regular' },

  // Playoff matches (13-14) - will be populated dynamically based on standings
  { id: 13, team1: 'TBD', team2: 'TBD', score1: null, score2: null, played: false, type: 'third_place', name: 'Disputa 3º Lugar' },
  { id: 14, team1: 'TBD', team2: 'TBD', score1: null, score2: null, played: false, type: 'final', name: 'Final' }
];

export const INITIAL_TEAMS = {
  Flamengo: [],
  Cruzeiro: [],
  Corinthians: [],
  Palmeiras: []
};

export const TIMER_DURATION = {
  NORMAL_MATCH: 7 * 60, // 7 minutes in seconds (default)
  FINAL_MATCH: 10 * 60  // 10 minutes in seconds (default)
};