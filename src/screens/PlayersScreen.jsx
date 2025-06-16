import React, { useState } from 'react';
import { Users, Plus, Minus } from 'lucide-react';
import Header from '../components/Header';
import { parsePlayerList } from '../utils/tournamentUtils';

const PlayersScreen = ({ 
  players, 
  setPlayers, 
  onBack 
}) => {
  const [playerListText, setPlayerListText] = useState('');
  const [newPlayerName, setNewPlayerName] = useState('');

  const handleParsePlayerList = () => {
    const newPlayers = parsePlayerList(playerListText);
    setPlayers(newPlayers);
    setPlayerListText('');
    alert(`${newPlayers.length} jogadores adicionados!`);
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
    <div className="min-h-screen bg-gray-50">
      <Header title="Jogadores" showBack={true} onBack={onBack} />
      
      <div className="p-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Adicionar Jogadores</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lista completa (formato: 1. Nome):
              </label>
              <textarea
                value={playerListText}
                onChange={(e) => setPlayerListText(e.target.value)}
                placeholder="1. PV ( Lavou os coletes)&#10;2. Artulino&#10;3. Henrique..."
                className="w-full p-3 border border-gray-200 rounded-lg h-28 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <button
                onClick={handleParsePlayerList}
                disabled={!playerListText.trim()}
                className="w-full mt-2 bg-gradient-to-r from-green-500 to-green-600 disabled:from-gray-300 disabled:to-gray-400 text-white p-3 rounded-lg font-medium transition-all duration-200 active:scale-95"
              >
                Adicionar Lista Completa
              </button>
            </div>
            
            <div className="border-t border-gray-200 pt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ou adicione individualmente:
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Nome do jogador"
                  className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={addPlayer}
                  className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white p-3 rounded-lg transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">Lista de Jogadores</h3>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {players.length} jogadores
              </span>
            </div>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {players.length === 0 ? (
              <div className="p-6 text-center">
                <Users size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Nenhum jogador cadastrado</p>
              </div>
            ) : (
              <div className="space-y-1 p-3">
                {players.map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-900 text-sm">{player.name}</span>
                    </div>
                    <button
                      onClick={() => removePlayer(player.id)}
                      className="text-red-500 hover:bg-red-50 active:bg-red-100 p-2 rounded-lg transition-colors"
                    >
                      <Minus size={14} />
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