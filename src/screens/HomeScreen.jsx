import React from 'react';
import { Users, Shuffle, Trophy, Target } from 'lucide-react';

const HomeScreen = ({ 
  players, 
  matches, 
  setCurrentScreen, 
  coleteWinner 
}) => (
  <div className="min-h-screen bg-gray-50 pb-4">
    <div className="bg-white px-4 pt-6 pb-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Torneio Futebol</h1>
        <p className="text-gray-600 font-medium text-sm">Espaço Novo Tempo</p>
        <p className="text-sm text-gray-500">Praia da Costa</p>
      </div>
    </div>

    <div className="px-4 py-3">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-semibold mb-1">Torneio Ativo</h3>
            <p className="text-blue-100 text-sm">{players.length} jogadores • 4 times</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">{matches.filter(m => m.played).length}/12</div>
            <p className="text-blue-100 text-sm">jogos</p>
          </div>
        </div>
      </div>
    </div>

    <div className="px-4">
      <h2 className="text-base font-semibold text-gray-900 mb-3">Menu Principal</h2>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setCurrentScreen('players')}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md active:scale-95 transition-all duration-200"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
            <Users className="text-blue-600" size={20} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1 text-sm">Jogadores</h3>
          <p className="text-sm text-gray-500">{players.length} cadastrados</p>
        </button>

        <button
          onClick={() => setCurrentScreen('teams')}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md active:scale-95 transition-all duration-200"
        >
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
            <Shuffle className="text-green-600" size={20} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1 text-sm">Times</h3>
          <p className="text-sm text-gray-500">Sortear equipes</p>
        </button>

        <button
          onClick={() => setCurrentScreen('scorers')}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md active:scale-95 transition-all duration-200"
        >
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-3">
            <Target className="text-yellow-600" size={20} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1 text-sm">Artilheiros</h3>
          <p className="text-sm text-gray-500">Ver goleadores</p>
        </button>

        <button
          onClick={() => setCurrentScreen('matches')}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md active:scale-95 transition-all duration-200"
        >
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
            <Target className="text-orange-600" size={20} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1 text-sm">Jogos</h3>
          <p className="text-sm text-gray-500">Controlar partidas</p>
        </button>

        <button
          onClick={() => setCurrentScreen('standings')}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md active:scale-95 transition-all duration-200"
        >
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
            <Trophy className="text-purple-600" size={20} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1 text-sm">Classificação</h3>
          <p className="text-sm text-gray-500">Ver tabela</p>
        </button>

        <button
          onClick={() => setCurrentScreen('colete')}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md active:scale-95 transition-all duration-200"
        >
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-3">
            <span className="text-lg">🧽</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1 text-sm">Sorteio do Colete</h3>
          <p className="text-sm text-gray-500">Organizar disputa do colete</p>
        </button>
      </div>
    </div>

    {coleteWinner && (
      <div className="mx-4 mt-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-3">
        <div className="flex items-center space-x-3">
          <div className="text-xl">🧽</div>
          <div>
            <h3 className="font-bold text-white text-sm">Sorteio do Colete</h3>
            <p className="text-yellow-100 text-sm">{coleteWinner.name} foi sorteado!</p>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default HomeScreen;