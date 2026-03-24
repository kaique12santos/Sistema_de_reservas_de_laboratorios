import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Chip, InputAdornment
} from '@mui/material';

// Ícones
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

// Utilitários de UX (ajuste os caminhos conforme seu projeto)
import StaggerItem from '../../utils/StaggerItem';
import LoadingOverlay from '../../components/LoadingOverlay';
import Toast from '../../utils/Toast';

// Serviço
import { userService } from '../../services/user.service';

const PendingUsersPage = () => {
  // --- ESTADOS EXIGIDOS NA TASK ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false); // Para o LoadingOverlay
  
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // --- ESTADOS DE FILTRO (Recomendado na task) ---
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('Todos');

// --- ESTADO DO TOAST REAL ---
  const [notify, setNotify] = useState({
    open: false,
    message: '',
    severity: 'success' // success, error, warning, info
  });

  // Função para fechar o Toast suavemente
  const handleCloseNotify = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotify({ ...notify, open: false });
  };

  // --- EFEITO: CARREGAR USUÁRIOS ---
  useEffect(() => {
    async function loadPendingUsers() {
      try {
        const data = await userService.getPending();
        setUsers(data);
      } catch (error) {
        setNotify({ open: true, message: 'Erro ao carregar usuários pendentes', severity: 'error' });
      } finally {
        setLoading(false);
      }
    }
    loadPendingUsers();
  }, []);

  // --- LÓGICA DE FILTRAGEM ---
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDept = departmentFilter === 'Todos' || u.department === departmentFilter;
      return matchSearch && matchDept;
    });
  }, [users, searchTerm, departmentFilter]);

  // --- AÇÕES: APROVAR ---
  const handleOpenApprove = (user) => {
    setSelectedUser(user);
    setShowApproveModal(true);
  };

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await userService.approve(selectedUser.id);
      setNotify({ open: true, message: 'Usuário aprovado com sucesso!', severity: 'success' });
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setShowApproveModal(false);
    } catch (error) {
      setNotify({ open: true, message: error.message || 'Erro ao aprovar', severity: 'error' });
    } finally {
      setActionLoading(false);
      setSelectedUser(null);
    }
  };

  // --- AÇÕES: REJEITAR ---
  const handleOpenReject = (user) => {
    setSelectedUser(user);
    setRejectionReason(''); // Limpa o motivo anterior
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setNotify({ open: true, message: 'O motivo da rejeição é obrigatório.', severity: 'error' });
      return;
    }

    setActionLoading(true);
    try {
      await userService.reject(selectedUser.id, rejectionReason);
      setNotify({ open: true, message: 'Usuário rejeitado com sucesso.', severity: 'success' });
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setShowRejectModal(false);
    } catch (error) {
      setNotify({ open: true, message: error.message || 'Erro ao rejeitar', severity: 'error' });
    } finally {
      setActionLoading(false);
      setSelectedUser(null);
    }
  };

  return (
      <Box>
        <LoadingOverlay open={actionLoading} message="Processando..." />

        {/* CABEÇALHO E FILTROS */}
        <StaggerItem index={0}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, mb: 4, gap: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Aprovação de Cadastros
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                size="small"
                placeholder="Buscar por nome ou e-mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
                sx={{ bgcolor: '#fff', borderRadius: 1, minWidth: 250 }}
              />
              <TextField
                select
                size="small"
                label="Departamento"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                sx={{ bgcolor: '#fff', borderRadius: 1, minWidth: 200 }}
              >
                <MenuItem value="Todos">Todos</MenuItem>
                <MenuItem value="Desenvolvimento de Software Multiplataforma">DSM</MenuItem>
                <MenuItem value="Gestão de Recursos Humanos">Gestão de RH</MenuItem>
              </TextField>
            </Box>
          </Box>
        </StaggerItem>

        {/* TABELA DE USUÁRIOS */}
        <StaggerItem index={1}>
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #eee' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: '#fafafa' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Nome / E-mail</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Departamento</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Data de Cadastro</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3 }}>Carregando...</TableCell></TableRow>
                ) : filteredUsers.length === 0 ? (
                  // ESTADO VAZIO (Critério de Aceite)
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                      <Typography variant="h6" color="text.secondary">
                        Nenhum usuário aguardando aprovação.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user, index) => (
                    <StaggerItem key={user.id} component={TableRow} index={index + 2} delayStep={0.08} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{user.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Button 
                            variant="contained" color="success" size="small" disableElevation
                            startIcon={<CheckCircleIcon />} onClick={() => handleOpenApprove(user)}
                          >
                            Aprovar
                          </Button>
                          <Button 
                            variant="contained" color="error" size="small" disableElevation
                            startIcon={<CancelIcon />} onClick={() => handleOpenReject(user)}
                          >
                            Rejeitar
                          </Button>
                        </Box>
                      </TableCell>
                    </StaggerItem>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </StaggerItem>

        {/* ========================================== */}
        {/* MODAL: APROVAR USUÁRIO */}
        {/* ========================================== */}
        <Dialog open={showApproveModal} onClose={() => setShowApproveModal(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
          <DialogTitle sx={{ color: 'success.main', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon /> Confirmar Aprovação
          </DialogTitle>
          <DialogContent>
            <Typography>Tem certeza que deseja aprovar o cadastro de <strong>{selectedUser?.name}</strong>?</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              O usuário receberá um e-mail de confirmação e terá acesso imediato ao sistema.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setShowApproveModal(false)} color="inherit" sx={{ fontWeight: 'bold' }}>Cancelar</Button>
            <Button onClick={handleApprove} variant="contained" color="success" disableElevation sx={{ fontWeight: 'bold' }}>Sim, Aprovar</Button>
          </DialogActions>
        </Dialog>

        {/* ========================================== */}
        {/* MODAL: REJEITAR USUÁRIO */}
        {/* ========================================== */}
        <Dialog open={showRejectModal} onClose={() => setShowRejectModal(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
          <DialogTitle sx={{ color: 'error.main', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><CancelIcon /> Rejeitar Cadastro</Box>
            <IconButton onClick={() => setShowRejectModal(false)} size="small"><CloseIcon /></IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Typography sx={{ mb: 2 }}>
              Você está rejeitando o acesso de <strong>{selectedUser?.name}</strong>.
            </Typography>
            
            <TextField
              label="Motivo da Rejeição (obrigatório)"
              placeholder="Ex: O e-mail utilizado não consta na base de professores do departamento."
              multiline
              rows={3}
              fullWidth
              required
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              error={rejectionReason.length === 0} // Dica visual de obrigatoriedade
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setShowRejectModal(false)} color="inherit" sx={{ fontWeight: 'bold' }}>Cancelar</Button>
            <Button 
              onClick={handleReject} variant="contained" color="error" disableElevation 
              disabled={!rejectionReason.trim()} // Bloqueia o botão se estiver vazio
              sx={{ fontWeight: 'bold' }}
            >
              Rejeitar Usuário
            </Button>
          </DialogActions>
        </Dialog>

        {/* ========================================== */}
        {/* TOAST DE NOTIFICAÇÃO (COMPONENTE GLOBAL)   */}
        {/* ========================================== */}
        <Toast 
          open={notify.open} 
          handleClose={handleCloseNotify} 
          message={notify.message} 
          severity={notify.severity} 
        />
      </Box>
  );
};

export default PendingUsersPage;