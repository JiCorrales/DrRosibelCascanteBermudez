import React, { useEffect } from 'react';
import { Stack, Row, H3, Meta, Icon } from '../../components/primitives.jsx';
import { PORTAL_DOCS } from '../../mock/admin-data.js';

export default function PortalDocs() {
  useEffect(() => {
    document.title = 'Documentos · Portal · Rosibel';
  }, []);

  return (
    <Stack gap={18}>
      <Stack gap={4}>
        <h1 className="portal-page-title">Documentos</h1>
        <Meta>Compartidos por Rosibel</Meta>
      </Stack>

      <Stack gap={10}>
        {PORTAL_DOCS.map((d) => (
          <button
            key={d.id}
            type="button"
            className="wf-card"
            style={{
              padding: 16,
              cursor: 'pointer',
              textAlign: 'left',
              border: '1px solid var(--line)',
              background: '#fff',
              fontFamily: 'inherit',
            }}
          >
            <Row gap={14} align="center">
              <span
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 8,
                  background: 'var(--sage-100)',
                  color: 'var(--sage-700)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                <Icon name="doc" size={18} />
              </span>
              <Stack gap={4} style={{ flex: 1 }}>
                <H3 size={14}>{d.title}</H3>
                <Meta>{d.meta}</Meta>
              </Stack>
              <Icon name="arrow" size={14} color="var(--ink-500)" />
            </Row>
          </button>
        ))}
      </Stack>
    </Stack>
  );
}
