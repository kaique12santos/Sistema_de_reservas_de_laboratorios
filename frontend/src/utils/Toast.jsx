import { Snackbar, Alert } from '@mui/material';

const Toast = ({ open, handleClose, message, severity = "success" }) => {
  return (
    <Snackbar 
      open={open} 
      autoHideDuration={4000} 
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert 
        onClose={handleClose} 
        severity={severity} 
        variant="filled" 
        sx={{ width: '100%',
          maxWidth: '400px', // A "parede" que impede o Toast de vazar pela tela
          boxShadow: 3,
          '& .MuiAlert-message': {
            wordBreak: 'break-word', // Garante que textos longos quebrem de linha
            lineHeight: 1.4 // Dá um respiro entre as linhas para facilitar a leitura
          }
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;