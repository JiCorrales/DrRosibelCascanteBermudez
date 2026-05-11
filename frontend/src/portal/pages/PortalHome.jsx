import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Btn, Stack, Row, H3, Body, Meta, Eyebrow, Icon } from '../../components/primitives.jsx';
import { PORTAL_USER, PORTAL_TASKS, PORTAL_APPTS, PORTAL_DOCS } from '../../mock/admin-data.js';

export default function PortalHome() {
  useEffect(() => {
    document.title = 'Inicio · Portal · Rosibel';
  }, []);

  const nextAppt = PORTAL_APPTS.find((a) => a.next);
  const previewTasks = PORTAL_TASKS.slice(0, 3);
  const previewDocs = (PORTAL_DOCS ?? []).slice(0, 3);

  return (
    <Stack gap={24}>
      <Stack gap={4}>
        <Meta>Hola, {PORTAL_USER.firstName}</Meta>
        <h1 className="portal-page-title">Buenas tardes.</h1>
      </Stack>

      {nextAppt && (
        <article className="wf-card sage" style={{ padding: 24 }}>
          <div className="portal-hero-card">
            <Stack gap={10}>
              <Eyebrow style={{ color: 'var(--sage-700)' }}>Próxima cita</Eyebrow>
              <H3 size={22}>
                {nextAppt.date} · {nextAppt.time}
              </H3>
              <Meta>
                {nextAppt.service} · {nextAppt.modality}
              </Meta>
            </Stack>
            <Row gap={10} wrap>
              <Btn small icon={false}>
                Unirme online
              </Btn>
              <Btn small ghost icon={false}>
                Reagendar
              </Btn>
            </Row>
          </div>
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
