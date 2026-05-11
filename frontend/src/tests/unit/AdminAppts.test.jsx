import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithRouter, screen, within, waitFor } from '../test-utils.jsx';
import AdminAppts from '../../admin/pages/AdminAppts.jsx';
import { APPOINTMENTS, findClient } from '../../mock/admin-data.js';

describe('AdminAppts', () => {
  it('lists all appointments by default', async () => {
    renderWithRouter(<AdminAppts />, { route: '/admin/citas' });
    expect(screen.getByRole('heading', { name: /^citas$/i })).toBeInTheDocument();
    // Las queries son async (TanStack Query) — esperamos al render del conteo
    expect(
      await screen.findByText(`${APPOINTMENTS.length} resultados`)
    ).toBeInTheDocument();
  });

  it('filters by status tab "Pendientes" and reflects count', async () => {
    const user = userEvent.setup();
    renderWithRouter(<AdminAppts />, { route: '/admin/citas' });

    const expectedPending = APPOINTMENTS.filter((a) => a.status === 'pending').length;
    const expectedText = `${expectedPending} resultado${expectedPending !== 1 ? 's' : ''}`;

    await user.click(screen.getByRole('tab', { name: /^pendientes$/i }));

    expect(await screen.findByText(expectedText)).toBeInTheDocument();

    // Cuando el filtro está en pending, todas las filas visibles tienen status "Pendiente"
    await waitFor(() => {
      const rows = screen.getAllByRole('link');
      rows.forEach((row) => {
        const status = within(row).queryByText(/pendiente/i);
        expect(status).toBeInTheDocument();
      });
    });
  });

  it('search input filters by client name', async () => {
    const user = userEvent.setup();
    renderWithRouter(<AdminAppts />, { route: '/admin/citas' });

    const firstClientName = findClient(APPOINTMENTS[0].clientId).name;
    const firstName = firstClientName.split(' ')[0];

    // Esperar a que la query inicial cargue
    await screen.findByText(/resultados$/);

    await user.type(screen.getByRole('searchbox'), firstName);

    await waitFor(() => {
      const rows = screen.getAllByRole('link');
      expect(rows.length).toBeGreaterThan(0);
      rows.forEach((row) => {
        expect(within(row).getByText(new RegExp(firstName, 'i'))).toBeInTheDocument();
      });
    });
  });

  it('reads ?estado= query param to set initial filter', () => {
    renderWithRouter(<AdminAppts />, { route: '/admin/citas?estado=completed' });
    const completedTab = screen.getByRole('tab', { name: /^completadas$/i });
    expect(completedTab).toHaveAttribute('aria-selected', 'true');
  });
});
