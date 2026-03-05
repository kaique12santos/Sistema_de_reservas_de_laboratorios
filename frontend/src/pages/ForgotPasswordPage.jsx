import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Link as MuiLink,
} from "@mui/material";

import { Link as RouterLink } from "react-router-dom";

import LogoFatec from "../assets/LogoFatec.png";
import FotoFatec from "../assets/FOTOFATEC.jpeg";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const validarEmail = (value) => value.endsWith("@cps.sp.gov.br");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validarEmail(email)) {
      setStatus("error");
      setMessage("Email inválido. Use um e-mail institucional (@cps.sp.gov.br).");
      return;
    }

    try {
      setStatus("loading");

      // ✅ KAÍQUE: "não tem rota ainda" -> simula a chamada no front (mock)
      // Quando o backend ficar pronto, você troca isso por:
      // await api.post("/auth/forgot-password", { email });
      await new Promise((resolve) => setTimeout(resolve, 900));

      setStatus("success");
      setMessage(
        "Se este e-mail existir, enviaremos um link para redefinir sua senha."
      );
    } catch (err) {
      setStatus("error");
      setMessage("Não foi possível solicitar a redefinição. Tente novamente.");
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
            Esqueci a senha
          </Typography>

          <Typography sx={{ mt: 1, color: "#777" }}>
            Informe seu e-mail institucional para receber o link de redefinição.
          </Typography>

          {/* ALERT */}
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
            <Typography
              sx={{
                fontSize: "12px",
                letterSpacing: "2px",
                mt: 2,
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#ffffff",
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              disabled={status === "loading"}
              sx={{
                mt: 4,
                backgroundColor: "#9e1b1f",
                color: "#ffffff",
                borderRadius: "12px",
                height: "45px",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#7c1417" },
                "&:disabled": { opacity: 0.7 },
              }}
            >
              {status === "loading" ? "ENVIANDO..." : "ENVIAR LINK"}
            </Button>

            {/* LINKS */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <MuiLink
                component={RouterLink}
                to="/login"
                underline="hover"
                sx={{ color: "#9e1b1f", fontSize: "14px" }}
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
    </Box>
  );
};

export default ForgotPasswordPage;