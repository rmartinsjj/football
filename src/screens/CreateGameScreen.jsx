import React, { useState, useEffect } from 'react';
import { Calendar, Trophy, Users, Play, ArrowLeft, Check } from 'lucide-react';
import { gameDayService } from '../services/gameDayService';

const CreateGameScreen = ({ onGameCreated, onBack }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [tournamentType, setTournamentType] = useState('championship');
  const [selectedTeams, setSelectedTeams] = useState(['Vermelho', 'Azul', 'Brasil', 'Verde Branco']);
  const [isCreating, setIsCreating] = useState(false);
  const [existingGames, setExistingGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const allTeams = ['Vermelho', 'Azul', 'Brasil', 'Verde Branco'];

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

      if (onGameCreated) {
        onGameCreated(gameDay);
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
      if (onGameCreated) {
        onGameCreated(game);
      }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black pb-24">
      {onBack && (
        <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-700 p-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Voltar</span>
          </button>
        </div>
      )}

      <div className="px-4 py-6">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-4">
            <Trophy size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Criar Jogo do Dia</h1>
          <p className="text-gray-400">Configure o torneio e comece a jogar</p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-700">
          <h3 className="text-white font-bold mb-4 flex items-center">
            <Calendar size={20} className="mr-2 text-green-500" />
            Selecione a Data
          </h3>

          <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
            {weekDates.map(date => {
              const isSelected = date === selectedDate;
              const isToday = date === new Date().toISOString().split('T')[0];
              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-green-600 text-white shadow-lg scale-105'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  <span className="text-xs font-medium mb-1">{getDayOfWeek(date)}</span>
                  <span className="text-xl font-bold">{new Date(date + 'T00:00:00').getDate()}</span>
                  {isToday && (
                    <span className="text-[10px] mt-1 opacity-75">Hoje</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-400 bg-gray-700 p-3 rounded-lg">
            <Calendar size={16} />
            <span>Data selecionada: {formatDate(selectedDate)}</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-700">
          <h3 className="text-white font-bold mb-4 flex items-center">
            <Trophy size={20} className="mr-2 text-green-500" />
            Tipo de Torneio
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTournamentType('championship')}
              className={`p-4 rounded-xl transition-all ${
                tournamentType === 'championship'
                  ? 'bg-green-600 text-white shadow-lg scale-105'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Trophy size={24} className="mx-auto mb-2" />
              <div className="text-sm font-bold">Campeonato</div>
              <div className="text-xs opacity-75 mt-1">Pontos corridos</div>
            </button>

            <button
              onClick={() => setTournamentType('winner-stays')}
              className={`p-4 rounded-xl transition-all ${
                tournamentType === 'winner-stays'
                  ? 'bg-purple-600 text-white shadow-lg scale-105'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Play size={24} className="mx-auto mb-2" />
              <div className="text-sm font-bold">Quem Ganha Fica</div>
              <div className="text-xs opacity-75 mt-1">Desafios</div>
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-700">
          <h3 className="text-white font-bold mb-4 flex items-center">
            <Users size={20} className="mr-2 text-green-500" />
            Selecione os Times ({selectedTeams.length}/4)
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {allTeams.map(team => {
              const isSelected = selectedTeams.includes(team);
              const teamColors = {
                'Vermelho': 'from-red-600 to-red-700',
                'Azul': 'from-blue-600 to-blue-700',
                'Brasil': 'from-yellow-500 to-yellow-600',
                'Verde Branco': 'from-green-600 to-green-700'
              };

              return (
                <button
                  key={team}
                  onClick={() => toggleTeam(team)}
                  className={`relative p-4 rounded-xl transition-all ${
                    isSelected
                      ? `bg-gradient-to-br ${teamColors[team]} text-white shadow-lg scale-105`
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <Check size={20} className="text-white" />
                    </div>
                  )}
                  <Users size={24} className="mx-auto mb-2" />
                  <div className="text-sm font-bold">{team}</div>
                </button>
              );
            })}
          </div>

          {selectedTeams.length < 2 && (
            <div className="mt-3 text-xs text-yellow-500 bg-yellow-500 bg-opacity-10 p-3 rounded-lg text-center">
              Selecione pelo menos 2 times para criar o jogo
            </div>
          )}
        </div>

        <button
          onClick={handleCreateGame}
          disabled={isCreating || selectedTeams.length < 2}
          className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white py-4 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
        >
          {isCreating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Criando jogo...</span>
            </>
          ) : (
            <>
              <Play size={24} />
              <span>Criar e Começar Jogo</span>
            </>
          )}
        </button>

        {!loading && existingGames.length > 0 && (
          <div className="mt-8">
            <h3 className="text-white font-bold mb-4 flex items-center">
              <Calendar size={20} className="mr-2 text-green-500" />
              Jogos Anteriores
            </h3>

            <div className="space-y-3">
              {existingGames.slice(0, 5).map(game => (
                <button
                  key={game.id}
                  onClick={() => handleSelectExistingGame(game)}
                  className="w-full bg-gray-800 border border-gray-700 hover:border-green-500 rounded-xl p-4 transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          game.tournament_type === 'championship'
                            ? 'bg-green-600 text-white'
                            : 'bg-purple-600 text-white'
                        }`}>
                          {game.tournament_type === 'championship' ? 'Campeonato' : 'Quem Ganha Fica'}
                        </span>
                        {game.is_active && (
                          <span className="px-2 py-1 rounded text-xs font-bold bg-yellow-600 text-white">
                            ATIVO
                          </span>
                        )}
                      </div>
                      <div className="text-white font-medium">
                        {formatDate(game.game_date)}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {game.active_teams?.length || 0} times
                      </div>
                    </div>
                    <div className="text-gray-400">
                      <ArrowLeft size={20} className="rotate-180" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateGameScreen;
