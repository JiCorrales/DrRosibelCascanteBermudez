import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminTopbar } from '../AdminShell.jsx';
import { Btn, Stack, Row, H3, Body, Meta, Photo, Icon } from '../../components/primitives.jsx';
import { useClients, useCreateClient, useDeleteClient } from '../../lib/queries.js';

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
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    document.title = 'Clientes · Admin · Rosibel';
  }, []);

  const clientsQ = useClients({ status: tab, search: query });
  const deleteClient = useDeleteClient();
  const rows = clientsQ.data ?? [];

  const handleDelete = (e, c) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`¿Eliminar a ${displayName(c)}? Esta acción no se puede deshacer.`)) {
      deleteClient.mutate(c.id);
    }
  };

  return (
    <>
      <AdminTopbar
        title="Clientes"
        sub={
          clientsQ.isLoading
            ? 'Cargando…'
            : `${rows.length} persona${rows.length !== 1 ? 's' : ''}`
        }
        action={
          <Btn small icon={false} onClick={() => setShowCreate(true)}>
            + Nuevo
          </Btn>
        }
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
                border: '1px solid rgb(var(--danger-rgb) / 0.28)',
                borderRadius: 'var(--r-md)',
              }}
            >
              No pudimos cargar los clientes: {clientsQ.error?.message ?? 'error desconocido'}
            </Body>
          )}

          {deleteClient.isError && (
            <Body
              role="alert"
              style={{
                padding: '12px 16px',
                background: 'var(--danger-100)',
                color: 'var(--danger-500)',
                border: '1px solid rgb(var(--danger-rgb) / 0.28)',
                borderRadius: 'var(--r-md)',
              }}
            >
              No pudimos eliminar: {deleteClient.error?.message ?? 'error desconocido'}
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
                className="wf-card client-card"
                style={{ padding: 20, textDecoration: 'none', display: 'block', color: 'inherit', position: 'relative' }}
              >
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, c)}
                  aria-label={`Eliminar ${displayName(c)}`}
                  className="client-card__delete"
                  title="Eliminar cliente"
                >
                  <Icon name="trash" size={14} />
                </button>
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

      {showCreate && <NewClientModal onClose={() => setShowCreate(false)} />}

      <style>{`
        .client-card { transition: border-color 0.15s; }
        .client-card:hover { border-color: var(--sage-300); }
        .client-card__delete {
          position: absolute;
          top: 12px;
          right: 12px;
          background: transparent;
          border: 0;
          padding: 6px;
          border-radius: 6px;
          cursor: pointer;
          color: var(--ink-300);
          opacity: 0;
          transition: opacity 0.15s, color 0.15s, background 0.15s;
        }
        .client-card:hover .client-card__delete { opacity: 1; }
        .client-card__delete:hover { background: var(--danger-100); color: var(--danger-500); }
      `}</style>
    </>
  );
}

function NewClientModal({ onClose }) {
  const navigate = useNavigate();
  const createClient = useCreateClient();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    city: '',
    status: 'new',
  });

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    try {
      const result = await createClient.mutateAsync({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        age: form.age ? Number(form.age) : null,
        city: form.city.trim() || null,
        status: form.status,
      });
      onClose();
      if (result?.id) navigate(`/admin/clientes/${result.id}`);
    } catch {
      /* error visible vía mutation isError */
    }
  };

  return (
    <div className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="new-client-title">
      <button
        type="button"
        className="admin-modal__backdrop"
        onClick={onClose}
        aria-label="Cerrar"
      />
      <div className="admin-modal__panel">
        <Row justify="space-between" align="center" style={{ marginBottom: 16 }}>
          <H3 id="new-client-title" size={18}>Nuevo cliente</H3>
          <button
            type="button"
            className="admin-modal__close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </Row>
        <form onSubmit={handleSubmit}>
          <Stack gap={14}>
            <Stack gap={6}>
              <label className="admin-modal__label">Nombre completo *</label>
              <input
                className="admin-modal__input"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                required
                autoFocus
              />
            </Stack>
            <Stack gap={6}>
              <label className="admin-modal__label">Correo *</label>
              <input
                className="admin-modal__input"
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                required
              />
            </Stack>
            <Row gap={10} wrap>
              <Stack gap={6} style={{ flex: 1, minWidth: 180 }}>
                <label className="admin-modal__label">Teléfono</label>
                <input
                  className="admin-modal__input"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="+506 8000 1234"
                />
              </Stack>
              <Stack gap={6} style={{ flex: '0 0 90px' }}>
                <label className="admin-modal__label">Edad</label>
                <input
                  className="admin-modal__input"
                  type="number"
                  value={form.age}
                  onChange={(e) => update('age', e.target.value)}
                  min={0}
                  max={120}
                />
              </Stack>
            </Row>
            <Stack gap={6}>
              <label className="admin-modal__label">Ciudad</label>
              <input
                className="admin-modal__input"
                value={form.city}
                onChange={(e) => update('city', e.target.value)}
                placeholder="San Pedro, SJ"
              />
            </Stack>

            {createClient.isError && (
              <Body
                role="alert"
                style={{
                  padding: '10px 14px',
                  background: 'var(--danger-100)',
                  color: 'var(--danger-500)',
                  border: '1px solid rgb(var(--danger-rgb) / 0.28)',
                  borderRadius: 'var(--r-md)',
                  fontSize: 13,
                }}
              >
                {createClient.error?.message ?? 'No pudimos crear el cliente.'}
              </Body>
            )}

            <Row gap={8} justify="flex-end">
              <Btn ghost small icon={false} onClick={onClose} type="button">
                Cancelar
              </Btn>
              <Btn
                type="submit"
                small
                icon={false}
                disabled={createClient.isPending || !form.name.trim() || !form.email.trim()}
              >
                {createClient.isPending ? 'Creando…' : 'Crear cliente'}
              </Btn>
            </Row>
          </Stack>
        </form>
      </div>
    </div>
  );
}
