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
          borderBottom: `1px solid ${alpha('#000', 0.05)}`, // Borda sutil embaixo
          backgroundColor: alpha('#ffffff', 0.7), // Branco Translúcido (70%)
          borderColor: alpha('#ffffff', 0.3),
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', height: 80 }}>
          {/* 1. Logo */}
          <Box display="flex" alignItems="center" gap={1}>
            <Box component="img" src="/logo-placeholder.png" sx={{ width: 40, height: 40, borderRadius: '50%' }} alt="Logo" />
            <Box sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#1E293B' }}>
              ASPPIBRA-DAO
            </Box>
          </Box>

          {/* 2. Menu Links (Centralizados) */}
          <Stack direction="row" spacing={4} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <NavLink to="/ecosystem">Ecosystem</NavLink>
            <NavLink to="/community">Community</NavLink>
            <NavLink to="/team">Team</NavLink>
            <NavLink to="/roadmap">Roadmap</NavLink>
            <NavLink to="/faq">FAQ</NavLink>
          </Stack>

          {/* 3. Ação */}
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/login"
            sx={{ 
              px: 4, 
              borderRadius: '8px', 
              boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)' // Glow azul moderno
            }}
          >
            ENTRAR
          </Button>
        </Toolbar>
      </Paper>
    </AppBar>
  );
}