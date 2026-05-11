import React, { useEffect, useState } from 'react';
import { AdminTopbar } from '../AdminShell.jsx';
import { Btn, Stack, Row, H3, Body, Meta, Icon, Pill } from '../../components/primitives.jsx';
import { APPOINTMENTS, findClient } from '../../mock/admin-data.js';
import { findService } from '../../data.js';

const HOURS = ['8', '9', '10', '11', '12', '13', '14', '15', '16', '17'];
const WEEK_DATES = [
  { date: '2026-05-11', short: 'Lun', day: '11', isToday: false },
  { date: '2026-05-12', short: 'Mar', day: '12', isToday: false },
  { date: '2026-05-13', short: 'Mié', day: '13', isToday: false },
  { date: '2026-05-14', short: 'Jue', day: '14', isToday: true },
  { date: '2026-05-15', short: 'Vie', day: '15', isToday: false },
  { date: '2026-05-16', short: 'Sáb', day: '16', isToday: false },
  { date: '2026-05-17', short: 'Dom', day: '17', isToday: false },
];

const SLOT_HEIGHT = 56;
const HEADER_HEIGHT = 56;

function eventTop(time) {
  const [h, m] = time.split(':').map(Number);
  return HEADER_HEIGHT + (h - 8) * SLOT_HEIGHT + (m / 60) * SLOT_HEIGHT;
}

export default function AdminCalendar() {
  const [isCompact, setIsCompact] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 900px)').matches : false
  );
  const todayInitial = WEEK_DATES.find((d) => d.isToday)?.date ?? WEEK_DATES[0].date;
  const [activeDate, setActiveDate] = useState(todayInitial);

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

  const dayAppts = APPOINTMENTS
    .filter((a) => a.date === activeDate)
    .slice()
    .sort((x, y) => (x.time < y.time ? -1 : 1));

  return (
    <>
      <AdminTopbar
        title="Calendario"
        sub="Semana del 11 al 17 de mayo, 2026"
        action={<Btn small icon={false}>+ Nueva</Btn>}
      />
      <div className="admin-content">
        <Stack gap={16}>
          <Row justify="space-between" align="center" wrap style={{ gap: 12 }}>
            <Row gap={12} align="center">
              <Btn small ghost icon={false} onClick={() => setActiveDate(todayInitial)}>
                Hoy
              </Btn>
              <Row gap={6}>
                <IconBtn label="Semana anterior" rotate={false} />
                <IconBtn label="Semana siguiente" rotate />
              </Row>
              <H3 size={16} style={{ display: isCompact ? 'none' : 'block' }}>
                Sem. del 11 al 17 de mayo
              </H3>
            </Row>
            <Row gap={6} role="tablist" aria-label="Vista del calendario">
              <Pill outline>Día</Pill>
              <Pill>Semana</Pill>
              <Pill outline>Mes</Pill>
            </Row>
          </Row>

          {isCompact ? (
            <Stack gap={14}>
              <div className="cal-day-strip" role="tablist" aria-label="Días de la semana">
                {WEEK_DATES.map((d) => (
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
                  {WEEK_DATES.find((d) => d.date === activeDate)?.short}{' '}
                  {WEEK_DATES.find((d) => d.date === activeDate)?.day} mayo
                </Meta>
              </Stack>

              {dayAppts.length === 0 ? (
                <Body style={{ padding: 24, textAlign: 'center', color: 'var(--ink-500)' }}>
                  Sin citas para este día.
                </Body>
              ) : (
                <div className="cal-list">
                  {dayAppts.map((a) => {
                    const client = findClient(a.clientId);
                    const service = findService(a.serviceId);
                    const cls = a.status === 'pending' ? 'cal-list__item pending' : 'cal-list__item';
                    return (
                      <div key={a.id} className={cls}>
                        <Stack gap={2}>
                          <span className="cal-list__time">{a.time}</span>
                          <span className="cal-list__dur">{service?.dur ?? 50} min</span>
                        </Stack>
                        <Stack gap={2} style={{ minWidth: 0 }}>
                          <span className="cal-list__name">{client?.name ?? 'Cliente'}</span>
                          <span className="cal-list__sub">
                            {service?.name ?? 'Servicio'} · {a.modality === 'online' ? 'Online' : 'Presencial'}
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

              {WEEK_DATES.map((d) => {
                const events = APPOINTMENTS.filter((a) => a.date === d.date);
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
                      const client = findClient(a.clientId);
                      const service = findService(a.serviceId);
                      const cls = a.status === 'pending' ? 'cal-event pending' : 'cal-event';
                      return (
                        <div
                          key={a.id}
                          className={cls}
                          style={{
                            top: eventTop(a.time),
                            height: ((service?.dur ?? 50) / 60) * SLOT_HEIGHT - 4,
                          }}
                        >
                          <div style={{ fontWeight: 600 }}>{client?.firstName ?? 'Cliente'}</div>
                          <div style={{ color: 'var(--ink-500)', fontSize: 10 }}>
                            {a.time} · {service?.dur ?? 50} min
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

function IconBtn({ label, rotate }) {
  return (
    <button
      type="button"
      aria-label={label}
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
