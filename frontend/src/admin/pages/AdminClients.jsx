import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminTopbar } from '../AdminShell.jsx';
import { Btn, Stack, Row, H3, Body, Meta, Photo, Icon } from '../../components/primitives.jsx';
import { useClients } from '../../lib/queries.js';

const TABS = [
  { key: 'all', label: 'Todos' },
  { key: 'active', label: 'Activos' },
  { key: 'new', label: 'Nuevos' },
];

// Helper: el mock usa `name`, la DB usa `full_name`.
const displayName = (c) => c.full_name ?? c.name ?? '';

export default function AdminClients() {
  const [tab, setTab] = useState('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    document.title = 'Clientes · Admin · Rosibel';
  }, []);

  const clientsQ = useClients({ status: tab, search: query });
  const rows = clientsQ.data ?? [];

  return (
    <>
      <AdminTopbar
        title="Clientes"
        sub={
          clientsQ.isLoading
            ? 'Cargando…'
            : `${rows.length} persona${rows.length !== 1 ? 's' : ''}`
        }
        action={<Btn small icon={false}>+ Nuevo</Btn>}
      />
      <div className="admin-content">
        <Stack gap={20}>
          <Row gap={12} justify="space-between" wrap>
            <Row gap={8} wrap role="tablist" aria-label="Filtro de clientes">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.key}
                  onClick={() => setTab(t.key)}
                  style={{ all: 'unset', cursor: 'pointer' }}
                >
                  <span className={`wf-pill ${tab === t.key ? '' : 'outline'}`}>{t.label}</span>
                </button>
              ))}
            </Row>
            <input
              type="search"
              placeholder="Buscar por nombre o correo…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Buscar clientes"
              style={{
                minWidth: 260,
                padding: '10px 14px',
                background: '#fff',
                border: '1px solid var(--line-2)',
                borderRadius: 'var(--r-md)',
                fontSize: 14,
                fontFamily: 'var(--sans)',
              }}
            />
          </Row>

          {clientsQ.isError && (
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
              No pudimos cargar los clientes: {clientsQ.error?.message ?? 'error desconocido'}
            </Body>
          )}

          {!clientsQ.isError && !clientsQ.isLoading && rows.length === 0 && (
            <Body style={{ textAlign: 'center', color: 'var(--ink-500)', padding: 32 }}>
              No hay clientes que coincidan.
            </Body>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16,
            }}
          >
            {rows.map((c) => (
              <Link
                key={c.id}
                to={`/admin/clientes/${c.id}`}
                className="wf-card"
                style={{ padding: 20, textDecoration: 'none', display: 'block', color: 'inherit' }}
              >
                <Stack gap={14}>
                  <Row gap={12} align="center">
                    <Photo w={44} h={44} rounded={999} label="" />
                    <Stack gap={2} style={{ flex: 1 }}>
                      <H3 size={15}>{displayName(c)}</H3>
                      <Meta>
                        {c.status === 'active' ? 'Activo' : c.status === 'new' ? 'Nuevo' : 'Inactivo'}
                        {typeof c.sessions === 'number' &&
                          ` · ${c.sessions} ${c.sessions === 1 ? 'sesión' : 'sesiones'}`}
                      </Meta>
                    </Stack>
                  </Row>
                  <div className="wf-divider" />
                  <Stack gap={8}>
                    <Row gap={8}>
                      <Icon name="mail" size={12} color="var(--ink-300)" />
                      <Meta>{c.email}</Meta>
                    </Row>
                    {c.phone && (
                      <Row gap={8}>
                        <Icon name="phone" size={12} color="var(--ink-300)" />
                        <Meta>{c.phone}</Meta>
                      </Row>
                    )}
                    {c.city && (
                      <Row gap={8}>
                        <Icon name="location" size={12} color="var(--ink-300)" />
                        <Meta>{c.city}</Meta>
                      </Row>
                    )}
                  </Stack>
                </Stack>
              </Link>
            ))}
          </div>
        </Stack>
      </div>
    </>
  );
}
