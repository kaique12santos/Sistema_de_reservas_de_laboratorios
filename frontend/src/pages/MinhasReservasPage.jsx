import React, { useState, useMemo } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, MenuItem, TextField, Button, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Grid, Divider
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';
import DeletIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import StaggerItem from '../utils/StaggerItem'; 

// Mock de dados original
const mockInicial = [
  { id: '09', dataSolicitacao: '09/02/2026', dataReserva: '13/02/2026', lab: 'Lab 202', status: 'Recusado', motivo: 'Manutenção elétrica programada no bloco A.', horario: '19:00 - 20:40' },
  { id: '10', dataSolicitacao: '09/02/2026', dataReserva: '06/03/2026', lab: 'Lab 202', status: 'Recusado', motivo: 'Laboratório já reservado para o curso de Redes.', horario: '21:00 - 22:30' },
  { id: '11', dataSolicitacao: '09/02/2026', dataReserva: '13/03/2026', lab: 'Lab 202', status: 'Aprovado', motivo: 'Aula de Desenvolvimento Web.', horario: '19:00 - 20:40' },
  { id: '12', dataSolicitacao: '09/02/2026', dataReserva: '20/03/2026', lab: 'Lab 202', status: 'Aprovado', motivo: 'Aula de Desenvolvimento Web.', horario: '19:00 - 20:40' },
  { id: '13', dataSolicitacao: '09/02/2026', dataReserva: '27/03/2026', lab: 'Lab 202', status: 'Pendente', motivo: 'Aula de Desenvolvimento Web.', horario: '19:00 - 20:40' },
  { id: '14', dataSolicitacao: '09/02/2026', dataReserva: '03/04/2026', lab: 'Lab 202', status: 'Pendente', motivo: 'Prova bimestral de Banco de Dados.', horario: '21:00 - 22:30' },
];

const MinhasReservasPage = () => {
  // 1. Estado para as reservas (permite deletar)
  const [reservas, setReservas] = useState(mockInicial);
  const [statusFilter, setStatusFilter] = useState('Todos');

  // 2. Estados do Modal de Detalhes
  const [modalOpen, setModalOpen] = useState(false);
  const [reservaSelecionada, setReservaSelecionada] = useState(null);

  // 3. Estados do Confirm Alert de Cancelamento
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [idParaCancelar, setIdParaCancelar] = useState(null);

  // Filtro Dinâmico
  const reservasFiltradas = useMemo(() => {
    if (statusFilter === 'Todos') return reservas; // <-- Agora usa o State
    return reservas.filter(res => res.status === statusFilter);
  }, [statusFilter, reservas]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Aprovado': return 'success';
      case 'Pendente': return 'warning';
      case 'Recusado': return 'error';
      default: return 'default';
    }
  };

  // Funções de Ação
  const handleVerDetalhes = (reserva) => {
    setReservaSelecionada(reserva);
    setModalOpen(true);
  };

  const handleFecharModal = () => {
    setModalOpen(false);
    setReservaSelecionada(null);
  };

  const handleAbrirConfirm = (id) => {
    setIdParaCancelar(id);
    setConfirmOpen(true);
  };

  // Função que o botão "Sim, Cancelar" do Modal vai chamar (Executa a ação)
  const handleConfirmarCancelamento = () => {
    setReservas(prevReservas => prevReservas.filter(r => r.id !== idParaCancelar));
    setConfirmOpen(false); // Fecha o Alert
    setIdParaCancelar(null); // Limpa o ID
  };

  return (
    <Box>
      <StaggerItem index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Minhas Reservas
          </Typography>

          <TextField select size="small" label="Filtrar por Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 200, bgcolor: '#ffffff', borderRadius: 1 }}>
            <MenuItem value="Todos">Todos</MenuItem>
            <MenuItem value="Aprovado">Aprovados</MenuItem>
            <MenuItem value="Pendente">Pendentes</MenuItem>
            <MenuItem value="Recusado">Recusados</MenuItem>
          </TextField>
        </Box>
      </StaggerItem>

      <StaggerItem index={1}>
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #eee' }}>
          <Table sx={{ minWidth: 650 }} aria-label="tabela de minhas reservas">
            
            <TableHead sx={{ bgcolor: '#fafafa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Data da Solicitação</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Data da Reserva</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Lab / Sala</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Ações</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {reservasFiltradas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    Nenhuma reserva encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                reservasFiltradas.map((row, index) => (
                  <StaggerItem key={row.id} component={TableRow} index={index + 2} delayStep={0.08} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>#{row.id}</TableCell>
                    <TableCell>{row.dataSolicitacao}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{row.dataReserva}</TableCell>
                    <TableCell>{row.lab}</TableCell>
                    <TableCell>
                      <Chip label={row.status} color={getStatusColor(row.status)} size="small" sx={{ fontWeight: 'bold', borderRadius: 1 }} />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button 
                          variant="outlined" size="small" color="primary" startIcon={<VisibilityIcon />} sx={{ textTransform: 'none' }}
                          onClick={() => handleVerDetalhes(row)} // Abre Modal
                        >
                          Ver Detalhes
                        </Button>
                        <Button 
                          variant="outlined" size="small" color="error" startIcon={<BlockIcon />} sx={{ textTransform: 'none' }}
                          disabled={row.status === 'Recusado' || row.status === 'Aprovado'} // Só pode cancelar as pendentes
                          onClick={() => handleAbrirConfirm(row.id)} // Dispara o confirm
                        >
                          Cancelar
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
      {/* MODAL DE DETALHES DA RESERVA */}
      {/* ========================================== */}
      <Dialog open={modalOpen} onClose={handleFecharModal} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Detalhes da Solicitação #{reservaSelecionada?.id}
          </Typography>
          <IconButton onClick={handleFecharModal} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers sx={{ p: 4 }}>
          {reservaSelecionada && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', display: 'block', mb: 0.5 }}>DATA DA RESERVA</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{reservaSelecionada.dataReserva}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', display: 'block', mb: 0.5 }}>HORÁRIO</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{reservaSelecionada.horario}</Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', display: 'block', mb: 0.5 }}>LABORATÓRIO / SALA</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{reservaSelecionada.lab}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', display: 'block', mb: 0.5 }}>STATUS ATUAL</Typography>
                <Chip label={reservaSelecionada.status} color={getStatusColor(reservaSelecionada.status)} size="small" sx={{ fontWeight: 'bold', borderRadius: 1 }} />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', display: 'block', mb: 0.5 }}>MOTIVO / OBSERVAÇÃO</Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                  <Typography variant="body2">{reservaSelecionada.motivo}</Typography>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2, px: 3 }}>
          <Button onClick={handleFecharModal} variant="contained" color="primary" disableElevation sx={{ fontWeight: 'bold' }}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================== */}
      {/* ALERT DE CONFIRMAÇÃO (MUI CUSTOM) */}
      {/* ========================================== */}
      <Dialog 
        open={confirmOpen} 
        onClose={() => setConfirmOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1, maxWidth: '400px' } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main', fontWeight: 'bold' }}>
          Confirmar Cancelamento
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Tem certeza que deseja cancelar a solicitação <strong>#{idParaCancelar}</strong>?
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            Esta ação não poderá ser desfeita e você precisará fazer uma nova reserva caso mude de ideia.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} color="inherit" sx={{ fontWeight: 'bold' }}>
            Voltar
          </Button>
          <Button 
            onClick={handleConfirmarCancelamento} 
            variant="contained" 
            color="error" 
            disableElevation 
            sx={{ fontWeight: 'bold' }}
          >
            Sim, Cancelar
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default MinhasReservasPage;