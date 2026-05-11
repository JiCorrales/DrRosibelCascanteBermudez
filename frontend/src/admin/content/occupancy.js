// Cruza AVAILABILITY_RULES con APPOINTMENTS para detectar semanas/días con
// baja ocupación. Sirve para sugerirle a la doctora cuándo publicar contenido
// de captación (idealmente 2-3 días antes de un hueco).
//
// Como hoy todavía usamos mocks, importamos directo de admin-data.js. Cuando
// migremos a Supabase, esto se reemplaza por un hook con TanStack Query
// (`useOccupancyByWeek`) sin cambiar la API pública del módulo.

import { AVAILABILITY_RULES, APPOINTMENTS, TODAY } from '../../mock/admin-data.js';

const DAY_ORDER = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const DAY_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function pad(n) {
  return String(n).padStart(2, '0');
}

function toISODate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseISODate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// "Hoy" se calcula desde el mock para que la UI no se rompa cuando el reloj
// real esté fuera de la ventana de citas. Más adelante usamos Date real.
export function getToday() {
  const { year, month, day } = TODAY;
  return new Date(year, month - 1, day);
}

// Lunes de la semana de una fecha (lunes = inicio).
function mondayOf(date) {
  const d = new Date(date);
  const wd = d.getDay(); // 0..6, domingo=0
  const diff = wd === 0 ? -6 : 1 - wd;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Devuelve [{ date, iso, weekdayName, weekdayShort, isWorkingDay, range }] para
// los 7 días desde un lunes dado.
function buildWeekDays(monday) {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const weekdayName = DAY_ORDER[d.getDay()];
    const rule = AVAILABILITY_RULES.find((r) => r.day === weekdayName);
    days.push({
      date: d,
      iso: toISODate(d),
      weekdayName,
      weekdayShort: DAY_SHORT[d.getDay()],
      isWorkingDay: Boolean(rule?.active),
      range: rule?.range ?? 'Cerrado',
    });
  }
  return days;
}

// Estimación de capacidad diaria a partir del range "HH:MM — HH:MM".
// Asumimos sesiones de 50 min con buffer de 15 → ~65 min por slot.
function dayCapacityFromRange(range) {
  if (!range || range.toLowerCase().includes('cerrado')) return 0;
  const match = range.match(/(\d+):(\d+)\s*[—-]\s*(\d+):(\d+)/);
  if (!match) return 0;
  const [, h1, m1, h2, m2] = match.map(Number);
  const minutes = (h2 * 60 + m2) - (h1 * 60 + m1);
  if (minutes <= 0) return 0;
  return Math.max(1, Math.round(minutes / 65));
}

// Cuenta citas confirmadas o pendientes en una fecha (las canceladas/no-show
// liberan slot y no cuentan).
function bookedCount(iso) {
  return APPOINTMENTS.filter(
    (a) => a.date === iso && (a.status === 'confirmed' || a.status === 'pending')
  ).length;
}

// ─────── API pública ───────

// Devuelve la grilla de 7 días con ocupación por día.
// [{ iso, weekdayShort, isWorkingDay, booked, capacity, ratio, level }]
// level ∈ 'closed' | 'low' | 'medium' | 'high'
export function weekOccupancy(weekStart) {
  const monday = mondayOf(weekStart);
  const days = buildWeekDays(monday);

  return days.map((d) => {
    const capacity = dayCapacityFromRange(d.range);
    const booked = d.isWorkingDay ? bookedCount(d.iso) : 0;
    const ratio = capacity > 0 ? booked / capacity : 0;

    let level = 'closed';
    if (d.isWorkingDay) {
      if (ratio >= 0.75) level = 'high';
      else if (ratio >= 0.4) level = 'medium';
      else level = 'low';
    }

    return { ...d, booked, capacity, ratio, level };
  });
}

// Genera sugerencias de contenido a partir de la ocupación de las próximas
// 2 semanas. Devuelve frases listas para mostrar en una card.
export function getContentSuggestions() {
  const today = getToday();
  const thisWeek = weekOccupancy(today);
  const next = new Date(today);
  next.setDate(today.getDate() + 7);
  const nextWeek = weekOccupancy(next);

  const suggestions = [];

  const lowThisWeek = thisWeek.filter(
    (d) => d.isWorkingDay && d.level === 'low' && d.date >= today
  );
  const lowNextWeek = nextWeek.filter((d) => d.isWorkingDay && d.level === 'low');

  if (lowThisWeek.length >= 2) {
    const dayList = lowThisWeek.map((d) => d.weekdayShort).join(', ');
    suggestions.push({
      kind: 'low-occupancy',
      tone: 'warn',
      title: 'Esta semana tenés huecos',
      body: `${dayList} con baja ocupación. Considerá publicar un post de captación hoy.`,
    });
  } else if (lowNextWeek.length >= 2) {
    const dayList = lowNextWeek.map((d) => d.weekdayShort).join(', ');
    suggestions.push({
      kind: 'low-occupancy-next',
      tone: 'info',
      title: 'Próxima semana hay espacio',
      body: `${dayList} con baja ocupación. Un post el viernes o sábado capta bien para la semana que viene.`,
    });
  }

  // Si la semana viene muy llena, sugerir contenido educativo (no de captación)
  const totalNextWeek = nextWeek.reduce((sum, d) => sum + d.booked, 0);
  const capNextWeek = nextWeek.reduce((sum, d) => sum + d.capacity, 0);
  if (capNextWeek > 0 && totalNextWeek / capNextWeek >= 0.75) {
    suggestions.push({
      kind: 'high-occupancy',
      tone: 'good',
      title: 'Próxima semana está llena',
      body: 'Buen momento para publicar contenido educativo o testimonios (no captación).',
    });
  }

  // Sugerir 1 post por semana mínimo
  if (suggestions.length === 0) {
    suggestions.push({
      kind: 'baseline',
      tone: 'info',
      title: 'Ritmo recomendado',
      body: 'Publicar 1-2 veces por semana sostiene presencia sin saturar.',
    });
  }

  return suggestions;
}

// Resumen para el dashboard
export function getWeekSummary() {
  const today = getToday();
  const days = weekOccupancy(today);
  const working = days.filter((d) => d.isWorkingDay);
  const totalBooked = working.reduce((sum, d) => sum + d.booked, 0);
  const totalCap = working.reduce((sum, d) => sum + d.capacity, 0);
  return {
    weekDays: days,
    totalBooked,
    totalCap,
    ratio: totalCap > 0 ? totalBooked / totalCap : 0,
    weekStartLabel: `${days[0].date.getDate()} — ${days[6].date.getDate()} ${days[6].date.toLocaleDateString('es-CR', { month: 'long' })}`,
  };
}

export const _internals = { mondayOf, dayCapacityFromRange, bookedCount };
