import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, Chip, Pagination, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
import { 
  DataGrid, 
  gridPageCountSelector, 
  gridPageSelector, 
  useGridApiContext, 
  useGridSelector 
} from '@mui/x-data-grid';
import InfoIcon from '@mui/icons-material/Info'; // 🚀 Ícone para o aviso
import EventIcon from '@mui/icons-material/Event'; // 🚀 Ícone para o modal
import { reservationService } from '../../services/Reservation.service';
import { useNotification } from '../../context/NotificationContext';
import ConfirmDialog from '../../utils/ConfirmDialog';
import RejectReservationModal from '../../components/common/RejectReservationModal';
import RedirectReservationModal from '../../components/common/RedirectReservationModal';
import dayjs from 'dayjs';

function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  if (pageCount <= 1) return null;

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', p: 2, borderTop: '1px solid #e0e0e0' }}>
      <Pagination
        color="primary"
        shape="rounded"
        size="large"
        count={pageCount}
        page={page + 1}
        onChange={(event, value) => apiRef.current.setPage(value - 1)}
      />
    </Box>
  );
}

const PendingReservationsPage = () => {
  const [pendingReservations, setPendingReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState({ open: false, reservation: null });
  const [redirectModal, setRedirectModal] = useState({ open: false, reservation: null });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, message: '', onConfirm: null });
  
  // 🚀 NOVO ESTADO: Modal de Detalhes de Data/Horário
  const [detailsModal, setDetailsModal] = useState({ open: false, reservation: null });

  const { showSuccess, showError, showWarning, showInfo } = useNotification();
  const showToast = (message, severity = 'success') => {
    if (severity === 'error') return showError(message);
    if (severity === 'warning') return showWarning(message);
    if (severity === 'info') return showInfo(message);
    return showSuccess(message);
  };

  useEffect(() => {
    loadPendingReservations();
  }, []);

  const loadPendingReservations = async () => {
    try {
      const data = await reservationService.getPending();
      const rows = data.pendingReservations || data || [];
      console.log("=== LISTA DE RESERVAS DA API ===", rows);
      setPendingReservations(rows);
    } catch (_error) {
      showToast('Erro ao carregar reservas pendentes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenApprov = (id) => {
    setConfirmDialog({ open: true, id, loading: false });
  }

  const handleConfirmApprove = async () => {
    setConfirmDialog({ ...confirmDialog, loading: true });
    try {
      await reservationService.approve(confirmDialog.id);
      showToast('Reserva aprovada com sucesso!');
      loadPendingReservations();
    } catch (_error) {
      showToast('Erro ao aprovar reserva.', 'error');
    } finally {
      setConfirmDialog({ open: false, id: null, loading: false });
    }
  };

  const handleReject = (reservation) => setRejectModal({ open: true, reservation });
  const handleRedirect = (reservation) => setRedirectModal({ open: true, reservation });
  
  // 🚀 FUNÇÃO PARA ABRIR O MODAL DE DATAS
  const handleOpenDetails = (reservation) => {
    console.log("=== RESERVA CLICADA NO MODAL ===", reservation);
    setDetailsModal({ open: true, reservation })};
  
  const columns = [
    { field: 'professor_name', headerName: 'Professor', flex: 1, minWidth: 150 },
    { field: 'lab_name', headerName: 'Laboratório', flex: 1, minWidth: 150 },
    { 
      field: 'type', 
      headerName: 'Tipo', 
      width: 140,
      renderCell: (params) => (
        // 🚀 CHIP ATUALIZADO: Agora é um botão clicável!
        <Chip 
          label={params.value === 'SINGLE' ? 'Simples' : 'Recorrente'} 
          size="small" 
          color="primary" // Cor azul para chamar atenção
          variant={params.value === 'SINGLE' ? 'outlined' : 'filled'} 
          onClick={() => handleOpenDetails(params.row)} // Abre o modal
          clickable
          sx={{ fontWeight: 'bold' }}
        />
      ) 
    },
    { field: 'created_at',
      headerName: 'Solicitado em', 
      flex: 1,
      valueFormatter: (params) => dayjs(params.value).format('DD/MM/YYYY HH:mm') },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 280,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
          <Button variant="contained" color="success" size="small" onClick={() => handleOpenApprov(params.row.id)} sx={{ fontWeight: 'bold' }}>
            Aprovar
          </Button>
          <Button variant="outlined" color="error" size="small" onClick={() => handleReject(params.row)}>
            Rejeitar
          </Button>
          <Button variant="outlined" color="warning" size="small" onClick={() => handleRedirect(params.row)}>
            Redirecionar
          </Button>
        </Box>
      ),
    },
  ];

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 10 }} />;

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto', p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'sectionTitle' }}>
        Reservas Pendentes de Aprovação
      </Typography>

      {/* 🚀 AVISO NO TOPO DA PÁGINA */}
      <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3, borderRadius: 2 }}>
        <strong>Info:</strong> Clique na tag de <strong>Tipo</strong> (Simples ou Recorrente) na tabela abaixo para visualizar as <strong>datas e horários</strong> solicitados pelos Docentes.
      </Alert>

      <Paper elevation={2} sx={{ height: 600, width: '100%', borderRadius: 2, overflow: 'hidden' }}>
        <DataGrid
          rows={pendingReservations}
          columns={columns}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f8f9fa', borderBottom: '2px solid #e0e0e0', color: '#424242' },
            '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold', fontSize: '0.95rem' },
            '& .MuiDataGrid-cell': { borderBottom: '1px solid #f0f0f0', fontSize: '0.95rem' },
            '& .MuiDataGrid-row:hover': { backgroundColor: '#f5f5f5' },
            '& .MuiDataGrid-footerContainer': { borderTop: 'none', justifyContent: 'center' }
          }}
          slots={{
            pagination: CustomPagination,
            noRowsOverlay: () => (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography variant="h6" color="text.secondary">Nenhuma reserva aguardando aprovação 🎉</Typography>
              </Box>
            ),
          }}
        />
      </Paper>

      {/* 🚀 MODAL DE DETALHES DE DATA/HORÁRIO */}
      <Dialog 
        open={detailsModal.open} 
        onClose={() => setDetailsModal({ open: false, reservation: null })}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'primary.main', color: 'white', py: 2 }}>
          <EventIcon />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Datas Solicitadas</Typography>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 3 }}>
          {detailsModal.reservation && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                  Laboratório Requisitado
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                  {detailsModal.reservation.lab_name}
                </Typography>
              </Box>

              {/* LÓGICA DE EXIBIÇÃO: Simples vs Recorrente */}
             {/* LÓGICA DE EXIBIÇÃO: Simples vs Recorrente */}
              {detailsModal.reservation.type === 'SINGLE' ? (
                <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                  <Typography variant="body2" color="text.secondary">Data da Reserva:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {dayjs(detailsModal.reservation.date).format('DD/MM/YYYY')}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Horários Solicitados (Blocos):</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {detailsModal.reservation.time_slots?.map((slot, idx) => (
                      <Chip key={idx} label={slot} size="small" sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }} />
                    )) || <Typography variant="body2">Não especificado</Typography>}
                  </Box>
                </Box>
              ) : (
                <Box sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 2, border: '1px solid #90caf9' }}>
                  <Typography variant="body2" color="primary.dark">Período de Recorrência:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Início: {dayjs(detailsModal.reservation.start_date).format('DD/MM/YYYY')} <br />
                    Fim: {dayjs(detailsModal.reservation.end_date).format('DD/MM/YYYY')}
                  </Typography>

                  <Typography variant="body2" color="primary.dark">Dia da Semana:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {detailsModal.reservation.day_of_week || "Dia não especificado"}
                  </Typography>

                  <Typography variant="body2" color="primary.dark" sx={{ mb: 1 }}>Horários Solicitados (Blocos):</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {detailsModal.reservation.time_slots?.map((slot, idx) => (
                      <Chip key={idx} label={slot} size="small" sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }} />
                    )) || <Typography variant="body2">Não especificado</Typography>}
                  </Box>
                </Box>
              )}

              {detailsModal.reservation.note && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                    Observação do Professor
                  </Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    "{detailsModal.reservation.note}"
                  </Typography>
                </Box>
              )}

            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDetailsModal({ open: false, reservation: null })} variant="contained" disableElevation>
            Entendido
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog 
        open={confirmDialog.open}
        title="Confirmar Aprovação"
        message="Tem certeza que deseja aprovar esta reserva? O laboratório será alocado e o professor será notificado."
        onConfirm={handleConfirmApprove}
        onCancel={() => setConfirmDialog({ open: false, id: null, loading: false })}
        confirmText="Aprovar Reserva"
        cancelText="Cancelar"
        confirmColor="success"
        loading={confirmDialog.loading}
      />

      <RejectReservationModal open={rejectModal.open} reservation={rejectModal.reservation} onClose={() => setRejectModal({ open: false, reservation: null })} onConfirm={loadPendingReservations} showToast={showToast} />
      <RedirectReservationModal open={redirectModal.open} reservation={redirectModal.reservation} onClose={() => setRedirectModal({ open: false, reservation: null })} onConfirm={loadPendingReservations} showToast={showToast} />
    </Box>
  );
};

export default PendingReservationsPage;