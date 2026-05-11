import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Btn, Stack, Row, H3, Body, Meta, Eyebrow, Icon } from '../../components/primitives.jsx';
import { PORTAL_USER, PORTAL_TASKS, PORTAL_APPTS } from '../../mock/admin-data.js';

export default function PortalHome() {
  useEffect(() => {
    document.title = 'Inicio · Portal · Rosibel';
  }, []);

  const nextAppt = PORTAL_APPTS.find((a) => a.next);
  const previewTasks = PORTAL_TASKS.slice(0, 3);

  return (
    <Stack gap={22}>
      <Stack gap={4}>
        <Meta>Hola, {PORTAL_USER.firstName}</Meta>
        <h1 className="portal-page-title">Buenas tardes.</h1>
      </Stack>

      {nextAppt && (
        <article className="wf-card sage" style={{ padding: 20 }}>
          <Stack gap={12}>
            <Eyebrow style={{ color: 'var(--sage-700)' }}>Próxima cita</Eyebrow>
            <H3 size={20}>
              {nextAppt.date} · {nextAppt.time}
            </H3>
            <Meta>
              {nextAppt.service} · {nextAppt.modality}
            </Meta>
            <Row gap={10} wrap style={{ marginTop: 6 }}>
              <Btn small icon={false}>
                Unirme online
              </Btn>
              <Btn small ghost icon={false}>
                Reagendar
              </Btn>
            </Row>
          </Stack>
        </article>
      )}

      <Stack gap={12}>
        <Row justify="space-between" align="center">
          <H3 size={16}>Tus tareas</H3>
          <Link to="/portal/tareas" style={{ color: 'var(--sage-700)', fontSize: 13 }}>
            Ver todas →
          </Link>
        </Row>
        <Stack gap={10}>
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
        </Stack>
      </Stack>

      <Stack gap={12}>
        <Row justify="space-between" align="center">
          <H3 size={16}>Tus documentos</H3>
          <Link to="/portal/documentos" style={{ color: 'var(--sage-700)', fontSize: 13 }}>
            Ver todo →
          </Link>
        </Row>
        <Row gap={10}>
          {['Consentimiento', 'Guía intro', 'Plan'].map((t) => (
            <article
              key={t}
              className="wf-card"
              style={{ padding: 14, flex: 1, textAlign: 'center' }}
            >
              <Stack gap={8} style={{ alignItems: 'center' }}>
                <Icon name="doc" size={18} color="var(--sage-700)" />
                <Meta>{t}</Meta>
              </Stack>
            </article>
          ))}
        </Row>
      </Stack>
    </Stack>
  );
}
