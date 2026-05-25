import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  useTheme
} from '@mui/material';

import { reservationService } from '../services/Reservation.service';
import { useNotification } from '../context/NotificationContext';

export default function CalendarPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { showWarning, showError } = useNotification();

  // Estados principais
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('ALL');
  
  const [rawItems, setRawItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [holidays, setHolidays] = useState([]);
  
  const [currentMonth, setCurrentMonth] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // 1. CARGA INICIAL
  useEffect(() => {
    async function loadInitialData() {
      try {
        const data = await reservationService.getInitialData();
        if (data.labs) setLabs(data.labs.filter(lab => lab.is_active));
        if (data.holidays) setHolidays(data.holidays);
      } catch (error) {
        showError('Erro ao carregar dados iniciais dos laboratórios ou feriados.');
      }
    }
    loadInitialData();
  }, [showError]);

  // 2. BUSCA NA API
  useEffect(() => {
    if (!selectedLab) return;
    
    async function loadCalendar() {
      setLoading(true);
      try {
        const items = await reservationService.getCalendarData({
          lab_id: selectedLab,
          year: currentMonth.year,
          month: currentMonth.month
        });
        setRawItems(items);
      } catch (error) {
        showError('Erro ao carregar as reservas do calendário.');
      } finally {
        setLoading(false);
      }
    }
    loadCalendar();
  }, [selectedLab, currentMonth, showError]);

  // 3. MONTAGEM VISUAL INTEGRADA AO THEME.JS
  useEffect(() => {
    const filteredItems = rawItems.filter(item => {
      if (selectedPeriod === 'ALL') return true;
      const slotNameUpper = (item.time_slot_name || '').toUpperCase();
      if (selectedPeriod === 'MANHA' && slotNameUpper.includes('MANHÃ')) return true;
      if (selectedPeriod === 'TARDE' && slotNameUpper.includes('TARDE')) return true;
      if (selectedPeriod === 'NOITE' && slotNameUpper.includes('NOITE')) return true;
      return false;
    });

    const calEvents = filteredItems.map(item => ({
      id: `${item.date}-${item.time_slot_id}`,
      title: `${item.time_slot_name} — ${item.professor_name}`,
      date: item.date,
      color: item.reservation_status === 'PENDING' ? theme.palette.custom.status.pendente.text : theme.palette.primary.main,
      textColor: '#ffffff',
      display: 'block', 
      extendedProps: { ...item }
    }));
    
    const holidayEvents = holidays.map(hDate => ({
        id: `holiday-${hDate}`,
        title: 'FERIADO',
        date: hDate,
        color: theme.palette.mode === 'light' ? '#a7a7a7' : '#444444', // Adapta o feriado ao dark mode
        display: 'background' 
    }));
    
    setEvents([...calEvents, ...holidayEvents]);
  }, [rawItems, holidays, selectedPeriod, theme]); // theme adicionado nas dependências

  // 4. GATILHO DE CLIQUE
  const handleDateClick = ({ dateStr }) => {
    if (!selectedLab) {
      showWarning('Selecione um laboratório primeiro.');
      return;
    }
    const todayStr = new Date().toISOString().split('T')[0];

    if (dateStr < todayStr) {
      showWarning('Não é possível solicitar reservas em datas passadas.');
      return;
    }

    const dayOfWeek = new Date(dateStr + 'T12:00:00').getDay();
    if (dayOfWeek === 0) {
      showWarning('O laboratório não realiza reservas aos domingos.');
      return;
    }

    if (holidays.includes(dateStr)) {
      showWarning('Esta data está bloqueada por ser um feriado letivo.');
      return;
    }

    navigate(`/reservas/nova?date=${dateStr}&lab_id=${selectedLab}`);
  };

  const handleEventClick = (clickInfo) => {
    if (clickInfo.event.display === 'background') return; 
    setSelectedEvent(clickInfo.event.extendedProps);
  };

  return (
    <Box sx={{ p: 2, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        Calendário de Ocupação
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        {/* Seção de Filtros */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <FormControl sx={{ flex: 1, minWidth: 250 }}>
            <InputLabel>Selecione um laboratório para visualizar</InputLabel>
            <Select
              value={selectedLab}
              label="Selecione um laboratório para visualizar"
              onChange={(e) => setSelectedLab(e.target.value)}
            >
              <MenuItem value=""><em>Nenhum</em></MenuItem>
              {labs.map((lab) => (
                <MenuItem key={lab.id} value={lab.id}>
                  {lab.name} {lab.capacity ? `(Capacidade: ${lab.capacity})` : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filtro de Período</InputLabel>
            <Select
              value={selectedPeriod}
              label="Filtro de Período"
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <MenuItem value="ALL">Todos os Horários</MenuItem>
              <MenuItem value="MANHA">Manhã</MenuItem>
              <MenuItem value="TARDE">Tarde</MenuItem>
              <MenuItem value="NOITE">Noite</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Legenda Dinâmica */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
          <Typography variant="body2" fontWeight="bold">Legenda:</Typography>
          <Chip sx={{ bgcolor: 'primary.main', color: '#fff', fontWeight: 'bold' }} label="Ocupado (Aprovado)" size="small" />
          <Chip sx={{ bgcolor: 'custom.status.pendente.text', color: '#fff', fontWeight: 'bold' }} label="Pendente" size="small" />
          <Chip sx={{ bgcolor: theme.palette.mode === 'light' ? '#a7a7a7' : '#444444', color: '#fff', fontWeight: 'bold' }} label="Feriado (Bloqueado)" size="small" />
          <Chip sx={{ bgcolor: 'custom.status.aprovado.text', color: '#fff', fontWeight: 'bold' }} label="Disponível (Clique no dia)" size="small" />
          {loading && <CircularProgress size={20} sx={{ ml: 2 }} />}
        </Box>

        {/* Renderização do Calendário com Cores do Tema */}
        <Box sx={{ 
          bgcolor: 'background.paper', 
          
          '& .fc-toolbar': { flexWrap: 'wrap', gap: 1, mb: 2 },
          '& .fc-toolbar-title': { fontSize: { xs: '1.2rem', md: '1.5rem' }, color: 'text.primary', fontWeight: 'bold' },
          
          '& .fc-daygrid-event': { whiteSpace: 'normal', cursor: 'pointer', borderRadius: '4px', p: '2px' },
          '& .fc-daygrid-day-frame': { cursor: 'pointer', transition: '0.2s', '&:hover': { bgcolor: 'action.hover' } },
          
          // Bordas vinculadas ao primary.dark (que no Light é o #7c1417 e no Dark é o #121212)
          '& .fc-theme-standard td, & .fc-theme-standard th': {
            border: `1px solid ${theme.palette.primary.dark}`, 
          },
          '& .fc-scrollgrid': {
            border: `1px solid ${theme.palette.primary.dark}`,
            borderRadius: '8px',
            overflow: 'hidden'
          },

          // Cabeçalho vinculado ao primary.main
          '& .fc-col-header-cell': {
            bgcolor: 'primary.main',
            py: 0.5, 
          },
          '& .fc-col-header-cell-cushion': {
            color: '#ffffff', // Branco fica melhor com o fundo primary.main (Vermelho/Chumbo)
            fontWeight: 'bold',
          },

          // Domingos usando o background.default (Fundo externo cinza claro/escuro) para diferenciar
          '& .fc-daygrid-day.fc-day-sun': {
            bgcolor: '#74727285', // Cinza claro para domingos no light
            '&:hover': { bgcolor: '#a0a0a0' }, // Hover um pouco mais escuro
          },
          // Pinta o fundo de todos os dias com o verde suave do tema
          '& .fc-daygrid-day': {
            bgcolor: theme.palette.custom.status.livre.bg, //
          },

          // Oculta o verde nos dias que pertencem ao mês anterior/seguinte
          '& .fc-daygrid-day.fc-day-other': {
            bgcolor: 'transparent', 
          },
          

          // Feriados
          '& .fc-bg-event': {
            opacity: '1 !important',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          '& .fc-bg-event .fc-event-title': {
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '1rem',
            letterSpacing: '1px'
          },

          // Números dos dias
          '& .fc-daygrid-day-number': {
            color: 'text.primary', 
            fontWeight: 'bold',
            textDecoration: 'none',
            padding: '4px 8px',
          },
          '& .fc-daygrid-day-number:hover': {
            color: 'primary.main',
          },
        }}>
          {!selectedLab ? (
            <Box sx={{ py: 10, textAlign: 'center', bgcolor: 'background.default', borderRadius: 2, border: '1px dashed', borderColor: 'divider' }}>
              <Typography color="text.secondary">
                Selecione um laboratório acima para visualizar a grade de ocupação.
              </Typography>
            </Box>
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              locale="pt-br"
              displayEventTime={false}
              eventDisplay="block"
              dayMaxEvents={4}
              events={events}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              datesSet={({ view }) => {
                const newYear = view.currentStart.getFullYear();
                const newMonth = view.currentStart.getMonth() + 1;
                if (newYear !== currentMonth.year || newMonth !== currentMonth.month) {
                  setCurrentMonth({ year: newYear, month: newMonth });
                }
              }}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth'
              }}
              buttonText={{ today: 'Hoje', month: 'Mês' }}
              height="auto"
            />
          )}
        </Box>
      </Paper>

      {/* Modal de Detalhes da Reserva */}
      <Dialog open={!!selectedEvent} onClose={() => setSelectedEvent(null)} PaperProps={{ sx: { minWidth: { xs: '90vw', sm: 400 }, borderRadius: 2 } }}>
        <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main' }}>Detalhes da Reserva</DialogTitle>
        <Divider />
        <DialogContent>
          {selectedEvent && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography><strong>Professor:</strong> {selectedEvent.professor_name}</Typography>
              <Typography><strong>Horário:</strong> {selectedEvent.time_slot_name}</Typography>
              <Typography>
                <strong>Status:</strong>{' '}
                <Chip 
                  label={selectedEvent.reservation_status === 'APPROVED' ? 'Aprovado' : 'Pendente'} 
                  sx={{ 
                    bgcolor: selectedEvent.reservation_status === 'APPROVED' ? theme.palette.custom.status.aprovado.bg : theme.palette.custom.status.pendente.bg,
                    color: selectedEvent.reservation_status === 'APPROVED' ? theme.palette.custom.status.aprovado.text : theme.palette.custom.status.pendente.text,
                    fontWeight: 'bold' 
                  }}
                  size="small"
                />
              </Typography>
              <Typography><strong>Tipo:</strong> {selectedEvent.type === 'RECURRING' ? 'Recorrente' : 'Simples'}</Typography>
              {selectedEvent.note && <Typography><strong>Observação:</strong> {selectedEvent.note}</Typography>}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSelectedEvent(null)} variant="contained" disableElevation>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}