import { createTheme, alpha } from '@mui/material/styles';

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    glass: true;
  }
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0066FF' },
    background: { default: '#f4f6f8' },
    text: { primary: '#1A2027', secondary: '#7E8C99' }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      variants: [
        {
          props: { variant: 'glass' },
          style: {
            // AQUI ESTÁ A CORREÇÃO: Usando 'alpha' para definir o fundo e a borda
            backgroundColor: alpha('#ffffff', 0.6), // Fundo branco 60% opaco
            
            // Física do Vidro
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            
            // Borda sutil e translúcida (melhor que solid puro)
            border: `1px solid ${alpha('#ffffff', 0.3)}`, 
            
            transition: 'all 0.3s ease-in-out',
          },
        },
      ],
    },
  },
});

export default theme;