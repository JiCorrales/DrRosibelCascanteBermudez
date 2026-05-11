import React, { useEffect, useMemo, useState } from 'react';
import { Stack, Row, Meta, Icon } from '../../components/primitives.jsx';
import { PORTAL_DOCS } from '../../mock/admin-data.js';

const TYPE_LABELS = {
  pdf: 'PDF',
  audio: 'Audio',
  video: 'Video',
  image: 'Imagen',
  link: 'Enlace',
};

const TYPE_ICONS = {
  pdf: 'doc',
  audio: 'play',
  video: 'play',
  image: 'doc',
  link: 'arrow',
};

export default function PortalDocs() {
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    document.title = 'Documentos · Portal · Rosibel';
  }, []);

  const types = useMemo(() => {
    const set = new Set(PORTAL_DOCS.map((d) => d.type ?? 'pdf'));
    return Array.from(set);
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return PORTAL_DOCS;
    return PORTAL_DOCS.filter((d) => (d.type ?? 'pdf') === filter);
  }, [filter]);

  return (
    <Stack gap={24}>
      <Stack gap={6}>
        <h1 className="portal-page-title">Documentos</h1>
        <Meta>
          {PORTAL_DOCS.length} archivo{PORTAL_DOCS.length !== 1 ? 's' : ''} compartido
          {PORTAL_DOCS.length !== 1 ? 's' : ''} por Rosibel
        </Meta>
      </Stack>

      {types.length > 1 && (
        <div className="portal-filters" role="tablist" aria-label="Filtrar por tipo">
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            <span className={`wf-pill ${filter === 'all' ? '' : 'outline'}`}>
              Todos · {PORTAL_DOCS.length}
            </span>
          </button>
          {types.map((t) => {
            const count = PORTAL_DOCS.filter((d) => (d.type ?? 'pdf') === t).length;
            return (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={filter === t}
                onClick={() => setFilter(t)}
              >
                <span className={`wf-pill ${filter === t ? '' : 'outline'}`}>
                  {TYPE_LABELS[t] ?? t} · {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="portal-empty">No hay documentos en esta categoría.</div>
      ) : (
        <div className="portal-docs-grid">
          {filtered.map((d) => {
            const type = d.type ?? 'pdf';
            const iconName = TYPE_ICONS[type] ?? 'doc';
            return (
              <button key={d.id} type="button" className="portal-doc-tile" aria-label={`Abrir ${d.title}`}>
                <div className="portal-doc-tile__preview" aria-hidden="true">
                  <span className="portal-doc-tile__type-tag">{TYPE_LABELS[type] ?? type}</span>
                  <Icon name={iconName} size={42} />
                  <span className="portal-doc-tile__action">
                    <Icon name="arrow" size={14} />
                  </span>
                </div>
                <div className="portal-doc-tile__body">
                  <span className="portal-doc-tile__title">{d.title}</span>
                  <span className="portal-doc-tile__meta">{d.meta}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </Stack>
  );
}
