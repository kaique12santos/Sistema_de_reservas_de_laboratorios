import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, Box, IconButton, InputAdornment, Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const timeToMinutes = (time) => {
  if (!time) return 0;
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

const TimeSlotFormModal = ({ open, onClose, onSave, editingSlot }) => {
  const isEditing = !!editingSlot;

  const [formData, setFormData] = useState({ name: '', startTime: '', endTime: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (editingSlot) {
        setFormData({ name: editingSlot.name || '', startTime: editingSlot.startTime || '', endTime: editingSlot.endTime || '' });
      } else {
        setFormData({ name: '', startTime: '', endTime: '' });
      }
      setErrors({});
    }
  }, [open, editingSlot]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.startTime) newErrors.startTime = 'Horário de início é obrigatório';
    if (!formData.endTime) newErrors.endTime = 'Horário de fim é obrigatório';
    if (formData.startTime && formData.endTime && timeToMinutes(formData.startTime) >= timeToMinutes(formData.endTime)) {
      newErrors.endTime = 'Horário final deve ser posterior ao inicial';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({ ...formData, name: formData.name.trim() });
    }
  };

  const duration = formData.startTime && formData.endTime && timeToMinutes(formData.startTime) < timeToMinutes(formData.endTime)
    ? timeToMinutes(formData.endTime) - timeToMinutes(formData.startTime)
    : null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {isEditing ? `Editar Período` : 'Novo Período'}
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Nome do período" fullWidth required placeholder="Ex: M1, T3, N2…"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={!!errors.name} helperText={errors.name}
            inputProps={{ maxLength: 10 }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Início" type="time" fullWidth required
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              error={!!errors.startTime} helperText={errors.startTime}
              InputLabelProps={{ shrink: true }}
              InputProps={{ startAdornment: <InputAdornment position="start"><AccessTimeIcon fontSize="small" color="action" /></InputAdornment> }}
            />
            <TextField
              label="Fim" type="time" fullWidth required
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              error={!!errors.endTime} helperText={errors.endTime}
              InputLabelProps={{ shrink: true }}
              InputProps={{ startAdornment: <InputAdornment position="start"><AccessTimeIcon fontSize="small" color="action" /></InputAdornment> }}
            />
          </Box>

          {duration && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1, borderRadius: 2, bgcolor: 'action.hover' }}>
              <AccessTimeIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                Duração: <strong>{duration} minutos</strong>
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 'bold' }}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disableElevation sx={{ fontWeight: 'bold' }}>
          {isEditing ? 'Salvar Alterações' : 'Criar Período'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TimeSlotFormModal;