
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type Theme = 'light' | 'dark';
export type ColorScheme = 'blue' | 'emerald' | 'purple' | 'orange';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const colors: Record<ColorScheme, { primary: string; hover: string }> = {
  blue: { primary: '#3B82F6', hover: '#2563EB' },
  emerald: { primary: '#10B981', hover: '#059669' },
  purple: { primary: '#8B5CF6', hover: '#7C3AED' },
  orange: { primary: '#F97316', hover: '#EA580C' },
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'light';
  });

  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    const savedScheme = localStorage.getItem('colorScheme') as ColorScheme;
    return savedScheme || 'blue';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    const { primary, hover } = colors[colorScheme];
    root.style.setProperty('--color-primary', primary);
    root.style.setProperty('--color-primary-hover', hover);
    localStorage.setItem('colorScheme', colorScheme);
  }, [colorScheme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colorScheme, setColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};