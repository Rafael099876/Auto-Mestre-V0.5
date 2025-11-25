import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme, ColorScheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { SunIcon, MoonIcon, LogoutIcon, CalendarIcon, AppLogo, SettingsIcon } from './common/Icons';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { theme, toggleTheme, colorScheme, setColorScheme } = useTheme();
  const { logout, user } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const configRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (configRef.current && !configRef.current.contains(event.target as Node)) {
        setIsConfigOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const colorOptions: { id: ColorScheme, color: string }[] = [
      { id: 'blue', color: '#3B82F6' },
      { id: 'emerald', color: '#10B981' },
      { id: 'purple', color: '#8B5CF6' },
      { id: 'orange', color: '#F97316' }
  ];

  return (
    <header className="bg-light-card dark:bg-dark-card shadow-md sticky top-0 z-10 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <AppLogo className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">{t('welcomeMessage', { username: user?.username || '' })}</span>
            
            <Link to="/agenda" className="p-2 rounded-full hover:bg-light-bg dark:hover:bg-dark-bg transition-colors" aria-label="View Agenda">
                <CalendarIcon className="w-6 h-6 text-light-text dark:text-dark-text" />
            </Link>

            <div className="relative" ref={configRef}>
                <button 
                    onClick={() => setIsConfigOpen(!isConfigOpen)}
                    className="p-2 rounded-full hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
                    aria-label="Settings"
                >
                    <SettingsIcon className="w-6 h-6 text-light-text dark:text-dark-text" />
                </button>

                {isConfigOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-light-card dark:bg-dark-card rounded-xl shadow-2xl border border-light-border dark:border-dark-border overflow-hidden animate-fadeIn z-50">
                        <div className="p-4 border-b border-light-border dark:border-dark-border">
                            <h3 className="font-semibold text-light-text dark:text-dark-text">{t('settingsTitle')}</h3>
                        </div>
                        
                        <div className="p-4 space-y-4">
                            {/* Theme Switch */}
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-300">{t('themeLabel')}</span>
                                <button onClick={toggleTheme} className="p-1 rounded-full bg-light-bg dark:bg-gray-700 transition-colors">
                                    {theme === 'dark' ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <MoonIcon className="w-5 h-5 text-gray-700" />}
                                </button>
                            </div>

                            {/* Language Switch */}
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-300">{t('languageLabel')}</span>
                                <div className="flex border border-light-border dark:border-dark-border rounded-md overflow-hidden">
                                    <button 
                                        onClick={() => setLanguage('en')}
                                        className={`px-2 py-1 text-xs font-semibold transition-colors ${language === 'en' ? 'bg-primary text-white' : 'text-gray-500 dark:text-gray-400 bg-light-bg dark:bg-dark-bg'}`}
                                    >
                                        EN
                                    </button>
                                    <button 
                                        onClick={() => setLanguage('pt-BR')}
                                        className={`px-2 py-1 text-xs font-semibold transition-colors ${language === 'pt-BR' ? 'bg-primary text-white' : 'text-gray-500 dark:text-gray-400 bg-light-bg dark:bg-dark-bg'}`}
                                    >
                                        PT
                                    </button>
                                </div>
                            </div>

                             {/* Color Scheme */}
                             <div className="space-y-2">
                                <span className="text-sm text-gray-600 dark:text-gray-300 block">{t('colorSchemeLabel')}</span>
                                <div className="flex gap-2">
                                    {colorOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => setColorScheme(option.id)}
                                            className={`w-6 h-6 rounded-full transition-transform hover:scale-110 focus:outline-none ring-2 ring-offset-2 dark:ring-offset-dark-card ${colorScheme === option.id ? 'ring-gray-400 dark:ring-gray-500' : 'ring-transparent'}`}
                                            style={{ backgroundColor: option.color }}
                                            aria-label={option.id}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Logout */}
                            <button 
                                onClick={handleLogout} 
                                className="w-full mt-2 flex items-center justify-center gap-2 p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
                            >
                                <LogoutIcon className="w-4 h-4" />
                                {t('logoutButton')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;