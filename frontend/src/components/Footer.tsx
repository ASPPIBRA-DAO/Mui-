import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        textAlign: "center",
        py: 3,
        mt: 4,
        borderTop: "1px solid #e0e0e0",
        color: "text.secondary",
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Todo App — Todos os direitos reservados.
      </Typography>
    </Box>
  );
}
