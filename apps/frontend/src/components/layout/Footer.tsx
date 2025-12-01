import { Box, Typography, Grid, IconButton, TextField, InputAdornment, Paper, Stack } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Twitter, LinkedIn, Instagram, GitHub, Telegram, WhatsApp, ContentCopy } from '@mui/icons-material';

const SocialIcon = ({ children }: { children: React.ReactNode }) => (
  <IconButton size="small" sx={{ color: 'white', '&:hover': { color: 'primary.main' } }}>
    {children}
  </IconButton>
);

const FooterLink = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="body2" sx={{ color: '#9ca3af', mb: 1.5, cursor: 'pointer', '&:hover': { color: 'white' } }}>
    {children}
  </Typography>
);

const FooterTitle = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="subtitle1" fontWeight="bold" color="white" sx={{ mb: 2 }}>
    {children}
  </Typography>
);

export default function Footer() {
  return (
    <Box sx={{ mt: 'auto', p: 2 }}>
      <Paper
        variant="glass"
        sx={{
          p: { xs: 4, md: 6 },
          borderRadius: '24px',
          backgroundColor: alpha('#111111', 0.85),
          borderColor: alpha('#ffffff', 0.1),
          color: 'white',
        }}
      >
        <Grid container spacing={4}>
          
          {/* Coluna 1: Info e Social */}
          {/* CORREÇÃO: Removido 'item' e usado 'size' */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>ASPPIBRA-DAO</Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af', mb: 3, maxWidth: 300 }}>
              Redefinindo ativos reais no mundo digital através de Web3 e IA.
            </Typography>
            <Stack direction="row" spacing={1}>
              <SocialIcon><Twitter /></SocialIcon>
              <SocialIcon><LinkedIn /></SocialIcon>
              <SocialIcon><Instagram /></SocialIcon>
              <SocialIcon><GitHub /></SocialIcon>
              <SocialIcon><Telegram /></SocialIcon>
              <SocialIcon><WhatsApp /></SocialIcon>
            </Stack>
          </Grid>

          {/* Coluna 2: Ecossistema */}
          <Grid size={{ xs: 6, md: 2 }}>
            <FooterTitle>Ecossistema</FooterTitle>
            <FooterLink>Governança</FooterLink>
            <FooterLink>Tokenomics</FooterLink>
            <FooterLink>Ativos (RWA)</FooterLink>
          </Grid>

          {/* Coluna 3: Recursos */}
          <Grid size={{ xs: 6, md: 2 }}>
            <FooterTitle>Recursos</FooterTitle>
            <FooterLink>Whitepaper</FooterLink>
            <FooterLink>Documentação</FooterLink>
            <FooterLink>Auditorias</FooterLink>
          </Grid>

          {/* Coluna 4: Token Contract */}
          <Grid size={{ xs: 12, md: 4 }}>
            <FooterTitle>Token Contract</FooterTitle>
            <TextField
              fullWidth
              variant="outlined"
              defaultValue="0x1234...abcd"
              slotProps={{
                input: {
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" sx={{ color: '#9ca3af' }}>
                         <ContentCopy fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    color: '#9ca3af',
                    fontFamily: 'monospace',
                    backgroundColor: alpha('#000', 0.3),
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#fff', 0.1) },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#fff', 0.3) },
                  }
                }
              }}
            />
          </Grid>
        </Grid>

        <Box sx={{ borderTop: `1px solid ${alpha('#fff', 0.1)}`, mt: 6, pt: 3, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#6b7280' }}>
            Copyright © 2025 ASPPIBRA-DAO. Todos os direitos reservados.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}