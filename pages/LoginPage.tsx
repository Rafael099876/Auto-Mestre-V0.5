import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { AppLogo } from '../components/common/Icons';
import { useLanguage } from '../context/LanguageContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login({ email, password, username: '' });
    if (success) {
      navigate('/dashboard');
    } else {
      setError(t('loginError'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-light-card dark:bg-dark-card rounded-xl shadow-2xl p-8 border border-light-border dark:border-dark-border">
        <div className="text-center mb-8">
            <AppLogo className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">{t('loginTitle')}</h1>
            <p className="text-gray-500 dark:text-gray-400">{t('loginSubtitle')}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('emailLabel')}
            required
            className="w-full px-4 py-3 bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={t('emailLabel')}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('passwordLabel')}
            required
            className="w-full px-4 py-3 bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={t('passwordLabel')}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover transition-all duration-300 transform hover:scale-105"
          >
            {t('loginButton')}
          </button>
        </form>
         <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            {t('signupPrompt')}{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">
                {t('signUpLink')}
            </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;