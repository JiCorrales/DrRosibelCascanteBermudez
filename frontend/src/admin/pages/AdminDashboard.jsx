import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminTopbar, StatCard, StatusPill } from '../AdminShell.jsx';
import { Btn, Stack, Row, H3, Body, Meta, Icon, Photo } from '../../components/primitives.jsx';
import { KPIS, apptsToday, UPCOMING, TODAY, findClient } from '../../mock/admin-data.js';
import { findService } from '../../data.js';

export default function AdminDashboard() {
  useEffect(() => {
    document.title = 'Dashboard · Admin · Rosibel';
  }, []);

  const today = apptsToday();
  const pendingCount = today.filter((a) => a.status === 'pending').length;

  return (
    <>
      <AdminTopbar
        title="Buenos días, Rosibel"
        sub={TODAY.dayLabel}
        action={
          <Btn small as={Link} to="/admin/citas">
            + Nueva cita
          </Btn>
        }
      />

      <div className="admin-content">
        <Stack gap={28}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 16,
            }}
          >
            {KPIS.map((k) => (
              <StatCard key={k.label} {...k} />
            ))}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)',
              gap: 20,
              alignItems: 'flex-start',
            }}
            className="dashboard-grid"
          >
            <article className="wf-card" style={{ padding: 0 }}>
              <Row justify="space-between" align="center" style={{ padding: '16px 22px', borderBottom: '1px solid var(--line)' }}>
                <H3 size={16}>Agenda de hoy</H3>
                <Link to="/admin/calendario" style={{ color: 'var(--sage-700)', fontSize: 13 }}>
                  Ver calendario →
                </Link>
              </Row>
              <Stack gap={0}>
                {today.map((a, i) => {
                  const client = findClient(a.clientId);
                  const service = findService(a.serviceId);
                  return (
                    <Row
                      key={a.id}
                      align="center"
                      justify="space-between"
                      style={{
                        padding: '14px 22px',
                        borderBottom: i < today.length - 1 ? '1px solid var(--line)' : 0,
                      }}
                    >
                      <Row gap={16} align="center">
                        <Stack gap={2} style={{ minWidth: 70 }}>
                          <H3 size={14}>{a.time}</H3>
                          <Meta>{service?.dur ?? 50} min</Meta>
                        </Stack>
                        <Photo w={36} h={36} rounded={999} label="" />
                        <Stack gap={2}>
                          <H3 size={14}>{client?.name ?? 'Cliente'}</H3>
                          <Meta>
                            {service?.name ?? 'Servicio'} · {a.modality === 'online' ? 'Online' : 'Presencial'}
                          </Meta>
                        </Stack>
                      </Row>
                      <Row gap={12} align="center">
                        <StatusPill status={a.status} />
                        <Icon name="arrow" size={14} color="var(--ink-500)" />
                      </Row>
                    </Row>
                  );
                })}
                {today.length === 0 && (
                  <Body style={{ padding: 22, color: 'var(--ink-500)' }}>No hay citas para hoy.</Body>
                )}
              </Stack>
            </article>

            <Stack gap={16}>
              <article className="wf-card" style={{ padding: 20 }}>
                <Stack gap={14}>
                  <H3 size={15}>Próximamente</H3>
                  <Stack gap={10}>
                    {UPCOMING.map((t) => (
                      <Row gap={10} key={t}>
                        <Icon name="cal" size={14} color="var(--sage-700)" />
                        <Body size={13}>{t}</Body>
                      </Row>
                    ))}
                  </Stack>
                </Stack>
              </article>

              {pendingCount > 0 && (
                <article className="wf-card sage" style={{ padding: 20 }}>
                  <Stack gap={10}>
                    <H3 size={15}>
                      {pendingCount} reserva{pendingCount > 1 ? 's' : ''} nueva
                      {pendingCount > 1 ? 's' : ''}
                    </H3>
                    <Body size={13}>Necesitan tu confirmación.</Body>
                    <div>
                      <Btn small as={Link} to="/admin/citas?estado=pending" icon={false}>
                        Revisar
                      </Btn>
                    </div>
                  </Stack>
                </article>
              )}
            </Stack>
          </div>
        </Stack>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
