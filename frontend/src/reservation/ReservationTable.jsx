import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, Box, Button, Typography, Pagination
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';
import AddIcon from '@mui/icons-material/Add';

export default function ReservationTable({ reservations, onViewDetails, onCancelClick, onNewReservation }) {
  // 🚀 Paginação Numerada (MUI Pagination começa no 1)
  const [page, setPage] = useState(1);
  const rowsPerPage = 5; // Fixado em 5 para o layout ficar consistente

  // Volta para a página 1 se o usuário mudar o filtro no dropdown
  useEffect(() => {
    setPage(1);
  }, [reservations]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const getStatusConfig = (status) => {
    const normalizedStatus = status?.toUpperCase();
    switch (normalizedStatus) {
      case 'APPROVED': return { color: 'success', label: 'Aprovado' };
      case 'PENDING': return { color: 'warning', label: 'Pendente' };
      case 'CANCELED': return { color: 'error', label: 'Cancelado' };
      case 'REJECTED': return { color: 'default', label: 'Rejeitado' };
      default: return { color: 'default', label: status || 'Desconhecido' };
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

  // Fatiamento do array baseado na página atual (Lógica de 1-index)
  const paginatedReservations = reservations.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(reservations.length / rowsPerPage);

  return (
    <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="tabela de minhas reservas">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>Solicitado em</TableCell>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>Data da Reserva</TableCell>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>Lab / Sala</TableCell>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedReservations.map((row) => {
              const statusConfig = getStatusConfig(row.status);
              return (
                <TableRow key={row.id} hover>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>#{row.id}</TableCell>
                  <TableCell>{row.dataSolicitacao || row.created_at}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{row.dataReserva || 'Múltiplas'}</TableCell>
                  <TableCell>{row.lab || row.lab_id}</TableCell>
                  <TableCell>
                    <Chip
                      label={statusConfig.label}
                      color={statusConfig.color}
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
                        disabled={['REJECTED', 'CANCELED', 'APPROVED'].includes(row.status?.toUpperCase())} 
                        onClick={() => onCancelClick(row.id)}
                      >
                        Cancelar
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* 🚀 NOVA PAGINAÇÃO: Centralizada e com números */}
      {totalPages > 1 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          p: 2, 
          borderTop: '1px solid', 
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handleChangePage} 
            color="primary" 
            shape="rounded"
            size="large"
          />
        </Box>
      )}
    </Paper>
  );
}