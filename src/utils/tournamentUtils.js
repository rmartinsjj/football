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
  
  // Get unique teams from matches to create dynamic standings
  const teams = [...new Set(matches.flatMap(m => [m.team1, m.team2]))];
  const standings = {};
  
  teams.forEach(team => {
    standings[team] = { points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 };
  });

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

export const drawTeams = (players, activeTeams = ['Vermelho', 'Azul', 'Brasil', 'Verde Branco']) => {
  const shuffledPlayers = shuffleArray(players);
  const newTeams = {
    ...Object.fromEntries(activeTeams.map(team => [team, []]))
  };

  shuffledPlayers.forEach((player, index) => {
    const teamIndex = index % activeTeams.length;
    newTeams[activeTeams[teamIndex]].push(player);
  });

  return newTeams;
};

export const generatePlayoffMatches = (matches, standings) => {
  console.log('generatePlayoffMatches called with standings:', standings);
  
  // Only generate playoff matches if all regular season matches are completed
  const activeTeams = [...new Set(matches.filter(m => m.type === 'regular').flatMap(m => [m.team1, m.team2]))];
  const regularMatches = matches.filter(m => m.type === 'regular' && activeTeams.includes(m.team1) && activeTeams.includes(m.team2));
  const allRegularMatchesCompleted = regularMatches.every(m => m.played);
  
  console.log('Regular matches completed:', allRegularMatchesCompleted);
  console.log('Standings length:', standings.length);
  
  if (!allRegularMatchesCompleted || standings.length < 4) {
    console.log('Not ready for playoffs yet');
    return matches;
  }
  
  const updatedMatches = [...matches];
  
  // 3rd place match (3rd vs 4th)
  const thirdPlaceMatch = updatedMatches.find(m => m.id === 13);
  if (thirdPlaceMatch && (thirdPlaceMatch.team1 === 'TBD' || thirdPlaceMatch.team2 === 'TBD')) {
    console.log('Setting up 3rd place match:', standings[2].team, 'vs', standings[3].team);
    thirdPlaceMatch.team1 = standings[2].team; // 3rd place
    thirdPlaceMatch.team2 = standings[3].team; // 4th place
  }
  
  // Final (1st vs 2nd)
  const finalMatch = updatedMatches.find(m => m.id === 14);
  if (finalMatch && (finalMatch.team1 === 'TBD' || finalMatch.team2 === 'TBD')) {
    console.log('Setting up final match:', standings[0].team, 'vs', standings[1].team);
    finalMatch.team1 = standings[0].team; // 1st place
    finalMatch.team2 = standings[1].team; // 2nd place
  }
  
  console.log('Updated matches with playoffs:', updatedMatches.filter(m => m.id >= 13));
  return updatedMatches;
};

// Generate next match for winner-stays mode - CORRIGIDO
export const generateNextWinnerStaysMatch = (matches, currentWinnerTeam, teams, activeTeams = null) => {
  console.log('Generating next winner-stays match:', { currentWinnerTeam, activeTeams });
  
  const teamNames = activeTeams || Object.keys(teams);
  const availableTeams = teamNames.filter(team => team !== currentWinnerTeam);
  
  console.log('Available challenger teams:', availableTeams);
  
  if (availableTeams.length === 0) {
    console.log('No teams available to challenge');
    return null; // No teams available to challenge
  }
  
  // Pick a random challenger from available teams
  const challengerTeam = availableTeams[Math.floor(Math.random() * availableTeams.length)];
  
  // Find the next sequential match ID for winner-stays matches
  const winnerStaysMatches = matches.filter(m => m.type === 'winner-stays' || !m.type);
  const lastWinnerStaysId = winnerStaysMatches.length > 0 ? Math.max(...winnerStaysMatches.map(m => m.id)) : 0;
  const nextId = lastWinnerStaysId + 1;
  
  console.log('Creating new match:', { id: nextId, winner: currentWinnerTeam, challenger: challengerTeam });
  
  return {
    id: nextId,
    team1: currentWinnerTeam, // O time que fica sempre é o team1
    team2: challengerTeam,    // O desafiante sempre é o team2
    score1: null,
    score2: null,
    played: false,
    type: 'winner-stays'
  };
};

