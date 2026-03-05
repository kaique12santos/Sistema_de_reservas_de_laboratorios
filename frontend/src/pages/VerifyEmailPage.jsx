import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import api from "../services/api";

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
        const response = await api.post("/auth/verify-email", { token });
        setStatus("success");
        setMessage(response.data?.message || "E-mail verificado com sucesso!");
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.error || "Erro ao verificar o e-mail. Tente novamente.");
      }
    };

    verifyToken();
  }, [token]);

  return (
    <Container maxWidth="sm">
      <Box
  sx={{
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }}

      >
        <Paper
          elevation={6}
          sx={{
            p: 5,
            width: "100%",
            textAlign: "center",
            borderRadius: 3,
            backgroundColor: "#9e1b1f",
            color: "#ffffff",
          }}
        >
          {status === "loading" && (
            <Box sx={{ my: 3 }}>
              <CircularProgress size={60} sx={{ color: "#ffffff" }} />
              <Typography variant="h6" sx={{ mt: 3 }}>
                {message}
              </Typography>
            </Box>
          )}

          {status === "success" && (
            <Box sx={{ my: 2 }}>
              <CheckCircleOutlineIcon
                sx={{ fontSize: 80, color: "#ffffff", mb: 2 }}
              />

              <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
                E-mail Verificado!
              </Typography>

              <Typography variant="body1" sx={{ mb: 4 }}>
                {message}
              </Typography>

              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate("/login")}
                sx={{
                  backgroundColor: "#ffffff",
                  color: "#9e1b1f",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                Ir para o Login
              </Button>
            </Box>
          )}

          {status === "error" && (
            <Box sx={{ my: 2 }}>
              <ErrorOutlineIcon
                sx={{ fontSize: 80, color: "#ffffff", mb: 2 }}
              />

              <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
                Falha na Verificação
              </Typography>

              <Typography variant="body1" sx={{ mb: 4 }}>
                {message}
              </Typography>

              <Button
                variant="contained"
                fullWidth
                component={RouterLink}
                to="/register"
                sx={{
                  backgroundColor: "#ffffff",
                  color: "#9e1b1f",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
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