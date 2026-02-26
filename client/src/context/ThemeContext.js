import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

const THEME_KEY = 'shield-theme';

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored !== null) return stored === 'dark';
    return true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      root.classList.remove('light');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [dark]);

  const toggleTheme = () => setDark((d) => !d);

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme, isDark: dark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
