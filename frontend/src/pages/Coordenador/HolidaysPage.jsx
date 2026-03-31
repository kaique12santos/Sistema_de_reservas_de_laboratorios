import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, IconButton, Tooltip, Alert,
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';

import StaggerItem from '../../utils/StaggerItem';
import LoadingOverlay from '../../components/LoadingOverlay';
import Toast from '../../utils/Toast';

import { holidayService } from '../../services/holiday.service';
import { academicCycleService } from '../../services/academicCycle.service';

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

const getDayOfWeek = (dateStr) => {
  if (!dateStr) return '—';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('pt-BR', { weekday: 'long' })
    .replace(/^\w/, c => c.toUpperCase());
};

export default function HolidaysPage() {
  const [holidays, setHolidays] = useState([]);
  const [activeCycle, setActiveCycle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [newDate, setNewDate] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const [editDialog, setEditDialog] = useState({ open: false, holiday: null });
  const [editDate, setEditDate] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const [notify, setNotify] = useState({ open: false, message: '', severity: 'success' });

  const handleCloseNotify = (_, reason) => {
    if (reason === 'clickaway') return;
    setNotify(n => ({ ...n, open: false }));
  };

  const showSuccess = (message) => setNotify({ open: true, message, severity: 'success' });
  const showError = (message) => setNotify({ open: true, message, severity: 'error' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const cycles = await academicCycleService.getAll();
      const active = cycles.find(c => c.active) || null;
      setActiveCycle(active);
      if (active) {
        const data = await holidayService.getByCycle(active.id);
        const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
        setHolidays(sorted);
      } else {
        setHolidays([]);
      }
    } catch {
      showError('Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!newDate) {
      showError('Selecione uma data');
      return;
    }

    const dateExists = holidays.some(h => h.date === newDate);
    if (dateExists) {
      showError('Já existe um feriado cadastrado nesta data');
      return;
    }

    const trimmedDesc = newDescription.trim().toLowerCase();
    if (trimmedDesc) {
      const descExists = holidays.some(h => h.description?.trim().toLowerCase() === trimmedDesc);
      if (descExists) {
        showError('Já existe um feriado com esta descrição');
        return;
      }
    }

    setActionLoading(true);
    try {
      const holiday = await holidayService.create({
        academic_cycle_id: activeCycle.id,
        date: newDate,
        description: newDescription
      });
      setHolidays(prev => [...prev, holiday].sort((a, b) => new Date(a.date) - new Date(b.date)));
      setNewDate('');
      setNewDescription('');
      showSuccess('Feriado adicionado!');
    } catch (error) {
      showError(error.response?.data?.error || 'Erro ao adicionar feriado');
    } finally {
      setActionLoading(false);
    }
  };

  const openEdit = (holiday) => {
    setEditDialog({ open: true, holiday });
    setEditDate(holiday.date);
    setEditDescription(holiday.description || '');
  };

  const closeEdit = () => {
    setEditDialog({ open: false, holiday: null });
  };

  const handleEdit = async () => {
    if (!editDate) {
      showError('Selecione uma data');
      return;
    }

    const currentId = editDialog.holiday.id;

    const dateExists = holidays.some(h => h.date === editDate && h.id !== currentId);
    if (dateExists) {
      showError('Já existe um feriado cadastrado nesta data');
      return;
    }

    const trimmedDesc = editDescription.trim().toLowerCase();
    if (trimmedDesc) {
      const descExists = holidays.some(
        h => h.description?.trim().toLowerCase() === trimmedDesc && h.id !== currentId
      );
      if (descExists) {
        showError('Já existe um feriado com esta descrição');
        return;
      }
    }

    setActionLoading(true);
    try {
      const updated = await holidayService.update(currentId, {
        date: editDate,
        description: editDescription
      });
      setHolidays(prev =>
        prev.map(h => h.id === currentId ? updated : h)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
      );
      closeEdit();
      showSuccess('Feriado atualizado!');
    } catch (error) {
      showError(error.response?.data?.error || 'Erro ao atualizar feriado');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await holidayService.delete(id);
      setHolidays(prev => prev.filter(h => h.id !== id));
      showSuccess('Feriado removido');
    } catch (error) {
      showError(error.response?.data?.error || 'Erro ao remover feriado');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box>
      <LoadingOverlay open={actionLoading} message="Processando..." />

      {/* CABEÇALHO */}
      <StaggerItem index={0}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <BeachAccessIcon color="primary" />
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Feriados{activeCycle ? ` — Ciclo ${activeCycle.name}` : ''}
          </Typography>
        </Box>
      </StaggerItem>

      {/* BANNER SEM CICLO ATIVO */}
      {!loading && !activeCycle && (
        <StaggerItem index={1}>
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
            ⚠️ Nenhum ciclo acadêmico ativo. Ative um ciclo antes de cadastrar feriados.
          </Alert>
        </StaggerItem>
      )}

      {/* FORMULÁRIO INLINE */}
      {activeCycle && (
        <StaggerItem index={1}>
          <Paper elevation={0} sx={{ border: '1px solid #eee', borderRadius: 2, p: 2.5, mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: 'text.secondary' }}>
              ADICIONAR FERIADO
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <TextField
                label="Data" type="date" required size="small"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 180 }}
              />
              <TextField
                label="Descrição" placeholder="Ex: Tiradentes" size="small"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                sx={{ minWidth: 240, flexGrow: 1 }}
              />
              <Button
                variant="contained" startIcon={<AddIcon />}
                onClick={handleAdd} disableElevation
                sx={{ fontWeight: 'bold', height: 40 }}
              >
                Adicionar Feriado
              </Button>
            </Box>
          </Paper>
        </StaggerItem>
      )}

      {/* TABELA */}
      <StaggerItem index={2}>
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #eee' }}>
          <Table sx={{ minWidth: 500 }}>
            <TableHead sx={{ bgcolor: '#fafafa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Data</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Dia da Semana</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Descrição</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>Carregando...</TableCell>
                </TableRow>
              ) : holidays.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                    <Typography variant="h6" color="text.secondary">
                      Nenhum feriado cadastrado para este ciclo.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                holidays.map((holiday, index) => (
                  <StaggerItem
                    key={holiday.id}
                    component={TableRow}
                    index={index + 3}
                    delayStep={0.08}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {formatDate(holiday.date)}
                      </Typography>
                    </TableCell>
                    <TableCell>{getDayOfWeek(holiday.date)}</TableCell>
                    <TableCell>{holiday.description || '—'}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <Tooltip title="Editar feriado">
                          <IconButton size="small" color="primary" onClick={() => openEdit(holiday)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remover feriado">
                          <IconButton size="small" color="error" onClick={() => handleDelete(holiday.id)}>
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

      {/* MODAL EDITAR */}
      <Dialog
        open={editDialog.open}
        onClose={closeEdit}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Editar Feriado
          <IconButton onClick={closeEdit} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Data" type="date" fullWidth required
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Descrição" fullWidth
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeEdit} color="inherit" sx={{ fontWeight: 'bold' }}>Cancelar</Button>
          <Button onClick={handleEdit} variant="contained" color="primary" disableElevation sx={{ fontWeight: 'bold' }}>
            Salvar Alterações
          </Button>
        </DialogActions>
      </Dialog>

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