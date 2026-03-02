import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Bem-vindo ao Sistema de Reservas
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Olá, {user?.name} ({user?.role})
          </Typography>
          <Typography paragraph>
            Seu acesso está confirmado. Em breve você verá o calendário aqui.
          </Typography>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Sair do Sistema
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default DashboardPage;