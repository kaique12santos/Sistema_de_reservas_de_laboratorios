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
  Alert,
  Chip,
  Divider
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ScienceIcon from "@mui/icons-material/Science"; // Ícone para o modal
import StaggerItem from "../utils/StaggerItem";
import { useNavigate } from "react-router-dom";
import { laboratoryService } from "../services/laboratory.service";

// 🚀 PARSER: Função utilitária para separar o texto dos equipamentos
const parseLabDescription = (rawText) => {
  if (!rawText) return { pureText: "", equipments: [] };
  
  const match = rawText.match(/\[Equipamentos:\s*(.*?)\]/);
  let equipments = [];
  
  if (match) {
    equipments = match[1].split(",").map(e => e.trim()).filter(Boolean);
  }
  
  // Remove a tag do texto principal
  const pureText = rawText.replace(/\[Equipamentos:.*?\]/s, "").trim();
  
  return { pureText, equipments };
};

const LaboratoriesPage = () => {
  const navigate = useNavigate();

  // Estados da API
  const [laboratorios, setLaboratorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados dos Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [capacidadeFilter, setCapacidadeFilter] = useState("todas");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [tipoFilter, setTipoFilter] = useState("todos");

  // 🚀 Estados do NOVO Modal de Detalhes
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [labSelecionado, setLabSelecionado] = useState(null);

  // Busca de Dados
  useEffect(() => {
    const fetchLaboratorios = async () => {
      try {
        setLoading(true);
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

  // Lógica de Filtros
  const laboratoriosFiltrados = useMemo(() => {
    return laboratorios.filter((lab) => {
      const nome = lab.name || "";
      const descricao = lab.description || "";
      const tipo = lab.type || "";
      const capacidade = lab.capacity || 0;
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

  // Controles do Modal de Detalhes
  const handleOpenDetails = (lab) => {
    setLabSelecionado(lab);
    setDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsModalOpen(false);
    setLabSelecionado(null);
  };

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
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main", mb: 3 }}>
          Laboratórios Disponíveis
        </Typography>
      </StaggerItem>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* BARRA DE FILTROS */}
      <StaggerItem index={1}>
        <Paper elevation={1} sx={{ p: 2, mb: 4, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth size="small" placeholder="Buscar por nome ou descrição..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{ startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} /> }}
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
                <MenuItem value="ocupado">Inativos</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <TextField select fullWidth size="small" label="Tipo" value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)}>
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
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 3 }}>
        {laboratoriosFiltrados.map((lab, index) => {
          const isLivre = lab.is_active === 1 || lab.is_active === true;
          
          // 🚀 Usando o parser para limpar a visão do card
          const { pureText, equipments } = parseLabDescription(lab.description);
          const hasDetails = pureText.length > 50 || equipments.length > 0;
          
          return (
            <StaggerItem key={lab.id} index={index} sx={{ height: "100%" }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3, height: "100%", display: "flex", flexDirection: "column",
                  borderRadius: 2, borderTop: "4px solid",
                  borderColor: isLivre ? "success.main" : "error.main",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                }}
              >
                <Box sx={{ mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", lineHeight: 1.2, mb: 0.5 }}>{lab.name}</Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                    Localização: {lab.location || 'Não informada'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                    Capacidade: {lab.capacity || 0} lugares
                  </Typography>
                </Box>

                <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <Box sx={{ mb: 2, minHeight: "60px" }}>
                    {/* Exibe apenas o texto limpo no card */}
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", wordBreak: "break-word" }}
                    >
                      {pureText || "Sem descrição disponível."}
                    </Typography>

                    {/* Exibe o botão de detalhes se o texto for longo ou se houver equipamentos mapeados */}
                    {hasDetails && (
                      <Typography
                        variant="caption"
                        color="primary.main"
                        sx={{ cursor: "pointer", display: "inline-block", fontWeight: "bold", mt: 0.5, '&:hover': { textDecoration: 'underline' } }}
                        onClick={() => handleOpenDetails(lab)}
                      >
                        Ver detalhes e equipamentos
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <Typography variant="body2"><strong>Tipo:</strong> {lab.type || 'N/A'}</Typography>
                    <Typography variant="body2" sx={{ color: isLivre ? "success.main" : "error.main", fontWeight: "bold" }}>
                      Status: {isLivre ? "Livre" : "Inativo"}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Button
                    variant={isLivre ? "contained" : "outlined"}
                    color={isLivre ? "primary" : "inherit"}
                    fullWidth disableElevation disabled={!isLivre}
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

      {/* 🚀 NOVO MODAL DE DETALHES */}
      <Dialog open={detailsModalOpen} onClose={handleCloseDetails} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "primary.main", color: "white" }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ScienceIcon />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Detalhes: {labSelecionado?.name}
            </Typography>
          </Box>
          <IconButton onClick={handleCloseDetails} sx={{ color: "white" }} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          {labSelecionado && (() => {
             const { pureText, equipments } = parseLabDescription(labSelecionado.description);
             
             return (
               <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                 
                 {/* Seção da Descrição Texto */}
                 <Box>
                   <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
                     Informações Adicionais
                   </Typography>
                   <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", color: "text.primary" }}>
                     {pureText || "Nenhuma descrição adicional informada para este espaço."}
                   </Typography>
                 </Box>

                 {/* Seção de Equipamentos */}
                 {equipments.length > 0 && (
                   <>
                     <Divider />
                     <Box>
                       <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
                         Equipamentos Inclusos
                       </Typography>
                       <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                         {equipments.map((eq, idx) => (
                           <Chip 
                             key={idx} 
                             label={eq} 
                             color="primary" 
                             variant="outlined"
                             sx={{ fontWeight: '500', bgcolor: 'rgba(158, 27, 31, 0.05)' }} 
                           />
                         ))}
                       </Box>
                     </Box>
                   </>
                 )}
               </Box>
             );
          })()}
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDetails} color="inherit" sx={{ fontWeight: "bold" }}>
            Fechar
          </Button>
          {labSelecionado && (labSelecionado.is_active === 1 || labSelecionado.is_active === true) && (
            <Button 
              variant="contained" 
              color="primary" 
              disableElevation 
              onClick={() => navigate(`/reservas/nova?lab_id=${labSelecionado.id}`)}
            >
              Fazer Reserva
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LaboratoriesPage;