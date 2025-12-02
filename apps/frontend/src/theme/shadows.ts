import { createTheme, type Shadows } from '@mui/material/styles';

const defaultTheme = createTheme();
const shadows: Shadows = [...defaultTheme.shadows] as Shadows;

export default shadows;