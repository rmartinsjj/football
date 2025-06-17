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
  settings,
  coleteParticipants,
  setColeteParticipants,
  immunePlayer,
  setImmunePlayer,
  coleteWinner,
  setColeteWinner,
  setCurrentScreen,
  onBack 
}) => {
  const [toastMessage, setToastMessage] = React.useState('');
  const [toastType, setToastType] = React.useState('success');
  const [showToast, setShowToast] = React.useState(false);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [drawingStep, setDrawingStep] = React.useState(0);

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const standings = calculateStandings(matches);
  const championTeam = standings.length > 0 ? standings[0].team : null;
  const championPlayers = championTeam ? teams[championTeam] || [] : [];

  const drawingMessages = [
    "🧽 Preparando o sorteio do colete...",
    "🎲 Sorteando quem vai lavar...",
    "🏆 Resultado definido!"
  ];

  const drawColete = async () => {
    const eligiblePlayers = coleteParticipants.filter(p => p.id !== immunePlayer?.id);
    
    if (eligiblePlayers.length === 0) {
      showToastMessage('Adicione jogadores para o sorteio!', 'error');
      return;
    }

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

    // Sortear o jogador
    const randomPlayer = eligiblePlayers[Math.floor(Math.random() * eligiblePlayers.length)];
    setColeteWinner(randomPlayer);
    
    // Finalizar loading
    setIsDrawing(false);
    setDrawingStep(0);
    
    showToastMessage(`🧽 ${randomPlayer.name} foi sorteado para lavar o colete!`, 'success');
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
    <div className="min-h-screen overflow-x-hidden pb-24">
      <Header title="Sorteio do Colete" showBack={true} onBack={onBack} setCurrentScreen={setCurrentScreen} />
      
      {/* Toast Message */}
      <LiveFieldViewToastMessage
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      
      <div className="p-6">
        {championPlayers.length > 0 && (
          <div className="dark-card rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              🏆 Imunidade do Campeão
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              O campeão ({championTeam}) pode escolher uma pessoa do último colocado para imunizar do sorteio:
            </p>
            
            {standings.length >= 4 && (
              <div className="mb-3 p-3 bg-red-900 rounded-lg border border-red-600">
                <div className="text-center">
                  <span className="text-red-200 text-sm font-medium">Último Colocado:</span>
                  <div className="text-white font-bold">{standings[3].team}</div>
                </div>
              </div>
            )}
            
            {standings.length >= 4 && teams[standings[3].team] && (
              <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                {teams[standings[3].team].map((player) => (
                  <button
                    key={player.id}
                    onClick={() => setImmunePlayer(immunePlayer?.id === player.id ? null : player)}
                    className={`p-3 rounded-xl text-left transition-colors ${
                      immunePlayer?.id === player.id
                        ? 'bg-green-900 border-2 border-green-500 text-green-200'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
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
            )}
            
            {(!standings.length || standings.length < 4 || !teams[standings[3]?.team] || teams[standings[3]?.team].length === 0) && (
              <div className="text-center py-4">
                <span className="text-gray-400 text-sm">
                  {!standings.length || standings.length < 4 
                    ? "Aguardando classificação completa..." 
                    : "Nenhum jogador no último colocado"}
                </span>
              </div>
            )}
          </div>
        )}
        
        {championPlayers.length === 0 && standings.length > 0 && (
          <div className="dark-card rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              🏆 Imunidade do Campeão
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Aguardando definição do campeão para liberar a escolha da imunidade.
            </p>
            
            <div className="text-center py-4">
              <span className="text-gray-400 text-sm">Termine o torneio para liberar esta função</span>
            </div>
          </div>
        )}
        
        {championPlayers.length > 0 && standings.length >= 4 && teams[standings[3]?.team] && (
          <div className="dark-card rounded-2xl p-6 shadow-sm mb-6" style={{ display: 'none' }}>
          </div>
        )}
        
        <div className="dark-card rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Ações Rápidas</h3>
          
          <div className="grid grid-cols-1 gap-3">
            {championTeam && (
              <button
                onClick={addAllExceptChampion}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 rounded-xl flex items-center justify-center space-x-2"
              >
                <Users size={16} />
                <span>+ Todos (Exceto Campeão)</span>
              </button>
            )}
            
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(teams).filter(([teamName]) => 
                settings?.activeTeams?.includes(teamName) || !settings?.activeTeams
              ).map(([teamName, teamPlayers]) => (
                <button
                  key={teamName}
                  onClick={() => championTeam !== teamName && addTeamToColete(teamName)}
                  disabled={championTeam === teamName}
                  className={`p-3 rounded-xl text-sm flex items-center justify-center space-x-2 transition-all ${
                    championTeam === teamName
                      ? 'bg-gray-600 text-gray-400 opacity-50 cursor-not-allowed'
                      : `bg-gradient-to-r ${TEAM_COLORS[teamName].gradient} text-white hover:opacity-90`
                  }`}
                >
                  <Users size={14} />
                  <span>{teamName} {championTeam === teamName ? '🏆' : ''}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="dark-card rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Adicionar Jogadores Individuais</h3>
          
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
            {players.map((player) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  coleteParticipants.find(p => p.id === player.id)
                    ? 'bg-red-900 border border-red-600'
                    : 'bg-gray-700'
                }`}
              >
                <span className="font-medium text-white">{player.name}</span>
                <div className="flex items-center space-x-2">
                  {immunePlayer?.id === player.id && (
                    <span className="text-green-400 text-xs font-bold bg-green-900 px-2 py-1 rounded">
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

        <div className="dark-card rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Participantes do Sorteio ({coleteParticipants.length})
            </h3>
            <button
              onClick={() => setColeteParticipants([])}
              className="text-red-400 hover:bg-red-900 px-3 py-1 rounded-lg text-sm transition-colors"
            >
              Limpar Todos
            </button>
          </div>

          {coleteParticipants.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-gray-400">Nenhum participante adicionado</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {coleteParticipants.map((player) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    immunePlayer?.id === player.id
                      ? 'bg-green-900 border border-green-600'
                      : 'bg-red-900 border border-red-600'
                  }`}
                >
                  <span className="text-sm font-medium">
                    {player.name}
                    {immunePlayer?.id === player.id && (
                      <span className="text-green-400 text-xs ml-1">(IMUNE)</span>
                    )}
                  </span>
                  <button
                    onClick={() => removePlayerFromColete(player.id)}
                    className="text-red-400 hover:bg-red-800 p-1 rounded"
                  >
                    <Minus size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {isDrawing ? (
          <div className="text-center py-8">
            <div className="relative">
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <div className="absolute inset-0 border-4 border-red-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-red-500 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-2 bg-red-900 rounded-full flex items-center justify-center">
                  <span className="text-red-400 animate-pulse text-xl">🧽</span>
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
                      step <= drawingStep ? 'bg-red-500' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={drawColete}
            disabled={coleteParticipants.filter(p => p.id !== immunePlayer?.id).length === 0}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 disabled:from-gray-600 disabled:to-gray-700 text-white p-4 rounded-2xl font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
          >
            <Shuffle size={20} />
            <span>🧽 Sortear Quem Lava o Colete</span>
          </button>
        )}

        {immunePlayer && (
          <p className="text-center text-green-400 text-sm mt-2">
            {immunePlayer.name} está imune e não participará do sorteio
          </p>
        )}

        {coleteWinner && (
          <div className="mt-6 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-2xl p-6 text-center shadow-2xl border-2 border-red-400">
            <div className="mb-4">
              <div className="text-3xl mb-2">🧽</div>
              <h2 className="text-xl font-bold text-white mb-1">RESULTADO DO SORTEIO</h2>
              <p className="text-red-100 text-sm">Quem vai lavar o colete</p>
            </div>
            
            <div className="flex items-center justify-between bg-white bg-opacity-10 rounded-xl p-4 mb-4">
              {/* Imagem do Jesus */}
              <div className="flex-shrink-0">
                <img 
                  src="/lavarcolete.png" 
                  alt="Jesus" 
                  className="w-16 h-16 object-contain filter brightness-0 invert"
                  title="Jesus"
                />
              </div>
              
              {/* Frase personalizada */}
              <div className="flex-1 ml-4 text-left">
                <p className="text-white text-base leading-relaxed font-medium">
                  O colete é seu, <span className="font-bold text-yellow-200 text-lg">{coleteWinner.name}</span>. 
                  Lembre-se: amaciante Downy, porque tem muitos alérgicos!
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <button
                onClick={() => setColeteWinner(null)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Fechar Resultado
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColeteScreen;