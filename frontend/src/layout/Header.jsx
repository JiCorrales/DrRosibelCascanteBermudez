import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';

const NAV = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/sobre', label: 'Sobre mí' },
  { to: '/servicios', label: 'Servicios' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="site-header__brand" aria-label="Inicio">
          <span className="dot" aria-hidden="true" />
          <span>rosibel cascante</span>
        </Link>

        <nav className="site-header__nav" aria-label="Navegación principal">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/reservar" className="wf-btn small site-header__cta">
          Agendar cita
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </Link>

        <button
          type="button"
          className="site-header__menu"
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <span aria-hidden="true" />
        </button>
      </div>

      <div className={`mobile-drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
        <button
          type="button"
          className="mobile-drawer__close"
          aria-label="Cerrar menú"
          onClick={() => setOpen(false)}
        >
          ×
        </button>
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => (isActive ? 'active' : undefined)}
            tabIndex={open ? 0 : -1}
          >
            {item.label}
          </NavLink>
        ))}
        <Link
          to="/reservar"
          className="wf-btn block mobile-drawer__cta"
          tabIndex={open ? 0 : -1}
        >
          Agendar cita
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </Link>
      </div>
    </header>
  );
}
