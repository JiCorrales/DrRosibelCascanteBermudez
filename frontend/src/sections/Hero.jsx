import React from 'react';
import { Link } from 'react-router-dom';
import { Eyebrow, Body, Btn, Photo, Stack, Row, Meta } from '../components/primitives.jsx';
import rosibelPortrait from '../assets/rosibel.jpg';

export default function Hero() {
  return (
    <section className="section" style={{ paddingTop: 48 }}>
      <div className="container">
        <div className="split">
          <Stack gap={28}>
            <Eyebrow>Psicología clínica · San José, Costa Rica</Eyebrow>
            <h1 className="display">
              Un espacio para
              <br />
              <em>volver a vos</em>.
            </h1>
            <p className="lead">
              Acompaño procesos de ansiedad, duelo, autoestima y relaciones desde una mirada cálida, ética y basada
              en evidencia. Sesiones online y presenciales.
            </p>
            <Row gap={12} wrap>
              <Btn as={Link} to="/reservar">Agendar cita</Btn>
              <Btn as={Link} to="/sobre" ghost icon={false}>
                Conocer mi historia
              </Btn>
            </Row>
            <Row gap={16} wrap style={{ paddingTop: 8 }}>
              <Meta>Rosibel Cascante Bermúdez</Meta>
              <Meta>·</Meta>
              <Meta>Colegiado CPCR 0000</Meta>
            </Row>
          </Stack>

          <div>
            <Photo
              aspectRatio="4 / 5"
              src={rosibelPortrait}
              alt="Dra. Rosibel Cascante Bermúdez, psicóloga clínica"
              rounded={18}
              objectPosition="center 25%"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
