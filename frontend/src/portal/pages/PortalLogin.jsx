import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Btn, Stack, H1, Body, Meta } from '../../components/primitives.jsx';
import { useAuth } from '../../auth/useAuth.js';
import { PORTAL_USER } from '../../mock/admin-data.js';

const labelStyle = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.04em',
  color: 'var(--ink-500)',
  textTransform: 'uppercase',
};

const inputStyle = {
  background: '#fff',
  border: '1px solid var(--line-2)',
  borderRadius: 'var(--r-md)',
  padding: '12px 14px',
  fontSize: 15,
  fontFamily: 'var(--sans)',
  color: 'var(--ink-900)',
  outline: 'none',
  width: '100%',
};

export default function PortalLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, role } = useAuth();
  const [email, setEmail] = useState(PORTAL_USER.email);
  const [password, setPassword] = useState('demo1234');
  const from = location.state?.from || '/portal';

  useEffect(() => {
    document.title = 'Portal · Iniciar sesión';
    if (role === 'patient') navigate('/portal', { replace: true });
  }, [role, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn('patient', { name: PORTAL_USER.firstName, email });
    navigate(from === '/portal/login' ? '/portal' : from, { replace: true });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 22px',
      }}
    >
      <div style={{ width: '100%', maxWidth: 360 }}>
        <form onSubmit={handleSubmit} aria-labelledby="portal-login-title">
          <Stack gap={22} style={{ alignItems: 'center', textAlign: 'center' }}>
            <span
              style={{
                width: 64,
                height: 64,
                borderRadius: 999,
                background: 'var(--sage-500)',
              }}
              aria-hidden="true"
            />
            <Stack gap={6} style={{ alignItems: 'center' }}>
              <H1 id="portal-login-title" size={28}>
                Bienvenida
              </H1>
              <Meta>Tu espacio personal con Rosibel</Meta>
            </Stack>

            <Stack gap={14} style={{ width: '100%', alignItems: 'stretch', textAlign: 'left' }}>
              <Stack gap={6}>
                <label htmlFor="portal-email" style={labelStyle}>
                  Correo
                </label>
                <input
                  id="portal-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  style={inputStyle}
                />
              </Stack>
              <Stack gap={6}>
                <label htmlFor="portal-password" style={labelStyle}>
                  Contraseña
                </label>
                <input
                  id="portal-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  style={inputStyle}
                />
              </Stack>
            </Stack>

            <Btn type="submit" block icon={false}>
              Entrar
            </Btn>

            <Meta>¿Primera vez? Pedile a Rosibel tu invitación.</Meta>
          </Stack>
        </form>
      </div>
    </div>
  );
}
