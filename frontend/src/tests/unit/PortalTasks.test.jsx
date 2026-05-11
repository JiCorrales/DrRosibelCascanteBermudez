import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithRouter, screen, waitFor } from '../test-utils.jsx';
import PortalTasks from '../../portal/pages/PortalTasks.jsx';
import { PORTAL_TASKS } from '../../mock/admin-data.js';

describe('PortalTasks', () => {
  it('shows active tasks by default', async () => {
    renderWithRouter(<PortalTasks />);
    const active = PORTAL_TASKS.filter((t) => t.status !== 'done');
    // La query es async — esperar al primer título
    await waitFor(() => expect(screen.getByText(active[0].title)).toBeInTheDocument());
    active.forEach((t) => {
      expect(screen.getByText(t.title)).toBeInTheDocument();
    });
  });

  it('switches to completed tab', async () => {
    const user = userEvent.setup();
    renderWithRouter(<PortalTasks />);

    // Esperar al primer render con datos
    const firstActive = PORTAL_TASKS.find((t) => t.status !== 'done');
    if (firstActive) {
      await waitFor(() => expect(screen.getByText(firstActive.title)).toBeInTheDocument());
    }

    await user.click(screen.getByRole('tab', { name: /completadas/i }));

    const done = PORTAL_TASKS.filter((t) => t.status === 'done');
    if (done.length > 0) {
      await waitFor(() => expect(screen.getByText(done[0].title)).toBeInTheDocument());
      done.forEach((t) => {
        expect(screen.getByText(t.title)).toBeInTheDocument();
      });
    }
    const active = PORTAL_TASKS.filter((t) => t.status !== 'done');
    active.forEach((t) => {
      expect(screen.queryByText(t.title)).not.toBeInTheDocument();
    });
  });
});
