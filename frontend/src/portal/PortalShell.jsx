import React from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { useAuth } from '../auth/useAuth.js';

const TABS = [
  { to: '/portal', label: 'Inicio', icon: 'home', end: true },
  { to: '/portal/citas', label: 'Citas', icon: 'cal' },
  { to: '/portal/tareas', label: 'Tareas', icon: 'check' },
  { to: '/portal/documentos', label: 'Docs', icon: 'doc' },
];

export default function PortalShell() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="portal-shell">
      <header className="portal-header">
        <Link to="/portal" className="brand" aria-label="Inicio del portal">
          <span className="dot" aria-hidden="true" />
          <span>rosibel · portal</span>
        </Link>
        <button
          type="button"
          className="signout"
          onClick={() => {
            signOut();
            navigate('/portal/login', { replace: true });
          }}
        >
          Salir
        </button>
      </header>

      <main className="portal-main">
        <Outlet />
      </main>

      <nav className="portal-tabbar" aria-label="Navegación del portal">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            <Icon name={t.icon} size={18} />
            <span>{t.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
