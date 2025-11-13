import React, { useState, useEffect } from 'react';
import { Calendar, Play, Check, Settings, Users, Shuffle, Trophy, Target, BarChart3 } from 'lucide-react';
import { gameDayService } from '../services/gameDayService';

const GameDayHomeScreen = ({
  onGameSelected,
  currentGameDay,
  players = [],
  matches = [],
  coleteWinner,
  settings,
  setCurrentScreen
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [tournamentType, setTournamentType] = useState('championship');
  const [selectedTeams, setSelectedTeams] = useState(['Vermelho', 'Azul', 'Brasil', 'Verde Branco']);
  const [isCreating, setIsCreating] = useState(false);
  const [existingGames, setExistingGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const allTeams = ['Vermelho', 'Azul', 'Brasil', 'Verde Branco'];
  const activeTeams = settings?.activeTeams || ['Vermelho', 'Azul', 'Brasil', 'Verde Branco'];

  useEffect(() => {
    loadExistingGames();
  }, []);


  const loadExistingGames = async () => {
    try {
      const games = await gameDayService.getAllGameDays();
      setExistingGames(games || []);
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTeam = (team) => {
    if (selectedTeams.includes(team)) {
      if (selectedTeams.length > 2) {
        setSelectedTeams(selectedTeams.filter(t => t !== team));
      }
    } else {
      setSelectedTeams([...selectedTeams, team]);
    }
  };

  const handleCreateGame = async () => {
    if (selectedTeams.length < 2) {
      alert('Selecione pelo menos 2 times!');
      return;
    }

    setIsCreating(true);
    try {
      const gameDay = await gameDayService.createGameDay(
        selectedDate,
        tournamentType,
        selectedTeams
      );

      await loadExistingGames();
      if (onGameSelected) {
        onGameSelected(gameDay);
      }
    } catch (error) {
      console.error('Error creating game:', error);
      alert('Erro ao criar jogo: ' + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelectExistingGame = async (game) => {
    try {
      await gameDayService.setActiveGameDay(game.id);
      await loadExistingGames();
      if (onGameSelected) {
        onGameSelected(game);
      }
      setCurrentScreen('menu');
    } catch (error) {
      console.error('Error selecting game:', error);
      alert('Erro ao selecionar jogo: ' + error.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days[date.getDay()];
  };

  const getWeekDates = () => {
    const today = new Date();
    const dates = [];
    for (let i = -2; i <= 2; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const filteredMatches = currentGameDay ? matches.filter(match => {
    if (match.type === 'final' || match.type === 'third_place') {
      return true;
    }
    return activeTeams.includes(match.team1) && activeTeams.includes(match.team2);
  }) : [];

  return (
    <div className="min-h-screen overflow-x-hidden pb-24">
      <div className="fixed top-0 left-0 right-0 z-[9999] w-full bg-gray-900/95 backdrop-blur-md border-b border-gray-700 shadow-lg">
        <div className="px-4 py-3 flex items-center justify-between h-16" style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>
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
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-4 rounded-xl font-semibold shadow-md transition-all flex items-center justify-center space-x-2 mb-4"
        >
          <Play size={20} />
          <span>Criar Novo Jogo</span>
        </button>

        {showCreateForm && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-white mb-3">
              {currentGameDay ? 'Criar Novo Jogo' : 'Criar Jogo do Dia'}
            </h2>

            <div className="dark-card rounded-xl p-4 shadow-sm">
              <h3 className="text-white font-semibold mb-3 flex items-center text-sm">
                <Calendar size={18} className="mr-2" />
                Data do Jogo
              </h3>

              <div className="flex space-x-2 mb-3 overflow-x-auto pb-2">
                {weekDates.map(date => {
                  const isSelected = date === selectedDate;
                  const isToday = date === new Date().toISOString().split('T')[0];
                  return (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`flex-shrink-0 flex flex-col items-center justify-center w-14 h-16 rounded-lg transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <span className="text-xs mb-1">{getDayOfWeek(date)}</span>
                      <span className="text-lg font-bold">{new Date(date + 'T00:00:00').getDate()}</span>
                      {isToday && (
                        <span className="text-[9px] mt-0.5">Hoje</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center space-x-2 text-xs text-gray-400 bg-gray-700 p-2 rounded-lg">
                <Calendar size={14} />
                <span>{formatDate(selectedDate)}</span>
              </div>
            </div>

            <div className="dark-card rounded-xl p-4 shadow-sm">
              <h3 className="text-white font-semibold mb-3 text-sm">Tipo de Torneio</h3>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTournamentType('championship')}
                  className={`p-3 rounded-lg transition-all ${
                    tournamentType === 'championship'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-xl mb-1">🏆</div>
                    <div className="text-xs font-semibold">Campeonato</div>
                  </div>
                </button>

                <button
                  onClick={() => setTournamentType('winner-stays')}
                  className={`p-3 rounded-lg transition-all ${
                    tournamentType === 'winner-stays'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-xl mb-1">⚡</div>
                    <div className="text-xs font-semibold">Quem Ganha Fica</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="dark-card rounded-xl p-4 shadow-sm">
              <h3 className="text-white font-semibold mb-3 text-sm">
                Times Participantes ({selectedTeams.length}/4)
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {allTeams.map(team => {
                  const isSelected = selectedTeams.includes(team);
                  const teamColors = {
                    'Vermelho': 'bg-red-600',
                    'Azul': 'bg-blue-600',
                    'Brasil': 'bg-yellow-500',
                    'Verde Branco': 'bg-green-600'
                  };

                  return (
                    <button
                      key={team}
                      onClick={() => toggleTeam(team)}
                      className={`relative p-3 rounded-lg transition-all ${
                        isSelected
                          ? `${teamColors[team]} text-white shadow-md`
                          : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <Check size={16} className="text-white" />
                        </div>
                      )}
                      <div className="text-center">
                        <div className="text-xs font-semibold">{team}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedTeams.length < 2 && (
                <div className="mt-3 text-xs text-yellow-400 bg-yellow-500 bg-opacity-10 p-2 rounded-lg text-center">
                  Selecione pelo menos 2 times
                </div>
              )}
            </div>

            <button
              onClick={handleCreateGame}
              disabled={isCreating || selectedTeams.length < 2}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-4 rounded-xl font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
            >
              {isCreating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Criando...</span>
                </>
              ) : (
                <>
                  <Play size={20} />
                  <span>Criar e Começar</span>
                </>
              )}
            </button>
          </div>
        )}

        {!loading && existingGames.length > 0 && (
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3 text-base">Todos os Jogos</h3>

            <div className="space-y-2">
              {existingGames.map(game => (
                <button
                  key={game.id}
                  onClick={() => handleSelectExistingGame(game)}
                  className="w-full dark-card hover:bg-gray-700 rounded-lg p-3 transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          game.tournament_type === 'championship'
                            ? 'bg-blue-600 text-white'
                            : 'bg-purple-600 text-white'
                        }`}>
                          {game.tournament_type === 'championship' ? 'Campeonato' : 'Quem Ganha Fica'}
                        </span>
                        {game.is_active && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-600 text-white">
                            ATIVO
                          </span>
                        )}
                      </div>
                      <div className="text-white font-medium text-sm">
                        {formatDate(game.game_date)}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {game.active_teams?.length || 0} times
                      </div>
                    </div>
                    <div className="text-gray-400">
                      <Play size={16} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pb-8">
          <div className="flex flex-col items-center justify-center mt-8">
            <img
              src="/IMG_9294.PNG"
              alt="Jesus Soccer"
              className="w-32 h-32 object-contain mb-4 opacity-90"
            />
            <div className="text-center text-gray-400 text-xs italic">
              <p>Mais que futebol, é comunhão</p>
              <p>e Jesus é o nosso capitão!</p>
            </div>
          </div>
        </div>
    </div>
  );
};

export default GameDayHomeScreen;
