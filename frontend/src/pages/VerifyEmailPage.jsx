import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Paper, Typography, Box, CircularProgress, Button,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

// ✅ Importando o Service no lugar da API (Regra de Arquitetura respeitada)
import AuthService from "../services/auth.service.js";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verificando seu e-mail...");

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Nenhum token de verificação encontrado na URL.");
      return;
    }

    const verifyToken = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        // ✅ Chamada limpa utilizando a camada de Service
        const response = await AuthService.verifyEmail(token);
        setStatus("success");
        setMessage(response?.message || "E-mail verificado com sucesso!");
      } catch (err) {
        setStatus("error");
        setMessage(err?.response?.data?.error || "Erro ao verificar o e-mail. Tente novamente.");
      }
    };

    verifyToken();
  }, [token]);

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: "background.default", // Fundo cinza global
        display: "flex",
        overflowY: "auto",
        p: { xs: 2, md: 4 },
      }}
    >
      <Paper
        elevation={10}
        sx={{
          margin: "auto", // Mágica da centralização
          p: { xs: 4, md: 6 },
          width: "100%",
          maxWidth: "500px", // Card menor, pois é só um aviso
          textAlign: "center",
          borderRadius: "20px",
          bgcolor: "primary.main", // Puxa o vermelho do theme.js
          color: "#ffffff",
        }}
      >
        {status === "loading" && (
          <Box sx={{ my: 3 }}>
            <CircularProgress size={60} sx={{ color: "#ffffff" }} />
            <Typography variant="h6" sx={{ mt: 3, fontWeight: "bold" }}>
              {message}
            </Typography>
          </Box>
        )}

        {status === "success" && (
          <Box sx={{ my: 2 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 80, color: "#ffffff", mb: 2 }} />
            
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
              E-mail Verificado!
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
              {message}
            </Typography>

            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate("/login")}
              sx={{
                bgcolor: "background.paper", // Fundo branco do tema
                color: "primary.main", // Texto vermelho do tema
                fontWeight: "bold",
                height: "45px",
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
            >
              IR PARA O LOGIN
            </Button>
          </Box>
        )}

        {status === "error" && (
          <Box sx={{ my: 2 }}>
            <ErrorOutlineIcon sx={{ fontSize: 80, color: "#ffffff", mb: 2 }} />
            
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
              Falha na Verificação
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
              {message}
            </Typography>

            <Button
              variant="contained"
              fullWidth
              component={RouterLink}
              to="/register"
              sx={{
                bgcolor: "background.paper",
                color: "primary.main",
                fontWeight: "bold",
                height: "45px",
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
            >
              VOLTAR PARA O CADASTRO
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default VerifyEmailPage;