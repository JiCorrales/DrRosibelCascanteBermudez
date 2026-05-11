// Auth mock — sólo guarda un flag en localStorage. Sustituir por Supabase Auth
// (o JWT propio) cuando llegue el backend. La forma del hook (`useAuth().user`,
// `signIn`, `signOut`) se mantiene igual, sólo cambia el cuerpo.

import { useEffect, useState, useCallback } from 'react';

const KEY = 'rosibel:mock-session';

function readSession() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeSession(session) {
  if (session) localStorage.setItem(KEY, JSON.stringify(session));
  else localStorage.removeItem(KEY);
  window.dispatchEvent(new Event('rosibel:auth-change'));
}

export function useAuth() {
  const [session, setSession] = useState(() => readSession());

  useEffect(() => {
    const sync = () => setSession(readSession());
    window.addEventListener('rosibel:auth-change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('rosibel:auth-change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const signIn = useCallback((role, profile = {}) => {
    const next = {
      role,
      profile: { name: 'Rosibel Cascante', ...profile },
      startedAt: Date.now(),
    };
    writeSession(next);
    setSession(next);
  }, []);

  const signOut = useCallback(() => {
    writeSession(null);
    setSession(null);
  }, []);

  return { session, user: session?.profile ?? null, role: session?.role ?? null, signIn, signOut };
}
