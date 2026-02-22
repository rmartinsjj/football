import React from 'react';
import { Medal, Settings } from 'lucide-react';
import Header from '../components/Header';
import { TEAM_COLORS } from '../constants';
import { calculateStandings, calculateWinnerStaysStandings } from '../utils/tournamentUtils';
import TiebreakerModal from '../components/LiveFieldView-TiebreakerModal';

const StandingsScreen = ({ matches, settings, setCurrentScreen, onBack }) => {
  const [showTiebreaker, setShowTiebreaker] = React.useState(false);
  const [tiebreakerTeams, setTiebreakerTeams] = React.useState([]);
  
  const isWinnerStaysMode = settings?.tournamentType === 'winner-stays';
  const activeTeams = settings?.activeTeams || ['Flamengo', 'Cruzeiro', 'Corinthians', 'Palmeiras'];
  
  // Filter matches to only include active teams, but keep playoff structure
  const filteredMatches = matches.filter(match => {
    // Always keep playoff matches (they will be populated with correct teams)
    if (match.type === 'final' || match.type === 'third_place') {
      return true;
    }
    // For regular matches, only include if both teams are active
    return activeTeams.includes(match.team1) && activeTeams.includes(match.team2);
  });
  
  // Calculate standings based on tournament type
  const standings = isWinnerStaysMode 
    ? calculateWinnerStaysStandings(filteredMatches)
    : calculateStandings(filteredMatches.filter(m => m.type === 'regular'));
  
  // Check if playoffs are complete to show final results
  const finalMatch = filteredMatches.find(m => m.id === 14);
  const thirdPlaceMatch = filteredMatches.find(m => m.id === 13);
  const playoffsComplete = !isWinnerStaysMode && finalMatch?.played && thirdPlaceMatch?.played;
  
  let finalResults = null;
  if (playoffsComplete) {
    const finalWinner = finalMatch.score1 > finalMatch.score2 ? finalMatch.team1 : 
                       finalMatch.score2 > finalMatch.score1 ? finalMatch.team2 :
                       finalMatch.winner; // In case of penalties
    
    const finalLoser = finalMatch.team1 === finalWinner ? finalMatch.team2 : finalMatch.team1;
    
    const thirdWinner = thirdPlaceMatch.score1 > thirdPlaceMatch.score2 ? thirdPlaceMatch.team1 : 
                       thirdPlaceMatch.score2 > thirdPlaceMatch.score1 ? thirdPlaceMatch.team2 :
                       thirdPlaceMatch.winner; // In case of penalties
    
    const thirdLoser = thirdPlaceMatch.team1 === thirdWinner ? thirdPlaceMatch.team2 : thirdPlaceMatch.team1;
    
    finalResults = {
      champion: finalWinner,
      runnerUp: finalLoser,
      thirdPlace: thirdWinner,
      fourthPlace: thirdLoser
    };
  }
  
  // Check if there are any ties that could be resolved
  const checkForTies = () => {
    // Check for ties between any adjacent teams
    for (let i = 0; i < standings.length - 1; i++) {
      if (standings[i].points === standings[i + 1].points) {
        const tiedTeams = [standings[i].team, standings[i + 1].team];
        setTiebreakerTeams(tiedTeams);
        setShowTiebreaker(true);
        return;
      }
    }
  };
  
  const handleTiebreakerDecision = (method) => {
    // This is just for demonstration - in a real app you'd update the standings
    console.log(`Tiebreaker resolved using ${method} for teams:`, tiebreakerTeams);
    setShowTiebreaker(false);
    setTiebreakerTeams([]);
  };
  
  return (
    <div className="min-h-screen overflow-x-hidden pb-24">
      <Header title="Classificação" showBack={true} onBack={onBack} setCurrentScreen={setCurrentScreen} />
      
      {/* Content with proper top padding to account for fixed header */}
      <div className="p-6" style={{ paddingTop: 'calc(64px + env(safe-area-inset-top) + 16px)' }}>
        {/* Tiebreaker Modal */}
        <TiebreakerModal
          isOpen={showTiebreaker}
          onClose={() => setShowTiebreaker(false)}
          tiebreakerTeams={tiebreakerTeams}
          standings={standings}
          onDecision={handleTiebreakerDecision}
        />
        
        {/* Final Tournament Results */}
        {playoffsComplete && finalResults && (
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 rounded-2xl p-6 text-center shadow-xl mb-6 border border-blue-500">
            <div className="mb-4">
              <div className="text-4xl mb-2">🏆</div>
              <h2 className="text-2xl font-bold text-white mb-1">RESULTADO FINAL</h2>
              <p className="text-blue-200 text-sm">Torneio Finalizado</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Champion */}
              <div className="bg-yellow-500 rounded-xl p-4 border-2 border-yellow-400 col-span-2 shadow-lg">
                <div className="flex items-center justify-center space-x-3">
                  <div className="text-3xl">🏆</div>
                  <div>
                    <div className="text-yellow-900 text-xs font-bold uppercase tracking-wide">Campeão</div>
                    <div className="text-gray-900 text-xl font-extrabold">{finalResults.champion}</div>
                  </div>
                </div>
              </div>

              {/* Runner-up */}
              <div className="bg-gray-300 rounded-xl p-3 border-2 border-gray-400 shadow-md">
                <div className="text-center">
                  <div className="text-2xl mb-1">🥈</div>
                  <div className="text-gray-700 text-xs font-bold uppercase tracking-wide">Vice</div>
                  <div className="text-gray-900 text-base font-bold">{finalResults.runnerUp}</div>
                </div>
              </div>

              {/* Third place */}
              <div className="bg-orange-400 rounded-xl p-3 border-2 border-orange-500 shadow-md">
                <div className="text-center">
                  <div className="text-2xl mb-1">🥉</div>
                  <div className="text-orange-900 text-xs font-bold uppercase tracking-wide">3º Lugar</div>
                  <div className="text-gray-900 text-base font-bold">{finalResults.thirdPlace}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="dark-card rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-600">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {isWinnerStaysMode ? 'Ranking de Vitórias' :
                 playoffsComplete ? 'Classificação da Fase Regular' : 'Tabela de Classificação'}
              </h3>
            </div>
            {playoffsComplete && !isWinnerStaysMode && (
              <p className="text-sm text-gray-400 mt-1">
                Pontuação baseada apenas nos 12 jogos da fase regular
              </p>
            )}
            {isWinnerStaysMode && (
              <p className="text-sm text-gray-400 mt-1">
                Ranking baseado no número de vitórias no modo "Quem Ganha Fica"
              </p>
            )}
          </div>
          
          <div className="space-y-1">
            {standings.map((team, index) => {
              // Use team colors for backgrounds
              const teamColorMap = {
                'Flamengo': 'bg-gradient-to-r from-red-600 to-red-700',
                'Cruzeiro': 'bg-gradient-to-r from-blue-600 to-blue-700',
                'Corinthians': 'bg-gradient-to-r from-gray-700 to-gray-800',
                'Palmeiras': 'bg-gradient-to-r from-green-600 to-green-700'
              };

              const teamBorderMap = {
                'Flamengo': 'border-red-800',
                'Cruzeiro': 'border-blue-800',
                'Corinthians': 'border-black',
                'Palmeiras': 'border-green-800'
              };

              let positionClass, medalIcon;

              if (playoffsComplete) {
                if (finalResults.champion === team.team) {
                  positionClass = '🏆';
                  medalIcon = '🏆';
                } else if (finalResults.runnerUp === team.team) {
                  positionClass = '🥈';
                  medalIcon = '🥈';
                } else if (finalResults.thirdPlace === team.team) {
                  positionClass = '🥉';
                  medalIcon = '🥉';
                } else if (finalResults.fourthPlace === team.team) {
                  positionClass = '4º';
                  medalIcon = null;
                } else {
                  positionClass = `${index + 1}º`;
                  medalIcon = null;
                }
              } else {
                positionClass = `${index + 1}º`;
                if (index === 0) medalIcon = <Medal className="text-yellow-400" size={20} />;
                else if (index === 1) medalIcon = <Medal className="text-gray-300" size={20} />;
                else if (index === 2) medalIcon = '🏅';
                else if (index === standings.length - 1) medalIcon = '🧽';
                else medalIcon = null;
              }

              const bgClass = teamColorMap[team.team] || 'bg-gray-800';
              const borderClass = teamBorderMap[team.team] || 'border-gray-900';

              return (
                <div
                  key={team.team}
                  className={`p-4 ${bgClass} border-l-4 ${borderClass} transition-colors shadow-md`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl font-bold text-white">
                          {positionClass}
                        </span>
                        {medalIcon && (
                          typeof medalIcon === 'string'
                            ? <span className="text-lg">{medalIcon}</span>
                            : medalIcon
                        )}
                      </div>
                      <div className={`w-5 h-5 ${TEAM_COLORS[team.team].bg} rounded-full border-2 border-white shadow-md`}></div>
                      <span className="font-bold text-white truncate text-lg">{team.team}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">
                        {isWinnerStaysMode ? team.wins : team.points}
                      </div>
                      <div className="text-sm text-white/90">
                        {isWinnerStaysMode ? 'vitórias' : 'pontos'}
                      </div>
                    </div>
                  </div>

                  {isWinnerStaysMode ? (
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
                      <div className="bg-gray-800 bg-opacity-60 rounded-lg p-2.5 border border-white/20">
                        <div className="font-bold text-blue-400 text-base">{team.matches}</div>
                        <div className="text-[9px] text-white/80 leading-tight text-center font-medium">Jogos</div>
                      </div>
                      <div className="bg-gray-800 bg-opacity-60 rounded-lg p-2.5 border border-white/20">
                        <div className="font-bold text-green-400 text-base">{team.wins}</div>
                        <div className="text-[9px] text-white/80 leading-tight text-center font-medium">Vitórias</div>
                      </div>
                      <div className="bg-gray-800 bg-opacity-60 rounded-lg p-2.5 border border-white/20">
                        <div className="font-bold text-yellow-400 text-base">{team.winRate}%</div>
                        <div className="text-[9px] text-white/80 leading-tight text-center font-medium">Taxa</div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 grid grid-cols-5 gap-2 text-center text-sm">
                      <div className="bg-gray-800 bg-opacity-60 rounded-lg p-2.5 border border-white/20">
                        <div className="font-bold text-blue-400 text-base">{team.gamesPlayed}</div>
                        <div className="text-[9px] text-white/80 leading-tight text-center font-medium">J</div>
                      </div>
                      <div className="bg-gray-800 bg-opacity-60 rounded-lg p-2.5 border border-white/20">
                        <div className="font-bold text-green-400 text-base">{team.wins}</div>
                        <div className="text-[9px] text-white/80 leading-tight text-center font-medium">V</div>
                      </div>
                      <div className="bg-gray-800 bg-opacity-60 rounded-lg p-2.5 border border-white/20">
                        <div className="font-bold text-yellow-400 text-base">{team.draws}</div>
                        <div className="text-[9px] text-white/80 leading-tight text-center font-medium">E</div>
                      </div>
                      <div className="bg-gray-800 bg-opacity-60 rounded-lg p-2.5 border border-white/20">
                        <div className="font-bold text-red-400 text-base">{team.losses}</div>
                        <div className="text-[9px] text-white/80 leading-tight text-center font-medium">D</div>
                      </div>
                      <div className="bg-gray-800 bg-opacity-60 rounded-lg p-2.5 border border-white/20">
                        <div className="font-bold text-white text-base">{team.goalDiff > 0 ? '+' : ''}{team.goalDiff}</div>
                        <div className="text-[9px] text-white/80 leading-tight text-center font-medium">SG</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 dark-card rounded-2xl p-6 shadow-sm">
          <h4 className="font-semibold text-white mb-3">Legenda</h4>
          <div className="space-y-2 text-sm">
            {isWinnerStaysMode ? (
              <>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🏆</span>
                  <span className="text-gray-300">Ranking baseado no número de vitórias</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">⚡</span>
                  <span className="text-gray-300">Modo "Quem Ganha Fica" - Time vencedor permanece</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🤝</span>
                  <span className="text-gray-300">Em empates, o desafiante se torna o novo vencedor</span>
                </div>
              </>
            ) : playoffsComplete ? (
              <>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🏆</span>
                  <span className="text-gray-300">Campeão do Torneio</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🥈</span>
                  <span className="text-gray-300">Vice-campeão</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🥉</span>
                  <span className="text-gray-300">3º lugar</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">4️⃣</span>
                  <span className="text-gray-300">4º lugar</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <Medal className="text-green-500" size={16} />
                  <span className="text-gray-300">1º e 2º lugar - Classificados para a final</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🏅</span>
                  <span className="text-gray-300">3º lugar - Disputa o 3º lugar</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🧽</span>
                  <span className="text-gray-300">4º lugar - Vai direto para o sorteio do colete</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandingsScreen;