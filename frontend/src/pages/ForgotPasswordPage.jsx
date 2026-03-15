import { useState } from "react";
import {
  Box, Paper, Typography, TextField, Button, Alert, Link as MuiLink,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import LogoFatec from "../public/images/LogoFatec.png";
import FotoFatec from "../public/images/FOTOFATEC.jpeg";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  // Ajustado para aceitar tanto @cps quanto @fatec
  const validarEmail = (value) => value.endsWith("@cps.sp.gov.br") || value.endsWith("@fatec.sp.gov.br");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validarEmail(email)) {
      setStatus("error");
      setMessage("Por favor, utilize um e-mail institucional válido (@fatec.sp.gov.br ou @cps.sp.gov.br).");
      return;
    }

    try {
      setStatus("loading");

      // Simulação da chamada de API (Mock) enquanto o backend não libera a rota
      await new Promise((resolve) => setTimeout(resolve, 900));

      setStatus("success");
      setMessage("Se este e-mail estiver cadastrado, você receberá um link para redefinir sua senha em instantes.");
    } catch (err) {
      setStatus("error");
      setMessage("Não foi possível solicitar a redefinição no momento. Tente novamente mais tarde.");
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
            Esqueci a senha
          </Typography>

          <Typography sx={{ mt: 1, color: "text.secondary" }}>
            Informe seu e-mail institucional para receber o link de redefinição.
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
            
            {/* EMAIL */}
            <Typography variant="inputLabel" sx={{ mt: 2, mb: 1, display: 'block' }}>
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

            {/* BOTÃO */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={status === "loading"}
              sx={{ mt: 4 }}
            >
              {status === "loading" ? "ENVIANDO..." : "ENVIAR LINK"}
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

export default ForgotPasswordPage;