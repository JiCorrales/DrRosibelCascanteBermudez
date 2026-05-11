import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div>
            <div className="site-footer__brand">
              <span className="dot" aria-hidden="true" />
              <span className="name">rosibel cascante</span>
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>
              Psicología clínica con un enfoque cálido, ético y basado en evidencia. Sesiones online y presenciales
              en San José, Costa Rica.
            </p>
          </div>

          <div>
            <h4>Navegación</h4>
            <Link to="/">Inicio</Link>
            <Link to="/sobre">Sobre mí</Link>
            <Link to="/servicios">Servicios</Link>
            <Link to="/reservar">Reservar</Link>
          </div>

          <div>
            <h4>Recursos</h4>
            <Link to="/#faq">Preguntas frecuentes</Link>
            <Link to="/#contacto">Contacto</Link>
            <Link to="/privacidad">Aviso de privacidad</Link>
            <Link to="/terminos">Términos</Link>
          </div>

          <div>
            <h4>Contacto</h4>
            <a href="mailto:cascantebermudezrosibel@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="mail" size={14} />
              <span>cascantebermudezrosibel@gmail.com</span>
            </a>
            <a href="tel:+50688414861" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="phone" size={14} />
              <span>+506 8841 4861</span>
            </a>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
              <Icon name="location" size={14} />
              <span>San José, Costa Rica</span>
            </span>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span>© {year} Rosibel Cascante Bermúdez · CPCR 0000</span>
          <span>Hecho con cuidado.</span>
        </div>
      </div>
    </footer>
  );
}
