import type { ThemeOptions } from '@mui/material/styles';

// Em vez de importar TypographyOptions diretamente, extraímos ele de ThemeOptions
const typography: ThemeOptions['typography'] = {
  fontFamily: '"Inter", "Roboto", sans-serif',
  button: { textTransform: 'none', fontWeight: 600 },
};

export default typography;