import { describe, it, expect } from 'vitest';
import {
  weekOccupancy,
  getContentSuggestions,
  getWeekSummary,
  getToday,
  _internals,
} from '../../admin/content/occupancy.js';

describe('occupancy helpers', () => {
  it('mondayOf devuelve el lunes correcto para cualquier día de la semana', () => {
    const { mondayOf } = _internals;
    const wednesday = new Date(2026, 4, 13); // miércoles 13 may 2026
    const monday = mondayOf(wednesday);
    expect(monday.getDay()).toBe(1); // lunes
    expect(monday.getDate()).toBe(11);
  });

  it('dayCapacityFromRange interpreta correctamente "9:00 — 17:00"', () => {
    const { dayCapacityFromRange } = _internals;
    expect(dayCapacityFromRange('9:00 — 17:00')).toBe(7); // 480 / 65 ≈ 7
    expect(dayCapacityFromRange('9:00 — 13:00')).toBe(4); // 240 / 65 ≈ 4
    expect(dayCapacityFromRange('Cerrado')).toBe(0);
    expect(dayCapacityFromRange('')).toBe(0);
  });
});

describe('weekOccupancy', () => {
  it('devuelve 7 días', () => {
    const days = weekOccupancy(getToday());
    expect(days).toHaveLength(7);
  });

  it('marca sábado y domingo como closed', () => {
    const days = weekOccupancy(getToday());
    const sat = days.find((d) => d.weekdayName === 'Sábado');
    const sun = days.find((d) => d.weekdayName === 'Domingo');
    expect(sat.level).toBe('closed');
    expect(sun.level).toBe('closed');
  });

  it('cada día trabajable tiene capacity > 0', () => {
    const days = weekOccupancy(getToday());
    days
      .filter((d) => d.isWorkingDay)
      .forEach((d) => expect(d.capacity).toBeGreaterThan(0));
  });
});

describe('getContentSuggestions', () => {
  it('devuelve al menos una sugerencia', () => {
    const suggestions = getContentSuggestions();
    expect(suggestions.length).toBeGreaterThan(0);
    suggestions.forEach((s) => {
      expect(s.title).toBeTruthy();
      expect(s.body).toBeTruthy();
      expect(['warn', 'info', 'good']).toContain(s.tone);
    });
  });
});

describe('getWeekSummary', () => {
  it('totalBooked nunca supera totalCap', () => {
    const summary = getWeekSummary();
    expect(summary.totalBooked).toBeLessThanOrEqual(summary.totalCap);
    expect(summary.ratio).toBeGreaterThanOrEqual(0);
    expect(summary.ratio).toBeLessThanOrEqual(1);
  });
});
