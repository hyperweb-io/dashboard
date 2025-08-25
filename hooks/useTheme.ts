'use client';

import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Check for saved theme preference or default to light
    const savedTheme = (localStorage.getItem('theme') || 'light') as Theme;
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    // Listen for theme changes (from storage events or direct localStorage changes)
    const handleThemeChange = () => {
      const newTheme = (localStorage.getItem('theme') || 'light') as Theme;
      setTheme(newTheme);
    };

    // Listen for storage events (changes from other tabs/windows)
    window.addEventListener('storage', handleThemeChange);

    // Listen for custom theme change events (changes from same tab)
    window.addEventListener('theme-change', handleThemeChange);

    return () => {
      window.removeEventListener('storage', handleThemeChange);
      window.removeEventListener('theme-change', handleThemeChange);
    };
  }, []);

  return theme;
}
