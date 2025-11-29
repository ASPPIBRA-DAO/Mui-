import { Container, Box, Typography, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
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
          Login
        </Typography>
        
        {/* Aqui entra o formulário que criamos acima */}
        <LoginForm />

        <Box sx={{ mt: 2 }}>
          <MuiLink component={RouterLink} to="/register" variant="body2">
            {"Não tem uma conta? Cadastre-se"}
          </MuiLink>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;