import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography, Alert 
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const OverwriteConfirmModal = ({ open, onClose, onConfirm, submitting }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'warning.main' }}>
        <WarningAmberIcon /> Confirmar Sobrescrita
      </DialogTitle>
      
      <DialogContent dividers>
        <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
          ⚠️ ATENÇÃO: Conflito de Horário Detectado.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Como administrador, você está prestes a forçar esta reserva sobrepondo horários já ocupados.
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: 'error.main' }}>
          As reservas que ocupam este laboratório nestes mesmos horários serão <strong>CANCELADAS DEFINITIVAMENTE</strong>.
        </Typography>

        <Alert severity="info" sx={{ mt: 2 }}>
          Os professores afetados receberão um e-mail automático informando sobre o cancelamento.
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={submitting}>
          Cancelar
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color="warning" 
          disabled={submitting}
        >
          {submitting ? 'Processando...' : 'Confirmar Sobrescrita'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OverwriteConfirmModal;