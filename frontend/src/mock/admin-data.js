// Mock data para /admin/* y /portal/*. Todo vive client-side; cuando llegue Supabase
// reemplazar estos arrays por queries reales en src/lib/api.js.
//
// Hoy "es" jueves 14 de mayo de 2026.

import { SERVICES } from '../data.js';

export const TODAY = { dayLabel: 'Jueves 14 de mayo, 2026', day: 14, month: 5, year: 2026 };

// ─────── Clientes (12) ───────
const NAMES = [
  ['María', 32, 'maria.alvarez@correo.com', 8, 'mar 2025', 'San Pedro, SJ'],
  ['Andrés', 41, 'andres.lopez@correo.com', 14, 'oct 2024', 'Escazú, SJ'],
  ['Laura', 29, 'laura.mora@correo.com', 22, 'feb 2024', 'Curridabat, SJ'],
  ['José', 36, 'jose.castro@correo.com', 3, 'abr 2026', 'Heredia'],
  ['Camila', 24, 'camila.solis@correo.com', 6, 'dic 2025', 'Tibás, SJ'],
  ['Diego', 45, 'diego.rojas@correo.com', 11, 'jun 2025', 'San Pedro, SJ'],
  ['Sofía', 31, 'sofia.vargas@correo.com', 5, 'ene 2026', 'Cartago'],
  ['Lucía', 28, 'lucia.fernandez@correo.com', 9, 'sep 2025', 'San Pedro, SJ'],
  ['Mateo', 39, 'mateo.guzman@correo.com', 16, 'jul 2024', 'Alajuela'],
  ['Valeria', 22, 'valeria.cordero@correo.com', 2, 'abr 2026', 'San José Centro'],
  ['Pablo', 50, 'pablo.jimenez@correo.com', 18, 'mar 2024', 'Escazú, SJ'],
  ['Isabella', 17, 'isabella.brenes@correo.com', 4, 'feb 2026', 'San Pedro, SJ'],
];

export const CLIENTS = NAMES.map(([first, age, email, sessions, since, city], i) => {
  const id = `c${String(i + 1).padStart(3, '0')}`;
  const phone = `+506 ${String(8000 + i * 11).padStart(4, '0')} ${String(1234 + i * 7).padStart(4, '0')}`;
  return {
    id,
    name: `${first} ${['Álvarez', 'López', 'Mora', 'Castro', 'Solís', 'Rojas', 'Vargas', 'Fernández', 'Guzmán', 'Cordero', 'Jiménez', 'Brenes'][i]}`,
    firstName: first,
    age,
    email,
    phone,
    sessions,
    since,
    city,
    status: sessions > 1 ? 'active' : 'new',
  };
});

export const findClient = (id) => CLIENTS.find((c) => c.id === id);

// ─────── Citas (15) ───────
const SVC = SERVICES.map((s) => s.id);

export const APPOINTMENTS = [
  // Hoy
  { id: 'a01', clientId: 'c001', serviceId: 'individual',       date: '2026-05-14', time: '09:00', status: 'confirmed', modality: 'online' },
  { id: 'a02', clientId: 'c002', serviceId: 'individual',       date: '2026-05-14', time: '10:00', status: 'confirmed', modality: 'online' },
  { id: 'a03', clientId: 'c004', serviceId: 'primer-encuentro', date: '2026-05-14', time: '11:30', status: 'pending',   modality: 'online' },
  { id: 'a04', clientId: 'c005', serviceId: 'pareja',           date: '2026-05-14', time: '14:00', status: 'confirmed', modality: 'presencial' },
  { id: 'a05', clientId: 'c006', serviceId: 'individual',       date: '2026-05-14', time: '15:30', status: 'confirmed', modality: 'online' },
  { id: 'a06', clientId: 'c008', serviceId: 'individual',       date: '2026-05-14', time: '16:30', status: 'pending',   modality: 'presencial' },

  // Mañana (15 may)
  { id: 'a07', clientId: 'c003', serviceId: 'individual',       date: '2026-05-15', time: '09:00', status: 'confirmed', modality: 'online' },
  { id: 'a08', clientId: 'c007', serviceId: 'adolescentes',     date: '2026-05-15', time: '11:00', status: 'confirmed', modality: 'presencial' },
  { id: 'a09', clientId: 'c012', serviceId: 'adolescentes',     date: '2026-05-15', time: '14:30', status: 'pending',   modality: 'online' },

  // Próxima semana
  { id: 'a10', clientId: 'c001', serviceId: 'individual',       date: '2026-05-21', time: '09:00', status: 'confirmed', modality: 'online' },
  { id: 'a11', clientId: 'c009', serviceId: 'individual',       date: '2026-05-19', time: '10:00', status: 'confirmed', modality: 'presencial' },

  // Pasadas
  { id: 'a12', clientId: 'c001', serviceId: 'individual',       date: '2026-05-07', time: '09:00', status: 'completed', modality: 'online' },
  { id: 'a13', clientId: 'c002', serviceId: 'individual',       date: '2026-05-07', time: '10:00', status: 'completed', modality: 'online' },
  { id: 'a14', clientId: 'c010', serviceId: 'primer-encuentro', date: '2026-05-06', time: '15:00', status: 'no_show',   modality: 'online' },
  { id: 'a15', clientId: 'c011', serviceId: 'pareja',           date: '2026-05-05', time: '14:00', status: 'cancelled', modality: 'presencial' },
];

