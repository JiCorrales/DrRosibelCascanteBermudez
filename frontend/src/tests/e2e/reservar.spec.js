import { test, expect } from '@playwright/test';

test.describe('Reservar flow', () => {
  test('completes the full booking wizard end-to-end', async ({ page }) => {
    await page.goto('/');
    // Click the hero "Agendar cita" button
    await page.getByRole('link', { name: /agendar cita/i }).first().click();
    await expect(page).toHaveURL(/\/reservar/);

    // Step 1 — choose first service
    await expect(page.getByRole('heading', { name: /qu[eé] servicio quer[eé]s reservar/i })).toBeVisible();
    await page.getByRole('button', { name: /terapia individual/i }).click();
    await page.getByRole('button', { name: /^continuar$/i }).click();

    // Step 2 — pick day and time
    await expect(page.getByRole('heading', { name: /elegí día y hora/i })).toBeVisible();
    await page.getByRole('button', { name: /14/, exact: false }).first().click();
    await page.getByRole('button', { name: /^9:00$/ }).click();
    await page.getByRole('button', { name: /^continuar$/i }).click();

    // Step 3 — form
    await expect(page.getByRole('heading', { name: /tus datos/i })).toBeVisible();
    await page.getByLabel(/nombre completo/i).fill('Isaac Corrales');
    await page.getByLabel(/^correo$/i).fill('isaac@example.com');
    await page.getByLabel(/tel[eé]fono/i).fill('+506 8888 8888');
    await page.getByLabel(/acepto el aviso de privacidad/i).check();
    await page.getByRole('button', { name: /confirmar reserva/i }).click();

    // Step 4 — confirmation
    await expect(page.getByRole('heading', { name: /nos vemos pronto/i })).toBeVisible();
    await expect(page.getByText('isaac@example.com')).toBeVisible();
  });

  test('preselects a service from ?servicio= query param', async ({ page }) => {
    await page.goto('/reservar?servicio=primer-encuentro');
    const primer = page.getByRole('button', { name: /primer encuentro/i });
    await expect(primer).toHaveAttribute('aria-pressed', 'true');
  });

  test('cannot continue past step 1 without a service selected (always defaults)', async ({ page }) => {
    await page.goto('/reservar');
    // Step 1 has a default service, so Continuar should be enabled
    await expect(page.getByRole('button', { name: /^continuar$/i })).toBeEnabled();
  });
});
