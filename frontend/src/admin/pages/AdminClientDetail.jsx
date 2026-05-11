import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { AdminTopbar, StatCard, StatusPill } from '../AdminShell.jsx';
import { Btn, Stack, Row, H3, Body, Meta, Photo, Icon } from '../../components/primitives.jsx';
import { useClient, useClientBookings } from '../../lib/queries.js';

const TABS = ['Historial', 'Notas', 'Tareas', 'Documentos', 'Pagos'];

const SHORT_DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const displayName = (c) => c?.full_name ?? c?.name ?? '';
const firstNameOf = (c) => (displayName(c).split(' ')[0] ?? 'la persona');

function formatApptDate(isoDate) {
  if (!isoDate) return '—';
  const d = new Date(isoDate + 'T12:00:00');
  return `${SHORT_DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export default function AdminClientDetail() {
  const { id } = useParams();
  const clientQ = useClient(id);
  const apptsQ = useClientBookings(id);
  const [tab, setTab] = useState('Historial');

  const client = clientQ.data;
  const appts = apptsQ.data ?? [];

  useEffect(() => {
    if (client) document.title = `${displayName(client)} · Admin · Rosibel`;
  }, [client]);

  // Si la query terminó y el cliente no existe → 404 hacia listado
  if (!clientQ.isLoading && !clientQ.isError && client === null) {
    return <Navigate to="/admin/clientes" replace />;
  }

  if (clientQ.isLoading) {
    return (
      <>
        <AdminTopbar title="Cargando…" />
        <div className="admin-content">
          <Body style={{ color: 'var(--ink-500)' }}>Cargando cliente…</Body>
        </div>
      </>
    );
  }

  if (clientQ.isError) {
    return (
      <>
        <AdminTopbar title="Cliente" />
        <div className="admin-content">
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
            No pudimos cargar el cliente: {clientQ.error?.message ?? 'error desconocido'}
          </Body>
        </div>
      </>
    );
  }

  const completed = appts.filter((a) => a.status === 'completed').length;
  const finalized = appts.filter((a) => a.status !== 'pending' && a.status !== 'confirmed').length;
  const attendance = finalized ? Math.round((completed / finalized) * 100) : 100;
  const lastAppt = appts.find((a) => a.status === 'completed');
  const sessionsCount = client?.sessions ?? completed;
  const since = client?.since ?? (client?.first_visit ? formatApptDate(client.first_visit) : 'reciente');

  return (
    <>
      <AdminTopbar
        title={displayName(client)}
        sub={`${client?.status === 'active' ? 'Activo' : client?.status === 'new' ? 'Nuevo' : 'Cliente'} · desde ${since}`}
        action={
          <Btn as={Link} to="/admin/clientes" ghost small icon={false}>
            ← Volver
          </Btn>
        }
      />
      <div className="admin-content">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 320px) minmax(0, 1fr)',
            gap: 24,
            alignItems: 'flex-start',
          }}
          className="client-detail-grid"
        >
          <article className="wf-card" style={{ padding: 24 }}>
            <Stack gap={16}>
              <Photo w={96} h={96} rounded={999} label="" style={{ margin: '0 auto' }} />
              <Stack gap={4} style={{ textAlign: 'center' }}>
                <H3 size={22}>{displayName(client)}</H3>
                <Meta>
                  {[client?.age && `${client.age} años`, client?.city].filter(Boolean).join(' · ') || ' '}
                </Meta>
              </Stack>
              <div className="wf-divider" />
              <Stack gap={12}>
                <Row gap={10}>
                  <Icon name="mail" size={14} color="var(--ink-500)" />
                  <Meta>{client?.email}</Meta>
                </Row>
                {client?.phone && (
                  <Row gap={10}>
                    <Icon name="phone" size={14} color="var(--ink-500)" />
                    <Meta>{client.phone}</Meta>
                  </Row>
                )}
                {client?.city && (
                  <Row gap={10}>
                    <Icon name="location" size={14} color="var(--ink-500)" />
                    <Meta>{client.city}</Meta>
                  </Row>
                )}
              </Stack>
              <Btn block small icon={false}>
                Enviar mensaje
              </Btn>
            </Stack>
          </article>

          <Stack gap={20}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: 14,
              }}
            >
              <StatCard label="Sesiones" value={sessionsCount ?? 0} />
              <StatCard label="Asistencia" value={`${attendance}%`} />
              <StatCard
                label="Última"
                value={lastAppt ? formatApptDate(lastAppt.date) : '—'}
              />
            </div>

            <article className="wf-card" style={{ padding: 0 }}>
              <Row gap={4} style={{ padding: '0 24px', borderBottom: '1px solid var(--line)' }} wrap>
                {TABS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="tab"
                    aria-selected={tab === t}
                    onClick={() => setTab(t)}
                    style={{
                      all: 'unset',
                      cursor: 'pointer',
                      padding: '16px 6px',
                      fontFamily: 'var(--sans)',
                      fontSize: 13,
                      fontWeight: tab === t ? 500 : 400,
                      color: tab === t ? 'var(--ink-900)' : 'var(--ink-500)',
                      borderBottom: tab === t ? '2px solid var(--sage-500)' : '2px solid transparent',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </Row>

              <div style={{ padding: tab === 'Historial' ? 0 : 24 }}>
                {tab === 'Historial' && (
                  <Stack gap={0}>
                    {apptsQ.isLoading && (
                      <Body style={{ padding: 24, color: 'var(--ink-500)' }}>Cargando historial…</Body>
                    )}
                    {!apptsQ.isLoading && appts.length === 0 && (
                      <Body style={{ padding: 24, color: 'var(--ink-500)' }}>
                        Sin citas registradas.
                      </Body>
                    )}
                    {appts.map((a, i) => (
                      <Row
                        key={a.id}
                        justify="space-between"
                        align="center"
                        style={{
                          padding: '16px 24px',
                          borderBottom: i < appts.length - 1 ? '1px solid var(--line)' : 0,
                        }}
                      >
                        <Row gap={14} align="center">
                          <Icon
                            name={a.status === 'completed' ? 'check' : 'cal'}
                            size={14}
                            color="var(--sage-700)"
                          />
                          <Stack gap={2}>
                            <H3 size={13}>
                              {formatApptDate(a.date)} · {a.time}
                            </H3>
                            <Meta>{a.service?.name ?? 'Servicio'}</Meta>
                          </Stack>
                        </Row>
                        <StatusPill status={a.status} />
                      </Row>
                    ))}
                  </Stack>
                )}
                {tab === 'Notas' && (
                  <Body style={{ color: 'var(--ink-500)' }}>
                    Las notas clínicas vivirán acá. Quedan encriptadas en reposo y solo vos las ves.
                  </Body>
                )}
                {tab === 'Tareas' && (
                  <Body style={{ color: 'var(--ink-500)' }}>
                    Acá podés asignarle tareas para hacer entre sesiones (registros, lecturas, ejercicios).
                  </Body>
                )}
                {tab === 'Documentos' && (
                  <Body style={{ color: 'var(--ink-500)' }}>
                    Documentos compartidos con {firstNameOf(client)}. Aparecen en su portal.
                  </Body>
                )}
                {tab === 'Pagos' && (
                  <Body style={{ color: 'var(--ink-500)' }}>
                    Historial de pagos por sesión (SINPE, transferencia o tarjeta).
                  </Body>
                )}
              </div>
            </article>
          </Stack>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .client-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
