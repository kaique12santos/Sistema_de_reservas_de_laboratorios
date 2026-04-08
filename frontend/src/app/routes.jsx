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
import ManageLaboratoriesPage from '../pages/Coordenador/ManageLaboratoriesPage';
import TimeSlotsPage from '../pages/Coordenador/TimeSlotsPage';
import AcademicCyclesPage from '../pages/Coordenador/AcademicCyclesPage';
import HolidaysPage from '../pages/Coordenador/HolidaysPage';
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

  // A GRANDE BARREIRA:
  // 1. Não tem usuário no contexto? OU
  // 2. Não tem token guardado? OU
  // 3. O token existe, mas já passou de 1 hora (expirou)?
  if (!user || !token || isTokenExpired(token)) {
    
    // Se o token estiver expirado, fazemos uma faxina antes de redirecionar
    if (token && isTokenExpired(token)) {
       localStorage.removeItem('token');
       localStorage.removeItem('user');
       logout(); // Limpa o estado global também, se possível
    }

    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

// COMPONENTE PRINCIPAL (agora abraçando as rotas)
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
        </Route>

        {/* Rotas Exclusivas do Professor */}
        <Route element={<RoleRoute allowedRoles={['PROFESSOR']} />}>
          <Route path="/reservas" element={<MinhasReservasPage />} />
        </Route>

        {/* 🔒 Rotas Exclusivas do Administrador (Coordenador) */}
        <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
          {/* A tela da nossa Task F2-FE-01 */}
          <Route path="/gestao-cadastros" element={<PendingUsersPage />} />
          <Route path="/gestao-laboratorios" element={<ManageLaboratoriesPage />} />
          <Route path="/gestao-horarios" element={<TimeSlotsPage />} />
          <Route path="/gestao-ciclos" element={<AcademicCyclesPage />} />
          <Route path="/gestao-feriados" element={<HolidaysPage />} />
          {/* Futura tela de aprovação de reservas */}
          {/* <Route path="/gestao-reservas" element={<AprovarReservasPage />} /> */}
        </Route>

        {/* 🛠️ Rotas Exclusivas do Suporte */}
        <Route element={<RoleRoute allowedRoles={['SUPORT', 'ADMIN']} />}>
          {/* Futura tela de gestão de equipamentos */}
          {/* <Route path="/equipamentos" element={<EquipamentosPage />} /> */}
        </Route>

      </Route>
    </Routes>
  );
};

export default AppRoutes;