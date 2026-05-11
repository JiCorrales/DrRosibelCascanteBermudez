import React, { useEffect, useState } from 'react';
import { AdminTopbar } from '../AdminShell.jsx';
import { Btn, Stack, Row, H3, Body, Meta, Icon, Pill } from '../../components/primitives.jsx';
import { AVAILABILITY_RULES, BLOCKED_DATES } from '../../mock/admin-data.js';

export default function AdminAvailability() {
  const [rules, setRules] = useState(AVAILABILITY_RULES);
  const [buffer, setBuffer] = useState(15);

  useEffect(() => {
    document.title = 'Disponibilidad · Admin · Rosibel';
  }, []);

  const toggleDay = (i) =>
    setRules((prev) => prev.map((r, idx) => (idx === i ? { ...r, active: !r.active } : r)));

  return (
    <>
      <AdminTopbar title="Disponibilidad" sub="Define cuándo aceptás reservas" />
      <div className="admin-content">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.2fr) minmax(280px, 1fr)',
            gap: 24,
            alignItems: 'flex-start',
          }}
          className="availability-grid"
        >
          <article className="wf-card" style={{ padding: 24 }}>
            <Stack gap={20}>
              <Stack gap={4}>
                <H3 size={17}>Horarios semanales</H3>
                <Meta>Tocá el switch para activar o desactivar cada día.</Meta>
              </Stack>
              <Stack gap={0}>
                {rules.map((r, i) => (
                  <Row
                    key={r.day}
                    justify="space-between"
                    align="center"
                    style={{
                      padding: '14px 0',
                      borderBottom: i < rules.length - 1 ? '1px solid var(--line)' : 0,
                    }}
                  >
                    <Row gap={16} align="center">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={r.active}
                        aria-label={`${r.active ? 'Desactivar' : 'Activar'} ${r.day}`}
                        onClick={() => toggleDay(i)}
                        style={{
                          width: 38,
                          height: 22,
                          borderRadius: 999,
                          background: r.active ? 'var(--sage-500)' : 'var(--line-2)',
                          border: 0,
                          padding: 2,
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'background 0.18s',
                        }}
                      >
                        <span
                          style={{
                            display: 'block',
                            width: 18,
                            height: 18,
                            borderRadius: 999,
                            background: '#fff',
                            transform: r.active ? 'translateX(16px)' : 'translateX(0)',
                            transition: 'transform 0.18s',
                          }}
                        />
                      </button>
                      <H3 size={14}>{r.day}</H3>
                    </Row>
                    <Meta style={{ color: r.active ? 'var(--ink-700)' : 'var(--ink-300)' }}>
                      {r.active ? r.range : 'Cerrado'}
                    </Meta>
                  </Row>
                ))}
              </Stack>
            </Stack>
          </article>

          <Stack gap={16}>
            <article className="wf-card" style={{ padding: 22 }}>
              <Stack gap={14}>
                <H3 size={15}>Días bloqueados</H3>
                <Body size={13}>Vacaciones, feriados o días personales.</Body>
                <Stack gap={10}>
                  {BLOCKED_DATES.map((t) => (
                    <Row gap={10} justify="space-between" align="center" key={t}>
                      <Body size={13}>{t}</Body>
                      <button
                        type="button"
                        aria-label={`Eliminar bloqueo ${t}`}
                        style={{
                          background: 'transparent',
                          border: 0,
                          padding: 6,
                          cursor: 'pointer',
                          color: 'var(--ink-300)',
                        }}
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </Row>
                  ))}
                </Stack>
                <Btn small ghost icon={false}>
                  + Bloquear fechas
                </Btn>
              </Stack>
            </article>

            <article className="wf-card warm" style={{ padding: 22 }}>
              <Stack gap={12}>
                <H3 size={15}>Buffer entre citas</H3>
                <Meta>{buffer} min de margen entre sesiones</Meta>
                <Row gap={8}>
                  {[10, 15, 30].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBuffer(b)}
                      style={{ all: 'unset', cursor: 'pointer' }}
                      aria-pressed={buffer === b}
                    >
                      <Pill outline={buffer !== b}>{b} min</Pill>
                    </button>
                  ))}
                </Row>
              </Stack>
            </article>
          </Stack>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .availability-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
