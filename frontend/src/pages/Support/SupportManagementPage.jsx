import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography, MenuItem, TextField, CircularProgress } from "@mui/material";
import StaggerItem from "../../utils/StaggerItem";
import SupportTable from "../../components/support/SupportTable";
import ConfirmDialog from "../../utils/ConfirmDialog";
import { useNotification } from "../../context/NotificationContext";
import { userService } from "../../services/user.service";

const SupportManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("TODOS");
  // eslint-disable-next-line no-unused-vars
  const { showSuccess, showError, showWarning, showInfo } = useNotification();

  // Estados dos Modais
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState(null); // 'APPROVE', 'ROLE', 'STATUS'
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('PROFESSOR'); // Para o modal de cargo
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      showError('Erro ao carregar usuários.');
    } finally {
      setLoading(false);
    }
  };

    const usersFiltered = useMemo(() => {
        if (statusFilter === "TODOS") return users;
        if (statusFilter === "PENDING") return users.filter(u => u.status === 'PENDING');
        if (statusFilter === "ACTIVE") return users.filter(u => u.status === 'APPROVED' && u.is_active === 1);
        if (statusFilter === "BLOCKED") return users.filter(u => u.status === 'APPROVED' && u.is_active === 0);
        return users;
    }, [users, statusFilter]);

  // Actions que abrem os modais correspondentes
  const handleActionClick = (user, actionType) => {
    setSelectedUser(user);
    setDialogAction(actionType);
    setSelectedRole(user.role === 'USER' ? 'PROFESSOR' : user.role); // Reseta o select de cargo
    setConfirmOpen(true);
  };

  const executeAction = async () => {
    setProcessing(true);
    try {
      if (dialogAction === 'APPROVE') {
        await userService.approve(selectedUser.id, selectedRole);
        showSuccess('Usuário aprovado com sucesso!');
      } else if (dialogAction === 'ROLE') {
        await userService.changeUserRole(selectedUser.id, selectedRole);
        showSuccess('Cargo alterado com sucesso!');
      } else if (dialogAction === 'STATUS') {
        await userService.toggleUserStatus(selectedUser.id);
        showSuccess('Status alterado com sucesso!');
      }
      setConfirmOpen(false);
      loadUsers(); // Recarrega a tabela
    } catch (error) {
      showError('Erro ao processar ação.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 10 }} />;

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <StaggerItem index={0}>
        <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, justifyContent: "space-between", alignItems: { xs: 'stretch', sm: 'center' }, gap: 2, mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "sectionTitle" }}>
            Gestão de Usuários
          </Typography>

         <TextField select size="small" label="Filtrar por Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 200, bgcolor: "background.paper", borderRadius: 1 }}>
            <MenuItem value="TODOS">Todos</MenuItem>
            <MenuItem value="PENDING">Pendentes</MenuItem>
            <MenuItem value="ACTIVE">Ativos</MenuItem>
            <MenuItem value="BLOCKED">Bloqueados</MenuItem>
          </TextField>
        </Box>
      </StaggerItem>

      <StaggerItem index={1}>
        <SupportTable 
          users={usersFiltered} 
          onApprove={(user) => handleActionClick(user, 'APPROVE')}
          onChangeRole={(user) => handleActionClick(user, 'ROLE')}
          onToggleStatus={(user) => handleActionClick(user, 'STATUS')}
        />
      </StaggerItem>

      {/* MODAL AJUSTADO PARA LER IS_ACTIVE */}
      <ConfirmDialog
        open={confirmOpen}
        title={
          dialogAction === 'APPROVE' ? `Aprovar ${selectedUser?.nome}` :
          dialogAction === 'ROLE' ? `Alterar Cargo de ${selectedUser?.nome}` :
          `${selectedUser?.is_active === 1 ? 'Bloquear' : 'Desbloquear'} ${selectedUser?.nome}`
        }
        message={
          dialogAction === 'STATUS' 
            ? `Tem certeza que deseja ${selectedUser?.is_active === 1 ? 'bloquear o acesso de' : 'restaurar o acesso de'} ${selectedUser?.nome}?` 
            : (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Selecione o cargo que este usuário terá no sistema:
                </Typography>
                <TextField select fullWidth size="small" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                  <MenuItem value="PROFESSOR">Professor (Reserva Labs)</MenuItem>
                  <MenuItem value="ADMIN">Coordenador (Aprova Reservas)</MenuItem>
                  <MenuItem value="SUPPORT">Suporte (Gere Sistema)</MenuItem>
                </TextField>
              </Box>
            )
        }
        confirmText="Confirmar"
        cancelText="Cancelar"
        confirmColor={dialogAction === 'STATUS' && selectedUser?.is_active === 1 ? 'error' : 'primary'}
        loading={processing}
        onConfirm={executeAction}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
};

export default SupportManagementPage;