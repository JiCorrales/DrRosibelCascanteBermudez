import React from 'react';
import Icon from './Icon.jsx';

const DAYS_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

// Calcula cuántos slots ciegos hay antes del día 1 (con lunes como inicio).
function paddingForMonth(year, month) {
  // weekday: 0=Dom..6=Sáb. Queremos lunes como col 1.
  const firstWeekday = new Date(year, month, 1).getDay();
  return firstWeekday === 0 ? 6 : firstWeekday - 1;
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export default function CalPicker({
  year,
  month, // 0-indexed
  selectedISODate, // 'YYYY-MM-DD' o null
  availableDates, // Set<string> de 'YYYY-MM-DD'
  onSelectDate, // fn(isoDate)
  onPrev,
  onNext,
  loading = false,
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const total = daysInMonth(year, month);
  const padStart = paddingForMonth(year, month);

  const pad2 = (n) => String(n).padStart(2, '0');
  const dateString = (d) => `${year}-${pad2(month + 1)}-${pad2(d)}`;

  return (
    <div aria-busy={loading || undefined}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <button
          type="button"
          onClick={onPrev}
          aria-label="Mes anterior"
          style={{
            background: 'transparent',
            border: 0,
            padding: 6,
            cursor: 'pointer',
            color: 'var(--ink-500)',
          }}
        >
          <Icon name="back" size={16} />
        </button>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 18, color: 'var(--ink-900)' }}>
          {MONTHS[month]} {year}
        </div>
        <button
          type="button"
          onClick={onNext}
          aria-label="Mes siguiente"
          style={{
            background: 'transparent',
            border: 0,
            padding: 6,
            cursor: 'pointer',
            color: 'var(--ink-500)',
            transform: 'rotate(180deg)',
          }}
        >
          <Icon name="back" size={16} />
        </button>
      </div>
      <div className="wf-cal-head">
        {DAYS_LABELS.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="wf-cal-grid" style={{ fontSize: 11, opacity: loading ? 0.6 : 1 }}>
        {Array.from({ length: padStart }).map((_, i) => (
          <div key={`pad${i}`} className="cell muted" />
        ))}
        {Array.from({ length: total }).map((_, i) => {
          const d = i + 1;
          const iso = dateString(d);
          const dateObj = new Date(year, month, d);
          const isPast = dateObj < today;
          const isAvail = !isPast && availableDates?.has?.(iso);
          const isSel = iso === selectedISODate;
          let cls = 'cell';
          if (isSel) cls = 'cell sel';
          else if (isAvail) cls = 'cell avail';
          else cls = 'cell muted';
          return (
            <div
              key={d}
              className={cls}
              onClick={isAvail ? () => onSelectDate(iso) : undefined}
              role={isAvail ? 'button' : undefined}
              tabIndex={isAvail ? 0 : -1}
              aria-pressed={isAvail ? isSel : undefined}
              aria-label={
                isAvail
                  ? `${MONTHS[month]} ${d}${isSel ? ', seleccionado' : ''}`
                  : `${MONTHS[month]} ${d}, no disponible`
              }
              onKeyDown={
                isAvail
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectDate(iso);
                      }
                    }
                  : undefined
              }
              style={{ cursor: isAvail ? 'pointer' : 'default' }}
            >
              {d}
            </div>
          );
        })}
      </div>
    </div>
  );
}
