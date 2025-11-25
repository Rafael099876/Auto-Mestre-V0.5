import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { SunIcon, MoonIcon, LogoutIcon, CalendarIcon, AppLogo } from './common/Icons';

interface HeaderProps {
    title: string;
}

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex items-center border border-light-border dark:border-dark-border rounded-full">
            <button 
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${language === 'en' ? 'bg-primary text-white' : 'text-gray-500 dark:text-gray-400'}`}
                aria-pressed={language === 'en'}
            >
                EN
            </button>
            <button 
                onClick={() => setLanguage('pt-BR')}
                className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${language === 'pt-BR' ? 'bg-primary text-white' : 'text-gray-500 dark:text-gray-400'}`}
                aria-pressed={language === 'pt-BR'}
            >
                PT
            </button>
        </div>
    );
};


const Header: React.FC<HeaderProps> = ({ title }) => {
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-light-card dark:bg-dark-card shadow-md sticky top-0 z-10 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <AppLogo className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">{t('welcomeMessage', { username: user?.username || '' })}</span>
            <LanguageSwitcher />
            <Link to="/agenda" className="p-2 rounded-full hover:bg-light-bg dark:hover:bg-dark-bg transition-colors" aria-label="View Agenda">
                <CalendarIcon className="w-6 h-6 text-light-text dark:text-dark-text" />
            </Link>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-light-bg dark:hover:bg-dark-bg transition-colors" aria-label="Toggle theme">
            {theme === 'dark' ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-gray-700" />}
            </button>
            <button onClick={handleLogout} className="p-2 rounded-full hover:bg-light-bg dark:hover:bg-dark-bg transition-colors" aria-label="Logout">
                <LogoutIcon className="w-6 h-6 text-red-500" />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;