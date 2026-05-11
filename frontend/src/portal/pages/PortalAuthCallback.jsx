import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, H3, Body, Meta, Btn } from '../../components/primitives.jsx';
import { useAuth } from '../../auth/useAuth.js';

// Página intermedia tras tocar el enlace del correo:
// supabase-js procesa el hash (#access_token=...) y guarda la sesión,
// luego onAuthStateChange dispara y useAuth marca role='patient'.
// Acá sólo esperamos a que role sea válido y redirigimos.
export default function PortalAuthCallback() {
  const navigate = useNavigate();
  const { role, loading, session } = useAuth();
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    document.title = 'Entrando… · Portal · Rosibel';
  }, []);

  useEffect(() => {
    if (loading) return;
    if (role === 'patient') {
      navigate('/portal', { replace: true });
    } else if (role === 'admin') {
      navigate('/admin', { replace: true });
    }
    // Si role es null tras cargar, el link expiró o falló
  }, [role, loading, navigate]);

  useEffect(() => {
    const t = setTimeout(() => setStuck(true), 6000);
    return () => clearTimeout(t);
  }, []);

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
      <Stack gap={18} style={{ textAlign: 'center', alignItems: 'center', maxWidth: 360 }}>
        <span
          style={{
            width: 56,
            height: 56,
            borderRadius: 999,
            background: 'var(--sage-100)',
          }}
          aria-hidden="true"
        />
        <H3 size={22}>Entrando…</H3>
        <Body>Validando tu enlace de acceso.</Body>
        {stuck && !session && (
          <Stack gap={12} style={{ alignItems: 'center' }}>
            <Meta>
              Esto está tardando más de lo esperado. El enlace puede haber expirado o ya haber
              sido usado.
            </Meta>
            <Btn ghost icon={false} onClick={() => navigate('/portal/login', { replace: true })}>
              Volver a pedir un enlace
            </Btn>
          </Stack>
        )}
      </Stack>
    </div>
  );
}
