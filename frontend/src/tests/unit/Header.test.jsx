import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithRouter, screen, within } from '../test-utils.jsx';
import Header from '../../layout/Header.jsx';

describe('Header', () => {
  it('renders the primary nav links (desktop nav exists in DOM)', () => {
    renderWithRouter(<Header />);
    const nav = screen.getByRole('navigation', { name: /navegaci[oó]n principal/i });
    expect(within(nav).getByRole('link', { name: /inicio/i })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: /sobre m[ií]/i })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: /^servicios$/i })).toBeInTheDocument();
  });

  it('exposes the desktop "Agendar cita" CTA and adds a drawer CTA when opened', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Header />);

    // Closed drawer is aria-hidden, so only the desktop CTA is exposed.
    expect(screen.getAllByRole('link', { name: /agendar cita/i })).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: /abrir men[uú]/i }));
    expect(screen.getAllByRole('link', { name: /agendar cita/i }).length).toBeGreaterThanOrEqual(2);
  });

  it('opens and closes the mobile drawer via the menu button', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Header />);

    const menuBtn = screen.getByRole('button', { name: /abrir men[uú]/i });
    expect(menuBtn).toHaveAttribute('aria-expanded', 'false');

    await user.click(menuBtn);
    expect(menuBtn).toHaveAttribute('aria-expanded', 'true');

    const close = screen.getByRole('button', { name: /cerrar men[uú]/i });
    await user.click(close);
    expect(menuBtn).toHaveAttribute('aria-expanded', 'false');
  });

  it('marks the current route link as active', () => {
    renderWithRouter(<Header />, { route: '/servicios' });
    const nav = screen.getByRole('navigation', { name: /navegaci[oó]n principal/i });
    const link = within(nav).getByRole('link', { name: /^servicios$/i });
    expect(link).toHaveClass('active');
  });
});
