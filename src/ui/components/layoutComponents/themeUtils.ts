export type Theme = 'light' | 'dark' | 'system';

export function getCurrentTheme(): Theme {
  const savedTheme = localStorage.getItem('theme') as Theme | null;
  
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }
  
  return 'system';
}

export function applyTheme(theme: Theme): void {
  document.documentElement.classList.remove('light-theme', 'dark-theme');
  
  if (theme === 'light') {
    document.documentElement.classList.add('light-theme');
  } else if (theme === 'dark') {
    document.documentElement.classList.add('dark-theme');
  }
  
  localStorage.setItem('theme', theme);
}

export function initTheme(): void {
  const currentTheme = getCurrentTheme();
  applyTheme(currentTheme);
}
