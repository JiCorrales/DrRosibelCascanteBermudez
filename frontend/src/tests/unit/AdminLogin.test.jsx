import { describe, it, expect, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithRouter, screen, waitFor } from '../test-utils.jsx';
import AdminLogin from '../../admin/pages/AdminLogin.jsx';

describe('AdminLogin (mock auth)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the login form with empty fields', () => {
    renderWithRouter(<AdminLogin />, { route: '/admin/login' });
    expect(screen.getByRole('heading', { name: /iniciar sesi[oó]n/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/correo/i)).toHaveValue('');
    expect(screen.getByLabelText(/contrase[ñn]a/i)).toBeInTheDocument();
  });

  it('writes an admin session to localStorage on submit', async () => {
    const user = userEvent.setup();
    renderWithRouter(<AdminLogin />, { route: '/admin/login' });

    await user.type(screen.getByLabelText(/correo/i), 'demo@example.com');
    await user.type(screen.getByLabelText(/contrase[ñn]a/i), 'demo1234');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      const raw = localStorage.getItem('rosibel:mock-session');
      expect(raw).toBeTruthy();
      expect(JSON.parse(raw).role).toBe('admin');
    });
  });

  it('disables the button while submitting', async () => {
    const user = userEvent.setup();
    renderWithRouter(<AdminLogin />, { route: '/admin/login' });

    await user.type(screen.getByLabelText(/correo/i), 'demo@example.com');
    await user.type(screen.getByLabelText(/contrase[ñn]a/i), 'demo1234');
    const btn = screen.getByRole('button', { name: /entrar/i });
    await user.click(btn);
    expect(btn).toBeDisabled();
  });
});
