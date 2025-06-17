import React, { useState } from 'react';
import { ArrowLeft, Menu, X, Home, Users, Shuffle, Target, Trophy, BarChart3, Settings } from 'lucide-react';

const Header = ({ title, showBack = false, onBack, setCurrentScreen }) => {
  const [showMenu, setShowMenu] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Início', icon: Home, screen: 'home' },
    { id: 'players', label: 'Jogadores', icon: Users, screen: 'players' },
    { id: 'teams', label: 'Times', icon: Shuffle, screen: 'teams' },
    { id: 'matches', label: 'Jogos', icon: Target, screen: 'matches' },
    { id: 'standings', label: 'Classificação', icon: Trophy, screen: 'standings' },
    { id: 'scorers', label: 'Artilheiros', icon: BarChart3, screen: 'scorers' },
    { id: 'colete', label: 'Sorteio do Colete', icon: () => <span className="text-lg">🧽</span>, screen: 'colete' },
    { id: 'settings', label: 'Configurações', icon: Settings, screen: 'settings' },
  ];

  const handleMenuItemClick = (screen) => {
    setCurrentScreen(screen);
    setShowMenu(false);
  };

  return (
    <>
      {/* Header with consistent height */}
      <div className="dark-card shadow-sm border-b border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-10 h-16">
        <div className="flex items-center space-x-3">
          {showBack && (
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors active:bg-gray-600"
            >
              <ArrowLeft size={22} className="text-gray-300" />
            </button>
          )}
          <h1 className="text-lg font-bold text-white truncate">{title}</h1>
        </div>
        
        {setCurrentScreen && (
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors active:bg-gray-600"
          >
            {showMenu ? (
              <X size={22} className="text-gray-300" />
            ) : (
              <Menu size={22} className="text-gray-300" />
            )}
          </button>
        )}
      </div>

      {/* Menu Overlay */}
      {showMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-gray-900 w-80 max-w-[90vw] h-full shadow-xl">
            {/* Menu Header */}
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img 
                  src="/logoespaco.png" 
                  alt="Espaço Novo Tempo" 
                  className="h-8 w-auto object-contain"
                />
                <div>
                  <h2 className="text-white font-bold text-lg">Menu</h2>
                  <p className="text-gray-400 text-sm">Navegação</p>
                </div>
              </div>
              <button
                onClick={() => setShowMenu(false)}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-300" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-4">
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuItemClick(item.screen)}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-colors text-left"
                    >
                      <div className="w-8 h-8 flex items-center justify-center">
                        {typeof IconComponent === 'function' && item.id === 'colete' ? (
                          <IconComponent />
                        ) : (
                          <IconComponent size={20} className="text-gray-300" />
                        )}
                      </div>
                      <span className="text-white font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Menu Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Espaço Novo Tempo</p>
                <p className="text-gray-500 text-xs">Praia da Costa - Vila Velha</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;