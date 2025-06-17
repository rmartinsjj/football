import React, { useState } from 'react';
import { Users, Plus, Minus } from 'lucide-react';
import Header from '../components/Header';
import LiveFieldViewToastMessage from '../components/LiveFieldView-ToastMessage';
import { parsePlayerList } from '../utils/tournamentUtils';

const PlayersScreen = ({ 
  players, 
  setPlayers, 
  onBack 
}) => {
  const [playerListText, setPlayerListText] = useState('');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showToast, setShowToast] = useState(false);

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleParsePlayerList = () => {
    const newPlayers = parsePlayerList(playerListText);
    setPlayers(newPlayers);
    setPlayerListText('');
    showToastMessage(`${newPlayers.length} jogadores adicionados!`, 'success');
  };

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayer = {
        id: Date.now(),
        name: newPlayerName.trim(),
        photo: null
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (playerId) => {
    setPlayers(players.filter(p => p.id !== playerId));
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header title="Jogadores" showBack={true} onBack={onBack} />
      
      {/* Toast Message */}
      <LiveFieldViewToastMessage
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      
      <div className="p-4">
        <div className="dark-card rounded-xl p-4 shadow-sm mb-4">
          <h3 className="text-lg font-semibold text-white mb-4">Adicionar Jogadores</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Lista completa (formato: 1. Nome):
              </label>
              <textarea
                value={playerListText}
                onChange={(e) => setPlayerListText(e.target.value)}
                placeholder="1. PV ( Lavou os coletes)&#10;2. Artulino&#10;3. Henrique..."
                className="w-full p-4 bg-gray-800 border border-gray-600 rounded-lg h-32 text-base text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <button
                onClick={handleParsePlayerList}
                disabled={!playerListText.trim()}
                className="w-full mt-3 bg-gradient-to-r from-green-500 to-green-600 disabled:from-gray-600 disabled:to-gray-700 text-white p-4 rounded-lg font-medium text-base transition-all duration-200 active:scale-95"
              >
                Adicionar Lista Completa
              </button>
            </div>
            
            <div className="border-t border-gray-600 pt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ou adicione individualmente:
              </label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Nome do jogador"
                  className="flex-1 p-4 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                />
                <button
                  onClick={addPlayer}
                  className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white p-4 rounded-lg transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="dark-card rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-600">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Lista de Jogadores</h3>
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-base font-medium">
                {players.length} jogadores
              </span>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {players.length === 0 ? (
              <div className="p-8 text-center">
                <Users size={48} className="text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-base">Nenhum jogador cadastrado</p>
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {players.map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between p-4 hover:bg-gray-700 rounded-lg transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-base">
                        {index + 1}
                      </div>
                      <span className="font-medium text-white text-base flex-1 min-w-0">{player.name}</span>
                    </div>
                    <button
                      onClick={() => removePlayer(player.id)}
                      className="text-red-400 hover:bg-red-900 active:bg-red-800 p-3 rounded-lg transition-colors flex-shrink-0"
                    >
                      <Minus size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayersScreen;