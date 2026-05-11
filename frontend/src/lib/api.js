// Capa de acceso a datos. Cada función intenta primero contra Supabase;
// si no hay cliente configurado, devuelve mocks de src/data.js + src/mock/admin-data.js.
//
// Estructura de respuesta consistente con supabase-js: `{ data, error }`.

import { supabase, isSupabaseConfigured } from './supabase.js';
import { SERVICES as MOCK_SERVICES, TIMES as MOCK_TIMES, findService as mockFindService } from '../data.js';
import {
  CLIENTS as MOCK_CLIENTS,
  APPOINTMENTS as MOCK_APPTS,
  AVAILABILITY_RULES as MOCK_RULES,
  BLOCKED_DATES as MOCK_BLOCKED,
  ADMIN_SERVICES as MOCK_ADMIN_SERVICES,
  PORTAL_TASKS as MOCK_TASKS,
  PORTAL_DOCS as MOCK_DOCS,
  PORTAL_APPTS as MOCK_PORTAL_APPTS,
  findClient as mockFindClient,
  apptsByClient as mockApptsByClient,
} from '../mock/admin-data.js';

const ok = (data) => ({ data, error: null });
const err = (e) => ({ data: null, error: e instanceof Error ? e : new Error(String(e)) });

// ─────────────────────────────────────────────
// SERVICIOS
// ─────────────────────────────────────────────

export async function fetchServices({ activeOnly = true } = {}) {
  if (!isSupabaseConfigured) {
    const data = activeOnly ? MOCK_SERVICES : MOCK_ADMIN_SERVICES;
    return ok(data);
  }
  let q = supabase.from('services').select('*').order('duration_min', { ascending: true });
  if (activeOnly) q = q.eq('active', true);
  const { data, error } = await q;
  if (error) return err(error);
  return ok(data.map(toCamelService));
}

export async function fetchService(id) {
  if (!isSupabaseConfigured) {
    return ok(mockFindService(id) ?? null);
  }
  const { data, error } = await supabase.from('services').select('*').eq('id', id).maybeSingle();
  if (error) return err(error);
  return ok(data ? toCamelService(data) : null);
}

export async function updateService(id, patch) {
  if (!isSupabaseConfigured) return err('Sin backend — los cambios no persisten.');
  const dbPatch = toSnakeService(patch);
  const { data, error } = await supabase.from('services').update(dbPatch).eq('id', id).select().single();
  if (error) return err(error);
  return ok(toCamelService(data));
}

// ─────────────────────────────────────────────
// DISPONIBILIDAD
// ─────────────────────────────────────────────

export async function fetchAvailabilityRules() {
  if (!isSupabaseConfigured) return ok(MOCK_RULES);
  const { data, error } = await supabase
    .from('availability_rules')
    .select('*')
    .order('weekday', { ascending: true });
  if (error) return err(error);
  return ok(data);
}

export async function fetchAvailabilityOverrides() {
  if (!isSupabaseConfigured) return ok(MOCK_BLOCKED.map((label) => ({ label })));
  const { data, error } = await supabase
    .from('availability_overrides')
    .select('*')
    .order('date', { ascending: true });
  if (error) return err(error);
  return ok(data);
}

// ─────────────────────────────────────────────
// RESERVAS
// ─────────────────────────────────────────────

export async function createBooking(input) {
  // input: { service_id, scheduled_at (ISO), duration_min, modality, patient_name, patient_email, patient_phone, message, consent }
  if (!isSupabaseConfigured) {
    // En modo mock devolvemos una respuesta exitosa pero sin persistir
    return ok({ id: `mock-${Date.now()}`, ...input, status: 'pending' });
  }
  const { data, error } = await supabase
    .from('bookings')
    .insert({ ...input, status: 'pending' })
    .select()
    .single();
  if (error) return err(error);
  return ok(data);
}

export async function listBookings({ from, to, status, search } = {}) {
  if (!isSupabaseConfigured) {
    let result = MOCK_APPTS;
    if (status === 'cancelled') {
      result = result.filter((a) => a.status === 'cancelled' || a.status === 'no_show');
    } else if (status) {
      result = result.filter((a) => a.status === status);
    }
    if (search?.trim()) {
      const q = search.toLowerCase();
      result = result.filter((a) => (mockFindClient(a.clientId)?.name ?? '').toLowerCase().includes(q));
    }
    return ok(result);
  }

  let q = supabase
    .from('bookings')
    .select('*, services(name, duration_min)')
    .order('scheduled_at', { ascending: false });

  if (from) q = q.gte('scheduled_at', from);
  if (to) q = q.lte('scheduled_at', to);
  if (status === 'cancelled') q = q.in('status', ['cancelled', 'no_show']);
  else if (status) q = q.eq('status', status);
  if (search?.trim()) q = q.ilike('patient_name', `%${search.trim()}%`);

  const { data, error } = await q;
  if (error) return err(error);
  return ok(data);
}

export async function updateBookingStatus(id, status) {
  if (!isSupabaseConfigured) return err('Sin backend — los cambios no persisten.');
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error) return err(error);
  return ok(data);
}

