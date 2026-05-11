// Capa de acceso a datos. Cada función intenta primero contra Supabase;
// si no hay cliente configurado, devuelve mocks de src/data.js + src/mock/admin-data.js.
//
// Estructura de respuesta consistente con supabase-js: `{ data, error }`.

import { supabase, isSupabaseConfigured } from './supabase.js';
import { SERVICES as MOCK_SERVICES, TIMES as MOCK_TIMES, findService as mockFindService } from '../data.js';
import {
  CLIENTS as MOCK_CLIENTS,
  APPOINTMENTS as MOCK_APPTS,
  AVAILABILITY_RULES_DB as MOCK_RULES_DB,
  AVAILABILITY_OVERRIDES_DB as MOCK_OVERRIDES_DB,
  ADMIN_SERVICES as MOCK_ADMIN_SERVICES,
  APP_SETTINGS as MOCK_APP_SETTINGS,
  CLINICAL_NOTES as MOCK_CLINICAL_NOTES,
  PORTAL_TASKS as MOCK_TASKS,
  PORTAL_DOCS as MOCK_DOCS,
  PORTAL_APPTS as MOCK_PORTAL_APPTS,
  findClient as mockFindClient,
  apptsByClient as mockApptsByClient,
} from '../mock/admin-data.js';

const ok = (data) => ({ data, error: null });
const err = (e) => {
  if (e instanceof Error) return { data: null, error: e };
  // Errores de PostgREST / Supabase: { message, code, details, hint, status }
  const message = e?.message ?? e?.error_description ?? String(e);
  const wrapped = new Error(message);
  wrapped.cause = e;
  if (e?.code) wrapped.code = e.code;
  if (e?.status) wrapped.status = e.status;
  if (e?.details) wrapped.details = e.details;
  return { data: null, error: wrapped };
};

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

// El id de services es text (slug-like). Si no viene, lo derivamos del nombre.
function slugify(input) {
  return String(input ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '')
    .slice(0, 60) || `servicio-${Date.now().toString(36)}`;
}

export async function createService(input) {
  // input shape camelCase (igual que toSnakeService espera): { id?, name, desc, dur, price, modality?, buffer?, forYou?, active? }
  if (!isSupabaseConfigured) {
    const id = input.id || slugify(input.name);
    const created = {
      id,
      slug: id,
      name: input.name,
      desc: input.desc ?? '',
      dur: input.dur ?? 50,
      price: input.price ?? 0,
      modality: input.modality ?? 'both',
      buffer: input.buffer ?? 15,
      forYou: input.forYou ?? [],
      active: input.active ?? false,
      sessionsCount: 0,
    };
    MOCK_ADMIN_SERVICES.push(created);
    return ok(created);
  }
  const id = input.id || slugify(input.name);
  const row = {
    id,
    slug: id,
    name: input.name,
    description: input.desc ?? '',
    duration_min: input.dur ?? 50,
    price_crc: input.price ?? 0,
    modality: input.modality ?? 'both',
    buffer_min: input.buffer ?? 15,
    for_you: input.forYou ?? [],
    active: input.active ?? false,
  };
  const { data, error } = await supabase.from('services').insert(row).select().single();
  if (error) return err(error);
  return ok(toCamelService(data));
}

export async function duplicateService(id) {
  if (!isSupabaseConfigured) {
    const src = MOCK_ADMIN_SERVICES.find((s) => s.id === id);
    if (!src) return err('Servicio no encontrado.');
    const copy = {
      ...src,
      id: `${src.id}-copia-${Date.now().toString(36)}`,
      name: `${src.name} (copia)`,
      active: false,
      sessionsCount: 0,
    };
    MOCK_ADMIN_SERVICES.push(copy);
    return ok(copy);
  }
  const { data: src, error: e1 } = await supabase.from('services').select('*').eq('id', id).maybeSingle();
  if (e1) return err(e1);
  if (!src) return err('Servicio no encontrado.');
  const newId = slugify(`${src.name}-copia-${Date.now().toString(36)}`);
  const row = {
    ...src,
    id: newId,
    slug: newId,
    name: `${src.name} (copia)`,
    active: false,
    created_at: undefined,
    updated_at: undefined,
  };
  delete row.created_at;
  delete row.updated_at;
  const { data, error } = await supabase.from('services').insert(row).select().single();
  if (error) return err(error);
  return ok(toCamelService(data));
}

