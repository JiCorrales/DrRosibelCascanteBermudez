// Cliente único de Supabase. Si las env vars no están seteadas, exporta `null`
// y la app cae automáticamente a los datos mock — útil para correr tests,
// dev sin internet, o previews antes de tener backend.

import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && key);

export const supabase = isSupabaseConfigured
  ? createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        storageKey: 'rosibel:supabase-session',
      },
    })
  : null;
