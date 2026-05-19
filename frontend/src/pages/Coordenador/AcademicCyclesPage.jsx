import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import StaggerItem from "../../utils/StaggerItem";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useNotification } from "../../context/NotificationContext";
import FeedbackWidget from "../../utils/FeedbackWidget";

import { academicCycleService } from "../../services/academicCycle.service";

const formatDate = (date) => {
  if (!date) return "—";
  // O timezone às vezes quebra datas do banco, o ideal é extrair só a parte YYYY-MM-DD
  const [year, month, day] = date.split("T")[0].split("-");
  return `${day}/${month}/${year}`;
};

// ─── dialog ativar ────────────────────────────────────────────────────────────
function ConfirmActivateDialog({ open, cycle, onConfirm, onCancel, loading }) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
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
        <CheckCircleIcon /> Ativar Ciclo
      </DialogTitle>
      <DialogContent>
        <Typography>
          Tem certeza que deseja ativar o ciclo <strong>{cycle?.name}</strong>?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          O ciclo atual será desativado e este passará a ser o vigente. Todas as
          novas reservas seguirão este calendário.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onCancel} color="inherit" sx={{ fontWeight: "bold" }}>
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="success"
          disableElevation
          disabled={loading}
          sx={{ fontWeight: "bold" }}
        >
          {loading ? "Ativando..." : "Sim, Ativar"}
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

  const [activateDialog, setActivateDialog] = useState({
    open: false,
    cycle: null,
  });

  const { showSuccess, showError, showWarning, showInfo } = useNotification();
  const [showFeedback, setShowFeedback] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await academicCycleService.getAll();
      setCycles(data);
    } catch {
      showError("Erro ao carregar ciclos acadêmicos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleGenerateNextCycle = async () => {
    setActionLoading(true);
    try {
      const response = await academicCycleService.generate();
      showSuccess(`${response.message} (${response.holidays_synced} feriados sincronizados)`);
      await load();
    } catch (err) {
      showError(err?.response?.data?.error || "Erro ao gerar o próximo ciclo.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivate = async () => {
    setActionLoading(true);
    try {
      await academicCycleService.activate(activateDialog.cycle.id);
      setActivateDialog({ open: false, cycle: null });
      showSuccess(`Ciclo ${activateDialog.cycle.name} ativado com sucesso!`);
      setShowFeedback(true);
      await load();
    } catch (err) {
      showError(err?.response?.data?.error || "Erro ao ativar ciclo.");
    } finally {
      setActionLoading(false);
    }

  };

  const openActivate = (cycle) => setActivateDialog({ open: true, cycle });

  return (
    <Box>
      <LoadingOverlay open={actionLoading} message="Processando automação..." />

      {/* CABEÇALHO */}
      <StaggerItem index={0}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <CalendarMonthIcon color="primary" />
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              Ciclos Acadêmicos
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AutoAwesomeIcon />}
            onClick={handleGenerateNextCycle}
            disableElevation
            sx={{ fontWeight: "bold" }}
          >
            Gerar Próximo Semestre
          </Button>
        </Box>
      </StaggerItem>

      {/* TABELA */}
      <StaggerItem index={1}>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ borderRadius: 2, border: "1px solid #eee" }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: "#fafafa" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Semestre</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Início Letivo</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Fim Letivo</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Limite Coordenação
                </TableCell>
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
              ) : cycles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography variant="h6" color="text.secondary">
                      Nenhum ciclo acadêmico gerado ainda. Clique no botão acima
                      para iniciar.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                cycles.map((cycle, index) => (
                  <StaggerItem
                    key={cycle.id}
                    component={TableRow}
                    index={index + 2}
                    delayStep={0.1}
                    sx={{ "&:last-child td, &:last-child th": { border: 0.0 } }}
                  >
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        {cycle.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{formatDate(cycle.start_date)}</TableCell>
                    <TableCell>{formatDate(cycle.end_date)}</TableCell>
                    <TableCell>
                      {formatDate(cycle.admin_exclusive_end_date)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={cycle.is_active ? "Ativado" : "Desativado"}
                        size="small"
                        color={cycle.is_active ? "success" : "default"}
                        variant="outlined"
                        sx={{ fontWeight: "bold" }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          justifyContent: "center",
                        }}
                      >
                        {!cycle.is_active ? (
                          <Tooltip title="Ativar este ciclo">
                            <Switch
                              checked={false}
                              onChange={() => openActivate(cycle)}
                              color="success"
                              size="small"
                            />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Ciclo vigente — não pode ser desativado">
                            <Switch
                              checked={true}
                              color="success"
                              size="small"
                              disabled
                            />
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </StaggerItem>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </StaggerItem>

      {/* DIALOG ATIVAR (Único que sobrou!) */}
      <ConfirmActivateDialog
        open={activateDialog.open}
        cycle={activateDialog.cycle}
        onConfirm={handleActivate}
        onCancel={() => setActivateDialog({ open: false, cycle: null })}
        loading={actionLoading}
      />
      <FeedbackWidget 
        open={showFeedback} 
        handleClose={() => setShowFeedback(false)} 
        feature="ACADEMIC_CYCLE_ACTIVATION" 
      />

    </Box>
  );
}
