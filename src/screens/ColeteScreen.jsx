import React from 'react';
import { Users, Plus, Minus, Shuffle } from 'lucide-react';
import Header from '../components/Header';
import LiveFieldViewToastMessage from '../components/LiveFieldView-ToastMessage';
import { TEAM_COLORS } from '../constants';
import { calculateStandings } from '../utils/tournamentUtils';

const ColeteScreen = ({ 
  players,
  teams,
  matches,
  coleteParticipants,
  setColeteParticipants,
  immunePlayer,
  setImmunePlayer,
  coleteWinner,
  setColeteWinner,
  onBack 
}) => {
  const [toastMessage, setToastMessage] = React.useState('');
  const [toastType, setToastType] = React.useState('success');
  const [showToast, setShowToast] = React.useState(false);

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const standings = calculateStandings(matches);
  const championTeam = standings.length > 0 ? standings[0].team : null;
  const championPlayers = championTeam ? teams[championTeam] || [] : [];

  const drawColete = () => {
    const eligiblePlayers = coleteParticipants.filter(p => p.id !== immunePlayer?.id);
    
    if (eligiblePlayers.length > 0) {
      const randomPlayer = eligiblePlayers[Math.floor(Math.random() * eligiblePlayers.length)];
      setColeteWinner(randomPlayer);
      showToastMessage(`🧽 ${randomPlayer.name} foi sorteado para lavar o colete!`, 'success');
    } else {
      showToastMessage('Adicione jogadores para o sorteio!', 'error');
    }
  };

  const addPlayerToColete = (player) => {
    if (!coleteParticipants.find(p => p.id === player.id)) {
      setColeteParticipants([...coleteParticipants, player]);
    }
  };

  const removePlayerFromColete = (playerId) => {
    setColeteParticipants(coleteParticipants.filter(p => p.id !== playerId));
    if (immunePlayer?.id === playerId) {
      setImmunePlayer(null);
    }
  };

  const addTeamToColete = (teamName) => {
    const teamPlayers = teams[teamName] || [];
    const newParticipants = [...coleteParticipants];
    
    teamPlayers.forEach(player => {
      if (!newParticipants.find(p => p.id === player.id)) {
        newParticipants.push(player);
      }
    });
    
    setColeteParticipants(newParticipants);
  };

  const addAllExceptChampion = () => {
    if (standings.length === 0) return;
    
    const championTeam = standings[0].team;
    const nonChampionTeams = Object.entries(teams).filter(([teamName]) => teamName !== championTeam);
    
    let newParticipants = [...coleteParticipants];
    nonChampionTeams.forEach(([teamName, teamPlayers]) => {
      teamPlayers.forEach(player => {
        if (!newParticipants.find(p => p.id === player.id)) {
          newParticipants.push(player);
        }
      });
    });
    
    setColeteParticipants(newParticipants);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Sorteio do Colete" showBack={true} onBack={onBack} />
      
      {/* Toast Message */}
      <LiveFieldViewToastMessage
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      
      <div className="p-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          
          <div className="grid grid-cols-1 gap-3">
            {championTeam && (
              <button
                onClick={addAllExceptChampion}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 rounded-xl flex items-center justify-center space-x-2"
              >
                <Users size={16} />
                <span>Adicionar Todos (Exceto Campeão {championTeam})</span>
              </button>
            )}
            
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(teams).map(([teamName, teamPlayers]) => (
                <button
                  key={teamName}
                  onClick={() => addTeamToColete(teamName)}
                  className={`bg-gradient-to-r ${TEAM_COLORS[teamName].gradient} text-white p-3 rounded-xl text-sm flex items-center justify-center space-x-2`}
                >
                  <Users size={14} />
                  <span>{teamName}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {championPlayers.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🏆 Imunidade do Campeão ({championTeam})
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              O campeão pode escolher uma pessoa para imunizar do sorteio:
            </p>
            
            <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
              {championPlayers.map((player) => (
                <button
                  key={player.id}
                  onClick={() => setImmunePlayer(immunePlayer?.id === player.id ? null : player)}
                  className={`p-3 rounded-xl text-left transition-colors ${
                    immunePlayer?.id === player.id
                      ? 'bg-green-100 border-2 border-green-500 text-green-800'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{player.name}</span>
                    {immunePlayer?.id === player.id && (
                      <span className="text-green-600 text-sm font-bold">IMUNE ✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Adicionar Jogadores Individuais</h3>
          
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
            {players.map((player) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  coleteParticipants.find(p => p.id === player.id)
                    ? 'bg-red-100 border border-red-300'
                    : 'bg-gray-100'
                }`}
              >
                <span className="font-medium text-gray-900">{player.name}</span>
                <div className="flex items-center space-x-2">
                  {immunePlayer?.id === player.id && (
                    <span className="text-green-600 text-xs font-bold bg-green-100 px-2 py-1 rounded">
                      IMUNE
                    </span>
                  )}
                  {coleteParticipants.find(p => p.id === player.id) ? (
                    <button
                      onClick={() => removePlayerFromColete(player.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                    >
                      <Minus size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => addPlayerToColete(player)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded"
                    >
                      <Plus size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Participantes do Sorteio ({coleteParticipants.length})
            </h3>
            <button
              onClick={() => setColeteParticipants([])}
              className="text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg text-sm transition-colors"
            >
              Limpar Todos
            </button>
          </div>

          {coleteParticipants.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-gray-500">Nenhum participante adicionado</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {coleteParticipants.map((player) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    immunePlayer?.id === player.id
                      ? 'bg-green-100 border border-green-300'
                      : 'bg-red-100 border border-red-300'
                  }`}
                >
                  <span className="text-sm font-medium">
                    {player.name}
                    {immunePlayer?.id === player.id && (
                      <span className="text-green-600 text-xs ml-1">(IMUNE)</span>
                    )}
                  </span>
                  <button
                    onClick={() => removePlayerFromColete(player.id)}
                    className="text-red-600 hover:bg-red-200 p-1 rounded"
                  >
                    <Minus size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={drawColete}
          disabled={coleteParticipants.filter(p => p.id !== immunePlayer?.id).length === 0}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 disabled:from-gray-300 disabled:to-gray-400 text-white p-4 rounded-2xl font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
        >
          <Shuffle size={20} />
          <span>🧽 Sortear Quem Lava o Colete</span>
        </button>

        {immunePlayer && (
          <p className="text-center text-green-600 text-sm mt-2">
            {immunePlayer.name} está imune e não participará do sorteio
          </p>
        )}

        {coleteWinner && (
          <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <h4 className="font-bold text-red-800">🧽 Resultado do Sorteio</h4>
            <p className="text-red-700">{coleteWinner.name} foi sorteado para lavar o colete!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColeteScreen;