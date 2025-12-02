// src/theme/components.ts
import { Components, Theme, alpha } from '@mui/material/styles';

// Nota: A tipagem agora vive em './types.ts', não precisamos declarar aqui.

const components: Components<Theme> = {
  MuiContainer: {
    styleOverrides: {
      root: {
        '@media (min-width: 0px)': {
          paddingLeft: '16px',
          paddingRight: '16px',
        },
        '@media (min-width: 768px)': {
          paddingLeft: '24px',
          paddingRight: '24px',
        },
      },
    },
  },
  MuiPaper: {
    variants: [
      {
        props: { variant: 'glass' },
        style: {
          backgroundColor: alpha('#ffffff', 0.6),
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          border: `1px solid ${alpha('#ffffff', 0.3)}`,
          transition: 'all 0.3s ease-in-out',
        },
      },
    ],
  },
};

export default components;