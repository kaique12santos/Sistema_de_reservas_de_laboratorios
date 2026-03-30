import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, Box, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AcademicCycleFormModal = ({ open, onClose, onSave, editingCycle, existingNames = [] }) => {
  const isEditing = !!editingCycle;

  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    coordEndDate: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (editingCycle) {
        setFormData({
          name: editingCycle.name || '',
          startDate: editingCycle.startDate || '',
          endDate: editingCycle.endDate || '',
          coordEndDate: editingCycle.coordEndDate || ''
        });
      } else {
        setFormData({ name: '', startDate: '', endDate: '', coordEndDate: '' });
      }
      setErrors({});
    }
  }, [open, editingCycle]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.startDate) newErrors.startDate = 'Data de início é obrigatória';
    if (!formData.endDate) newErrors.endDate = 'Data de fim é obrigatória';
    if (!formData.coordEndDate) newErrors.coordEndDate = 'Data fim do período exclusivo é obrigatória';
   
    if (existingNames.includes(formData.name.trim()) && formData.name.trim() !== editingCycle?.name) {
  newErrors.name = 'Já existe um ciclo com este nome';
}

    
    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = 'Data de fim deve ser posterior à data de início';
    }

    if (formData.coordEndDate && formData.endDate && formData.coordEndDate > formData.endDate) {
      newErrors.coordEndDate = 'Não pode ser posterior à data de fim do ciclo';
    }

        if (!isEditing && formData.startDate && formData.startDate < new Date().toISOString().split('T')[0]) {
      newErrors.startDate = 'Data de início não pode ser no passado';
    }

    if (formData.coordEndDate && formData.startDate && formData.coordEndDate < formData.startDate) {
      newErrors.coordEndDate = 'Deve ser igual ou posterior à data de início';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({ ...formData, name: formData.name.trim() });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {isEditing ? `Editar Ciclo` : 'Novo Ciclo Acadêmico'}
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Nome do ciclo" fullWidth required placeholder="Ex: 2026-1"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={!!errors.name} helperText={errors.name}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Data de início" type="date" fullWidth required
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              error={!!errors.startDate} helperText={errors.startDate}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Data de fim" type="date" fullWidth required
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              error={!!errors.endDate} helperText={errors.endDate}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <TextField
            label="Fim do período exclusivo Coordenador" type="date" fullWidth required
            value={formData.coordEndDate}
            onChange={(e) => setFormData({ ...formData, coordEndDate: e.target.value })}
            error={!!errors.coordEndDate} helperText={errors.coordEndDate || 'Até quando apenas o Coordenador pode fazer reservas'}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 'bold' }}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disableElevation sx={{ fontWeight: 'bold' }}>
          {isEditing ? 'Salvar Alterações' : 'Criar Ciclo'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AcademicCycleFormModal;