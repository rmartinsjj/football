import React from 'react';
import { Users, Shuffle, Trophy, Target } from 'lucide-react';

const HomeScreen = ({ 
  players, 
  matches, 
  setCurrentScreen, 
  coleteWinner 
}) => (
  <div className="min-h-screen bg-gray-50">
    <div className="bg-white px-6 pt-8 pb-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Torneio Futebol</h1>
        <p className="text-gray-600 font-medium">Espaço Novo Tempo</p>
        <p className="text-sm text-gray-500">Praia da Costa</p>
      </div>
    </div>

    <div className="px-6 py-4">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold mb-1">Torneio Ativo</h3>
            <p className="text-blue-100">{players.length} jogadores • 4 times</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{matches.filter(m => m.played).length}/12</div>
            <p className="text-blue-100 text-sm">jogos</p>
          </div>
        </div>
      </div>
    </div>

    <div className="px-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Menu Principal</h2>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setCurrentScreen('players')}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <Users className="text-blue-600" size={24} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Jogadores</h3>
          <p className="text-sm text-gray-500">{players.length} cadastrados</p>
        </button>

        <button
          onClick={() => setCurrentScreen('teams')}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
        >
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
            <Shuffle className="text-green-600" size={24} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Times</h3>
          <p className="text-sm text-gray-500">Sortear equipes</p>
        </button>

        <button
          onClick={() => setCurrentScreen('scorers')}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
        >
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
            <Target className="text-yellow-600" size={24} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Artilheiros</h3>
          <p className="text-sm text-gray-500">Ver goleadores</p>
        </button>

        <button
          onClick={() => setCurrentScreen('matches')}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
            <Target className="text-orange-600" size={24} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Jogos</h3>
          <p className="text-sm text-gray-500">Controlar partidas</p>
        </button>

        <button
          onClick={() => setCurrentScreen('standings')}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
            <Trophy className="text-purple-600" size={24} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Classificação</h3>
          <p className="text-sm text-gray-500">Ver tabela</p>
        </button>

        <button
          onClick={() => setCurrentScreen('colete')}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
        >
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
            <span className="text-2xl">🧽</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Sorteio do Colete</h3>
          <p className="text-sm text-gray-500">Organizar disputa do colete</p>
        </button>
      </div>
    </div>

    {coleteWinner && (
      <div className="mx-6 mt-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🧽</div>
          <div>
            <h3 className="font-bold text-white">Sorteio do Colete</h3>
            <p className="text-yellow-100">{coleteWinner.name} foi sorteado!</p>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default HomeScreen;