export const APPT_STATUS = {
  pending:   { label: 'Pendiente',  variant: 'warning' },
  confirmed: { label: 'Confirmada', variant: 'sage' },
  completed: { label: 'Completada', variant: 'completed' },
  cancelled: { label: 'Cancelada',  variant: 'muted' },
  no_show:   { label: 'No asistió', variant: 'danger' },
};

export const findAppt = (id) => APPOINTMENTS.find((a) => a.id === id);
export const apptsByClient = (clientId) =>
  APPOINTMENTS.filter((a) => a.clientId === clientId).sort((x, y) => (x.date + x.time < y.date + y.time ? 1 : -1));
export const apptsToday = () => APPOINTMENTS.filter((a) => a.date === '2026-05-14').sort((x, y) => (x.time < y.time ? -1 : 1));

// ─────── Disponibilidad ───────
export const AVAILABILITY_RULES = [
  { day: 'Lunes',     range: '9:00 — 17:00', active: true },
  { day: 'Martes',    range: '9:00 — 17:00', active: true },
  { day: 'Miércoles', range: '9:00 — 13:00', active: true },
  { day: 'Jueves',    range: '9:00 — 17:00', active: true },
  { day: 'Viernes',   range: '9:00 — 15:00', active: true },
  { day: 'Sábado',    range: 'Cerrado',      active: false },
  { day: 'Domingo',   range: 'Cerrado',      active: false },
];

export const BLOCKED_DATES = [
  'Lun 22 — Vie 26 jul · Vacaciones',
  'Lun 15 sep · Feriado',
  'Mié 25 dic · Navidad',
];

// Shape DB-like para hooks que esperan el formato real de Supabase.
// weekday: 0=Dom, 1=Lun, ..., 6=Sáb. start/end_time en formato HH:MM:SS.
export const AVAILABILITY_RULES_DB = [
  { id: 1, weekday: 0, start_time: '09:00:00', end_time: '17:00:00', active: false },
  { id: 2, weekday: 1, start_time: '09:00:00', end_time: '17:00:00', active: true },
  { id: 3, weekday: 2, start_time: '09:00:00', end_time: '17:00:00', active: true },
  { id: 4, weekday: 3, start_time: '09:00:00', end_time: '13:00:00', active: true },
  { id: 5, weekday: 4, start_time: '09:00:00', end_time: '17:00:00', active: true },
  { id: 6, weekday: 5, start_time: '09:00:00', end_time: '15:00:00', active: true },
  { id: 7, weekday: 6, start_time: '09:00:00', end_time: '17:00:00', active: false },
];

export const AVAILABILITY_OVERRIDES_DB = [
  { id: 101, date: '2026-07-22', is_closed: true, start_time: null, end_time: null, note: 'Vacaciones (inicio)' },
  { id: 102, date: '2026-07-26', is_closed: true, start_time: null, end_time: null, note: 'Vacaciones (fin)' },
  { id: 103, date: '2026-09-15', is_closed: true, start_time: null, end_time: null, note: 'Feriado · Independencia' },
  { id: 104, date: '2026-12-25', is_closed: true, start_time: null, end_time: null, note: 'Navidad' },
];

