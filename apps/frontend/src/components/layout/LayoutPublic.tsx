import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";
import ConstructionPopup from "../common/ConstructionPopup";

export default function LayoutPublic() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ConstructionPopup />

      <Header />
      
      <Box component="main" sx={{ flexGrow: 1, position: 'relative', zIndex: 1 }}>
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
}