import React, { useState } from 'react';
import { Shuffle, Plus, Minus, UserPlus, UserMinus, Edit3, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import Header from '../components/Header';
import LiveFieldViewToastMessage from '../components/LiveFieldView-ToastMessage';
import { TEAM_COLORS } from '../constants';
import { drawTeams } from '../utils/tournamentUtils';

const TeamsScreen = ({ 
  players, 
  teams, 
  setTeams, 
  tournamentStarted, 
  setTournamentStarted, 
  settings,
  setCurrentScreen,
  onBack 
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingStep, setDrawingStep] = useState(0);
  const [showPlayerManagement, setShowPlayerManagement] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [expandedTeams, setExpandedTeams] = useState({
    'Vermelho': false,
    'Azul': false,
    'Brasil': false,
    'Verde Branco': false
  });
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showToast, setShowToast] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

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
    const newTeams = drawTeams(players, settings?.activeTeams);
    setTeams(newTeams);
    setTournamentStarted(true);
    
    // Finalizar loading
    setIsDrawing(false);
    setDrawingStep(0);
  };

  const handleReDraw = async () => {
    setShowConfirmDialog(true);
  };

  const confirmReDraw = async () => {
    setShowConfirmDialog(false);
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

      // Re-sortear os times
      const newTeams = drawTeams(players, settings?.activeTeams);
      setTeams(newTeams);
      
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

  const toggleTeamExpansion = (teamName) => {
    setExpandedTeams(prev => ({
      ...prev,
      [teamName]: !prev[teamName]
    }));
  };

  const toggleAllTeams = () => {
    const allExpanded = Object.values(expandedTeams).every(expanded => expanded);
    const newState = !allExpanded;
    setExpandedTeams({
      'Vermelho': newState,
      'Azul': newState,
      'Brasil': newState,
      'Verde Branco': newState
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden pb-24">
      <Header title="Times" showBack={true} onBack={onBack} setCurrentScreen={setCurrentScreen} />
      
      {/* Toast Message */}
      <LiveFieldViewToastMessage
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Confirmar Re-sorteio</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Tem certeza que deseja re-sortear os times? Isso irá redistribuir todos os jogadores novamente.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmReDraw}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg font-medium transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-4">
        {/* Seção de Sorteio/Re-sortear */}
        {!tournamentStarted ? (
          <div className="dark-card rounded-xl p-4 shadow-sm mb-4">
            <h3 className="text-lg font-semibold text-white mb-4">Sortear Times</h3>
            <p className="text-gray-300 mb-6 text-base">Distribua os {players.length} jogadores em 4 times automaticamente.</p>
            
            {isDrawing ? (
              <div className="text-center py-8">
                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-4 relative">
                    <div className="absolute inset-0 border-4 border-green-800 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-2 bg-green-900 rounded-full flex items-center justify-center">
                      <Shuffle className="text-green-400 animate-pulse" size={24} />
                    </div>
                  </div>
                  <div className="text-lg font-bold text-white mb-2 animate-pulse">
                    {drawingMessages[drawingStep]}
                  </div>
                  <div className="flex justify-center space-x-1">
                    {[0, 1, 2].map((step) => (
                      <div
                        key={step}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          step <= drawingStep ? 'bg-green-500' : 'bg-gray-600'
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
                className="w-full bg-gradient-to-r from-green-500 to-green-600 disabled:from-gray-600 disabled:to-gray-700 text-white p-5 rounded-lg font-medium text-base flex items-center justify-center space-x-3 transition-all duration-200 active:scale-95"
              >
                <Shuffle size={24} />
                <span>Sortear Times Automaticamente</span>
              </button>
            )}
          </div>
        ) : (
          <div className="dark-card rounded-xl p-4 shadow-sm mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Controles dos Times</h3>
              <button
                onClick={toggleAllTeams}
                className="text-gray-400 hover:text-gray-200 p-1 rounded transition-colors"
              >
                {Object.values(expandedTeams).every(expanded => expanded) ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {isDrawing ? (
                <div className="text-center py-4">
                  <div className="relative">
                    <div className="w-12 h-12 mx-auto mb-3 relative">
                      <div className="absolute inset-0 border-4 border-orange-800 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
                      <div className="absolute inset-2 bg-orange-900 rounded-full flex items-center justify-center">
                        <RotateCcw className="text-orange-400 animate-pulse" size={16} />
                      </div>
                    </div>
                    <div className="text-sm font-bold text-white mb-2 animate-pulse">
                      {drawingMessages[drawingStep]}
                    </div>
                    <div className="flex justify-center space-x-1">
                      {[0, 1, 2].map((step) => (
                        <div
                          key={step}
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            step <= drawingStep ? 'bg-orange-500' : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleReDraw}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg font-medium text-base flex items-center justify-center space-x-3 transition-all duration-200 active:scale-95"
                >
                  <RotateCcw size={20} />
                  <span>Re-sortear Times</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Times */}
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(teams).filter(([teamName]) => 
            settings?.activeTeams?.includes(teamName) || !settings?.activeTeams
          ).map(([teamName, teamPlayers]) => (
            <div key={teamName} className="dark-card rounded-xl shadow-sm overflow-hidden">
              <div className={`bg-gradient-to-r ${TEAM_COLORS[teamName].gradient} p-4`}>
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-bold text-lg">{teamName}</h3>
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                      {teamPlayers.length}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {tournamentStarted && (
                      <button
                        onClick={() => openPlayerManagement(teamName)}
                        className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-colors"
                        title="Editar jogadores"
                      >
                        <Edit3 size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => toggleTeamExpansion(teamName)}
                      className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-colors"
                      title={expandedTeams[teamName] ? "Recolher" : "Expandir"}
                    >
                      {expandedTeams[teamName] ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {expandedTeams[teamName] && (
                <div className="p-4">
                  {teamPlayers.length === 0 ? (
                    <p className="text-gray-400 text-center py-6 text-base">Nenhum jogador sorteado</p>
                  ) : (
                    <div className="space-y-2">
                      {teamPlayers.map((player, index) => (
                        <div key={player.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 ${TEAM_COLORS[teamName].bg} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                              {index + 1}
                            </div>
                            <span className="font-medium text-white text-base flex-1 min-w-0">{player.name}</span>
                          </div>
                          {tournamentStarted && (
                            <button
                              onClick={() => removePlayerFromTeam(player.id, teamName)}
                              className="text-red-400 hover:bg-red-900 p-2 rounded transition-colors flex-shrink-0"
                              title="Remover jogador"
                            >
                              <UserMinus size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Gerenciamento de Jogadores */}
      {showPlayerManagement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="dark-card-solid rounded-xl max-w-sm w-full max-h-[80vh] overflow-hidden">
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
                <h4 className="font-semibold text-white mb-2 text-sm">Jogadores Disponíveis</h4>
                {availablePlayers.length === 0 ? (
                  <p className="text-gray-400 text-center py-4 text-sm">Todos os jogadores já estão em times</p>
                ) : (
                  <div className="space-y-1">
                    {availablePlayers.map((player) => (
                      <div key={player.id} className="flex items-center justify-between p-2 bg-gray-700 rounded-lg">
                        <span className="font-medium text-white text-sm">{player.name}</span>
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
                <h4 className="font-semibold text-white mb-2 text-sm">Jogadores do Time</h4>
                {teams[selectedTeam]?.length === 0 ? (
                  <p className="text-gray-400 text-center py-4 text-sm">Nenhum jogador no time</p>
                ) : (
                  <div className="space-y-1">
                    {teams[selectedTeam]?.map((player, index) => (
                      <div key={player.id} className="flex items-center justify-between p-2 bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 ${TEAM_COLORS[selectedTeam].bg} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                            {index + 1}
                          </div>
                          <span className="font-medium text-white text-sm">{player.name}</span>
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

            <div className="p-4 border-t border-gray-600">
              <button
                onClick={() => setShowPlayerManagement(false)}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-lg font-medium transition-colors"
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