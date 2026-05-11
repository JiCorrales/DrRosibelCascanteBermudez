import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth.js';

export default function ProtectedRoute({ role, redirectTo }) {
  const { role: currentRole, loading } = useAuth();
  const { pathname } = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--ink-500)',
          fontFamily: 'var(--sans)',
          fontSize: 14,
        }}
        role="status"
        aria-live="polite"
      >
        Verificando sesión…
      </div>
    );
  }

  if (!currentRole) {
    return <Navigate to={redirectTo} state={{ from: pathname }} replace />;
  }
  if (role && currentRole !== role) {
    return <Navigate to={redirectTo} replace />;
  }
  return <Outlet />;
}
