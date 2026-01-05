import { createContext, useContext } from 'react';

export type Theme = 'light' | 'dark';
export type ColorScheme = 'default' | 'blue' | 'orange' | 'red' | 'violet' | 'yellow' | 'green';

export type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorScheme: ColorScheme;
  setColorScheme: (colorScheme: ColorScheme) => void;
};

const ThemeContext = createContext<ThemeProviderState | undefined>(undefined);

export const ThemeContextProvider = ThemeContext.Provider;

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