// Settings globales mock (key/value como app_settings real)
export const APP_SETTINGS = {
  buffer_min: 15,
};

// Notas clínicas mock por cliente
export const CLINICAL_NOTES = [];

// ─────── KPIs dashboard ───────
export const KPIS = [
  { label: 'Citas hoy',     value: 6,        sub: '2 pendientes por confirmar' },
  { label: 'Semana',        value: 22,       sub: '+4 vs. semana pasada' },
  { label: 'Pendientes',    value: 3,        sub: 'por confirmar' },
  { label: 'Ingresos mes',  value: '₡520k',  sub: 'al 14 de mayo' },
];

export const UPCOMING = [
  'Mañana · 8 citas',
  'Sábado · día libre',
  'Lun 18 may · 4 citas',
];

// ─────── Servicios extendidos (para CRUD) ───────
export const ADMIN_SERVICES = [
  ...SERVICES.map((s) => ({
    ...s,
    modality: 'both',
    buffer: 15,
    active: true,
    sessionsCount: 12 + Math.floor(Math.random() * 30),
  })),
  {
    id: 'evaluacion',
    name: 'Evaluación clínica',
    dur: 90,
    price: 45000,
    desc: 'Evaluación clínica inicial para casos complejos.',
    forYou: ['querés un diagnóstico estructurado', 'venís derivado/a por otro profesional'],
    modality: 'presencial',
    buffer: 30,
    active: false,
    sessionsCount: 0,
  },
];

// ─────── Portal paciente (Fase 2) ───────
// "Sesión" actual = María (c001)
export const PORTAL_USER = CLIENTS[0];

export const PORTAL_TASKS = [
  {
    id: 't01',
    title: 'Registro emocional diario',
    description: 'Anotar 3 emociones cada noche antes de dormir.',
    meta: 'Asignado lunes · 1/7 días',
    status: 'pending',
    progress: [1, 1, 1, 1, 0, 0, 0],
  },
  {
    id: 't02',
    title: 'Lectura: ansiedad y respiración',
    description: 'PDF de 4 páginas con un ejercicio guiado al final.',
    meta: '3 días atrás',
    status: 'in_progress',
  },
  {
    id: 't03',
    title: 'Ejercicio de raíz física',
    description: 'Caminata de 10 min sin teléfono.',
    meta: 'Semana pasada',
    status: 'pending',
  },
  {
    id: 't04',
    title: 'Ejercicio de gratitud',
    description: 'Listar 5 cosas por las que estás agradecida.',
    meta: 'Completado hace 8 días',
    status: 'done',
  },
];

export const PORTAL_DOCS = [
  { id: 'd01', title: 'Consentimiento informado',     meta: 'PDF · firmado 12 mar 2025',  type: 'pdf' },
  { id: 'd02', title: 'Guía para la primera sesión',  meta: 'PDF · 4 páginas',           type: 'pdf' },
  { id: 'd03', title: 'Plan de trabajo · trimestre 1', meta: 'PDF · 2 páginas',           type: 'pdf' },
  { id: 'd04', title: 'Audio: respiración guiada',     meta: 'Audio · 8 min',             type: 'audio' },
  { id: 'd05', title: 'Diario de emociones (plantilla)', meta: 'PDF · 1 página',          type: 'pdf' },
];

export const PORTAL_APPTS = [
  { id: 'pa1', date: 'Jue 14 may', time: '11:00', service: 'Terapia individual', modality: 'Online',      status: 'Confirmada',    upcoming: true,  next: true  },
  { id: 'pa2', date: 'Jue 21 may', time: '11:00', service: 'Terapia individual', modality: 'Online',      status: 'Confirmada',    upcoming: true,  next: false },
  { id: 'pa3', date: 'Jue 28 may', time: '11:00', service: 'Terapia individual', modality: 'Presencial',  status: 'Por confirmar', upcoming: true,  next: false },
  { id: 'pa4', date: 'Jue 7 may',  time: '11:00', service: 'Terapia individual', modality: 'Online',      status: 'Completada',    upcoming: false, next: false },
  { id: 'pa5', date: 'Jue 30 abr', time: '11:00', service: 'Terapia individual', modality: 'Online',      status: 'Completada',    upcoming: false, next: false },
];
