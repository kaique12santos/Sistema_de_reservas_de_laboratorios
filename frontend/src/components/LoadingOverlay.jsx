import React from 'react';
import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';

const LoadingOverlay = ({ open, message = "Carregando..." }) => {
  return (
    <Backdrop
      sx={{ 
        color: '#fff', 
        // zIndex super alto garante que ele fique por cima de tudo (até do Header e Menu Lateral)
        zIndex: (theme) => theme.zIndex.drawer + 999, 
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        backdropFilter: 'blur(3px)', // Dá um toque premium desfocando o fundo
      }}
      open={open}
    >
      <CircularProgress color="inherit" size={50} thickness={4} />
      {message && (
        <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
          {message}
        </Typography>
      )}
    </Backdrop>
  );
};

export default LoadingOverlay;