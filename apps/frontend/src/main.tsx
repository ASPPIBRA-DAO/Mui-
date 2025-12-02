import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n'; // <--- ADICIONE ESTA LINHA EXATAMENTE AQUI

// Importações do Material UI v7
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// 1. Importação do AuthProvider (O "Cérebro" do login)
import { AuthProvider } from './context/AuthProvider';

// Configuração do Tema
const theme = createTheme({
  palette: {
    mode: 'light', 
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f4f6f8',
    },
  },
  typography: {
    fontFamily: '\"Roboto\", \"Helvetica\", \"Arial\", sans-serif',
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* O ThemeProvider fornece as cores */}
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* 2. O AuthProvider fornece a lógica de segurança para o App inteiro */}
      <AuthProvider>
        <App />
      </AuthProvider>
      
    </ThemeProvider>
  </React.StrictMode>
);