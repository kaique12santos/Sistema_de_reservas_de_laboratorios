import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();
  
  // Garante que a role venha em maiúsculo para evitar bugs de digitação
  const userRole = user?.role?.toUpperCase();

  // Se o cargo do usuário não estiver na lista de permitidos, chuta para o Dashboard
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Se passou, renderiza a rota filha (Outlet) ou o componente filho direto
  return children ? children : <Outlet />;
};

export default RoleRoute;