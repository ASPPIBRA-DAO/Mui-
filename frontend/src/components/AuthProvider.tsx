import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api'; // Importa a api que acabamos de criar

// Tipagem dos dados do Usuário (ajuste conforme seu backend)
interface User {
  id: string;
  name: string;
  email: string;
}

// O que o nosso Contexto vai disponibilizar para o app
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  loading: boolean; // Para não redirecionar antes de verificar o storage
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ao carregar a página, verifica se já tem login salvo
    const recoveredUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (recoveredUser && token) {
      setUser(JSON.parse(recoveredUser));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    setLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    api.defaults.headers.common['Authorization'] = undefined;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para facilitar o uso (Ex: const { login } = useAuth();)
export const useAuth = () => useContext(AuthContext);