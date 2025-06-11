import { useContext } from 'react';
import { ThemeContext } from '../../../../application/context/themeContext';
import { MoonIcon, SparklesIcon } from '@heroicons/react/20/solid';

export default function ThemeToggle() {

  const {toggleTheme, theme} = useContext(ThemeContext);
  
  return (
    <div 
      onClick={toggleTheme}
      className="navItem"
      aria-label="Toggle theme"
    >
      <h6>
        {theme === 'light' ? 'Oscuro' : 'Claro'}
      </h6>
      <span>
        {theme === 'light' && (<MoonIcon className="h-4 w-4 text-[var(--text-primary)]" />)} 
        {theme === 'dark' && (<SparklesIcon className="h-5 w-5 text-[var(--text-primary)]" />)}
      </span>
    </div>
  );
}
 