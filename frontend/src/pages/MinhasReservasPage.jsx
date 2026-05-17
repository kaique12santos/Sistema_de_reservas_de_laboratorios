import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  MenuItem,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
  Divider,
  CircularProgress,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from "@mui/icons-material/Close";
import StaggerItem from "../utils/StaggerItem";

// Componentes da Arquitetura
import ReservationTable from "../reservation/ReservationTable";
import ConfirmDialog from "../utils/ConfirmDialog";
import { reservationService } from "../services/reservation.service";
import LoadingOverlay from "../components/LoadingOverlay";
import { useNotification } from "../context/NotificationContext";

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
  const { showSuccess, showError, showWarning, showInfo } = useNotification();

  // Estados da Exclusão Múltipla
  const [selectedIds, setSelectedIds] = useState([]);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [submittingBulk, setSubmittingBulk] = useState(false);

  // Função para lidar com a exclusão em lote
  const handleBulkDelete = async () => {
    setSubmittingBulk(true);
    try {
      const result = await reservationService.bulkDelete(selectedIds);
      
      showSuccess(`${result.cancelled_count || selectedIds.length} reserva(s) cancelada(s) com sucesso.`);
      
      // Remove as reservas canceladas da lista local para atualizar a tela instantaneamente
      setReservas((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
      
      // Limpa a seleção e fecha o modal
      setSelectedIds([]);
      setShowBulkDeleteConfirm(false);
    } catch (error) {
      showError(error.response?.data?.error || 'Erro ao cancelar reservas selecionadas.');
      setShowBulkDeleteConfirm(false);
    } finally {
      setSubmittingBulk(false);
    }
  };
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
      showError("Erro ao carregar reservas.");
    } finally {
      setLoading(false);
    }
  };

  // 1. A NOVA LÓGICA DE FILTRO INTELIGENTE
  const reservasFiltradas = useMemo(() => {
    // 1. Visão "Todos": Retorna tudo, EXCETO os Cancelados
    if (statusFilter === "Todos") {
      return reservas.filter(
        (res) => res.status?.toUpperCase() !== "CANCELED" && res.status?.toUpperCase() !== "CANCELADO"
      );
    }

    // 2. Visão "Cancelados": Traz SOMENTE os Cancelados
    if (statusFilter === "Cancelado") {
      return reservas.filter(
        (res) => res.status?.toUpperCase() === "CANCELED" || res.status?.toUpperCase() === "CANCELADO"
      );
    }

    // 3. Visão "Recusados": Mapeia o REJECTED do banco
    if (statusFilter === "Recusado") {
      return reservas.filter(
        (res) => res.status?.toUpperCase() === "REJECTED" || res.status?.toUpperCase() === "RECUSADO"
      );
    }

    // 4. Visão "Aprovado" ou "Pendente": Trata o inglês e o português
    return reservas.filter((res) => {
      const statusBanco = res.status?.toUpperCase();
      if (statusFilter === "Aprovado") return statusBanco === "APPROVED" || statusBanco === "APROVADO";
      if (statusFilter === "Pendente") return statusBanco === "PENDING" || statusBanco === "PENDENTE";
      
      return statusBanco === statusFilter.toUpperCase(); // Fallback
    });
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
      showSuccess("Reserva cancelada com sucesso.");
      setConfirmOpen(false);
      carregarReservas(); // Recarrega a lista para atualizar o status
    } catch (error) {
      showError("Erro ao cancelar reserva.");
    } finally {
      setCanceling(false);
      setIdParaCancelar(null);
    }
  };

  if (loading)
    return (
      <CircularProgress sx={{ display: "block", margin: "auto", mt: 10 }} />
    );

  return (
    <Box>
      <LoadingOverlay open={canceling} message="Cancelando reserva..." />
      <StaggerItem index={0}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "center" },
            gap: 2,
            mb: 4,
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "sectionTitle" }}
          >
            Minhas Reservas
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <TextField
              select
              size="small"
              label="Filtrar por Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{
                minWidth: 200,
                bgcolor: "background.paper",
                borderRadius: 1,
              }}
            >
              <MenuItem value="Todos">Todos</MenuItem>
              <MenuItem value="Aprovado">Aprovados</MenuItem>
              <MenuItem value="Pendente">Pendentes</MenuItem>
              <MenuItem value="Recusado">Recusados</MenuItem>
              <MenuItem value="Cancelado">Cancelados</MenuItem> 
            </TextField>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/reservas/nova")}
              sx={{ fontWeight: "bold" }}
              disableElevation
            >
              Nova Reserva
            </Button>
          </Box>
        </Box>
      </StaggerItem>

     

     {/* 🚀 INJEÇÃO 1: BARRA DE AÇÕES EM LOTE */}
      {selectedIds.length > 0 && (
        <Box 
          sx={{ 
            display: 'flex', alignItems: 'center', gap: 2, mb: 2, p: 1.5,
            bgcolor: '#fff4e5', border: '1px solid #ffe0b2', borderRadius: 2 
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ed6c02' }}>
            {selectedIds.length} reserva(s) selecionada(s)
          </Typography>
          <Button
            variant="contained" color="error" size="small" startIcon={<DeleteIcon />}
            onClick={() => setShowBulkDeleteConfirm(true)} disableElevation
          >
            Cancelar Selecionadas
          </Button>
          <Button size="small" color="inherit" onClick={() => setSelectedIds([])}>
            Limpar seleção
          </Button>
        </Box>
      )}

      <StaggerItem index={1}>
        {/* 🚀 INJEÇÃO 2: PASSANDO AS PROPS DE SELEÇÃO PARA SUA TABELA CUSTOMIZADA */}
        <ReservationTable
          reservations={reservasFiltradas}
          onViewDetails={handleVerDetalhes}
          onCancelClick={handleAbrirConfirm}
          onNewReservation={() => navigate("/reservas/nova")}
          // NOVAS PROPS PARA O DATAGRID INTERNO:
          selectedIds={selectedIds}
          onSelectionChange={(newSelection) => setSelectedIds(newSelection)}
        />
      </StaggerItem>
      {/* MODAL DE DETALHES DA RESERVA (Refatorado cores Hex) */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "primary.main",
            color: "white",
          }}
        >
          <Box
            component="span"
            sx={{ fontSize: "1.25rem", fontWeight: "bold" }}
          >
            Detalhes da Solicitação #{reservaSelecionada?.id}
          </Box>
          <IconButton
            onClick={() => setModalOpen(false)}
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          {reservaSelecionada && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontWeight: "bold",
                    display: "block",
                    mb: 0.5,
                  }}
                >
                  DATA DA RESERVA
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {reservaSelecionada.dataReserva}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontWeight: "bold",
                    display: "block",
                    mb: 0.5,
                  }}
                >
                  HORÁRIO
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {reservaSelecionada.horario}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontWeight: "bold",
                    display: "block",
                    mb: 0.5,
                  }}
                >
                  LABORATÓRIO / SALA
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {reservaSelecionada.lab}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontWeight: "bold",
                    display: "block",
                    mb: 0.5,
                  }}
                >
                  STATUS ATUAL
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  {reservaSelecionada.status}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontWeight: "bold",
                    display: "block",
                    mb: 0.5,
                  }}
                >
                  MOTIVO / OBSERVAÇÃO
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: "background.default",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2">
                    {reservaSelecionada.reason || "Nenhuma observação fornecida."}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, px: 3 }}>
          <Button
            onClick={() => setModalOpen(false)}
            variant="contained"
            color="primary"
            disableElevation
            sx={{ fontWeight: "bold" }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* CONFIRM DIALOG cancelamento */}
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
        {/* CONFIRM DIALOG cancelamento em lote */}
      <ConfirmDialog
        open={showBulkDeleteConfirm}
        title="Cancelar Reservas Múltiplas"
        message={`Tem certeza que deseja cancelar as ${selectedIds.length} reservas selecionadas? Esta ação não poderá ser desfeita.`}
        confirmText="Sim, Cancelar Lote"
        cancelText="Voltar"
        confirmColor="error"
        loading={submittingBulk}
        onConfirm={handleBulkDelete}
        onCancel={() => setShowBulkDeleteConfirm(false)}
      />
    </Box>
  );
};

export default MinhasReservasPage;
