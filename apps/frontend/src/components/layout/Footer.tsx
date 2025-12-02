import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid, // O Grid agora é o Grid v2 por padrão nas novas versões
  IconButton,
  TextField,
  InputAdornment,
  Paper,
  Stack,
  Tooltip,
  Divider,
  Snackbar,
  Alert,
  Container
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Twitter,
  LinkedIn,
  Instagram,
  GitHub,
  Telegram,
  ContentCopy,
  CheckCircle
} from '@mui/icons-material';

// --- Interfaces para Tipagem (TypeScript) ---
interface SocialIconProps {
  children: React.ReactNode;
  label: string;
}
interface FooterNodeProps {
  children: React.ReactNode;
}

// --- Componentes Auxiliares ---
const SocialIcon: React.FC<SocialIconProps> = ({ children, label }) => (
  <Tooltip title={label} arrow>
    <IconButton
      size="small"
      sx={{
        color: 'rgba(255,255,255,0.6)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          color: '#00D1FF',
          transform: 'translateY(-3px)',
          background: alpha('#00D1FF', 0.1)
        }
      }}
    >
      {children}
    </IconButton>
  </Tooltip>
);

const FooterLink: React.FC<FooterNodeProps> = ({ children }) => (
  <Typography
    variant="body2"
    component="a"
    sx={{
      color: '#9ca3af',
      cursor: 'pointer',
      fontSize: '0.9rem',
      textDecoration: 'none',
      position: 'relative',
      width: 'fit-content',
      transition: 'color 0.2s',
      '&:hover': {
        color: '#fff',
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        width: '0%',
        height: '1px',
        bottom: -2,
        left: 0,
        backgroundColor: '#00D1FF',
        transition: 'width 0.3s'
      },
      '&:hover::after': {
        width: '100%'
      }
    }}
  >
    {children}
  </Typography>
);

