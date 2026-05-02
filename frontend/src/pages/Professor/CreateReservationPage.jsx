import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { Box, Typography, Paper, Button, CircularProgress } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import 'dayjs/locale/pt-br';

// Componente de Domínio e Serviço
import ReservationForm from '../../reservation/ReservationForm';
import { reservationService } from '../../services/Reservation.service'; 
import Toast from '../../utils/Toast'; 
import ConfirmDialog from '../../utils/ConfirmDialog'; 
import LoadingOverlay from "../../components/LoadingOverlay";

const CreateReservationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const labFromUrl = searchParams.get('lab_id') || '';

  const userString = localStorage.getItem('user'); 
  const user = userString ? JSON.parse(userString) : null;

  const [initialData, setInitialData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Estado no padrão do seu Toast utilitário
  const [notify, setNotify] = useState({ open: false, message: '', severity: 'success' });

  // Estados para controle do Modal de Confirmação
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);

  const handleCloseNotify = () => {
    setNotify({ ...notify, open: false });
  };

  useEffect(() => {
    async function loadData() {
      try {
        const data = await reservationService.getInitialData();
        setInitialData(data);
      } catch (error) {
        setNotify({ open: true, message: 'Erro ao carregar dados do sistema.', severity: 'error' });
      }
    }
    loadData();
  }, []);

const handlePreSubmit = (formData, hasConflict) => {
    // Validação
    if (!formData.lab_id) return setNotify({ open: true, message: 'Selecione um laboratório.', severity: 'error' });
    if (!formData.date) return setNotify({ open: true, message: 'Selecione a data da reserva.', severity: 'error' });
    if (formData.time_slot_ids.length === 0) return setNotify({ open: true, message: 'Selecione ao menos um horário.', severity: 'error' });
    if (hasConflict && user?.role !== 'ADMIN') {
        return setNotify({ open: true, message: 'Resolva os conflitos antes de salvar.', severity: 'error' });
    }

    // Tudo válido! Salva no estado temporário e abre o Modal de Confirm
    setPendingFormData(formData);
    setConfirmOpen(true);
  };

  // ETAPA 2: O Modal de Confirm chama isso ao clicar em "Sim"
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      let response;
      if (pendingFormData.reservationType === 'RECURRING') {
        response = await reservationService.createRecurring({
          lab_id: pendingFormData.lab_id,
          start_date: pendingFormData.recurringData.start_date,
          end_date: pendingFormData.recurringData.end_date,
          weekdays: pendingFormData.recurringData.weekdays,
          time_slot_ids: pendingFormData.time_slot_ids,
          note: pendingFormData.notes
        });
      } else {
        response = await reservationService.create({
          ...pendingFormData,
          date: dayjs(pendingFormData.date).format('YYYY-MM-DD'),
          note: pendingFormData.notes
        });
      }
      
      setConfirmOpen(false); // Fecha o modal de confirmação
      setNotify({ 
        open: true, 
        message: pendingFormData.reservationType === 'RECURRING' 
          ? `Reservas recorrentes solicitadas com sucesso! Total: ${response.total_occurrences} ocorrências. Aguardando aprovação da coordenação.` 
          : 'Reserva solicitada com sucesso! Aguardando aprovação da coordenação.', 
        severity: 'success' 
      });
      
      setTimeout(() => navigate('/reservas'), 2500); 

    } catch (error) {
      console.error(error);
      setNotify({ 
        open: true, 
        message: error.response?.data?.error || 'Erro ao processar a solicitação.', 
        severity: 'error' 
      });
      setConfirmOpen(false); // Fecha o modal em caso de erro também
    } finally {
      setSubmitting(false);
    }
  };

  if (!initialData) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 10 }} />;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
        <LoadingOverlay open={submitting} message="Processando..." />
        
        {/* HEADER E BOTÃO VOLTAR BLINDADO */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
          {/* Navegação explícita para evitar que o (-1) falhe se o usuário abrir o link direto */}
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

        {/* TOAST PADRONIZADO DO SISTEMA */}
        <Toast
          open={notify.open}
          handleClose={handleCloseNotify}
          message={notify.message}
          severity={notify.severity}
        />
        {/* DIALOG DE CONFIRMAÇÃO PADRONIZADO DO SISTEMA */}
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

      </Box>
    </LocalizationProvider>
  );
};

export default CreateReservationPage;