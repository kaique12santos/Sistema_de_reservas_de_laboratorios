import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, Chip, Pagination } from '@mui/material';
import { 
  DataGrid, 
  gridPageCountSelector, 
  gridPageSelector, 
  useGridApiContext, 
  useGridSelector 
} from '@mui/x-data-grid';
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

  // Esconde a paginação se houver apenas 1 página (Design Limpo)
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

  const handleReject = (reservation) => {
    setRejectModal({ open: true, reservation });
  };

  const handleRedirect = (reservation) => {
    setRedirectModal({ open: true, reservation });
  };


  const columns = [
    { field: 'professor_name', headerName: 'Professor', flex: 1, minWidth: 150 },
    { field: 'lab_name', headerName: 'Laboratório', flex: 1, minWidth: 150 },
    { field: 'type', 
      headerName: 'Tipo', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value === 'SINGLE' ? 'Simples' : 'Recorrente'} 
          size="small" 
          variant="outlined" 
        />
      ) },
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
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => handleOpenApprov(params.row.id)}
            sx={{ fontWeight: 'bold' }}
          >
            Aprovar
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleReject(params.row)}
          >
            Rejeitar
          </Button>
          <Button
            variant="outlined"
            color="warning"
            size="small"
            onClick={() => handleRedirect(params.row)}
          >
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

      <Paper elevation={2} sx={{ height: 600, width: '100%', borderRadius: 2, overflow: 'hidden' }}>
        <DataGrid
          rows={pendingReservations}
          columns={columns}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} // Mantivemos 10 por página[cite: 6]
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8f9fa',
              borderBottom: '2px solid #e0e0e0',
              color: '#424242',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 'bold',
              fontSize: '0.95rem',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f0f0f0',
              fontSize: '0.95rem',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f5f5f5',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: 'none',
              justifyContent: 'center',
            }
          }}
          slots={{
            pagination: CustomPagination,
            noRowsOverlay: () => (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography variant="h6" color="text.secondary">
                  Nenhuma reserva aguardando aprovação 🎉
                </Typography>
              </Box>
            ),
          }}
        />
      </Paper>

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

      <RejectReservationModal
        open={rejectModal.open}
        reservation={rejectModal.reservation}
        onClose={() => setRejectModal({ open: false, reservation: null })}
        onConfirm={loadPendingReservations}
        showToast={showToast}
      />

      <RedirectReservationModal
        open={redirectModal.open}
        reservation={redirectModal.reservation}
        onClose={() => setRedirectModal({ open: false, reservation: null })}
        onConfirm={loadPendingReservations}
        showToast={showToast}
      />
    </Box>
  );
};

export default PendingReservationsPage;