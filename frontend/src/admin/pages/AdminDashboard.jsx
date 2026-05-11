import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminTopbar, StatCard, StatusPill } from '../AdminShell.jsx';
import { Btn, Stack, Row, H3, Body, Meta, Icon, Photo } from '../../components/primitives.jsx';
import { useBookings, useDashboardKpis } from '../../lib/queries.js';

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}
function endOfToday() {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
}

function formatTodayLabel(now = new Date()) {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  return `${days[now.getDay()]} ${now.getDate()} de ${months[now.getMonth()]}, ${now.getFullYear()}`;
}

export default function AdminDashboard() {
  useEffect(() => {
    document.title = 'Dashboard · Admin · Rosibel';
  }, []);

  const kpisQ = useDashboardKpis();
  const todayQ = useBookings({ from: startOfToday(), to: endOfToday() });

  const today = (todayQ.data ?? []).slice().sort((a, b) =>
    a.scheduled_at < b.scheduled_at ? -1 : 1
  );
  const pendingCount = today.filter((a) => a.status === 'pending').length;
  const kpis = kpisQ.data;

  return (
    <>
      <AdminTopbar
        title="Buenos días, Rosibel"
        sub={formatTodayLabel()}
        action={
          <Btn small as={Link} to="/admin/citas">
            + Nueva
          </Btn>
        }
      />

      <div className="admin-content">
        <Stack gap={28}>
          <div className="dashboard-kpis">
            <StatCard
              label="Citas hoy"
              value={kpis ? kpis.today : (kpisQ.isLoading ? '…' : 0)}
              sub={kpis && pendingCount > 0 ? `${pendingCount} pendiente${pendingCount > 1 ? 's' : ''} por confirmar` : kpis ? 'Todo confirmado' : ''}
            />
            <StatCard
              label="Semana"
              value={kpis ? kpis.week : (kpisQ.isLoading ? '…' : 0)}
              sub=""
            />
            <StatCard
              label="Pendientes"
              value={kpis ? kpis.pending : (kpisQ.isLoading ? '…' : 0)}
              sub="por confirmar"
            />
            <StatCard
              label="Ingresos mes"
              value={kpis ? `₡${Math.round(kpis.monthRevenue / 1000)}k` : (kpisQ.isLoading ? '…' : '₡0')}
              sub="sesiones completadas"
            />
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
                {todayQ.isLoading && (
                  <Body style={{ padding: 22, color: 'var(--ink-500)' }}>Cargando agenda…</Body>
                )}
                {todayQ.isError && (
                  <Body style={{ padding: 22, color: 'var(--danger-500)' }}>
                    No pudimos cargar la agenda. {todayQ.error?.message}
                  </Body>
                )}
                {!todayQ.isLoading && !todayQ.isError && today.length === 0 && (
                  <Body style={{ padding: 22, color: 'var(--ink-500)' }}>No hay citas para hoy.</Body>
                )}
                {today.map((a, i) => (
                  <div
                    key={a.id}
                    className="agenda-row"
                    style={{
                      borderBottom: i < today.length - 1 ? '1px solid var(--line)' : 0,
                    }}
                  >
                    <div className="agenda-row__time">
                      <H3 size={14}>{a.time}</H3>
                      <Meta>{a.duration_min} min</Meta>
                    </div>
                    <div className="agenda-row__client">
                      <Photo w={36} h={36} rounded={999} label="" />
                      <Stack gap={2} style={{ minWidth: 0 }}>
                        <H3 size={14}>{a.client?.full_name ?? a.patient_name}</H3>
                        <Meta>
                          {a.service?.name ?? 'Servicio'} ·{' '}
                          {a.modality === 'online' ? 'Online' : 'Presencial'}
                        </Meta>
                      </Stack>
                    </div>
                    <div className="agenda-row__status">
                      <StatusPill status={a.status} />
                      <Icon name="arrow" size={14} color="var(--ink-500)" />
                    </div>
                  </div>
                ))}
              </Stack>
            </article>

            <Stack gap={16}>
              <article className="wf-card" style={{ padding: 20 }}>
                <Stack gap={14}>
                  <H3 size={15}>Próximamente</H3>
                  <Stack gap={10}>
                    <Row gap={10}>
                      <Icon name="cal" size={14} color="var(--sage-700)" />
                      <Body size={13}>
                        Esta semana: <strong>{kpis?.week ?? '…'} citas</strong>
                      </Body>
                    </Row>
                    <Row gap={10}>
                      <Icon name="clock" size={14} color="var(--sage-700)" />
                      <Body size={13}>
                        Pendientes de confirmar: <strong>{kpis?.pending ?? '…'}</strong>
                      </Body>
                    </Row>
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
