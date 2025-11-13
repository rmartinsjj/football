import React from 'react';
import { Users, Shuffle, Trophy, Target, BarChart3, Settings, ArrowLeft, ShirtIcon } from 'lucide-react';

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

  const menuItems = [
    {
      id: 'players',
      icon: Users,
      label: 'Jogadores',
      bgColor: 'from-blue-600 to-blue-700',
      description: `${players.length} cadastrados`
    },
    {
      id: 'teams',
      icon: Shuffle,
      label: 'Sortear Times',
      bgColor: 'from-green-600 to-green-700',
      description: `${settings?.numberOfTeams || 4} times`
    },
    {
      id: 'matches',
      icon: Trophy,
      label: 'Partidas',
      bgColor: 'from-purple-600 to-purple-700',
      description: `${filteredMatches.filter(m => m.played).length}/${filteredMatches.length} jogos`
    },
    {
      id: 'standings',
      icon: BarChart3,
      label: 'Classificação',
      bgColor: 'from-orange-600 to-orange-700',
      description: 'Tabela'
    },
    {
      id: 'scorers',
      icon: Target,
      label: 'Artilheiros',
      bgColor: 'from-red-600 to-red-700',
      description: 'Gols'
    },
    {
      id: 'colete',
      icon: ShirtIcon,
      label: coleteWinner ? `Colete: ${coleteWinner}` : 'Lavar Colete',
      bgColor: coleteWinner ? 'from-yellow-600 to-yellow-700' : 'from-gray-600 to-gray-700',
      description: coleteWinner ? 'Definido' : 'Pendente'
    }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden pb-24">
      <div className="fixed top-0 left-0 right-0 z-[9999] w-full bg-gray-900/95 backdrop-blur-md border-b border-gray-700 shadow-lg">
        <div className="px-4 py-3 flex items-center justify-between h-16" style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>
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

      <div className="px-4 pb-4" style={{ paddingTop: 'max(80px, calc(64px + env(safe-area-inset-top)))' }}>
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

        <h2 className="text-base font-semibold text-white mb-3">Menu Principal</h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`bg-gradient-to-br ${item.bgColor} p-4 rounded-xl text-white transition-all hover:scale-105 active:scale-95 shadow-lg`}
            >
              <item.icon size={28} className="mb-2" />
              <h3 className="font-semibold text-sm mb-1">{item.label}</h3>
              <p className="text-xs opacity-90">{item.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameMenuScreen;
