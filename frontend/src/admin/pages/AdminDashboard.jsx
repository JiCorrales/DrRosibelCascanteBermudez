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
            + Nueva
          </Btn>
        }
      />

      <div className="admin-content">
        <Stack gap={28}>
          <div className="dashboard-kpis">
            {KPIS.map((k) => (
              <StatCard key={k.label} {...k} />
            ))}
          </div>

          <div className="dashboard-grid">
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
                    <div
                      key={a.id}
                      className="agenda-row"
                      style={{
                        borderBottom: i < today.length - 1 ? '1px solid var(--line)' : 0,
                      }}
                    >
                      <div className="agenda-row__time">
                        <H3 size={14}>{a.time}</H3>
                        <Meta>{service?.dur ?? 50} min</Meta>
                      </div>
                      <div className="agenda-row__client">
                        <Photo w={36} h={36} rounded={999} label="" />
                        <Stack gap={2} style={{ minWidth: 0 }}>
                          <H3 size={14}>{client?.name ?? 'Cliente'}</H3>
                          <Meta>
                            {service?.name ?? 'Servicio'} · {a.modality === 'online' ? 'Online' : 'Presencial'}
                          </Meta>
                        </Stack>
                      </div>
                      <div className="agenda-row__status">
                        <StatusPill status={a.status} />
                        <Icon name="arrow" size={14} color="var(--ink-500)" />
                      </div>
                    </div>
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
        .dashboard-kpis {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
        }
        .dashboard-grid {
          display: grid;
          grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
          gap: 20px;
          align-items: flex-start;
        }
        .agenda-row {
          display: grid;
          grid-template-columns: 80px 1fr auto;
          align-items: center;
          gap: 16px;
          padding: 14px 22px;
        }
        .agenda-row__time { min-width: 0; }
        .agenda-row__client {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }
        .agenda-row__status {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        @media (max-width: 1100px) {
          .dashboard-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .dashboard-kpis {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .agenda-row {
            grid-template-columns: 1fr auto;
            gap: 10px;
            padding: 14px 16px;
          }
          .agenda-row__time {
            grid-column: 1 / -1;
            display: flex;
            align-items: baseline;
            gap: 10px;
          }
          .agenda-row__time > :nth-child(2) { color: var(--ink-500); }
          .agenda-row__client { grid-column: 1; }
          .agenda-row__status { grid-column: 2; align-self: center; }
        }
      `}</style>
    </>
  );
}
