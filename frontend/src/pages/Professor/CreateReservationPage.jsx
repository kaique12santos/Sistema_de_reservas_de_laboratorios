import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { Box, Typography, Paper, Button, CircularProgress } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import 'dayjs/locale/pt-br';

import ReservationForm from '../../reservation/ReservationForm';
import { reservationService } from '../../services/Reservation.service'; 
import { useNotification } from '../../context/NotificationContext';
import ConfirmDialog from '../../utils/ConfirmDialog'; 
import LoadingOverlay from "../../components/LoadingOverlay";

// Ajuste o caminho do import caso tenha salvado em outra pasta
import OverwriteConfirmModal from '../../components/OverwriteConfirmModal';

const CreateReservationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const labFromUrl = searchParams.get('lab_id') || '';

  const userString = localStorage.getItem('user'); 
  const user = userString ? JSON.parse(userString) : null;

  const [initialData, setInitialData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const { showSuccess, showError } = useNotification();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showOverwriteModal, setShowOverwriteModal] = useState(false); // NOVO ESTADO
  const [pendingFormData, setPendingFormData] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await reservationService.getInitialData();
        setInitialData(data);
      } catch (error) {
        showError('Erro ao carregar dados do sistema.');
      }
    }
    loadData();
  }, []);

  const handlePreSubmit = (dataFromForm, hasConflict) => {
    const { reservationType, recurringData, ...baseFormData } = dataFromForm;

    if (!baseFormData.lab_id) return showError('Selecione um laboratório.');
    if (baseFormData.time_slot_ids.length === 0) return showError('Selecione ao menos um horário.');

    if (reservationType === 'SIMPLE') {
      if (!baseFormData.date) return showError('Selecione a data da reserva.');
    } else {
      if (!recurringData.start_date || !recurringData.end_date) return showError('Selecione as datas de início e fim.');
      if (recurringData.weekdays.length === 0) return showError('Selecione pelo menos um dia da semana.');
    }

    // 💡 A MÁGICA ACONTECE AQUI
    if (hasConflict) {
      if (user?.role !== 'ADMIN') {
        return showError('Resolva os conflitos antes de salvar. Laboratório já ocupado.');
      } else {
        // Se é ADMIN e tem conflito -> Desvia para o fluxo de Sobrescrita
        setPendingFormData(dataFromForm);
        setShowOverwriteModal(true);
        return; 
      }
    }

    // Sem conflito -> Fluxo de criação normal
    setPendingFormData(dataFromForm);
    setConfirmOpen(true);
  };

  // FLUXO NORMAL (Criar Reserva)
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      let payload;
      if (pendingFormData.reservationType === 'RECURRING') {
        payload = {
          type: 'RECURRING',
          lab_id: pendingFormData.lab_id,
          time_slot_ids: pendingFormData.time_slot_ids,
          start_date: dayjs(pendingFormData.recurringData.start_date).format('YYYY-MM-DD'),
          end_date: dayjs(pendingFormData.recurringData.end_date).format('YYYY-MM-DD'),
          weekdays: pendingFormData.recurringData.weekdays,
          notes: pendingFormData.notes
        };
      } else {
        payload = {
          ...pendingFormData,
          type: 'SIMPLE',
          date: dayjs(pendingFormData.date).format('YYYY-MM-DD'),
          notes: pendingFormData.notes
        };
      }

      const response = await reservationService.create(payload);
      setConfirmOpen(false);
      showSuccess(
        pendingFormData.reservationType === 'RECURRING'
          ? `Reservas solicitadas com sucesso! Total: ${response.total_occurrences} ocorrências.`
          : 'Reserva solicitada com sucesso!'
      );
      setTimeout(() => navigate('/reservas'), 2500);

    } catch (error) {
      showError(error.response?.data?.error || 'Erro ao processar a solicitação.');
      setConfirmOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  // FLUXO DE SOBRESCRITA (Fase 6)
  const handleOverwrite = async () => {
    setSubmitting(true);
    try {
      // Sobrescrita (por regra) é focada em datas únicas (SIMPLE)
      const payload = {
        lab_id: pendingFormData.lab_id,
        date: dayjs(pendingFormData.date).format('YYYY-MM-DD'),
        time_slot_ids: pendingFormData.time_slot_ids,
        notes: pendingFormData.notes
      };

      const result = await reservationService.overwrite(payload);
      
      setShowOverwriteModal(false);
      showSuccess(`Sobrescrita realizada! ${result.overwritten_count} reserva(s) anterior(es) cancelada(s).`);
      
      setTimeout(() => navigate('/reservas'), 2500);
      
    } catch (error) {
      showError(error.response?.data?.error || 'Erro ao realizar sobrescrita.');
      setShowOverwriteModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (!initialData) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 10 }} />;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
        <LoadingOverlay open={submitting} message="Processando..." />
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/laboratories')} color="inherit">
            Voltar
          </Button>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'sectionTitle' }}>
            Nova Reserva de Laboratório
          </Typography>
        </Box>

        <Paper elevation={1} sx={{ p: { xs: 3, md: 4 }, borderRadius: 2 }}>
          <ReservationForm 
            labs={initialData.labs}
            timeSlots={initialData.timeSlots}
            activeCycle={initialData.activeCycle}
            holidays={initialData.holidays}
            initialLabId={labFromUrl}
            onSubmit={handlePreSubmit}
            submitting={submitting}
            userRole={user?.role}
          />
        </Paper>

        <ConfirmDialog
          open={confirmOpen}
          title="Confirmar Solicitação"
          message="Sua reserva será enviada para a fila de aprovação da coordenação. Deseja prosseguir?"
          confirmText="Sim, Solicitar"
          cancelText="Revisar"
          confirmColor="primary"
          loading={submitting}
          onConfirm={handleSubmit}
          onCancel={() => setConfirmOpen(false)}
        />

        {/* NOVO MODAL DE SOBRESCRITA */}
        <OverwriteConfirmModal 
          open={showOverwriteModal}
          onClose={() => setShowOverwriteModal(false)}
          onConfirm={handleOverwrite}
          submitting={submitting}
        />

      </Box>
    </LocalizationProvider>
  );
};

export default CreateReservationPage;