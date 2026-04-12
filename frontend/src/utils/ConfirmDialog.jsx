import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography 
} from '@mui/material';

export default function ConfirmDialog({ 
  open, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'Confirmar', 
  cancelText = 'Cancelar', 
  confirmColor = 'primary', // Pode ser 'error', 'warning', 'success', 'info'
  loading = false 
}) {
  return (
    <Dialog 
      open={open} 
      onClose={!loading ? onCancel : undefined} 
      PaperProps={{ sx: { borderRadius: 3, p: 1, minWidth: { xs: '90vw', sm: 400 } } }}
    >
      {title && (
        <DialogTitle sx={{ fontWeight: 'bold', pb: 1 }}>
          {title}
        </DialogTitle>
      )}
      
      <DialogContent>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {message}
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, px: 3 }}>
        <Button 
          onClick={onCancel} 
          color="inherit" 
          disabled={loading}
          sx={{ fontWeight: 'bold' }}
        >
          {cancelText}
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color={confirmColor} 
          disableElevation 
          disabled={loading}
          sx={{ fontWeight: 'bold' }}
        >
          {loading ? 'Processando...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}