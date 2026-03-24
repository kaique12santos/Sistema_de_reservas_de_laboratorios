import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Avatar, IconButton, Badge, Menu, MenuItem, Button, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';

// Ícones
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ScienceIcon from '@mui/icons-material/Science';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import BuildIcon from '@mui/icons-material/Build';
import RuleIcon from '@mui/icons-material/Rule';
import LayersIcon from '@mui/icons-material/Layers';
import EditIcon from '@mui/icons-material/Edit';
// Ícones de Transição (Seta)
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { useAuth } from '../context/AuthContext';

// Imagens (Ajuste os caminhos)
import IconProfessor from '../public/images/icon_professor.png';
import IconCoordenador from '../public/images/icon_coordenador.png';
import IconSuporte from '../public/images/icon_suporte.png';

// DEFINIÇÕES DE LARGURA
const drawerWidthExpanded = 260; // Largura cheia (padrão)
const drawerWidthCollapsed = 80; // Largura minimizada (ícones)
const headerHeight = 80;

const BaseLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 
  

  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const handleOpenLogout = () => setLogoutModalOpen(true);
  const handleCloseLogout = () => setLogoutModalOpen(false);
  const handleConfirmLogout = () => {
    setLogoutModalOpen(false);
    logout(); // Chama a sua função de contexto
    navigate('/login');
  };
  // ESTADOS DE NAVEGAÇÃO
  const [mobileOpen, setMobileOpen] = useState(false); // Gaveta Mobile (Temporary)
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false); // Gaveta Desktop (Minimized)

  // ESTADO DE NOTIFICAÇÕES (MANTIDO IGUAL)
  const [anchorElNotif, setAnchorElNotif] = useState(null);
  const openNotif = Boolean(anchorElNotif);
  const handleOpenNotif = (event) => setAnchorElNotif(event.currentTarget);
  const handleCloseNotif = () => setAnchorElNotif(null);

  const mockNotifications = [
    { id: 1, type: 'rejeitada', titulo: 'Reserva Recusada', msg: 'Sua reserva para o Lab 1 foi recusada pelo coordenador.', tempo: 'Há 10 min' },
    { id: 2, type: 'aprovada', titulo: 'Reserva Aprovada', msg: 'Sua reserva para o Lab 3 (20/04) foi confirmada!', tempo: 'Há 2 horas' },
  ];

  // CONFIGURAÇÃO CENTRALIZADA DO MENU
  const menuConfig = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['PROFESSOR', 'ADMIN', 'SUPORT'] },
    { text: 'Laboratórios', icon: <ScienceIcon />, path: '/laboratories', roles: ['PROFESSOR', 'ADMIN'] },
    { text: 'Gestão de Labs', icon: <EditIcon />, path: '/gestao-laboratorios', roles: ['ADMIN'] },
    { text: 'Minhas reservas', icon: <EventNoteIcon />, path: '/reservas', roles: ['PROFESSOR'] },
    { text: 'Aprovar Cadastros', icon: <RuleIcon />, path: '/gestao-cadastros', roles: ['ADMIN'] }, // A tela nova
    { text: 'Aprovar Reservas', icon: <RuleIcon />, path: '/gestao-reservas', roles: ['ADMIN'] },
    { text: 'Equipamentos', icon: <BuildIcon />, path: '/equipamentos', roles: ['SUPORT', 'ADMIN'] },
  ];

  const userRole = user?.role?.toUpperCase() || 'PROFESSOR';
  const menusPermitidos = menuConfig.filter(item => item.roles.includes(userRole));

  // FUNÇÕES DE TOGGLE
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen); // Abre o menu temporário no mobile
  const handleSidebarToggle = () => setIsSidebarMinimized(!isSidebarMinimized); // Minimiza o menu permanente no desktop
  
  const handleLogout = () => { logout(); navigate('/login'); };

  const getAvatarByRole = (role) => {
    switch (role?.toUpperCase()) {
      case 'PROFESSOR': return IconProfessor;
      case 'ADMIN': return IconCoordenador;
      case 'SUPORT': return IconSuporte;
      default: return null; 
    }
  };

  const rawDate = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  const formattedDate = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

  // Define a largura atual baseada no estado de minimização
  const currentDrawerWidth = isSidebarMinimized ? drawerWidthCollapsed : drawerWidthExpanded;

  // ==========================================
  // CONTEÚDO DA SIDEBAR (INTELIGENTE)
  // ==========================================
  const drawerContent = (
    <Box sx={{ 
      bgcolor: 'primary.main', 
      color: '#ffffff',        
      overflow: 'auto', display: 'flex', flexDirection: 'column', height: '100%',
      // Transição suave na borda direita
      borderRight: isSidebarMinimized ? '1px solid rgba(0,0,0,0.1)' : '4px solid rgba(0,0,0,0.15)',
      transition: (theme) => theme.transitions.create('border-right', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    }}>
      
      {/* CABEÇALHO DO MENU (Sislab + Fatec + Toggle) */}
      <Box sx={{ 
        p: isSidebarMinimized ? 1.5 : 3, // Reduz padding se minimizado
        pt: 4, pb: 2, 
        display: 'flex', 
        flexDirection: isSidebarMinimized ? 'column' : 'row', // Vertical no minimizado
        alignItems: 'center', 
        justifyContent: isSidebarMinimized ? 'center' : 'space-between',
        gap: isSidebarMinimized ? 1.5 : 0 // Espaço entre logo e botão no minimizado
      }}> 
        {/* LOGO */}
        {isSidebarMinimized ? (
          // Mini Logo (Ícone)
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', p: 1.5, borderRadius: '50%', display: 'flex' }}>
            <LayersIcon fontSize="small" />
          </Box>
        ) : (
          // Logo Completo
          <Box>
            <Typography variant="h4" sx={{ fontWeight: '900', letterSpacing: '1px', color: '#ffffff', mb: 1 }}>
              SisLab.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 4, height: 24, bgcolor: '#ffffff', borderRadius: 1 }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.9)', lineHeight: 1.1 }}>Fatec ZL</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', letterSpacing: 0.5 }}>Centro Paula Souza</Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* BOTÃO DE TOGGLE DA SETA (SÓ APARECE NO DESKTOP) */}
        <IconButton 
          onClick={handleSidebarToggle} 
          sx={{ 
            display: { xs: 'none', md: 'inline-flex' }, // <--- A MÁGICA ESTÁ AQUI (Some no mobile)
            color: '#ffffff', 
            bgcolor: 'rgba(255,255,255,0.05)', 
            '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' },
          }}
        >
          {isSidebarMinimized ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      {/* DIVISÓRIA COM COR (Esconde se minimizado para limpar o visual) */}
      {!isSidebarMinimized && (
        <Divider sx={{ mx: 3, mb: 3, borderColor: 'rgba(255,255,255,0.15)', borderWidth: 1 }} />
      )}
      
      {/* LISTA DE OPÇÕES (ÍCONES CENTRALIZADOS E TOOLTIPS) */}
      <List sx={{ flexGrow: 1, px: isSidebarMinimized ? 1 : 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {menusPermitidos.map((item) => {
          const isActive = location.pathname === item.path;
          
          // Componente interno para reuso com/sem Tooltip
          const buttonContent = (
            <ListItemButton 
              onClick={() => navigate(item.path)}
              selected={isActive}
              sx={{ 
                borderRadius: 2, 
                px: isSidebarMinimized ? 2.5 : 2, // Ajusta padding lateral
                justifyContent: isSidebarMinimized ? 'center' : 'flex-start', // Centraliza ícone
                minHeight: 48,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }, 
                '&.Mui-selected': { bgcolor: 'rgba(255,255,255,0.16) !important' } 
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: isSidebarMinimized ? 0 : 40, // Remove min-width se minimizado
                justifyContent: 'center', // Centraliza o ícone dentro da Box do ícone
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.7)',
              }}>
                {item.icon}
              </ListItemIcon>
              
              {/* TEXTO (Esconde suavemente usando opacity/width transitions) */}
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  '& .MuiTypography-root': { 
                    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.7)', 
                    fontWeight: isActive ? 'bold' : 'normal',
                    whiteSpace: 'nowrap', // Impede quebra de linha durante a transição
                  },
                  // A mágica da transição de sumir o texto
                  opacity: isSidebarMinimized ? 0 : 1,
                  width: isSidebarMinimized ? 0 : 'auto',
                  ml: isSidebarMinimized ? 0 : 0,
                  transition: 'all 0.2s ease', 
                  display: isSidebarMinimized ? 'none' : 'block' // Esconde completamente após a transição
                }} 
              />
            </ListItemButton>
          );

          return (
            <ListItem disablePadding key={item.path} sx={{ display: 'block' }}>
              {isSidebarMinimized ? (
                // Se minimizado, coloca TOOLTIP
                <Tooltip title={item.text} placement="right" arrow>
                  {buttonContent}
                </Tooltip>
              ) : (
                // Se cheio, não precisa de Tooltip
                buttonContent
              )}
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ mx: isSidebarMinimized ? 1 : 3, borderColor: 'rgba(255,255,255,0.15)' }} />
      
      {/* BOTÃO DE SAÍDA (Ajustado) */}
      <List sx={{ px: isSidebarMinimized ? 1 : 2, mb: 3, mt: 1 }}>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <Tooltip title={isSidebarMinimized ? "Sair / Logout" : ""} placement="right" arrow>
            <ListItemButton 
              sx={{ 
                borderRadius: 2, 
                px: isSidebarMinimized ? 2.5 : 2,
                justifyContent: isSidebarMinimized ? 'center' : 'flex-start',
                minHeight: 48,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } 
              }} 
              onClick={handleOpenLogout} // <--- ALTERAÇÃO AQUI
            >
              <ListItemIcon sx={{ minWidth: isSidebarMinimized ? 0 : 40, justifyContent: 'center' }}>
                <LogoutIcon sx={{ color: '#ffffff' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Sair / Logout" 
                sx={{ 
                  '& .MuiTypography-root': { color: '#ffffff', whiteSpace: 'nowrap' },
                  opacity: isSidebarMinimized ? 0 : 1,
                  display: isSidebarMinimized ? 'none' : 'block'
                }} 
              />
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      
      {/* ========================================== */}
      {/* HEADER (APPBAR) - AGORA ADAPTÁVEL */}
      {/* ========================================== */}
      <AppBar 
        position="fixed" 
        sx={{ 
          // 👇 A largura do Header muda dinamicamente e suavemente
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { md: `${currentDrawerWidth}px` },
          bgcolor: '#ffffff', 
          color: 'text.primary', 
          boxShadow: 'none', 
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          // Animação suave na transição de largura
          transition: (theme) => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: `${headerHeight}px !important`, px: { xs: 2, md: 4 } }}>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Toggle de Hambúrguer (SÓ NO MOBILE) */}
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 1, display: { md: 'none' } }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.5px', display: { xs: 'none', sm: 'block' } }}>
              {formattedDate}
            </Typography>
          </Box>
          
          {/* Lado Direito (Notificações e Perfil - Mantido igual) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={handleOpenNotif} sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}>
              <Badge variant="dot" color="error" overlap="circular"><NotificationsIcon /></Badge>
            </IconButton>
            <Divider orientation="vertical" variant="middle" flexItem sx={{ borderColor: 'rgba(0,0,0,0.1)', display: { xs: 'none', sm: 'block' }, mx: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>{user?.name || 'Usuário'}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{user?.role || ''}</Typography>
              </Box>
              <Avatar src={getAvatarByRole(user?.role)} alt={user?.name || 'Usuário'} sx={{ bgcolor: 'primary.main', color: '#ffffff', fontWeight: 'bold' }}>
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* GAVETAS DO MENU */}
      <Box component="nav" sx={{ width: { md: currentDrawerWidth }, flexShrink: { md: 0 }, transition: 'width 0.2s ease' }}>
        
        {/* MOBILE: Drawer Temporário (Não muda, continua cheio) */}
        <Drawer 
          variant="temporary" 
          open={mobileOpen} 
          onClose={handleDrawerToggle} 
          ModalProps={{ keepMounted: true }} 
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidthExpanded, borderRight: 'none' } }}
        >
          {drawerContent} {/* Apenas chama o conteúdo normalmente! */}
        </Drawer>
        
        {/* DESKTOP: Drawer Permanente (Muda a largura suavemente) */}
        <Drawer 
          variant="permanent" 
          open
          sx={{ 
            display: { xs: 'none', md: 'block' }, 
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: currentDrawerWidth, // Usa a largura dinâmica
              borderRight: 'none',
              // Animação de largura do próprio Drawer Paper
              transition: (theme) => theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            } 
          }} 
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* MIOLO DA APLICAÇÃO (Adaptável suavemente) */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, md: 4 }, 
          // O miolo ocupa o que sobra da largura dinâmica
          width: { xs: '100%', md: `calc(100% - ${currentDrawerWidth}px)` }, 
          boxSizing: 'border-box', 
          overflowX: 'hidden',
          // Animação de largura do miolo
          transition: (theme) => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ minHeight: `${headerHeight}px !important` }} /> 
        <Outlet /> 
      </Box>


      {/* MODAL DE NOTIFICAÇÕES (Mantido) */}
       <Menu anchorEl={anchorElNotif} open={openNotif} onClose={handleCloseNotif} PaperProps={{ elevation: 3, sx: { width: 320, mt: 1.5, borderRadius: 2, boxShadow: '0px 4px 20px rgba(0,0,0,0.1)' } }} transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Notificações</Typography>
          <Typography variant="caption" sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 'bold' }}>Marcar lidas</Typography>
        </Box>
        {mockNotifications.map((notif) => {
          const isAprovada = notif.type === 'aprovada';
          return (
            <MenuItem key={notif.id} onClick={handleCloseNotif} sx={{ px: 2, py: 1.5, borderBottom: '1px solid #f5f5f5', whiteSpace: 'normal' }}>
              <ListItemIcon sx={{ minWidth: 40 }}>{isAprovada ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}</ListItemIcon>
              <ListItemText 
                primary={<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}><Typography variant="body2" sx={{ fontWeight: 'bold', color: isAprovada ? 'success.main' : 'error.main' }}>{notif.titulo}</Typography><Typography variant="caption" sx={{ color: 'text.secondary' }}>{notif.tempo}</Typography></Box>}
                secondary={<Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.2 }}>{notif.msg}</Typography>}
              />
            </MenuItem>
          );
        })}
        <Box sx={{ p: 1, textAlign: 'center' }}>
          <Button size="small" fullWidth sx={{ textTransform: 'none', color: 'text.secondary' }}>Ver todas</Button>
        </Box>
      </Menu>
      {/* ========================================== */}
      {/* MODAL DE CONFIRMAÇÃO DE SAÍDA */}
      {/* ========================================== */}
      <Dialog 
        open={logoutModalOpen} 
        onClose={handleCloseLogout}
        PaperProps={{ sx: { borderRadius: 3, p: 1, maxWidth: '400px' } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main', fontWeight: 'bold' }}>
          <LogoutIcon /> Confirmar Saída
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Tem certeza que deseja encerrar a sua sessão no SisLab?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseLogout} color="inherit" sx={{ fontWeight: 'bold' }}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmLogout} 
            variant="contained" 
            color="error" 
            disableElevation 
            sx={{ fontWeight: 'bold' }}
          >
            Sim, Sair
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BaseLayout;