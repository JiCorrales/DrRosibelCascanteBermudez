import React from 'react';
import { Eyebrow, H3, Body, Stack } from '../components/primitives.jsx';
import { PRINCIPIOS } from '../data.js';

export default function Enfoque() {
  return (
    <section className="section">
      <div className="container">
        <Stack gap={48}>
          <Stack gap={16} style={{ maxWidth: 720 }}>
            <Eyebrow>02 · Cómo trabajo</Eyebrow>
            <h2 className="h2-display">Tres principios que guían mi práctica.</h2>
          </Stack>

          <div className="grid-cols-auto cols-3-md">
            {PRINCIPIOS.map(([n, t, d]) => (
              <article key={n} className="wf-card" style={{ padding: 28 }}>
                <Stack gap={14}>
                  <span
                    style={{
                      fontFamily: 'var(--serif)',
                      fontSize: 36,
                      color: 'var(--sage-500)',
                      lineHeight: 1,
                    }}
                  >
                    {n}
                  </span>
                  <H3 size={22}>{t}</H3>
                  <Body size={15}>{d}</Body>
                </Stack>
              </article>
            ))}
          </div>
        </Stack>
      </div>
    </section>
  );
}
