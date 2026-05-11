import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AdminTopbar, StatusPill } from '../AdminShell.jsx';
import { Btn, Stack, Row, H3, Body, Meta, Photo } from '../../components/primitives.jsx';
import { useBookings } from '../../lib/queries.js';

const FILTERS = [
  { key: 'all', label: 'Todas' },
  { key: 'today', label: 'Hoy' },
  { key: 'week', label: 'Esta semana' },
  { key: 'pending', label: 'Pendientes' },
  { key: 'completed', label: 'Completadas' },
  { key: 'cancelled', label: 'Canceladas' },
];

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
function startOfWeek(d = new Date()) {
  const x = startOfDay(d);
  const day = x.getDay(); // 0 = dom
  const diff = (day === 0 ? -6 : 1) - day; // lunes como inicio
  x.setDate(x.getDate() + diff);
  return x;
}
function endOfWeek(d = new Date()) {
  const x = startOfWeek(d);
  x.setDate(x.getDate() + 6);
  x.setHours(23, 59, 59, 999);
  return x;
}

function filterArgsFor(filter, query) {
  const args = {};
  if (query.trim()) args.search = query.trim();
  if (filter === 'today') {
    args.from = startOfDay().toISOString();
    args.to = endOfDay().toISOString();
  } else if (filter === 'week') {
    args.from = startOfWeek().toISOString();
    args.to = endOfWeek().toISOString();
  } else if (filter === 'pending' || filter === 'completed' || filter === 'cancelled') {
    args.status = filter;
  }
  return args;
}

function formatDate(isoDate) {
  // isoDate puede venir como YYYY-MM-DD desde normalize
  const d = new Date(isoDate + 'T12:00:00');
  const dayName = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][d.getDay()];
  const monthName = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'][d.getMonth()];
  return `${dayName} ${d.getDate()} ${monthName}`;
}

const COL_TEMPLATE = '1fr 2fr 1.6fr 1fr 0.4fr';

export default function AdminAppts() {
  const [search, setSearch] = useSearchParams();
  const initialFilter = search.get('estado') ?? 'all';
  const [filter, setFilter] = useState(FILTERS.find((f) => f.key === initialFilter)?.key ?? 'all');
  const [query, setQuery] = useState('');
  const [isCompact, setIsCompact] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 640px)').matches : false
  );

  useEffect(() => {
    document.title = 'Citas · Admin · Rosibel';
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(max-width: 640px)');
    const handler = (e) => setIsCompact(e.matches);
    mql.addEventListener?.('change', handler) ?? mql.addListener(handler);
    return () => {
      mql.removeEventListener?.('change', handler) ?? mql.removeListener(handler);
    };
  }, []);

  useEffect(() => {
    if (filter !== initialFilter) {
      const next = new URLSearchParams(search);
      if (filter === 'all') next.delete('estado');
      else next.set('estado', filter);
      setSearch(next, { replace: true });
    }
  }, [filter]); // eslint-disable-line

  const args = useMemo(() => filterArgsFor(filter, query), [filter, query]);
  const bookingsQ = useBookings(args);
  const rows = bookingsQ.data ?? [];

  return (
    <>
      <AdminTopbar
        title="Citas"
        sub={
          bookingsQ.isLoading
            ? 'Cargando…'
            : `${rows.length} resultado${rows.length !== 1 ? 's' : ''}`
        }
        action={<Btn small icon={false}>+ Nueva</Btn>}
      />
      <div className="admin-content">
        <Stack gap={20}>
          <Row gap={8} wrap role="tablist" aria-label="Filtros de citas">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                role="tab"
                aria-selected={filter === f.key}
                onClick={() => setFilter(f.key)}
                style={{ all: 'unset', cursor: 'pointer' }}
              >
                <span className={`wf-pill ${filter === f.key ? '' : 'outline'}`}>{f.label}</span>
              </button>
            ))}
          </Row>

          <Row gap={12} wrap>
            <input
              type="search"
              placeholder="Buscar por nombre…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Buscar citas por nombre de cliente"
              style={{
                flex: 1,
                minWidth: 200,
                padding: '10px 14px',
                background: '#fff',
                border: '1px solid var(--line-2)',
                borderRadius: 'var(--r-md)',
                fontSize: 14,
                fontFamily: 'var(--sans)',
              }}
            />
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

          {!bookingsQ.isError && !bookingsQ.isLoading && rows.length === 0 && (
            <Body style={{ padding: 24, textAlign: 'center', color: 'var(--ink-500)' }}>
              No hay citas que coincidan con los filtros.
            </Body>
          )}

          {!isCompact && rows.length > 0 && (
            <div className="data-table">
              <div className="data-table__head" style={{ gridTemplateColumns: COL_TEMPLATE }}>
                <div>Fecha · Hora</div>
                <div>Cliente</div>
                <div>Servicio</div>
                <div>Estado</div>
                <div />
              </div>
              {rows.map((a) => (
                <Link
                  to={a.client?.id ? `/admin/clientes/${a.client.id}` : '/admin/clientes'}
                  key={a.id}
                  className="data-table__row"
                  style={{ gridTemplateColumns: COL_TEMPLATE }}
                >
                  <Stack gap={2}>
                    <H3 size={13}>{formatDate(a.date)}</H3>
                    <Meta>{a.time}</Meta>
                  </Stack>
                  <Row gap={12} align="center">
                    <Photo w={32} h={32} rounded={999} label="" />
                    <Stack gap={2}>
                      <H3 size={13}>{a.client?.full_name ?? a.patient_name}</H3>
                      <Meta>{a.modality === 'online' ? 'Online' : 'Presencial'}</Meta>
                    </Stack>
                  </Row>
                  <Meta>{a.service?.name ?? 'Servicio'}</Meta>
                  <div>
                    <StatusPill status={a.status} />
                  </div>
                  <Meta style={{ textAlign: 'right' }}>•••</Meta>
                </Link>
              ))}
            </div>
          )}

          {isCompact && rows.length > 0 && (
            <div className="appt-card-list">
              {rows.map((a) => (
                <Link
                  to={a.client?.id ? `/admin/clientes/${a.client.id}` : '/admin/clientes'}
                  key={a.id}
                  className="appt-card"
                >
                  <div className="appt-card__head">
                    <div>
                      <div className="appt-card__date">{formatDate(a.date)}</div>
                      <div className="appt-card__time">{a.time}</div>
                    </div>
                    <StatusPill status={a.status} />
                  </div>
                  <div className="appt-card__body">
                    <Photo w={36} h={36} rounded={999} label="" />
                    <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                      <H3 size={14}>{a.client?.full_name ?? a.patient_name}</H3>
                      <span className="appt-card__meta">
                        {a.service?.name ?? 'Servicio'} · {a.modality === 'online' ? 'Online' : 'Presencial'}
                      </span>
                    </Stack>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Stack>
      </div>
    </>
  );
}
