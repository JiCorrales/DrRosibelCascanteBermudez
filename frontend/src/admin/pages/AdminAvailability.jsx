import React, { useEffect, useState } from 'react';
import { AdminTopbar } from '../AdminShell.jsx';
import { Btn, Stack, Row, H3, Body, Meta, Icon, Pill } from '../../components/primitives.jsx';
import {
  useAvailabilityRules,
  useAvailabilityOverrides,
  useUpdateAvailabilityRule,
  useCreateAvailabilityOverride,
  useDeleteAvailabilityOverride,
  useSettings,
  useUpdateSetting,
} from '../../lib/queries.js';

// weekday: 0=Dom, 1=Lun, ..., 6=Sáb (alineado con JS Date.getDay() y DB)
const DAY_LABELS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// Orden de visualización: Lunes primero (más natural para una agenda CR)
const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

const BUFFER_OPTIONS = [10, 15, 30];

function formatTimeRange(start, end) {
  if (!start || !end) return 'Cerrado';
  return `${start.slice(0, 5)} — ${end.slice(0, 5)}`;
}

function formatOverrideDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T12:00:00');
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function AdminAvailability() {
  const rulesQ = useAvailabilityRules();
  const overridesQ = useAvailabilityOverrides();
  const settingsQ = useSettings();
  const updateRule = useUpdateAvailabilityRule();
  const createOverride = useCreateAvailabilityOverride();
  const deleteOverride = useDeleteAvailabilityOverride();
  const updateSetting = useUpdateSetting();

  const [showBlockModal, setShowBlockModal] = useState(false);

  useEffect(() => {
    document.title = 'Disponibilidad · Admin · Rosibel';
  }, []);

  const rules = rulesQ.data ?? [];
  const overrides = overridesQ.data ?? [];
  const buffer = Number(settingsQ.data?.buffer_min ?? 15);

  // Ordenar reglas según DISPLAY_ORDER (Lun primero)
  const orderedRules = DISPLAY_ORDER
    .map((wd) => rules.find((r) => r.weekday === wd))
    .filter(Boolean);

  const toggleDay = (rule) => {
    updateRule.mutate({ id: rule.id, patch: { active: !rule.active } });
  };

  const handleBuffer = (b) => {
    updateSetting.mutate({ key: 'buffer_min', value: b });
  };

  const handleDeleteOverride = (override) => {
    const label = override.note ? `${formatOverrideDate(override.date)} · ${override.note}` : formatOverrideDate(override.date);
    if (window.confirm(`¿Quitar el bloqueo "${label}"?`)) {
      deleteOverride.mutate(override.id);
    }
  };

  return (
    <>
      <AdminTopbar title="Disponibilidad" sub="Define cuándo aceptás reservas" />
      <div className="admin-content">
        {(rulesQ.isError || overridesQ.isError) && (
          <Body
            role="alert"
            style={{
              marginBottom: 16,
              padding: '12px 16px',
              background: 'var(--danger-100)',
              color: 'var(--danger-500)',
              border: '1px solid rgb(var(--danger-rgb) / 0.28)',
              borderRadius: 'var(--r-md)',
            }}
          >
            No pudimos cargar la disponibilidad. Intentá recargar la página.
          </Body>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.2fr) minmax(280px, 1fr)',
            gap: 24,
            alignItems: 'flex-start',
          }}
          className="availability-grid"
        >
          <article className="wf-card" style={{ padding: 24 }}>
            <Stack gap={20}>
              <Stack gap={4}>
                <H3 size={17}>Horarios semanales</H3>
                <Meta>Tocá el switch para activar o desactivar cada día.</Meta>
              </Stack>
              {rulesQ.isLoading && <Meta>Cargando…</Meta>}
              <Stack gap={0}>
                {orderedRules.map((r, i) => (
                  <Row
                    key={r.id}
                    justify="space-between"
                    align="center"
                    style={{
                      padding: '14px 0',
                      borderBottom: i < orderedRules.length - 1 ? '1px solid var(--line)' : 0,
                    }}
                  >
                    <Row gap={16} align="center">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={r.active}
                        aria-label={`${r.active ? 'Desactivar' : 'Activar'} ${DAY_LABELS[r.weekday]}`}
                        onClick={() => toggleDay(r)}
                        disabled={updateRule.isPending}
                        style={{
                          width: 38,
                          height: 22,
                          borderRadius: 999,
                          background: r.active ? 'var(--sage-500)' : 'var(--line-2)',
                          border: 0,
                          padding: 2,
                          cursor: updateRule.isPending ? 'wait' : 'pointer',
                          position: 'relative',
                          transition: 'background 0.18s',
                        }}
                      >
                        <span
                          style={{
                            display: 'block',
                            width: 18,
                            height: 18,
                            borderRadius: 999,
                            background: '#fff',
                            transform: r.active ? 'translateX(16px)' : 'translateX(0)',
                            transition: 'transform 0.18s',
                          }}
                        />
                      </button>
                      <H3 size={14}>{DAY_LABELS[r.weekday]}</H3>
                    </Row>
                    <Meta style={{ color: r.active ? 'var(--ink-700)' : 'var(--ink-300)' }}>
                      {r.active ? formatTimeRange(r.start_time, r.end_time) : 'Cerrado'}
                    </Meta>
                  </Row>
                ))}
              </Stack>
            </Stack>
          </article>

          <Stack gap={16}>
            <article className="wf-card" style={{ padding: 22 }}>
              <Stack gap={14}>
                <H3 size={15}>Días bloqueados</H3>
                <Body size={13}>Vacaciones, feriados o días personales.</Body>
                {overridesQ.isLoading && <Meta>Cargando…</Meta>}
                {!overridesQ.isLoading && overrides.length === 0 && (
                  <Meta>Sin días bloqueados.</Meta>
                )}
                <Stack gap={10}>
                  {overrides.map((o) => (
                    <Row gap={10} justify="space-between" align="center" key={o.id}>
                      <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                        <Body size={13}>{formatOverrideDate(o.date)}</Body>
                        {o.note && <Meta>{o.note}</Meta>}
                      </Stack>
                      <button
                        type="button"
                        aria-label={`Eliminar bloqueo ${formatOverrideDate(o.date)}`}
                        onClick={() => handleDeleteOverride(o)}
                        disabled={deleteOverride.isPending && deleteOverride.variables === o.id}
                        style={{
                          background: 'transparent',
                          border: 0,
                          padding: 6,
                          cursor: 'pointer',
                          color: 'var(--ink-300)',
                        }}
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </Row>
                  ))}
                </Stack>
                <Btn small ghost icon={false} onClick={() => setShowBlockModal(true)}>
                  + Bloquear fechas
                </Btn>
              </Stack>
            </article>

            <article className="wf-card warm" style={{ padding: 22 }}>
              <Stack gap={12}>
                <H3 size={15}>Buffer entre citas</H3>
                <Meta>{buffer} min de margen entre sesiones</Meta>
                <Row gap={8}>
                  {BUFFER_OPTIONS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => handleBuffer(b)}
                      disabled={updateSetting.isPending}
                      style={{ all: 'unset', cursor: updateSetting.isPending ? 'wait' : 'pointer' }}
                      aria-pressed={buffer === b}
                    >
                      <Pill outline={buffer !== b}>{b} min</Pill>
                    </button>
                  ))}
                </Row>
              </Stack>
            </article>
          </Stack>
        </div>
      </div>

      {showBlockModal && (
        <BlockOverrideModal
          onClose={() => setShowBlockModal(false)}
          onSubmit={(input) => createOverride.mutateAsync(input)}
          pending={createOverride.isPending}
          error={createOverride.error}
        />
      )}

      <style>{`
        @media (max-width: 1100px) {
          .availability-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

function BlockOverrideModal({ onClose, onSubmit, pending, error }) {
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) return;
    try {
      await onSubmit({ date, is_closed: true, note: note.trim() || null });
      onClose();
    } catch {
      /* error visible vía prop */
    }
  };

  return (
    <div className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="block-override-title">
      <button
        type="button"
        className="admin-modal__backdrop"
        onClick={onClose}
        aria-label="Cerrar"
      />
      <div className="admin-modal__panel">
        <Row justify="space-between" align="center" style={{ marginBottom: 16 }}>
          <H3 id="block-override-title" size={18}>Bloquear fecha</H3>
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
              <label className="admin-modal__label">Fecha *</label>
              <input
                className="admin-modal__input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                autoFocus
              />
            </Stack>
            <Stack gap={6}>
              <label className="admin-modal__label">Motivo (opcional)</label>
              <input
                className="admin-modal__input"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Vacaciones, feriado, taller…"
                maxLength={120}
              />
            </Stack>

            {error && (
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
                {error.message ?? 'No pudimos bloquear la fecha.'}
              </Body>
            )}

            <Row gap={8} justify="flex-end">
              <Btn ghost small icon={false} onClick={onClose} type="button">
                Cancelar
              </Btn>
              <Btn type="submit" small icon={false} disabled={pending || !date}>
                {pending ? 'Bloqueando…' : 'Bloquear'}
              </Btn>
            </Row>
          </Stack>
        </form>
      </div>
    </div>
  );
}
