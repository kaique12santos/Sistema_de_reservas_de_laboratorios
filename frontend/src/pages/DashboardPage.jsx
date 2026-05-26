import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Button, CircularProgress, Badge } from "@mui/material";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

// Ícones
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ComputerIcon from '@mui/icons-material/Computer';
import EventIcon from '@mui/icons-material/Event';
import PendingIcon from '@mui/icons-material/Pending';
import SchoolIcon from '@mui/icons-material/School';
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import StaggerItem from "../utils/StaggerItem";
import StatCard from "../components/Dashboard/StatCard";
import UpcomingReservations from "../components/Dashboard/UpcomingReservations";
import { reservationService } from "../services/Reservation.service";

const DashboardPage = () => {
  const navigate = useNavigate();
  
  const userString = localStorage.getItem('user'); 
  const user = userString ? JSON.parse(userString) : null;

  const [stats, setStats] = useState({});
  const [myUpcoming, setMyUpcoming] = useState([]);
  const [activeCycle, setActiveCycle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // 1. Pega dados base (Ciclo e Labs)
        const initialData = await reservationService.getInitialData();
        setActiveCycle(initialData.activeCycle);
        const activeLabsCount = initialData.labs ? initialData.labs.filter(l => l.is_active).length : 0;

        // 2. Prepara a lista de próximas reservas do usuário (Comum a Admin e Prof)
        const myRes = await reservationService.getMyReservations(user.id);
        const todayStr = dayjs().format('YYYY-MM-DD');
        
        const upcoming = myRes
          .filter(item => {
            // A reserva pai precisa estar aprovada
            const isApproved = item.status === 'APPROVED';
            // O dia específico da aula precisa estar ativo
            const isActiveItem = item.item_status === 'ACTIVE';
            // A data precisa ser hoje ou no futuro (formatada com dayjs para evitar bugs de timezone)
            const isFuture = dayjs(item.date).format('YYYY-MM-DD') >= todayStr;

            return isApproved && isActiveItem && isFuture;
          })
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 5); // Pega apenas as próximas 5

        setMyUpcoming(upcoming);
        // 3. Monta as Métricas por Role
        if (user?.role === 'ADMIN') {
          // Se tiver o endpoint /stats no seu frontend, chame ele aqui. 
          // Como fallback, fazemos as contagens localmente usando as rotas existentes:
          const pendingRes = await reservationService.getPending();
          const pendingCount = pendingRes.pendingReservations?.length || pendingRes.length || 0;
          
          setStats({
            active_reservations: upcoming.length > 0 ? "..." : 0, // Mock: No admin ideal vem do /stats
            pending_reservations: pendingCount,
            active_labs: activeLabsCount
          });
        } else {
          // Métricas do Professor
          const myActive = myRes.filter(r => r.status === 'APPROVED').length;
          const myPending = myRes.filter(r => r.status === 'PENDING').length;
          setStats({
            active: myActive,
            pending: myPending,
            active_labs: activeLabsCount
          });
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
              Visão geral do seu painel de reservas.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="outlined" startIcon={<CalendarMonthIcon />} onClick={() => navigate('/calendar')}>
              Ver Calendário
            </Button>
            
            {user?.role === 'ADMIN' ? (
              <>
                <Badge badgeContent={stats.pending_reservations} color="error">
                  <Button variant="contained" color="warning" startIcon={<PendingIcon />} onClick={() => navigate('/gestao-reservas')} disableElevation>
                    Aprovar Pendentes
                  </Button>
                </Badge>
                <Button variant="contained" color="primary" startIcon={<SettingsIcon />} onClick={() => navigate('/laboratories')} disableElevation>
                  Gestão
                </Button>
              </>
            ) : (
              <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => navigate('/reservas/nova')} disableElevation>
                Nova Reserva
              </Button>
            )}
          </Box>
        </Box>
      </StaggerItem>

      {/* CARDS DE MÉTRICAS */}
      <StaggerItem index={1}>
        <Box sx={{ mb: 5 }}>
          {user?.role === 'ADMIN' ? (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Pendentes de Aprovação" value={stats.pending_reservations} icon={<PendingIcon />} color="#f39c12" subtitle={stats.pending_reservations > 0 ? 'Requer sua atenção' : 'Tudo em dia!'} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Labs Ativos" value={stats.active_labs} icon={<ComputerIcon />} color="#2980b9" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Ciclo Ativo" value={activeCycle?.name || '—'} icon={<SchoolIcon />} color="#8e44ad" subtitle={activeCycle ? `Até ${dayjs(activeCycle.end_date).format('DD/MM/YYYY')}` : 'Nenhum ciclo ativo'} />
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <StatCard title="Minhas Reservas Ativas" value={stats.active} icon={<EventAvailableIcon />} color="#27ae60" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatCard title="Aguardando Aprovação" value={stats.pending} icon={<HourglassEmptyIcon />} color="#f39c12" subtitle="Suas solicitações pendentes" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatCard title="Labs Disponíveis" value={stats.active_labs} icon={<ComputerIcon />} color="#2980b9" />
              </Grid>
            </Grid>
          )}
        </Box>
      </StaggerItem>

      {/* LISTAGEM DE PRÓXIMAS RESERVAS */}
      <StaggerItem index={2}>
        <UpcomingReservations reservations={myUpcoming} />
      </StaggerItem>

    </Box>
  );
};

export default DashboardPage;