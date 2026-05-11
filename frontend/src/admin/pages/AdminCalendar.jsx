import React, { useEffect, useMemo, useState } from 'react';
import { AdminTopbar } from '../AdminShell.jsx';
import { Btn, Stack, Row, H3, Body, Meta, Icon, Pill } from '../../components/primitives.jsx';
import { useBookings } from '../../lib/queries.js';

const HOURS = ['8', '9', '10', '11', '12', '13', '14', '15', '16', '17'];
const SLOT_HEIGHT = 56;
const HEADER_HEIGHT = 56;

const SHORT_DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function pad(n) {
  return String(n).padStart(2, '0');
}
function ymd(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function mondayOf(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function weekDates(monday) {
  const today = ymd(new Date());
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      date: ymd(d),
      short: SHORT_DAYS[d.getDay()],
      day: String(d.getDate()),
      monthShort: MONTHS[d.getMonth()],
      isToday: ymd(d) === today,
    };
  });
}

function eventTop(time) {
  const [h, m] = time.split(':').map(Number);
  return HEADER_HEIGHT + (h - 8) * SLOT_HEIGHT + (m / 60) * SLOT_HEIGHT;
}

function IconBtn({ label, rotate, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      style={{
        width: 32,
        height: 32,
        borderRadius: 6,
        border: '1px solid var(--line)',
        background: '#fff',
        color: 'var(--ink-700)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transform: rotate ? 'rotate(180deg)' : undefined,
      }}
    >
      <Icon name="back" size={12} />
    </button>
  );
}