export async function deleteService(id) {
  // Soft delete: marca inactivo (no rompemos bookings con FK a services).
  if (!isSupabaseConfigured) {
    const idx = MOCK_ADMIN_SERVICES.findIndex((s) => s.id === id);
    if (idx >= 0) MOCK_ADMIN_SERVICES[idx].active = false;
    return ok({ id });
  }
  const { error } = await supabase.from('services').update({ active: false }).eq('id', id);
  if (error) return err(error);
  return ok({ id });
}

// ─────────────────────────────────────────────
// DISPONIBILIDAD
// ─────────────────────────────────────────────

export async function fetchAvailabilityRules() {
  if (!isSupabaseConfigured) return ok(MOCK_RULES_DB);
  const { data, error } = await supabase
    .from('availability_rules')
    .select('*')
    .order('weekday', { ascending: true });
  if (error) return err(error);
  return ok(data);
}

export async function updateAvailabilityRule(id, patch) {
  // patch puede incluir: active, start_time, end_time
  if (!isSupabaseConfigured) {
    const idx = MOCK_RULES_DB.findIndex((r) => r.id === id);
    if (idx < 0) return err('Regla no encontrada.');
    MOCK_RULES_DB[idx] = { ...MOCK_RULES_DB[idx], ...patch };
    return ok(MOCK_RULES_DB[idx]);
  }
  const { data, error } = await supabase
    .from('availability_rules')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) return err(error);
  return ok(data);
}

export async function fetchAvailabilityOverrides() {
  if (!isSupabaseConfigured) return ok(MOCK_OVERRIDES_DB);
  const { data, error } = await supabase
    .from('availability_overrides')
    .select('*')
    .order('date', { ascending: true });
  if (error) return err(error);
  return ok(data);
}

export async function createAvailabilityOverride(input) {
  // input: { date (YYYY-MM-DD), is_closed?, start_time?, end_time?, note? }
  if (!isSupabaseConfigured) {
    const created = {
      id: Date.now(),
      date: input.date,
      is_closed: input.is_closed ?? true,
      start_time: input.start_time ?? null,
      end_time: input.end_time ?? null,
      note: input.note ?? null,
    };
    MOCK_OVERRIDES_DB.push(created);
    MOCK_OVERRIDES_DB.sort((a, b) => (a.date < b.date ? -1 : 1));
    return ok(created);
  }
  const { data, error } = await supabase
    .from('availability_overrides')
    .insert({
      date: input.date,
      is_closed: input.is_closed ?? true,
      start_time: input.start_time ?? null,
      end_time: input.end_time ?? null,
      note: input.note ?? null,
    })
    .select()
    .single();
  if (error) return err(error);
  return ok(data);
}

export async function deleteAvailabilityOverride(id) {
  if (!isSupabaseConfigured) {
    const idx = MOCK_OVERRIDES_DB.findIndex((o) => o.id === id);
    if (idx >= 0) MOCK_OVERRIDES_DB.splice(idx, 1);
    return ok({ id });
  }
  const { error } = await supabase.from('availability_overrides').delete().eq('id', id);
  if (error) return err(error);
  return ok({ id });
}

// Días con al menos un slot libre en un rango. Usado por el calendario
// del wizard para resaltar qué días son seleccionables.
export async function fetchOpenDays({ from, to, durationMin = 50 }) {
  if (!isSupabaseConfigured) {
    // Mock: lunes a viernes del rango pedido, descartando los pasados.
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(from + 'T00:00:00');
    const end = new Date(to + 'T00:00:00');
    const out = [];
    for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const wd = d.getDay();
      if (wd === 0 || wd === 6) continue; // domingo/sábado
      if (d < today) continue;
      const pad = (n) => String(n).padStart(2, '0');
      out.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
    }
    return ok(out);
  }
  const { data, error } = await supabase.rpc('get_open_days_in_range', {
    start_date: from,
    end_date: to,
    duration_min: durationMin,
  });
  if (error) return err(error);
  return ok((data ?? []).map((r) => r.open_date ?? r));
}

