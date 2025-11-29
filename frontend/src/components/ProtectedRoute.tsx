import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { Box, CircularProgress } from "@mui/material";

interface ProtectedRouteProps {
  children: JSX.Element;
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
  return children;
};

export default ProtectedRoute;