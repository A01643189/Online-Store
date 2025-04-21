import { useEffect, useState } from 'react';

const themes = ['light', 'dark', 'custom'] as const;
type Theme = typeof themes[number];

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialTheme = savedTheme ?? (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme === 'light' ? '' : initialTheme);
  }, []);

  const cycleTheme = () => {
    const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme === 'light' ? '' : nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return '🌙 Dark Mode';
      case 'dark':
        return '🪄 Custom Mode';
      case 'custom':
        return '☀ Light Mode';
    }
  };

  return (
    <button className="dark-mode-toggle" onClick={cycleTheme}>
      {getLabel()}
    </button>
  );
};
