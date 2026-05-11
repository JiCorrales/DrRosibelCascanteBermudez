import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import rosibelPortrait from '../assets/rosibel.jpg';
import {
  Eyebrow,
  H3,
  Body,
  Btn,
  Photo,
  Stack,
  Row,
  Meta,
  Icon,
} from '../components/primitives.jsx';
import { FORMACION, CREDENCIALES } from '../data.js';

export default function SobrePage() {
  useEffect(() => {
    document.title = 'Sobre · Dra. Rosibel Cascante Bermúdez';
  }, []);

  return (
    <>
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="container">
          <div className="split">
            <Stack gap={24}>
              <Eyebrow>Sobre la doctora</Eyebrow>
              <h1 className="display" style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}>
                Rosibel Cascante <em>Bermúdez</em>.
              </h1>
              <Body size={17}>
                Soy psicóloga clínica costarricense, graduada de la Universidad de Costa Rica en 2015. Desde 2016
                tengo consultorio propio en San Pedro y atiendo a adolescentes y adultos, en español e inglés.
              </Body>
              <Body size={17}>
                Trabajo desde una mirada integradora — combino TCC, EMDR y terapia humanista. Mi compromiso es
                acompañar cada proceso con la profundidad y el respeto que merece.
              </Body>
              <Row gap={12} wrap>
                <Btn as={Link} to="/reservar">Agendar una cita</Btn>
                <Btn as={Link} to="/servicios" ghost icon={false}>
                  Ver servicios
                </Btn>
              </Row>
            </Stack>

            <div>
              <Photo
                aspectRatio="4 / 5"
                src={rosibelPortrait}
                alt="Dra. Rosibel Cascante Bermúdez"
                rounded={18}
                objectPosition="center 30%"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section warm">
        <div className="container">
          <Stack gap={48}>
            <Stack gap={16} style={{ maxWidth: 720 }}>
              <Eyebrow>Formación</Eyebrow>
              <h2 className="h2-display">Una carrera dedicada a sostener procesos.</h2>
            </Stack>

            <div className="grid-cols-auto cols-3-md">
              {FORMACION.map(([year, t]) => (
                <article key={year} className="wf-card" style={{ padding: 24 }}>
                  <Stack gap={10}>
                    <H3 size={32} style={{ color: 'var(--sage-700)' }}>
                      {year}
                    </H3>
                    <Body size={15}>{t}</Body>
                  </Stack>
                </article>
              ))}
            </div>
          </Stack>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="split">
            <Stack gap={20}>
              <Eyebrow>Credenciales</Eyebrow>
              <h2 className="h2-display">Quién avala mi trabajo.</h2>
              <Body size={16}>
                Colegiada activa del Colegio Profesional de Psicólogos de Costa Rica (CPCR). Mi práctica se rige por
                el código de ética profesional vigente.
              </Body>
            </Stack>
            <div className="wf-card tinted" style={{ padding: 28 }}>
              <Stack gap={14}>
                {CREDENCIALES.map((t) => (
                  <Row gap={12} key={t}>
                    <Icon name="check" size={14} color="var(--sage-700)" />
                    <Meta style={{ fontSize: 15 }}>{t}</Meta>
                  </Row>
                ))}
              </Stack>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
