// src/theme/shape.ts
import { ThemeOptions } from '@mui/material/styles';

const shape: ThemeOptions['shape'] = {
  // O padrão do MUI é 4. 
  // Se colocarmos 8, borderRadius: 1 vira 8px, borderRadius: 2 vira 16px.
  // Isso facilita manter a consistência entre botões e cards.
  borderRadius: 8, 
};

export default shape;