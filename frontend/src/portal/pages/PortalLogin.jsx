import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Btn, Stack, H1, H3, Body, Meta, Icon } from '../../components/primitives.jsx';
import { useAuth } from '../../auth/useAuth.js';
import { isSupabaseConfigured } from '../../lib/supabase.js';
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
  const [email, setEmail] = useState(isSupabaseConfigured ? '' : PORTAL_USER.email);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [sentTo, setSentTo] = useState('');
  const from = location.state?.from || '/portal';

  useEffect(() => {
    document.title = 'Portal · Iniciar sesión';
    if (role === 'patient') navigate('/portal', { replace: true });
  }, [role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      if (isSupabaseConfigured) {
        // El redirect debe quedar dentro de la base path del sitio.
        const base = window.location.origin + import.meta.env.BASE_URL;
        const redirectTo = base.replace(/\/$/, '') + '/portal/auth/callback';
        const { error } = await signIn('patient-magic-link', { email, redirectTo });
        if (error) {
          setErrorMsg(error.message ?? 'No pudimos enviarte el enlace. Intentá de nuevo.');
        } else {
          setSentTo(email);
        }
      } else {
        // Modo demo: cualquier correo entra de inmediato
        await new Promise((r) => setTimeout(r, 200));
        await signIn('patient', { name: PORTAL_USER.firstName, email });
        navigate(from === '/portal/login' ? '/portal' : from, { replace: true });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Pantalla "Revisá tu correo" tras enviar el magic link ───
  if (sentTo) {
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
        <Stack gap={20} style={{ maxWidth: 380, textAlign: 'center', alignItems: 'center' }}>
          <span
            style={{
              width: 64,
              height: 64,
              borderRadius: 999,
              background: 'var(--sage-100)',
              color: 'var(--sage-700)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-hidden="true"
          >
            <Icon name="mail" size={28} />
          </span>
          <H3 size={22}>Te enviamos un enlace</H3>
          <Body>
            Abrí el correo que mandamos a <strong>{sentTo}</strong> y tocá el enlace para entrar.
            Podés cerrar esta pestaña.
          </Body>
          <Meta>Si no lo encontrás, revisá la carpeta de spam.</Meta>
          <Btn
            ghost
            icon={false}
            onClick={() => {
              setSentTo('');
              setEmail('');
            }}
          >
            Usar otro correo
          </Btn>
        </Stack>
      </div>
    );
  }

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
      <div style={{ width: '100%', maxWidth: 380 }}>
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
                  placeholder="tu@correo.com"
                />
              </Stack>
            </Stack>

            {errorMsg && (
              <div
                role="alert"
                style={{
                  background: 'var(--danger-100)',
                  color: 'var(--danger-500)',
                  padding: '10px 14px',
                  borderRadius: 'var(--r-md)',
                  border: '1px solid rgb(var(--danger-rgb) / 0.28)',
                  fontSize: 13,
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                {errorMsg}
              </div>
            )}

            <Btn type="submit" block icon={false} disabled={submitting}>
              {submitting
                ? 'Enviando…'
                : isSupabaseConfigured
                ? 'Enviar enlace de acceso'
                : 'Entrar'}
            </Btn>

            <Meta>
              {isSupabaseConfigured
                ? 'Te mandamos un enlace al correo — no necesitás contraseña.'
                : '¿Primera vez? Pedile a Rosibel tu invitación.'}
            </Meta>
          </Stack>
        </form>
      </div>
    </div>
  );
}
