import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Link as MuiLink,
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
      setNotify({
        open: true,
        message: "Login Realizado com sucesso.",
        severity: "success",
      });

      setTimeout(() => {
      navigate("/");
       }, 1500);
    } catch (err) {
      // --- DISPARANDO O TOAST NO ERRO ---
      setNotify({
        open: true,
        message: err.response?.data?.error || "Erro ao fazer login.",
        severity: "error",
      });
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
            Login
          </Typography>

          

          {/* FORM */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {/* EMAIL */}
            <Typography
              sx={{
                fontSize: "12px",
                letterSpacing: "2px",
                mt: 2,
                mb: 1,
                color: "#777",
              }}
            >
              E-MAIL
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
                "&:hover": {
                  backgroundColor: "#7c1417",
                },
              }}
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
    sx={{ color: "#9e1b1f", fontSize: "14px" }}
  >
    Esqueci minha senha
  </MuiLink>

  <MuiLink
    component={RouterLink}
    to="/register"
    underline="hover"
    sx={{ color: "#9e1b1f", fontSize: "14px" }}
  >
    Criar conta
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