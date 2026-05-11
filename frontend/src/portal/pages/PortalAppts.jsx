import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Btn, Stack, Row, H3, Body, Meta, Icon } from '../../components/primitives.jsx';
import { PORTAL_APPTS } from '../../mock/admin-data.js';

const TABS = [
  { key: 'upcoming', label: 'Próximas' },
  { key: 'past',     label: 'Pasadas' },
];

export default function PortalAppts() {
  const [tab, setTab] = useState('upcoming');

  useEffect(() => {
    document.title = 'Mis citas · Portal · Rosibel';
  }, []);

  const filtered = useMemo(
    () => PORTAL_APPTS.filter((a) => (tab === 'upcoming' ? a.upcoming : !a.upcoming)),
    [tab]
  );

  return (
    <Stack gap={18}>
      <h1 className="portal-page-title">Mis citas</h1>

      <Row gap={8} wrap role="tablist" aria-label="Filtro de citas">
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
          Sin citas en esta categoría.
        </Body>
      )}
      {filtered.length > 0 && (
        <div className="portal-appts-grid">
          {filtered.map((a) => (
            <article key={a.id} className={`wf-card ${a.next ? 'sage' : ''}`} style={{ padding: 18 }}>
              <Stack gap={12}>
                <Row justify="space-between" align="flex-start">
                  <Stack gap={4}>
                    <H3 size={16}>
                      {a.date} · {a.time}
                    </H3>
                    <Meta>{a.service} · 50 min</Meta>
                  </Stack>
                  <span className={`wf-pill ${a.status === 'Confirmada' ? '' : 'outline'}`}>{a.status}</span>
                </Row>
                <Row gap={8}>
                  <Icon name="location" size={12} color="var(--ink-500)" />
                  <Meta>{a.modality}</Meta>
                </Row>
                {a.upcoming && (
                  <>
                    <div className="wf-divider" />
                    <Row gap={10} wrap>
                      <Btn small ghost icon={false}>
                        Reagendar
                      </Btn>
                      <Btn small ghost icon={false}>
                        Cancelar
                      </Btn>
                    </Row>
                  </>
                )}
              </Stack>
            </article>
          ))}
        </div>
      )}

      <Btn as={Link} to="/reservar" block ghost icon={false}>
        + Reservar nueva cita
      </Btn>
    </Stack>
  );
}
