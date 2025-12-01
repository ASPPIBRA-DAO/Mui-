import { useState, useEffect, useRef, useCallback } from "react";
import { Box, Typography, Button, Paper, Stack, IconButton } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import CloseIcon from '@mui/icons-material/Close';

// 1. Hook useInterval (Adaptado para React 19/TS Moderno)
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<(() => void) | undefined>(undefined);

  // Lembra da última função de callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Configura o intervalo
  useEffect(() => {
    function tick() {
      if (savedCallback.current) savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

// 2. Sub-componente para os blocos de tempo (Dias, Horas, etc.)
const TimeBox = ({ value, label }: { value: number; label: string }) => (
  <Box sx={{ textAlign: 'center', px: { xs: 1, md: 2 } }}>
    <Paper
      elevation={0}
      sx={{
        backgroundColor: alpha('#ffffff', 0.1),
        borderRadius: '12px',
        p: 2,
        minWidth: { xs: '60px', md: '80px' },
        border: `1px solid ${alpha('#ffffff', 0.1)}`,
        backdropFilter: 'blur(4px)',
      }}
    >
      <Typography variant="h4" fontWeight="bold" color="white">
        {String(value).padStart(2, "0")}
      </Typography>
    </Paper>
    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', mt: 1, display: 'block', fontWeight: 600 }}>
      {label}
    </Typography>
  </Box>
);

// 3. Componente Principal
export default function ConstructionPopup() {
  const [visible, setVisible] = useState(true);
  const theme = useTheme();

  // Data Alvo: Fixada para o lançamento
  const targetDate = useRef(new Date("2025-12-15T00:00:00")); 

  const calculateCountdown = useCallback(() => {
    const now = new Date();
    const difference = targetDate.current.getTime() - now.getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }, []);

  const [countdown, setCountdown] = useState(calculateCountdown());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useInterval(() => {
    setCountdown(calculateCountdown());
  }, 1000);

  const handleClose = () => {
    setVisible(false);
    // Opcional: Salvar no localStorage para não mostrar novamente na mesma sessão
    // sessionStorage.setItem('popupSeen', 'true');
  };

  if (!visible || !isClient) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // Fundo escuro com blur (Glassmorphism Overlay)
        backgroundColor: alpha("#000", 0.7),
        backdropFilter: "blur(8px)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        animation: "fadeIn 0.5s ease-out",
        "@keyframes fadeIn": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        }
      }}
    >
      <Paper
        variant="glass" // Usando nossa variante do theme.ts
        sx={{
          maxWidth: "600px",
          width: "100%",
          p: 0, // Reset padding para usar layout interno
          overflow: "hidden",
          backgroundColor: alpha("#111827", 0.8), // Fundo escuro para o card
          border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
          boxShadow: `0 0 50px ${alpha(theme.palette.primary.main, 0.2)}`, // Glow effect
        }}
      >
        {/* Header do Modal */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ px: { xs: 4, md: 6 }, pb: 6, textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            color="white" 
            sx={{ mb: 2, textShadow: '0 0 20px rgba(255,255,255,0.3)' }}
          >
            Acesso Antecipado DAO
          </Typography>
          
          <Typography variant="body1" sx={{ color: '#9ca3af', mb: 4 }}>
            Entre para a whitelist e participe das decisões de governança e investimentos RWA antes do lançamento público. Vagas limitadas.
          </Typography>

          {/* Contador */}
          <Stack direction="row" justifyContent="center" spacing={{ xs: 1, md: 2 }} mb={5}>
            <TimeBox value={countdown.days} label="Dias" />
            <TimeBox value={countdown.hours} label="Horas" />
            <TimeBox value={countdown.minutes} label="Min" />
            <TimeBox value={countdown.seconds} label="Seg" />
          </Stack>

          {/* Botão de Ação */}
          <Button
            variant="contained"
            size="large"
            color="primary"
            fullWidth
            onClick={handleClose} // Aqui você redirecionaria para /register
            sx={{
              py: 1.5,
              fontSize: '1.1rem',
              borderRadius: '12px',
              fontWeight: 'bold',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              '&:hover': {
                 filter: 'brightness(1.2)',
              }
            }}
          >
            GARANTIR MINHA VAGA
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}