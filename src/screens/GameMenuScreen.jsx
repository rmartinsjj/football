import React from 'react';
import { Settings, ArrowLeft } from 'lucide-react';

const GameMenuScreen = ({
  currentGameDay,
  players = [],
  matches = [],
  coleteWinner,
  settings,
  setCurrentScreen,
  onBack
}) => {
  const activeTeams = settings?.activeTeams || ['Vermelho', 'Azul', 'Brasil', 'Verde Branco'];

  const filteredMatches = matches.filter(match => {
    if (match.type === 'final' || match.type === 'third_place') {
      return true;
    }
    return activeTeams.includes(match.team1) && activeTeams.includes(match.team2);
  });

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden pb-24">
      <div className="fixed top-0 left-0 right-0 z-[9999] w-full bg-gray-900/95 backdrop-blur-md border-b border-gray-700 shadow-lg" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="px-4 py-3 flex items-center justify-between min-h-[64px]">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors active:bg-gray-600"
            title="Voltar"
          >
            <ArrowLeft size={22} className="text-gray-300" />
          </button>
          <img
            src="/logoespacoappfootball.png"
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
      </div>

      <div className="px-4 pb-4" style={{ paddingTop: 'calc(64px + env(safe-area-inset-top) + 16px)' }}>
        <div
          className="rounded-xl p-4 text-white mb-4 shadow-lg relative overflow-hidden"
          style={{
            backgroundImage: 'url(/1245151 copy.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl"></div>

          <div className="relative z-10">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-semibold mb-1">{formatDate(currentGameDay?.game_date)}</h3>
                <p className="text-gray-200 text-sm">{players.length} jogadores • {settings?.numberOfTeams || 4} times</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">{filteredMatches.filter(m => m.played).length}/{filteredMatches.length}</div>
                <p className="text-gray-200 text-sm">jogos</p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-base font-semibold text-white mb-3">Menu Principal</h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
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

          <button
            onClick={() => setCurrentScreen('colete')}
            className="dark-card rounded-xl p-4 shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 flex flex-col items-center justify-center text-center min-h-[100px]"
          >
            <div className="mb-3">
              <img src="/tshirtcolete.png" alt="Colete" className="w-8 h-8 filter brightness-0 invert opacity-80" />
            </div>
            <h3 className="font-semibold text-white text-sm mb-1">Sorteio do Colete</h3>
            <p className="text-xs text-gray-400">
              {coleteWinner ? coleteWinner : 'Organizar disputa'}
            </p>
          </button>
        </div>
      </div>

      <div className="px-4 pb-8">
        <div className="flex items-center justify-center gap-6 mt-8">
          <div className="text-left text-gray-400 text-xs italic leading-relaxed">
            <p>Mais que futebol, é comunhão</p>
            <p>e Jesus é o nosso capitão!</p>
          </div>
          <img
            src="/IMG_9294.PNG"
            alt="Jesus Soccer"
            className="w-24 h-24 object-contain opacity-90"
          />
        </div>
      </div>
    </div>
  );
};

export default GameMenuScreen;
