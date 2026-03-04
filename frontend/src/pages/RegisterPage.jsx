import { useState, useEffect } from 'react';
import { 
  Container, Paper, TextField, Button, Typography, 
  Box, Alert, MenuItem, Select, InputLabel, FormControl 
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api'; // Importante: confirme se o caminho do seu axios está certo

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department_id: '' // Começa vazio para forçar o usuário a escolher
  });
  
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  // Busca os departamentos no backend quando a tela carrega
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        // A rota aqui depende de como você configurou no app.js (ex: '/departments' ou '/api/departments')
        const response = await api.get('/departments'); 
        setDepartments(response.data);
      } catch (err) {
        console.error("Erro ao carregar departamentos", err);
        setError('Não foi possível carregar a lista de cursos.');
      }
    };
    
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpa os erros anteriores
    
    if (!formData.department_id) {
      setError('Por favor, selecione um curso.');
      return;
    }

    try {
      await register(formData);
      alert('Cadastro realizado! Verifique seu e-mail com o link de validação.');
      navigate('/login');
    } catch (err) {
      // Pega a mensagem de erro bonitinha que vem do seu Backend (ex: "E-mail já cadastrado")
      setError(err.response?.data?.error || 'Erro ao cadastrar. Tente novamente.');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Criar Conta
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Nome Completo"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Institucional"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />

            {/* Select Dinâmico do Banco de Dados */}
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="department-select-label">Curso</InputLabel>
              <Select
                labelId="department-select-label"
                name="department_id"
                value={formData.department_id}
                label="Curso"
                onChange={handleChange}
              >
                {/* Varre o array de departamentos e cria as opções */}
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name} ({dept.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              margin="normal"
              required
              fullWidth
              label="Senha"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
            
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Cadastrar
            </Button>
            
            <Box textAlign="center">
              <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
                Já tem conta? Faça Login
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;