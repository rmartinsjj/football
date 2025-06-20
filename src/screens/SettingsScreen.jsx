import React, { useState } from 'react';
import { Clock, Users, Trophy, RotateCcw, Save, X } from 'lucide-react';
import Header from '../components/Header';
import LiveFieldViewToastMessage from '../components/LiveFieldView-ToastMessage';
import { AVAILABLE_TEAMS, TEAM_COLORS } from '../constants';

const SettingsScreen = ({ 
  settings, 
  setSettings, 
  setCurrentScreen,
  onBack 
}) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showToast, setShowToast] = useState(false);

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleSave = () => {
    setSettings(localSettings);
    showToastMessage('⚙️ Configurações salvas com sucesso!', 'success');
  };

  const handleReset = () => {
    const defaultSettings = {
      normalMatchTime: 7,
      finalMatchTime: 10,
      numberOfTeams: 4,
      activeTeams: AVAILABLE_TEAMS.slice(0, 4),
      tournamentType: 'championship',
    };
    setLocalSettings(defaultSettings);
    showToastMessage('🔄 Configurações restauradas para o padrão', 'info');
  };

  const addTeam = (teamName) => {
    if (!localSettings.activeTeams.includes(teamName)) {
      const newActiveTeams = [...localSettings.activeTeams, teamName];
      setLocalSettings(prev => ({
        ...prev,
        activeTeams: newActiveTeams,
        numberOfTeams: newActiveTeams.length
      }));
    }
  };

  const removeTeam = (teamName) => {
    if (localSettings.activeTeams.length > 2) { // Minimum 2 teams
      const newActiveTeams = localSettings.activeTeams.filter(team => team !== teamName);
      setLocalSettings(prev => ({
        ...prev,
        activeTeams: newActiveTeams,
        numberOfTeams: newActiveTeams.length
      }));
    } else {
      showToastMessage('⚠️ Mínimo de 2 times necessário!', 'error');
    }
  };

  const availableTeamsToAdd = AVAILABLE_TEAMS.filter(team => !localSettings.activeTeams.includes(team));

  return (
    <div className="min-h-screen overflow-x-hidden pb-24">
      <Header title="Configurações" showBack={true} onBack={onBack} setCurrentScreen={setCurrentScreen} />
      
      {/* Toast Message */}
      <LiveFieldViewToastMessage
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      
      {/* Content with proper top padding to account for fixed header */}
      <div className="pt-20 p-6">
        {/* Tempo das Partidas */}
        <div className="dark-card rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Clock className="text-white" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white">Tempo das Partidas</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Partidas Normais (minutos):
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={localSettings.normalMatchTime}
                  onChange={(e) => setLocalSettings(prev => ({
                    ...prev,
                    normalMatchTime: parseInt(e.target.value) || 7
                  }))}
                  className="w-20 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-gray-400 text-sm">minutos</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Final e 3º Lugar (minutos):
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={localSettings.finalMatchTime}
                  onChange={(e) => setLocalSettings(prev => ({
                    ...prev,
                    finalMatchTime: parseInt(e.target.value) || 10
                  }))}
                  className="w-20 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-gray-400 text-sm">minutos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Configurações do Torneio */}
        <div className="dark-card rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Trophy className="text-white" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white">Formato do Torneio</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Tipo de Torneio:
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
                  <input
                    type="radio"
                    name="tournamentType"
                    value="championship"
                    checked={localSettings.tournamentType === 'championship'}
                    onChange={(e) => setLocalSettings(prev => ({
                      ...prev,
                      tournamentType: e.target.value
                    }))}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-white font-medium">🏆 Campeonato</div>
                    <div className="text-gray-400 text-sm">Todos jogam contra todos + playoffs</div>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
                  <input
                    type="radio"
                    name="tournamentType"
                    value="winner-stays"
                    checked={localSettings.tournamentType === 'winner-stays'}
                    onChange={(e) => setLocalSettings(prev => ({
                      ...prev,
                      tournamentType: e.target.value
                    }))}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-white font-medium">⚡ Quem Ganha Fica</div>
                    <div className="text-gray-400 text-sm">Time vencedor permanece, empate = desafiante vira vencedor</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Times Ativos */}
        <div className="dark-card rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Users className="text-white" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">Times do Torneio</h3>
              <p className="text-sm text-gray-400">{localSettings.activeTeams.length} times selecionados</p>
            </div>
          </div>
          
          {/* Times como Tags Minimalistas */}
          <div className="flex flex-wrap gap-1.5">
            {AVAILABLE_TEAMS.map((teamName) => {
              const isActive = localSettings.activeTeams.includes(teamName);
              return (
                <button
                  key={teamName}
                  onClick={() => isActive ? removeTeam(teamName) : addTeam(teamName)}
                  disabled={isActive && localSettings.activeTeams.length <= 2}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? `bg-gray-800 ${TEAM_COLORS[teamName].text} border ${
                          teamName === 'Vermelho' ? 'border-red-500' :
                          teamName === 'Azul' ? 'border-blue-500' :
                          teamName === 'Brasil' ? 'border-yellow-500' :
                          'border-green-500'
                        } hover:bg-gray-700 active:scale-95`
                      : 'bg-gray-800 text-gray-500 border border-gray-600 hover:border-gray-500 hover:text-gray-400'
                  } ${isActive && localSettings.activeTeams.length <= 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={isActive ? 'Clique para remover' : 'Clique para adicionar'}
                >
                  <div className={`w-2 h-2 rounded-full ${
                    isActive ? (
                      teamName === 'Vermelho' ? 'bg-red-500' :
                      teamName === 'Azul' ? 'bg-blue-500' :
                      teamName === 'Brasil' ? 'bg-yellow-500' :
                      'bg-green-500'
                    ) : 'bg-gray-600'
                  }`}></div>
                  <span>{teamName}</span>
                  {isActive && localSettings.activeTeams.length > 2 && (
                    <X size={10} className="opacity-60" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="dark-card rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Trophy className="text-white" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white">Sobre o Formato</h3>
          </div>
          
          <div className="space-y-3 text-sm text-gray-300">
            {localSettings.tournamentType === 'championship' ? (
              <>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Fase de grupos: todos jogam contra todos</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Playoffs: 1º vs 2º (Final) e 3º vs 4º (3º lugar)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Sistema de pontuação: 3 pontos por vitória, 1 por empate</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Time vencedor permanece em campo</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Em caso de empate: desafiante se torna o novo vencedor</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Próximos desafios são gerados automaticamente</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4 max-w-sm mx-auto">
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-2xl font-medium flex items-center justify-center space-x-2 transition-all duration-200 active:scale-95 shadow-lg"
            >
              <Save size={20} />
              <span>Salvar Configurações</span>
            </button>
            
            <button
              onClick={handleReset}
              className="bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-2xl transition-colors shadow-lg"
              title="Restaurar Padrão"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        {/* Espaçamento para o botão fixo - versão desktop/fallback */}
        <div className="flex space-x-3 opacity-0 pointer-events-none">
          <button
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-2xl font-medium flex items-center justify-center space-x-2 transition-all duration-200 active:scale-95"
          >
            <Save size={20} />
            <span>Salvar Configurações</span>
          </button>
          
          <button
            className="bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-2xl transition-colors"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;