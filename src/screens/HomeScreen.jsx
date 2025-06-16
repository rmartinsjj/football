import React from 'react';
import { Users, Shuffle, Trophy, Target, BarChart3, Settings } from 'lucide-react';

const HomeScreen = ({ 
  players, 
  matches, 
  setCurrentScreen, 
  coleteWinner 
}) => (
  <div className="min-h-screen pb-4">
    <div className="dark-card px-4 pt-6 pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src="/logoespaçonovotempo copy.png" 
            alt="Espaço Novo Tempo" 
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <h1 className="text-lg font-bold text-white">Torneio Futebol</h1>
            <p className="text-gray-300 text-xs">Espaço Novo Tempo - Praia da Costa</p>
          </div>
        </div>
        <button
          onClick={() => setCurrentScreen('settings')}
          className="p-3 hover:bg-gray-700 rounded-xl transition-colors"
          title="Configurações"
        >
          <Settings className="text-gray-300" size={20} />
        </button>
      </div>
    </div>

    <div className="px-4 py-3">
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-4 text-white mb-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-semibold mb-1">Torneio Ativo</h3>
            <p className="text-blue-200 text-sm">{players.length} jogadores • 4 times</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">{matches.filter(m => m.played).length}/{matches.length}</div>
            <p className="text-blue-200 text-sm">jogos</p>
          </div>
        </div>
      </div>
    </div>

    <div className="px-4">
      <h2 className="text-base font-semibold text-white mb-3">Menu Principal</h2>
      <div className="grid grid-cols-2 gap-3">
        {/* Jogadores */}
        <button
          onClick={() => setCurrentScreen('players')}
          className="dark-card rounded-xl p-4 shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 flex flex-col items-center justify-center text-center min-h-[100px]"
        >
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
            <Users className="text-white" size={20} />
          </div>
          <h3 className="font-semibold text-white text-sm mb-1">Jogadores</h3>
          <p className="text-xs text-gray-400">{players.length} cadastrados</p>
        </button>

        {/* Times */}
        <button
          onClick={() => setCurrentScreen('teams')}
          className="dark-card rounded-xl p-4 shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 flex flex-col items-center justify-center text-center min-h-[100px]"
        >
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mb-2">
            <Shuffle className="text-white" size={20} />
          </div>
          <h3 className="font-semibold text-white text-sm mb-1">Times</h3>
          <p className="text-xs text-gray-400">Sortear equipes</p>
        </button>

        {/* Jogos */}
        <button
          onClick={() => setCurrentScreen('matches')}
          className="dark-card rounded-xl p-4 shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 flex flex-col items-center justify-center text-center min-h-[100px]"
        >
          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
            <Target className="text-white" size={20} />
          </div>
          <h3 className="font-semibold text-white text-sm mb-1">Jogos</h3>
          <p className="text-xs text-gray-400">Controlar partidas</p>
        </button>

        {/* Classificação */}
        <button
          onClick={() => setCurrentScreen('standings')}
          className="dark-card rounded-xl p-4 shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 flex flex-col items-center justify-center text-center min-h-[100px]"
        >
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
            <Trophy className="text-white" size={20} />
          </div>
          <h3 className="font-semibold text-white text-sm mb-1">Classificação</h3>
          <p className="text-xs text-gray-400">Ver tabela</p>
        </button>

        {/* Artilheiros */}
        <button
          onClick={() => setCurrentScreen('scorers')}
          className="dark-card rounded-xl p-4 shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 flex flex-col items-center justify-center text-center min-h-[100px]"
        >
          <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center mb-2">
            <BarChart3 className="text-white" size={20} />
          </div>
          <h3 className="font-semibold text-white text-sm mb-1">Artilheiros</h3>
          <p className="text-xs text-gray-400">Ver goleadores</p>
        </button>

        {/* Sorteio do Colete */}
        <button
          onClick={() => setCurrentScreen('colete')}
          className="dark-card rounded-xl p-4 shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 flex flex-col items-center justify-center text-center min-h-[100px]"
        >
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mb-2">
            <span className="text-lg">🧽</span>
          </div>
          <h3 className="font-semibold text-white text-sm mb-1">Sorteio do Colete</h3>
          <p className="text-xs text-gray-400">Organizar disputa</p>
        </button>
      </div>
    </div>

    {coleteWinner && (
      <div className="mx-4 mt-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl p-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="text-xl">🧽</div>
          <div>
            <h3 className="font-bold text-white text-sm">Sorteio do Colete</h3>
            <p className="text-yellow-200 text-sm">{coleteWinner.name} foi sorteado!</p>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default HomeScreen;