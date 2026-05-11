import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import SyncIcon from "@mui/icons-material/Sync";

import StaggerItem from "../../utils/StaggerItem";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useNotification } from "../../context/NotificationContext";

import { holidayService } from "../../services/holiday.service";
import { academicCycleService } from "../../services/academicCycle.service";

// Utilitário para extrair apenas a data caso venha com Timezone (ex: 2026-04-21T00:00:00.000Z)
const extractDate = (dateStr) => (dateStr ? dateStr.split("T")[0] : "");

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const [year, month, day] = extractDate(dateStr).split("-");
  return `${day}/${month}/${year}`;
};

const getDayOfWeek = (dateStr) => {
  if (!dateStr) return "—";
  const [year, month, day] = extractDate(dateStr).split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date
    .toLocaleDateString("pt-BR", { weekday: "long" })
    .replace(/^\w/, (c) => c.toUpperCase());
};

export default function HolidaysPage() {
  const [holidays, setHolidays] = useState([]);
  const [activeCycle, setActiveCycle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const { showSuccess, showError, showWarning, showInfo } = useNotification();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const cycles = await academicCycleService.getAll();
      const active = cycles.find((c) => c.is_active) || null; // Corrigido para is_active vindo do banco
      setActiveCycle(active);

      if (active) {
        const data = await holidayService.getByCycle(active.id);
        const sorted = [...data].sort(
          (a, b) => new Date(a.date) - new Date(b.date),
        );
        setHolidays(sorted);
      } else {
        setHolidays([]);
      }
    } catch {
      showError("Erro ao carregar dados dos feriados.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // 🚀 O NOSSO BOTÃO MÁGICO DE RESSINCRONIZAÇÃO
  const handleSync = async () => {
    if (!activeCycle) return;

    setActionLoading(true);
    try {
      const res = await holidayService.sync(activeCycle.id);
      showSuccess(
        `${res.message} (${res.count} feriados importados/atualizados)`,
      );
      await load(); // Recarrega a tabela para mostrar as mudanças
    } catch (error) {
      showError(
        error.response?.data?.error ||
          "Erro ao sincronizar feriados com a BrasilAPI",
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box>
      <LoadingOverlay
        open={actionLoading}
        message="Sincronizando com BrasilAPI..."
      />

      {/* CABEÇALHO */}
      <StaggerItem index={0}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <BeachAccessIcon color="primary" />
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              Feriados{activeCycle ? ` — Ciclo ${activeCycle.name}` : ""}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<SyncIcon />}
            onClick={handleSync}
            disabled={!activeCycle}
            sx={{ fontWeight: "bold" }}
          >
            Ressincronizar Feriados
          </Button>
        </Box>
      </StaggerItem>

      {/* BANNER SEM CICLO ATIVO */}
      {!loading && !activeCycle && (
        <StaggerItem index={1}>
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
            ⚠️ Nenhum ciclo acadêmico vigente. Vá até a tela de Ciclos
            Acadêmicos e gere o próximo semestre para carregar os feriados.
          </Alert>
        </StaggerItem>
      )}

      {/* TABELA LIMPA E SOMENTE LEITURA */}
      <StaggerItem index={2}>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ borderRadius: 2, border: "1px solid #eee" }}
        >
          <Table sx={{ minWidth: 500 }}>
            <TableHead sx={{ bgcolor: "#fafafa" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Data</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Dia da Semana</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Descrição</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : holidays.length === 0 && activeCycle ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                    <Typography variant="h6" color="text.secondary">
                      Nenhum feriado localizado para as datas deste ciclo.
                      Clique em "Ressincronizar".
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
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        {formatDate(holiday.date)}
                      </Typography>
                    </TableCell>
                    <TableCell>{getDayOfWeek(holiday.date)}</TableCell>
                    <TableCell>{holiday.description || "—"}</TableCell>
                  </StaggerItem>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </StaggerItem>

      {/* TOAST */}
    </Box>
  );
}
