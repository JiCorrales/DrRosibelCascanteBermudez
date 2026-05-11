import React from 'react';
import { Link } from 'react-router-dom';
import { Eyebrow, Body, Btn, Stack, Row, Icon, Meta } from '../components/primitives.jsx';
import WhatsAppButton from '../components/WhatsAppButton.jsx';

export default function CTA() {
  return (
    <section className="section sage" id="contacto">
      <div className="container">
        <div className="split">
          <Stack gap={24}>
            <Eyebrow style={{ color: 'var(--sage-100)' }}>Empezar</Eyebrow>
            <h2 className="h2-display" style={{ color: 'var(--bg)' }}>
              ¿Listo para dar el primer paso?
            </h2>
            <Body size={17} style={{ color: 'var(--sage-100)' }}>
              Reservá una primera sesión de 20 minutos sin costo. Conversamos, conocés cómo trabajo y juntos vemos
              si encajamos. Sin compromiso.
            </Body>
            <Row gap={12} wrap>
              <Btn
                as={Link}
                to="/reservar?servicio=primer-encuentro"
                style={{ background: 'var(--bg)', color: 'var(--sage-700)' }}
              >
                Agendar primera sesión gratis
              </Btn>
              <WhatsAppButton variant="ghost" style={{ background: 'transparent', color: 'var(--bg)', border: '1px solid var(--bg)' }}>
                Escribirme por WhatsApp
              </WhatsAppButton>
            </Row>
          </Stack>

          <div
            className="wf-card"
            style={{
              padding: 28,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.18)',
              color: 'var(--bg)',
            }}
          >
            <Stack gap={18}>
              <h3 className="wf-h3" style={{ color: 'var(--bg)', fontSize: 18 }}>
                ¿Preferís escribir primero?
              </h3>
              <Row gap={12} align="center">
                <Icon name="mail" size={16} color="var(--sage-100)" />
                <a
                  href="mailto:cascantebermudezrosibel@gmail.com"
                  style={{ color: 'var(--bg)', fontSize: 15, textDecoration: 'underline' }}
                >
                  cascantebermudezrosibel@gmail.com
                </a>
              </Row>
              <Row gap={12} align="center">
                <Icon name="phone" size={16} color="var(--sage-100)" />
                <a href="tel:+50688414861" style={{ color: 'var(--bg)', fontSize: 15, textDecoration: 'underline' }}>
                  +506 8841 4861
                </a>
              </Row>
              <Row gap={12} align="center">
                <Icon name="location" size={16} color="var(--sage-100)" />
                <Meta style={{ color: 'var(--sage-100)' }}>San Pedro, San José</Meta>
              </Row>
            </Stack>
          </div>
        </div>
      </div>
    </section>
  );
}
