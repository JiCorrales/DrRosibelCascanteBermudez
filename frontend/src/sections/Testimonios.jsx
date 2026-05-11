import React, { useState } from 'react';
import { Eyebrow, H3, Body, Photo, Stack, Row, Meta } from '../components/primitives.jsx';
import { TESTIMS } from '../data.js';

export default function Testimonios() {
  const [i, setI] = useState(0);
  const t = TESTIMS[i];

  return (
    <section className="section warm">
      <div className="container">
        <Stack gap={32} style={{ maxWidth: 820, marginInline: 'auto', textAlign: 'center', alignItems: 'center' }}>
          <Eyebrow>05 · Testimonios</Eyebrow>
          <h2 className="h2-display">Lo que dicen quienes pasaron por acá.</h2>

          <div className="wf-card" style={{ padding: '40px 28px', width: '100%' }} aria-live="polite">
            <Stack gap={20} style={{ alignItems: 'center', textAlign: 'center' }}>
              <span
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 64,
                  color: 'var(--sage-300)',
                  lineHeight: 0.5,
                }}
                aria-hidden="true"
              >
                &ldquo;
              </span>
              <Body size={18} style={{ lineHeight: 1.5, maxWidth: 640 }}>
                {t.text}
              </Body>
              <Row gap={12} align="center" justify="center">
                <Photo w={44} h={44} rounded={999} label="" />
                <Stack gap={2} style={{ textAlign: 'left' }}>
                  <H3 size={15}>{t.who}</H3>
                  <Meta>{t.when}</Meta>
                </Stack>
              </Row>
            </Stack>
          </div>

          <Row gap={8} justify="center" align="center">
            {TESTIMS.map((_, j) => (
              <button
                key={j}
                onClick={() => setI(j)}
                aria-label={`Mostrar testimonio ${j + 1} de ${TESTIMS.length}`}
                aria-pressed={i === j}
                type="button"
                style={{ background: 'none', border: 0, padding: 4, cursor: 'pointer' }}
              >
                <span
                  style={{
                    display: 'block',
                    width: i === j ? 24 : 8,
                    height: 8,
                    borderRadius: 999,
                    background: i === j ? 'var(--sage-500)' : 'var(--sage-300)',
                    transition: 'width .2s ease, background .2s ease',
                  }}
                />
              </button>
            ))}
          </Row>
        </Stack>
      </div>
    </section>
  );
}
