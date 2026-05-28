import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const THEME_KEY = 'app-theme';

interface ThemeContextType {
  isDark: boolean;
  toggle: () => void;
  setTheme: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggle: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem(THEME_KEY) === 'dark';
    } catch {
      return false;
    }
  });

  // Apply theme to HTML + persist
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);

    try {
      localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }, [isDark]);

  // toggle function
  const toggle = () => {
    setIsDark((prev) => !prev);
  };

  // set theme manually (IMPORTANT for DB sync)
  const setTheme = (value: boolean) => {
    setIsDark(value);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
