import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import SiteShell from './layout/SiteShell.jsx';
import HomePage from './pages/HomePage.jsx';
import SobrePage from './pages/SobrePage.jsx';
import ServiciosPage from './pages/ServiciosPage.jsx';
import ServicioDetailPage from './pages/ServicioDetailPage.jsx';
import ReservarPage from './pages/ReservarPage.jsx';
import PrivacidadPage from './pages/PrivacidadPage.jsx';
import TerminosPage from './pages/TerminosPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ProtectedRoute from './auth/ProtectedRoute.jsx';

// Admin (lazy — sólo carga si entra a /admin/*)
const AdminShell        = lazy(() => import('./admin/AdminShell.jsx'));
const AdminLogin        = lazy(() => import('./admin/pages/AdminLogin.jsx'));
const AdminDashboard    = lazy(() => import('./admin/pages/AdminDashboard.jsx'));
const AdminCalendar     = lazy(() => import('./admin/pages/AdminCalendar.jsx'));
const AdminAvailability = lazy(() => import('./admin/pages/AdminAvailability.jsx'));
const AdminAppts        = lazy(() => import('./admin/pages/AdminAppts.jsx'));
const AdminClients      = lazy(() => import('./admin/pages/AdminClients.jsx'));
const AdminClientDetail = lazy(() => import('./admin/pages/AdminClientDetail.jsx'));
const AdminServices     = lazy(() => import('./admin/pages/AdminServices.jsx'));
const AdminServiceEdit  = lazy(() => import('./admin/pages/AdminServiceEdit.jsx'));

// Portal paciente (lazy)
const PortalShell        = lazy(() => import('./portal/PortalShell.jsx'));
const PortalLogin        = lazy(() => import('./portal/pages/PortalLogin.jsx'));
const PortalAuthCallback = lazy(() => import('./portal/pages/PortalAuthCallback.jsx'));
const PortalHome         = lazy(() => import('./portal/pages/PortalHome.jsx'));
const PortalTasks        = lazy(() => import('./portal/pages/PortalTasks.jsx'));
const PortalAppts        = lazy(() => import('./portal/pages/PortalAppts.jsx'));
const PortalDocs         = lazy(() => import('./portal/pages/PortalDocs.jsx'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function PageFallback() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--ink-500)',
        fontFamily: 'var(--sans)',
      }}
      role="status"
      aria-live="polite"
    >
      Cargando…
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Sitio público */}
          <Route element={<SiteShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/sobre" element={<SobrePage />} />
            <Route path="/servicios" element={<ServiciosPage />} />
            <Route path="/servicios/:id" element={<ServicioDetailPage />} />
            <Route path="/reservar" element={<ReservarPage />} />
            <Route path="/privacidad" element={<PrivacidadPage />} />
            <Route path="/terminos" element={<TerminosPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<ProtectedRoute role="admin" redirectTo="/admin/login" />}>
            <Route element={<AdminShell />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/calendario" element={<AdminCalendar />} />
              <Route path="/admin/disponibilidad" element={<AdminAvailability />} />
              <Route path="/admin/citas" element={<AdminAppts />} />
              <Route path="/admin/clientes" element={<AdminClients />} />
              <Route path="/admin/clientes/:id" element={<AdminClientDetail />} />
              <Route path="/admin/servicios" element={<AdminServices />} />
              <Route path="/admin/servicios/:id" element={<AdminServiceEdit />} />
            </Route>
          </Route>

          {/* Portal paciente */}
          <Route path="/portal/login" element={<PortalLogin />} />
          <Route path="/portal/auth/callback" element={<PortalAuthCallback />} />
          <Route element={<ProtectedRoute role="patient" redirectTo="/portal/login" />}>
            <Route element={<PortalShell />}>
              <Route path="/portal" element={<PortalHome />} />
              <Route path="/portal/tareas" element={<PortalTasks />} />
              <Route path="/portal/citas" element={<PortalAppts />} />
              <Route path="/portal/documentos" element={<PortalDocs />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
