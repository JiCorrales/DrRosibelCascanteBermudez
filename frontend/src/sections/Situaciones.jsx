import React from 'react';
import { Eyebrow, H3, Body, Stack, Icon } from '../components/primitives.jsx';
import { SITS } from '../data.js';

export default function Situaciones() {
  return (
    <section className="section">
      <div className="container">
        <Stack gap={40}>
          <Stack gap={16} style={{ maxWidth: 720 }}>
            <Eyebrow>04 · Qué trabajamos</Eyebrow>
            <h2 className="h2-display">9 razones por las que la gente llega.</h2>
            <Body size={16}>
              Si te identificás con alguna de estas, podemos hablar. La lista no es exhaustiva — cada proceso es
              único.
            </Body>
          </Stack>

          <div
            className="grid-cols-auto cols-2-sm cols-3-md"
            style={{ gap: 14 }}
          >
            {SITS.map((s) => (
              <article
                key={s.label}
                className="wf-card"
                style={{
                  padding: '22px 18px',
                  display: 'flex',
                  gap: 14,
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    background: 'var(--sage-100)',
                    color: 'var(--sage-700)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon name={s.icon} size={18} />
                </span>
                <H3 size={16}>{s.label}</H3>
              </article>
            ))}
          </div>
        </Stack>
      </div>
    </section>
  );
}
