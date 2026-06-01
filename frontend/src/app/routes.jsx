import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import VerifyEmailPage from '../pages/Auth/VerifyEmailPage';
import ResetPasswordPage from '../pages/Auth/ResetPasswordPage';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';
import LaboratoriesPage from '../pages/LaboratoriesPage';
import BaseLayout from '../layout/BaseLayout';
import MinhasReservasPage from '../pages/MinhasReservasPage';
import RoleRoute from '../components/RoleRouter';
import PendingUsersPage from '../pages/Coordenador/PendingUsersPage';
import ManageLaboratoriesPage from '../pages/Support/ManageLaboratoriesPage';
import TimeSlotsPage from '../pages/Support/TimeSlotsPage';
import AcademicCyclesPage from '../pages/Support/AcademicCyclesPage';
import HolidaysPage from '../pages/Support/HolidaysPage';
import CreateReservationPage from '../pages/Professor/CreateReservationPage';
import SupportManagementPage from '../pages/Support/SupportManagementPage';
import PendingReservationsPage from '../pages/Coordenador/PendingReservationsPage';
import CalendarPage from '../pages/CalendarPage';
import { CircularProgress } from '@mui/material';

// Componente para proteger rotas privadas
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    // Pega a parte do meio do JWT (o payload onde fica a validade)
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Multiplica por 1000 porque o JWT usa segundos, e o JS usa milissegundos
    return (payload.exp * 1000) < Date.now();
  } catch (error) {
    return true; // Se der erro ao ler, assume que é inválido/corrompido
  }
};

const PrivateRoute = ({ children }) => {
  const { user, loading, logout } = useAuth(); // Se o seu useAuth tiver a função logout, puxe-a!
  const location = useLocation();
  
  if (loading) return <CircularProgress>Carregando...</CircularProgress>; // Opcional: Trocar por um <CircularProgress /> estiloso depois
  
  const token = localStorage.getItem('token');

  if (!user || !token || isTokenExpired(token)) {
    
    // Se o token estiver expirado, faz uma faxina antes de redirecionar
    if (token && isTokenExpired(token)) {
       localStorage.removeItem('token');
       localStorage.removeItem('user');
       logout(); // Limpa o estado global, se possível
    }

    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rota padrão redireciona para Login */}
      <Route path="/" element={<Navigate to="/login" />} />
      
      {/* Rotas Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      
      {/* Área Privada (Exige estar logado) */}
      <Route 
        element={
          <PrivateRoute>
            <BaseLayout />
          </PrivateRoute>
        } 
      >
        {/* Rotas Universais (Todos os logados acessam) */}
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Rotas Compartilhadas (Professor e Admin) */}
        <Route element={<RoleRoute allowedRoles={['PROFESSOR', 'ADMIN']} />}>
          <Route path="/laboratories" element={<LaboratoriesPage />} />
          <Route path="/reservas" element={<MinhasReservasPage />} />
          <Route path="/reservas/nova" element={<CreateReservationPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
        </Route>

        {/* Rotas Exclusivas do Professor */}
        <Route element={<RoleRoute allowedRoles={['PROFESSOR']} />}>
          
        </Route>

        {/* 🔒 Rotas Exclusivas do Administrador (Coordenador) */}
        <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
          <Route path="/gestao-cadastros" element={<PendingUsersPage />} />
          <Route path="/gestao-reservas" element={<PendingReservationsPage />} />
        </Route>

        {/* 🛠️ Rotas Exclusivas do Suporte */}
        <Route element={<RoleRoute allowedRoles={['SUPPORT']} />}>
          {/* Futura tela de gestão de equipamentos */}
          <Route path="/gestao-usuarios" element={<SupportManagementPage />} />
          <Route path="/gestao-laboratorios" element={<ManageLaboratoriesPage />} />
          <Route path="/gestao-horarios" element={<TimeSlotsPage />} />
          <Route path="/gestao-ciclos" element={<AcademicCyclesPage />} />
          <Route path="/gestao-feriados" element={<HolidaysPage />} />
          {/* <Route path="/equipamentos" element={<EquipamentosPage />} /> */}
        </Route>

      </Route>
    </Routes>
  );
};

export default AppRoutes;