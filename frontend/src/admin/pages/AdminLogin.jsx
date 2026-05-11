import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth.js';
import { isSupabaseConfigured } from '../../lib/supabase.js';
import { Btn, Stack, Row, Eyebrow, Body, Meta } from '../../components/primitives.jsx';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, role } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const from = location.state?.from || '/admin';

  useEffect(() => {
    if (role === 'admin') navigate('/admin', { replace: true });
  }, [role, navigate]);

  useEffect(() => {
    document.title = 'Admin · Iniciar sesión · Dra. Rosibel Cascante Bermúdez';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      if (isSupabaseConfigured) {
        const { error } = await signIn('admin-password', { email, password });
        if (error) {
          setErrorMsg(error.message ?? 'No pudimos iniciar sesión. Revisá tus credenciales.');
          return;
        }
      } else {
        // Modo demo (sin backend): cualquier credencial entra
        await new Promise((r) => setTimeout(r, 200));
        await signIn('admin', { name: 'Rosibel Cascante', email });
      }
      navigate(from === '/admin/login' ? '/admin' : from, { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr', background: 'var(--bg)' }} className="admin-login">
      <div className="admin-login__panel" style={panelStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 36, height: 36, borderRadius: 999, background: 'var(--sage-100)' }} aria-hidden="true" />
          <span style={{ fontFamily: 'var(--serif)', fontSize: 18, color: 'var(--bg)' }}>rosibel</span>
        </div>
        <Stack gap={24}>
          <h2 className="display" style={{ color: 'var(--bg)', fontSize: 'clamp(40px, 5vw, 56px)' }}>
            Tu práctica,
            <br />
            <em style={{ color: 'var(--bg)', fontStyle: 'italic' }}>en un solo lugar</em>.
          </h2>
          <Body style={{ color: 'var(--sage-100)', maxWidth: 380 }}>
            Gestioná tu agenda, tus clientes y tu día desde un panel diseñado para vos.
          </Body>
        </Stack>
        <Meta style={{ color: 'var(--sage-100)' }}>v0.1 · primera fase</Meta>
      </div>

      <div className="admin-login__form" style={{ padding: '60px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--bg)' }}>
        <form
          onSubmit={handleSubmit}
          style={{ width: '100%', maxWidth: 380, margin: '0 auto' }}
          aria-labelledby="admin-login-title"
        >
          <Stack gap={20}>
            <Eyebrow>Acceso admin</Eyebrow>
            <h1 id="admin-login-title" className="h2-display" style={{ fontSize: 32 }}>
              Iniciar sesión
            </h1>

            <Stack gap={6}>
              <label htmlFor="admin-email" style={labelStyle}>
                Correo
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                style={inputStyle}
              />
            </Stack>

            <Stack gap={6}>
              <label htmlFor="admin-password" style={labelStyle}>
                Contraseña
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                style={inputStyle}
              />
            </Stack>

            <Row justify="space-between" align="center">
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--sage-500)' }} />
                <Meta>Recordarme</Meta>
              </label>
              <a href="#recuperar" style={{ color: 'var(--sage-700)', fontSize: 12 }}>
                ¿Olvidaste tu contraseña?
              </a>
            </Row>

            {errorMsg && (
              <div
                role="alert"
                style={{
                  background: 'var(--danger-100)',
                  color: 'var(--danger-500)',
                  padding: '10px 14px',
                  borderRadius: 'var(--r-md)',
                  border: '1px solid rgba(184,84,80,0.28)',
                  fontSize: 13,
                }}
              >
                {errorMsg}
              </div>
            )}

            <Btn block type="submit" disabled={submitting} icon={false}>
              {submitting ? 'Entrando…' : 'Entrar'}
            </Btn>

            <Meta style={{ textAlign: 'center' }}>
              {isSupabaseConfigured
                ? 'Sesión segura. Las credenciales viajan cifradas.'
                : 'Demo: cualquier credencial entra (sin backend conectado).'}
            </Meta>
          </Stack>
        </form>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .admin-login { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 899px) {
          .admin-login__panel {
            padding: 28px 20px !important;
            min-height: 200px !important;
            gap: 14px !important;
          }
          .admin-login__panel h2 {
            font-size: 28px !important;
          }
        }
        @media (max-width: 480px) {
          .admin-login__panel {
            padding: 22px 18px !important;
            min-height: 160px !important;
          }
          .admin-login__panel h2 {
            font-size: 24px !important;
          }
          .admin-login__panel p {
            font-size: 13px !important;
          }
          .admin-login__form {
            padding: 32px 20px !important;
          }
        }
      `}</style>
    </div>
  );
}

const panelStyle = {
  background: 'var(--sage-500)',
  color: 'var(--bg)',
  padding: 60,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: 28,
};

const labelStyle = {
  fontSize: 12,
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
