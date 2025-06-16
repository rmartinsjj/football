import React from 'react';
import { Medal } from 'lucide-react';
import Header from '../components/Header';
import { TEAM_COLORS } from '../constants';
import { calculateStandings } from '../utils/tournamentUtils';

const StandingsScreen = ({ matches, onBack }) => {
  const standings = calculateStandings(matches);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Classificação" showBack={true} onBack={onBack} />
      
      <div className="p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Tabela de Classificação</h3>
          </div>
          
          <div className="space-y-1">
            {standings.map((team, index) => (
              <div
                key={team.team}
                className={`p-4 ${
                  index === 0 ? 'bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500' :
                  index === 1 ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-400' :
                  index === standings.length - 1 || index === standings.length - 2 ? 'bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-400' :
                  'hover:bg-gray-50'
                } transition-colors`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-bold text-gray-600">{index + 1}º</span>
                      {index === 0 && <Medal className="text-green-500" size={20} />}
                      {index === 1 && <Medal className="text-blue-500" size={20} />}
                      {(index === standings.length - 1 || index === standings.length - 2) && <span className="text-lg">🧽</span>}
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
                    <div className="text-xs text-gray-500">Jogos</div>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <div className="font-medium text-green-600">{team.wins}</div>
                    <div className="text-xs text-gray-500">Vitórias</div>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <div className="font-medium text-yellow-600">{team.draws}</div>
                    <div className="text-xs text-gray-500">Empates</div>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <div className="font-medium text-red-600">{team.losses}</div>
                    <div className="text-xs text-gray-500">Derrotas</div>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <div className="font-medium">{team.goalDiff > 0 ? '+' : ''}{team.goalDiff}</div>
                    <div className="text-xs text-gray-500">Saldo</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-3">Legenda</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <Medal className="text-green-500" size={16} />
              <span className="text-gray-600">1º lugar - Campeão</span>
            </div>
            <div className="flex items-center space-x-2">
              <Medal className="text-blue-500" size={16} />
              <span className="text-gray-600">2º lugar - Vice-campeão</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">🧽</span>
              <span className="text-gray-600">3º e 4º lugar disputam o sorteio do colete</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandingsScreen;