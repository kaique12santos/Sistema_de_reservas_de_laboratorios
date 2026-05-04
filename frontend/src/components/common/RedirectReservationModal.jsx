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
      
      showToast('Reserva redirecionada com sucesso!', 'success');
      
      onConfirm();
      handleClose();
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
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
    >
      <DialogTitle sx={{ fontWeight: 'bold', pb: 1 }}>Redirecionar Reserva</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            {/* 🚀 Nomes corrigidos de acordo com o Backend */}
            Reserva de {reservation?.professor_name} - {reservation?.lab_name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Tipo: {reservation?.type === 'SIMPLE' ? 'Simples' : 'Recorrente'} | Ocorrências: {reservation?.total_occurrences || 1}
          </Typography>
        </Box>
        <TextField
          select
          margin="dense"
          label="Selecione o Novo Laboratório"
          fullWidth
          value={newLabId}
          onChange={(e) => setNewLabId(e.target.value)}
          required
          sx={{ mb: 2 }}
        >
          {labs.map(lab => (
            <MenuItem key={lab.id} value={lab.id}>
              {lab.nome}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin="dense"
          label="Justificativa para o Professor"
          placeholder="Ex: Laboratório original apresentou defeito elétrico..."
          fullWidth
          multiline
          rows={4}
          value={justification}
          onChange={(e) => setJustification(e.target.value)}
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
          color="warning"
          disableElevation
          disabled={!newLabId || !justification.trim() || submitting}
          sx={{ fontWeight: 'bold' }}
        >
          {submitting ? 'Processando...' : 'Confirmar Redirecionamento'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RedirectReservationModal;