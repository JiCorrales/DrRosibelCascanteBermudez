import { test, expect } from '@playwright/test';

test.describe('Portal paciente', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
    await context.addInitScript(() => {
      try {
        localStorage.clear();
      } catch {}
    });
  });

  test('redirects to /portal/login when unauthenticated', async ({ page }) => {
    await page.goto('/portal');
    await expect(page).toHaveURL(/\/portal\/login$/);
    await expect(page.getByRole('heading', { name: /bienvenida/i })).toBeVisible();
  });

  test('logs in and lands on the home with next appointment', async ({ page }) => {
    await page.goto('/portal/login');
    await page.getByRole('button', { name: /entrar/i }).click();

    await expect(page).toHaveURL(/\/portal$/);
    await expect(page.getByText(/próxima cita/i)).toBeVisible();
  });

  test('switches between tabs via bottom tabbar', async ({ page }) => {
    await page.goto('/portal/login');
    await page.getByRole('button', { name: /entrar/i }).click();

    const tabbar = page.getByRole('navigation', { name: /portal/i });
    await tabbar.getByRole('link', { name: /tareas/i }).click();
    await expect(page).toHaveURL(/\/portal\/tareas$/);
    await expect(page.getByRole('heading', { name: /mis tareas/i })).toBeVisible();

    await tabbar.getByRole('link', { name: /citas/i }).click();
    await expect(page).toHaveURL(/\/portal\/citas$/);
    await expect(page.getByRole('heading', { name: /mis citas/i })).toBeVisible();

    await tabbar.getByRole('link', { name: /docs/i }).click();
    await expect(page).toHaveURL(/\/portal\/documentos$/);
    await expect(page.getByRole('heading', { name: /^documentos$/i })).toBeVisible();
  });
});
