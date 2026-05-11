import { test, expect } from '@playwright/test';

async function navigateTo(page, linkRegex) {
  // On mobile the desktop nav is hidden — open the drawer first.
  const burger = page.getByRole('button', { name: /abrir men[uú]/i });
  if (await burger.isVisible()) {
    await burger.click();
  }
  await page.getByRole('link', { name: linkRegex }).first().click();
}

test.describe('Landing page', () => {
  test('renders all major sections and key copy', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Rosibel Cascante/i);
    await expect(page.getByRole('heading', { level: 1, name: /volver a vos/i })).toBeVisible();

    await expect(page.getByRole('heading', { name: /hola otra vez/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /tres principios/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /lo que ofrezco/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /9 razones/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /lo que dicen/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /lo que la gente/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /primer paso/i })).toBeVisible();
  });

  test('navigates to /sobre via header (desktop nav or mobile drawer)', async ({ page }) => {
    await page.goto('/');
    await navigateTo(page, /sobre m[ií]/i);
    await expect(page).toHaveURL(/\/sobre$/);
    await expect(page.getByRole('heading', { level: 1, name: /rosibel cascante/i })).toBeVisible();
  });

  test('toggles a FAQ entry on click', async ({ page }) => {
    await page.goto('/');
    const faq2 = page.getByRole('button', { name: /atend[eé]s en l[ií]nea/i });
    await expect(faq2).toHaveAttribute('aria-expanded', 'false');
    await faq2.click();
    await expect(faq2).toHaveAttribute('aria-expanded', 'true');
  });
});
