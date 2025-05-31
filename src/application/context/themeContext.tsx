import { useState, useEffect } from 'react';
import { createContext } from 'react';
import { applyTheme, getCurrentTheme, Theme } from '../../ui/components/layoutComponents/themeUtils';

interface ThemeContextProps {
  theme: 'light' | 'dark' | 'system';
  setTheme?: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps>(null!)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
   const [theme, setTheme] = useState<Theme>(getCurrentTheme());
  
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);
  
  // Inicializa al tener un valor guardado o usar uno predeterminado al cargar
  useEffect(() => {
    // Si el tema guardado era 'system', cambiamos a 'light' como predeterminado
    if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(systemPrefersDark ? 'dark' : 'light');
    }
  }, []);
  
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
  };


