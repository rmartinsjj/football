export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const calculateStandings = (matches) => {
  const standings = {
    'Vermelho': { points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 },
    'Azul': { points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 },
    'Brasil': { points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 },
    'Verde Branco': { points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 }
  };

  matches.forEach(match => {
    if (match.played && match.score1 !== null && match.score2 !== null && match.score1 !== '' && match.score2 !== '') {
      const team1 = match.team1;
      const team2 = match.team2;
      const score1 = parseInt(match.score1) || 0;
      const score2 = parseInt(match.score2) || 0;

      // Contabilizar gols
      standings[team1].goalsFor += score1;
      standings[team1].goalsAgainst += score2;
      standings[team2].goalsFor += score2;
      standings[team2].goalsAgainst += score1;

      // Contabilizar pontos e resultados
      if (score1 > score2) {
        // Team1 venceu
        standings[team1].wins++;
        standings[team1].points += 3;
        standings[team2].losses++;
      } else if (score2 > score1) {
        // Team2 venceu
        standings[team2].wins++;
        standings[team2].points += 3;
        standings[team1].losses++;
      } else {
        // Empate (incluindo 0x0)
        standings[team1].draws++;
        standings[team2].draws++;
        standings[team1].points += 1;
        standings[team2].points += 1;
      }
    }
  });

  return Object.entries(standings)
    .map(([team, stats]) => ({ 
      team, 
      ...stats, 
      goalDiff: stats.goalsFor - stats.goalsAgainst,
      gamesPlayed: stats.wins + stats.draws + stats.losses
    }))
    .sort((a, b) => {
      // Primeiro critério: pontos
      if (b.points !== a.points) return b.points - a.points;
      // Segundo critério: saldo de gols
      if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
      // Terceiro critério: gols marcados
      return b.goalsFor - a.goalsFor;
    });
};

export const parsePlayerList = (playerListText) => {
  const lines = playerListText.split('\n').filter(line => line.trim());
  return lines.map((line, index) => {
    const cleanName = line.replace(/^\d+\.?\s*⁠?\s*/, '').trim();
    return {
      id: Date.now() + index,
      name: cleanName,
      photo: null
    };
  }).filter(player => player.name);
};

export const drawTeams = (players) => {
  const shuffledPlayers = shuffleArray(players);
  const teamNames = ['Vermelho', 'Azul', 'Brasil', 'Verde Branco'];
  const newTeams = {
    Vermelho: [],
    Azul: [],
    Brasil: [],
    'Verde Branco': []
  };

  shuffledPlayers.forEach((player, index) => {
    const teamIndex = index % 4;
    newTeams[teamNames[teamIndex]].push(player);
  });

  return newTeams;
};