// Hook de auth. Si Supabase está configurado, envuelve supabase.auth.
// Si no, cae al modo mock con localStorage (cualquier credencial entra).
// La forma pública (session, user, role, signIn, signOut) se mantiene
// para no tocar los componentes que ya la usan.

import { useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const MOCK_KEY = 'rosibel:mock-session';

// ─────────────────────────────────────────────
// MODO MOCK (sin Supabase)
// ─────────────────────────────────────────────
function readMockSession() {
  try {
    const raw = localStorage.getItem(MOCK_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeMockSession(session) {
  if (session) localStorage.setItem(MOCK_KEY, JSON.stringify(session));
  else localStorage.removeItem(MOCK_KEY);
  window.dispatchEvent(new Event('rosibel:auth-change'));
}

function useMockAuth() {
  const [session, setSession] = useState(() => readMockSession());

  useEffect(() => {
    const sync = () => setSession(readMockSession());
    window.addEventListener('rosibel:auth-change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('rosibel:auth-change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const signIn = useCallback(async (role, profile = {}) => {
    const next = {
      role,
      profile: { name: 'Rosibel Cascante', ...profile },
      startedAt: Date.now(),
    };
    writeMockSession(next);
    setSession(next);
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    writeMockSession(null);
    setSession(null);
    return { error: null };
  }, []);

  return {
    mode: 'mock',
    loading: false,
    session,
    user: session?.profile ?? null,
    role: session?.role ?? null,
    signIn,
    signOut,
  };
}

// ─────────────────────────────────────────────
// MODO SUPABASE
// ─────────────────────────────────────────────
async function resolveRole(supabaseUser) {
  if (!supabaseUser) return null;
  // 1. app_metadata.role tiene precedencia (lo más rápido)
  const meta = supabaseUser.app_metadata?.role;
  if (meta === 'admin' || meta === 'patient') return meta;
  // 2. Si el user existe en admin_profiles, es admin
  const { data, error } = await supabase
    .from('admin_profiles')
    .select('id')
    .eq('id', supabaseUser.id)
    .maybeSingle();
  if (error) {
    // RLS puede negar lectura a pacientes — eso significa que NO es admin
    return 'patient';
  }
  return data ? 'admin' : 'patient';
}

function profileFromSupabase(supabaseUser, role, fullName) {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    name: fullName ?? supabaseUser.user_metadata?.full_name ?? (role === 'admin' ? 'Rosibel Cascante' : 'Paciente'),
  };
}

function useSupabaseAuth() {
  const [state, setState] = useState({ loading: true, session: null, user: null, role: null });

  useEffect(() => {
    let cancelled = false;

    async function syncFromSession(session) {
      if (!session) {
        if (!cancelled) setState({ loading: false, session: null, user: null, role: null });
        return;
      }
      const role = await resolveRole(session.user);
      let fullName;
      if (role === 'admin') {
        const { data } = await supabase
          .from('admin_profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .maybeSingle();
        fullName = data?.full_name;
      }
      if (cancelled) return;
      setState({
        loading: false,
        session,
        user: profileFromSupabase(session.user, role, fullName),
        role,
      });
    }

    supabase.auth.getSession().then(({ data }) => syncFromSession(data.session));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      syncFromSession(session);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (kind, payload = {}) => {
    if (kind === 'admin-password') {
      const { error } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });
      return { error };
    }
    if (kind === 'patient-magic-link') {
      const { error } = await supabase.auth.signInWithOtp({
        email: payload.email,
        options: {
          emailRedirectTo: payload.redirectTo,
          shouldCreateUser: true,
        },
      });
      return { error };
    }
    return { error: new Error(`Tipo de signIn no soportado: ${kind}`) };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  }, []);

  return {
    mode: 'supabase',
    loading: state.loading,
    session: state.session,
    user: state.user,
    role: state.role,
    signIn,
    signOut,
  };
}

// ─────────────────────────────────────────────
// EXPORT — selecciona modo según env
// ─────────────────────────────────────────────
export function useAuth() {
  // Eslint cree que es un hook condicional, pero isSupabaseConfigured se
  // resuelve UNA VEZ en module-init y nunca cambia, así que el orden de hooks
  // es estable. Lo silenciamos.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return isSupabaseConfigured ? useSupabaseAuth() : useMockAuth();
}
