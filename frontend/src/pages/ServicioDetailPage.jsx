import React, { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import {
  Eyebrow,
  H3,
  Body,
  Btn,
  Photo,
  Pill,
  Stack,
  Row,
  Meta,
  Icon,
} from '../components/primitives.jsx';
import { findService, formatColon } from '../data.js';

export default function ServicioDetailPage() {
  const { id } = useParams();
  const service = findService(id);

  useEffect(() => {
    if (service) {
      document.title = `${service.name} · Dra. Rosibel Cascante Bermúdez`;
    }
  }, [service]);

  if (!service) return <Navigate to="/servicios" replace />;

  const cadence = service.dur >= 80 ? 'quincenales' : 'semanales';
  const priceLabel = formatColon(service.price);

  return (
    <>
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="container">
          <Stack gap={16} style={{ marginBottom: 24 }}>
            <Link
              to="/servicios"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 14,
                color: 'var(--ink-500)',
              }}
            >
              <Icon name="back" size={14} />
              Volver a servicios
            </Link>
          </Stack>

          <div className="split">
            <Stack gap={24}>
              <Eyebrow>Servicio</Eyebrow>
              <h1 className="display" style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}>
                {service.name}
              </h1>
              <Row gap={8} wrap>
                <Pill warm>{service.dur} min</Pill>
                <Pill warm>{priceLabel}</Pill>
                <Pill warm>Online / presencial</Pill>
              </Row>
              <Body size={17}>{service.desc}</Body>
              <Row gap={12} wrap>
                <Btn as={Link} to={`/reservar?servicio=${service.id}`}>
                  Reservar {service.name.toLowerCase()}
                </Btn>
                <Btn as={Link} to="/servicios" ghost icon={false}>
                  Ver otros servicios
                </Btn>
              </Row>
            </Stack>

            <div>
              <Photo aspectRatio="4 / 5" label="ambiente consultorio" rounded={18} />
            </div>
          </div>
        </div>
      </section>

      <section className="section warm">
        <div className="container">
          <div className="split">
            <Stack gap={28}>
              <Stack gap={12}>
                <Eyebrow>De qué se trata</Eyebrow>
                <h2 className="h2-display">Un proceso pensado para vos.</h2>
              </Stack>
              <Body size={16}>
                {service.desc} Trabajamos a tu ritmo, en un ambiente sin juicio, con sesiones {cadence} de{' '}
                {service.dur} minutos. Si querés alternar entre modalidad online y presencial, podés hacerlo en
                cualquier momento.
              </Body>
            </Stack>

            <div className="wf-card" style={{ padding: 28 }}>
              <Stack gap={16}>
                <H3 size={20}>Para vos si...</H3>
                <Stack gap={12}>
                  {service.forYou.map((t) => (
                    <Row gap={12} align="flex-start" key={t}>
                      <span style={{ paddingTop: 4 }}>
                        <Icon name="check" size={14} color="var(--sage-700)" />
                      </span>
                      <Body size={15}>{t}</Body>
                    </Row>
                  ))}
                </Stack>
              </Stack>
            </div>
          </div>
        </div>
      </section>

      <section className="section sage">
        <div className="container">
          <Row
            justify="space-between"
            align="center"
            wrap
            style={{ gap: 24 }}
          >
            <Stack gap={8}>
              <h2 className="h2-display" style={{ color: 'var(--bg)' }}>
                ¿Listo para empezar?
              </h2>
              <Meta style={{ color: 'var(--sage-100)' }}>
                {service.dur} min · {priceLabel}
              </Meta>
            </Stack>
            <Btn
              as={Link}
              to={`/reservar?servicio=${service.id}`}
              style={{ background: 'var(--bg)', color: 'var(--sage-700)' }}
            >
              Reservar ahora
            </Btn>
          </Row>
        </div>
      </section>
    </>
  );
}
