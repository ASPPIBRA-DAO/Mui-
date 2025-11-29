import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Usamos a nossa configuração centralizada

// Importações do Material UI v7
import { Box, Button, TextField, Alert } from '@mui/material';

export function RegisterForm() {
  // Estados para os campos
  const [name, setName] = useState(''); // Adicionei Nome pois seu AuthProvider espera um 'name'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estado para erros
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Limpa erros anteriores

    try {
      // 1. Envia os dados para o Backend
      // ⚠️ ATENÇÃO: Verifique se sua rota é '/register' ou '/users' no backend
      await api.post('/register', { 
        name, 
        email, 
        password 
      });

      // 2. Se der certo, redireciona para o login para a pessoa entrar
      navigate('/login');
      
    } catch (err) {
      console.error(err);
      setError('Falha ao criar conta. Verifique os dados e tente novamente.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      {/* Exibe erro se houver */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label="Nome Completo"
        name="name"
        autoComplete="name"
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Endereço de Email"
        name="email"
        autoComplete="email"
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
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Cadastrar
      </Button>
    </Box>
  );
}