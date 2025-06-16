import React, { useState } from 'react';
import { Shuffle, Plus, Minus, UserPlus, UserMinus } from 'lucide-react';
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
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingStep, setDrawingStep] = useState(0);
  const [showPlayerManagement, setShowPlayerManagement] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [availablePlayers, setAvailablePlayers] = useState([]);

  const drawingMessages = [
    "🎲 Estamos sorteando os times...",
    "⚽ Quase lá...",
    "🏆 Pronto!"
  ];

  const handleDrawTeams = async () => {
    setIsDrawing(true);
    setDrawingStep(0);

    // Primeira mensagem - 1.5 segundos
    await new Promise(resolve => setTimeout(resolve, 1500));
    setDrawingStep(1);

    // Segunda mensagem - 1.5 segundos
    await new Promise(resolve => setTimeout(resolve, 1500));
    setDrawingStep(2);

    // Terceira mensagem - 1 segundo
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Sortear os times
    const newTeams = drawTeams(players);
    setTeams(newTeams);
    setTournamentStarted(true);
    
    // Finalizar loading
    setIsDrawing(false);
    setDrawingStep(0);
  };

  const getAvailablePlayersForTeam = (teamName) => {
    const currentTeamPlayers = teams[teamName] || [];
    return players.filter(player => 
      !Object.values(teams).flat().some(teamPlayer => teamPlayer.id === player.id)
    );
  };

  const addPlayerToTeam = (player, teamName) => {
    setTeams(prev => ({
      ...prev,
      [teamName]: [...(prev[teamName] || []), player]
    }));
    setAvailablePlayers(prev => prev.filter(p => p.id !== player.id));
  };

  const removePlayerFromTeam = (playerId, teamName) => {
    const playerToRemove = teams[teamName].find(p => p.id === playerId);
    if (playerToRemove) {
      setTeams(prev => ({
        ...prev,
        [teamName]: prev[teamName].filter(p => p.id !== playerId)
      }));
      setAvailablePlayers(prev => [...prev, playerToRemove]);
    }
  };

  const openPlayerManagement = (teamName) => {
    setSelectedTeam(teamName);
    setAvailablePlayers(getAvailablePlayersForTeam(teamName));
    setShowPlayerManagement(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Times" showBack={true} onBack={onBack} />
      
      <div className="p-4">
        {!tournamentStarted && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Sortear Times</h3>
            <p className="text-gray-600 mb-4 text-sm">Distribua os {players.length} jogadores em 4 times automaticamente.</p>
            
            {isDrawing ? (
              <div className="text-center py-8">
                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-4 relative">
                    <div className="absolute inset-0 border-4 border-green-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-2 bg-green-100 rounded-full flex items-center justify-center">
                      <Shuffle className="text-green-600 animate-pulse" size={24} />
                    </div>
                  </div>
                  <div className="text-lg font-bold text-gray-900 mb-2 animate-pulse">
                    {drawingMessages[drawingStep]}
                  </div>
                  <div className="flex justify-center space-x-1">
                    {[0, 1, 2].map((step) => (
                      <div
                        key={step}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          step <= drawingStep ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleDrawTeams}
                disabled={players.length === 0}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 disabled:from-gray-300 disabled:to-gray-400 text-white p-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-200 active:scale-95"
              >
                <Shuffle size={20} />
                <span>Sortear Times Automaticamente</span>
              </button>
            )}
          </div>
        )}

        {tournamentStarted && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Gerenciar Jogadores</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Adicione jogadores que chegaram atrasados ou remova jogadores que se machucaram.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(teams).map(([teamName]) => (
                <button
                  key={teamName}
                  onClick={() => openPlayerManagement(teamName)}
                  className={`bg-gradient-to-r ${TEAM_COLORS[teamName].gradient} text-white p-3 rounded-lg text-sm flex items-center justify-center space-x-2 active:scale-95 transition-all`}
                >
                  <UserPlus size={16} />
                  <span>Editar {teamName}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          {Object.entries(teams).map(([teamName, teamPlayers]) => (
            <div key={teamName} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className={`bg-gradient-to-r ${TEAM_COLORS[teamName].gradient} p-3`}>
                <div className="flex items-center justify-between text-white">
                  <h3 className="font-bold text-base">{teamName}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                      {teamPlayers.length} jogadores
                    </span>
                    {tournamentStarted && (
                      <button
                        onClick={() => openPlayerManagement(teamName)}
                        className="bg-white bg-opacity-20 hover:bg-opacity-30 p-1 rounded-full transition-colors"
                      >
                        <UserPlus size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-3">
                {teamPlayers.length === 0 ? (
                  <p className="text-gray-500 text-center py-4 text-sm">Nenhum jogador sorteado</p>
                ) : (
                  <div className="space-y-1">
                    {teamPlayers.map((player, index) => (
                      <div key={player.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 ${TEAM_COLORS[teamName].bg} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                            {index + 1}
                          </div>
                          <span className="font-medium text-gray-900 text-sm">{player.name}</span>
                        </div>
                        {tournamentStarted && (
                          <button
                            onClick={() => removePlayerFromTeam(player.id, teamName)}
                            className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                          >
                            <UserMinus size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Gerenciamento de Jogadores */}
      {showPlayerManagement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full max-h-[80vh] overflow-hidden">
            <div className={`bg-gradient-to-r ${TEAM_COLORS[selectedTeam].gradient} p-4`}>
              <div className="flex items-center justify-between text-white">
                <h3 className="font-bold text-base">Gerenciar {selectedTeam}</h3>
                <button
                  onClick={() => setShowPlayerManagement(false)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 p-1 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">Jogadores Disponíveis</h4>
                {availablePlayers.length === 0 ? (
                  <p className="text-gray-500 text-center py-4 text-sm">Todos os jogadores já estão em times</p>
                ) : (
                  <div className="space-y-1">
                    {availablePlayers.map((player) => (
                      <div key={player.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-900 text-sm">{player.name}</span>
                        <button
                          onClick={() => addPlayerToTeam(player, selectedTeam)}
                          className="bg-green-500 hover:bg-green-600 text-white p-1 rounded transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">Jogadores do Time</h4>
                {teams[selectedTeam]?.length === 0 ? (
                  <p className="text-gray-500 text-center py-4 text-sm">Nenhum jogador no time</p>
                ) : (
                  <div className="space-y-1">
                    {teams[selectedTeam]?.map((player, index) => (
                      <div key={player.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 ${TEAM_COLORS[selectedTeam].bg} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                            {index + 1}
                          </div>
                          <span className="font-medium text-gray-900 text-sm">{player.name}</span>
                        </div>
                        <button
                          onClick={() => removePlayerFromTeam(player.id, selectedTeam)}
                          className="bg-red-500 hover:bg-red-600 text-white p-1 rounded transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => setShowPlayerManagement(false)}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-lg font-medium transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsScreen;