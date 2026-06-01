import React, { useState, useEffect } from "react";
import { 
  Box, Typography, Grid, Button, CircularProgress, Badge, 
  Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Select, MenuItem 
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

// Ícones
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ComputerIcon from '@mui/icons-material/Computer';
import PendingIcon from '@mui/icons-material/Pending';
import SchoolIcon from '@mui/icons-material/School';
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PolicyIcon from '@mui/icons-material/Policy';
import StorageIcon from '@mui/icons-material/Storage';

import StaggerItem from "../utils/StaggerItem";
import StatCard from "../components/Dashboard/StatCard";
import UpcomingReservations from "../components/Dashboard/UpcomingReservations";
import { reservationService } from "../services/Reservation.service";
import { auditService } from "../services/audit.service";


const DashboardPage = () => {
  const navigate = useNavigate();
  
  const userString = localStorage.getItem('user'); 
  const user = userString ? JSON.parse(userString) : null;

  const [stats, setStats] = useState({});
  const [myUpcoming, setMyUpcoming] = useState([]);
  const [activeCycle, setActiveCycle] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para Auditoria (Suporte)
  const [auditLogs, setAuditLogs] = useState([]);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditFilter, setAuditFilter] = useState('ALL');

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const initialData = await reservationService.getInitialData();
        setActiveCycle(initialData.activeCycle);
        const activeLabsCount = initialData.labs ? initialData.labs.filter(l => l.is_active).length : 0;

        // Se for SUPORTE, busca os logs em vez das reservas
        if (user?.role === 'SUPPORT') {
          setStats({ active_labs: activeLabsCount, total_cycles: initialData.cycles?.length || 0 });
          
          try {
            const logs = await auditService.getAllAudits();
            setAuditLogs(logs);
          } catch (auditError) {
            console.error("Erro ao buscar trilha de auditoria:", auditError);
            setAuditLogs([]);
          }
        } 
        // Lógica de ADMIN e PROFESSOR
        else {
          const myRes = await reservationService.getMyReservations(user.id);
          const todayStr = dayjs().format('YYYY-MM-DD');
          
          const upcoming = myRes
            .filter(item => {
              const isApproved = item.status === 'APPROVED';
              const isActiveItem = item.item_status === 'ACTIVE';
              const isFuture = dayjs(item.date).format('YYYY-MM-DD') >= todayStr;
              return isApproved && isActiveItem && isFuture;
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5);

          setMyUpcoming(upcoming);

          if (user?.role === 'ADMIN') {
            const pendingRes = await reservationService.getPending();
            const pendingCount = pendingRes.pendingReservations?.length || pendingRes.length || 0;
            
            setStats({
              active_reservations: upcoming.length > 0 ? "..." : 0, 
              pending_reservations: pendingCount,
              active_labs: activeLabsCount
            });
          } else {
            const myActive = myRes.filter(r => r.status === 'APPROVED').length;
            const myPending = myRes.filter(r => r.status === 'PENDING').length;
            setStats({
              active: myActive,
              pending: myPending,
              active_labs: activeLabsCount
            });
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [user?.role, user?.id]);

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 10 }} />;

  const filteredLogs = auditFilter === 'ALL' ? auditLogs : auditLogs.filter(log => log.action === auditFilter);

  return (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      
      {/* HEADER DE ATALHOS */}
      <StaggerItem index={0}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" }, mb: 4, gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main" }}>
              Olá, {user?.name?.split(' ')[0]}! 👋
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.role === 'SUPPORT' ? 'Painel de Infraestrutura e Auditoria.' : 'Visão geral do seu painel de reservas.'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {user?.role === 'SUPPORT' ? (
              <>
                <Button variant="contained" color="primary" startIcon={<PolicyIcon />} onClick={() => setShowAuditModal(true)} disableElevation>
                  Trilha de Auditoria
                </Button>
                <Button variant="outlined" startIcon={<SettingsIcon />} onClick={() => navigate('/gestao-laboratorios')}>
                  Gestão Base
                </Button>
              </>
            ) : (
              <>
                <Button variant="outlined" startIcon={<CalendarMonthIcon />} onClick={() => navigate('/calendar')}>
                  Ver Calendário
                </Button>
                {user?.role === 'ADMIN' ? (
                  <Badge badgeContent={stats.pending_reservations} color="error">
                    <Button variant="contained" color="warning" startIcon={<PendingIcon />} onClick={() => navigate('/gestao-reservas')} disableElevation>
                      Aprovar Pendentes
                    </Button>
                  </Badge>
                ) : (
                  <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => navigate('/reservas/nova')} disableElevation>
                    Nova Reserva
                  </Button>
                )}
              </>
            )}
          </Box>
        </Box>
      </StaggerItem>

      {/* CARDS DE MÉTRICAS */}
      <StaggerItem index={1}>
        <Box sx={{ mb: 5 }}>
          <Grid container spacing={3}>
            {user?.role === 'SUPPORT' ? (
              <>
                <Grid item xs={12} sm={6}>
                  <StatCard title="Total de Logs" value={auditLogs.length} icon={<StorageIcon />} color="#34495e" subtitle="Registros rastreados" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StatCard title="Labs Gerenciados" value={stats.active_labs} icon={<ComputerIcon />} color="#2980b9" />
                </Grid>
              </>
            ) : user?.role === 'ADMIN' ? (
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <StatCard title="Pendentes de Aprovação" value={stats.pending_reservations} icon={<PendingIcon />} color="#f39c12" subtitle={stats.pending_reservations > 0 ? 'Requer sua atenção' : 'Tudo em dia!'} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <StatCard title="Labs Ativos" value={stats.active_labs} icon={<ComputerIcon />} color="#2980b9" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <StatCard title="Ciclo Ativo" value={activeCycle?.name || '—'} icon={<SchoolIcon />} color="#8e44ad" subtitle={activeCycle ? `Até ${dayjs(activeCycle.end_date).format('DD/MM/YYYY')}` : 'Nenhum ciclo ativo'} />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12} sm={4}>
                  <StatCard title="Minhas Reservas Ativas" value={stats.active} icon={<EventAvailableIcon />} color="#27ae60" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StatCard title="Aguardando Aprovação" value={stats.pending} icon={<HourglassEmptyIcon />} color="#f39c12" subtitle="Suas solicitações pendentes" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StatCard title="Labs Disponíveis" value={stats.active_labs} icon={<ComputerIcon />} color="#2980b9" />
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </StaggerItem>

      {/* LISTAGEM INFERIOR */}
      <StaggerItem index={2}>
        {user?.role === 'SUPPORT' ? (
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
             <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main", mb: 2 }}>Atividades Recentes de Sistema</Typography>
             <Typography variant="body2" color="text.secondary">O sistema está rastreando alterações críticas. Clique em "Trilha de Auditoria" no topo para ver os detalhes completos.</Typography>
          </Paper>
        ) : (
          <UpcomingReservations reservations={myUpcoming} />
        )}
      </StaggerItem>

      {/* MODAL DE AUDITORIA (Só aparece pro suporte) */}
      <Modal open={showAuditModal} onClose={() => setShowAuditModal(false)}>
        <Box sx={{ 
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: { xs: '90%', md: 800 }, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4,
          maxHeight: '80vh', overflowY: 'auto'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight="bold">Trilha de Auditoria Institucional</Typography>
            <Select size="small" value={auditFilter} onChange={(e) => setAuditFilter(e.target.value)}>
              <MenuItem value="ALL">Todos os Eventos</MenuItem>
              <MenuItem value="CREATE">Criações</MenuItem>
              <MenuItem value="APPROVE">Aprovações</MenuItem>
              <MenuItem value="REJECT">Rejeições</MenuItem>
              <MenuItem value="OVERWRITE">Sobrescritas</MenuItem>
              <MenuItem value="BULK_CANCEL">Cancelamentos em Lote</MenuItem>
            </Select>
          </Box>
          
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Data/Hora</strong></TableCell>
                  <TableCell><strong>Usuário (Ator)</strong></TableCell>
                  <TableCell><strong>Ação</strong></TableCell>
                  <TableCell><strong>Tabela Afetada</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLogs.map(log => (
                  <TableRow key={log.id} hover>
                    <TableCell>{dayjs(log.timestamp).format('DD/MM/YY HH:mm')}</TableCell>
                    <TableCell>{log.user_name || 'Sistema'}</TableCell>
                    <TableCell>
                      <Chip size="small" label={log.action} color={log.action === 'APPROVE' ? 'success' : log.action.includes('REJECT') || log.action.includes('CANCEL') ? 'error' : 'default'} />
                    </TableCell>
                    <TableCell>{log.table_name}</TableCell>
                  </TableRow>
                ))}
                {filteredLogs.length === 0 && (
                  <TableRow><TableCell colSpan={4} align="center">Nenhum log encontrado para este filtro.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Modal>

    </Box>
  );
};

export default DashboardPage;