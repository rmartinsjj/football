import React from 'react';
import { Users, Shuffle, Trophy, Target, BarChart3, Settings } from 'lucide-react';

const HomeScreen = ({ 
  players, 
  matches, 
  setCurrentScreen, 
  coleteWinner,
  settings
}) => {
  const activeTeams = settings?.activeTeams || ['Vermelho', 'Azul', 'Brasil', 'Verde Branco'];
  
  // Filter matches to only include active teams
  const filteredMatches = matches.filter(match => 
    activeTeams.includes(match.team1) && activeTeams.includes(match.team2)
  );
  
  return (
  <div className="min-h-screen pb-4 overflow-x-hidden">
    <div className="dark-card px-4 pt-6 pb-4">
      <div className="flex items-center justify-between">
        <img 
          src="/logoespaco.png" 
          alt="Espaço Novo Tempo" 
          className="h-12 w-auto object-contain"
          title="Espaço Novo Tempo"
        />
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
      <div 
        className="rounded-xl p-4 text-white mb-4 shadow-lg relative overflow-hidden"
        style={{
          backgroundImage: 'url(/1245151 copy.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl"></div>
        
        <div className="relative z-10">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-semibold mb-1">Torneio Ativo</h3>
            <p className="text-gray-200 text-sm">{players.length} jogadores • {settings?.numberOfTeams || 4} times</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">{filteredMatches.filter(m => m.played).length}/{filteredMatches.length}</div>
            <p className="text-gray-200 text-sm">jogos</p>
          </div>
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
};

export default HomeScreen;