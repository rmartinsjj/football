import React, { useState, useEffect } from 'react';
import { Calendar, Play, Check, Settings, Trash2, X } from 'lucide-react';
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
  const [selectedTeams, setSelectedTeams] = useState(['Flamengo', 'Cruzeiro', 'Corinthians', 'Palmeiras']);
  const [isCreating, setIsCreating] = useState(false);
  const [existingGames, setExistingGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const allTeams = ['Flamengo', 'Cruzeiro', 'Corinthians', 'Palmeiras'];
  const activeTeams = settings?.activeTeams || ['Flamengo', 'Cruzeiro', 'Corinthians', 'Palmeiras'];

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

  const handleDeleteGame = async () => {
    if (deleteConfirmText !== 'DELETAR') {
      alert('Digite "DELETAR" para confirmar');
      return;
    }

    setIsDeleting(true);
    try {
      await gameDayService.deleteGameDay(deleteConfirmModal.id);
      await loadExistingGames();
      setDeleteConfirmModal(null);
      setDeleteConfirmText('');

      if (currentGameDay?.id === deleteConfirmModal.id) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting game:', error);
      alert('Erro ao deletar jogo: ' + error.message);
    } finally {
      setIsDeleting(false);
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
      <div className="fixed top-0 left-0 right-0 z-[9999] w-full bg-gray-900/95 backdrop-blur-md border-b border-gray-700 shadow-lg" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="px-4 py-3 flex items-center justify-between min-h-[64px]">
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
                    'Flamengo': 'bg-red-600',
                    'Cruzeiro': 'bg-blue-600',
                    'Corinthians': 'bg-black',
                    'Palmeiras': 'bg-green-600'
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
                <div key={game.id} className="relative">
                  <button
                    onClick={() => handleSelectExistingGame(game)}
                    className="w-full dark-card hover:bg-gray-700 rounded-lg p-3 transition-all text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
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
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmModal(game);
                            setDeleteConfirmText('');
                          }}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500 hover:bg-opacity-10 rounded-lg transition-all"
                          title="Deletar jogo"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="text-gray-400">
                          <Play size={16} />
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
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

      {deleteConfirmModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm px-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full shadow-2xl border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-red-400">⚠️ Confirmar Exclusão</h3>
              <button
                onClick={() => {
                  setDeleteConfirmModal(null);
                  setDeleteConfirmText('');
                }}
                className="p-1 hover:bg-gray-700 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-white text-sm mb-2">Você está prestes a deletar o jogo:</p>
              <div className="bg-gray-700 rounded-lg p-3 mb-3">
                <div className="text-white font-medium">{formatDate(deleteConfirmModal.game_date)}</div>
                <div className="text-gray-400 text-xs">{deleteConfirmModal.active_teams?.length || 0} times</div>
              </div>
              <p className="text-red-400 text-sm font-semibold mb-4">
                ⚠️ Esta ação não pode ser desfeita! Todos os dados do jogo serão permanentemente perdidos.
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-white text-sm font-semibold mb-2">
                Digite <span className="text-red-400 font-bold">DELETAR</span> para confirmar:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETAR"
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none font-mono text-center"
                autoFocus
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setDeleteConfirmModal(null);
                  setDeleteConfirmText('');
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteGame}
                disabled={deleteConfirmText !== 'DELETAR' || isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deletando...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    <span>Deletar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameDayHomeScreen;
