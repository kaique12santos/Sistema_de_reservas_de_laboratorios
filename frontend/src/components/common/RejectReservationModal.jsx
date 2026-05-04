import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box
} from '@mui/material';
import { reservationService } from '../../services/Reservation.service';

const RejectReservationModal = ({ open, reservation, onClose, onConfirm, showToast }) => {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) return;

    setSubmitting(true);
    try {
      await reservationService.reject(reservation.id, reason);
      
      showToast('Reserva rejeitada com sucesso.', 'success');
      
      onConfirm();
      handleClose(); 
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro ao rejeitar reserva.';
      showToast(errorMessage, 'error');
      console.error('Erro ao rejeitar reserva:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
    >
      <DialogTitle sx={{ fontWeight: 'bold', pb: 1 }}>Rejeitar Reserva</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Reserva de {reservation?.professor_name} - {reservation?.lab_name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Tipo: {reservation?.type === 'SIMPLE' ? 'Simples' : 'Recorrente'} | Ocorrências: {reservation?.total_occurrences || 1}
          </Typography>
        </Box>
        <TextField
          autoFocus
          margin="dense"
          label="Motivo da Rejeição"
          placeholder="Ex: O laboratório estará em manutenção neste período..."
          fullWidth
          multiline
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
      </DialogContent>
      <DialogActions sx={{ p: 2, px: 3 }}>
        <Button onClick={handleClose} disabled={submitting} color="inherit" sx={{ fontWeight: 'bold' }}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="error"
          disableElevation
          disabled={!reason.trim() || submitting}
          sx={{ fontWeight: 'bold' }}
        >
          {submitting ? 'Rejeitando...' : 'Confirmar Rejeição'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RejectReservationModal;