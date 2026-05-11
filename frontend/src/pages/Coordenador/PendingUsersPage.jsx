import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  InputAdornment,
} from "@mui/material";

// Ícones
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

// Utilitários de UX
import StaggerItem from "../../utils/StaggerItem";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useNotification } from "../../context/NotificationContext";

// Serviço
import { userService } from "../../services/user.service";

const PendingUsersPage = () => {
  // --- ESTADOS EXIGIDOS NA TASK ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  // eslint-disable-next-line no-unused-vars
  const { showSuccess, showError, showWarning, showInfo } = useNotification();

  // --- ESTADOS DE FILTRO ---
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("Todos");

  // --- EFEITO: CARREGAR USUÁRIOS ---
  useEffect(() => {
    async function loadPendingUsers() {
      try {
        const data = await userService.getPending();
        setUsers(data);
      } catch (error) {
        // AJUSTE: Pegando o erro real do backend
        const errMsg =
          error.response?.data?.error || "Erro ao carregar usuários pendentes";
        showError(errMsg);
      } finally {
        setLoading(false);
      }
    }
    loadPendingUsers();
  }, [showError]);

  // --- LÓGICA DE FILTRAGEM ---
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());

      // ALERTA: Garanta que o backend devolve 'department' como string, ou ajuste para u.department.name
      const matchDept =
        departmentFilter === "Todos" || u.department === departmentFilter;

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
      showSuccess("Usuário aprovado com sucesso!");
      setUsers((prevUsers) =>
        prevUsers.filter((u) => u.id !== selectedUser.id),
      );
      setShowApproveModal(false);
    } catch (error) {
      // AJUSTE: Capturando a mensagem do Service (ex: "Usuário já foi processado")
      const errMsg = error.response?.data?.error || "Erro ao aprovar usuário";
      showError(errMsg);
    } finally {
      setActionLoading(false);
      setSelectedUser(null);
    }
  };

  // --- AÇÕES: REJEITAR ---
  const handleOpenReject = (user) => {
    setSelectedUser(user);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    // AJUSTE: Espelhando a regra do Zod (mínimo de 5 caracteres)
    if (rejectionReason.trim().length < 5) {
      showWarning("O motivo da rejeição deve ter pelo menos 5 caracteres.");
      return;
    }

    setActionLoading(true);
    try {
      await userService.reject(selectedUser.id, rejectionReason.trim());
      showSuccess("Usuário rejeitado com sucesso.");
      setUsers((prevUsers) =>
        prevUsers.filter((u) => u.id !== selectedUser.id),
      );
      setShowRejectModal(false);
    } catch (error) {
      // AJUSTE: Capturando erros do Zod ou do Service
      const zodError = error.response?.data?.errors?.reason?.[0]; // Pega o primeiro erro do campo reason do Zod
      const serviceError = error.response?.data?.error;
      const errMsg = zodError || serviceError || "Erro ao rejeitar usuário";

      showError(errMsg);
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
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "center" },
            mb: 4,
            gap: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "sectionTitle" }}
          >
            Aprovação de Cadastros
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <TextField
              size="small"
              placeholder="Buscar por nome ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ bgcolor: "#fff", borderRadius: 1, minWidth: 250 }}
            />
            <TextField
              select
              size="small"
              label="Departamento"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              sx={{ bgcolor: "#fff", borderRadius: 1, minWidth: 200 }}
            >
              <MenuItem value="Todos">Todos</MenuItem>
              <MenuItem value="Desenvolvimento de Software Multiplataforma">
                DSM
              </MenuItem>
              <MenuItem value="Gestão de Recursos Humanos">
                Gestão de RH
              </MenuItem>
            </TextField>
          </Box>
        </Box>
      </StaggerItem>

      {/* TABELA DE USUÁRIOS */}
      <StaggerItem index={1}>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ borderRadius: 2, border: "1px solid #eee" }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: "#fafafa" }}>
              <TableRow>
                <TableCell sx={{color:"text.secondary", fontWeight: "bold" }}>Nome / E-mail</TableCell>
                <TableCell sx={{ color:"text.secondary", fontWeight: "bold" }}>Departamento</TableCell>
                <TableCell sx={{ color:"text.secondary", fontWeight: "bold" }}>
                  Data de Cadastro
                </TableCell>
                <TableCell align="center" sx={{ color:"text.secondary", fontWeight: "bold" }}>
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    Carregando...
                  </TableCell>
                </TableRow>
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
                  <StaggerItem
                    key={user.id}
                    component={TableRow}
                    index={index + 2}
                    delayStep={0.08}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        {user.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>{user.department_code || "N/A"}</TableCell>
                    <TableCell>
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString("pt-BR")
                        : "Data indisponível"}
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          disableElevation
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleOpenApprove(user)}
                        >
                          Aprovar
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          disableElevation
                          startIcon={<CancelIcon />}
                          onClick={() => handleOpenReject(user)}
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
      <Dialog
        open={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle
          sx={{
            color: "success.main",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <CheckCircleIcon /> Confirmar Aprovação
        </DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja aprovar o cadastro de{" "}
            <strong>{selectedUser?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            O usuário receberá um e-mail de confirmação e terá acesso imediato
            ao sistema.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setShowApproveModal(false)}
            color="inherit"
            sx={{ fontWeight: "bold" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleApprove}
            variant="contained"
            color="success"
            disableElevation
            sx={{ fontWeight: "bold" }}
          >
            Sim, Aprovar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================== */}
      {/* MODAL: REJEITAR USUÁRIO */}
      {/* ========================================== */}
      <Dialog
        open={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle
          sx={{
            color: "error.main",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CancelIcon /> Rejeitar Cadastro
          </Box>
          <IconButton onClick={() => setShowRejectModal(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography sx={{ mb: 2 }}>
            Você está rejeitando o acesso de{" "}
            <strong>{selectedUser?.name}</strong>.
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
          <Button
            onClick={() => setShowRejectModal(false)}
            color="inherit"
            sx={{ fontWeight: "bold" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleReject}
            variant="contained"
            color="error"
            disableElevation
            disabled={!rejectionReason.trim()} // Bloqueia o botão se estiver vazio
            sx={{ fontWeight: "bold" }}
          >
            Rejeitar Usuário
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default PendingUsersPage;
