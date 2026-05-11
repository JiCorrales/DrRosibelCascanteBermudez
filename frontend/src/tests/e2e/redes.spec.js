import { test, expect } from '@playwright/test';

test.describe('Admin · Redes', () => {
  test.beforeEach(async ({ context, page }) => {
    await context.clearCookies();
    // Limpiar storage UNA VEZ al inicio. No usar addInitScript porque corre
    // en cada navegación y borra la sesión recién creada.
    await page.goto('/');
    await page.evaluate(() => {
      try { localStorage.clear(); } catch {}
    });
  });

  async function login(page) {
    await page.goto('/admin/login');
    await page.getByLabel(/correo/i).fill('rosibel@test.cr');
    await page.getByLabel(/contrase/i).fill('demo1234');
    await page.getByRole('button', { name: /entrar/i }).click();
    await expect(page).toHaveURL(/\/admin$/);
  }

  test('el sidebar muestra Redes y abre el dashboard', async ({ page, isMobile }) => {
    await login(page);
    if (isMobile) {
      await page.getByRole('button', { name: /abrir men[uú]/i }).click();
    }
    await page.getByRole('link', { name: /^redes$/i }).first().click();
    await expect(page).toHaveURL(/\/admin\/redes$/);
    await expect(page.getByRole('heading', { name: /^redes$/i })).toBeVisible();
    await expect(page.getByText(/calendario editorial/i)).toBeVisible();
  });

  test('crear un post desde el editor genera caption y guarda borrador', async ({ page }) => {
    await login(page);
    await page.goto('/admin/redes/nuevo');
    // Esperar al chunk lazy
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByRole('heading', { name: /nuevo post/i })).toBeVisible();

    // El caption se llena solo al cargar
    const captionArea = page.locator('textarea').last();
    await expect(captionArea).not.toHaveValue('');

    const firstCaption = await captionArea.inputValue();

    // Cambiar ángulo a "Pregunta abierta" (puede colidir con la plantilla visual
    // del mismo nombre, así que tomamos el primero — el chip de ángulos aparece
    // antes en el DOM que el de plantillas).
    await page.getByRole('button', { name: /pregunta abierta/i }).first().click();
    // Esperar a que regenere
    await expect(captionArea).not.toHaveValue(firstCaption, { timeout: 3000 });

    // Guardar borrador
    await page.getByRole('button', { name: /guardar borrador/i }).click();
    await expect(page.getByRole('button', { name: /✓ guardado/i })).toBeVisible();
  });

  test('el banco de temas filtra por categoría', async ({ page }) => {
    await login(page);
    await page.goto('/admin/redes/temas');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByRole('heading', { name: /banco de temas/i })).toBeVisible();

    // Hay 4 temas de parejas en el banco
    await page.getByRole('button', { name: /^parejas$/i }).first().click();
    const cards = page.locator('.redes-topic-card');
    await expect(cards).toHaveCount(4);
  });

  test('la biblioteca refleja los borradores guardados', async ({ page }) => {
    await login(page);

    // Crear un post primero
    await page.goto('/admin/redes/nuevo');
    await page.waitForLoadState('domcontentloaded');
    await page.getByRole('button', { name: /guardar borrador/i }).click();
    await expect(page.getByRole('button', { name: /✓ guardado/i })).toBeVisible();

    // Ir a biblioteca
    await page.goto('/admin/redes/biblioteca');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText(/1 post en total/i)).toBeVisible();

    // El item aparece
    await expect(page.locator('.redes-library__item')).toHaveCount(1);
  });
});