// Get winner-stays standings - CORRIGIDO
export const calculateWinnerStaysStandings = (matches) => {
  console.log('Calculating winner-stays standings for matches:', matches);
  
  // Get unique teams from matches to create dynamic standings
  const teams = [...new Set(matches.flatMap(m => [m.team1, m.team2]))];
  const standings = {};
  
  teams.forEach(team => {
    standings[team] = { wins: 0, matches: 0, draws: 0, losses: 0 };
  });

  // Processar apenas jogos do tipo winner-stays que foram finalizados
  const winnerStaysMatches = matches.filter(match => 
    match.played === true && (match.type === 'winner-stays' || !match.type)
  );
  
  console.log('Processing winner-stays matches:', winnerStaysMatches);

  winnerStaysMatches.forEach(match => {
    const score1 = parseInt(match.score1 ?? 0) || 0;
    const score2 = parseInt(match.score2 ?? 0) || 0;
    
    console.log(`Processing match ${match.id}: ${match.team1} ${score1} x ${score2} ${match.team2}`);
    
    standings[match.team1].matches++;
    standings[match.team2].matches++;
    
    if (score1 > score2) {
      // Team1 (quem estava) venceu
      standings[match.team1].wins++;
      standings[match.team2].losses++;
      console.log(`${match.team1} won and stays`);
    } else if (score2 > score1) {
      // Team2 (desafiante) venceu
      standings[match.team2].wins++;
      standings[match.team1].losses++;
      console.log(`${match.team2} won and becomes new winner`);
    } else {
      // Empate - no modo "quem ganha fica", empate = desafiante vira o novo vencedor
      standings[match.team2].wins++; // Desafiante "ganha" com o empate
      standings[match.team1].draws++;
      standings[match.team2].draws++;
      console.log(`Draw: ${match.team2} becomes new winner`);
    }
  });
  
  const result = Object.entries(standings)
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
    
  console.log('Final winner-stays standings:', result);
  return result;
};

// Winner-stays logic - CORRIGIDO
export const handleWinnerStaysMatch = (match, currentWinnerTeam) => {
  const score1 = parseInt(match.score1 ?? 0) || 0;
  const score2 = parseInt(match.score2 ?? 0) || 0;
  
  let newWinnerTeam = currentWinnerTeam;
  let message = '';
  
  console.log('Handling winner-stays match:', { 
    match: `${match.team1} ${score1} x ${score2} ${match.team2}`, 
    currentWinner: currentWinnerTeam 
  });
  
  if (score1 > score2) {
    // Team1 venceu
    newWinnerTeam = match.team1;
    if (currentWinnerTeam === match.team1) {
      message = `🏆 ${match.team1} venceu e continua em campo!`;
    } else {
      message = `🏆 ${match.team1} venceu e agora é o time que fica!`;
    }
  } else if (score2 > score1) {
    // Team2 venceu
    newWinnerTeam = match.team2;
    message = `🏆 ${match.team2} venceu e agora é o time que fica!`;
  } else {
    // Empate - no modo "quem ganha fica", o desafiante (team2) sempre vira o novo vencedor
    newWinnerTeam = match.team2;
    message = `🤝 Empate! ${match.team2} empatou e agora fica em campo!`;
  }
  
  console.log('Result:', { newWinnerTeam, message });
  
  return {
    newWinnerTeam,
    message
  };
};

// Initialize winner-stays mode with first match - NOVO
export const initializeWinnerStaysMode = (teams, activeTeams) => {
  const teamNames = activeTeams || Object.keys(teams);
  
  if (teamNames.length < 2) {
    return { matches: [], currentWinner: null };
  }
  
  // Escolher dois times aleatórios para o primeiro jogo
  const shuffledTeams = shuffleArray([...teamNames]);
  const team1 = shuffledTeams[0];
  const team2 = shuffledTeams[1];
  
  const firstMatch = {
    id: 1,
    team1: team1,
    team2: team2,
    score1: null,
    score2: null,
    played: false,
    type: 'winner-stays'
  };
  
  return {
    matches: [firstMatch],
    currentWinner: null // Será definido após o primeiro jogo
  };
};