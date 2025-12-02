import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Box, 
  Button, 
  Link as MuiLink, 
  Paper, 
  Stack, 
  Container, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import I18nSelector from './I18nSelector'; 

// Lista de Links para facilitar a manutenção (DRY)
const navItems = [
  { label: 'Ecosystem', path: '/ecosystem' },
  { label: 'Community', path: '/community' },
  { label: 'Team', path: '/team' },
  { label: 'Roadmap', path: '/roadmap' },
  { label: 'FAQ', path: '/faq' },
];

// Componente de Link para Desktop
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Conteúdo do Menu Mobile (Drawer)
  const drawerContent = (
    <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Cabeçalho do Drawer */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Links de Navegação */}
      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton 
              sx={{ textAlign: 'center', py: 2 }}
              onClick={() => {
                navigate(item.path);
                handleDrawerToggle();
              }}
            >
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ fontWeight: 'bold', fontSize: '1.1rem' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Rodapé do Drawer (Botão Entrar Mobile) */}
      <Box sx={{ p: 3, mb: 2 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => {
            navigate('/login');
            handleDrawerToggle();
          }}
          sx={{ py: 1.5, borderRadius: '8px', fontWeight: 'bold' }}
        >
          ENTRAR
        </Button>
      </Box>
    </Box>
  );

  return (
    <AppBar position="sticky" color="transparent" elevation={0} sx={{ top: 0, zIndex: 1100 }}>
      <Paper
        variant="elevation"
        elevation={0}
        sx={{
          borderRadius: 0,
          border: 'none',
          borderBottom: `1px solid ${alpha('#000', 0.05)}`,
          backgroundColor: alpha('#ffffff', 0.8),
          backdropFilter: 'blur(20px)',
          borderColor: alpha('#ffffff', 0.3),
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 80, position: 'relative' }}>
            
            {/* 1. Logo (Esquerda) */}
            <MuiLink component={RouterLink} to="/" underline="none" sx={{ zIndex: 2 }}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <Box 
                  component="img" 
                  src="/android-chrome-192x192.png" 
                  alt="ASPPIBRA Logo" 
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }} 
                />
                <Box sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#1E293B', letterSpacing: '-0.5px' }}>
                  ASPPIBRA-DAO
                </Box>
              </Box>
            </MuiLink>

            {/* 2. Menu Centralizado (Apenas Desktop) */}
            <Stack 
              direction="row" 
              spacing={4} 
              sx={{ 
                display: { xs: 'none', md: 'flex' },
                position: 'absolute', 
                left: '50%', 
                transform: 'translateX(-50%)',
                zIndex: 1
              }}
            >
              {navItems.map((item) => (
                <NavLink key={item.label} to={item.path}>
                  {item.label}
                </NavLink>
              ))}
            </Stack>

            {/* 3. Ações da Direita (I18n + Login/Hamburguer) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, zIndex: 2 }}>
              
              <I18nSelector />

              {/* Botão Login (Apenas Desktop) */}
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/login"
                sx={{ 
                  display: { xs: 'none', md: 'flex' },
                  ml: 2, 
                  px: 4, 
                  borderRadius: '8px', 
                  fontWeight: 'bold',
                  boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)'
                }}
              >
                ENTRAR
              </Button>

              {/* Botão Hambúrguer (Apenas Mobile) */}
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ display: { md: 'none' }, ml: 1 }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
            
          </Toolbar>
        </Container>
      </Paper>

      <Drawer
        anchor="right"
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, 
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawerContent}
      </Drawer>
    </AppBar>
  );
}
