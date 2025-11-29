import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Importações do Material UI v7
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// 1. Configuração do Tema (Cores, fontes, etc)
const theme = createTheme({
  palette: {
    mode: 'light', // ou 'dark'
    primary: {
      main: '#1976d2', // Azul padrão MUI
    },
    secondary: {
      main: '#dc004e', // Rosa padrão
    },
    background: {
      default: '#f4f6f8', // Cor de fundo suave para a aplicação inteira
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 2. Provider do Tema envolve toda a aplicação */}
    <ThemeProvider theme={theme}>
      {/* 3. CssBaseline reseta o CSS do navegador (margens, box-sizing) */}
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);