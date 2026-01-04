import { type ReactNode, useEffect, useState } from 'react';
import { ThemeContextProvider, type Theme, type ThemeProviderState } from '@/shared/hooks/use-theme';

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export function ThemeProvider(
  {
    children,
    defaultTheme = 'light',
    storageKey = 'vite-ui-theme'
  }: ThemeProviderProps
) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    root.classList.add(theme);
  }, [theme]);

  const value: ThemeProviderState = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    }
  };

  return (
    <ThemeContextProvider value={value}>
      {children}
    </ThemeContextProvider>
  );
}
