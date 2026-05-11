import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Btn, Stack, Row, H3, Body, Meta, Icon } from '../../components/primitives.jsx';
import { useAuth } from '../../auth/useAuth.js';
import { useMyBookings } from '../../lib/queries.js';

const TABS = [
  { key: 'upcoming', label: 'Próximas' },
  { key: 'past', label: 'Pasadas' },
];

const SHORT_DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function formatApptDate(isoDate) {
  if (!isoDate) return '—';
  const d = new Date(isoDate + 'T12:00:00');
  return `${SHORT_DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

const STATUS_LABELS = {
  pending: 'Por confirmar',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
  no_show: 'No asistió',
};

export default function PortalAppts() {
  const [tab, setTab] = useState('upcoming');
  const { user } = useAuth();
  const bookingsQ = useMyBookings(user?.email);

  useEffect(() => {
    document.title = 'Mis citas · Portal · Rosibel';
  }, []);

  const { upcoming, past } = useMemo(() => {
    const now = new Date();
    const all = bookingsQ.data ?? [];
    const isUpcoming = (b) =>
      new Date(b.scheduled_at) > now && b.status !== 'cancelled' && b.status !== 'no_show';
    return {
      upcoming: all.filter(isUpcoming).sort((a, b) => (a.scheduled_at < b.scheduled_at ? -1 : 1)),
      past: all.filter((b) => !isUpcoming(b)).sort((a, b) => (a.scheduled_at < b.scheduled_at ? 1 : -1)),
    };
  }, [bookingsQ.data]);

  const filtered = tab === 'upcoming' ? upcoming : past;
  const nextId = upcoming[0]?.id ?? null;

  return (
    <Stack gap={18}>
      <h1 className="portal-page-title">Mis citas</h1>

      <Row gap={8} wrap role="tablist" aria-label="Filtro de citas">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            style={{ all: 'unset', cursor: 'pointer' }}
          >
            <span className={`wf-pill ${tab === t.key ? '' : 'outline'}`}>{t.label}</span>
          </button>
        ))}
      </Row>

      {bookingsQ.isLoading && (
        <Body style={{ textAlign: 'center', color: 'var(--ink-500)', padding: 24 }}>
          Cargando…
        </Body>
      )}

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
          No pudimos cargar tus citas: {bookingsQ.error?.message ?? 'error desconocido'}
        </Body>
      )}

      {!bookingsQ.isLoading && !bookingsQ.isError && filtered.length === 0 && (
        <Body style={{ textAlign: 'center', color: 'var(--ink-500)', padding: 24 }}>
          Sin citas en esta categoría.
        </Body>
      )}

      {filtered.length > 0 && (
        <div className="portal-appts-grid">
          {filtered.map((a) => {
            const isNext = a.id === nextId;
            const statusKey = a.status;
            const statusLabel = STATUS_LABELS[statusKey] ?? statusKey;
            const isUpcomingItem = upcoming.includes(a);
            return (
              <article key={a.id} className={`wf-card ${isNext ? 'sage' : ''}`} style={{ padding: 18 }}>
                <Stack gap={12}>
                  <Row justify="space-between" align="flex-start">
                    <Stack gap={4}>
                      <H3 size={16}>
                        {formatApptDate(a.date)} · {a.time}
                      </H3>
                      <Meta>
                        {a.service?.name ?? 'Sesión'} · {a.duration_min} min
                      </Meta>
                    </Stack>
                    <span className={`wf-pill ${statusKey === 'confirmed' ? '' : 'outline'}`}>
                      {statusLabel}
                    </span>
                  </Row>
                  <Row gap={8}>
                    <Icon name="location" size={12} color="var(--ink-500)" />
                    <Meta>{a.modality === 'online' ? 'Online' : 'Presencial'}</Meta>
                  </Row>
                  {isUpcomingItem && (
                    <>
                      <div className="wf-divider" />
                      <Row gap={10} wrap>
                        <Btn small ghost icon={false}>
                          Reagendar
                        </Btn>
                        <Btn small ghost icon={false}>
                          Cancelar
                        </Btn>
                      </Row>
                    </>
                  )}
                </Stack>
              </article>
            );
          })}
        </div>
      )}

      <Btn as={Link} to="/reservar" block ghost icon={false}>
        + Reservar nueva cita
      </Btn>
    </Stack>
  );
}
