import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, MenuItem, Box, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const LaboratoryFormModal = ({ open, onClose, onSave, initialData }) => {
  const isEditing = !!initialData;
  
  const [formData, setFormData] = useState({
    name: '', location: '', capacity: '', type: '', description: ''
  });
  const [errors, setErrors] = useState({});

  // Preenche o form quando abre para edição
  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({ name: '', location: '', capacity: '', type: '', description: '' });
      }
      setErrors({});
    }
  }, [open, initialData]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.capacity || Number(formData.capacity) <= 0) newErrors.capacity = 'Capacidade deve ser maior que zero';
    if (!formData.type) newErrors.type = 'Tipo é obrigatório';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Converte capacidade para número antes de enviar
      onSave({ ...formData, capacity: Number(formData.capacity) });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {isEditing ? `Editar Laboratório` : 'Novo Laboratório'}
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Nome do Laboratório" fullWidth required
            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
            error={!!errors.name} helperText={errors.name}
          />
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Localização" fullWidth
              value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
            <TextField
              label="Capacidade" type="number" required sx={{ minWidth: 120 }}
              value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})}
              error={!!errors.capacity} helperText={errors.capacity}
            />
          </Box>

          <TextField
            select label="Tipo" fullWidth required
            value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}
            error={!!errors.type} helperText={errors.type}
          >
            <MenuItem value="Laboratório">Laboratório</MenuItem>
            <MenuItem value="Sala de Aula">Sala de Aula</MenuItem>
            <MenuItem value="Auditório">Auditório</MenuItem>
          </TextField>

          <TextField
            label="Descrição / Equipamentos" fullWidth multiline rows={3}
            value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 'bold' }}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disableElevation sx={{ fontWeight: 'bold' }}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LaboratoryFormModal;