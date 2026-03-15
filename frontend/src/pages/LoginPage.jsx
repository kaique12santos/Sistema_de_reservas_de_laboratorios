import React, { useState } from "react";
import {
  Box, Paper, Typography, TextField, Button, Alert, Link as MuiLink,
} from "@mui/material";

import Toast from "../utils/Toast";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import LogoFatec from "../assets/LogoFatec.png";
import FotoFatec from "../assets/FOTOFATEC.jpeg";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // --- ESTADO DO TOAST ---
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") return;
    setNotify({ ...notify, open: false });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(formData);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao fazer login.");
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
          margin: "auto", // Mágica da centralização absoluta que fizemos no Register
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
            Entrar
          </Typography>

          

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
              value={formData.email}
              onChange={handleChange}
            />

            {/* SENHA */}
            <Typography variant="inputLabel" sx={{ mt: 3, mb: 1, display: 'block' }}>
              SENHA
            </Typography>
            <TextField
              fullWidth
              placeholder="Sua senha"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />

            {/* BOTÃO */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 4 }}
            >
              ENTRAR
            </Button>

            

            {/* LINKS */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 2,
              }}
            >
              <MuiLink
                component={RouterLink}
                to="/forgot-password"
                underline="hover"
                color="primary"
                sx={{ fontSize: "14px" }}
              >
                Esqueci minha senha
              </MuiLink>

              <MuiLink
                component={RouterLink}
                to="/register"
                underline="hover"
                color="primary"
                sx={{ fontSize: "14px" }}
              >
                Não tenho cadastro
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

      <Toast 
        open={notify.open} 
        handleClose={handleCloseToast} 
        message={notify.message} 
        severity={notify.severity} 
      />
      
    </Box>
  );
};

export default LoginPage;