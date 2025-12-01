import { Box, Typography, Button, Stack, Paper, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

export default function HeroSection() {
  return (
    // Container principal que centraliza tudo verticalmente e horizontalmente
    <Box
      sx={{
        // Garante que a Hero ocupe a altura da tela menos o Header, centralizando o conteúdo
        minHeight: 'calc(100vh - 80px)', // 80px é a altura do Header
        display: 'flex',
        alignItems: 'center',
        py: 8,
        position: 'relative',
        zIndex: 2, // Garante que fique acima dos blobs de fundo
      }}
    >
      <Container maxWidth="lg">
        <Paper
          variant="glass"
          sx={{
            // Estilo específico para o card da Hero (mais escuro e impactante)
            backgroundColor: alpha('#0F172A', 0.6), // Azul escuro profundo translúcido
            borderColor: alpha('#ffffff', 0.15),
            backdropFilter: 'blur(40px) saturate(150%)', // Desfoque intenso para focar no texto
            p: { xs: 4, md: 8 }, // Padding responsivo
            borderRadius: '32px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)', // Sombra forte para "flutuar"
          }}
        >
          {/* 1. Tagline Superior com Ícone */}
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} mb={4}>
            <RocketLaunchIcon sx={{ color: '#FF3366' }} />
            <Typography variant="subtitle1" sx={{ color: '#FF3366', fontWeight: 600, letterSpacing: 1 }}>
              TRANSFORMANDO NEGÓCIOS TRADICIONAIS EM ATIVOS DIGITAIS
            </Typography>
          </Stack>

          {/* 2. Headline Principal (A Ponte Definitiva...) */}
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              // Tamanho de fonte responsivo
              fontSize: { xs: '2.5rem', md: '4.5rem' },
              lineHeight: 1.1,
              mb: 4,
            }}
          >
            A Ponte Definitiva Entre o<br />
            <Box component="span" sx={{ color: '#FF3366' }}>Mundo Real</Box> e o{' '}
            <Box component="span" sx={{ color: '#FF3366' }}>Mundo Digital</Box>
          </Typography>

          {/* 3. Subtítulo Explicativo */}
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.8)',
              maxWidth: '800px',
              mx: 'auto', // Centraliza horizontalmente
              mb: 6,
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            Somos mais que uma associação — somos um ecossistema de aceleração que conecta
            segurança jurídica, blockchain e inteligência artificial para transformar propriedades,
            empresas e projetos reais em ativos digitais de alto valor. O futuro dos negócios já
            começou. Agora é a sua vez de participar.
          </Typography>

          {/* 4. Botões de Ação (CTAs) */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            justifyContent="center"
          >
            {/* Botão Principal (Rosa) */}
            <Button
              variant="contained"
              size="large"
              component={RouterLink}
              to="/register"
              sx={{
                backgroundColor: '#FF3366',
                fontSize: '1rem',
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                borderRadius: '12px',
                '&:hover': { backgroundColor: '#E62E5C' },
                boxShadow: '0 10px 20px -10px rgba(255, 51, 102, 0.5)'
              }}
            >
              QUERO DIGITALIZAR MEU NEGÓCIO
            </Button>

            {/* Botão Secundário (Outline Rosa) */}
            <Button
              variant="outlined"
              size="large"
              component={RouterLink}
              to="/ecosystem"
              sx={{
                color: '#FF3366',
                borderColor: '#FF3366',
                fontSize: '1rem',
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                borderRadius: '12px',
                borderWidth: '2px',
                '&:hover': { 
                   borderWidth: '2px', 
                   backgroundColor: alpha('#FF3366', 0.1) 
                }
              }}
            >
              EXPLORAR O ECOSSISTEMA RWA
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
