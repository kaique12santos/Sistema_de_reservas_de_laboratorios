import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  Grid, TextField, MenuItem, Button, Checkbox, 
  FormControlLabel, Alert, CircularProgress, Paper, Typography, Box
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SaveIcon from '@mui/icons-material/Save';
import { reservationService } from '../services/Reservation.service';

export default function ReservationForm({ labs, timeSlots, activeCycle, holidays, initialLabId, onSubmit, submitting, userRole }) {
  const [formData, setFormData] = useState({
    lab_id: initialLabId || '',
    date: null,
    time_slot_ids: [],
    notes: ''
  });

  const [conflictInfo, setConflictInfo] = useState(null);
  const [checkingConflict, setCheckingConflict] = useState(false);

  // Validação de conflito em tempo real
  useEffect(() => {
    async function verifyConflict() {
      if (!formData.lab_id || !formData.date || formData.time_slot_ids.length === 0) {
        setConflictInfo(null);
        return;
      }
      
      setCheckingConflict(true);
      try {
        const result = await reservationService.checkConflict({
          lab_id: formData.lab_id,
          date: dayjs(formData.date).format('YYYY-MM-DD'),
          time_slots: formData.time_slot_ids
        });
        setConflictInfo(result);
      } catch (error) {
        console.error(error);
      } finally {
        setCheckingConflict(false);
      }
    }
    
    const debounce = setTimeout(verifyConflict, 500);
    return () => clearTimeout(debounce);
  }, [formData.lab_id, formData.date, formData.time_slot_ids]);

  const handleSlotToggle = (slotId) => {
    setFormData(prev => {
      const currentSlots = prev.time_slot_ids;
      if (currentSlots.includes(slotId)) {
        return { ...prev, time_slot_ids: currentSlots.filter(id => id !== slotId) };
      }
      return { ...prev, time_slot_ids: [...currentSlots, slotId] };
    });
  };

  const isSubmitDisabled = submitting || 
    checkingConflict || 
    (conflictInfo?.hasConflict && userRole !== 'ADMIN') || 
    formData.time_slot_ids.length === 0;

  return (
    <Grid container spacing={3}>
      
      {/* COLUNA ESQUERDA: Lab e Data empilhados */}
     <Grid item xs={12} md={6}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
          <TextField
            select
            fullWidth
            label="Selecione o Laboratório"
            value={formData.lab_id}
            onChange={(e) => setFormData({ ...formData, lab_id: e.target.value })}
          >
            {labs.map(lab => (
              <MenuItem key={lab.id} value={lab.id}>{lab.nome}</MenuItem>
            ))}
          </TextField>

          <DatePicker
            label="Data da Reserva"
            value={formData.date}
            onChange={(newValue) => setFormData({ ...formData, date: newValue })}
            minDate={dayjs(activeCycle?.start_date)}
            maxDate={dayjs(activeCycle?.end_date)}
            shouldDisableDate={(date) => 
              holidays.includes(dayjs(date).format('YYYY-MM-DD')) || dayjs(date).day() === 0
            }
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Box>
      </Grid>

      {/* COLUNA DIREITA: Observações */}
     <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Observações / Motivo (Opcional)"
          placeholder="Ex: Instalar software X para a aula de Sistemas Operacionais"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          sx={{ 
            flexGrow: 1,
            minWidth: { xs: '100%', md: '35rem' }, 
          }}
        />
      </Grid>

      <Grid item xs={12} sx={{ mt: 1 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', borderBottom: '1px solid', borderColor: 'divider', pb: 1 }}>
          Horários Disponíveis
        </Typography>

        <Box sx={{ minHeight: '48px', mb: 2 }}>
          {checkingConflict && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
              <CircularProgress size={16} color="inherit" />
              <Typography variant="caption">Verificando disponibilidade...</Typography>
            </Box>
          )}
          {conflictInfo?.hasConflict && !checkingConflict && (
            <Alert severity={userRole === 'ADMIN' ? 'info' : 'warning'} icon={<WarningAmberIcon />}>
              {userRole === 'ADMIN' 
                ? `Informação: Os horários ${conflictInfo.conflictingSlots.map(id => timeSlots.find(slot => slot.id === id)?.name).join(', ')} já possuem pedidos aguardando aprovação ou aprovados. Como Coordenador, você pode sobrescrever e alocar este laboratório.`
                : <><strong>Atenção!</strong> Os horários <strong>{conflictInfo.conflictingSlots.map(id => timeSlots.find(slot => slot.id === id)?.name).join(', ')}</strong> já estão reservados para este dia.</>
              }
              
            </Alert>
          )}
        </Box>

        <Grid container spacing={2}>
          {timeSlots.map((slot) => {
            const hasConflict = conflictInfo?.conflictingSlots?.includes(slot.id);
            const isChecked = formData.time_slot_ids.includes(slot.id);

            return (
              <Grid item xs={12} sm={6} md={4} key={slot.id}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    border: '1px solid',
                    borderColor: hasConflict ? 'warning.main' : (isChecked ? 'primary.main' : 'divider'),
                    bgcolor: hasConflict ? 'rgba(237, 108, 2, 0.05)' : 'background.paper',
                    p: 1, borderRadius: 2
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={isChecked} 
                        onChange={() => handleSlotToggle(slot.id)}
                        color={hasConflict ? "warning" : "primary"}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ color: hasConflict ? 'warning.main' : 'text.primary', fontWeight: isChecked ? 'bold' : 'normal' }}>
                        <strong>{slot.name}</strong> — {slot.time}
                      </Typography>
                    }
                    sx={{ width: '100%', m: 0 }}
                  />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Grid>

      <Grid item xs={12} sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          startIcon={<SaveIcon />}
          onClick={() => onSubmit(formData, conflictInfo?.hasConflict)}
          disabled={isSubmitDisabled}
          sx={{ height: 56, fontWeight: 'bold' }}
        >
          {submitting ? 'Processando...' : 'Confirmar Reserva'}
        </Button>
      </Grid>
    </Grid>
  );
}