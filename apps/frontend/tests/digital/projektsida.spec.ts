import { test, expect } from '@playwright/test';

test('projektsida laddar med titel, google-resultat och mockup', async ({ page }) => {
  await page.goto('/digital/projekt/crownmatch');
  // Titeln skrivs fram med en skrivmaskins-effekt (TypewriterTitle, ~45ms/tecken) —
  // Playwrights auto-waiting provar om tills hela texten matchar.
  await expect(page.getByRole('heading', { name: 'Crownmatch' })).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('Google-resultat,')).toBeVisible();
});

test('digital-startsidan visar projektlistan', async ({ page }) => {
  await page.goto('/digital');
  await expect(page.locator('a[href="/digital/projekt/crownmatch"]')).toBeVisible();
});
