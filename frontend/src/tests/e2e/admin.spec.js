import { test, expect } from '@playwright/test';

test.describe('Admin', () => {
  test.beforeEach(async ({ context }) => {
    // Limpia cualquier sesión previa que persista entre tests.
    await context.clearCookies();
    await context.addInitScript(() => {
      try {
        localStorage.clear();
      } catch {}
    });
  });

  test('redirects to /admin/login when unauthenticated', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login$/);
    await expect(page.getByRole('heading', { name: /iniciar sesi[oó]n/i })).toBeVisible();
  });

  test('login flow opens the dashboard with KPIs and today\'s agenda', async ({ page }) => {
    await page.goto('/admin/login');
    await page.getByRole('button', { name: /entrar/i }).click();

    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByRole('heading', { name: /buenos d[ií]as, rosibel/i })).toBeVisible();
    await expect(page.getByText(/citas hoy/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: /agenda de hoy/i })).toBeVisible();
  });

  test('navigates from dashboard to calendar via sidebar', async ({ page }) => {
    await page.goto('/admin/login');
    await page.getByRole('button', { name: /entrar/i }).click();

    await page.getByRole('link', { name: /calendario/i }).first().click();
    await expect(page).toHaveURL(/\/admin\/calendario$/);
    await expect(page.getByRole('heading', { name: /^calendario$/i })).toBeVisible();
  });

  test('filters appointments by status and updates the URL', async ({ page }) => {
    await page.goto('/admin/login');
    await page.getByRole('button', { name: /entrar/i }).click();

    await page.getByRole('link', { name: /citas/i }).first().click();
    await page.getByRole('tab', { name: /^pendientes$/i }).click();

    await expect(page).toHaveURL(/estado=pending/);
  });

  // El bloque "cerrar sesión" del sidebar admin sólo es visible en desktop —
  // el admin está pensado para uso desde laptop, según el handoff §11.
  test('sign out returns to the login page', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Admin sidebar user block is hidden on mobile viewport by design.');
    await page.goto('/admin/login');
    await page.getByRole('button', { name: /entrar/i }).click();

    await page.getByRole('button', { name: /cerrar sesi[oó]n/i }).click();
    await expect(page).toHaveURL(/\/admin\/login$/);
  });
});