// Slots libres para un día específico (HH:MM strings).
export async function fetchSlotsForDay({ date, durationMin = 50 }) {
  if (!isSupabaseConfigured) {
    return ok(MOCK_TIMES); // sin filtro de ocupado en mock
  }
  const { data, error } = await supabase.rpc('get_available_slots', {
    target_date: date,
    duration_min: durationMin,
  });
  if (error) return err(error);
  return ok((data ?? []).map((r) => r.slot ?? r));
}

// ─────────────────────────────────────────────
// RESERVAS
// ─────────────────────────────────────────────

// Fire-and-forget: notifica la edge function. Falla silenciosamente —
// la reserva ya quedó persistida; los correos son un nice-to-have.
async function notifyBookingConfirmation(input) {
  try {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!url || !key) return;
    const service = MOCK_SERVICES.find((s) => s.id === input.service_id);
    await fetch(`${url}/functions/v1/booking-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
        apikey: key,
      },
      body: JSON.stringify({
        ...input,
        service_name: service?.name,
        price_crc: service?.price,
      }),
    });
  } catch {
    /* no-op: los correos son best-effort */
  }
}

export async function createBooking(input) {
  // input: { service_id, scheduled_at (ISO), duration_min, modality, patient_name, patient_email, patient_phone, message, consent }
  if (!isSupabaseConfigured) {
    // En modo mock devolvemos una respuesta exitosa pero sin persistir
    return ok({ id: `mock-${Date.now()}`, ...input, status: 'pending' });
  }
  // Sin .select(): anon no tiene permiso RLS de SELECT en bookings, así que
  // pedir RETURNING haría que PostgREST devolviera error aunque el INSERT pase.
  // Devolvemos los datos que ya conocemos en el cliente.
  const { error } = await supabase
    .from('bookings')
    .insert({ ...input, status: 'pending' });
  if (error) return err(error);

  // Disparar correos de confirmación en background. NO await — si tarda o falla
  // no afecta la confirmación al paciente que ya vio "Listo".
  notifyBookingConfirmation(input);

  return ok({ ...input, status: 'pending' });
}

// Shape unificado para citas — el UI no se ramifica entre mock y Supabase:
// {
//   id, scheduled_at (ISO), date (YYYY-MM-DD), time (HH:MM),
//   duration_min, status, modality, patient_name, patient_email,
//   service: { id, name, duration_min },
//   client: { id, full_name },
// }
function normalizeMockBooking(a) {
  const client = mockFindClient(a.clientId);
  const service = MOCK_SERVICES.find((s) => s.id === a.serviceId) ?? MOCK_ADMIN_SERVICES.find((s) => s.id === a.serviceId);
  return {
    id: a.id,
    scheduled_at: `${a.date}T${a.time}:00.000Z`,
    date: a.date,
    time: a.time,
    duration_min: service?.dur ?? 50,
    status: a.status,
    modality: a.modality,
    patient_name: client?.name ?? 'Cliente',
    patient_email: client?.email ?? '',
    service: service ? { id: service.id, name: service.name, duration_min: service.dur } : null,
    client: client ? { id: client.id, full_name: client.name } : null,
  };
}

function normalizeDbBooking(row) {
  const d = new Date(row.scheduled_at);
  // Date/hora local (en CR el navegador del admin probablemente está en TZ correcta)
  const pad = (n) => String(n).padStart(2, '0');
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  return {
    id: row.id,
    scheduled_at: row.scheduled_at,
    date,
    time,
    duration_min: row.duration_min ?? row.services?.duration_min ?? 50,
    status: row.status,
    modality: row.modality,
    patient_name: row.patient_name,
    patient_email: row.patient_email,
    service: row.services ? { id: row.service_id, name: row.services.name, duration_min: row.services.duration_min } : null,
    client: row.clients ? { id: row.client_id, full_name: row.clients.full_name } : null,
  };
}

export async function listBookings({ from, to, status, search } = {}) {
  if (!isSupabaseConfigured) {
    let result = MOCK_APPTS.map(normalizeMockBooking);
    if (from) result = result.filter((a) => a.scheduled_at >= from);
    if (to) result = result.filter((a) => a.scheduled_at <= to);
    if (status === 'cancelled') {
      result = result.filter((a) => a.status === 'cancelled' || a.status === 'no_show');
    } else if (status) {
      result = result.filter((a) => a.status === status);
    }
    if (search?.trim()) {
      const q = search.toLowerCase();
      result = result.filter((a) => a.patient_name.toLowerCase().includes(q));
    }
    return ok(result);
  }

  let q = supabase
    .from('bookings')
    .select('*, services(name, duration_min), clients(full_name)')
    .order('scheduled_at', { ascending: false });

  if (from) q = q.gte('scheduled_at', from);
  if (to) q = q.lte('scheduled_at', to);
  if (status === 'cancelled') q = q.in('status', ['cancelled', 'no_show']);
  else if (status) q = q.eq('status', status);
  if (search?.trim()) q = q.ilike('patient_name', `%${search.trim()}%`);

  const { data, error } = await q;
  if (error) return err(error);
  return ok(data.map(normalizeDbBooking));
}

export async function updateBookingStatus(id, status, opts = {}) {
  if (!isSupabaseConfigured) {
    const idx = MOCK_APPTS.findIndex((a) => a.id === id);
    if (idx >= 0) MOCK_APPTS[idx] = { ...MOCK_APPTS[idx], status };
    return ok({ id, status });
  }
  const patch = { status };
  if (status === 'cancelled') {
    patch.cancelled_at = new Date().toISOString();
    if (opts.reason) patch.cancel_reason = opts.reason;
  }
  const { data, error } = await supabase
    .from('bookings')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) return err(error);
  return ok(data);
}

// Update genérico de booking (admin) — útil para meeting_url, modality, scheduled_at, etc.
export async function updateBooking(id, patch) {
  if (!isSupabaseConfigured) {
    const idx = MOCK_APPTS.findIndex((a) => a.id === id);
    if (idx >= 0) MOCK_APPTS[idx] = { ...MOCK_APPTS[idx], ...patch };
    return ok({ id, ...patch });
  }
  const { data, error } = await supabase
    .from('bookings')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) return err(error);
  return ok(data);
}

// Cancelación por el paciente autenticado. La policy bookings_self_cancel
// permite UPDATE sólo si: la cita es suya, está en pending/confirmed,
// faltan más de 24h, y se setea status='cancelled'.
export async function cancelMyBooking(id, reason = null) {
  if (!isSupabaseConfigured) return ok({ id, status: 'cancelled' });
  const { error } = await supabase
    .from('bookings')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      cancel_reason: reason,
    })
    .eq('id', id);
  if (error) return err(error);
  return ok({ id, status: 'cancelled' });
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
  if (!isSupabaseConfigured) {
    return ok(mockApptsByClient(clientId).map(normalizeMockBooking));
  }
  const { data, error } = await supabase
    .from('bookings')
    .select('*, services(name, duration_min), clients(full_name)')
    .eq('client_id', clientId)
    .order('scheduled_at', { ascending: false });
  if (error) return err(error);
  return ok(data.map(normalizeDbBooking));
}

// Admin: crear cliente (alta manual desde el panel)
export async function createClient(input) {
  // input: { name, email, phone?, age?, city?, status? }
  if (!isSupabaseConfigured) {
    const id = `c${String(MOCK_CLIENTS.length + 1).padStart(3, '0')}_${Date.now().toString(36)}`;
    const created = {
      id,
      name: input.name,
      firstName: (input.name || '').split(' ')[0] ?? '',
      age: input.age ?? null,
      email: input.email,
      phone: input.phone ?? '',
      sessions: 0,
      since: new Date().toLocaleDateString('es-CR', { month: 'short', year: 'numeric' }),
      city: input.city ?? '',
      status: input.status ?? 'new',
    };
    MOCK_CLIENTS.unshift(created);
    return ok(created);
  }
  const dbPatch = {
    full_name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    age: input.age ?? null,
    city: input.city ?? null,
    status: input.status ?? 'new',
  };
  const { data, error } = await supabase.from('clients').insert(dbPatch).select().single();
  if (error) return err(error);
  return ok(data);
}

export async function deleteClient(id) {
  if (!isSupabaseConfigured) {
    const idx = MOCK_CLIENTS.findIndex((c) => c.id === id);
    if (idx >= 0) MOCK_CLIENTS.splice(idx, 1);
    return ok({ id });
  }
  const { error } = await supabase.from('clients').delete().eq('id', id);
  if (error) return err(error);
  return ok({ id });
}

export async function updateClient(id, patch) {
  // patch en snake_case (full_name, email, phone, age, city, status, notes_internal)
  if (!isSupabaseConfigured) {
    const idx = MOCK_CLIENTS.findIndex((c) => c.id === id);
    if (idx < 0) return err('Cliente no encontrado.');
    if (patch.full_name) MOCK_CLIENTS[idx].name = patch.full_name;
    if (patch.email) MOCK_CLIENTS[idx].email = patch.email;
    if (patch.phone !== undefined) MOCK_CLIENTS[idx].phone = patch.phone ?? '';
    if (patch.age !== undefined) MOCK_CLIENTS[idx].age = patch.age;
    if (patch.city !== undefined) MOCK_CLIENTS[idx].city = patch.city ?? '';
    if (patch.status) MOCK_CLIENTS[idx].status = patch.status;
    return ok(MOCK_CLIENTS[idx]);
  }
  const { data, error } = await supabase
    .from('clients')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) return err(error);
  return ok(data);
}

// Admin: crear cita manualmente desde el panel
export async function createBookingAdmin(input) {
  // input: { client_id?, patient_name, patient_email, patient_phone?, service_id, scheduled_at (ISO), duration_min, modality, status? }
  if (!isSupabaseConfigured) {
    const date = input.scheduled_at.slice(0, 10);
    const time = input.scheduled_at.slice(11, 16);
    const created = {
      id: `a_${Date.now().toString(36)}`,
      clientId: input.client_id ?? null,
      serviceId: input.service_id,
      date,
      time,
      status: input.status ?? 'confirmed',
      modality: input.modality ?? 'online',
    };
    MOCK_APPTS.unshift(created);
    return ok(normalizeMockBooking(created));
  }
  const dbInput = {
    client_id: input.client_id ?? null,
    service_id: input.service_id,
    scheduled_at: input.scheduled_at,
    duration_min: input.duration_min,
    modality: input.modality ?? 'online',
    patient_name: input.patient_name,
    patient_email: input.patient_email,
    patient_phone: input.patient_phone ?? null,
    status: input.status ?? 'confirmed',
  };
  const { data, error } = await supabase
    .from('bookings')
    .insert(dbInput)
    .select('*, services(name, duration_min), clients(full_name)')
    .single();
  if (error) return err(error);
  return ok(normalizeDbBooking(data));
}

export async function deleteBooking(id) {
  if (!isSupabaseConfigured) {
    const idx = MOCK_APPTS.findIndex((a) => a.id === id);
    if (idx >= 0) MOCK_APPTS.splice(idx, 1);
    return ok({ id });
  }
  const { error } = await supabase.from('bookings').delete().eq('id', id);
  if (error) return err(error);
  return ok({ id });
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

// Para el portal: resuelve el client_id por email del paciente autenticado,
// después lista sus tareas. Como hoy no enlazamos auth.uid()→clients.auth_user_id
// (lo hacemos a futuro), buscamos por email.
export async function fetchMyTasksByEmail(email) {
  // En modo mock siempre devolvemos el catálogo de prueba (independiente del email),
  // así que el portal funciona sin sesión real durante tests/dev.
  if (!isSupabaseConfigured) return ok(MOCK_TASKS);
  if (!email) return ok([]);
  const { data: client, error: e1 } = await supabase
    .from('clients')
    .select('id')
    .eq('email', email)
    .maybeSingle();
  if (e1) return err(e1);
  if (!client) return ok([]);
  return fetchMyTasks(client.id);
}

// Admin: listar las tareas de un cliente
export async function fetchTasksForClient(clientId) {
  return fetchMyTasks(clientId);
}

// Admin: crear una tarea
export async function createTask({ client_id, title, description, due_date }) {
  if (!isSupabaseConfigured) return err('Sin backend — los cambios no persisten.');
  const { data, error } = await supabase
    .from('tasks')
    .insert({ client_id, title, description, due_date, status: 'pending' })
    .select()
    .single();
  if (error) return err(error);
  return ok(data);
}

// Admin: actualizar/eliminar
export async function updateTask(id, patch) {
  if (!isSupabaseConfigured) return err('Sin backend — los cambios no persisten.');
  if (patch.status === 'done' && !patch.completed_at) {
    patch.completed_at = new Date().toISOString();
  }
  const { data, error } = await supabase
    .from('tasks')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) return err(error);
  return ok(data);
}

export async function deleteTask(id) {
  if (!isSupabaseConfigured) return err('Sin backend — los cambios no persisten.');
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) return err(error);
  return ok({ id });
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

export async function fetchMyDocumentsByEmail(email) {
  if (!isSupabaseConfigured) return ok(MOCK_DOCS);
  if (!email) return ok([]);
  const { data: client, error: e1 } = await supabase
    .from('clients')
    .select('id')
    .eq('email', email)
    .maybeSingle();
  if (e1) return err(e1);
  if (!client) return ok([]);
  return fetchMyDocuments(client.id);
}

// Admin: agregar un documento compartido (modo link — la doctora pega URL externa)
export async function createDocument({ client_id, title, kind, external_url, meta }) {
  if (!isSupabaseConfigured) return err('Sin backend — los cambios no persisten.');
  const { data, error } = await supabase
    .from('documents')
    .insert({ client_id, title, kind: kind ?? 'pdf', external_url, meta })
    .select()
    .single();
  if (error) return err(error);
  return ok(data);
}

export async function deleteDocument(id) {
  if (!isSupabaseConfigured) return err('Sin backend — los cambios no persisten.');
  const { error } = await supabase.from('documents').delete().eq('id', id);
  if (error) return err(error);
  return ok({ id });
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

// ─────────────────────────────────────────────
// SETTINGS GLOBALES (app_settings)
// ─────────────────────────────────────────────

export async function fetchSettings() {
  if (!isSupabaseConfigured) {
    return ok({ ...MOCK_APP_SETTINGS });
  }
  const { data, error } = await supabase.from('app_settings').select('key, value');
  if (error) return err(error);
  const out = {};
  for (const row of data ?? []) {
    out[row.key] = row.value;
  }
  return ok(out);
}

export async function updateSetting(key, value) {
  if (!isSupabaseConfigured) {
    MOCK_APP_SETTINGS[key] = value;
    return ok({ key, value });
  }
  const { data, error } = await supabase
    .from('app_settings')
    .upsert({ key, value }, { onConflict: 'key' })
    .select()
    .single();
  if (error) return err(error);
  return ok(data);
}

// ─────────────────────────────────────────────
// NOTAS CLÍNICAS (privadas — sólo admin lee/escribe via RLS)
// ─────────────────────────────────────────────

export async function fetchClinicalNotes(clientId) {
  if (!isSupabaseConfigured) {
    return ok(MOCK_CLINICAL_NOTES.filter((n) => n.client_id === clientId).sort((a, b) => (a.created_at < b.created_at ? 1 : -1)));
  }
  if (!clientId) return ok([]);
  const { data, error } = await supabase
    .from('clinical_notes')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });
  if (error) return err(error);
  return ok(data);
}

export async function createClinicalNote({ client_id, booking_id = null, body }) {
  if (!isSupabaseConfigured) {
    const note = {
      id: `n_${Date.now().toString(36)}`,
      client_id,
      booking_id,
      body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    MOCK_CLINICAL_NOTES.unshift(note);
    return ok(note);
  }
  const { data, error } = await supabase
    .from('clinical_notes')
    .insert({ client_id, booking_id, body })
    .select()
    .single();
  if (error) return err(error);
  return ok(data);
}

export async function updateClinicalNote(id, body) {
  if (!isSupabaseConfigured) {
    const idx = MOCK_CLINICAL_NOTES.findIndex((n) => n.id === id);
    if (idx < 0) return err('Nota no encontrada.');
    MOCK_CLINICAL_NOTES[idx] = {
      ...MOCK_CLINICAL_NOTES[idx],
      body,
      updated_at: new Date().toISOString(),
    };
    return ok(MOCK_CLINICAL_NOTES[idx]);
  }
  const { data, error } = await supabase
    .from('clinical_notes')
    .update({ body })
    .eq('id', id)
    .select()
    .single();
  if (error) return err(error);
  return ok(data);
}

export async function deleteClinicalNote(id) {
  if (!isSupabaseConfigured) {
    const idx = MOCK_CLINICAL_NOTES.findIndex((n) => n.id === id);
    if (idx >= 0) MOCK_CLINICAL_NOTES.splice(idx, 1);
    return ok({ id });
  }
  const { error } = await supabase.from('clinical_notes').delete().eq('id', id);
  if (error) return err(error);
  return ok({ id });
}

// Re-export tiempos disponibles para el wizard (no van a DB todavía)
export { MOCK_TIMES as TIMES };
