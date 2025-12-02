
import api from './api';

// Tipos para autenticação
interface AuthResponse {
  token: string;
  user: any; // Idealmente, defina uma interface de usuário aqui
}

interface AuthPayload {
  email: string;
  password: string;
}

/**
 * Realiza o login do usuário.
 * @param credentials - As credenciais de email e senha.
 * @returns A promessa com o token e os dados do usuário.
 */
export const login = async (credentials: AuthPayload): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

/**
 * Registra um novo usuário.
 * @param userData - Os dados para o registro.
 * @returns A promessa com a resposta do registro.
 */
export const register = async (userData: any) => { // Defina um tipo mais forte para userData
  const response = await api.post('/auth/register', userData);
  return response.data;
};

const authService = {
  login,
  register,
};

export default authService;
