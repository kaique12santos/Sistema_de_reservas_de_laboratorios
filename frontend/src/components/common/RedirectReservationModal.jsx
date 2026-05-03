import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
  Box
} from '@mui/material';
import { reservationService } from '../../services/Reservation.service';

const RedirectReservationModal = ({ open, reservation, onClose, onConfirm, showToast }) => {
  const [justification, setJustification] = useState('');
  const [newLabId, setNewLabId] = useState('');
  const [labs, setLabs] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      loadLabs();
    }
  }, [open]);

  const loadLabs = async () => {
    try {
      const data = await reservationService.getInitialData();
      setLabs(data.labs);
    } catch (error) {
      console.error('Erro ao carregar laboratórios:', error);
    }
  };

const handleSubmit = async () => {
    if (!newLabId || !justification.trim()) return;

    setSubmitting(true);
    try {
      await reservationService.redirect(reservation.id, newLabId, justification);
      
      // 1. Dispara o Toast de sucesso
      showToast('Reserva redirecionada com sucesso!', 'success');
      
      // 2. Atualiza a lista no componente pai e fecha
      onConfirm();
      onClose();
      
      // 3. Limpa os campos
      setJustification('');
      setNewLabId('');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro ao redirecionar reserva.';
      showToast(errorMessage, 'error');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setJustification('');
    setNewLabId('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Redirecionar Reserva</DialogTitle>
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
          select
          margin="dense"
          label="Novo Laboratório"
          fullWidth
          value={newLabId}
          onChange={(e) => setNewLabId(e.target.value)}
          required
        >
          {labs.map(lab => (
            <MenuItem key={lab.id} value={lab.id}>
              {lab.nome}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin="dense"
          label="Justificativa"
          fullWidth
          multiline
          rows={4}
          value={justification}
          onChange={(e) => setJustification(e.target.value)}
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
          color="warning"
          disabled={!newLabId || !justification.trim() || submitting}
        >
          {submitting ? 'Redirecionando...' : 'Redirecionar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RedirectReservationModal;