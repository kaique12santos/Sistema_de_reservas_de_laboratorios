import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, Chip, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

import StaggerItem from '../../utils/StaggerItem';
import LoadingOverlay from '../../components/LoadingOverlay';
import Toast from '../../utils/Toast';

import TimeSlotFormModal from '../../components/TimeSlotFormModal';
import { timeSlotService } from '../../services/timeSlot.service';


// ─── confirm delete dialog ───────────────────────────────────────────────────
function ConfirmDeleteDialog({ open, slot, onConfirm, onCancel, loading, error }) {
  return (
    <Dialog open={open} onClose={onCancel} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <DialogTitle sx={{ color: 'error.main', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
        <CheckCircleIcon /> Confirmar Exclusão
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>
        )}
        <Typography>
          Tem certeza que deseja inativar o horário <strong>{slot?.name}</strong>?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Reservas futuras vinculadas a este período podem ser afetadas.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onCancel} color="inherit" sx={{ fontWeight: 'bold' }}>Cancelar</Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disableElevation
          disabled={loading}
          sx={{ fontWeight: 'bold' }}
        >
          {loading ? 'Inativando...' : 'Sim, Inativar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}


// ─── main page ───────────────────────────────────────────────────────────────
export default function TimeSlotsPage() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);

  const [deleteDialog, setDeleteDialog] = useState({ open: false, slot: null });
  const [deleteError, setDeleteError] = useState('');

  const [notify, setNotify] = useState({ open: false, message: '', severity: 'success' });
  const handleCloseNotify = (_, reason) => {
    if (reason === 'clickaway') return;
    setNotify(n => ({ ...n, open: false }));
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await timeSlotService.getAll();
      const sorted = [...data].sort((a, b) => {
        const toMin = (t) => { if (!t) return 0; const [h, m] = t.split(':').map(Number); return h * 60 + m; };
        return toMin(a.startTime) - toMin(b.startTime);
      });
      setSlots(sorted);
    } catch {
      setNotify({ open: true, message: 'Erro ao carregar horários.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (data) => {
    if (editingSlot) {
      await timeSlotService.update(editingSlot.id, data);
      setNotify({ open: true, message: `Horário ${data.name} atualizado!`, severity: 'success' });
    } else {
      await timeSlotService.create(data);
      setNotify({ open: true, message: `Horário ${data.name} criado!`, severity: 'success' });
    }
    await load();
  };

  const openCreate = () => { setEditingSlot(null); setFormOpen(true); };
  const openEdit = (slot) => { setEditingSlot(slot); setFormOpen(true); };
  const openDelete = (slot) => { setDeleteDialog({ open: true, slot }); setDeleteError(''); };

  const handleDelete = async () => {
    setActionLoading(true);
    setDeleteError('');
    try {
      await timeSlotService.delete(deleteDialog.slot.id);
      setDeleteDialog({ open: false, slot: null });
      setNotify({ open: true, message: `Horário ${deleteDialog.slot.name} inativado.`, severity: 'info' });
      await load();
    } catch (err) {
      setDeleteError(err?.response?.data?.message || 'Não foi possível inativar. Pode haver reservas futuras vinculadas.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box>
      <LoadingOverlay open={actionLoading} message="Processando..." />

      {/* CABEÇALHO */}
      <StaggerItem index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <ScheduleIcon color="primary" />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Períodos de Aula
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreate}
            disableElevation
            sx={{ fontWeight: 'bold' }}
          >
            Novo Período
          </Button>
        </Box>
      </StaggerItem>

      {/* TABELA */}
      <StaggerItem index={1}>
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #eee' }}>
          <Table sx={{ minWidth: 500 }}>
            <TableHead sx={{ bgcolor: '#fafafa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Período</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Início</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Fim</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>Carregando...</TableCell>
                </TableRow>
              ) : slots.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography variant="h6" color="text.secondary">
                      Nenhum período cadastrado.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                slots.map((slot, index) => (
                  <StaggerItem
                    key={slot.id}
                    component={TableRow}
                    index={index + 2}
                    delayStep={0.08}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{slot.name}</Typography>
                    </TableCell>
                    <TableCell>{slot.startTime || '—'}</TableCell>
                    <TableCell>{slot.endTime || '—'}</TableCell>
                    <TableCell>
                      <Chip
                        label={slot.active !== false ? 'Ativo' : 'Inativo'}
                        size="small"
                        color={slot.active !== false ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <Tooltip title="Editar">
                          <IconButton size="small" color="primary" onClick={() => openEdit(slot)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Inativar">
                          <IconButton size="small" color="error" onClick={() => openDelete(slot)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </StaggerItem>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </StaggerItem>

      {/* MODAL CRIAÇÃO/EDIÇÃO */}
      <TimeSlotFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        editingSlot={editingSlot}
      />

      {/* DIALOG CONFIRMAR DELETE */}
      <ConfirmDeleteDialog
        open={deleteDialog.open}
        slot={deleteDialog.slot}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, slot: null })}
        loading={actionLoading}
        error={deleteError}
      />

      {/* TOAST */}
      <Toast
        open={notify.open}
        handleClose={handleCloseNotify}
        message={notify.message}
        severity={notify.severity}
      />
    </Box>
  );
}
