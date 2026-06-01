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
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningIcon from "@mui/icons-material/Warning";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import StaggerItem from "../../utils/StaggerItem";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useNotification } from "../../context/NotificationContext";

import { laboratoryService } from "../../services/laboratory.service";
import LaboratoryFormModal from "../../components/LaboratoryFormModal";

const ManageLaboratoriesPage = () => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Filtros
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [showInactive, setShowInactive] = useState(false);

  // Controle de Modais
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null);
  // Estados do Modal de Manutenção/Toggle
  const [toggleModalOpen, setToggleModalOpen] = useState(false);
  const [labToToggle, setLabToToggle] = useState(null);

  const { showSuccess, showError, showWarning, showInfo } = useNotification();
  const showToast = (message, severity = "success") => {
    if (severity === "error") return showError(message);
    if (severity === "warning") return showWarning(message);
    if (severity === "info") return showInfo(message);
    return showSuccess(message);
  };

  // Carrega os dados
  const loadLabs = async () => {
    setLoading(true);
    try {
      const data = await laboratoryService.getAll(showInactive);
      setLabs(data);
    } catch (error) {
      showToast("Erro ao carregar laboratórios", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLabs();
  }, [showInactive]);

  const filteredLabs = useMemo(() => {
    if (typeFilter === "Todos") return labs;
    return labs.filter((lab) => lab.type === typeFilter);
  }, [labs, typeFilter]);

  // AÇÕES: CREATE / UPDATE
  const handleOpenForm = (lab = null) => {
    setSelectedLab(lab);
    setFormModalOpen(true);
  };

  const handleSaveLab = async (formData) => {
    setActionLoading(true);
    try {
      if (formData.id) {
        const updatedLab = await laboratoryService.update(
          formData.id,
          formData,
        );

        setLabs(
          labs.map((lab) =>
            lab.id === updatedLab.id ? { ...lab, ...updatedLab } : lab,
          ),
        );

        showToast("Laboratório atualizado com sucesso!", "success");
      } else {
        const newLab = await laboratoryService.create(formData);

        setLabs([...labs, newLab]);
        showToast("Laboratório criado com sucesso!", "success");
      }

      setFormModalOpen(false); // Fecha o modal após o sucesso
    } catch (error) {
      // Tratamento específico de erro do backend (ex: Nome duplicado, Zod)
      if (error.response?.status === 400) {
        showToast(error.response.data.error || "Dados inválidos.", "error");
      } else {
        showToast("Erro ao salvar laboratório.", "error");
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenToggle = (lab) => {
    setLabToToggle(lab);
    setToggleModalOpen(true);
  };

  const handleToggleStatus = async () => {
    setActionLoading(true);
    try {
      const result = await laboratoryService.toggleStatus(labToToggle.id);

      if (!showInactive && !result.is_active) {
        setLabs(labs.filter((lab) => lab.id !== labToToggle.id));
      } else {
        setLabs(
          labs.map((lab) =>
            lab.id === labToToggle.id
              ? { ...lab, is_active: result.is_active }
              : lab,
          ),
        );
      }

      showToast(result.message, "success");
      setToggleModalOpen(false);
    } catch (error) {
      if (error.response?.status === 400) {
        showToast(error.response.data.error, "error");
      } else {
        showToast("Erro ao alterar status do laboratório.", "error");
      }
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box>
      <LoadingOverlay open={actionLoading} message="Processando..." />

      {/* HEADER & ACTIONS */}
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
            Gestão de Laboratórios
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { sm: "center" },
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                  color="primary"
                />
              }
              label="Mostrar Desativados"
              sx={{ color: "text.secondary" }}
            />
            <TextField
              select
              size="small"
              label="Filtrar por Tipo"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              sx={{ bgcolor: "#fff", borderRadius: 1, minWidth: 150 }}
            >
              <MenuItem value="Todos">Todos</MenuItem>
              <MenuItem value="LABORATORIO">Laboratório</MenuItem>
              <MenuItem value="SALA DE AULA">Sala de Aula</MenuItem>
              <MenuItem value="AUDITORIO">Auditório</MenuItem>
            </TextField>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              disableElevation
              onClick={() => handleOpenForm(null)}
              sx={{ fontWeight: "bold" }}
            >
              Novo Laboratório
            </Button>
          </Box>
        </Box>
      </StaggerItem>

      {/* TABELA DE LABORATÓRIOS */}
      <StaggerItem index={1}>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ borderRadius: 2, border: "1px solid #eee" }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: "custom.headerBg" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Nome</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Localização</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Capacidade
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Tipo</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : filteredLabs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">
                      Nenhum laboratório encontrado.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLabs.map((lab, index) => (
                  <StaggerItem
                    key={lab.id}
                    component={TableRow}
                    index={index + 2}
                    delayStep={0.08}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {lab.name}
                    </TableCell>
                    <TableCell>{lab.location || "-"}</TableCell>
                    <TableCell align="center">{lab.capacity}</TableCell>
                    <TableCell>{lab.type}</TableCell>
                    <TableCell>
                      <Chip
                        label={lab.is_active ? "Ativo" : "Inativo"}
                        color={lab.is_active ? "success" : "default"}
                        size="small"
                        sx={{ fontWeight: "bold", borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenForm(lab)}
                          size="small"
                          title="Editar"
                        >
                          <EditIcon />
                        </IconButton>

                        {/* Botão Dinâmico: Vermelho para Inativar, Verde para Reativar */}
                        <IconButton
                          color={lab.is_active ? "error" : "success"}
                          onClick={() => handleOpenToggle(lab)}
                          size="small"
                          title={
                            lab.is_active
                              ? "Colocar em Manutenção (Desativar)"
                              : "Reativar Sala"
                          }
                        >
                          {lab.is_active ? <BlockIcon /> : <CheckCircleIcon />}
                        </IconButton>
                      </TableCell>
                    </TableCell>
                  </StaggerItem>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </StaggerItem>

      {/* MODAL DE FORMULÁRIO (Componente Isolado) */}
      <LaboratoryFormModal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSave={handleSaveLab}
        initialData={selectedLab}
      />

      {/* Modal de Confirmação de Status (Ativar/Inativar) */}
      <Dialog open={toggleModalOpen} onClose={() => setToggleModalOpen(false)}>
        <DialogTitle>
          {labToToggle?.is_active
            ? "Desativar Laboratório"
            : "Reativar Laboratório"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {labToToggle?.is_active
              ? `Tem certeza que deseja desativar o laboratório "${labToToggle?.name}"? Ele ficará indisponível para novas reservas (ideal para manutenções).`
              : `Deseja reativar o laboratório "${labToToggle?.name}"? Ele voltará a aparecer no sistema de reservas para os professores.`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setToggleModalOpen(false)}
            color="inherit"
            disabled={actionLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleToggleStatus}
            color={labToToggle?.is_active ? "primary" : "success"}
            variant="contained"
            disabled={actionLoading}
          >
            {actionLoading ? "Processando..." : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageLaboratoriesPage;
