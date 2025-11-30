// src/theme/index.ts
import { PaletteMode } from '@mui/material';
import { createTheme } from '@mui/material/styles';

// --- Cores da Marca (Baseada no Logo Royal DAO) ---
const brandColors = {
  blue: {
    main: '#004E92',  // Azul Esfera (Royal Blue)
    dark: '#002A5C',  // Azul Noturno
    light: '#3378AF', // Azul Claro
  },
  gold: {
    main: '#D4AF37',  // Dourado Metálico
    dark: '#997B1A',  // Bronze
    light: '#F4C430', // Amarelo Açafrão
  },
  darkBg: '#020b1c',   // Fundo Dark Mode (Azul quase preto)
  lightBg: '#F5F7FA',  // Fundo Light Mode (Cinza gelo)
};

// --- Lógica de Design (Tokens) ---
export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // === MODO CLARO ===
          primary: { main: brandColors.blue.main, contrastText: '#ffffff' },
          secondary: { main: brandColors.gold.main, contrastText: '#1A233A' },
          background: { default: brandColors.lightBg, paper: '#FFFFFF' },
          text: { primary: '#1A233A', secondary: '#58687E' },
        }
      : {
          // === MODO ESCURO ===
          primary: { main: brandColors.blue.light, contrastText: '#ffffff' },
          secondary: { main: brandColors.gold.main, contrastText: '#000000' },
          background: { default: brandColors.darkBg, paper: '#051126' },
          text: { primary: '#E2E8F0', secondary: '#94A3B8' },
        }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    button: { textTransform: 'none' as const, fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: '50px' }, // Botões arredondados
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? '#FFFFFF' : brandColors.darkBg,
          backgroundImage: 'none',
        },
      },
    },
  },
});

// Helper para criar o tema
export const createAppTheme = (mode: PaletteMode) => createTheme(getDesignTokens(mode));