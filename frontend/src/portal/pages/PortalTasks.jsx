import React, { useEffect, useMemo, useState } from 'react';
import { Stack, Row, H3, Body, Meta, Icon } from '../../components/primitives.jsx';
import { useAuth } from '../../auth/useAuth.js';
import { useMyTasksByEmail, useUpdateTask } from '../../lib/queries.js';

const TABS = [
  { key: 'active', label: 'Activas' },
  { key: 'done', label: 'Completadas' },
];

export default function PortalTasks() {
  const [tab, setTab] = useState('active');
  const { user } = useAuth();
  const tasksQ = useMyTasksByEmail(user?.email);
  const updateTask = useUpdateTask();

  useEffect(() => {
    document.title = 'Tareas · Portal · Rosibel';
  }, []);

  const filtered = useMemo(() => {
    const all = tasksQ.data ?? [];
    if (tab === 'done') return all.filter((t) => t.status === 'done');
    return all.filter((t) => t.status !== 'done');
  }, [tab, tasksQ.data]);

  const toggle = (t) => {
    const next = t.status === 'done' ? 'pending' : 'done';
    updateTask.mutate({ id: t.id, patch: { status: next } });
  };

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

      {tasksQ.isLoading && (
        <Body style={{ textAlign: 'center', color: 'var(--ink-500)', padding: 24 }}>
          Cargando…
        </Body>
      )}

      {tasksQ.isError && (
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
          No pudimos cargar tus tareas: {tasksQ.error?.message ?? 'error desconocido'}
        </Body>
      )}

      {!tasksQ.isLoading && !tasksQ.isError && filtered.length === 0 && (
        <Body style={{ textAlign: 'center', color: 'var(--ink-500)', padding: 24 }}>
          {tab === 'done'
            ? 'Aún no hay tareas completadas.'
            : 'Sin tareas activas. Las que te asigne Rosibel aparecerán acá.'}
        </Body>
      )}

      {filtered.length > 0 && (
        <div className="portal-tasks-grid">
          {filtered.map((t) => {
            const done = t.status === 'done';
            const pending = updateTask.isPending && updateTask.variables?.id === t.id;
            return (
              <article key={t.id} className="wf-card" style={{ padding: 18 }}>
                <Stack gap={10}>
                  <Row gap={12} align="flex-start">
                    <button
                      type="button"
                      onClick={() => toggle(t)}
                      disabled={pending}
                      aria-label={done ? 'Marcar como pendiente' : 'Marcar como hecha'}
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 5,
                        border: '1.5px solid var(--sage-500)',
                        background: done ? 'var(--sage-500)' : '#fff',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 2,
                        cursor: pending ? 'wait' : 'pointer',
                        padding: 0,
                      }}
                    >
                      {done && <Icon name="check" size={12} color="var(--bg)" />}
                    </button>
                    <Stack gap={4} style={{ flex: 1 }}>
                      <H3
                        size={15}
                        style={{
                          textDecoration: done ? 'line-through' : 'none',
                          color: done ? 'var(--ink-300)' : 'var(--ink-900)',
                        }}
                      >
                        {t.title}
                      </H3>
                      {t.description && <Body size={13}>{t.description}</Body>}
                      {t.completed_at && (
                        <Meta style={{ paddingTop: 4 }}>
                          Completada el {new Date(t.completed_at).toLocaleDateString('es-CR')}
                        </Meta>
                      )}
                    </Stack>
                  </Row>
                </Stack>
              </article>
            );
          })}
        </div>
      )}
    </Stack>
  );
}
