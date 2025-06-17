import React from 'react';
import { Users, Shuffle, Trophy, Target, BarChart3, Settings } from 'lucide-react';
import Header from '../components/Header';

const HomeScreen = ({ 
  players, 
  matches, 
  setCurrentScreen, 
  coleteWinner,
  settings
}) => {
  const activeTeams = settings?.activeTeams || ['Vermelho', 'Azul', 'Brasil', 'Verde Branco'];
  
  // Filter matches to only include active teams, but keep playoff structure
  const filteredMatches = matches.filter(match => {
    // Always keep playoff matches (they will be populated with correct teams)
    if (match.type === 'final' || match.type === 'third_place') {
      return true;
    }
    // For regular matches, only include if both teams are active
    return activeTeams.includes(match.team1) && activeTeams.includes(match.team2);
  });
  
  return (
  <div className="min-h-screen pb-4 overflow-x-hidden">
    {/* Custom header for home screen with logo and settings */}
    <div className="dark-card shadow-sm border-b border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-10 h-16">
      <img 
        src="/logoespaco.png" 
        alt="Espaço Novo Tempo" 
        className="h-8 w-auto object-contain"
        title="Espaço Novo Tempo"
      />
      <button
        onClick={() => setCurrentScreen('settings')}
        className="p-2 hover:bg-gray-700 rounded-full transition-colors active:bg-gray-600"
        title="Configurações"
      >
        <Settings size={22} className="text-gray-300" />
      </button>
    </div>
    
    <div className="px-4 pt-4 pb-4">
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
          <div className="mb-3">
            <img src="/soccer-player1.png" alt="Jogador" className="w-8 h-8 filter brightness-0 invert opacity-80" />
          </div>
          <h3 className="font-semibold text-white text-sm mb-1">Jogadores</h3>
          <p className="text-xs text-gray-400">{players.length} cadastrados</p>
        </button>

        {/* Times */}
        <button
          onClick={() => setCurrentScreen('teams')}
          className="dark-card rounded-xl p-4 shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 flex flex-col items-center justify-center text-center min-h-[100px]"
        >
          <div className="mb-3">
            <img src="/ball3.png" alt="Bola" className="w-8 h-8 filter brightness-0 invert opacity-80" />
          </div>
          <h3 className="font-semibold text-white text-sm mb-1">Times</h3>
          <p className="text-xs text-gray-400">Sortear equipes</p>
        </button>

        {/* Jogos */}
        <button
          onClick={() => setCurrentScreen('matches')}
          className="dark-card rounded-xl p-4 shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 flex flex-col items-center justify-center text-center min-h-[100px]"
        >
          <div className="mb-3">
            <img src="/classifcacao1.png" alt="Jogos" className="w-8 h-8 filter brightness-0 invert opacity-80" />
          </div>
          <h3 className="font-semibold text-white text-sm mb-1">Jogos</h3>
          <p className="text-xs text-gray-400">Controlar partidas</p>
        </button>

        {/* Classificação */}
        <button
          onClick={() => setCurrentScreen('standings')}
          className="dark-card rounded-xl p-4 shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 flex flex-col items-center justify-center text-center min-h-[100px]"
        >
          <div className="mb-3">
            <img src="/throphy.png" alt="Classificação" className="w-8 h-8 filter brightness-0 invert opacity-80" />
          </div>
          <h3 className="font-semibold text-white text-sm mb-1">Classificação</h3>
          <p className="text-xs text-gray-400">Ver tabela</p>
        </button>

        {/* Artilheiros */}
        <button
          onClick={() => setCurrentScreen('scorers')}
          className="dark-card rounded-xl p-4 shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 flex flex-col items-center justify-center text-center min-h-[100px]"
        >
          <div className="mb-3">
            <img src="/artilheirosicon.png" alt="Artilheiros" className="w-8 h-8 filter brightness-0 invert opacity-80" />
          </div>
          <h3 className="font-semibold text-white text-sm mb-1">Artilheiros</h3>
          <p className="text-xs text-gray-400">Ver goleadores</p>
        </button>

        {/* Sorteio do Colete */}
        <button
          onClick={() => setCurrentScreen('colete')}
          className="dark-card rounded-xl p-4 shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 flex flex-col items-center justify-center text-center min-h-[100px]"
        >
          <div className="mb-3">
            <img src="/tshirtcolete.png" alt="Sorteio do Colete" className="w-8 h-8 filter brightness-0 invert opacity-80" />
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

    {/* Bottom section with Jesus image and phrase */}
    <div className="px-4 mt-6 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p 
            className="text-white text-lg leading-relaxed"
            style={{ 
              fontFamily: 'Poppins, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontWeight: '500',
              letterSpacing: '0.3px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              lineHeight: '1.3',
              fontSize: '16px'
            }}
          >
            Mais que futebol, é comunhão<br />
            e Jesus é o nosso capitão!
          </p>
        </div>
        <div className="ml-4">
          <img 
            src="/jesussoccer-Photoroom.png" 
            alt="Jesus" 
            className="w-24 h-24 object-contain filter brightness-0 invert opacity-90"
            title="Jesus"
          />
        </div>
      </div>
    </div>
  </div>
  );
};

export default HomeScreen;