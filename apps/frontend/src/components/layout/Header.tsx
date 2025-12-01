import { AppBar, Toolbar, Box, Button, Link as MuiLink, Paper, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { alpha } from '@mui/material/styles';

// Componente de Link Simples para o Menu
const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <MuiLink
    component={RouterLink}
    to={to}
    color="text.primary"
    underline="none"
    sx={{ 
      fontWeight: 500, 
      fontSize: '0.95rem',
      transition: 'color 0.2s',
      '&:hover': { color: 'primary.main' } 
    }}
  >
    {children}
  </MuiLink>
);

export default function Header() {
  return (
    <AppBar position="sticky" color="transparent" elevation={0} sx={{ top: 0, zIndex: 1100 }}>
      <Paper
        variant="glass"
        sx={{
          borderRadius: 0,
          border: 'none',
          borderBottom: `1px solid ${alpha('#000', 0.05)}`,
          backgroundColor: alpha('#ffffff', 0.7),
          borderColor: alpha('#ffffff', 0.3),
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', height: 80 }}>
          {/* 1. Logo Corrigido */}
          <MuiLink component={RouterLink} to="/" underline="none">
            <Box display="flex" alignItems="center" gap={1.5}>
              {/* CORREÇÃO AQUI: Apontando para o arquivo que existe na pasta public */}
              <Box 
                component="img" 
                src="/android-chrome-192x192.png" 
                alt="ASPPIBRA Logo" 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', // Deixa o ícone redondo
                  objectFit: 'cover'
                }} 
              />
              <Box sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#1E293B', letterSpacing: '-0.5px' }}>
                ASPPIBRA-DAO
              </Box>
            </Box>
          </MuiLink>

          {/* 2. Menu Links */}
          <Stack direction="row" spacing={4} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <NavLink to="/ecosystem">Ecosystem</NavLink>
            <NavLink to="/community">Community</NavLink>
            <NavLink to="/team">Team</NavLink>
            <NavLink to="/roadmap">Roadmap</NavLink>
            <NavLink to="/faq">FAQ</NavLink>
          </Stack>

          {/* 3. Botão de Ação */}
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/login"
            sx={{ 
              px: 4, 
              borderRadius: '8px', 
              fontWeight: 'bold',
              boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)'
            }}
          >
            ENTRAR
          </Button>
        </Toolbar>
      </Paper>
    </AppBar>
  );
}