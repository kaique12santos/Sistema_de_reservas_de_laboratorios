import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Container, Paper, Typography, Box, CircularProgress, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AuthService from '../services/auth.service';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('Verificando seu e-mail...');
  
  // useRef para evitar que o React StrictMode chame a API duas vezes no desenvolvimento
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Nenhum token de verificação encontrado na URL.');
      return;
    }

    const verifyToken = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        const data = await AuthService.verifyEmail(token);
        setStatus('success');
        setMessage(data.message);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Erro ao verificar o e-mail. Tente novamente.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 5, width: '100%', textAlign: 'center', borderRadius: 2 }}>
          
          {status === 'loading' && (
            <Box sx={{ my: 3 }}>
              <CircularProgress size={60} sx={{ color: '#B30000' }} />
              <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
                {message}
              </Typography>
            </Box>
          )}

          {status === 'success' && (
            <Box sx={{ my: 2 }}>
              <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                E-mail Verificado!
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                {message}
              </Typography>
              <Button 
                variant="contained" 
                fullWidth 
                onClick={() => navigate('/login')}
                sx={{ backgroundColor: '#B30000', '&:hover': { backgroundColor: '#8a0000' } }}
              >
                Ir para o Login
              </Button>
            </Box>
          )}

          {status === 'error' && (
            <Box sx={{ my: 2 }}>
              <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Falha na Verificação
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                {message}
              </Typography>
              <Button 
                variant="outlined" 
                fullWidth 
                component={Link} 
                to="/register"
                sx={{ color: '#B30000', borderColor: '#B30000' }}
              >
                Voltar para o Cadastro
              </Button>
            </Box>
          )}

        </Paper>
      </Box>
    </Container>
  );
};

export default VerifyEmailPage;