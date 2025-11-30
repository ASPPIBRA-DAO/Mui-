import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";

export default function LayoutPublic() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* O Header já é sticky e glass */}
      <Header />
      
      {/* O Outlet é onde Home, Login, etc. serão renderizados */}
      <Box component="main" sx={{ flexGrow: 1, position: 'relative', zIndex: 1 }}>
        <Outlet />
      </Box>

      {/* O Footer flutuante glass */}
      <Footer />
    </Box>
  );
}