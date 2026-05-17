import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, Box, Button, Typography, Pagination, Checkbox
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';
import AddIcon from '@mui/icons-material/Add';

export default function ReservationTable({ 
  reservations, 
  onViewDetails, 
  onCancelClick, 
  onNewReservation,
  selectedIds = [], 
  onSelectionChange 
}) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    setPage(1);
  }, [reservations]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // 🚀 REGRA DE NEGÓCIO DO MVP: Apenas "Pendentes" podem ser canceladas
  const cancelableReservations = reservations.filter(r => 
    ['PENDING', 'PENDENTE'].includes(r.status?.toUpperCase())
  );

  // Lógica de Seleção: Selecionar/Deselecionar Todos (APENAS AS CANCELÁVEIS)
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = cancelableReservations.map((n) => n.id);
      onSelectionChange(newSelecteds);
      return;
    }
    onSelectionChange([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedIds, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedIds.slice(1));
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelected = newSelected.concat(selectedIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedIds.slice(0, selectedIndex),
        selectedIds.slice(selectedIndex + 1),
      );
    }
    onSelectionChange(newSelected);
  };

  const isSelected = (id) => selectedIds.indexOf(id) !== -1;

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

  const paginatedReservations = reservations.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(reservations.length / rowsPerPage);

  return (
    <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="tabela de minhas reservas">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ bgcolor: '#f8f9fa' }}>
                <Checkbox
                  color="primary"
                  // O checkbox do cabeçalho reage apenas à quantidade de reservas pendentes
                  indeterminate={selectedIds.length > 0 && selectedIds.length < cancelableReservations.length}
                  checked={cancelableReservations.length > 0 && selectedIds.length === cancelableReservations.length}
                  onChange={handleSelectAllClick}
                  disabled={cancelableReservations.length === 0} // Desabilita se não houver nenhuma pendente na tela
                />
              </TableCell>
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
              const isItemSelected = isSelected(row.id);
              const statusConfig = getStatusConfig(row.status);
              
              // 🚀 REGRA APLICADA: Se não for PENDENTE, não pode ser cancelada
              const canBeCanceled = ['PENDING', 'PENDENTE'].includes(row.status?.toUpperCase());

              return (
                <TableRow 
                  key={row.id} 
                  hover 
                  role="checkbox"
                  aria-checked={isItemSelected}
                  selected={isItemSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      disabled={!canBeCanceled} // Desabilita o checkbox se for Aprovado/Rejeitado/Cancelado
                      onChange={(event) => handleClick(event, row.id)}
                    />
                  </TableCell>
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
                        disabled={!canBeCanceled} 
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
      
      {totalPages > 1 && (
        <Box sx={{ 
          display: 'flex', justifyContent: 'center', p: 2, borderTop: '1px solid', 
          borderColor: 'divider', bgcolor: 'background.paper'
        }}>
          <Pagination count={totalPages} page={page} onChange={handleChangePage} color="primary" shape="rounded" size="large"/>
        </Box>
      )}
    </Paper>
  );
}