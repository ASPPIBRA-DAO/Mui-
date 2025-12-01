import { createContext, useState, useMemo, useContext } from 'react';
// CORREÇÃO 1: 'import type' é obrigatório para tipos no TS moderno
import type { ReactNode } from 'react'; 
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, useMediaQuery } from '@mui/material';
// CORREÇÃO 2: 'import type' para PaletteMode
import type { PaletteMode } from '@mui/material';

// CORREÇÃO 3: Importando o objeto 'default' do nosso arquivo theme.ts
import defaultTheme from '../theme'; 

interface ThemeContextData {
  toggleColorMode: () => void;
  mode: PaletteMode;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

// Renomeei para AppThemeProvider para evitar confusão com o do MUI
export function AppThemeProvider({ children }: { children: ReactNode }) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) return savedMode as PaletteMode;
    return prefersDarkMode ? 'dark' : 'light';
  });

  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  const theme = useMemo(() => {
    // CORREÇÃO 4: Recria o tema mesclando as configurações do 'glass' (defaultTheme)
    // com o modo atual (light/dark).
    return createTheme({
      ...defaultTheme, // Mantém o efeito de vidro e configurações globais
      palette: {
        ...defaultTheme.palette,
        mode, // Atualiza apenas o modo
      },
    });
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ toggleColorMode, mode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => useContext(ThemeContext);