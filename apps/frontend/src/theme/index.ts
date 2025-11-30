
import { createTheme, alpha } from '@mui/material/styles';

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    glass: true;
  }
}

const theme = createTheme({
  palette: {
    mode: 'light', // Base clara conforme sua imagem do Header
    primary: { main: '#0066FF' }, // Azul do botão "ENTRAR"
    background: { default: '#f4f6f8' },
    text: { primary: '#1A2027', secondary: '#7E8C99' }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    button: { textTransform: 'none', fontWeight: 600 }, // Botões modernos não são ALL CAPS
  },
  components: {
    MuiPaper: {
      variants: [
        {
          props: { variant: 'glass' },
          style: {
            // Física do Vidro (Blur + Borda + Sombra)
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            border: '1px solid',
            transition: 'all 0.3s ease-in-out',
          },
        },
      ],
    },
  },
});

export default theme;
