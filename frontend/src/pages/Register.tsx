import { Container, Box, Typography, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// CORREÇÃO: Adicionamos as chaves { } aqui
import { RegisterForm } from '../components/auth/RegisterForm';

const Register = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Cadastro
        </Typography>
        
        <RegisterForm />

        <Box sx={{ mt: 2 }}>
          <MuiLink component={RouterLink} to="/login" variant="body2">
            {"Já tem uma conta? Faça login"}
          </MuiLink>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;