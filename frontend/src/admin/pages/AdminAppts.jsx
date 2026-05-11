import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AdminTopbar, StatusPill } from '../AdminShell.jsx';
import { Btn, Stack, Row, H3, Body, Meta, Photo, Icon } from '../../components/primitives.jsx';
import {
  useBookings,
  useClients,
  useServices,
  useCreateBookingAdmin,
  useDeleteBooking,
} from '../../lib/queries.js';

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
  const [showCreate, setShowCreate] = useState(false);
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
  const deleteBooking = useDeleteBooking();
  const rows = bookingsQ.data ?? [];

  const handleDelete = (e, a) => {
    e.preventDefault();
    e.stopPropagation();
    const who = a.client?.full_name ?? a.patient_name;
    if (window.confirm(`¿Eliminar la cita de ${who} (${formatDate(a.date)} · ${a.time})?`)) {
      deleteBooking.mutate(a.id);
    }
  };

  return (
    <>
      <AdminTopbar
        title="Citas"
        sub={
          bookingsQ.isLoading
            ? 'Cargando…'
            : `${rows.length} resultado${rows.length !== 1 ? 's' : ''}`
        }
        action={
          <Btn small icon={false} onClick={() => setShowCreate(true)}>
            + Nueva
          </Btn>
        }
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
                border: '1px solid rgb(var(--danger-rgb) / 0.28)',
                borderRadius: 'var(--r-md)',
              }}
            >
              No pudimos cargar las citas: {bookingsQ.error?.message ?? 'error desconocido'}
            </Body>
          )}

          {deleteBooking.isError && (
            <Body
              role="alert"
              style={{
                padding: '12px 16px',
                background: 'var(--danger-100)',
                color: 'var(--danger-500)',
                border: '1px solid rgb(var(--danger-rgb) / 0.28)',
                borderRadius: 'var(--r-md)',
              }}
            >
              No pudimos eliminar la cita: {deleteBooking.error?.message ?? 'error desconocido'}
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
                  className="data-table__row appt-row"
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
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, a)}
                    aria-label="Eliminar cita"
                    className="appt-row__delete"
                    title="Eliminar cita"
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </Link>
              ))}
            </div>
          )}

          {isCompact && rows.length > 0 && (
            <div className="appt-card-list">
              {rows.map((a) => (
                <div key={a.id} className="appt-card-wrapper">
                  <Link
                    to={a.client?.id ? `/admin/clientes/${a.client.id}` : '/admin/clientes'}
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
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, a)}
                    aria-label="Eliminar cita"
                    className="appt-card__delete"
                    title="Eliminar cita"
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Stack>
      </div>

      {showCreate && <NewAppointmentModal onClose={() => setShowCreate(false)} />}

      <style>{`
        .appt-row { position: relative; }
        .appt-row__delete {
          background: transparent;
          border: 0;
          padding: 6px;
          border-radius: 6px;
          cursor: pointer;
          color: var(--ink-300);
          opacity: 0;
          transition: opacity 0.15s, color 0.15s, background 0.15s;
          justify-self: end;
        }
        .appt-row:hover .appt-row__delete { opacity: 1; }
        .appt-row__delete:hover { background: var(--danger-100); color: var(--danger-500); }
        .appt-card-wrapper { position: relative; }
        .appt-card__delete {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(255,255,255,0.9);
          border: 1px solid var(--line);
          padding: 6px;
          border-radius: 6px;
          cursor: pointer;
          color: var(--ink-500);
          transition: color 0.15s, background 0.15s;
        }
        .appt-card__delete:hover { background: var(--danger-100); color: var(--danger-500); }
      `}</style>
    </>
  );
}

function NewAppointmentModal({ onClose }) {
  const clientsQ = useClients();
  const servicesQ = useServices({ activeOnly: false });
  const createBooking = useCreateBookingAdmin();

  const [form, setForm] = useState({
    clientId: '',
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    serviceId: '',
    date: new Date().toISOString().slice(0, 10),
    time: '09:00',
    modality: 'online',
    status: 'confirmed',
  });

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const clients = clientsQ.data ?? [];
  const services = servicesQ.data ?? [];

  // Cuando elige un cliente existente, autorrelleno nombre/email/teléfono.
  const handlePickClient = (id) => {
    update('clientId', id);
    if (!id) return;
    const c = clients.find((x) => x.id === id);
    if (c) {
      update('patientName', c.full_name ?? c.name ?? '');
      update('patientEmail', c.email ?? '');
      update('patientPhone', c.phone ?? '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.serviceId || !form.patientName.trim() || !form.patientEmail.trim()) return;

    const service = services.find((s) => s.id === form.serviceId);
    const scheduled_at = `${form.date}T${form.time}:00`;

    try {
      await createBooking.mutateAsync({
        client_id: form.clientId || null,
        patient_name: form.patientName.trim(),
        patient_email: form.patientEmail.trim(),
        patient_phone: form.patientPhone.trim() || null,
        service_id: form.serviceId,
        scheduled_at,
        duration_min: service?.dur ?? service?.duration_min ?? 50,
        modality: form.modality,
        status: form.status,
      });
      onClose();
    } catch {
      /* error visible vía mutation isError */
    }
  };

  const valid = form.serviceId && form.patientName.trim() && form.patientEmail.trim() && form.date && form.time;

  return (
    <div className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="new-appt-title">
      <button type="button" className="admin-modal__backdrop" onClick={onClose} aria-label="Cerrar" />
      <div className="admin-modal__panel">
        <Row justify="space-between" align="center" style={{ marginBottom: 16 }}>
          <H3 id="new-appt-title" size={18}>Nueva cita</H3>
          <button type="button" className="admin-modal__close" onClick={onClose} aria-label="Cerrar">×</button>
        </Row>
        <form onSubmit={handleSubmit}>
          <Stack gap={14}>
            <Stack gap={6}>
              <label className="admin-modal__label">Cliente existente (opcional)</label>
              <select
                className="admin-modal__input"
                value={form.clientId}
                onChange={(e) => handlePickClient(e.target.value)}
              >
                <option value="">— Cliente nuevo o sin seleccionar —</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name ?? c.name} · {c.email}
                  </option>
                ))}
              </select>
            </Stack>

            <Row gap={10} wrap>
              <Stack gap={6} style={{ flex: 1, minWidth: 200 }}>
                <label className="admin-modal__label">Nombre del paciente *</label>
                <input
                  className="admin-modal__input"
                  value={form.patientName}
                  onChange={(e) => update('patientName', e.target.value)}
                  required
                />
              </Stack>
              <Stack gap={6} style={{ flex: 1, minWidth: 200 }}>
                <label className="admin-modal__label">Correo *</label>
                <input
                  className="admin-modal__input"
                  type="email"
                  value={form.patientEmail}
                  onChange={(e) => update('patientEmail', e.target.value)}
                  required
                />
              </Stack>
            </Row>

            <Stack gap={6}>
              <label className="admin-modal__label">Teléfono</label>
              <input
                className="admin-modal__input"
                type="tel"
                value={form.patientPhone}
                onChange={(e) => update('patientPhone', e.target.value)}
                placeholder="+506 8000 1234"
              />
            </Stack>

            <Stack gap={6}>
              <label className="admin-modal__label">Servicio *</label>
              <select
                className="admin-modal__input"
                value={form.serviceId}
                onChange={(e) => update('serviceId', e.target.value)}
                required
              >
                <option value="">— Elegir servicio —</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} · {s.dur ?? s.duration_min} min · ₡{(s.price ?? s.price_crc ?? 0).toLocaleString('es-CR')}
                  </option>
                ))}
              </select>
            </Stack>

            <Row gap={10} wrap>
              <Stack gap={6} style={{ flex: 1, minWidth: 140 }}>
                <label className="admin-modal__label">Fecha *</label>
                <input
                  className="admin-modal__input"
                  type="date"
                  value={form.date}
                  onChange={(e) => update('date', e.target.value)}
                  required
                />
              </Stack>
              <Stack gap={6} style={{ flex: 1, minWidth: 120 }}>
                <label className="admin-modal__label">Hora *</label>
                <input
                  className="admin-modal__input"
                  type="time"
                  value={form.time}
                  onChange={(e) => update('time', e.target.value)}
                  required
                />
              </Stack>
            </Row>

            <Row gap={10} wrap>
              <Stack gap={6} style={{ flex: 1, minWidth: 140 }}>
                <label className="admin-modal__label">Modalidad</label>
                <select
                  className="admin-modal__input"
                  value={form.modality}
                  onChange={(e) => update('modality', e.target.value)}
                >
                  <option value="online">Online</option>
                  <option value="presencial">Presencial</option>
                </select>
              </Stack>
              <Stack gap={6} style={{ flex: 1, minWidth: 140 }}>
                <label className="admin-modal__label">Estado</label>
                <select
                  className="admin-modal__input"
                  value={form.status}
                  onChange={(e) => update('status', e.target.value)}
                >
                  <option value="confirmed">Confirmada</option>
                  <option value="pending">Pendiente</option>
                </select>
              </Stack>
            </Row>

            {createBooking.isError && (
              <Body
                role="alert"
                style={{
                  padding: '10px 14px',
                  background: 'var(--danger-100)',
                  color: 'var(--danger-500)',
                  border: '1px solid rgb(var(--danger-rgb) / 0.28)',
                  borderRadius: 'var(--r-md)',
                  fontSize: 13,
                }}
              >
                {createBooking.error?.message ?? 'No pudimos crear la cita.'}
              </Body>
            )}

            <Row gap={8} justify="flex-end">
              <Btn ghost small icon={false} onClick={onClose} type="button">
                Cancelar
              </Btn>
              <Btn
                type="submit"
                small
                icon={false}
                disabled={createBooking.isPending || !valid}
              >
                {createBooking.isPending ? 'Creando…' : 'Crear cita'}
              </Btn>
            </Row>
          </Stack>
        </form>
      </div>
    </div>
  );
}
