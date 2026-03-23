import React, { useState, useMemo } from 'react';
import {
  Box, Typography, TextField, MenuItem, Button, Grid, Paper, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import StaggerItem from '../utils/StaggerItem';

// Mock Temporário de Laboratórios
const mockLaboratorios = [
  { id: 1, nome: 'Lab 102', local: 'Bloco A, 2º andar', capacidade: 35, descricao: 'Computadores Intel i5, Ar condicionado, TV', tipo: 'Laboratório', status: 'Livre' },
  { id: 2, nome: 'Lab 101', local: 'Bloco A, 1º andar', capacidade: 30, descricao: 'Computadores Intel i5, Ar condicionado, TV,k kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkjjjjjjjjjjsssssssssssssssssssssssaaaaaaaaaaaaaaaaaaaaadddddddddddddddaaaaaaaaaaaaaeeeeeeeeeeeeeeeewqqqqqqqqqqqqqqqwwwwwww', tipo: 'Laboratório', status: 'Ocupado' },
  { id: 3, nome: 'Lab 202', local: 'Bloco A, 2º andar', capacidade: 40, descricao: 'Computadores Intel i5, Ar condicionado, TV,', tipo: 'Laboratório', status: 'Ocupado' },
  { id: 4, nome: 'Sala 207', local: 'Bloco A, 2º andar', capacidade: 40, descricao: 'Ventilador, TV, Projetor', tipo: 'Sala de aula', status: 'Livre' },
  { id: 5, nome: 'Sala T02', local: 'Bloco A, Térreo', capacidade: 50, descricao: 'Ventilador, TV, Projetor', tipo: 'Sala de aula', status: 'Livre' },
  { id: 6, nome: 'Lab Maker', local: 'Bloco B, Térreo', capacidade: 20, descricao: 'Impressoras 3D, Bancadas, Ferramentas', tipo: 'Laboratório', status: 'Livre' },
];

const LaboratoriesPage = () => {
  // Estados dos Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [capacidadeFilter, setCapacidadeFilter] = useState('todas');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [tipoFilter, setTipoFilter] = useState('todos');

  // Estados do Modal de Reserva
  const [modalOpen, setModalOpen] = useState(false);
  const [labSelecionado, setLabSelecionado] = useState(null);

  // Lógica de Filtros
  const laboratoriosFiltrados = useMemo(() => {
    return mockLaboratorios.filter((lab) => {
      const matchSearch = lab.nome.toLowerCase().includes(searchTerm.toLowerCase()) || lab.descricao.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'todos' || lab.status.toLowerCase() === statusFilter.toLowerCase();
      const matchTipo = tipoFilter === 'todos' || lab.tipo.toLowerCase() === tipoFilter.toLowerCase();
      
      let matchCapacidade = true;
      if (capacidadeFilter === 'ate30') matchCapacidade = lab.capacidade <= 30;
      if (capacidadeFilter === 'mais30') matchCapacidade = lab.capacidade > 30;

      return matchSearch && matchStatus && matchTipo && matchCapacidade;
    });
  }, [searchTerm, capacidadeFilter, statusFilter, tipoFilter]);

  // Controles do Modal
  const handleOpenModal = (lab) => {
    setLabSelecionado(lab);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setLabSelecionado(null);
  };

  return (
    <Box>
      <StaggerItem index={0}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
          Laboratórios Disponíveis
        </Typography>
      </StaggerItem>

      {/* BARRA DE FILTROS */}
      <StaggerItem index={1}>
      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: 2, bgcolor: '#ffffff', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField 
              fullWidth size="small" placeholder="Buscar por nome ou descrição..." 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <TextField select fullWidth size="small" label="Capacidade" value={capacidadeFilter} onChange={(e) => setCapacidadeFilter(e.target.value)}>
              <MenuItem value="todas">Todas</MenuItem>
              <MenuItem value="ate30">Até 30 lugares</MenuItem>
              <MenuItem value="mais30">Mais de 30 lugares</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <TextField select fullWidth size="small" label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="livre">Livres</MenuItem>
              <MenuItem value="ocupado">Ocupados</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <TextField select fullWidth size="small" label="Tipo" value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)}>
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="laboratório">Laboratório</MenuItem>
              <MenuItem value="sala de aula">Sala de Aula</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>
      </StaggerItem>

      {/* GRID DE LABORATÓRIOS */}
    {/* ========================================== */}
      {/* CSS GRID: O "Ditador" do Layout (3 colunas exatas) */}
      {/* ========================================== */}
      {/* CSS GRID */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, 
        gap: 3 
      }}>
        
        {/* Adicionamos o 'index' como segundo parâmetro do map */}
        {laboratoriosFiltrados.map((lab, index) => (
          
          // O StaggerItem vira o pai, recebe a KEY e o INDEX automático!
          <StaggerItem key={lab.id} index={index} sx={{ height: '100%' }}>
            
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                borderRadius: 2, 
                borderTop: '4px solid', 
                borderColor: lab.status === 'Livre' ? 'success.main' : 'error.main',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}
            >
              
              <Box sx={{ mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2, mb: 0.5 }}>{lab.nome}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Localização: {lab.local}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Capacidade: {lab.capacidade} lugares</Typography>
              </Box>
              
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 2, minHeight: '60px' }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary', 
                      display: '-webkit-box',
                      WebkitLineClamp: 2, 
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      wordBreak: 'break-word', 
                    }}
                  >
                    {lab.descricao}
                  </Typography>

                  {lab.descricao.length > 50 && (
                    <Typography 
                      variant="caption" 
                      color="primary" 
                      sx={{ cursor: 'pointer', display: 'inline-block', fontWeight: 'bold', mt: 0.5 }}
                      onClick={() => alert(`Detalhes de ${lab.nome}:\n\n${lab.descricao}`)}
                    >
                      Ver detalhes
                    </Typography>
                  )}
                </Box>
                
                <Box>
                  <Typography variant="body2"><strong>Tipo:</strong> {lab.tipo}</Typography>
                  <Typography variant="body2" sx={{ color: lab.status === 'Livre' ? 'success.main' : 'error.main', fontWeight: 'bold' }}>
                    Status: {lab.status}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Button 
                  variant={lab.status === 'Livre' ? "contained" : "outlined"}
                  color={lab.status === 'Livre' ? "primary" : "inherit"}
                  fullWidth disableElevation
                  disabled={lab.status !== 'Livre'}
                  onClick={() => handleOpenModal(lab)}
                >
                  {lab.status === 'Livre' ? 'Reservar' : 'Indisponível'}
                </Button>
              </Box>

            </Paper>
          </StaggerItem>
        ))}
      </Box>

      {/* MODAL DE RESERVA */}
      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Reservar {labSelecionado?.nome}
          </Typography>
          <IconButton onClick={handleCloseModal} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Campo de Data */}
          <TextField 
            label="Selecionar Data" 
            type="date" 
            fullWidth 
            InputLabelProps={{ shrink: true }} // Mantém o label em cima
          />

          {/* Seleção de Períodos (Início e Fim) */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField select fullWidth label="Horário de Início">
              <MenuItem value="19:00">19:00</MenuItem>
              <MenuItem value="20:50">20:50</MenuItem>
            </TextField>
            <TextField select fullWidth label="Horário de Fim">
              <MenuItem value="20:40">20:40</MenuItem>
              <MenuItem value="22:30">22:30</MenuItem>
            </TextField>
          </Box>

          {/* Motivo da Reserva */}
          <TextField 
            label="Motivo da reserva" 
            multiline 
            rows={3} 
            fullWidth 
            placeholder="Ex: Aula de desenvolvimento web, prova de banco de dados..."
          />
        </DialogContent>
        
        <DialogActions sx={{ p: 2, px: 3 }}>
          <Button onClick={handleCloseModal} color="inherit" sx={{ fontWeight: 'bold' }}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" disableElevation sx={{ fontWeight: 'bold' }}>
            Confirmar Reserva
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default LaboratoriesPage;