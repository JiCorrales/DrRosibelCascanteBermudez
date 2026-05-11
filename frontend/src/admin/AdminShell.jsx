import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { useAuth } from '../auth/useAuth.js';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: 'home', end: true },
  { to: '/admin/calendario', label: 'Calendario', icon: 'cal' },
  { to: '/admin/disponibilidad', label: 'Disponibilidad', icon: 'clock' },
  { to: '/admin/citas', label: 'Citas', icon: 'doc' },
  { to: '/admin/clientes', label: 'Clientes', icon: 'users' },
  { to: '/admin/servicios', label: 'Servicios', icon: 'bookmark' },
  { to: '/admin/redes', label: 'Redes', icon: 'chat' },
];

const BOTTOM_NAV = [
  { to: '/admin', label: 'Inicio', icon: 'home', end: true },
  { to: '/admin/calendario', label: 'Agenda', icon: 'cal' },
  { to: '/admin/citas', label: 'Citas', icon: 'doc' },
  { to: '/admin/clientes', label: 'Clientes', icon: 'users' },
];

export default function AdminShell() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  const handleSignOut = () => {
    signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar" aria-label="Navegación del panel admin">
        <div className="admin-sidebar__brand">
          <span className="dot" aria-hidden="true" />
          <div>
            <div className="name">rosibel</div>
            <div className="role">admin</div>
          </div>
        </div>

        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            <Icon name={item.icon} size={14} />
            <span>{item.label}</span>
          </NavLink>
        ))}

        <div className="admin-sidebar__user">
          <span className="avatar" aria-hidden="true" />
          <div style={{ flex: 1 }}>
            <div className="name">{user?.name ?? 'Rosibel C.'}</div>
            <button type="button" className="signout" onClick={handleSignOut}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      <header className="admin-mobile-bar" aria-label="Barra superior móvil">
        <button
          type="button"
          className="admin-mobile-bar__menu"
          aria-label="Abrir menú"
          aria-expanded={drawerOpen}
          aria-controls="admin-mobile-drawer"
          onClick={() => setDrawerOpen(true)}
        >
          <span aria-hidden="true" />
        </button>
        <div className="admin-mobile-bar__brand">
          <span className="dot" aria-hidden="true" />
          <span>rosibel · admin</span>
        </div>
        <button
          type="button"
          className="admin-mobile-bar__signout"
          onClick={handleSignOut}
          aria-label="Cerrar sesión"
        >
          Salir
        </button>
      </header>

      <div
        id="admin-mobile-drawer"
        className={`admin-drawer ${drawerOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!drawerOpen}
      >
        <div className="admin-drawer__backdrop" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
        <nav className="admin-drawer__panel" aria-label="Navegación del panel admin">
          <div className="admin-drawer__head">
            <div className="admin-sidebar__brand" style={{ padding: 0, border: 0, margin: 0 }}>
              <span className="dot" aria-hidden="true" />
              <div>
                <div className="name">rosibel</div>
                <div className="role">admin</div>
              </div>
            </div>
            <button
              type="button"
              className="admin-drawer__close"
              aria-label="Cerrar menú"
              onClick={() => setDrawerOpen(false)}
            >
              ×
            </button>
          </div>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-drawer__link${isActive ? ' active' : ''}`}
            >
              <Icon name={item.icon} size={16} />
              <span>{item.label}</span>
            </NavLink>
          ))}
          <button type="button" className="admin-drawer__signout" onClick={handleSignOut}>
            Cerrar sesión
          </button>
        </nav>
      </div>

      <div className="admin-main">
        <Outlet />
      </div>

      <nav className="admin-bottom-nav" aria-label="Accesos rápidos">
        {BOTTOM_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            <Icon name={item.icon} size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export function AdminTopbar({ title, sub, action }) {
  return (
    <div className="admin-topbar">
      <div className="admin-topbar__title">
        <h1>{title}</h1>
        {sub && <div className="sub">{sub}</div>}
      </div>
      <div className="admin-topbar__actions">
        <div className="admin-topbar__search" role="search">
          <Icon name="search" size={12} />
          <span>Buscar…</span>
        </div>
        {action}
      </div>
    </div>
  );
}

export function StatCard({ label, value, sub }) {
  return (
    <div className="stat-card">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {sub && <div className="sub">{sub}</div>}
    </div>
  );
}

export function StatusPill({ status }) {
  const labels = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    completed: 'Completada',
    cancelled: 'Cancelada',
    no_show: 'No asistió',
  };
  return (
    <span className={`status-pill ${status}`} role="status">
      {labels[status] ?? status}
    </span>
  );
}
