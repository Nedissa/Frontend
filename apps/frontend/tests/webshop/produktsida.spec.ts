import { test, expect } from '@playwright/test';

// Regressionstest för buggen 2026-09: fel NEXT_PUBLIC_APP_URL-port gjorde att
// produktsidor gav 404 trots att produkten fanns i Medusa.
test('produktsida laddar och visar produktnamn', async ({ page }) => {
  await page.goto('/produkter/nvidia-grafikkort');
  await expect(page.getByRole('heading', { name: 'NVIDIA GRAFIKKORT' })).toBeVisible();
});

test('lägg i varukorg fungerar från produktsida', async ({ page }) => {
  await page.goto('/produkter/nvidia-grafikkort');
  await page.getByRole('button', { name: /lägg i varukorg/i }).click();
  // Röd badge med antal visas i header-varukorgsikonen så fort en vara lagts till.
  // Desktop- och mobilheadern renderar var sin badge samtidigt (CSS visar bara en åt gången).
  await expect(page.getByText('1', { exact: true }).locator('visible=true').first()).toBeVisible();
});
