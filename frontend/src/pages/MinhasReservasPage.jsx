import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, MenuItem, TextField, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, IconButton, Grid, Divider, CircularProgress, Paper
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import StaggerItem from "../utils/StaggerItem"; 

// Componentes da Arquitetura
import ReservationTable from "../reservation/ReservationTable";
import ConfirmDialog from "../utils/ConfirmDialog";
import Toast from "../utils/Toast";
import { reservationService } from "../services/reservation.service";

const MinhasReservasPage = () => {
  const navigate = useNavigate();

  // Estados de Dados
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("Todos");

  // Estados de Modais
  const [modalOpen, setModalOpen] = useState(false);
  const [reservaSelecionada, setReservaSelecionada] = useState(null);
  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [idParaCancelar, setIdParaCancelar] = useState(null);
  const [canceling, setCanceling] = useState(false);

  // Estado do Toast
  const [notify, setNotify] = useState({ open: false, message: '', severity: 'success' });

  // 1. Carregar Dados
  useEffect(() => {
    carregarReservas();
  }, []);

  const carregarReservas = async () => {
    setLoading(true);
    try {
      const data = await reservationService.getMyReservations();
      setReservas(data);
    } catch (error) {
      setNotify({ open: true, message: 'Erro ao carregar reservas.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };


 const reservasFiltradas = useMemo(() => {
    if (statusFilter === "Todos") return reservas;
    
    if (statusFilter === "Recusado") {
      return reservas.filter((res) => 
        res.status.toUpperCase() === "RECUSADO" || res.status.toUpperCase() === "CANCELADO"
      );
    }
    
    return reservas.filter((res) => res.status.toUpperCase() === statusFilter.toUpperCase());
  }, [statusFilter, reservas]);

  // 3. Ações
  const handleVerDetalhes = (reserva) => {
    setReservaSelecionada(reserva);
    setModalOpen(true);
  };

  const handleAbrirConfirm = (id) => {
    setIdParaCancelar(id);
    setConfirmOpen(true);
  };

  const handleConfirmarCancelamento = async () => {
    setCanceling(true);
    try {
      await reservationService.cancelReservation(idParaCancelar);
      setNotify({ open: true, message: 'Reserva cancelada com sucesso.', severity: 'success' });
      setConfirmOpen(false);
      carregarReservas(); // Recarrega a lista para atualizar o status
    } catch (error) {
      setNotify({ open: true, message: 'Erro ao cancelar reserva.', severity: 'error' });
    } finally {
      setCanceling(false);
      setIdParaCancelar(null);
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 10 }} />;

  return (
    <Box>
      <StaggerItem index={0}>
        <Box sx={{ display: "flex", flexDirection: { xs: 'column', md: 'row' }, justifyContent: "space-between", alignItems: { xs: 'stretch', md: 'center' }, gap: 2, mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "sectionTitle" }}>
            Minhas Reservas
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              select
              size="small"
              label="Filtrar por Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 200, bgcolor: "background.paper", borderRadius: 1 }}
            >
              <MenuItem value="Todos">Todos</MenuItem>
              <MenuItem value="Aprovado">Aprovados</MenuItem>
              <MenuItem value="Pendente">Pendentes</MenuItem>
              <MenuItem value="Recusado">Recusados / Cancelados</MenuItem>
            </TextField>
            
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              onClick={() => navigate('/reservas/nova')}
              sx={{ fontWeight: 'bold' }}
              disableElevation
            >
              Nova Reserva
            </Button>
          </Box>
        </Box>
      </StaggerItem>

      <StaggerItem index={1}>
        {/* COMPONENTE DE TABELA INJETADO AQUI */}
        <ReservationTable 
          reservations={reservasFiltradas} 
          onViewDetails={handleVerDetalhes} 
          onCancelClick={handleAbrirConfirm}
          onNewReservation={() => navigate('/reservas/nova')}
        />
      </StaggerItem>

      {/* MODAL DE DETALHES DA RESERVA (Refatorado cores Hex) */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "primary.main", color: "white" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>Detalhes da Solicitação #{reservaSelecionada?.id}</Typography>
          <IconButton onClick={() => setModalOpen(false)} sx={{ color: "white" }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          {reservaSelecionada && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: "bold", display: "block", mb: 0.5 }}>DATA DA RESERVA</Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>{reservaSelecionada.dataReserva}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: "bold", display: "block", mb: 0.5 }}>HORÁRIO</Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>{reservaSelecionada.horario}</Typography>
              </Grid>
              <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: "bold", display: "block", mb: 0.5 }}>LABORATÓRIO / SALA</Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>{reservaSelecionada.lab}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: "bold", display: "block", mb: 0.5 }}>STATUS ATUAL</Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold", color: 'primary.main' }}>{reservaSelecionada.status}</Typography>
              </Grid>
              <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
              <Grid item xs={12}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: "bold", display: "block", mb: 0.5 }}>MOTIVO / OBSERVAÇÃO</Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <Typography variant="body2">{reservaSelecionada.motivo}</Typography>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, px: 3 }}>
          <Button onClick={() => setModalOpen(false)} variant="contained" color="primary" disableElevation sx={{ fontWeight: "bold" }}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* CONFIRM DIALOG (UTILITÁRIO) */}
      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar Cancelamento"
        message={`Tem certeza que deseja cancelar a solicitação #${idParaCancelar}? Esta ação não poderá ser desfeita.`}
        confirmText="Sim, Cancelar"
        cancelText="Voltar"
        confirmColor="error"
        loading={canceling}
        onConfirm={handleConfirmarCancelamento}
        onCancel={() => setConfirmOpen(false)}
      />

      {/* TOAST DO SISTEMA */}
      <Toast open={notify.open} handleClose={() => setNotify({ ...notify, open: false })} message={notify.message} severity={notify.severity} />
    </Box>
  );
};

export default MinhasReservasPage;