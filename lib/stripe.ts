import Stripe from 'stripe';

export const STRIPE_PLAN_KEYS = ['solo', 'equipa', 'piloto'] as const;

export type StripePlanKey = (typeof STRIPE_PLAN_KEYS)[number];

export const STRIPE_DONATION_AMOUNTS = [5, 10, 20] as const;

export function getBaseUrl() {
  return process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
}

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY não configurada');
  }

  return new Stripe(secretKey);
}

export function getPlanPriceId(plan: StripePlanKey) {
  const priceMap: Record<StripePlanKey, string | undefined> = {
    solo: process.env.STRIPE_PRICE_SOLO,
    equipa: process.env.STRIPE_PRICE_EQUIPA,
    piloto: process.env.STRIPE_PRICE_PILOTO,
  };

  const priceId = priceMap[plan];

  if (!priceId) {
    throw new Error(`Preço Stripe em falta para o plano ${plan}`);
  }

  return priceId;
}

export function isStripePlanKey(value: string): value is StripePlanKey {
  return STRIPE_PLAN_KEYS.includes(value as StripePlanKey);
}

export function normalizeDonationAmount(value: unknown) {
  const amount = typeof value === 'number' ? value : Number(value);

  if (!Number.isFinite(amount)) {
    return null;
  }

  const rounded = Math.round(amount);

  if (rounded < 1 || rounded > 500) {
    return null;
  }

  return rounded;
}
