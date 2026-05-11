import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Btn, Stack, Row, H3, Body, Meta, Eyebrow, Icon } from '../../components/primitives.jsx';
import { useAuth } from '../../auth/useAuth.js';
import { useMyBookings } from '../../lib/queries.js';
import { PORTAL_TASKS, PORTAL_DOCS } from '../../mock/admin-data.js';
import WhatsAppButton from '../../components/WhatsAppButton.jsx';
import { WHATSAPP_PREFILL } from '../../data.js';

const SHORT_DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function formatApptDate(isoDate) {
  if (!isoDate) return '—';
  const d = new Date(isoDate + 'T12:00:00');
  return `${SHORT_DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días.';
  if (h < 19) return 'Buenas tardes.';
  return 'Buenas noches.';
}

export default function PortalHome() {
  useEffect(() => {
    document.title = 'Inicio · Portal · Rosibel';
  }, []);

  const { user } = useAuth();
  const email = user?.email;
  const bookingsQ = useMyBookings(email);

  const { nextAppt, firstName } = useMemo(() => {
    const all = bookingsQ.data ?? [];
    const now = new Date();
    const upcoming = all
      .filter((b) => new Date(b.scheduled_at) > now && b.status !== 'cancelled' && b.status !== 'no_show')
      .sort((a, b) => (a.scheduled_at < b.scheduled_at ? -1 : 1));
    const fn = (user?.name ?? all[0]?.client?.full_name ?? '').split(' ')[0] || 'paciente';
    return { nextAppt: upcoming[0] ?? null, firstName: fn };
  }, [bookingsQ.data, user]);

  const previewTasks = PORTAL_TASKS.slice(0, 3);
  const previewDocs = (PORTAL_DOCS ?? []).slice(0, 3);

  return (
    <Stack gap={24}>
      <Stack gap={4}>
        <Meta>Hola, {firstName}</Meta>
        <h1 className="portal-page-title">{greeting()}</h1>
      </Stack>

      {bookingsQ.isLoading && (
        <article className="wf-card" style={{ padding: 20 }}>
          <Body style={{ color: 'var(--ink-500)' }}>Cargando tus citas…</Body>
        </article>
      )}

      {bookingsQ.isError && (
        <article
          role="alert"
          className="wf-card"
          style={{
            padding: 20,
            background: 'var(--danger-100)',
            color: 'var(--danger-500)',
            border: '1px solid rgb(var(--danger-rgb) / 0.28)',
          }}
        >
          <Body style={{ color: 'inherit' }}>
            No pudimos cargar tus citas: {bookingsQ.error?.message ?? 'error desconocido'}
          </Body>
        </article>
      )}

      {!bookingsQ.isLoading && !bookingsQ.isError && nextAppt && (
        <article className="wf-card sage" style={{ padding: 24 }}>
          <div className="portal-hero-card">
            <Stack gap={10}>
              <Eyebrow style={{ color: 'var(--sage-700)' }}>Próxima cita</Eyebrow>
              <H3 size={22}>
                {formatApptDate(nextAppt.date)} · {nextAppt.time}
              </H3>
              <Meta>
                {nextAppt.service?.name ?? 'Sesión'} ·{' '}
                {nextAppt.modality === 'online' ? 'Online' : 'Presencial'}
              </Meta>
            </Stack>
            <Row gap={10} wrap>
              {nextAppt.modality === 'online' && nextAppt.meeting_url && (
                <Btn
                  small
                  icon={false}
                  as="a"
                  href={nextAppt.meeting_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Unirme online
                </Btn>
              )}
              <Btn
                small
                ghost
                icon={false}
                as={Link}
                to="/reservar"
                title="Por ahora reagendar = reservar una nueva y cancelar la actual"
              >
                Reagendar
              </Btn>
              <WhatsAppButton
                size="sm"
                variant="ghost"
                message={WHATSAPP_PREFILL.reschedule.replace(
                  '{{cuando}}',
                  `${formatApptDate(nextAppt.date)} ${nextAppt.time}`
                )}
              >
                WhatsApp
              </WhatsAppButton>
            </Row>
          </div>
        </article>
      )}

      {!bookingsQ.isLoading && !bookingsQ.isError && !nextAppt && (
        <article className="wf-card" style={{ padding: 20 }}>
          <Stack gap={10}>
            <H3 size={16}>Sin próximas citas</H3>
            <Body size={14}>Reservá una para empezar.</Body>
            <div>
              <Btn as={Link} to="/reservar" small icon={false}>
                Reservar cita
              </Btn>
            </div>
          </Stack>
        </article>
      )}

      <div className="portal-home-grid">
        <Stack gap={14}>
          <div className="portal-section-head">
            <H3 size={16}>Tus tareas</H3>
            <Link to="/portal/tareas" style={{ color: 'var(--sage-700)', fontSize: 13 }}>
              Ver todas →
            </Link>
          </div>
          <div className="portal-tasks-grid">
            {previewTasks.map((t) => {
              const done = t.status === 'done';
              return (
                <article key={t.id} className="wf-card" style={{ padding: 16 }}>
                  <Row gap={12} align="flex-start">
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 4,
                        border: '1.5px solid var(--sage-500)',
                        background: done ? 'var(--sage-500)' : 'transparent',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      {done && <Icon name="check" size={10} color="var(--bg)" />}
                    </span>
                    <Stack gap={4} style={{ flex: 1 }}>
                      <H3
                        size={14}
                        style={{
                          textDecoration: done ? 'line-through' : 'none',
                          color: done ? 'var(--ink-300)' : 'var(--ink-900)',
                        }}
                      >
                        {t.title}
                      </H3>
                      <Meta>{t.meta}</Meta>
                    </Stack>
                  </Row>
                </article>
              );
            })}
          </div>
        </Stack>

        <Stack gap={14}>
          <div className="portal-section-head">
            <H3 size={16}>Tus documentos</H3>
            <Link to="/portal/documentos" style={{ color: 'var(--sage-700)', fontSize: 13 }}>
              Ver todo →
            </Link>
          </div>
          <Stack gap={10}>
            {previewDocs.length > 0
              ? previewDocs.map((d) => (
                  <article key={d.id} className="wf-card" style={{ padding: 14 }}>
                    <Row gap={12} align="center">
                      <span
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          background: 'var(--sage-100)',
                          color: 'var(--sage-700)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                        aria-hidden="true"
                      >
                        <Icon name="doc" size={16} />
                      </span>
                      <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                        <H3 size={13}>{d.title}</H3>
                        <Meta>{d.meta}</Meta>
                      </Stack>
                    </Row>
                  </article>
                ))
              : ['Consentimiento', 'Guía intro', 'Plan'].map((t) => (
                  <article key={t} className="wf-card" style={{ padding: 14 }}>
                    <Row gap={12} align="center">
                      <Icon name="doc" size={16} color="var(--sage-700)" />
                      <Meta>{t}</Meta>
                    </Row>
                  </article>
                ))}
          </Stack>
        </Stack>
      </div>
    </Stack>
  );
}
