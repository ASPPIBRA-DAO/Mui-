import { Container, Box } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function LayoutPublic({ children }: Props) {
  return (
    <Box>
      <Header />
      <Container sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
      <Footer />
    </Box>
  );
}
