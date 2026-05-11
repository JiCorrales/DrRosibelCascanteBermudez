import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Eyebrow,
  H3,
  Body,
  Btn,
  Pill,
  Stack,
  Row,
  Meta,
  Icon,
} from '../components/primitives.jsx';
import { SERVICES, formatColon } from '../data.js';

export default function ServiciosPage() {
  useEffect(() => {
    document.title = 'Servicios · Dra. Rosibel Cascante Bermúdez';
  }, []);

  return (
    <section className="section" style={{ paddingTop: 48 }}>
      <div className="container">
        <Stack gap={48}>
          <Stack gap={16} style={{ maxWidth: 720 }}>
            <Eyebrow>Servicios</Eyebrow>
            <h1 className="display" style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}>
              Todos los <em>servicios</em>.
            </h1>
            <Body size={17}>
              Cada espacio está pensado para una necesidad. Tocá uno para ver el detalle completo o reservá
              directamente.
            </Body>
          </Stack>

          <div className="grid-cols-auto cols-2-md">
            {SERVICES.map((s, i) => (
              <article key={s.id} className="wf-card" style={{ padding: 28 }}>
                <Stack gap={16} style={{ height: '100%' }}>
                  <Row justify="space-between" align="center">
                    <Pill outline>{`0${i + 1}`}</Pill>
                    <Meta>{s.dur} min</Meta>
                  </Row>
                  <H3 size={24}>{s.name}</H3>
                  <Body size={15} style={{ flex: 1 }}>
                    {s.desc}
                  </Body>
                  <div className="wf-divider" />
                  <Row justify="space-between" align="center">
                    <H3 size={22} style={{ color: 'var(--sage-700)' }}>
                      {formatColon(s.price)}
                    </H3>
                    <Row gap={8}>
                      <Btn
                        as={Link}
                        to={`/servicios/${s.id}`}
                        ghost
                        small
                        icon={false}
                      >
                        Ver detalle
                      </Btn>
                      <Btn as={Link} to={`/reservar?servicio=${s.id}`} small>
                        Reservar
                      </Btn>
                    </Row>
                  </Row>
                </Stack>
              </article>
            ))}
          </div>
        </Stack>
      </div>
    </section>
  );
}
