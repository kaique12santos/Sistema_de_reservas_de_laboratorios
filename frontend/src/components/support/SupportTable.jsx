import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, Box, IconButton, Menu, MenuItem, Typography
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import StaggerItem from '../../utils/StaggerItem';

export default function UserTable({ users, onApprove, onChangeRole, onToggleStatus }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleOpenMenu = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

    const getBadgeConfig = (user) => {
    if (user.status === 'PENDING') return { label: 'Pendente', color: 'warning' };
    if (user.status === 'REJECTED') return { label: 'Rejeitado', color: 'error' };
    if (user.status === 'APPROVED' && user.is_active === 1) return { label: 'Ativo', color: 'success' };
    if (user.status === 'APPROVED' && user.is_active === 0) return { label: 'Bloqueado', color: 'error' };
    return { label: 'Desconhecido', color: 'default' };
  };

  const getRoleLabel = (role) => {
    switch (role?.toUpperCase()) {
      case 'PROFESSOR': return 'Professor';
      case 'ADMIN': return 'Coordenador (Admin)';
      case 'SUPPORT': return 'Suporte';
      default: return 'Usuário Padrão';
    }
  };

  if (users.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 5, textAlign: 'center', borderRadius: 2 }}>
        <Typography variant="h6" color="text.secondary">Nenhum usuário encontrado neste filtro.</Typography>
      </Paper>
    );
  }

  return (
    <>
      <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Nome</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>E-mail</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Cargo</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((row, index) => {
              const badge = getBadgeConfig(row); // 👈 Chamando a função para pegar cor e texto
              
              return (
                <StaggerItem key={row.id} component={TableRow} index={index} delayStep={0.05} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>{row.nome}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{getRoleLabel(row.role)}</TableCell>
                  <TableCell>
                    <Chip label={badge.label} color={badge.color} size="small" sx={{ fontWeight: 'bold', borderRadius: 1 }} />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={(e) => handleOpenMenu(e, row)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </StaggerItem>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* MENU FLUTUANTE DE AÇÕES */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        
        {/* Só mostra aprovar se estiver PENDENTE */}
        {selectedUser?.status === 'PENDING' && [
          <MenuItem key="approve" onClick={() => { onApprove(selectedUser); handleCloseMenu(); }}>
            <CheckCircleIcon fontSize="small" color="success" sx={{ mr: 1 }} /> Aprovar Cadastro
          </MenuItem>
        ]}
        
        {/* Só mexe em cargo e bloqueio se já foi APROVADO */}
        {selectedUser?.status === 'APPROVED' && [
          <MenuItem key="role" onClick={() => { onChangeRole(selectedUser); handleCloseMenu(); }}>
            <ManageAccountsIcon fontSize="small" color="primary" sx={{ mr: 1 }} /> Alterar Cargo
          </MenuItem>,
          <MenuItem key="status" onClick={() => { onToggleStatus(selectedUser); handleCloseMenu(); }}>
            {/* 👇 Lógica do botão inverte dependendo do is_active */}
            <BlockIcon fontSize="small" color={selectedUser?.is_active === 1 ? 'error' : 'success'} sx={{ mr: 1 }} /> 
            {selectedUser?.is_active === 1 ? 'Bloquear Acesso' : 'Desbloquear Acesso'}
          </MenuItem>
        ]}
      </Menu>
    </>
  );
}