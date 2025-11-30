import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import api from '../../services/api';

// Componentes visuais do Material UI
import { Box, Button, TextField, Alert } from '@mui/material'; // Removi Typography e Paper que não estavam sendo usados para limpar os avisos

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Envia os dados para o Backend
      const response = await api.post('/login', { email, password });

      // 2. Pega o token e o user da resposta
      const { token, user } = response.data;

      // 3. Salva no contexto global
      login(token, user);

      // 4. Redireciona para o Dashboard
      navigate('/dashboard');
      
    } catch (err) { // <--- O ERRO ESTAVA PROVAVELMENTE AQUI (Faltava a chave de abertura '{')
      console.error(err);
      setError('Falha no login. Verifique seu email e senha.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      {/* Mostra o erro se houver */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Endereço de Email"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Senha"
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Entrar
      </Button>
    </Box>
  );
};

export default LoginForm;