import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth.js';

export default function ProtectedRoute({ role, redirectTo }) {
  const { role: currentRole } = useAuth();
  const { pathname } = useLocation();

  if (!currentRole) {
    return <Navigate to={redirectTo} state={{ from: pathname }} replace />;
  }
  if (role && currentRole !== role) {
    return <Navigate to={redirectTo} replace />;
  }
  return <Outlet />;
}
