import React from 'react';
import Icon from './Icon.jsx';

const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const AVAIL = [12, 13, 14, 15, 19, 20, 21, 26, 27, 28];
const START_OFFSET = 4;
const TOTAL = 31;

export default function CalPicker({ day, setDay, monthLabel = 'Mayo 2026' }) {
  return (
    <div>
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
          {monthLabel}
        </div>
        <button
          type="button"
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
        {DAYS.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="wf-cal-grid">
        {Array.from({ length: START_OFFSET }).map((_, i) => (
          <div key={`pad${i}`} className="cell muted" />
        ))}
        {Array.from({ length: TOTAL }).map((_, i) => {
          const d = i + 1;
          const isAvail = AVAIL.includes(d);
          const isSel = d === day;
          let cls = 'cell';
          if (isSel) cls = 'cell sel';
          else if (isAvail) cls = 'cell avail';
          else cls = 'cell muted';
          return (
            <div
              key={d}
              className={cls}
              onClick={isAvail ? () => setDay(d) : undefined}
              role={isAvail ? 'button' : undefined}
              tabIndex={isAvail ? 0 : -1}
              aria-pressed={isAvail ? isSel : undefined}
              aria-label={isAvail ? `Día ${d}${isSel ? ', seleccionado' : ''}` : undefined}
              onKeyDown={
                isAvail
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setDay(d);
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
