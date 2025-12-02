import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import theme from "./theme"; // Importa o tema que criamos com o efeito 'glass'

// Componentes de Layout
import LayoutPublic from "./layouts/LayoutPublic"; // Caminho corrigido
import ProtectedRoute from "./routes/ProtectedRoute";

// Páginas
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Todos from "./pages/Todos";

// --- Estilo do Background Animado (Aurora Boreal) ---
const globalBackground = {
  width: '100vw',
  minHeight: '100vh',
  // Gradiente base escuro/azulado suave
  background: 'linear-gradient(135deg, #f4f6f8 0%, #eef2f5 100%)', 
  // Nota: Se usar Dark Mode, mude para: 'linear-gradient(135deg, #0f0c29 0%, #302b63 100%)'
  position: 'relative',
  overflowX: 'hidden',
  
  // Blob Roxo
  '&::before': { 
    content: '""',
    position: 'absolute',
    top: '-10%',
    left: '-10%',
    width: '50vw',
    height: '50vw',
    background: '#764ba2', // Cor secundária
    filter: 'blur(120px)',
    borderRadius: '50%',
    opacity: 0.15, // Opacidade baixa para não brigar com o conteúdo
    zIndex: 0,
    animation: 'float 20s infinite ease-in-out alternate'
  },
  
  // Blob Azul
  '&::after': { 
    content: '""',
    position: 'absolute',
    bottom: '10%',
    right: '-5%',
    width: '40vw',
    height: '40vw',
    background: '#667eea', // Cor primária
    filter: 'blur(100px)',
    borderRadius: '50%',
    opacity: 0.15,
    zIndex: 0,
    animation: 'float 25s infinite ease-in-out alternate-reverse'
  },
  
  '@keyframes float': {
    '0%': { transform: 'translate(0, 0)' },
    '100%': { transform: 'translate(50px, 50px)' },
  }
};

// --- Definição de Rotas Otimizada ---
const router = createBrowserRouter([
  {
    // LayoutPublic envolve todas as rotas filhas automaticamente
    element: <LayoutPublic />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ]
  },
  
  // Rotas Protegidas (Dashboard, etc)
  // Se o Dashboard tiver um layout diferente (ex: Sidebar), crie um LayoutPrivate
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/todos",
    element: (
      <ProtectedRoute>
        <Todos />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline reseta o CSS do navegador para o padrão MUI */}
      <CssBaseline />
      
      {/* Container Global com o Background Animado */}
      <Box sx={globalBackground}>
        <RouterProvider router={router} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
