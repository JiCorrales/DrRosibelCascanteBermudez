import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithRouter, screen } from '../test-utils.jsx';
import PortalTasks from '../../portal/pages/PortalTasks.jsx';
import { PORTAL_TASKS } from '../../mock/admin-data.js';

describe('PortalTasks', () => {
  it('shows active tasks by default', () => {
    renderWithRouter(<PortalTasks />);
    const active = PORTAL_TASKS.filter((t) => t.status !== 'done');
    active.forEach((t) => {
      expect(screen.getByText(t.title)).toBeInTheDocument();
    });
  });

  it('switches to completed tab', async () => {
    const user = userEvent.setup();
    renderWithRouter(<PortalTasks />);

    await user.click(screen.getByRole('tab', { name: /completadas/i }));

    const done = PORTAL_TASKS.filter((t) => t.status === 'done');
    if (done.length > 0) {
      done.forEach((t) => {
        expect(screen.getByText(t.title)).toBeInTheDocument();
      });
    }
    // Active tasks should not appear in this tab
    const active = PORTAL_TASKS.filter((t) => t.status !== 'done');
    active.forEach((t) => {
      expect(screen.queryByText(t.title)).not.toBeInTheDocument();
    });
  });
});