// ─────────────────────────────────────────────
// CLIENTES
// ─────────────────────────────────────────────

export async function listClients({ search, status } = {}) {
  if (!isSupabaseConfigured) {
    let result = MOCK_CLIENTS;
    if (status && status !== 'all') result = result.filter((c) => c.status === status);
    if (search?.trim()) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
    }
    return ok(result);
  }
  let q = supabase.from('clients').select('*').order('full_name', { ascending: true });
  if (status && status !== 'all') q = q.eq('status', status);
  if (search?.trim()) q = q.or(`full_name.ilike.%${search.trim()}%,email.ilike.%${search.trim()}%`);
  const { data, error } = await q;
  if (error) return err(error);
  return ok(data);
}

export async function fetchClient(id) {
  if (!isSupabaseConfigured) return ok(mockFindClient(id) ?? null);
  const { data, error } = await supabase.from('clients').select('*').eq('id', id).maybeSingle();
  if (error) return err(error);
  return ok(data);
}

export async function fetchClientBookings(clientId) {
  if (!isSupabaseConfigured) return ok(mockApptsByClient(clientId));
  const { data, error } = await supabase
    .from('bookings')
    .select('*, services(name, duration_min)')
    .eq('client_id', clientId)
    .order('scheduled_at', { ascending: false });
  if (error) return err(error);
  return ok(data);
}

// ─────────────────────────────────────────────
// PORTAL (paciente autenticado)
// ─────────────────────────────────────────────

export async function fetchMyBookings(email) {
  if (!isSupabaseConfigured) return ok(MOCK_PORTAL_APPTS);
  const { data, error } = await supabase
    .from('bookings')
    .select('*, services(name, duration_min)')
    .eq('patient_email', email)
    .order('scheduled_at', { ascending: true });
  if (error) return err(error);
  return ok(data);
}

export async function fetchMyTasks(clientId) {
  if (!isSupabaseConfigured) return ok(MOCK_TASKS);
  if (!clientId) return ok([]);
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });
  if (error) return err(error);
  return ok(data);
}

export async function fetchMyDocuments(clientId) {
  if (!isSupabaseConfigured) return ok(MOCK_DOCS);
  if (!clientId) return ok([]);
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });
  if (error) return err(error);
  return ok(data);
}

// ─────────────────────────────────────────────
// KPIs del admin (calculados en cliente para simplicidad)
// ─────────────────────────────────────────────

export async function fetchDashboardKpis() {
  if (!isSupabaseConfigured) {
    return ok({
      today: MOCK_APPTS.filter((a) => a.date === '2026-05-14').length,
      pending: MOCK_APPTS.filter((a) => a.status === 'pending').length,
      week: MOCK_APPTS.filter((a) => a.date >= '2026-05-11' && a.date <= '2026-05-17').length,
      monthRevenue: 520000,
    });
  }

  const today = new Date();
  const startOfToday = new Date(today); startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(today); endOfToday.setHours(23, 59, 59, 999);
  const startOfWeek = new Date(today); startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek); endOfWeek.setDate(startOfWeek.getDate() + 7);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [todayRes, pendingRes, weekRes, monthRes] = await Promise.all([
    supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .gte('scheduled_at', startOfToday.toISOString())
      .lte('scheduled_at', endOfToday.toISOString()),
    supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .gte('scheduled_at', startOfWeek.toISOString())
      .lt('scheduled_at', endOfWeek.toISOString()),
    supabase
      .from('bookings')
      .select('duration_min, services(price_crc)')
      .eq('status', 'completed')
      .gte('scheduled_at', startOfMonth.toISOString()),
  ]);

  const monthRevenue = (monthRes.data ?? []).reduce(
    (sum, b) => sum + (b.services?.price_crc ?? 0),
    0
  );

  return ok({
    today: todayRes.count ?? 0,
    pending: pendingRes.count ?? 0,
    week: weekRes.count ?? 0,
    monthRevenue,
  });
}

// ─────────────────────────────────────────────
// Mappers DB ↔ UI (snake_case ↔ camelCase amistoso al UI existente)
// ─────────────────────────────────────────────

function toCamelService(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    desc: row.description,
    dur: row.duration_min,
    price: row.price_crc,
    modality: row.modality,
    buffer: row.buffer_min,
    forYou: row.for_you ?? [],
    active: row.active,
  };
}

function toSnakeService(patch) {
  const out = {};
  if (patch.name !== undefined) out.name = patch.name;
  if (patch.desc !== undefined) out.description = patch.desc;
  if (patch.dur !== undefined) out.duration_min = patch.dur;
  if (patch.price !== undefined) out.price_crc = patch.price;
  if (patch.modality !== undefined) out.modality = patch.modality;
  if (patch.buffer !== undefined) out.buffer_min = patch.buffer;
  if (patch.forYou !== undefined) out.for_you = patch.forYou;
  if (patch.active !== undefined) out.active = patch.active;
  return out;
}

// Re-export tiempos disponibles para el wizard (no van a DB todavía)
export { MOCK_TIMES as TIMES };
