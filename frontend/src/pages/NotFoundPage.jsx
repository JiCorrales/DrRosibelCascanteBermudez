import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eyebrow, Body, Btn, Stack } from '../components/primitives.jsx';

export default function NotFoundPage() {
  useEffect(() => {
    document.title = 'Página no encontrada · Dra. Rosibel Cascante Bermúdez';
  }, []);

  return (
    <section className="section" style={{ paddingTop: 96 }}>
      <div className="container">
        <Stack gap={24} style={{ maxWidth: 560 }}>
          <Eyebrow>Error 404</Eyebrow>
          <h1 className="display" style={{ fontSize: 'clamp(40px, 6vw, 64px)' }}>
            No encontré <em>esta página</em>.
          </h1>
          <Body size={17}>
            La dirección que buscás no existe o se movió. Podés volver al inicio o revisar los servicios disponibles.
          </Body>
          <div>
            <Btn as={Link} to="/">Volver al inicio</Btn>
          </div>
        </Stack>
      </div>
    </section>
  );
}
