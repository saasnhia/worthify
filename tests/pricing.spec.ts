/**
 * Pricing page — public (no auth) and authenticated views.
 */
import { test, expect } from '@playwright/test'

test.describe('Pricing — page publique', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test('page /pricing se charge', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page).toHaveTitle(/tarif|prix|plan|FinSoft|FinPilote/i, { timeout: 15_000 })
  })

  test('les profils de plans sont affichés', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page.getByText(/cabinet/i).first()).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText(/indépendant|independant/i).first()).toBeVisible()
  })

  test('prix Cabinet Essentiel affiché (99€/mois)', async ({ page }) => {
    await page.goto('/pricing')
    // Default profile is Cabinet — should show 99€
    await expect(page.getByText(/99/)).toBeVisible({ timeout: 10_000 })
  })

  test('toggle profil Indépendant fonctionne', async ({ page }) => {
    await page.goto('/pricing')
    const indepBtn = page.getByRole('button', { name: /indépendant|independant/i })
    await expect(indepBtn.first()).toBeVisible({ timeout: 10_000 })
    await indepBtn.first().click()
    // After click, should show Starter plan
    await expect(page.getByText(/starter/i).first()).toBeVisible()
  })

  test('lien essai gratuit pointe vers /signup', async ({ page }) => {
    await page.goto('/pricing')
    const link = page.getByRole('link', { name: /essai|démarrer|gratuit/i }).first()
    await expect(link).toBeVisible({ timeout: 10_000 })
    const href = await link.getAttribute('href')
    expect(href).toMatch(/\/signup/)
  })
})

test.describe('Pricing — utilisateur connecté', () => {
  // Uses saved auth session from global setup

  test('lien essai cabinet pointe vers /signup avec plan', async ({ page }) => {
    await page.goto('/pricing')
    const link = page.getByRole('link', { name: /essai cabinet|cabinet.*30 jours/i }).first()
    await expect(link).toBeVisible({ timeout: 10_000 })
    const href = await link.getAttribute('href')
    expect(href).toMatch(/\/signup\?plan=CABINET/)
  })

  test('message subscription_required affiché si query param présent', async ({ page }) => {
    await page.goto('/pricing?message=subscription_required')
    // Should show some message about subscription being required
    await expect(
      page.getByText(/abonnement|subscription|requis|required/i)
    ).toBeVisible({ timeout: 10_000 })
  })
})
