import {
  Box,
  Container,
  Typography,
  Grid,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import { useState } from "react";

export default function Footer() {
  const year = new Date().getFullYear();
  const tokenAddress = "0x1234...abcd";

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(tokenAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#181818",
        color: "white",
        pt: 8,
        pb: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Coluna 1 */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              ASPPIBRA-DAO
            </Typography>

            <Typography variant="body2" sx={{ mt: 1, color: "#bbbbbb" }}>
              Redefinindo ativos reais no mundo digital através de Web3 e IA.
            </Typography>

            <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
              <IconButton color="inherit" size="small"><TwitterIcon /></IconButton>
              <IconButton color="inherit" size="small"><LinkedInIcon /></IconButton>
              <IconButton color="inherit" size="small"><InstagramIcon /></IconButton>
              <IconButton color="inherit" size="small"><GitHubIcon /></IconButton>
              <IconButton color="inherit" size="small"><TelegramIcon /></IconButton>
              <IconButton color="inherit" size="small"><WhatsAppIcon /></IconButton>
            </Box>
          </Grid>

          {/* Coluna 2 */}
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Ecossistema
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "#bbbbbb" }}>
              Governança
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "#bbbbbb" }}>
              Tokenomics
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "#bbbbbb" }}>
              Ativos (RWA)
            </Typography>
          </Grid>

          {/* Coluna 3 */}
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Recursos
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "#bbbbbb" }}>
              Whitepaper
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "#bbbbbb" }}>
              Documentação
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "#bbbbbb" }}>
              Auditorias
            </Typography>
          </Grid>

          {/* Coluna 4 */}
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Token Contract
            </Typography>

            <TextField
              value={tokenAddress}
              variant="outlined"
              size="small"
              fullWidth
              sx={{
                mt: 2,
                input: { color: "#ccc" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#666" },
                },
              }}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleCopy}>
                      <ContentCopyIcon
                        sx={{
                          color: copied ? "#4caf50" : "#aaa",
                          fontSize: 18,
                        }}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {copied && (
              <Typography
                variant="caption"
                sx={{
                  color: "#4caf50",
                  mt: 1,
                  display: "block",
                }}
              >
                Copiado!
              </Typography>
            )}
          </Grid>
        </Grid>

        {/* Linha inferior */}
        <Box
          sx={{
            borderTop: "1px solid #333",
            mt: 6,
            pt: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" sx={{ color: "#777" }}>
            Copyright © {year} ASPPIBRA-DAO. Todos os direitos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