const FooterTitle: React.FC<FooterNodeProps> = ({ children }) => (
  <Typography
    variant="subtitle2"
    fontWeight="700"
    color="white"
    sx={{
      textTransform: 'uppercase',
      letterSpacing: '1px',
      mb: 1,
      fontSize: '0.75rem',
      opacity: 0.9,
      background: 'linear-gradient(90deg, #fff, #999)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }}
  >
    {children}
  </Typography>
);

export default function Footer() {
  // CORREÇÃO: Removido 'useTheme' pois não estava sendo usado
  // const theme = useTheme(); 
  
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
    setOpenSnackbar(true);
  };

  // CORREÇÃO: Adicionado underscore (_) no 'event' para indicar que não é usado,
  // ou simplesmente removido da lógica se não for necessário.
  const handleCloseSnackbar = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        p: 0,
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 10
      }}
    >
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        height: '300px',
        background: 'radial-gradient(circle at center bottom, rgba(0,209,255,0.08) 0%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          borderRadius: 0,
          pt: { xs: 6, md: 8 },
          pb: { xs: 4, md: 4 },
          px: 0,
          backgroundColor: '#050505',
          borderTop: `1px solid ${alpha('#ffffff', 0.1)}`,
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Grid container columnSpacing={6} rowSpacing={5}>
            
            {/* CORREÇÃO PRINCIPAL: 
               Substituído <Grid item xs={12} md={4}> 
               por <Grid size={{ xs: 12, md: 4 }}>
            */}
            
            {/* Coluna 1: Marca e Intro */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={2.5}>
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight="800"
                    sx={{
                      letterSpacing: '-0.5px',
                      background: 'linear-gradient(45deg, #fff 30%, #6b7280 90%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      display: 'inline-block'
                    }}
                  >
                    ASPPIBRA-DAO
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10B981', boxShadow: '0 0 8px #10B981' }} />
                    <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600, letterSpacing: 0.5 }}>
                      SYSTEM ONLINE
                    </Typography>
                  </Stack>
                </Box>
                <Typography variant="body2" sx={{ color: '#9ca3af', maxWidth: '320px', lineHeight: 1.6 }}>
                  Redefinindo ativos reais no mundo digital. Governança descentralizada, transparência e inovação através de tecnologia Web3 e Inteligência Artificial.
                </Typography>
                <Stack direction="row" spacing={1} sx={{ ml: -1 }}>
                  <SocialIcon label="Twitter"><Twitter /></SocialIcon>
                  <SocialIcon label="LinkedIn"><LinkedIn /></SocialIcon>
                  <SocialIcon label="Instagram"><Instagram /></SocialIcon>
                  <SocialIcon label="GitHub"><GitHub /></SocialIcon>
                  <SocialIcon label="Telegram"><Telegram /></SocialIcon>
                </Stack>
              </Stack>
            </Grid>

            {/* Coluna 2: Navegação */}
            {/* Substituído xs={6} sm={4} md={2} por size={{ ... }} */}
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <Stack spacing={2}>
                <FooterTitle>Ecossistema</FooterTitle>
                <Stack spacing={1.5}>
                  <FooterLink>Governança</FooterLink>
                  <FooterLink>Tokenomics</FooterLink>
                  <FooterLink>Ativos (RWA)</FooterLink>
                  <FooterLink>Roadmap</FooterLink>
                </Stack>
              </Stack>
            </Grid>

            {/* Coluna 3: Legal/Docs */}
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <Stack spacing={2}>
                <FooterTitle>Recursos</FooterTitle>
                <Stack spacing={1.5}>
                  <FooterLink>Whitepaper</FooterLink>
                  <FooterLink>Documentação</FooterLink>
                  <FooterLink>Auditorias</FooterLink>
                  <FooterLink>Termos de Uso</FooterLink>
                </Stack>
              </Stack>
            </Grid>

            {/* Coluna 4: Contrato & Newsletter */}
            <Grid size={{ xs: 12, sm: 4, md: 4 }}>
              <Stack spacing={3}>
                <Box>
                  <FooterTitle>Token Contract (ERC-20)</FooterTitle>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    value="0x71C...8976F"
                    slotProps={{
                      input: {
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip title="Copiar Endereço">
                              <IconButton
                                onClick={handleCopy}
                                edge="end"
                                size="small"
                                sx={{
                                  color: '#9ca3af',
                                  '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                                }}
                              >
                                <ContentCopy fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                        sx: {
                          color: '#d1d5db',
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: '0.85rem',
                          backgroundColor: alpha('#000', 0.3),
                          borderRadius: '8px',
                          border: `1px solid ${alpha('#fff', 0.1)}`,
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: alpha('#fff', 0.2),
                            backgroundColor: alpha('#000', 0.5),
                          },
                          '&.Mui-focused': {
                            borderColor: '#00D1FF',
                            boxShadow: `0 0 0 2px ${alpha('#00D1FF', 0.2)}`
                          }
                        }
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 1 }}>
                    Precisa de suporte?
                  </Typography>
                  <FooterLink>help@asppibra.dao</FooterLink>
                </Box>
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: alpha('#fff', 0.05) }} />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Typography variant="caption" sx={{ color: '#52525b' }}>
              © 2025 ASPPIBRA-DAO. Todos os direitos reservados.
            </Typography>

            <Stack direction="row" spacing={3}>
              <Typography variant="caption" sx={{ color: '#52525b', cursor: 'pointer', '&:hover': { color: '#9ca3af' } }}>
                Privacidade
              </Typography>
              <Typography variant="caption" sx={{ color: '#52525b', cursor: 'pointer', '&:hover': { color: '#9ca3af' } }}>
                Cookies
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          icon={<CheckCircle fontSize="inherit" />}
          severity="success"
          variant="filled"
          sx={{ bgcolor: '#10B981', color: 'white' }}
        >
          Endereço copiado!
        </Alert>
      </Snackbar>
    </Box>
  );
}