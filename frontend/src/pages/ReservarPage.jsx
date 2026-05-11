import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Eyebrow,
  H3,
  Body,
  Btn,
  Stack,
  Row,
  Meta,
  Icon,
} from '../components/primitives.jsx';
import CalPicker from '../components/CalPicker.jsx';
import { SERVICES, findService, formatColon } from '../data.js';
import { useCreateBooking, useOpenDays, useSlotsForDay } from '../lib/queries.js';
import { isSupabaseConfigured } from '../lib/supabase.js';

const STEP_TITLES = {
  1: '¿Qué servicio querés reservar?',
  2: 'Elegí día y hora',
  3: 'Tus datos',
};

const FIELDS = [
  { key: 'name', label: 'Nombre completo', placeholder: 'Tu nombre', type: 'text', autoComplete: 'name' },
  { key: 'email', label: 'Correo', placeholder: 'correo@dominio.com', type: 'email', autoComplete: 'email' },
  { key: 'phone', label: 'Teléfono / WhatsApp', placeholder: '+506 0000 0000', type: 'tel', autoComplete: 'tel' },
];

const inputStyle = {
  background: '#fff',
  border: '1px solid var(--line-2)',
  borderRadius: 'var(--r-md)',
  padding: '12px 14px',
  fontSize: 15,
  fontFamily: 'var(--sans)',
  color: 'var(--ink-900)',
  outline: 'none',
  width: '100%',
};

const labelStyle = {
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.04em',
  color: 'var(--ink-500)',
  textTransform: 'uppercase',
};

const SHORT_DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MONTH_NAMES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

function pad2(n) {
  return String(n).padStart(2, '0');
}

