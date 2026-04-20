
import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Alert
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import StaggerItem from "../utils/StaggerItem";
import { useNavigate } from "react-router-dom";
// IMPORTANTE: Ajuste o caminho do import conforme a sua estrutura de pastas
import { laboratoryService } from "../services/laboratory.service";

const LaboratoriesPage = () => {
  // 1. Estados da API
  const [laboratorios, setLaboratorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Estados dos Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [capacidadeFilter, setCapacidadeFilter] = useState("todas");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [tipoFilter, setTipoFilter] = useState("todos");

  // 3. Estados do Modal de Reserva (Mantido, embora a navegação esteja no botão)
  const [modalOpen, setModalOpen] = useState(false);
  const [labSelecionado, setLabSelecionado] = useState(null);

  const navigate = useNavigate();

  // ==========================================
  // BUSCA DOS DADOS REAIS
  // ==========================================
  useEffect(() => {
    const fetchLaboratorios = async () => {
      try {
        setLoading(true);
        // Trazemos todos os laboratórios (incluindo inativos para o filtro funcionar)
        const data = await laboratoryService.getAll(true);
        setLaboratorios(data);
      } catch (err) {
        console.error("Erro ao buscar laboratórios:", err);
        setError("Não foi possível carregar os laboratórios. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchLaboratorios();
  }, []);

  // ==========================================
  // LÓGICA DE FILTROS ADAPTADA PARA O BANCO REAL
  // ==========================================
  const laboratoriosFiltrados = useMemo(() => {
    return laboratorios.filter((lab) => {
      const nome = lab.name || "";
      const descricao = lab.description || "";
      const tipo = lab.type || "";
      const capacidade = lab.capacity || 0;
      // Assume que is_active 1/true é Livre e 0/false é Inativo/Ocupado
      const isLivre = lab.is_active === 1 || lab.is_active === true; 

      const matchSearch =
        nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        descricao.toLowerCase().includes(searchTerm.toLowerCase());
      
      const statusLabString = isLivre ? "livre" : "ocupado";
      const matchStatus =
        statusFilter === "todos" || statusLabString === statusFilter.toLowerCase();
      
      const matchTipo =
        tipoFilter === "todos" || tipo.toLowerCase().includes(tipoFilter.toLowerCase());

      let matchCapacidade = true;
      if (capacidadeFilter === "ate30") matchCapacidade = capacidade <= 30;
      if (capacidadeFilter === "mais30") matchCapacidade = capacidade > 30;

      return matchSearch && matchStatus && matchTipo && matchCapacidade;
    });
  }, [searchTerm, capacidadeFilter, statusFilter, tipoFilter, laboratorios]);

  // Controles do Modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setLabSelecionado(null);
  };

  // Se estiver carregando, mostra o spinner
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <StaggerItem index={0}>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "sectionTitle", mb: 3 }}
        >
          Laboratórios Disponíveis
        </Typography>
      </StaggerItem>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* BARRA DE FILTROS */}
      <StaggerItem index={1}>
        <Paper elevation={1} sx={{ p: 2, mb: 4, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar por nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon
                      fontSize="small"
                      sx={{ mr: 1, color: "text.secondary" }}
                    />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <TextField
                select
                fullWidth
                size="small"
                label="Capacidade"
                value={capacidadeFilter}
                onChange={(e) => setCapacidadeFilter(e.target.value)}
              >
                <MenuItem value="todas">Todas</MenuItem>
                <MenuItem value="ate30">Até 30 lugares</MenuItem>
                <MenuItem value="mais30">Mais de 30 lugares</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                select
                fullWidth
                size="small"
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="livre">Livres</MenuItem>
                <MenuItem value="ocupado">Inativos</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                select
                fullWidth
                size="small"
                label="Tipo"
                value={tipoFilter}
                onChange={(e) => setTipoFilter(e.target.value)}
              >
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="laboratorio">Laboratório</MenuItem>
                <MenuItem value="sala">Sala de Aula</MenuItem>
                <MenuItem value="auditorio">Auditorio</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Paper>
      </StaggerItem>

      {/* GRID DE LABORATÓRIOS */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {laboratoriosFiltrados.map((lab, index) => {
          const isLivre = lab.is_active === 1 || lab.is_active === true;
          
          return (
            <StaggerItem key={lab.id} index={index} sx={{ height: "100%" }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 2,
                  borderTop: "4px solid",
                  borderColor: isLivre ? "success.main" : "error.main",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                }}
              >
                <Box sx={{ mb: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", lineHeight: 1.2, mb: 0.5 }}
                  >
                    {lab.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", display: "block" }}
                  >
                    Localização: {lab.location || 'Não informada'}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", display: "block" }}
                  >
                    Capacidade: {lab.capacity || 0} lugares
                  </Typography>
                </Box>

                <Box
                  sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
                >
                  <Box sx={{ mb: 2, minHeight: "60px" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        wordBreak: "break-word",
                      }}
                    >
                      {lab.description || "Sem descrição disponível."}
                    </Typography>

                    {(lab.description && lab.description.length > 50) && (
                      <Typography
                        variant="caption"
                        color="info.main"
                        sx={{
                          cursor: "pointer",
                          display: "inline-block",
                          fontWeight: "bold",
                          mt: 0.5,
                        }}
                        onClick={() =>
                          alert(`Detalhes de ${lab.name}:\n\n${lab.description}`)
                        }
                      >
                        Ver detalhes
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <Typography variant="body2">
                      <strong>Tipo:</strong> {lab.type || 'N/A'}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: isLivre ? "success.main" : "error.main",
                        fontWeight: "bold",
                      }}
                    >
                      Status: {isLivre ? "Livre" : "Inativo"}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Button
                    variant={isLivre ? "contained" : "outlined"}
                    color={isLivre ? "primary" : "inherit"}
                    fullWidth
                    disableElevation
                    disabled={!isLivre}
                    onClick={() => navigate(`/reservas/nova?lab_id=${lab.id}`)}
                  >
                    {isLivre ? "Reservar" : "Indisponível"}
                  </Button>
                </Box>
              </Paper>
            </StaggerItem>
          );
        })}
      </Box>

      {/* O Modal permanece o mesmo código, já que aparentemente o botão 'Reservar' está fazendo um navigate direto para a tela de nova reserva */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "primary.main",
            color: "white",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Reservar {labSelecionado?.name}
          </Typography>
          <IconButton onClick={handleCloseModal} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
           <TextField
            label="Selecionar Data"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }} // Mantém o label em cima
          />

          {/* Seleção de Períodos (Início e Fim) */}
          <Box sx={{ display: "flex", gap: 2 }}>
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
        

        <DialogActions sx={{ p: 2, px: 3 }}>
          <Button
            onClick={handleCloseModal}
            color="inherit"
            sx={{ fontWeight: "bold" }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            sx={{ fontWeight: "bold" }}
          >
            Confirmar Reserva
          </Button>
        </DialogActions>
          <Typography variant="body1">O redirecionamento é feito pelo botão da listagem.</Typography>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, px: 3 }}>
          <Button onClick={handleCloseModal} color="inherit" sx={{ fontWeight: "bold" }}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LaboratoriesPage;