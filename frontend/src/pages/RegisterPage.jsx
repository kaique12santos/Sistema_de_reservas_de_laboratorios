import { useState, useEffect } from "react";
import {
  Paper, TextField, Button, Typography, Box, Alert, MenuItem,
  Select, InputLabel, FormControl, Link as MuiLink,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DepartmentService from "../services/department.service.js";

import LogoFatec from "../public/images/LogoFatec.png";
import FotoFatec from "../public/images/FOTOFATEC.jpeg";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", department_id: "",
  });
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await DepartmentService.getDepartments();
        setDepartments(data);
      } catch (err) {
        setError("Não foi possível carregar a lista de cursos.");
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleCourseChange = (e) => setFormData({ ...formData, department_id: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.department_id) return setError("Por favor, selecione um curso.");

    try {
      await register(formData);
      alert("Cadastro realizado! Verifique seu e-mail para validar a conta."); // Mensagem IHC clara
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao cadastrar. Tente novamente mais tarde."); // Mensagem IHC clara
    }
  };

  return (
    <Box sx={{ position: "absolute", 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    bgcolor: "background.default", 
    overflow: "auto",
    p: { xs: 2, md: 4 }}}>
      
      <Paper elevation={10} sx={{ margin: "auto", display: "flex", width: "100%", maxWidth: "900px", minHeight: { xs: "auto", md: "600px" }, borderRadius: "20px", overflow: "hidden" }}>
        
        {/* COLUNA ESQUERDA (FOTO) */}
        <Box sx={{ width: { xs: "0%", md: "40%" }, display: { xs: "none", md: "flex" }, backgroundImage: `url(${FotoFatec})`, backgroundSize: "cover", backgroundPosition: "center", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", p: 4 }}>
          <Box sx={{ backgroundColor: "rgba(0,0,0,0.35)", borderRadius: "12px", px: 3, py: 2, mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#ffffff", lineHeight: 1.4, textAlign: "center" }}>
              Sistema de<br />Reservas de<br />Laboratórios
            </Typography>
          </Box>
        </Box>

        {/* COLUNA DIREITA */}
        <Box sx={{ width: { xs: "100%", md: "60%" }, bgcolor: "background.paper", p: { xs: 3, md: 5 }, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <img src={LogoFatec} alt="CPS FATEC" style={{ height: "45px" }} />
          </Box>

          <Typography variant="h4" sx={{ mt: 2, fontWeight: "bold" }}>Criar Conta</Typography>

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            
            <Typography variant="inputLabel" sx={{ mt: 2, mb: 1, display: 'block' }}>Nome Completo</Typography>
            <TextField fullWidth placeholder="Seu nome" name="name" value={formData.name} onChange={handleChange} />

            <Typography variant="inputLabel" sx={{ mt: 3, mb: 1, display: 'block' }}>E-mail Institucional</Typography>
            <TextField fullWidth placeholder="nome@fatec.sp.gov.br" name="email" type="email" value={formData.email} onChange={handleChange} />

            <Typography variant="inputLabel" sx={{ mt: 3, mb: 1, display: 'block' }}>Curso</Typography>
            <FormControl fullWidth>
              <InputLabel>Curso</InputLabel>
              <Select value={formData.department_id} label="Curso" onChange={handleCourseChange}>
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>{dept.name} ({dept.code})</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="inputLabel" sx={{ mt: 3, mb: 1, display: 'block' }}>Senha</Typography>
            <TextField fullWidth placeholder="Sua senha" name="password" type="password" value={formData.password} onChange={handleChange} />

            {/* O botão não precisa mais de cor ou borda, o theme.js já cuida disso! */}
            <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 4 }}>
              CADASTRAR
            </Button>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <MuiLink component={RouterLink} to="/login" underline="hover" color="primary" sx={{ fontSize: "14px" }}>
                Já tem conta? Faça Login
              </MuiLink>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, color: "text.secondary" }}>
              <Typography variant="caption">© 2026 Centro Paula Souza</Typography>
              <Typography variant="caption">www.cps.sp.gov.br</Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterPage;