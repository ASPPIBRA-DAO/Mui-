// src/theme/types.ts
import '@mui/material/styles';

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    glass: true;
  }
}

// Se você criar cores customizadas no futuro (ex: 'gradient'), declare aqui também.
