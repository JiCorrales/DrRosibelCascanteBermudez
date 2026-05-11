import React, { useEffect, useMemo, useState } from 'react';
import { Stack, Body, Meta, Icon } from '../../components/primitives.jsx';
import { useAuth } from '../../auth/useAuth.js';
import { useMyDocumentsByEmail } from '../../lib/queries.js';

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

// Permite que un documento de la DB (con `kind`) o del mock (con `type`)
// devuelva el mismo valor.
const kindOf = (d) => d.kind ?? d.type ?? 'pdf';

export default function PortalDocs() {
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();
  const docsQ = useMyDocumentsByEmail(user?.email);
  const docs = docsQ.data ?? [];

  useEffect(() => {
    document.title = 'Documentos · Portal · Rosibel';
  }, []);

  const types = useMemo(() => {
    const set = new Set(docs.map(kindOf));
    return Array.from(set);
  }, [docs]);

  const filtered = useMemo(() => {
    if (filter === 'all') return docs;
    return docs.filter((d) => kindOf(d) === filter);
  }, [filter, docs]);

  const openDoc = (d) => {
    if (d.external_url) {
      window.open(d.external_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Stack gap={24}>
      <Stack gap={6}>
        <h1 className="portal-page-title">Documentos</h1>
        <Meta>
          {docsQ.isLoading
            ? 'Cargando…'
            : `${docs.length} archivo${docs.length !== 1 ? 's' : ''} compartido${docs.length !== 1 ? 's' : ''} por Rosibel`}
        </Meta>
      </Stack>

      {docsQ.isError && (
        <Body
          role="alert"
          style={{
            padding: '12px 16px',
            background: 'var(--danger-100)',
            color: 'var(--danger-500)',
            border: '1px solid rgba(184,84,80,0.28)',
            borderRadius: 'var(--r-md)',
          }}
        >
          No pudimos cargar tus documentos: {docsQ.error?.message ?? 'error desconocido'}
        </Body>
      )}

      {types.length > 1 && (
        <div className="portal-filters" role="tablist" aria-label="Filtrar por tipo">
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            <span className={`wf-pill ${filter === 'all' ? '' : 'outline'}`}>
              Todos · {docs.length}
            </span>
          </button>
          {types.map((t) => {
            const count = docs.filter((d) => kindOf(d) === t).length;
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

      {!docsQ.isLoading && filtered.length === 0 ? (
        <div className="portal-empty">
          {filter === 'all'
            ? 'Aún no hay documentos compartidos. Los que Rosibel te comparta aparecerán acá.'
            : 'No hay documentos en esta categoría.'}
        </div>
      ) : (
        <div className="portal-docs-grid">
          {filtered.map((d) => {
            const type = kindOf(d);
            const iconName = TYPE_ICONS[type] ?? 'doc';
            const clickable = Boolean(d.external_url);
            return (
              <button
                key={d.id}
                type="button"
                className="portal-doc-tile"
                aria-label={clickable ? `Abrir ${d.title}` : d.title}
                onClick={() => openDoc(d)}
                style={{ cursor: clickable ? 'pointer' : 'default' }}
              >
                <div className="portal-doc-tile__preview" aria-hidden="true">
                  <span className="portal-doc-tile__type-tag">{TYPE_LABELS[type] ?? type}</span>
                  <Icon name={iconName} size={42} />
                  <span className="portal-doc-tile__action">
                    <Icon name="arrow" size={14} />
                  </span>
                </div>
                <div className="portal-doc-tile__body">
                  <span className="portal-doc-tile__title">{d.title}</span>
                  <span className="portal-doc-tile__meta">
                    {d.meta ?? `${TYPE_LABELS[type] ?? type}`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </Stack>
  );
}
