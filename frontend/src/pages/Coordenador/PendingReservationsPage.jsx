import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { reservationService } from '../../services/Reservation.service';
import Toast from '../../utils/Toast';
import RejectReservationModal from '../common/RejectReservationModal';
import RedirectReservationModal from '../common/RedirectReservationModal';

const PendingReservationsPage = () => {
  const [pendingReservations, setPendingReservations] = useState([]);
  const [loading, setLoading] = useState(true);
 const [notify, setNotify] = useState({ open: false, message: '', severity: 'success' });
  const [rejectModal, setRejectModal] = useState({ open: false, reservation: null });
  const [redirectModal, setRedirectModal] = useState({ open: false, reservation: null });

  const showToast = (message, severity = 'success') => {
    setNotify({ open: true, message, severity });
  };

  useEffect(() => {
    loadPendingReservations();
  }, []);

  const loadPendingReservations = async () => {
    try {
      const data = await reservationService.getPending();
      setPendingReservations(data);
    } catch (error) {
      showToast('Erro ao carregar reservas pendentes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await reservationService.approve(id);
      showToast('Reserva aprovada com sucesso!', 'success');
      loadPendingReservations();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro ao aprovar reserva.';
      showToast(errorMessage, 'error');
    }
  };

  const handleReject = (reservation) => {
    setRejectModal({ open: true, reservation });
  };

  const handleRedirect = (reservation) => {
    setRedirectModal({ open: true, reservation });
  };

  const handleCloseNotify = () => {
    setNotify({ ...notify, open: false });
  };

  const columns = [
    { field: 'professor', headerName: 'Professor', width: 150 },
    { field: 'lab', headerName: 'Laboratório', width: 150 },
    { field: 'type', headerName: 'Tipo', width: 120 },
    { field: 'total_occurrences', headerName: 'Total Ocorrências', width: 150 },
    { field: 'period', headerName: 'Período', width: 200 },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 300,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => handleApprove(params.row.id)}
            sx={{ mr: 1 }}
          >
            Aprovar
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleReject(params.row)}
            sx={{ mr: 1 }}
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
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Reservas Pendentes de Aprovação
      </Typography>

     <Paper elevation={1} sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={pendingReservations}
          columns={columns}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10]}
          disableSelectionOnClick
          slots={{
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

      <Toast
        open={notify.open}
        handleClose={handleCloseNotify}
        message={notify.message}
        severity={notify.severity}
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