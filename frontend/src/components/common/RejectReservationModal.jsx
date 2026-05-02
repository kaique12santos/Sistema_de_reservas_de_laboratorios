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

const RejectReservationModal = ({ open, reservation, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) return;

    setSubmitting(true);
    try {
      await reservationService.reject(reservation.id, reason);
      onConfirm();
      onClose();
      setReason('');
    } catch (error) {
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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Rejeitar Reserva</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1">
            Reserva de {reservation?.professor} - {reservation?.lab}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tipo: {reservation?.type} | Ocorrências: {reservation?.total_occurrences}
          </Typography>
        </Box>
        <TextField
          autoFocus
          margin="dense"
          label="Motivo da Rejeição"
          fullWidth
          multiline
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="error"
          disabled={!reason.trim() || submitting}
        >
          {submitting ? 'Rejeitando...' : 'Rejeitar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RejectReservationModal;