import { type ReactNode, useEffect, useState } from 'react';
import { ThemeContextProvider, type Theme, type ColorScheme, type ThemeProviderState } from '@/shared/hooks/use-theme';

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  defaultColorScheme?: ColorScheme;
};

const THEME_STORAGE_KEY = 'app-theme';
const COLOR_SCHEME_STORAGE_KEY = 'app-color-scheme';

export function ThemeProvider(
  {
    children,
    defaultTheme = 'light',
    defaultColorScheme = 'default'
  }: ThemeProviderProps
) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || defaultTheme
  );
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    () => (localStorage.getItem(COLOR_SCHEME_STORAGE_KEY) as ColorScheme) || defaultColorScheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');
    root.classList.remove('blue', 'orange', 'red', 'violet', 'yellow', 'green');

    root.classList.add(theme);

    if (colorScheme !== 'default') {
      root.classList.add(colorScheme);
    }
  }, [theme, colorScheme]);

  const value: ThemeProviderState = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      setTheme(newTheme);
    },
    colorScheme,
    setColorScheme: (newColorScheme: ColorScheme) => {
      localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, newColorScheme);
      setColorScheme(newColorScheme);
    }
  };

  return (
    <ThemeContextProvider value={value}>
      {children}
    </ThemeContextProvider>
  );
}
