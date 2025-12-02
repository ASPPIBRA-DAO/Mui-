// src/theme/shadows.ts
import { Shadows } from '@mui/material/styles';
import createTheme from '@mui/material/styles/createTheme';

// Pega as sombras padrão para não precisar reescrever todas
const defaultTheme = createTheme();
const shadows: Shadows = [...defaultTheme.shadows] as Shadows;

// Exemplo: Customizar a sombra 1 para ser azulada (comum em Web3)
// shadows[1] = '0px 2px 1px -1px rgba(0, 102, 255, 0.2), 0px 1px 1px 0px rgba(0, 102, 255, 0.14), 0px 1px 3px 0px rgba(0, 102, 255, 0.12)';

export default shadows;