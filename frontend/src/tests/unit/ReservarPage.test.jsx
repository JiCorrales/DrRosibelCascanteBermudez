import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithRouter, screen, waitFor } from '../test-utils.jsx';
import ReservarPage from '../../pages/ReservarPage.jsx';

describe('ReservarPage wizard', () => {
  it('renders step 1 by default with services list', () => {
    renderWithRouter(<ReservarPage />, { route: '/reservar' });
    expect(screen.getByRole('heading', { name: /qu[eé] servicio quer[eé]s reservar\?/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /terapia individual/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /primer encuentro/i })).toBeInTheDocument();
  });

  it('preselects a service from the ?servicio= query param', () => {
    renderWithRouter(<ReservarPage />, { route: '/reservar?servicio=primer-encuentro' });
    const primerEncuentroBtn = screen.getByRole('button', { name: /primer encuentro/i });
    expect(primerEncuentroBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('advances through all 4 steps and validates required form fields', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ReservarPage />, { route: '/reservar' });

    // Step 1: pick service and continue
    await user.click(screen.getByRole('button', { name: /terapia individual/i }));
    await user.click(screen.getByRole('button', { name: /continuar/i }));

    // Step 2: calendar — esperar a que los días disponibles se carguen,
    // tomar el primero disponible. En mock, son lun-vie a partir de hoy.
    expect(screen.getByRole('heading', { name: /elegí día y hora/i })).toBeInTheDocument();

    const dayBtn = await waitFor(() => {
      const days = screen.getAllByRole('button').filter((el) =>
        /^[a-zñáéíóú]+ \d+(, seleccionado)?$/i.test(el.getAttribute('aria-label') ?? '')
      );
      if (days.length === 0) throw new Error('no available days yet');
      return days[0];
    });
    await user.click(dayBtn);

    // Tomar el primer slot que aparezca
    const slot = await waitFor(() => {
      const buttons = screen.getAllByRole('button').filter((el) => /^\d{1,2}:\d{2}$/.test(el.textContent ?? ''));
      if (buttons.length === 0) throw new Error('no slots');
      return buttons[0];
    });
    await user.click(slot);

    await user.click(screen.getByRole('button', { name: /continuar/i }));

    // Step 3: form
    expect(screen.getByRole('heading', { name: /tus datos/i })).toBeInTheDocument();
    const submit = screen.getByRole('button', { name: /confirmar reserva/i });
    expect(submit).toBeDisabled();

    await user.type(screen.getByLabelText(/nombre completo/i), 'Isaac Corrales');
    await user.type(screen.getByLabelText(/^correo$/i), 'isaac@example.com');
    await user.type(screen.getByLabelText(/tel[eé]fono/i), '+506 8888 8888');
    await user.click(screen.getByLabelText(/acepto el aviso de privacidad/i));

    expect(submit).toBeEnabled();
    await user.click(submit);

    // Step 4: confirmation
    expect(await screen.findByRole('heading', { name: /nos vemos pronto/i })).toBeInTheDocument();
    expect(screen.getByText(/isaac@example\.com/i)).toBeInTheDocument();
  });

  it('lets the user go back from step 2 to step 1', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ReservarPage />, { route: '/reservar' });
    await user.click(screen.getByRole('button', { name: /continuar/i }));
    expect(screen.getByRole('heading', { name: /elegí día y hora/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^atrás$/i }));
    expect(screen.getByRole('heading', { name: /qu[eé] servicio quer[eé]s reservar\?/i })).toBeInTheDocument();
  });
});
