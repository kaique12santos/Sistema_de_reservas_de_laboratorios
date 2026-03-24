import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Chip, FormControlLabel, Checkbox
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';

import StaggerItem from '../../utils/StaggerItem';
import LoadingOverlay from '../../components/LoadingOverlay';
import Toast from '../../utils/Toast';

import { laboratoryService } from '../../services/laboratory.service';
import LaboratoryFormModal from '../../components/LaboratoryFormModal';

const ManageLaboratoriesPage = () => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Filtros
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [showInactive, setShowInactive] = useState(false);

  // Controle de Modais
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null);

  // Toast Global
  const [notify, setNotify] = useState({ open: false, message: '', severity: 'success' });
  const showToast = (message, severity = 'success') => setNotify({ open: true, message, severity });

  // Carrega os dados
  const loadLabs = async () => {
    setLoading(true);
    try {
      const data = await laboratoryService.getAll(showInactive);
      setLabs(data);
    } catch (error) {
      showToast('Erro ao carregar laboratórios', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLabs();
  }, [showInactive]); // Recarrega se alterar o checkbox de inativos

  const filteredLabs = useMemo(() => {
    if (typeFilter === 'Todos') return labs;
    return labs.filter(lab => lab.type === typeFilter);
  }, [labs, typeFilter]);

  // AÇÕES: CREATE / UPDATE
  const handleOpenForm = (lab = null) => {
    setSelectedLab(lab);
    setFormModalOpen(true);
  };

  const handleSaveLab = async (formData) => {
    setActionLoading(true);
    try {
      if (selectedLab) { // Edit
        const updatedLab = await laboratoryService.update(selectedLab.id, formData);
        setLabs(labs.map(l => l.id === selectedLab.id ? updatedLab : l));
        showToast('Laboratório atualizado com sucesso!');
      } else { // Create
        const newLab = await laboratoryService.create(formData);
        setLabs([...labs, newLab]);
        showToast('Laboratório criado com sucesso!');
      }
      setFormModalOpen(false);
    } catch (error) {
      // Tratamento específico de erro do backend (ex: Nome duplicado)
      if (error.response?.status === 400) {
        showToast(error.response.data.error || 'Dados inválidos.', 'error');
      } else {
        showToast('Erro ao salvar laboratório.', 'error');
      }
    } finally {
      setActionLoading(false);
    }
  };

  // AÇÕES: DELETE (Inativar)
  const handleOpenDelete = (lab) => {
    setSelectedLab(lab);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await laboratoryService.delete(selectedLab.id);
      
      // Atualiza a lista na tela (remover ou mudar status, dependendo do backend)
      // Aqui, vamos apenas removê-lo da view de ativos para UX imediata
      setLabs(labs.filter(l => l.id !== selectedLab.id));
      showToast('Laboratório inativado com sucesso.');
      setDeleteModalOpen(false);
    } catch (error) {
      // A Mágica do Erro de Reserva Futura da Task:
      const errorMsg = error.response?.data?.error;
      if (errorMsg && errorMsg.includes('reservas futuras')) {
        showToast('Laboratório possui reservas futuras. Cancele-as primeiro.', 'error');
      } else {
        showToast('Erro ao inativar laboratório.', 'error');
      }
      setDeleteModalOpen(false); // Fecha o modal mesmo se der erro, pra mostrar o toast
    } finally {
      setActionLoading(false);
      setSelectedLab(null);
    }
  };

  return (
      <Box>
        <LoadingOverlay open={actionLoading} message="Processando..." />
        <Toast open={notify.open} handleClose={(e, r) => r !== 'clickaway' && setNotify({...notify, open: false})} message={notify.message} severity={notify.severity} />

        {/* HEADER & ACTIONS */}
        <StaggerItem index={0}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, mb: 4, gap: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>Gestão de Laboratórios</Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' } }}>
              <FormControlLabel 
                control={<Checkbox checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)} color="primary" />} 
                label="Mostrar Inativos" sx={{ color: 'text.secondary' }}
              />
              <TextField
                select size="small" label="Filtrar por Tipo" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} sx={{ bgcolor: '#fff', borderRadius: 1, minWidth: 150 }}
              >
                <MenuItem value="Todos">Todos</MenuItem>
                <MenuItem value="Laboratório">Laboratório</MenuItem>
                <MenuItem value="Sala de Aula">Sala de Aula</MenuItem>
                <MenuItem value="Auditório">Auditório</MenuItem>
              </TextField>
              <Button variant="contained" color="primary" startIcon={<AddIcon />} disableElevation onClick={() => handleOpenForm(null)} sx={{ fontWeight: 'bold' }}>
                Novo Laboratório
              </Button>
            </Box>
          </Box>
        </StaggerItem>

        {/* TABELA DE LABORATÓRIOS */}
        <StaggerItem index={1}>
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #eee' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: '#fafafa' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Localização</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Capacidade</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3 }}>Carregando...</TableCell></TableRow>
                ) : filteredLabs.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><Typography color="text.secondary">Nenhum laboratório encontrado.</Typography></TableCell></TableRow>
                ) : (
                  filteredLabs.map((lab, index) => (
                    <StaggerItem key={lab.id} component={TableRow} index={index + 2} delayStep={0.08} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>{lab.name}</TableCell>
                      <TableCell>{lab.location || '-'}</TableCell>
                      <TableCell align="center">{lab.capacity}</TableCell>
                      <TableCell>{lab.type}</TableCell>
                      <TableCell>
                        <Chip label={lab.status} color={lab.status === 'Ativo' ? 'success' : 'default'} size="small" sx={{ fontWeight: 'bold', borderRadius: 1 }} />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" onClick={() => handleOpenForm(lab)} size="small"><EditIcon /></IconButton>
                        <IconButton color="error" onClick={() => handleOpenDelete(lab)} size="small" disabled={lab.status === 'Inativo'}><DeleteIcon /></IconButton>
                      </TableCell>
                    </StaggerItem>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </StaggerItem>

        {/* MODAL DE FORMULÁRIO (Componente Isolado) */}
        <LaboratoryFormModal open={formModalOpen} onClose={() => setFormModalOpen(false)} onSave={handleSaveLab} initialData={selectedLab} />

        {/* MODAL DE CONFIRMAÇÃO DE INATIVAÇÃO */}
        <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
          <DialogTitle sx={{ color: 'error.main', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon /> Inativar Laboratório
          </DialogTitle>
          <DialogContent>
            <Typography>Tem certeza que deseja inativar <strong>{selectedLab?.name}</strong>?</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Laboratórios inativos não aparecem nas opções de nova reserva para os professores.</Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDeleteModalOpen(false)} color="inherit" sx={{ fontWeight: 'bold' }}>Cancelar</Button>
            <Button onClick={handleDelete} variant="contained" color="error" disableElevation sx={{ fontWeight: 'bold' }}>Sim, Inativar</Button>
          </DialogActions>
        </Dialog>

      </Box>
  );
};

export default ManageLaboratoriesPage;