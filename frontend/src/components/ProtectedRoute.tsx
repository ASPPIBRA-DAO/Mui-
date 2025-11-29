import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { Box, CircularProgress } from "@mui/material";
// 1. Importamos o tipo ReactNode explicitamente
import { type ReactNode } from "react";

interface ProtectedRouteProps {
  // 2. Mudamos de JSX.Element para ReactNode (aceita componentes, texto, fragmentos, etc.)
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Mostra um loading enquanto verifica se o usuário está logado
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Se não estiver logado, manda pro login
    return <Navigate to="/login" replace />;
  }

  // Se estiver logado, mostra a página (Dashboard ou Todos)
  // O ReactNode pode ser retornado diretamente aqui
  return children;
};

export default ProtectedRoute;