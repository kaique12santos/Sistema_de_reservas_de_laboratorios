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
        sx={{ width: '100%', boxShadow: 3 }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;