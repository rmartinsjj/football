import React from 'react';
import { Medal, Settings } from 'lucide-react';
import Header from '../components/Header';
import { TEAM_COLORS } from '../constants';
import { calculateStandings } from '../utils/tournamentUtils';
import TiebreakerModal from '../components/LiveFieldView-TiebreakerModal';

const StandingsScreen = ({ matches, onBack }) => {
  const [showTiebreaker, setShowTiebreaker] = React.useState(false);
  const [tiebreakerTeams, setTiebreakerTeams] = React.useState([]);
  
  // Only calculate standings for regular season matches
  const standings = calculateStandings(matches.filter(m => m.type === 'regular'));
  
  // Check if playoffs are complete to show final results
  const finalMatch = matches.find(m => m.id === 14);
  const thirdPlaceMatch = matches.find(m => m.id === 13);
  const playoffsComplete = finalMatch?.played && thirdPlaceMatch?.played;
  
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
    <div className="min-h-screen bg-gray-50">
      <Header title="Classificação" showBack={true} onBack={onBack} />
      
      <div className="p-6">
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
          <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-2xl p-6 text-center shadow-lg mb-6">
            <div className="mb-4">
              <div className="text-3xl mb-2">🏆</div>
              <h2 className="text-xl font-bold text-white mb-1">RESULTADO FINAL</h2>
              <p className="text-yellow-100 text-sm">Torneio Finalizado</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Champion */}
              <div className="bg-white bg-opacity-20 rounded-xl p-3 border-2 border-yellow-300 col-span-2">
                <div className="flex items-center justify-center space-x-3">
                  <div className="text-2xl">🏆</div>
                  <div>
                    <div className="text-yellow-100 text-xs font-medium">CAMPEÃO</div>
                    <div className="text-white text-lg font-bold">{finalResults.champion}</div>
                  </div>
                </div>
              </div>
              
              {/* Runner-up */}
              <div className="bg-white bg-opacity-15 rounded-xl p-3 border border-gray-300">
                <div className="text-center">
                  <div className="text-xl mb-1">🥈</div>
                  <div className="text-gray-200 text-xs font-medium">VICE</div>
                  <div className="text-white text-sm font-bold">{finalResults.runnerUp}</div>
                </div>
              </div>
              
              {/* Third place */}
              <div className="bg-white bg-opacity-10 rounded-xl p-3 border border-orange-300">
                <div className="text-center">
                  <div className="text-xl mb-1">🥉</div>
                  <div className="text-orange-200 text-xs font-medium">3º LUGAR</div>
                  <div className="text-white text-sm font-bold">{finalResults.thirdPlace}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {playoffsComplete ? 'Classificação da Fase Regular' : 'Tabela de Classificação'}
              </h3>
              {!playoffsComplete && (
                <button
                  onClick={checkForTies}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm transition-colors"
                >
                  <Settings size={16} />
                  <span>Resolver Empate</span>
                </button>
              )}
            </div>
            {playoffsComplete && (
              <p className="text-sm text-gray-600 mt-1">
                Pontuação baseada apenas nos 12 jogos da fase regular
              </p>
            )}
          </div>
          
          <div className="space-y-1">
            {standings.map((team, index) => (
              <div
                key={team.team}
                className={`p-4 ${
                  playoffsComplete ? (
                    finalResults.champion === team.team ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500' :
                    finalResults.runnerUp === team.team ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-gray-400' :
                    finalResults.thirdPlace === team.team ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-400' :
                    finalResults.fourthPlace === team.team ? 'bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-400' :
                    'hover:bg-gray-50'
                  ) : (
                    index === 0 ? 'bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500' :
                    index === 1 ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-400' :
                    index === standings.length - 1 || index === standings.length - 2 ? 'bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-400' :
                    'hover:bg-gray-50'
                  )
                } transition-colors`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-bold text-gray-600">
                        {playoffsComplete ? (
                          finalResults.champion === team.team ? '🏆' :
                          finalResults.runnerUp === team.team ? '🥈' :
                          finalResults.thirdPlace === team.team ? '🥉' :
                          finalResults.fourthPlace === team.team ? '4º' :
                          `${index + 1}º`
                        ) : (
                          `${index + 1}º`
                        )}
                      </span>
                      {!playoffsComplete && (
                        <>
                          {index === 0 && <Medal className="text-green-500" size={20} />}
                          {index === 1 && <Medal className="text-blue-500" size={20} />}
                          {index === 2 && <span className="text-lg">🏅</span>}
                          {index === standings.length - 1 && <span className="text-lg">🧽</span>}
                        </>
                      )}
                    </div>
                    <div className={`w-4 h-4 ${TEAM_COLORS[team.team].bg} rounded-full`}></div>
                    <span className="font-bold text-gray-900">{team.team}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{team.points}</div>
                    <div className="text-sm text-gray-500">pontos</div>
                  </div>
                </div>
                
                <div className="mt-3 grid grid-cols-5 gap-2 text-center text-sm">
                  <div className="bg-white rounded-lg p-2">
                    <div className="font-medium text-blue-600">{team.gamesPlayed}</div>
                    <div className="text-[8px] text-gray-500 leading-tight text-center">J</div>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <div className="font-medium text-green-600">{team.wins}</div>
                    <div className="text-[8px] text-gray-500 leading-tight text-center">V</div>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <div className="font-medium text-yellow-600">{team.draws}</div>
                    <div className="text-[8px] text-gray-500 leading-tight text-center">E</div>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <div className="font-medium text-red-600">{team.losses}</div>
                    <div className="text-[8px] text-gray-500 leading-tight text-center">D</div>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <div className="font-medium">{team.goalDiff > 0 ? '+' : ''}{team.goalDiff}</div>
                    <div className="text-[8px] text-gray-500 leading-tight text-center">SG</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-3">Legenda</h4>
          <div className="space-y-2 text-sm">
            {playoffsComplete ? (
              <>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🏆</span>
                  <span className="text-gray-600">Campeão do Torneio</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🥈</span>
                  <span className="text-gray-600">Vice-campeão</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🥉</span>
                  <span className="text-gray-600">3º lugar</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">4️⃣</span>
                  <span className="text-gray-600">4º lugar</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <Medal className="text-green-500" size={16} />
                  <span className="text-gray-600">1º e 2º lugar - Classificados para a final</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🏅</span>
                  <span className="text-gray-600">3º lugar - Disputa o 3º lugar</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🧽</span>
                  <span className="text-gray-600">4º lugar - Vai direto para o sorteio do colete</span>
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