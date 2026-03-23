import React, { useState, useMemo } from 'react';
import {
  Box, Typography, Paper, Button, Pagination, TextField, MenuItem, InputAdornment
} from '@mui/material';
import StaggerItem from '../utils/StaggerItem';

import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SearchIcon from '@mui/icons-material/Search';

// Mock Temporário
const mockReservas = Array.from({ length: 20 }, (_, index) => {
  const statusArray = ['Aprovado', 'Pendente', 'Reprovado'];
  const dias = (index * 2).toString().padStart(2, '0');
  return {
    id: index + 1,
    data: `${dias === '00' ? '15' : dias}/04/2026`,
    lab: `Lab ${Math.floor(Math.random() * 5) + 1} - ${['Informática', 'Redes', 'Hardware', 'Maker'][Math.floor(Math.random() * 4)]}`,
    horario: index % 2 === 0 ? '19:00 - 20:40' : '21:00 - 22:30',
    status: statusArray[index % 3],
  };
});

const DashboardPage = () => {
  const [reservas, setReservas] = useState(mockReservas); 
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const filteredAndPaginatedReservas = useMemo(() => {
    const filtered = reservas.filter((res) => {
      const matchSearch = res.lab.toLowerCase().includes(searchTerm.toLowerCase()) || res.data.includes(searchTerm);
      const matchStatus = statusFilter === 'todos' || res.status.toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });

    const totalPages = Math.ceil(filtered.length / rowsPerPage);
    const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    return { data: paginated, totalPages };
  }, [reservas, searchTerm, statusFilter, page]);

  const handleSearchChange = (e) => { setSearchTerm(e.target.value); setPage(1); };
  const handleStatusChange = (e) => { setStatusFilter(e.target.value); setPage(1); };

  return (
    <Box>
      {/* METRICS CARDS */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, mb: 4, gap: 2 }}>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, flex: 1 }}>
          
          {/* Agora o flex: 1 fica no StaggerItem */}
          <StaggerItem index={0} sx={{ flex: 1 }}>
            <Paper elevation={0} sx={{ p: "10px", height: '100%', bgcolor: '#ffffff', borderRadius: 2, borderLeft: '4px solid', borderColor: 'primary.main', display: 'flex', alignItems: 'center', gap: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <Box sx={{ display: 'flex', p: 1.5, borderRadius: 2, bgcolor: 'rgba(158, 27, 31, 0.08)', color: 'primary.main' }}><EventIcon /></Box>
              <Box sx={{ flex: 1, textAlign: 'center' }}><Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>TOTAL DE RESERVAS</Typography><Typography variant="h5" sx={{ fontWeight: '900', mt: 0.5, color: 'primary.main' }}>12</Typography></Box>
            </Paper>
          </StaggerItem>
          
          <StaggerItem index={1} sx={{ flex: 1 }}>
            <Paper elevation={0} sx={{ p: "10px", height: '100%', bgcolor: '#ffffff', borderRadius: 2, borderLeft: '4px solid', borderColor: 'warning.main', display: 'flex', alignItems: 'center', gap: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <Box sx={{ display: 'flex', p: 1.5, borderRadius: 2, bgcolor: 'rgba(237, 108, 2, 0.08)', color: 'warning.main' }}><AccessTimeIcon /></Box>
              <Box sx={{ flex: 1, textAlign: 'center' }}><Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>PENDENTES</Typography><Typography variant="h5" sx={{ fontWeight: '900', mt: 0.5, color: 'warning.main' }}>3</Typography></Box>
            </Paper>
          </StaggerItem>
          
          <StaggerItem index={2} sx={{ flex: 1 }}>
            <Paper elevation={0} sx={{ p: "10px", height: '100%', bgcolor: '#ffffff', borderRadius: 2, borderLeft: '4px solid', borderColor: 'success.main', display: 'flex', alignItems: 'center', gap: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <Box sx={{ display: 'flex', p: 1.5, borderRadius: 2, bgcolor: 'rgba(46, 125, 50, 0.08)', color: 'success.main' }}><CheckCircleOutlineIcon /></Box>
              <Box sx={{ flex: 1, textAlign: 'center' }}><Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>APROVADOS</Typography><Typography variant="h5" sx={{ fontWeight: '900', mt: 0.5, color: 'success.main' }}>9</Typography></Box>
            </Paper>
          </StaggerItem>
        </Box>

        <StaggerItem index={3} sx={{ height: '100%' }}>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} disableElevation sx={{ width: { xs: '100%', md: 'auto' }, height: '100%', minHeight: '64px', fontWeight: 'bold', borderRadius: 2 }}>Nova Reserva</Button>
        </StaggerItem>
        
      </Box>

      {/* ROW-CARDS DE RESERVAS */}
      <StaggerItem index={4}>
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, mb: 3, gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>Minhas Reservas</Typography>
          
          {/* Filtros agora com fundo #ffffff para descolar do fundo cinza */}
          <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', md: 'auto' } }}>
            <TextField size="small" placeholder="Buscar sala ou data..." value={searchTerm} onChange={handleSearchChange} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} sx={{ bgcolor: '#ffffff', minWidth: { xs: '100%', sm: '250px' }, '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            <TextField select size="small" value={statusFilter} onChange={handleStatusChange} sx={{ bgcolor: '#ffffff', minWidth: '130px', display: { xs: 'none', sm: 'block' }, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="aprovado">Aprovados</MenuItem>
              <MenuItem value="pendente">Pendentes</MenuItem>
              <MenuItem value="reprovado">Reprovados</MenuItem>
            </TextField>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}> 
          {filteredAndPaginatedReservas.data.length === 0 ? (
            <Typography sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>Nenhuma reserva encontrada.</Typography>
          ) : (
            filteredAndPaginatedReservas.data.map((row) => {
              const getStatusStyle = (status) => {
                switch(status) {
                  case 'Aprovado': return { border: 'success.main', bg: '#e8f5e9', text: '#2e7d32' };
                  case 'Pendente': return { border: 'warning.main', bg: '#fff3e0', text: '#ed6c02' };
                  case 'Reprovado': return { border: 'error.main', bg: '#ffebee', text: '#c62828' };
                  default: return { border: 'grey.300', bg: '#f5f5f5', text: '#757575' };
                }
              };
              const statusStyle = getStatusStyle(row.status);
              return (
                <Paper key={row.id} elevation={0} sx={{ py: 2, px: 3, borderRadius: 2, bgcolor: '#ffffff', borderLeft: '4px solid', borderColor: statusStyle.border, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, boxShadow: '0 2px 10px rgba(0,0,0,0.03)', gap: { xs: 1.5, sm: 0 } }}>
                  <Box sx={{ width: { xs: '100%', sm: '30%' } }}><Typography variant="caption" sx={{ display: 'block', mb: 0.2, color: 'text.secondary', fontWeight: 'bold', letterSpacing: 0.5 }}>DATA</Typography><Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>{row.data}</Typography></Box>
                  <Box sx={{ width: { xs: '100%', sm: '30%' } }}><Typography variant="caption" sx={{ display: 'block', mb: 0.2, color: 'text.secondary', fontWeight: 'bold', letterSpacing: 0.5 }}>LAB / SALA</Typography><Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>{row.lab}</Typography></Box>
                  <Box sx={{ width: { xs: '100%', sm: '25%' } }}><Typography variant="caption" sx={{ display: 'block', mb: 0.2, color: 'text.secondary', fontWeight: 'bold', letterSpacing: 0.5 }}>HORÁRIO</Typography><Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>{row.horario}</Typography></Box>
                  <Box sx={{ width: { xs: '100%', sm: '15%' }, textAlign: { xs: 'left', sm: 'right' } }}><Typography variant="caption" sx={{ bgcolor: statusStyle.bg, color: statusStyle.text, px: 2, py: 0.8, borderRadius: 1.5, fontWeight: 'bold', textTransform: 'uppercase', display: 'inline-block' }}>{row.status}</Typography></Box>
                </Paper>
              );
            })
          )}
        </Box>

        {filteredAndPaginatedReservas.totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
            <Pagination count={filteredAndPaginatedReservas.totalPages} page={page} onChange={(event, value) => setPage(value)} color="primary" shape="rounded" />
          </Box>
        )}
      </Box>
      </StaggerItem>
    </Box>
  );
};

export default DashboardPage;