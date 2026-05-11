import React from 'react';
import { Link } from 'react-router-dom';
import { Eyebrow, Body, Btn, Photo, Stack, Row, Icon, Meta } from '../components/primitives.jsx';
import { CREDENCIALES } from '../data.js';

export default function Sobre() {
  return (
    <section className="section warm">
      <div className="container">
        <div className="split">
          <div>
            <Photo aspectRatio="4 / 5" label="foto consultorio" rounded={18} />
          </div>
          <Stack gap={24}>
            <Eyebrow>01 · Sobre mí</Eyebrow>
            <h2 className="h2-display">Hola otra vez — te cuento un poco más.</h2>
            <Body size={16}>
              Soy psicóloga clínica con 10 años acompañando procesos individuales y de pareja. Mi enfoque combina la
              terapia cognitivo-conductual con una mirada humanista —ningún proceso es igual a otro.
            </Body>
            <div className="wf-card tinted" style={{ padding: 20 }}>
              <Stack gap={12}>
                {CREDENCIALES.map((t) => (
                  <Row gap={12} key={t}>
                    <Icon name="check" size={14} color="var(--sage-700)" />
                    <Meta style={{ fontSize: 14 }}>{t}</Meta>
                  </Row>
                ))}
              </Stack>
            </div>
            <Btn as={Link} to="/sobre" ghost icon={false} style={{ alignSelf: 'flex-start' }}>
              Conocer mi historia
            </Btn>
          </Stack>
        </div>
      </div>
    </section>
  );
}
