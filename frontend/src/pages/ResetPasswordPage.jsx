import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, Link as RouterLink } from "react-router-dom";
import {
  Box, Paper, Typography, TextField, Button, Alert, Link as MuiLink,
} from "@mui/material";

import LogoFatec from "../public/images/LogoFatec.png";
import FotoFatec from "../public/images/FOTOFATEC.jpeg";

import AuthService from "../services/auth.service.js";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Token vem do link do e-mail: /reset-password?token=xxxxx
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  // Evita disparar 2x no StrictMode caso você queira validar token no futuro
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    if (!token) {
      setStatus("error");
      setMessage("Token não encontrado na URL. Verifique o link recebido no e-mail.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!token) {
      setStatus("error");
      setMessage("Token não encontrado na URL.");
      return;
    }

    if (!password || !confirmPassword) {
      setStatus("error");
      setMessage("Preencha a nova senha e a confirmação.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("As senhas não conferem.");
      return;
    }

    if (password.length < 6) {
      setStatus("error");
      setMessage("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      setStatus("loading");

      // Chamada seguindo o padrão de Services da arquitetura
      const response = await AuthService.resetPassword({ token, password });

      setStatus("success");
      setMessage(
        response?.message ||
          "Senha redefinida com sucesso! Você será redirecionado para o login."
      );

      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setStatus("error");
      setMessage(err?.message || "Não foi possível redefinir a senha. Tente novamente.");
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
          margin: "auto", // Mágica da centralização absoluta
          display: "flex",
          width: "100%",
          maxWidth: "900px",
          minHeight: { xs: "auto", md: "600px" },
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
              Sistema de<br />Reservas de<br />Laboratórios
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
            Nova senha
          </Typography>

          <Typography sx={{ mt: 1, color: "text.secondary" }}>
            Defina sua nova senha e confirme para finalizar.
          </Typography>

          {/* ALERTS */}
          {status === "error" && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}

          {status === "success" && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}

          {/* FORM */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            
            {/* SENHA */}
            <Typography variant="inputLabel" sx={{ mt: 2, mb: 1, display: 'block' }}>
              NOVA SENHA
            </Typography>
            <TextField
              fullWidth
              placeholder="(nova senha)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* CONFIRMAR SENHA */}
            <Typography variant="inputLabel" sx={{ mt: 3, mb: 1, display: 'block' }}>
              CONFIRMAR SENHA
            </Typography>
            <TextField
              fullWidth
              placeholder="(confirme a senha)"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {/* BOTÃO */}
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

            {/* LINKS */}
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

            {/* RODAPÉ */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 4,
                color: "text.secondary",
              }}
            >
              <Typography variant="caption">© 2026 Centro Paula Souza</Typography>
              <Typography variant="caption">www.cps.sp.gov.br</Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ResetPasswordPage;