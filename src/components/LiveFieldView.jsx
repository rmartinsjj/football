import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { TEAM_COLORS } from '../constants';
import { calculateStandings, generatePlayoffMatches } from '../utils/tournamentUtils';
import LiveFieldViewTiebreakerModal from './LiveFieldView-TiebreakerModal';
import LiveFieldViewToastMessage from './LiveFieldView-ToastMessage';
import LiveFieldViewMatchHeader from './LiveFieldView-MatchHeader';
import LiveFieldViewGoalkeeperConfig from './LiveFieldView-GoalkeeperConfig';
import LiveFieldViewPenaltyShootout from './LiveFieldView-PenaltyShootout';

const LiveFieldView = ({ 
  matches,
  setMatches,
  teams,
  matchEvents,
  timer,
  isTimerRunning,
  activeMatch,
  setActiveMatch,
  startMatchTimer,
  pauseTimer,
  resumeTimer,
  resetTimer,
  formatTime,
  addGoal,
  removeGoal,
  updateMatchScore,
  setOnTimerFinished
}) => {
  const [goalkeepers, setGoalkeepers] = useState({ 
    left: { name: 'Goleiro 1' }, 
    right: { name: 'Goleiro 2' } 
  });
  const [showGoalkeeperConfig, setShowGoalkeeperConfig] = useState(false);
  const [showPenaltyShootout, setShowPenaltyShootout] = useState(false);
  const [penaltyScore, setPenaltyScore] = useState({ team1: 0, team2: 0 });
  const [showTiebreaker, setShowTiebreaker] = useState(false);
  const [tiebreakerMethod, setTiebreakerMethod] = useState('');
  const [showPlayoffResults, setShowPlayoffResults] = useState(false);
  const [tiebreakerTeams, setTiebreakerTeams] = useState([]);
  const [tiebreakerPositions, setTiebreakerPositions] = useState([]);
  const [playoffResults, setPlayoffResults] = useState({
    champion: null,
    runnerUp: null,
    thirdPlace: null,
    fourthPlace: null
  });
  const [showNextGameButton, setShowNextGameButton] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showToast, setShowToast] = useState(false);

  // Set up timer finished callback
  React.useEffect(() => {
    if (setOnTimerFinished) {
      setOnTimerFinished(() => () => {
        showToastMessage('⏰ Tempo esgotado!', 'info');
      });
    }
  }, [setOnTimerFinished]);

  // Calculate standings and generate playoff matches
  const standings = calculateStandings(matches.filter(m => m.type === 'regular')); // Only regular season for standings
  const updatedMatches = generatePlayoffMatches(matches, standings);
  
  const currentMatch = updatedMatches.find(m => m.id === activeMatch) || updatedMatches.find(m => !m.played) || updatedMatches[0];
  const remainingMatches = updatedMatches.filter(m => m.id > currentMatch.id && !m.played);
  const completedMatches = matches.filter(m => m.id < currentMatch.id && m.played);
  
  const team1Players = teams[currentMatch.team1] || [];
  const team2Players = teams[currentMatch.team2] || [];

  // Update matches if playoff matches were generated
  React.useEffect(() => {
    if (JSON.stringify(updatedMatches) !== JSON.stringify(matches)) {
      setMatches(updatedMatches);
    }
  }, [updatedMatches, matches, setMatches]);

  // Check if tournament is complete and show results
  React.useEffect(() => {
    const allMatches = matches;
    const finalMatch = allMatches.find(m => m.id === 14);
    const thirdPlaceMatch = allMatches.find(m => m.id === 13);
    
    if (finalMatch?.played && thirdPlaceMatch?.played) {
      // Determine final positions
      const finalWinner = finalMatch.score1 > finalMatch.score2 ? finalMatch.team1 : 
                         finalMatch.score2 > finalMatch.score1 ? finalMatch.team2 :
                         finalMatch.winner; // In case of penalties
      
      const finalLoser = finalMatch.team1 === finalWinner ? finalMatch.team2 : finalMatch.team1;
      
      const thirdWinner = thirdPlaceMatch.score1 > thirdPlaceMatch.score2 ? thirdPlaceMatch.team1 : 
                         thirdPlaceMatch.score2 > thirdPlaceMatch.score1 ? thirdPlaceMatch.team2 :
                         thirdPlaceMatch.winner; // In case of penalties
      
      const thirdLoser = thirdPlaceMatch.team1 === thirdWinner ? thirdPlaceMatch.team2 : thirdPlaceMatch.team1;
      
      setPlayoffResults({
        champion: finalWinner,
        runnerUp: finalLoser,
        thirdPlace: thirdWinner,
        fourthPlace: thirdLoser
      });
    }
  }, [matches]);
  // Show toast message
  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  // Check for ties that need resolution
  const checkForTiebreaker = (standings) => {
    // Check for ties that affect playoff positioning
    const ties = [];
    
    // Check 1st vs 2nd place (affects who goes to final)
    if (standings[0].points === standings[1].points) {
      ties.push({
        teams: [standings[0].team, standings[1].team],
        positions: ['1º lugar (Final)', '2º lugar (Final)'],
        description: 'Empate entre 1º e 2º lugar - Ambos vão para a Final, mas quem será cabeça de chave?'
      });
    }
    
    // Check 2nd vs 3rd place (affects final vs 3rd place match)
    if (standings[1].points === standings[2].points && standings[0].points !== standings[1].points) {
      ties.push({
        teams: [standings[1].team, standings[2].team],
        positions: ['2º lugar (Final)', '3º lugar (Disputa 3º)'],
        description: 'Empate entre 2º e 3º lugar - Quem vai para a Final e quem disputa o 3º lugar?'
      });
    }
    
    // Check 3rd vs 4th place (affects 3rd place match vs colete)
    if (standings[2].points === standings[3].points && standings[1].points !== standings[2].points) {
      ties.push({
        teams: [standings[2].team, standings[3].team],
        positions: ['3º lugar (Disputa 3º)', '4º lugar (Colete)'],
        description: 'Empate entre 3º e 4º lugar - Quem disputa o 3º lugar e quem vai direto para o colete?'
      });
    }
    
    // Check for 3-way or 4-way ties
    if (standings[0].points === standings[1].points && standings[1].points === standings[2].points) {
      ties.push({
        teams: [standings[0].team, standings[1].team, standings[2].team],
        positions: ['1º lugar (Final)', '2º lugar (Final)', '3º lugar (Disputa 3º)'],
        description: 'Empate triplo entre 1º, 2º e 3º lugar - Como definir as posições?'
      });
    }
    
    if (ties.length > 0) {
      setTiebreakerTeams(ties[0].teams);
      setTiebreakerPositions(ties[0].positions);
      setShowTiebreaker(true);
      return true;
    }
    
    return false;
  };

  const handleTiebreakerDecision = (method) => {
    setTiebreakerMethod(method);
    
    if (method === 'goals') {
      // Use goal difference/goals scored to decide
      const tiedTeams = tiebreakerTeams.map(teamName => 
        standings.find(s => s.team === teamName)
      ).sort((a, b) => {
        // First by goal difference
        if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
        // Then by goals scored
        return b.goalsFor - a.goalsFor;
      });
      
      if (tiedTeams[0].goalDiff !== tiedTeams[1].goalDiff || tiedTeams[0].goalsFor !== tiedTeams[1].goalsFor) {
        let message = `📊 Desempate por critérios técnicos: `;
        tiedTeams.forEach((team, index) => {
          message += `${tiebreakerPositions[index]}: ${team.team} `;
        });
        showToastMessage(message, 'info');
      } else {
        // Still tied, need to draw
        handleTiebreakerDecision('draw');
        return;
      }
    } else if (method === 'draw') {
      // Random draw
      const shuffledTeams = [...tiebreakerTeams].sort(() => Math.random() - 0.5);
      
      let message = `🎲 Resultado do sorteio: `;
      shuffledTeams.forEach((team, index) => {
        message += `${tiebreakerPositions[index]}: ${team} `;
      });
      
      showToastMessage(message, 'success');
    }
    
    setShowTiebreaker(false);
    setTiebreakerTeams([]);
    setTiebreakerPositions([]);
  };

  const addPenaltyGoal = (team) => {
    setPenaltyScore(prev => ({
      ...prev,
      [team]: prev[team] + 1
    }));
  };

  const removePenaltyGoal = (team) => {
    setPenaltyScore(prev => ({
      ...prev,
      [team]: Math.max(0, prev[team] - 1)
    }));
  };

  const finishPenaltyShootout = () => {
    const team1Name = currentMatch.team1;
    const team2Name = currentMatch.team2;
    
    if (penaltyScore.team1 === penaltyScore.team2) {
      showToastMessage('⚽ Disputa de pênaltis ainda está empatada! Continue marcando os gols.', 'error');
      return;
    }
    
    const winner = penaltyScore.team1 > penaltyScore.team2 ? team1Name : team2Name;
    const finalScore1 = currentMatch.score1 || 0;
    const finalScore2 = currentMatch.score2 || 0;
    
    // Update match with penalty result
    const updatedMatch = { 
      ...currentMatch, 
      played: true,
      score1: finalScore1,
      score2: finalScore2,
      penaltyScore1: penaltyScore.team1,
      penaltyScore2: penaltyScore.team2,
      winner: winner
    };
    
    setMatches(prev => prev.map(m => m.id === currentMatch.id ? updatedMatch : m));
    setActiveMatch(null);
    setShowPenaltyShootout(false);
    setPenaltyScore({ team1: 0, team2: 0 });
    
    showToastMessage(`🏆 ${winner} venceu nos pênaltis! (${penaltyScore.team1} x ${penaltyScore.team2})`, 'success');
  };
  // Finalizar jogo - playoffs não afetam pontuação regular
  const finishMatch = () => {
    const score1 = currentMatch.score1 || 0;
    const score2 = currentMatch.score2 || 0;
    
    // Check if it's match 13 (3rd place) and it's a tie
    if (currentMatch.id === 13 && score1 === score2) {
      setShowPenaltyShootout(true);
      setPenaltyScore({ team1: 0, team2: 0 });
      return;
    }
    
    // Check if it's match 14 (final) and it's a tie
    if (currentMatch.id === 14 && score1 === score2) {
      setShowPenaltyShootout(true);
      setPenaltyScore({ team1: 0, team2: 0 });
      return;
    }
    
    // Check if we need tiebreaker for final qualification
    if (currentMatch.id === 12) { // Last regular season match
      // Calculate final standings
      const finalStandings = calculateStandings(matches.filter(m => m.type === 'regular'));
      if (checkForTiebreaker(finalStandings)) {
        return;
      }
    }
    
    let message = '';
    
    // Special messages for playoff matches
    if (currentMatch.id === 13) {
      // 3rd place match
      if (score1 > score2) {
        message = `🥉 ${currentMatch.team1} conquistou o 3º lugar!`;
      } else if (score2 > score1) {
        message = `🥉 ${currentMatch.team2} conquistou o 3º lugar!`;
      }
    } else if (currentMatch.id === 14) {
      // Final match
      if (score1 > score2) {
        message = `🏆 ${currentMatch.team1} é o CAMPEÃO DO TORNEIO!`;
      } else if (score2 > score1) {
        message = `🏆 ${currentMatch.team2} é o CAMPEÃO DO TORNEIO!`;
      }
    } else {
      // Regular season matches
      if (score1 > score2) {
        message = `🏆 ${currentMatch.team1} venceu! (+3 pontos)`;
      } else if (score2 > score1) {
        message = `🏆 ${currentMatch.team2} venceu! (+3 pontos)`;
      } else {
        message = `🤝 Empate! (+1 ponto para cada time)`;
      }
    }
    
    // For regular season ties
    if (currentMatch.type === 'regular' && score1 === score2) {
      message = `🤝 Empate! (+1 ponto para cada time)`;
    }
    
    // For playoff ties (shouldn't happen as they go to penalties)
    if ((currentMatch.id === 13 || currentMatch.id === 14) && score1 === score2) {
      message = `🤝 Empate! Vai para os pênaltis!`;
    } else {
      // message already set above
    }

    const updatedMatch = { 
      ...currentMatch, 
      played: true,
      score1: score1,
      score2: score2
    };
    
    console.log('Finishing match:', updatedMatch);
    
    setMatches(prev => {
      const updated = prev.map(m => m.id === currentMatch.id ? updatedMatch : m);
      // Generate playoff matches if this was the last regular season match
      const newStandings = calculateStandings(updated.filter(m => m.type === 'regular'));
      return generatePlayoffMatches(updated, newStandings);
    });
    
    // NÃO limpar o activeMatch ainda - manter para mostrar o botão "Próximo Jogo"
    setShowNextGameButton(true);
    
    // Force re-render after a small delay to ensure state is updated
    setTimeout(() => {
      console.log('Match finished, standings should update now');
    }, 100);
    
    showToastMessage(message, 'success');
  };

  const goToNextGame = () => {
    setShowNextGameButton(false);
    setActiveMatch(null); // Limpar o activeMatch
    const nextMatch = matches.find(m => m.id > currentMatch.id && !m.played);
    if (nextMatch) {
      // NÃO iniciar o timer automaticamente - apenas definir como próximo jogo ativo
      setTimeout(() => setActiveMatch(nextMatch.id), 100);
    }
  };

  // Show tournament results if both playoff matches are complete
  const showTournamentResults = () => {
    const finalMatch = matches.find(m => m.id === 14);
    const thirdPlaceMatch = matches.find(m => m.id === 13);
    
    if (finalMatch?.played && thirdPlaceMatch?.played) {
      setShowPlayoffResults(true);
    }
  };
  
  React.useEffect(() => {
    showTournamentResults();
  }, [matches]);
  return (
    <div className="min-h-screen" style={{
      backgroundImage: 'url(/1245151 copy.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      backgroundColor: '#1a1b23'
    }}>
      {/* Toast Message */}
      <LiveFieldViewToastMessage
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      {/* Tournament Results Modal */}
      {showPlayoffResults && playoffResults.champion && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl">
            <div className="mb-6">
              <div className="text-4xl mb-2">🏆</div>
              <h2 className="text-2xl font-bold text-white mb-1">TORNEIO FINALIZADO!</h2>
              <p className="text-yellow-100 text-sm">Espaço Novo Tempo - Praia da Costa</p>
            </div>
            
            <div className="space-y-4">
              {/* Champion */}
              <div className="bg-white bg-opacity-20 rounded-xl p-4 border-2 border-yellow-300">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <div className="text-3xl">🏆</div>
                  <div>
                    <div className="text-yellow-100 text-xs font-medium">CAMPEÃO</div>
                    <div className="text-white text-lg font-bold">{playoffResults.champion}</div>
                  </div>
                </div>
              </div>
              
              {/* Runner-up */}
              <div className="bg-white bg-opacity-15 rounded-xl p-3 border border-gray-300">
                <div className="flex items-center justify-center space-x-3">
                  <div className="text-2xl">🥈</div>
                  <div>
                    <div className="text-gray-200 text-xs font-medium">VICE-CAMPEÃO</div>
                    <div className="text-white text-base font-bold">{playoffResults.runnerUp}</div>
                  </div>
                </div>
              </div>
              
              {/* Third place */}
              <div className="bg-white bg-opacity-10 rounded-xl p-3 border border-orange-300">
                <div className="flex items-center justify-center space-x-3">
                  <div className="text-xl">🥉</div>
                  <div>
                    <div className="text-orange-200 text-xs font-medium">3º LUGAR</div>
                    <div className="text-white text-base font-bold">{playoffResults.thirdPlace}</div>
                  </div>
                </div>
              </div>
              
              {/* Fourth place */}
              <div className="bg-white bg-opacity-5 rounded-xl p-3">
                <div className="flex items-center justify-center space-x-3">
                  <div className="text-lg">4️⃣</div>
                  <div>
                    <div className="text-gray-300 text-xs font-medium">4º LUGAR</div>
                    <div className="text-white text-sm font-bold">{playoffResults.fourthPlace}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => setShowPlayoffResults(false)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Fechar Resultados
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tiebreaker Button - Only show for relevant ties */}
      {(() => {
        // Check for ties that need resolution (2nd vs 3rd, or 3rd vs 4th)
        const needsTiebreaker = 
          (standings[1]?.points === standings[2]?.points && standings[0]?.points !== standings[1]?.points) ||
          (standings[2]?.points === standings[3]?.points && standings[1]?.points !== standings[2]?.points);
        
        if (!needsTiebreaker) return null;
        
        return (
          <div className="bg-gray-800 p-3 border-b border-gray-700">
            <button
              onClick={() => {
                // Determine which teams are tied
                if (standings[1]?.points === standings[2]?.points && standings[0]?.points !== standings[1]?.points) {
                  setTiebreakerTeams([standings[1].team, standings[2].team]);
                  setTiebreakerPositions(['2º lugar (Final)', '3º lugar (Disputa 3º)']);
                } else if (standings[2]?.points === standings[3]?.points && standings[1]?.points !== standings[2]?.points) {
                  setTiebreakerTeams([standings[2].team, standings[3].team]);
                  setTiebreakerPositions(['3º lugar (Disputa 3º)', '4º lugar (Colete)']);
                }
                setShowTiebreaker(true);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="font-medium">Resolver Empate</span>
            </button>
          </div>
        );
      })()}

      {/* Classificação Rápida */}
      <div className="bg-gray-800 p-3 border-b border-gray-700">
        <h4 className="text-white text-xs font-medium mb-2 text-center">Classificação Atual</h4>
        <div className="grid grid-cols-2 gap-2">
          {standings.slice(0, 4).map((team, index) => (
            <div key={team.team} className="flex items-center justify-between bg-gray-700 rounded-lg p-2">
              <div className="flex items-center space-x-2">
                <span className="text-white text-xs font-bold">{index + 1}º</span>
                <div className={`w-3 h-3 ${TEAM_COLORS[team.team].bg} rounded-full`}></div>
                <span className="text-white text-xs truncate">{team.team}</span>
              </div>
              <span className="text-white text-xs font-bold">{team.points}pts</span>
            </div>
          ))}
        </div>
        
        {/* Show tournament results button if complete */}
        {playoffResults.champion && (
          <div className="mt-2 text-center">
            <button
              onClick={() => setShowPlayoffResults(true)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
            >
              🏆 Ver Resultados Finais
            </button>
          </div>
        )}
      </div>

      {/* Match Header */}
      <LiveFieldViewMatchHeader
        currentMatch={currentMatch}
        timer={timer}
        formatTime={formatTime}
        activeMatch={activeMatch}
        isTimerRunning={isTimerRunning}
        startMatchTimer={startMatchTimer}
        pauseTimer={pauseTimer}
        resumeTimer={resumeTimer}
        resetTimer={resetTimer}
        finishMatch={finishMatch}
        showNextGameButton={showNextGameButton}
        goToNextGame={goToNextGame}
        showGoalkeeperConfig={showGoalkeeperConfig}
        setShowGoalkeeperConfig={setShowGoalkeeperConfig}
        showPenaltyShootout={showPenaltyShootout}
        penaltyScore={penaltyScore}
      />

      {/* Goalkeeper Configuration */}
      <LiveFieldViewGoalkeeperConfig
        goalkeepers={goalkeepers}
        setGoalkeepers={setGoalkeepers}
        isVisible={showGoalkeeperConfig}
      />

      {/* Penalty Shootout */}
      <LiveFieldViewPenaltyShootout
        isVisible={showPenaltyShootout}
        currentMatch={currentMatch}
        penaltyScore={penaltyScore}
        addPenaltyGoal={addPenaltyGoal}
        removePenaltyGoal={removePenaltyGoal}
        finishPenaltyShootout={finishPenaltyShootout}
        onCancel={() => {
          setShowPenaltyShootout(false);
          setPenaltyScore({ team1: 0, team2: 0 });
        }}
      />

      {/* Tiebreaker Modal */}
      <LiveFieldViewTiebreakerModal
        isOpen={showTiebreaker}
        onClose={() => setShowTiebreaker(false)}
        tiebreakerTeams={tiebreakerTeams}
        standings={standings}
        onDecision={handleTiebreakerDecision}
      />
      {/* Campo de Futebol */}
      <div className="relative bg-green-600 mx-3 my-3 rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 225">
          <g opacity="0.7">
            <line x1="0" y1="0" x2="380" y2="45" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round"/>
            <line x1="0" y1="15" x2="400" y2="60" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="0" y1="30" x2="400" y2="75" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round"/>
            <line x1="0" y1="45" x2="400" y2="90" stroke="#FCD34D" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="0" y1="60" x2="400" y2="105" stroke="#FCD34D" strokeWidth="1" strokeLinecap="round"/>
          </g>
        </svg>

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 225">
          <rect x="10" y="10" width="380" height="205" fill="none" stroke="white" strokeWidth="2"/>
          <line x1="200" y1="10" x2="200" y2="215" stroke="white" strokeWidth="2"/>
          <circle cx="200" cy="112.5" r="25" fill="none" stroke="white" strokeWidth="2"/>
          <rect x="10" y="60" width="40" height="105" fill="none" stroke="white" strokeWidth="2"/>
          <rect x="350" y="60" width="40" height="105" fill="none" stroke="white" strokeWidth="2"/>
          <rect x="10" y="85" width="15" height="55" fill="none" stroke="white" strokeWidth="2"/>
          <rect x="375" y="85" width="15" height="55" fill="none" stroke="white" strokeWidth="2"/>
          <rect x="5" y="95" width="5" height="35" fill="white"/>
          <rect x="390" y="95" width="5" height="35" fill="white"/>
        </svg>

        {/* Goleiros */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: '6%', top: '50%' }}
        >
          <div className="w-5 h-5 bg-yellow-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
            <span className="text-white text-[8px] font-bold">G</span>
          </div>
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-[7px] px-1 py-0.5 rounded whitespace-nowrap max-w-14 truncate">
            {goalkeepers.left.name}
          </div>
        </div>
        
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: '94%', top: '50%' }}
        >
          <div className="w-5 h-5 bg-yellow-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
            <span className="text-white text-[8px] font-bold">G</span>
          </div>
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-[7px] px-1 py-0.5 rounded whitespace-nowrap max-w-14 truncate">
            {goalkeepers.right.name}
          </div>
        </div>

        {/* Jogadores do Time 1 */}
        {team1Players.slice(0, 5).map((player, index) => {
          const positions = [
            { x: '18%', y: '25%' },
            { x: '18%', y: '75%' },
            { x: '30%', y: '40%' },
            { x: '30%', y: '60%' },
            { x: '42%', y: '50%' }
          ];
          const pos = positions[index] || { x: '20%', y: '50%' };
          
          return (
            <div
              key={player.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ left: pos.x, top: pos.y }}
              onClick={() => addGoal(player.id, player.name, currentMatch.team1, currentMatch.id)}
            >
              <div className={`w-5 h-5 ${TEAM_COLORS[currentMatch.team1].bg} rounded-full border-2 border-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform`}>
                <Users size={10} className="text-white" />
              </div>
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-[7px] px-1 py-0.5 rounded whitespace-nowrap max-w-14 truncate">
                {player.name}
              </div>
            </div>
          );
        })}

        {/* Jogadores do Time 2 */}
        {team2Players.slice(0, 5).map((player, index) => {
          const positions = [
            { x: '82%', y: '25%' },
            { x: '82%', y: '75%' },
            { x: '70%', y: '40%' },
            { x: '70%', y: '60%' },
            { x: '58%', y: '50%' }
          ];
          const pos = positions[index] || { x: '80%', y: '50%' };
          
          return (
            <div
              key={player.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ left: pos.x, top: pos.y }}
              onClick={() => addGoal(player.id, player.name, currentMatch.team2, currentMatch.id)}
            >
              <div className={`w-5 h-5 ${TEAM_COLORS[currentMatch.team2].bg} rounded-full border-2 border-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95  transition-transform`}>
                <Users size={10} className="text-white" />
              </div>
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-[7px] px-1 py-0.5 rounded whitespace-nowrap max-w-14 truncate">
                {player.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Gols da Partida em Duas Colunas */}
      <div className="bg-gray-800 mx-3 mb-3 rounded-xl p-3">
        <h3 className="text-white font-bold mb-2 text-sm text-center">
          Gols da Partida
        </h3>
        
        {matchEvents.filter(event => event.matchId === currentMatch.id).length === 0 ? (
          <div className="text-center py-3">
            <span className="text-gray-400 text-xs">Nenhum gol marcado ainda</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
            {/* Gols do Time 1 */}
            <div className="space-y-1">
              <h4 className="text-white text-xs font-medium text-center mb-1">
                {currentMatch.team1}
              </h4>
              {matchEvents
                .filter(event => event.matchId === currentMatch.id && event.teamName === currentMatch.team1)
                .map((event) => (
                  <div key={event.id} className="flex items-center justify-between bg-gray-700 rounded-lg p-2">
                    <div className="flex items-center space-x-1">
                      <span className="text-white text-xs">⚽</span>
                      <span className="text-white text-xs truncate">{event.playerName}</span>
                      <span className="text-gray-400 text-xs">{event.minute}'</span>
                    </div>
                    <button
                      onClick={() => removeGoal(event.id)}
                      className="text-red-400 hover:text-red-300 active:text-red-200 text-xs"
                    >
                      ❌
                    </button>
                  </div>
                ))}
            </div>

            {/* Gols do Time 2 */}
            <div className="space-y-1">
              <h4 className="text-white text-xs font-medium text-center mb-1">
                {currentMatch.team2}
              </h4>
              {matchEvents
                .filter(event => event.matchId === currentMatch.id && event.teamName === currentMatch.team2)
                .map((event) => (
                  <div key={event.id} className="flex items-center justify-between bg-gray-700 rounded-lg p-2">
                    <div className="flex items-center space-x-1">
                      <span className="text-white text-xs">⚽</span>
                      <span className="text-white text-xs truncate">{event.playerName}</span>
                      <span className="text-gray-400 text-xs">{event.minute}'</span>
                    </div>
                    <button
                      onClick={() => removeGoal(event.id)}
                      className="text-red-400 hover:text-red-300 active:text-red-200 text-xs"
                    >
                      ❌
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Atualizar Placar */}
      <div className="bg-gray-800 mx-3 mb-3 rounded-xl p-3">
        <h3 className="text-white font-bold mb-2 text-center text-sm">Atualizar Placar</h3>
        <div className="flex items-center justify-center space-x-4">
          <div className="text-center">
            <div className="text-white font-medium mb-1 text-xs">{currentMatch.team1}</div>
            <input
              type="number"
              min="0"
              value={currentMatch.score1 || ''}
              onChange={(e) => {
                updateMatchScore(currentMatch.id, currentMatch.team1, e.target.value);
              }}
              onFocus={(e) => e.target.select()}
              className="w-12 h-12 text-lg font-bold text-center border-2 border-gray-600 bg-gray-700 text-white rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="0"
              inputMode="numeric"
            />
          </div>
          <div className="text-white text-lg font-bold">×</div>
          <div className="text-center">
            <div className="text-white font-medium mb-1 text-xs">{currentMatch.team2}</div>
            <input
              type="number"
              min="0"
              value={currentMatch.score2 || ''}
              onChange={(e) => {
                updateMatchScore(currentMatch.id, currentMatch.team2, e.target.value);
              }}
              onFocus={(e) => e.target.select()}
              className="w-12 h-12 text-lg font-bold text-center border-2 border-gray-600 bg-gray-700 text-white rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="0"
              inputMode="numeric"
            />
          </div>
        </div>
      </div>

      {/* Próximos Jogos */}
      <div className="bg-gray-800 mx-3 mb-3 rounded-xl p-3">
        <h3 className="text-white font-bold mb-2 text-sm">
          {remainingMatches.some(m => m.type === 'regular') ? 'Próximos Jogos' : 'Playoffs'} ({remainingMatches.length} restantes)
        </h3>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {remainingMatches.length > 0 ? remainingMatches.map((match) => (
            <div key={match.id} className={`flex items-center justify-between rounded-lg p-2 ${
              match.played ? 'bg-green-700' : 
              match.type === 'final' ? 'bg-yellow-700' :
              match.type === 'third_place' ? 'bg-orange-700' :
              'bg-gray-700'
            }`}>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  match.played 
                    ? 'bg-green-600 text-white' 
                    : match.type === 'final' ? 'bg-yellow-600 text-white'
                    : match.type === 'third_place' ? 'bg-orange-600 text-white'
                    : 'bg-gray-600 text-white'
                }`}>
                  {match.type === 'final' ? '🏆 Final' : 
                   match.type === 'third_place' ? '🥉 3º Lugar' : 
                   `Jogo ${match.id}`}
                </span>
                {match.team1 !== 'TBD' && match.team2 !== 'TBD' && (
                  <span className="text-white text-xs">
                    {match.played 
                      ? `${match.team1} ${match.score1 || 0} × ${match.score2 || 0} ${match.team2}`
                      : `${match.team1} × ${match.team2}`
                    }
                  </span>
                )}
                {(match.team1 === 'TBD' || match.team2 === 'TBD') && (
                  <span className="text-gray-400 text-xs">Aguardando classificação</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {match.played ? (
                  <span className="text-green-400 text-xs">✓</span>
                ) : match.team1 !== 'TBD' && match.team2 !== 'TBD' ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveMatch(match.id);
                      startMatchTimer(match.id, match.type === 'final' || match.type === 'third_place');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-2 py-1 rounded-lg text-xs transition-colors"
                  >
                    Iniciar
                  </button>
                ) : (
                  <span className="text-gray-500 text-xs">-</span>
                )}
              </div>
            </div>
          )) : (
            <div className="text-center py-2">
              <span className="text-gray-400 text-xs">Torneio finalizado! 🏆</span>
            </div>
          )}
        </div>
        
        {/* Show playoff info when regular season is complete */}
        {matches.filter(m => m.type === 'regular').every(m => m.played) && 
         remainingMatches.some(m => m.type === 'final' || m.type === 'third_place') && (
          <div className="mt-3 p-2 bg-yellow-800 rounded-lg">
            <div className="text-yellow-200 text-xs text-center">
              🏆 Fase de Playoffs iniciada!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveFieldView;