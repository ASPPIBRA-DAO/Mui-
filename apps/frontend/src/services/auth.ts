
import api from './api';
import { type AuthResponse, type AuthPayload } from '../types'; // Supondo que você tenha esses tipos

// Tipos provisórios se não existirem
interface LoginResponse {
  token: string;
  user: any; 
}

interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Realiza o login do usuário.
 * @param credentials - As credenciais de email e senha.
 * @returns A promessa com o token e os dados do usuário.
 */
export const login = async (credentials: LoginPayload): Promise<LoginResponse> => {
  const response = await api.post('/login', credentials);
  return response.data;
};

/**
 * Registra um novo usuário.
 * @param userData - Os dados para o registro.
 * @returns A promessa com a resposta do registro.
 */
export const register = async (userData: any) => { // Defina um tipo para userData
  const response = await api.post('/register', userData);
  return response.data;
};

const authService = {
  login,
  register,
};

export default authService;
