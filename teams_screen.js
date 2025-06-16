import React from 'react';
import { Shuffle } from 'lucide-react';
import Header from '../components/Header';
import { TEAM_COLORS } from '../constants';
import { drawTeams } from '../utils/tournamentUtils';

const TeamsScreen = ({ 
  players, 
  teams, 
  setTeams, 
  tournamentStarted, 
  setTournamentStarted, 
  onBack 
}) => {

  const handleDrawTeams = () => {
    const newTeams = drawTeams(players);
    setTeams(newTeams);
    setTournamentStarted(true);
    alert('Times sorteados com sucesso!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Times" showBack={true} onBack={onBack} />
      
      <div className="p-6">
        {!tournamentStarted && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sortear Times</h3>
            <p className="text-gray-600 mb-4">Distribua os {players.length} jogadores em 4 times automaticamente.</p>
            <button
              onClick={handleDrawTeams}
              disabled={players.length === 0}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 disabled:from-gray-300 disabled:to-gray-400 text-white p-4 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all duration-200"
            >
              <Shuffle size={20} />
              <span>Sortear Times Automaticamente</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {Object.entries(teams).map(([teamName, teamPlayers]) => (
            <div key={teamName} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className={`bg-gradient-to-r ${TEAM_COLORS[teamName].gradient} p-4`}>
                <div className="flex items-center justify-between text-white">
                  <h3 className="font-bold text-lg">{teamName}</h3>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                    {teamPlayers.length} jogadores
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                {teamPlayers.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Nenhum jogador sorteado</p>
                ) : (
                  <div className="space-y-2">
                    {teamPlayers.map((player, index) => (
                      <div key={player.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                        <div className={`w-8 h-8 ${TEAM_COLORS[teamName].bg} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-900">{player.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamsScreen;