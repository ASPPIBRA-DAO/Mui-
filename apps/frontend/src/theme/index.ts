// src/theme/index.ts
import { createTheme } from '@mui/material/styles';
import './types'; // Importante: Carrega as definições de tipo (variant: glass)

import breakpoints from './breakpoints';
import palette from './palette';
import typography from './typography';
import components from './components';
import shape from './shape';
import shadows from './shadows';

const theme = createTheme({
  breakpoints,
  palette,
  typography,
  components,
  shape,
  shadows,
});

export default theme;