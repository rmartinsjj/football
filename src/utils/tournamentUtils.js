export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const calculateStandings = (matches) => {
  console.log('Calculating standings for matches:', matches.map(m => ({ 
    id: m.id, 
    played: m.played, 
    score1: m.score1, 
    score2: m.score2, 
    team1: m.team1, 
    team2: m.team2 
  })));
  
  const standings = {
    'Vermelho': { points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 },
    'Azul': { points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 },
    'Brasil': { points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 },
    'Verde Branco': { points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 }
  };

  matches.forEach(match => {
    // Só calcular pontos para jogos FINALIZADOS (played = true) E que sejam da temporada regular
    if (match.played === true && match.type === 'regular') {
      const team1 = match.team1;
      const team2 = match.team2;
      const score1 = parseInt(match.score1 ?? 0) || 0;
      const score2 = parseInt(match.score2 ?? 0) || 0;
      
      console.log(`Processing match ${match.id}: ${team1} ${score1} x ${score2} ${team2} (played: ${match.played})`);

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
  
  const result = Object.entries(standings)
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
    
  console.log('Final standings:', result);
  return result;

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

export const generatePlayoffMatches = (matches, standings) => {
  // Only generate playoff matches if all 12 regular season matches are completed
  const regularMatches = matches.filter(m => m.type === 'regular');
  const allRegularMatchesCompleted = regularMatches.every(m => m.played);
  
  if (!allRegularMatchesCompleted || standings.length < 4) {
    return matches;
  }
  
  const updatedMatches = [...matches];
  
  // 3rd place match (3rd vs 4th)
  const thirdPlaceMatch = updatedMatches.find(m => m.id === 13);
  if (thirdPlaceMatch && thirdPlaceMatch.team1 === 'TBD') {
    thirdPlaceMatch.team1 = standings[2].team; // 3rd place
    thirdPlaceMatch.team2 = standings[3].team; // 4th place
  }
  
  // Final (1st vs 2nd)
  const finalMatch = updatedMatches.find(m => m.id === 14);
  if (finalMatch && finalMatch.team1 === 'TBD') {
    finalMatch.team1 = standings[0].team; // 1st place
    finalMatch.team2 = standings[1].team; // 2nd place
  }
  
  return updatedMatches;
};

// Generate next match for winner-stays mode
export const generateNextWinnerStaysMatch = (matches, currentWinnerTeam, teams) => {
  const teamNames = Object.keys(teams);
  const availableTeams = teamNames.filter(team => team !== currentWinnerTeam);
  
  if (availableTeams.length === 0) {
    return null; // No teams available to challenge
  }
  
  // Pick a random challenger from available teams
  const challengerTeam = availableTeams[Math.floor(Math.random() * availableTeams.length)];
  
  // Find the next match ID
  const lastMatchId = Math.max(...matches.map(m => m.id), 0);
  
  return {
    id: lastMatchId + 1,
    team1: currentWinnerTeam,
    team2: challengerTeam,
    score1: null,
    score2: null,
    played: false,
    type: 'winner-stays'
  };
};

// Get winner-stays standings (just track wins for each team)
export const calculateWinnerStaysStandings = (matches) => {
  const standings = {
    'Vermelho': { wins: 0, matches: 0 },
    'Azul': { wins: 0, matches: 0 },
    'Brasil': { wins: 0, matches: 0 },
    'Verde Branco': { wins: 0, matches: 0 }
  };

  matches.forEach(match => {
    if (match.played === true && match.type === 'winner-stays') {
      const score1 = parseInt(match.score1 ?? 0) || 0;
      const score2 = parseInt(match.score2 ?? 0) || 0;
      
      standings[match.team1].matches++;
      standings[match.team2].matches++;
      
      if (score1 > score2) {
        // Team1 won
        standings[match.team1].wins++;
      } else if (score2 > score1) {
        // Team2 won
        standings[match.team2].wins++;
      } else {
        // Tie - in winner-stays mode, the challenger (team2) becomes the new winner
        // So we give the "win" to team2 (the challenger)
        standings[match.team2].wins++;
      }
    }
  });
  
  return Object.entries(standings)
    .map(([team, stats]) => ({ 
      team, 
      ...stats,
      winRate: stats.matches > 0 ? (stats.wins / stats.matches * 100).toFixed(1) : '0.0'
    }))
    .sort((a, b) => {
      // Sort by wins first, then by win rate
      if (b.wins !== a.wins) return b.wins - a.wins;
      return parseFloat(b.winRate) - parseFloat(a.winRate);
    });
};

// Winner-stays logic: handle match results for "quem ganha fica" mode
export const handleWinnerStaysMatch = (match, currentWinnerTeam) => {
  const score1 = parseInt(match.score1 ?? 0) || 0;
  const score2 = parseInt(match.score2 ?? 0) || 0;
  
  let newWinnerTeam = currentWinnerTeam;
  let message = '';
  
  if (score1 > score2) {
    // Team1 won
    newWinnerTeam = match.team1;
    if (currentWinnerTeam === match.team1) {
      message = `🏆 ${match.team1} continua vencendo e permanece em campo!`;
    } else {
      message = `🏆 ${match.team1} venceu e agora é o time que fica em campo!`;
    }
  } else if (score2 > score1) {
    // Team2 won
    newWinnerTeam = match.team2;
    if (currentWinnerTeam === match.team2) {
      message = `🏆 ${match.team2} continua vencendo e permanece em campo!`;
    } else {
      message = `🏆 ${match.team2} venceu e agora é o time que fica em campo!`;
    }
  } else {
    // Tie - the team that tied with the current winner becomes the new winner
    if (currentWinnerTeam === match.team1) {
      newWinnerTeam = match.team2;
      message = `🤝 Empate! ${match.team2} empatou com o atual vencedor e agora fica em campo!`;
    } else if (currentWinnerTeam === match.team2) {
      newWinnerTeam = match.team1;
      message = `🤝 Empate! ${match.team1} empatou com o atual vencedor e agora fica em campo!`;
    } else {
      // First match or no current winner - randomly pick one
      newWinnerTeam = Math.random() < 0.5 ? match.team1 : match.team2;
      message = `🤝 Empate! ${newWinnerTeam} foi sorteado para ficar em campo!`;
    }
  }
  
  return {
    newWinnerTeam,
    message
  };
};