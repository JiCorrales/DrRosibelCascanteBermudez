import React from 'react';
import { NavLink } from 'react-router-dom';

// Sub-navegación compartida entre todas las pantallas de /admin/redes/*.
// Se monta encima del topbar contenido para que la doctora pueda saltar
// entre Dashboard / Banco / Biblioteca / Ajustes sin volver a la home del
// módulo en cada cambio.

const TABS = [
  { to: '/admin/redes',             label: 'Dashboard',  end: true },
  { to: '/admin/redes/nuevo',       label: 'Nuevo post' },
  { to: '/admin/redes/temas',       label: 'Banco' },
  { to: '/admin/redes/biblioteca',  label: 'Biblioteca' },
  { to: '/admin/redes/ajustes',     label: 'Ajustes' },
];

export default function RedesNav() {
  return (
    <nav className="redes-subnav" aria-label="Sub-navegación de Redes">
      {TABS.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          className={({ isActive }) =>
            `redes-subnav__item${isActive ? ' active' : ''}`
          }
        >
          {t.label}
        </NavLink>
      ))}
    </nav>
  );
}
