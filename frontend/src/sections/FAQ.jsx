import React, { useState } from 'react';
import { Eyebrow, H3, Body, Stack, Row, Icon } from '../components/primitives.jsx';
import { FAQS } from '../data.js';

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="section" id="faq">
      <div className="container">
        <div className="split">
          <Stack gap={20} style={{ alignSelf: 'flex-start', position: 'sticky', top: 96 }}>
            <Eyebrow>06 · Preguntas frecuentes</Eyebrow>
            <h2 className="h2-display">Lo que la gente suele preguntar.</h2>
            <Body size={16}>
              ¿No ves tu pregunta? Escribime a{' '}
              <a href="mailto:hola@rosibelpsicologa.cr" style={{ color: 'var(--sage-700)', textDecoration: 'underline' }}>
                hola@rosibelpsicologa.cr
              </a>
              .
            </Body>
          </Stack>

          <Stack gap={0}>
            {FAQS.map((item, i) => {
              const isOpen = open === i;
              const id = `faq-${i}`;
              return (
                <div key={item.q} style={{ borderTop: i === 0 ? '1px solid var(--line)' : undefined, borderBottom: '1px solid var(--line)' }}>
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={id}
                    type="button"
                    style={{
                      all: 'unset',
                      cursor: 'pointer',
                      display: 'block',
                      width: '100%',
                      padding: '22px 0',
                    }}
                  >
                    <Row justify="space-between" align="center">
                      <H3 size={18} style={{ flex: 1, paddingRight: 16 }}>
                        {item.q}
                      </H3>
                      <span
                        style={{
                          transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
                          transition: 'transform .2s ease',
                          color: 'var(--ink-500)',
                          display: 'inline-flex',
                          flexShrink: 0,
                        }}
                      >
                        <Icon name="plus" size={18} />
                      </span>
                    </Row>
                  </button>
                  {isOpen && (
                    <div id={id} style={{ padding: '0 0 24px', maxWidth: 620 }}>
                      <Body size={15}>{item.a}</Body>
                    </div>
                  )}
                </div>
              );
            })}
          </Stack>
        </div>
      </div>
    </section>
  );
}