function formatDateLong(iso) {
  if (!iso) return '—';
  const d = new Date(iso + 'T12:00:00');
  return `${SHORT_DAYS[d.getDay()]} ${d.getDate()} de ${MONTH_NAMES[d.getMonth()]}`;
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function monthRange(year, month) {
  const last = new Date(year, month + 1, 0).getDate();
  return {
    from: `${year}-${pad2(month + 1)}-01`,
    to: `${year}-${pad2(month + 1)}-${pad2(last)}`,
  };
}

// Construye ISO timestamp en zona local del navegador, alineado con cómo
// el server interpreta scheduled_at (timestamptz).
function buildScheduledAt(isoDate, hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const [y, mo, d] = isoDate.split('-').map(Number);
  const local = new Date(y, mo - 1, d, h, m, 0, 0);
  return local.toISOString();
}

function SummaryCard({ service, isoDate, slot }) {
  if (!service) return null;
  return (
    <aside
      className="wf-card tinted"
      style={{ padding: 24, position: 'sticky', top: 96 }}
      aria-label="Resumen de la reserva"
    >
      <Stack gap={16}>
        <H3 size={18}>Tu reserva</H3>
        <div className="wf-divider" />
        <Row justify="space-between">
          <Meta>Servicio</Meta>
          <H3 size={14}>{service.name}</H3>
        </Row>
        <Row justify="space-between">
          <Meta>Duración</Meta>
          <H3 size={14}>{service.dur} min</H3>
        </Row>
        {isoDate && (
          <Row justify="space-between">
            <Meta>Fecha</Meta>
            <H3 size={14}>{formatDateLong(isoDate)}</H3>
          </Row>
        )}
        {slot && (
          <Row justify="space-between">
            <Meta>Hora</Meta>
            <H3 size={14}>{slot}</H3>
          </Row>
        )}
        <div className="wf-divider" />
        <Row justify="space-between" align="center">
          <Meta>Total</Meta>
          <H3 size={20} style={{ color: 'var(--sage-700)' }}>
            {formatColon(service.price)}
          </H3>
        </Row>
      </Stack>
    </aside>
  );
}

function Confirmation({ form, service, isoDate, slot, onReset }) {
  return (
    <section className="section" style={{ paddingTop: 56 }}>
      <div className="container">
        <Stack gap={32} style={{ maxWidth: 640 }}>
          <span
            style={{
              width: 72,
              height: 72,
              borderRadius: 999,
              background: 'var(--sage-100)',
              color: 'var(--sage-700)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-hidden="true"
          >
            <Icon name="check" size={32} />
          </span>
          <h1 className="display" style={{ fontSize: 'clamp(32px, 4.5vw, 48px)' }}>
            Listo — nos <em>vemos pronto</em>.
          </h1>
          <Body size={17}>
            Te envié los detalles a <strong>{form.email || 'tu correo'}</strong>. Vas a recibir un recordatorio 24
            horas antes de la cita.
          </Body>
          <div className="wf-card tinted" style={{ padding: 28 }}>
            <Stack gap={14}>
              <Row justify="space-between">
                <Meta>Servicio</Meta>
                <H3 size={15}>{service.name}</H3>
              </Row>
              <Row justify="space-between">
                <Meta>Fecha</Meta>
                <H3 size={15}>{`${formatDateLong(isoDate)} · ${slot}`}</H3>
              </Row>
              <Row justify="space-between">
                <Meta>Duración</Meta>
                <H3 size={15}>{service.dur} min</H3>
              </Row>
              <div className="wf-divider" />
              <Row justify="space-between">
                <Meta>Total</Meta>
                <H3 size={18} style={{ color: 'var(--sage-700)' }}>
                  {formatColon(service.price)}
                </H3>
              </Row>
            </Stack>
          </div>
          <Row gap={12} wrap>
            <Btn as={Link} to="/" ghost icon={false}>
              Volver al inicio
            </Btn>
            <Btn type="button" onClick={onReset} ghost icon={false}>
              Reservar otra cita
            </Btn>
          </Row>
        </Stack>
      </div>
    </section>
  );
}

export default function ReservarPage() {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const preService = search.get('servicio');

  const [step, setStep] = useState(1);
  const [svc, setSvc] = useState(() => (findService(preService) ? preService : SERVICES[0].id));

  // Calendario navegable
  const initial = new Date();
  const [year, setYear] = useState(initial.getFullYear());
  const [month, setMonth] = useState(initial.getMonth()); // 0-indexed
  const [selectedDate, setSelectedDate] = useState(null); // 'YYYY-MM-DD'
  const [selectedSlot, setSelectedSlot] = useState(null); // 'HH:MM'

  const [form, setForm] = useState({ name: '', email: '', phone: '', msg: '', consent: false });
  const [submitError, setSubmitError] = useState('');

  const createBooking = useCreateBooking();
  const submitting = createBooking.isPending;

  const service = findService(svc);
  useEffect(() => {
    document.title = 'Reservar cita · Dra. Rosibel Cascante Bermúdez';
  }, []);

  // Cargar días abiertos del mes activo
  const range = useMemo(() => monthRange(year, month), [year, month]);
  const openDaysQ = useOpenDays({
    from: range.from,
    to: range.to,
    durationMin: service?.dur ?? 50,
  });
  const availableDates = useMemo(() => new Set(openDaysQ.data ?? []), [openDaysQ.data]);

  // Cargar slots del día seleccionado
  const slotsQ = useSlotsForDay({
    date: selectedDate,
    durationMin: service?.dur ?? 50,
  });
  const slots = slotsQ.data ?? [];

  // Si el slot seleccionado ya no está libre (lo agarró otro mientras tanto), limpiarlo
  useEffect(() => {
    if (selectedSlot && slots.length > 0 && !slots.includes(selectedSlot)) {
      setSelectedSlot(null);
    }
  }, [slots, selectedSlot]);

  const canNext =
    step === 1
      ? Boolean(svc)
      : step === 2
      ? Boolean(selectedDate && selectedSlot)
      : step === 3
      ? Boolean(form.name.trim() && form.email.trim() && form.phone.trim() && form.consent)
      : true;

  const onPrev = () => {
    if (step === 1) navigate('/');
    else setStep((s) => s - 1);
  };

  const onNext = async (e) => {
    e?.preventDefault?.();
    if (!canNext || submitting) return;

    if (step < 3) {
      setStep((s) => s + 1);
      return;
    }

    setSubmitError('');
    try {
      await createBooking.mutateAsync({
        service_id: svc,
        scheduled_at: buildScheduledAt(selectedDate, selectedSlot),
        duration_min: service.dur,
        modality: 'online',
        patient_name: form.name.trim(),
        patient_email: form.email.trim().toLowerCase(),
        patient_phone: form.phone.trim(),
        message: form.msg.trim() || null,
        consent: form.consent,
      });
      setStep(4);
    } catch (err) {
      const msg = err?.message ?? 'No pudimos guardar tu reserva. Por favor probá de nuevo.';
      if (msg.includes('bookings_no_overlap_idx') || msg.toLowerCase().includes('duplicate')) {
        setSubmitError('Ese horario acaba de quedar reservado. Por favor elegí otro.');
        slotsQ.refetch?.();
      } else if (msg.toLowerCase().includes('row-level security')) {
        setSubmitError('La reserva no pasó la validación. Revisá los datos e intentá de nuevo.');
      } else {
        setSubmitError(msg);
      }
    }
  };

  const onReset = () => {
    setStep(1);
    setForm({ name: '', email: '', phone: '', msg: '', consent: false });
    setSubmitError('');
  };

  if (step === 4) {
    return (
      <Confirmation
        form={form}
        service={service}
        isoDate={selectedDate}
        slot={selectedSlot}
        onReset={onReset}
      />
    );
  }

  const navMonth = (delta) => {
    let y = year;
    let m = month + delta;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    // No retroceder a meses pasados
    const now = new Date();
    if (y < now.getFullYear() || (y === now.getFullYear() && m < now.getMonth())) return;
    setYear(y);
    setMonth(m);
  };

  return (
    <section className="section" style={{ paddingTop: 32 }}>
      <div className="container">
        <Stack gap={24} style={{ marginBottom: 32 }}>
          <button
            type="button"
            onClick={onPrev}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              color: 'var(--ink-500)',
            }}
          >
            <Icon name="back" size={14} />
            {step === 1 ? 'Volver al inicio' : 'Atrás'}
          </button>

          <Stack gap={12}>
            <Row justify="space-between" align="center">
              <Eyebrow>Reservar cita</Eyebrow>
              <Meta>Paso {step} de 4</Meta>
            </Row>
            <Row gap={6} role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={4}>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 2,
                    background: i <= step ? 'var(--sage-500)' : 'var(--line)',
                  }}
                />
              ))}
            </Row>
            <h1 className="h2-display">{STEP_TITLES[step]}</h1>
          </Stack>
        </Stack>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 32,
            alignItems: 'start',
          }}
          className="reservar-grid"
        >
          <form onSubmit={onNext}>
            {step === 1 && (
              <Stack gap={12}>
                {SERVICES.map((s) => {
                  const sel = svc === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSvc(s.id)}
                      style={{ all: 'unset', cursor: 'pointer', display: 'block' }}
                      type="button"
                      aria-pressed={sel}
                    >
                      <div
                        className="wf-card"
                        style={{
                          padding: 20,
                          borderColor: sel ? 'var(--sage-500)' : 'var(--line)',
                          borderWidth: sel ? 2 : 1,
                          borderStyle: 'solid',
                          borderRadius: 14,
                          background: sel ? 'var(--sage-100)' : '#fff',
                          transition: 'border-color .15s, background .15s',
                        }}
                      >
                        <Row justify="space-between" align="center">
                          <Stack gap={6}>
                            <H3 size={17}>{s.name}</H3>
                            <Row gap={10} wrap>
                              <Meta>{s.dur} min</Meta>
                              <Meta>·</Meta>
                              <Meta>{formatColon(s.price)}</Meta>
                            </Row>
                          </Stack>
                          <span
                            aria-hidden="true"
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: 999,
                              border: '1.5px solid var(--sage-500)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {sel && (
                              <span
                                style={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: 999,
                                  background: 'var(--sage-500)',
                                }}
                              />
                            )}
                          </span>
                        </Row>
                      </div>
                    </button>
                  );
                })}
              </Stack>
            )}

            {step === 2 && (
              <Stack gap={24}>
                <div className="wf-card" style={{ padding: 24 }}>
                  <CalPicker
                    year={year}
                    month={month}
                    selectedISODate={selectedDate}
                    availableDates={availableDates}
                    onSelectDate={(iso) => {
                      setSelectedDate(iso);
                      setSelectedSlot(null);
                    }}
                    onPrev={() => navMonth(-1)}
                    onNext={() => navMonth(1)}
                    loading={openDaysQ.isLoading}
                  />
                </div>

                {!selectedDate && !openDaysQ.isLoading && availableDates.size === 0 && (
                  <Body style={{ color: 'var(--ink-500)' }}>
                    No hay días disponibles este mes. Probá con el mes siguiente.
                  </Body>
                )}

                {selectedDate && (
                  <Stack gap={12}>
                    <Row justify="space-between" align="center">
                      <H3 size={16}>{formatDateLong(selectedDate)}</H3>
                      <Meta>
                        {slotsQ.isLoading
                          ? 'Cargando…'
                          : `${slots.length} horario${slots.length !== 1 ? 's' : ''}`}
                      </Meta>
                    </Row>
                    {slotsQ.isError && (
                      <Body
                        role="alert"
                        style={{
                          padding: '10px 14px',
                          background: 'var(--danger-100)',
                          color: 'var(--danger-500)',
                          borderRadius: 'var(--r-md)',
                          border: '1px solid rgba(184,84,80,0.28)',
                        }}
                      >
                        No pudimos cargar los horarios.
                      </Body>
                    )}
                    {!slotsQ.isLoading && !slotsQ.isError && slots.length === 0 && (
                      <Body style={{ color: 'var(--ink-500)' }}>
                        Sin horarios libres este día. Probá otro.
                      </Body>
                    )}
                    {slots.length > 0 && (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
                          gap: 10,
                        }}
                      >
                        {slots.map((t) => {
                          const sel = t === selectedSlot;
                          return (
                            <button
                              key={t}
                              onClick={() => setSelectedSlot(t)}
                              type="button"
                              aria-pressed={sel}
                              style={{ all: 'unset', cursor: 'pointer' }}
                            >
                              <div
                                className="wf-card"
                                style={{
                                  padding: '14px 8px',
                                  textAlign: 'center',
                                  background: sel ? 'var(--sage-500)' : '#fff',
                                  color: sel ? 'var(--bg)' : 'var(--ink-700)',
                                  borderColor: sel ? 'var(--sage-500)' : 'var(--line)',
                                }}
                              >
                                <H3 size={15} style={{ color: 'inherit' }}>
                                  {t}
                                </H3>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </Stack>
                )}
              </Stack>
            )}

            {step === 3 && (
              <Stack gap={16}>
                {FIELDS.map((f) => (
                  <Stack gap={6} key={f.key}>
                    <label style={labelStyle} htmlFor={`fld-${f.key}`}>
                      {f.label}
                    </label>
                    <input
                      id={`fld-${f.key}`}
                      type={f.type}
                      value={form[f.key]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      autoComplete={f.autoComplete}
                      required
                      style={inputStyle}
                    />
                  </Stack>
                ))}
                <Stack gap={6}>
                  <label style={labelStyle} htmlFor="fld-msg">
                    ¿Qué te trae a terapia? (opcional)
                  </label>
                  <textarea
                    id="fld-msg"
                    value={form.msg}
                    onChange={(e) => setForm({ ...form, msg: e.target.value })}
                    placeholder="Breve mensaje..."
                    style={{ ...inputStyle, minHeight: 96, resize: 'vertical' }}
                  />
                </Stack>
                <label
                  htmlFor="fld-consent"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    cursor: 'pointer',
                    paddingTop: 4,
                  }}
                >
                  <input
                    id="fld-consent"
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                    style={{
                      width: 18,
                      height: 18,
                      marginTop: 2,
                      accentColor: 'var(--sage-500)',
                      flexShrink: 0,
                    }}
                  />
                  <Body size={14} style={{ color: 'var(--ink-500)' }}>
                    Acepto el aviso de privacidad y consentimiento informado. Mis datos serán tratados
                    confidencialmente.
                  </Body>
                </label>
              </Stack>
            )}

            {submitError && step === 3 && (
              <div
                role="alert"
                style={{
                  marginTop: 24,
                  background: 'var(--danger-100)',
                  color: 'var(--danger-500)',
                  padding: '12px 16px',
                  borderRadius: 'var(--r-md)',
                  border: '1px solid rgba(184,84,80,0.28)',
                  fontSize: 14,
                }}
              >
                {submitError}
              </div>
            )}

            <div style={{ marginTop: 24 }}>
              <Btn
                type="submit"
                disabled={!canNext || submitting}
                style={{ opacity: !canNext || submitting ? 0.5 : 1 }}
              >
                {submitting
                  ? 'Procesando…'
                  : step === 3
                  ? 'Confirmar reserva'
                  : 'Continuar'}
              </Btn>
              {step === 3 && !isSupabaseConfigured && (
                <Meta style={{ display: 'block', marginTop: 10, color: 'var(--ink-300)' }}>
                  Modo demo: la reserva no se guarda en ningún lado.
                </Meta>
              )}
            </div>
          </form>

          <SummaryCard
            service={service}
            isoDate={step >= 2 ? selectedDate : null}
            slot={step >= 2 ? selectedSlot : null}
          />
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .reservar-grid {
            grid-template-columns: 1.4fr 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </section>
  );
}
