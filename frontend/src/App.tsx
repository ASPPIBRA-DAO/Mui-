import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Importação dos seus componentes
import LayoutPublic from "./components/layout/LayoutPublic";
import ProtectedRoute from "./routes/ProtectedRoute";

// Importação das páginas
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Todos from "./pages/Todos";

// 1. Definição das Rotas usando Objetos (Nova abordagem v7)
const router = createBrowserRouter([
  // --- Rotas Públicas (Envolvidas pelo LayoutPublic) ---
  {
    path: "/",
    element: (
      <LayoutPublic>
        <Home />
      </LayoutPublic>
    ),
  },
  {
    path: "/login",
    element: (
      <LayoutPublic>
        <Login />
      </LayoutPublic>
    ),
  },
  {
    path: "/register",
    element: (
      <LayoutPublic>
        <Register />
      </LayoutPublic>
    ),
  },

  // --- Rotas Privadas (Protegidas pelo ProtectedRoute) ---
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
  // 2. O App agora apenas retorna o provedor com as rotas configuradas
  return <RouterProvider router={router} />;
}

export default App;