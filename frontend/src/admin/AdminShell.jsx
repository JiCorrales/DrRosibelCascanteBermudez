import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { useAuth } from '../auth/useAuth.js';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: 'home', end: true },
  { to: '/admin/calendario', label: 'Calendario', icon: 'cal' },
  { to: '/admin/disponibilidad', label: 'Disponibilidad', icon: 'clock' },
  { to: '/admin/citas', label: 'Citas', icon: 'doc' },
  { to: '/admin/clientes', label: 'Clientes', icon: 'users' },
  { to: '/admin/servicios', label: 'Servicios', icon: 'bookmark' },
];

export default function AdminShell() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

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
            <button
              type="button"
              className="signout"
              onClick={() => {
                signOut();
                navigate('/admin/login', { replace: true });
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
}

export function AdminTopbar({ title, sub, action }) {
  return (
    <div className="admin-topbar">
      <div>
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