export default function AdminCalendar() {
  const [isCompact, setIsCompact] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 900px)').matches : false
  );

  const [anchor, setAnchor] = useState(() => mondayOf(new Date()));
  const week = useMemo(() => weekDates(anchor), [anchor]);
  const todayDate = week.find((d) => d.isToday)?.date ?? week[0].date;
  const [activeDate, setActiveDate] = useState(todayDate);

  // Sincronizar activeDate cuando cambia la semana
  useEffect(() => {
    setActiveDate(week.find((d) => d.isToday)?.date ?? week[0].date);
  }, [anchor]); // eslint-disable-line

  useEffect(() => {
    document.title = 'Calendario · Admin · Rosibel';
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(max-width: 900px)');
    const handler = (e) => setIsCompact(e.matches);
    mql.addEventListener?.('change', handler) ?? mql.addListener(handler);
    return () => {
      mql.removeEventListener?.('change', handler) ?? mql.removeListener(handler);
    };
  }, []);

  const weekFromIso = useMemo(() => new Date(week[0].date + 'T00:00:00').toISOString(), [week]);
  const weekToIso = useMemo(() => {
    const last = new Date(week[6].date + 'T23:59:59');
    return last.toISOString();
  }, [week]);

  const bookingsQ = useBookings({ from: weekFromIso, to: weekToIso });
  const bookings = bookingsQ.data ?? [];

  const dayAppts = bookings
    .filter((b) => b.date === activeDate)
    .slice()
    .sort((x, y) => (x.time < y.time ? -1 : 1));

  const weekRangeLabel = `${week[0].day} ${week[0].monthShort} – ${week[6].day} ${week[6].monthShort} ${anchor.getFullYear()}`;

  const goPrev = () => {
    const d = new Date(anchor);
    d.setDate(anchor.getDate() - 7);
    setAnchor(d);
  };
  const goNext = () => {
    const d = new Date(anchor);
    d.setDate(anchor.getDate() + 7);
    setAnchor(d);
  };
  const goToday = () => {
    setAnchor(mondayOf(new Date()));
    setActiveDate(ymd(new Date()));
  };

  return (
    <>
      <AdminTopbar
        title="Calendario"
        sub={`Semana ${weekRangeLabel}`}
        action={<Btn small icon={false}>+ Nueva</Btn>}
      />
      <div className="admin-content">
        <Stack gap={16}>
          <Row justify="space-between" align="center" wrap style={{ gap: 12 }}>
            <Row gap={12} align="center">
              <Btn small ghost icon={false} onClick={goToday}>
                Hoy
              </Btn>
              <Row gap={6}>
                <IconBtn label="Semana anterior" rotate={false} onClick={goPrev} />
                <IconBtn label="Semana siguiente" rotate onClick={goNext} />
              </Row>
              <H3 size={16} style={{ display: isCompact ? 'none' : 'block' }}>
                Sem. {weekRangeLabel}
              </H3>
            </Row>
            <Row gap={6} role="tablist" aria-label="Vista del calendario">
              <Pill outline>Día</Pill>
              <Pill>Semana</Pill>
              <Pill outline>Mes</Pill>
            </Row>
          </Row>

          {bookingsQ.isError && (
            <Body
              role="alert"
              style={{
                padding: '12px 16px',
                background: 'var(--danger-100)',
                color: 'var(--danger-500)',
                border: '1px solid rgba(184,84,80,0.28)',
                borderRadius: 'var(--r-md)',
              }}
            >
              No pudimos cargar las citas: {bookingsQ.error?.message ?? 'error desconocido'}
            </Body>
          )}

          {isCompact ? (
            <Stack gap={14}>
              <div className="cal-day-strip" role="tablist" aria-label="Días de la semana">
                {week.map((d) => (
                  <button
                    key={d.date}
                    type="button"
                    role="tab"
                    aria-selected={activeDate === d.date}
                    onClick={() => setActiveDate(d.date)}
                    className={`cal-day-pill${d.isToday ? ' today' : ''}${activeDate === d.date ? ' active' : ''}`}
                  >
                    <span className="short">{d.short}</span>
                    <span className="num">{d.day}</span>
                  </button>
                ))}
              </div>

              <Stack gap={4}>
                <Meta>
                  {dayAppts.length} cita{dayAppts.length !== 1 ? 's' : ''} ·{' '}
                  {week.find((d) => d.date === activeDate)?.short}{' '}
                  {week.find((d) => d.date === activeDate)?.day}{' '}
                  {week.find((d) => d.date === activeDate)?.monthShort}
                </Meta>
              </Stack>

              {bookingsQ.isLoading ? (
                <Body style={{ padding: 24, textAlign: 'center', color: 'var(--ink-500)' }}>
                  Cargando citas…
                </Body>
              ) : dayAppts.length === 0 ? (
                <Body style={{ padding: 24, textAlign: 'center', color: 'var(--ink-500)' }}>
                  Sin citas para este día.
                </Body>
              ) : (
                <div className="cal-list">
                  {dayAppts.map((a) => {
                    const cls = a.status === 'pending' ? 'cal-list__item pending' : 'cal-list__item';
                    return (
                      <div key={a.id} className={cls}>
                        <Stack gap={2}>
                          <span className="cal-list__time">{a.time}</span>
                          <span className="cal-list__dur">{a.duration_min} min</span>
                        </Stack>
                        <Stack gap={2} style={{ minWidth: 0 }}>
                          <span className="cal-list__name">{a.client?.full_name ?? a.patient_name}</span>
                          <span className="cal-list__sub">
                            {a.service?.name ?? 'Servicio'} · {a.modality === 'online' ? 'Online' : 'Presencial'}
                          </span>
                        </Stack>
                        <Icon name="arrow" size={14} color="var(--ink-300)" />
                      </div>
                    );
                  })}
                </div>
              )}
            </Stack>
          ) : (
            <div className="cal-grid" style={{ minHeight: HEADER_HEIGHT + HOURS.length * SLOT_HEIGHT }}>
              <div className="gutter">
                <div style={{ height: HEADER_HEIGHT, borderBottom: '1px solid var(--line)' }} />
                {HOURS.map((h) => (
                  <div
                    key={h}
                    style={{
                      height: SLOT_HEIGHT,
                      padding: '4px 8px',
                      textAlign: 'right',
                      borderBottom: '1px solid var(--line)',
                    }}
                  >
                    {h}:00
                  </div>
                ))}
              </div>

              {week.map((d) => {
                const events = bookings.filter((b) => b.date === d.date);
                return (
                  <div key={d.date} className="day-col">
                    <div
                      className={`header-cell ${d.isToday ? 'today' : ''}`}
                      style={{ height: HEADER_HEIGHT, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                    >
                      <div style={{ fontSize: 11, color: 'var(--ink-500)' }}>{d.short}</div>
                      <H3 size={15} style={{ color: d.isToday ? 'var(--sage-700)' : 'var(--ink-900)' }}>
                        {d.day}
                      </H3>
                    </div>
                    {HOURS.map((h) => (
                      <div key={h} className="slot" />
                    ))}
                    {events.map((a) => {
                      const cls = a.status === 'pending' ? 'cal-event pending' : 'cal-event';
                      const firstName = (a.client?.full_name ?? a.patient_name ?? '').split(' ')[0];
                      return (
                        <div
                          key={a.id}
                          className={cls}
                          style={{
                            top: eventTop(a.time),
                            height: (a.duration_min / 60) * SLOT_HEIGHT - 4,
                          }}
                        >
                          <div style={{ fontWeight: 600 }}>{firstName || 'Cliente'}</div>
                          <div style={{ color: 'var(--ink-500)', fontSize: 10 }}>
                            {a.time} · {a.duration_min} min
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </Stack>
      </div>
    </>
  );
}
