import React, { useEffect, useMemo, useState } from 'react';
import { Stack, Row, H3, Body, Meta, Icon } from '../../components/primitives.jsx';
import { PORTAL_TASKS } from '../../mock/admin-data.js';

const TABS = [
  { key: 'active',    label: 'Activas' },
  { key: 'week',      label: 'Esta semana' },
  { key: 'done',      label: 'Completadas' },
];

export default function PortalTasks() {
  const [tab, setTab] = useState('active');

  useEffect(() => {
    document.title = 'Tareas · Portal · Rosibel';
  }, []);

  const filtered = useMemo(() => {
    if (tab === 'done') return PORTAL_TASKS.filter((t) => t.status === 'done');
    if (tab === 'week') return PORTAL_TASKS.filter((t) => t.status !== 'done');
    return PORTAL_TASKS.filter((t) => t.status !== 'done');
  }, [tab]);

  return (
    <Stack gap={18}>
      <h1 className="portal-page-title">Mis tareas</h1>

      <Row gap={8} wrap role="tablist" aria-label="Filtros de tareas">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            style={{ all: 'unset', cursor: 'pointer' }}
          >
            <span className={`wf-pill ${tab === t.key ? '' : 'outline'}`}>{t.label}</span>
          </button>
        ))}
      </Row>

      {filtered.length === 0 && (
        <Body style={{ textAlign: 'center', color: 'var(--ink-500)', padding: 24 }}>
          Sin tareas en esta categoría.
        </Body>
      )}
      {filtered.length > 0 && (
        <div className="portal-tasks-grid">
          {filtered.map((t) => {
            const done = t.status === 'done';
            return (
              <article key={t.id} className="wf-card" style={{ padding: 18 }}>
                <Stack gap={10}>
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
                        marginTop: 3,
                      }}
                    >
                      {done && <Icon name="check" size={10} color="var(--bg)" />}
                    </span>
                    <Stack gap={4} style={{ flex: 1 }}>
                      <H3 size={15}>{t.title}</H3>
                      <Body size={13}>{t.description}</Body>
                      <Meta style={{ paddingTop: 6 }}>{t.meta}</Meta>
                    </Stack>
                  </Row>
                  {t.progress && (
                    <Row gap={4} style={{ paddingLeft: 30 }}>
                      {t.progress.map((on, i) => (
                        <span
                          key={i}
                          style={{
                            flex: 1,
                            height: 6,
                            borderRadius: 2,
                            background: on ? 'var(--sage-500)' : 'var(--sage-100)',
                          }}
                        />
                      ))}
                    </Row>
                  )}
                </Stack>
              </article>
            );
          })}
        </div>
      )}
    </Stack>
  );
}
