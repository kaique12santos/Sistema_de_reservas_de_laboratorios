import { useEffect, useRef, useState } from "react";
import {
  useNavigate,
  useSearchParams,
  Link as RouterLink,
} from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link as MuiLink,
} from "@mui/material";

import LogoFatec from "../../public/images/LogoFatec.png";
import FotoFatec from "../../public/images/FOTOFATEC.jpeg";

import LoadingOverlay from "../../components/LoadingOverlay.jsx";
import { useNotification } from "../../context/NotificationContext";

import AuthService from "../../services/auth.service.js";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [status, setStatus] = useState("idle");
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const { showSuccess, showError, showWarning, showInfo } = useNotification();

  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("error");
      showError("Token não encontrado na URL. Verifique o link recebido no e-mail.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setStatus("error");
      showError("Token não encontrado na URL.");
      return;
    }

    if (!password || !confirmPassword) {
      setStatus("error");
      showError("Preencha a nova senha e a confirmação.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      showError("As senhas não conferem.");
      return;
    }

    if (password.length < 6) {
      setStatus("error");
      showError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      const response = await AuthService.resetPassword({ token, password });

      setLoading(false);
      showSuccess(
        response?.message ||
          "Senha redefinida com sucesso! Você será redirecionado para o login."
      );

      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setLoading(false);

      showError(
        err?.message ||
          "Não foi possível redefinir a senha. Tente novamente."
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
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <img src={LogoFatec} alt="CPS FATEC" style={{ height: "45px" }} />
          </Box>

          <Typography variant="h4" sx={{ mt: 2, fontWeight: "bold" }}>
            Nova senha
          </Typography>

          <Typography sx={{ mt: 1, color: "text.secondary" }}>
            Defina sua nova senha e confirme para finalizar.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Typography
              variant="inputLabel"
              sx={{ mt: 2, mb: 1, display: "block" }}
            >
              NOVA SENHA
            </Typography>
            <TextField
              fullWidth
              placeholder="(nova senha)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Typography
              variant="inputLabel"
              sx={{ mt: 3, mb: 1, display: "block" }}
            >
              CONFIRMAR SENHA
            </Typography>
            <TextField
              fullWidth
              placeholder="(confirme a senha)"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={status === "loading" || !token}
              sx={{ mt: 4 }}
            >
              {status === "loading" ? "SALVANDO..." : "REDEFINIR SENHA"}
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

      <LoadingOverlay open={loading} message="Redefinindo senha..." />
    </Box>
  );
};

export default ResetPasswordPage;
