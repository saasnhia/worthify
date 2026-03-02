export interface PlanConfig {
  monthly: string | undefined
  annual: string | undefined
  trial_days: number
  max_users: number
  price_monthly: number
  price_annual: number
  max_docs?: number
}

export const PLANS: Record<string, PlanConfig> = {
  STARTER: {
    monthly: process.env.STRIPE_STARTER_MONTHLY_ID,
    annual:  process.env.STRIPE_STARTER_ANNUAL_ID,
    trial_days:    0,
    max_users:     1,
    max_docs:      30,
    price_monthly: 0,
    price_annual:  0,
  },
  PRO_INDEPENDANT: {
    monthly: process.env.STRIPE_PRO_INDEP_MONTHLY_ID,
    annual:  process.env.STRIPE_PRO_INDEP_ANNUAL_ID,
    trial_days:    30,
    max_users:     1,
    price_monthly: 29,
    price_annual:  290,
  },
  PRO_TPE: {
    monthly: process.env.STRIPE_PRO_TPE_MONTHLY_ID,
    annual:  process.env.STRIPE_PRO_TPE_ANNUAL_ID,
    trial_days:    14,
    max_users:     5,
    price_monthly: 49,
    price_annual:  490,
  },
  PRO_PME: {
    monthly: process.env.STRIPE_PRO_PME_MONTHLY_ID,
    annual:  process.env.STRIPE_PRO_PME_ANNUAL_ID,
    trial_days:    14,
    max_users:     15,
    price_monthly: 99,
    price_annual:  990,
  },
  PREMIUM_INDEPENDANT: {
    monthly: process.env.STRIPE_PREMIUM_INDEP_MONTHLY_ID,
    annual:  process.env.STRIPE_PREMIUM_INDEP_ANNUAL_ID,
    trial_days:    30,
    max_users:     1,
    price_monthly: 59,
    price_annual:  590,
  },
  PREMIUM_TPE: {
    monthly: process.env.STRIPE_PREMIUM_TPE_MONTHLY_ID,
    annual:  process.env.STRIPE_PREMIUM_TPE_ANNUAL_ID,
    trial_days:    14,
    max_users:     5,
    price_monthly: 99,
    price_annual:  990,
  },
  PREMIUM_PME: {
    monthly: process.env.STRIPE_PREMIUM_PME_MONTHLY_ID,
    annual:  process.env.STRIPE_PREMIUM_PME_ANNUAL_ID,
    trial_days:    14,
    max_users:     15,
    price_monthly: 179,
    price_annual:  1790,
  },
  CABINET_PRO: {
    monthly: process.env.STRIPE_CABINET_PRO_MONTHLY_ID,
    annual:  process.env.STRIPE_CABINET_PRO_ANNUAL_ID,
    trial_days:    30,
    max_users:     4,
    price_monthly: 99,
    price_annual:  990,
  },
  CABINET_PREMIUM: {
    monthly: process.env.STRIPE_CABINET_PREMIUM_MONTHLY_ID,
    annual:  process.env.STRIPE_CABINET_PREMIUM_ANNUAL_ID,
    trial_days:    30,
    max_users:     4,
    price_monthly: 179,
    price_annual:  1790,
  },
}

/**
 * Maps a Stripe plan key (new or legacy) to the user_profiles.plan value.
 * Handles both new keys (PRO_INDEPENDANT, CABINET_PRO, …) and legacy keys (pro, cabinet, starter).
 */
export function mapPlanKeyToProfilePlan(planKey: string): 'starter' | 'cabinet' | 'pro' {
  const k = planKey.toLowerCase()
  if (k === 'starter') return 'starter'
  if (k === 'cabinet' || k.startsWith('cabinet_')) return 'cabinet'
  return 'pro'
}
