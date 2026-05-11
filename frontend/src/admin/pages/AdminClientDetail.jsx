import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { AdminTopbar, StatCard, StatusPill } from '../AdminShell.jsx';
import { Btn, Stack, Row, H3, Body, Meta, Photo, Icon } from '../../components/primitives.jsx';
import { findClient, apptsByClient } from '../../mock/admin-data.js';
import { findService } from '../../data.js';

const TABS = ['Historial', 'Notas', 'Tareas', 'Documentos', 'Pagos'];

export default function AdminClientDetail() {
  const { id } = useParams();
  const client = findClient(id);
  const [tab, setTab] = useState('Historial');

  useEffect(() => {
    if (client) document.title = `${client.name} · Admin · Rosibel`;
  }, [client]);

  if (!client) return <Navigate to="/admin/clientes" replace />;

  const appts = apptsByClient(client.id);
  const completed = appts.filter((a) => a.status === 'completed').length;
  const attendance = appts.length
    ? Math.round((completed / appts.filter((a) => a.status !== 'pending' && a.status !== 'confirmed').length || 1) * 100)
    : 0;
  const lastAppt = appts.find((a) => a.status === 'completed');

  return (
    <>
      <AdminTopbar
        title={client.name}
        sub={`${client.status === 'active' ? 'Activo' : 'Nuevo'} · desde ${client.since}`}
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
                <H3 size={22}>{client.name}</H3>
                <Meta>
                  {client.age} años · {client.city}
                </Meta>
              </Stack>
              <div className="wf-divider" />
              <Stack gap={12}>
                <Row gap={10}>
                  <Icon name="mail" size={14} color="var(--ink-500)" />
                  <Meta>{client.email}</Meta>
                </Row>
                <Row gap={10}>
                  <Icon name="phone" size={14} color="var(--ink-500)" />
                  <Meta>{client.phone}</Meta>
                </Row>
                <Row gap={10}>
                  <Icon name="location" size={14} color="var(--ink-500)" />
                  <Meta>{client.city}</Meta>
                </Row>
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
              <StatCard label="Sesiones" value={client.sessions} />
              <StatCard label="Asistencia" value={`${attendance || 100}%`} />
              <StatCard label="Última" value={lastAppt ? lastAppt.date.slice(8) + ' may' : '—'} />
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
                    {appts.length === 0 && (
                      <Body style={{ padding: 24, color: 'var(--ink-500)' }}>Sin citas registradas.</Body>
                    )}
                    {appts.map((a, i) => {
                      const service = findService(a.serviceId);
                      return (
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
                            <Icon name={a.status === 'completed' ? 'check' : 'cal'} size={14} color="var(--sage-700)" />
                            <Stack gap={2}>
                              <H3 size={13}>{a.date.slice(8)} may · {a.time}</H3>
                              <Meta>{service?.name ?? 'Servicio'}</Meta>
                            </Stack>
                          </Row>
                          <StatusPill status={a.status} />
                        </Row>
                      );
                    })}
                  </Stack>
                )}
                {tab === 'Notas' && (
                  <Body style={{ color: 'var(--ink-500)' }}>
                    Las notas clínicas vivirán acá cuando se integre el backend. Estarán encriptadas en reposo.
                  </Body>
                )}
                {tab === 'Tareas' && (
                  <Body style={{ color: 'var(--ink-500)' }}>
                    Acá podrás asignarle tareas para hacer entre sesiones (registros, lecturas, ejercicios).
                  </Body>
                )}
                {tab === 'Documentos' && (
                  <Body style={{ color: 'var(--ink-500)' }}>
                    Documentos compartidos con {client.firstName}. Aparecen en su portal.
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
