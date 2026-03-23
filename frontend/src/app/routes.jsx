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
      
      {/* Rota Privada */}
      <Route 
        element={
          <PrivateRoute>
            <BaseLayout />
          </PrivateRoute>
        } 
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Já podemos deixar as rotas futuras preparadas/comentadas aqui: */}
        <Route path="/laboratories" element={<LaboratoriesPage />} /> 
        <Route path="/reservas" element={<MinhasReservasPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;