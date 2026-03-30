import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

// Componente para proteger rotas privadas
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Carregando...</div>;
  
  if (!user) {
    return <Navigate to="/login" />;
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