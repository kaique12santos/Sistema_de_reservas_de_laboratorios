import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, Box, Button, Typography
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';
import AddIcon from '@mui/icons-material/Add';
import StaggerItem from '../utils/StaggerItem';

export default function ReservationTable({ reservations, onViewDetails, onCancelClick, onNewReservation }) {
  
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'APROVADO': return 'success';
      case 'PENDENTE': return 'warning';
      case 'CANCELADO': return 'error';
      case 'RECUSADO': return 'default'; // A task pede cinza para rejeitado
      default: return 'default';
    }
  };

  if (reservations.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 5, textAlign: 'center', borderRadius: 2 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Você ainda não tem reservas neste filtro.
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={onNewReservation}
          sx={{ mt: 2, fontWeight: 'bold' }}
        >
          Criar Primeira Reserva
        </Button>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
      <Table sx={{ minWidth: 650 }} aria-label="tabela de minhas reservas">
        <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Solicitado em</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Data da Reserva</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Lab / Sala</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Status</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reservations.map((row, index) => (
            <StaggerItem
              key={row.id}
              component={TableRow}
              index={index}
              delayStep={0.05}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}
            >
              <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>#{row.id}</TableCell>
              <TableCell>{row.dataSolicitacao}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{row.dataReserva}</TableCell>
              <TableCell>{row.lab}</TableCell>
              <TableCell>
                <Chip
                  label={row.status}
                  color={getStatusColor(row.status)}
                  size="small"
                  sx={{ fontWeight: 'bold', borderRadius: 1 }}
                />
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                  <Button
                    variant="outlined" size="small" color="primary"
                    startIcon={<VisibilityIcon />} sx={{ textTransform: 'none' }}
                    onClick={() => onViewDetails(row)}
                  >
                    Detalhes
                  </Button>
                  <Button
                    variant="outlined" size="small" color="error"
                    startIcon={<BlockIcon />} sx={{ textTransform: 'none' }}
                    disabled={row.status === 'Recusado' || row.status === 'Cancelado' || row.status === 'Aprovado'} 
                    onClick={() => onCancelClick(row.id)}
                  >
                    Cancelar
                  </Button>
                </Box>
              </TableCell>
            </StaggerItem>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}