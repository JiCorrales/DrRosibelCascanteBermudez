import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { AdminTopbar } from '../AdminShell.jsx';
import { Btn, Stack, Row, H3, Body, Meta, Pill } from '../../components/primitives.jsx';
import { useService, useUpdateService, useCreateService } from '../../lib/queries.js';
import { formatColon } from '../../data.js';

const EMPTY_SERVICE = {
  id: '',
  name: '',
  desc: '',
  dur: 50,
  price: 0,
  modality: 'both',
  buffer: 15,
  forYou: [],
  active: false,
};

const labelStyle = {
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.04em',
  color: 'var(--ink-500)',
  textTransform: 'uppercase',
};

const inputStyle = {
  background: '#fff',
  border: '1px solid var(--line-2)',
  borderRadius: 'var(--r-md)',
  padding: '12px 14px',
  fontSize: 14,
  fontFamily: 'var(--sans)',
  color: 'var(--ink-900)',
  outline: 'none',
  width: '100%',
};

const MODALITIES = [
  { key: 'online', label: 'Online' },
  { key: 'presencial', label: 'Presencial' },
  { key: 'both', label: 'Híbrido' },
];

const BUFFERS = [0, 15, 30];

export default function AdminServiceEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'nuevo';
  const serviceQ = useService(isNew ? null : id);
  const updateService = useUpdateService();
  const createService = useCreateService();
  const [form, setForm] = useState(isNew ? EMPTY_SERVICE : null);
  const [feedback, setFeedback] = useState({ kind: null, msg: '' });

  // Cargamos el form cuando llegan los datos (sólo en modo edición)
  useEffect(() => {
    if (!isNew && serviceQ.data && !form) {
      setForm(serviceQ.data);
    }
  }, [serviceQ.data, form, isNew]);

  useEffect(() => {
    if (isNew) {
      document.title = 'Nuevo servicio · Admin';
    } else if (serviceQ.data) {
      document.title = `Editar ${serviceQ.data.name} · Admin`;
    }
  }, [serviceQ.data, isNew]);

  if (!isNew && !serviceQ.isLoading && !serviceQ.isError && serviceQ.data === null) {
    return <Navigate to="/admin/servicios" replace />;
  }

  if (!isNew && (serviceQ.isLoading || !form)) {
    return (
      <>
        <AdminTopbar title="Editar servicio" />
        <div className="admin-content">
          <Body style={{ color: 'var(--ink-500)' }}>Cargando…</Body>
        </div>
      </>
    );
  }

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));
  const initial = isNew ? null : serviceQ.data;
  const pending = updateService.isPending || createService.isPending;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ kind: null, msg: '' });
    if (!form.name?.trim()) {
      setFeedback({ kind: 'error', msg: 'El nombre es obligatorio.' });
      return;
    }
    try {
      if (isNew) {
        const created = await createService.mutateAsync({
          name: form.name.trim(),
          desc: form.desc,
          dur: form.dur,
          price: form.price,
          modality: form.modality,
          buffer: form.buffer,
          forYou: form.forYou,
          active: form.active,
        });
        navigate(`/admin/servicios/${created.id}`, { replace: true });
        return;
      }
      await updateService.mutateAsync({
        id: form.id,
        patch: {
          name: form.name,
          desc: form.desc,
          dur: form.dur,
          price: form.price,
          modality: form.modality,
          buffer: form.buffer,
          forYou: form.forYou,
        },
      });
      setFeedback({ kind: 'ok', msg: 'Cambios guardados.' });
    } catch (err) {
      setFeedback({
        kind: 'error',
        msg: err?.message ?? (isNew ? 'No pudimos crear el servicio.' : 'No pudimos guardar los cambios.'),
      });
    }
  };

  return (
    <>
      <AdminTopbar
        title={isNew ? 'Nuevo servicio' : 'Editar servicio'}
        sub={isNew ? 'Quedará desactivado hasta que lo publiques.' : initial?.name}
        action={
          <Btn as={Link} to="/admin/servicios" ghost small icon={false}>
            ← Volver
          </Btn>
        }
      />
      <div className="admin-content">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)',
            gap: 24,
            alignItems: 'flex-start',
          }}
          className="service-edit-grid"
        >
          <form className="wf-card" style={{ padding: 28 }} onSubmit={handleSubmit}>
            <Stack gap={18}>
              <Stack gap={8}>
                <label style={labelStyle} htmlFor="svc-name">
                  Nombre del servicio
                </label>
                <input
                  id="svc-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  style={inputStyle}
                />
              </Stack>

              <Stack gap={8}>
                <label style={labelStyle} htmlFor="svc-desc">
                  Descripción corta
                </label>
                <textarea
                  id="svc-desc"
                  value={form.desc ?? ''}
                  onChange={(e) => set('desc', e.target.value)}
                  rows={3}
                  style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
                />
              </Stack>

              <Row gap={14} wrap>
                <Stack gap={8} style={{ flex: 1, minWidth: 160 }}>
                  <label style={labelStyle} htmlFor="svc-dur">
                    Duración (min)
                  </label>
                  <input
                    id="svc-dur"
                    type="number"
                    min={5}
                    step={5}
                    value={form.dur}
                    onChange={(e) => set('dur', Number(e.target.value))}
                    style={inputStyle}
                  />
                </Stack>
                <Stack gap={8} style={{ flex: 1, minWidth: 160 }}>
                  <label style={labelStyle} htmlFor="svc-price">
                    Precio (₡)
                  </label>
                  <input
                    id="svc-price"
                    type="number"
                    min={0}
                    step={500}
                    value={form.price}
                    onChange={(e) => set('price', Number(e.target.value))}
                    style={inputStyle}
                  />
                </Stack>
              </Row>

              <Stack gap={8}>
                <span style={labelStyle}>Modalidad</span>
                <Row gap={8} wrap>
                  {MODALITIES.map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => set('modality', m.key)}
                      style={{ all: 'unset', cursor: 'pointer' }}
                      aria-pressed={form.modality === m.key}
                    >
                      <Pill outline={form.modality !== m.key}>{m.label}</Pill>
                    </button>
                  ))}
                </Row>
              </Stack>

              <Stack gap={8}>
                <span style={labelStyle}>Buffer antes/después</span>
                <Row gap={8} wrap>
                  {BUFFERS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => set('buffer', b)}
                      style={{ all: 'unset', cursor: 'pointer' }}
                      aria-pressed={form.buffer === b}
                    >
                      <Pill outline={form.buffer !== b}>{b} min</Pill>
                    </button>
                  ))}
                </Row>
              </Stack>

              {feedback.msg && (
                <div
                  role="status"
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--r-md)',
                    fontSize: 13,
                    background:
                      feedback.kind === 'ok'
                        ? 'var(--sage-100)'
                        : 'var(--danger-100)',
                    color:
                      feedback.kind === 'ok'
                        ? 'var(--sage-700)'
                        : 'var(--danger-500)',
                    border:
                      feedback.kind === 'ok'
                        ? '1px solid rgb(var(--sage-rgb) / 0.28)'
                        : '1px solid rgb(var(--danger-rgb) / 0.28)',
                  }}
                >
                  {feedback.msg}
                </div>
              )}

              <div className="wf-divider" />

              <Row gap={12}>
                <Btn
                  type="submit"
                  icon={false}
                  disabled={pending}
                  style={{ opacity: pending ? 0.5 : 1 }}
                >
                  {pending
                    ? (isNew ? 'Creando…' : 'Guardando…')
                    : (isNew ? 'Crear servicio' : 'Guardar cambios')}
                </Btn>
                <Btn
                  type="button"
                  onClick={() => navigate('/admin/servicios')}
                  ghost
                  icon={false}
                >
                  Cancelar
                </Btn>
              </Row>
            </Stack>
          </form>

          <article className="wf-card warm" style={{ padding: 22 }}>
            <Stack gap={12}>
              <H3 size={15}>Vista previa pública</H3>
              <Meta>Así aparece en /servicios</Meta>
              <div className="wf-card" style={{ padding: 16, background: '#fff' }}>
                <Stack gap={10}>
                  <H3 size={16}>{form.name}</H3>
                  <Body size={13}>{form.desc}</Body>
                  <Row justify="space-between" align="center">
                    <H3 size={18} style={{ color: 'var(--sage-700)' }}>
                      {formatColon(form.price)}
                    </H3>
                    <Pill warm>{form.dur} min</Pill>
                  </Row>
                </Stack>
              </div>
            </Stack>
          </article>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .service-edit-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
