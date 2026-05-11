import { useState, useEffect } from "react";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Link as MuiLink,
} from "@mui/material";

import { useNotification } from "../../context/NotificationContext";

import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import DepartmentService from "../../services/department.service.js";
import LoadingOverlay from "../../components/LoadingOverlay.jsx";

import LogoFatec from "../../public/images/LogoFatec.png";
import FotoFatec from "../../public/images/FOTOFATEC.jpeg";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department_id: "",
  });

  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const { showSuccess, showError, showWarning, showInfo } = useNotification();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await DepartmentService.getDepartments();
        setDepartments(data);
      } catch (err) {
        console.error("Erro ao carregar cursos", err);
        setError("Não foi possível carregar a lista de cursos.");
      }
    };

    fetchDepartments();
  }, []);

  const handleCourseChange = (e) => {
    setFormData({
      ...formData,
      department_id: e.target.value,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- VALIDAÇÕES DO FRONT-END (Paridade com o Zod) ---
    if (!formData.name || formData.name.length < 3) {
      showError("Por favor, informe um nome válido (mín. 3 caracteres).");
      return;
    }

    if (!formData.email) {
      showError("Por favor, informe um email válido.");
      return;
    }

    if (!formData.department_id) {
      showError("Por favor, selecione um curso.");
      return;
    }

    // A MUDANÇA AQUI: Checando o tamanho da senha no front!
    if (!formData.password || formData.password.length < 6) {
      showError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    // --- FIM DAS VALIDAÇÕES ---

    setLoading(true);

    try {
      await register(formData);

      setLoading(false);
      showSuccess("Verifique o seu Email para validar o cadastro.");

      setTimeout(() => {
        navigate("/");
      }, 3500);
    } catch (err) {
      setLoading(false);

      // --- A MÁGICA DA LEITURA DO ZOD ---
      // 1. Tenta pegar a primeira mensagem do array 'details' do Zod
      // 2. Se não tiver, tenta pegar o 'error' genérico
      // 3. Se o back-end caiu de vez, mostra a mensagem padrão
      const errorMessage =
        err.response?.data?.details?.[0] ||
        err.response?.data?.error ||
        "Erro ao cadastrar.";

      // --- DISPARANDO O TOAST NO ERRO ---
      showError(errorMessage);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#dfdfdf",
        p: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          display: "flex",
          width: { xs: "100%", md: "900px" },
          height: { xs: "auto", md: "600px" },
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        {/* COLUNA ESQUERDA (FOTO) */}
        <Box
          sx={{
            width: { xs: "0%", md: "40%" },
            display: { xs: "none", md: "flex" },
            backgroundImage: `url(${FotoFatec})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            p: 4,
          }}
        >
          <Box
            sx={{
              backgroundColor: "rgba(0,0,0,0.35)",
              borderRadius: "12px",
              px: 3,
              py: 2,
              mb: 2,
              width: "fit-content",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#ffffff",
                lineHeight: 1.4,
                textAlign: "center",
              }}
            >
              Sistema de
              <br />
              Reservas de
              <br />
              Laboratórios
            </Typography>
          </Box>
        </Box>

        {/* COLUNA DIREITA */}
        <Box
          sx={{
            width: { xs: "100%", md: "60%" },
            backgroundColor: "#f5f5f5",
            p: { xs: 3, md: 5 },
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {/* LOGO */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <img src={LogoFatec} alt="CPS FATEC" style={{ height: "45px" }} />
          </Box>

          {/* TITULO */}
          <Typography variant="h4" sx={{ mt: 2, fontWeight: "bold" }}>
            Criar Conta
          </Typography>

          {/* ERRO */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {/* FORM */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {/* NOME */}
            <Typography
              sx={{
                fontSize: "12px",
                letterSpacing: "2px",
                mt: 2,
                mb: 1,
                color: "#777",
              }}
            >
              NOME COMPLETO
            </Typography>

            <TextField
              fullWidth
              placeholder="Seu nome"
              name="name"
              value={formData.name}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#ffffff",
                },
              }}
            />

            {/* EMAIL */}
            <Typography
              sx={{
                fontSize: "12px",
                letterSpacing: "2px",
                mt: 3,
                mb: 1,
                color: "#777",
              }}
            >
              E-MAIL INSTITUCIONAL
            </Typography>

            <TextField
              fullWidth
              placeholder="nome@cps.sp.gov.br"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#ffffff",
                },
              }}
            />

            {/* CURSO */}
            <Typography
              sx={{
                fontSize: "12px",
                letterSpacing: "2px",
                mt: 3,
                mb: 1,
                color: "#777",
              }}
            >
              CURSO
            </Typography>

            <FormControl fullWidth>
              <InputLabel>Curso</InputLabel>

              <Select
                value={formData.department_id}
                label="Curso"
                onChange={handleCourseChange}
                sx={{
                  borderRadius: "12px",
                  backgroundColor: "#ffffff",
                }}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name} ({dept.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* SENHA */}
            <Typography
              sx={{
                fontSize: "12px",
                letterSpacing: "2px",
                mt: 3,
                mb: 1,
                color: "#777",
              }}
            >
              SENHA
            </Typography>

            <TextField
              fullWidth
              placeholder="senha"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#ffffff",
                },
              }}
            />

            {/* BOTÃO */}
            <Button
              type="submit"
              fullWidth
              sx={{
                mt: 4,
                backgroundColor: "#9e1b1f",
                color: "#ffffff",
                borderRadius: "12px",
                height: "45px",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#7c1417" },
              }}
            >
              SOLICITAR CADASTRO
            </Button>

            {/* LINK LOGIN */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <MuiLink
                component={RouterLink}
                to="/login"
                underline="hover"
                sx={{ color: "#9e1b1f", fontSize: "14px" }}
              >
                Já tem conta? Faça Login
              </MuiLink>
            </Box>

            {/* RODAPÉ */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 4,
                fontSize: "12px",
                color: "#777",
              }}
            >
              <Typography>
                © 2026
                <br />
                Centro Paula Souza
              </Typography>

              <Typography>www.cps.sp.gov.br</Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      <LoadingOverlay open={loading} message="Enviando solicitação..." />
    </Box>
  );
};

export default RegisterPage;
