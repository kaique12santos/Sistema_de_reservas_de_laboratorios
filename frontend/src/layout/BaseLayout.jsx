import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Avatar, IconButton, Badge, Menu, MenuItem, Button
} from '@mui/material';

// Ícones
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ScienceIcon from '@mui/icons-material/Science';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import LayersIcon from '@mui/icons-material/Layers';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import BuildIcon from '@mui/icons-material/Build';
import RuleIcon from '@mui/icons-material/Rule';

import { useAuth } from '../context/AuthContext';

// Imagens (Ajuste os caminhos conforme a sua pasta)
import IconProfessor from '../public/images/icon_professor.png';
import IconCoordenador from '../public/images/icon_coordenador.png';
import IconSuporte from '../public/images/icon_suporte.png';

const drawerWidth = 240;
const headerHeight = 80;

const BaseLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // <== Pega a URL atual para marcar o menu ativo
  const [mobileOpen, setMobileOpen] = useState(false);

  // Notificações
  const [anchorElNotif, setAnchorElNotif] = useState(null);
  const openNotif = Boolean(anchorElNotif);
  const handleOpenNotif = (event) => setAnchorElNotif(event.currentTarget);
  const handleCloseNotif = () => setAnchorElNotif(null);

  const mockNotifications = [
    { id: 1, type: 'rejeitada', titulo: 'Reserva Recusada', msg: 'Sua reserva para o Lab 1 foi recusada pelo coordenador.', tempo: 'Há 10 min' },
    { id: 2, type: 'aprovada', titulo: 'Reserva Aprovada', msg: 'Sua reserva para o Lab 3 (20/04) foi confirmada!', tempo: 'Há 2 horas' },
    { id: 3, type: 'rejeitada', titulo: 'Reserva Recusada', msg: 'Conflito de horário no Lab Maker para o dia 22/04.', tempo: 'Ontem' },
  ];

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleLogout = () => { logout(); navigate('/login'); };

  const getAvatarByRole = (role) => {
    switch (role?.toUpperCase()) {
      case 'PROFESSOR': return IconProfessor;
      case 'COORDENADOR': return IconCoordenador;
      case 'SUPORTE': return IconSuporte;
      default: return null; 
    }
  };

  const rawDate = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  const formattedDate = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);


  // CONFIGURAÇÃO CENTRALIZADA DO MENU
  const menuConfig = [
    { 
      text: 'Dashboard', 
      icon: <DashboardIcon />, 
      path: '/dashboard', 
      roles: ['PROFESSOR', 'COORDENADOR', 'SUPORTE'] 
    },
    { 
      text: 'Laboratórios', 
      icon: <ScienceIcon />, 
      path: '/laboratories', 
      roles: ['PROFESSOR', 'COORDENADOR'] 
    },
    { 
      text: 'Minhas reservas', 
      icon: <EventNoteIcon />, 
      path: '/reservas', 
      roles: ['PROFESSOR'] 
    },
    { 
      text: 'Aprovar Reservas', 
      icon: <RuleIcon />, 
      path: '/gestao-reservas', 
      roles: ['COORDENADOR'] 
    },
    { 
      text: 'Equipamentos', 
      icon: <BuildIcon />, 
      path: '/equipamentos', 
      roles: ['SUPORTE'] 
    },
  ];

  // Filtra o menu garantindo que o usuário só veja o que tem permissão
  const userRole = user?.role?.toUpperCase() || 'PROFESSOR';
  const menusPermitidos = menuConfig.filter(item => item.roles.includes(userRole));

  const drawerContent = (
    <Box sx={{ overflow: 'auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ minHeight: `${headerHeight}px !important` }} /> 
      <Box sx={{ p: 3, pb: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 1, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LayersIcon fontSize="small" />
        </Box>
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 'bold', lineHeight: 1.2, color: 'text.primary' }}>Fatec ZL</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Centro Paula Souza</Typography>
        </Box>
      </Box>
      <Divider sx={{ mx: 2, my: 2 }} />
      
      {/* LISTA DE OPÇÕES DINÂMICA */}
      <List sx={{ flexGrow: 1, px: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {menusPermitidos.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <ListItem disablePadding key={item.path}>
              <ListItemButton 
                onClick={() => navigate(item.path)}
                selected={isActive}
                sx={{ 
                  borderRadius: 2, 
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
                  '&.Mui-selected': { bgcolor: 'rgba(158, 27, 31, 0.08) !important' }
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: 40, 
                    color: isActive ? 'primary.main' : 'text.secondary' 
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    '& .MuiTypography-root': { 
                      color: isActive ? 'primary.main' : 'text.secondary', 
                      fontWeight: isActive ? 'bold' : 'normal' 
                    } 
                  }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ mx: 2 }} />
      <List sx={{ px: 2, mb: 2, mt: 1 }}>
        <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: 2, '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.08)' } }} onClick={handleLogout}>
            <ListItemIcon sx={{ minWidth: 40 }}><LogoutIcon color="error" /></ListItemIcon>
            <ListItemText primary="Sair / Logout" sx={{ '& .MuiTypography-root': { color: 'error.main' } }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="fixed" color="primary" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, boxShadow: 'none', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: `${headerHeight}px !important` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 1, display: { md: 'none' } }}>
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: '900', letterSpacing: '0.5px' }}>SisLab</Typography>
              <Divider orientation="vertical" variant="middle" flexItem sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 300, letterSpacing: '0.5px' }}>{formattedDate}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit" onClick={handleOpenNotif} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
              <Badge variant="dot" color="warning" overlap="circular"><NotificationsIcon /></Badge>
            </IconButton>
            <Divider orientation="vertical" variant="middle" flexItem sx={{ borderColor: 'rgba(255,255,255,0.2)', display: { xs: 'none', sm: 'block' }, mx: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>{user?.name || 'Usuário'}</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>{user?.role || ''}</Typography>
              </Box>
              <Avatar src={getAvatarByRole(user?.role)} alt={user?.name || 'Usuário'} sx={{ bgcolor: '#ffffff', color: 'primary.main', fontWeight: 'bold' }}>
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}>
          {drawerContent}
        </Drawer>
        <Drawer variant="permanent" sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: '#ffffff', borderRight: 'none', boxShadow: 1 } }} open>
          {drawerContent}
        </Drawer>
      </Box>

      {/* ========================================== */}
      {/* AQUI É ONDE A MÁGICA ACONTECE: O OUTLET */}
      {/* ========================================== */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` }, boxSizing: 'border-box', overflowX: 'hidden' }}>
        <Toolbar sx={{ minHeight: `${headerHeight}px !important` }} /> 
        
        <Outlet /> 

      </Box>

      {/* Menu de Notificações */}
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
    </Box>
  );
};

export default BaseLayout;