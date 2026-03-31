import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, Chip, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert,
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import StaggerItem from '../../utils/StaggerItem';
import LoadingOverlay from '../../components/LoadingOverlay';
import Toast from '../../utils/Toast';

import AcademicCycleFormModal from "../../components/AcademicCycleFormModal";
import { academicCycleService } from '../../services/academicCycle.service';

const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('pt-BR');
};


// ─── dialog ativar ────────────────────────────────────────────────────────────
function ConfirmActivateDialog({ open, cycle, onConfirm, onCancel, loading }) {
  return (
    <Dialog open={open} onClose={onCancel} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <DialogTitle sx={{ color: 'success.main', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
        <CheckCircleIcon /> Ativar Ciclo
      </DialogTitle>
      <DialogContent>
        <Typography>
          Tem certeza que deseja ativar o ciclo <strong>{cycle?.name}</strong>?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          O ciclo atual será desativado e este passará a ser o vigente.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onCancel} color="inherit" sx={{ fontWeight: 'bold' }}>Cancelar</Button>
        <Button onClick={onConfirm} variant="contained" color="success" disableElevation disabled={loading} sx={{ fontWeight: 'bold' }}>
          {loading ? 'Ativando...' : 'Sim, Ativar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}


// ─── dialog deletar ───────────────────────────────────────────────────────────
function ConfirmDeleteDialog({ open, cycle, onConfirm, onCancel, loading, error }) {
  return (
    <Dialog open={open} onClose={onCancel} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <DialogTitle sx={{ color: 'error.main', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
        <DeleteIcon /> Confirmar Exclusão
      </DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
        <Typography>
          Tem certeza que deseja excluir o ciclo <strong>{cycle?.name}</strong>?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Esta ação não poderá ser desfeita.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onCancel} color="inherit" sx={{ fontWeight: 'bold' }}>Cancelar</Button>
        <Button onClick={onConfirm} variant="contained" color="error" disableElevation disabled={loading} sx={{ fontWeight: 'bold' }}>
          {loading ? 'Excluindo...' : 'Sim, Excluir'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}


// ─── page ─────────────────────────────────────────────────────────────────────
export default function AcademicCyclesPage() {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingCycle, setEditingCycle] = useState(null);

  const [activateDialog, setActivateDialog] = useState({ open: false, cycle: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, cycle: null });
  const [deleteError, setDeleteError] = useState('');

  const [notify, setNotify] = useState({ open: false, message: '', severity: 'success' });
  const handleCloseNotify = (_, reason) => {
    if (reason === 'clickaway') return;
    setNotify(n => ({ ...n, open: false }));
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await academicCycleService.getAll();
      setCycles(data);
    } catch {
      setNotify({ open: true, message: 'Erro ao carregar ciclos acadêmicos.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (data) => {
    if (editingCycle) {
      await academicCycleService.update(editingCycle.id, data);
      setNotify({ open: true, message: `Ciclo ${data.name} atualizado!`, severity: 'success' });
    } else {
      await academicCycleService.create(data);
      setNotify({ open: true, message: `Ciclo ${data.name} criado!`, severity: 'success' });
    }
    await load();
  };

  const handleActivate = async () => {
    setActionLoading(true);
    try {
      await academicCycleService.activate(activateDialog.cycle.id);
      setActivateDialog({ open: false, cycle: null });
      setNotify({ open: true, message: `Ciclo ${activateDialog.cycle.name} ativado!`, severity: 'success' });
      await load();
    } catch (err) {
      setNotify({ open: true, message: err?.response?.data?.message || 'Erro ao ativar ciclo.', severity: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    setDeleteError('');
    try {
      await academicCycleService.delete(deleteDialog.cycle.id);
      setDeleteDialog({ open: false, cycle: null });
      setNotify({ open: true, message: `Ciclo ${deleteDialog.cycle.name} excluído.`, severity: 'info' });
      await load();
    } catch (err) {
      setDeleteError(err?.response?.data?.message || 'Não foi possível excluir este ciclo.');
    } finally {
      setActionLoading(false);
    }
  };

  const openCreate = () => { setEditingCycle(null); setFormOpen(true); };
  const openEdit = (cycle) => { setEditingCycle(cycle); setFormOpen(true); };
  const openActivate = (cycle) => setActivateDialog({ open: true, cycle });
  const openDelete = (cycle) => { setDeleteDialog({ open: true, cycle }); setDeleteError(''); };

  return (
    <Box>
      <LoadingOverlay open={actionLoading} message="Processando..." />

      {/* CABEÇALHO */}
      <StaggerItem index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CalendarMonthIcon color="primary" />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Ciclos Acadêmicos
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate} disableElevation sx={{ fontWeight: 'bold' }}>
            Novo Ciclo
          </Button>
        </Box>
      </StaggerItem>

      {/* TABELA */}
      <StaggerItem index={1}>
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #eee' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: '#fafafa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Início</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Fim</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Fim Exclusivo Coordenador</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>Carregando...</TableCell>
                </TableRow>
              ) : cycles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography variant="h6" color="text.secondary">
                      Nenhum ciclo acadêmico cadastrado.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                cycles.map((cycle, index) => (
                  <StaggerItem
                    key={cycle.id}
                    component={TableRow}
                    index={index + 2}
                    delayStep={0.08}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{cycle.name}</Typography>
                    </TableCell>
                    <TableCell>{formatDate(cycle.startDate)}</TableCell>
                    <TableCell>{formatDate(cycle.endDate)}</TableCell>
                    <TableCell>{formatDate(cycle.coordEndDate)}</TableCell>
                    <TableCell>
                      <Chip
                        label={cycle.active ? 'Ativo' : 'Inativo'}
                        size="small"
                        color={cycle.active ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        {!cycle.active && (
                          <Tooltip title="Ativar ciclo">
                            <IconButton size="small" color="success" onClick={() => openActivate(cycle)}>
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Editar">
                          <IconButton size="small" color="primary" onClick={() => openEdit(cycle)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton size="small" color="error" onClick={() => openDelete(cycle)} disabled={cycle.active}>
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
      <AcademicCycleFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        editingCycle={editingCycle}
        existingNames={cycles.map(c => c.name)}
      />

      {/* DIALOG ATIVAR */}
      <ConfirmActivateDialog
        open={activateDialog.open}
        cycle={activateDialog.cycle}
        onConfirm={handleActivate}
        onCancel={() => setActivateDialog({ open: false, cycle: null })}
        loading={actionLoading}
      />

      {/* DIALOG DELETAR */}
      <ConfirmDeleteDialog
        open={deleteDialog.open}
        cycle={deleteDialog.cycle}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, cycle: null })}
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