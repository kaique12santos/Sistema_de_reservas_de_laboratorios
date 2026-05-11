import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link as MuiLink,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverlay.jsx";
import { useNotification } from "../../context/NotificationContext";

import LogoFatec from "../../public/images/LogoFatec.png";
import FotoFatec from "../../public/images/FOTOFATEC.jpeg";

import AuthService from "../../services/auth.service.js";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [status] = useState("idle");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning, showInfo } = useNotification();

  const validarEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarEmail(email)) {
      showError("Por favor, informe um endereço de e-mail válido.");
      return;
    }
    setLoading(true);

    try {
      // Chamada REAL para a sua API!
      await AuthService.forgotPassword({ email });
      setLoading(false);

      showSuccess(
        "Se este e-mail estiver cadastrado, você receberá um link para redefinir sua senha em instantes."
      );

      setTimeout(() => {
        navigate("/login");
      }, 3500);
    } catch (err) {
      setLoading(false);
      showError(
        err?.message ||
          "Não foi possível solicitar a redefinição no momento. Tente novamente mais tarde."
      );
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: "background.default",
        display: "flex",
        overflowY: "auto",
        p: { xs: 2, md: 4 },
      }}
    >
      <Paper
        elevation={10}
        sx={{
          margin: "auto",
          display: "flex",
          width: "100%",
          maxWidth: "900px",
          minHeight: { xs: "auto", md: "600px" },
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        {/* COLUNA ESQUERDA */}
        <Box
          sx={{
            width: { xs: "0%", md: "40%" },
            display: { xs: "none", md: "flex" },
            backgroundImage: `url(${FotoFatec})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
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
            bgcolor: "background.paper",
            p: { xs: 3, md: 5 },
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* LOGO */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <img src={LogoFatec} alt="CPS FATEC" style={{ height: "45px" }} />
          </Box>

          {/* TITULO */}
          <Typography variant="h4" sx={{ mt: 2, fontWeight: "bold" }}>
            Esqueci a senha
          </Typography>

          <Typography sx={{ mt: 1, color: "text.secondary" }}>
            Informe seu e-mail institucional para receber o link de redefinição.
          </Typography>

          {/* FORM */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Typography
              variant="inputLabel"
              sx={{ mt: 2, mb: 1, display: "block" }}
            >
              E-MAIL INSTITUCIONAL
            </Typography>

            <TextField
              fullWidth
              placeholder="nome@fatec.sp.gov.br"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={status === "loading"}
              sx={{ mt: 4 }}
            >
              {status === "loading" ? "SOLICITANDO..." : "Solicitar link"}
            </Button>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <MuiLink
                component={RouterLink}
                to="/login"
                underline="hover"
                color="primary"
                sx={{ fontSize: "14px" }}
              >
                Voltar para o Login
              </MuiLink>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 4,
                color: "text.secondary",
              }}
            >
              <Typography variant="caption">
                © 2026 Centro Paula Souza
              </Typography>
              <Typography variant="caption">www.cps.sp.gov.br</Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      <LoadingOverlay open={loading} message="Enviando solicitação..." />
    </Box>
  );
};

export default ForgotPasswordPage;
