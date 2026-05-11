import React from 'react';
import { Link } from 'react-router-dom';
import { Eyebrow, H3, Body, Btn, Pill, Stack, Row, Meta, Icon } from '../components/primitives.jsx';
import { SERVICES, formatColon } from '../data.js';

export default function Servicios() {
  return (
    <section className="section warm">
      <div className="container">
        <Stack gap={48}>
          <Stack gap={16} style={{ maxWidth: 720 }}>
            <Eyebrow>03 · Servicios</Eyebrow>
            <h2 className="h2-display">Lo que ofrezco.</h2>
            <Body size={16}>
              Cada espacio está pensado para una necesidad específica. Si no sabés cuál, escribime y vemos juntos.
            </Body>
          </Stack>

          <div className="grid-cols-auto cols-3-md">
            {SERVICES.slice(0, 3).map((s, i) => (
              <article key={s.id} className="wf-card" style={{ padding: 24 }}>
                <Stack gap={14} style={{ height: '100%' }}>
                  <Row justify="space-between">
                    <Pill outline>{`0${i + 1}`}</Pill>
                    <Meta>{s.dur} min</Meta>
                  </Row>
                  <H3 size={22}>{s.name}</H3>
                  <Body size={14} style={{ flex: 1 }}>
                    {s.desc}
                  </Body>
                  <Row justify="space-between" align="center" style={{ marginTop: 8, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
                    <H3 size={22} style={{ color: 'var(--sage-700)' }}>
                      {formatColon(s.price)}
                    </H3>
                    <Link
                      to={`/servicios/${s.id}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        color: 'var(--sage-700)',
                        fontWeight: 500,
                        fontSize: 14,
                      }}
                    >
                      Ver detalle
                      <Icon name="arrow" size={14} />
                    </Link>
                  </Row>
                </Stack>
              </article>
            ))}
          </div>

          <Row justify="center">
            <Btn as={Link} to="/servicios" ghost icon={false}>
              Ver todos los servicios
            </Btn>
          </Row>
        </Stack>
      </div>
    </section>
  );
}
