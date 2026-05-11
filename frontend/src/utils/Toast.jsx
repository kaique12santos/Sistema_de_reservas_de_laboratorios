// src/components/Toast.jsx (ou onde ele estiver)
import { Snackbar, Alert } from '@mui/material';

const Toast = ({ open, handleClose, message, severity = "success" }) => {
  return (
    <Snackbar 
      open={open} 
      autoHideDuration={4000} 
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ zIndex: 9999 }} // GARANTIA DE FICAR ACIMA DE TUDO
    >
      <Alert 
        onClose={handleClose} 
        severity={severity} 
        variant="filled" 
        sx={{ width: '100%',
          maxWidth: '400px',
          boxShadow: 3,
          '& .MuiAlert-message': {
            wordBreak: 'break-word', 
            lineHeight: 1.4 
          }
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;