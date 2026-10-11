// Stripe price IDs come from the build environment (.env):
// VITE_PRICE_DAILY, VITE_PRICE_WEEKLY, VITE_PRICE_MONTHLY,
// VITE_PRICE_QUARTERLY, VITE_PRICE_YEARLY, VITE_PRICE_LIFETIME
// (VITE_STRIPE_PUBLISHABLE_KEY is also expected in the env, but checkout
// redirects to the Stripe-hosted session URL, so it is not read here.)
const env = import.meta.env;

export type PlanId = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'lifetime';

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  currency: 'MXN';
  priceId: string;
  mode: 'payment' | 'subscription';
  description: string;
  badge?: string;
  popular?: boolean;
}

export const PRICE_IDS: Record<PlanId, string> = {
  daily: env.VITE_PRICE_DAILY,
  weekly: env.VITE_PRICE_WEEKLY,
  monthly: env.VITE_PRICE_MONTHLY,
  quarterly: env.VITE_PRICE_QUARTERLY,
  yearly: env.VITE_PRICE_YEARLY,
  lifetime: env.VITE_PRICE_LIFETIME,
};

export const PLANS: Plan[] = [
  {
    id: 'daily',
    name: '1 Día',
    price: 19,
    currency: 'MXN',
    priceId: PRICE_IDS.daily,
    mode: 'payment',
    description: 'Acceso por tiempo limitado',
  },
  {
    id: 'weekly',
    name: '1 Semana',
    price: 49,
    currency: 'MXN',
    priceId: PRICE_IDS.weekly,
    mode: 'payment',
    description: 'Acceso por tiempo limitado',
  },
  {
    id: 'monthly',
    name: '1 Mes',
    price: 79,
    currency: 'MXN',
    priceId: PRICE_IDS.monthly,
    mode: 'subscription',
    description: 'Cancela cuando quieras',
  },
  {
    id: 'quarterly',
    name: '3 Meses',
    price: 179,
    currency: 'MXN',
    priceId: PRICE_IDS.quarterly,
    mode: 'subscription',
    description: 'Cancela cuando quieras',
  },
  {
    id: 'yearly',
    name: '1 Año',
    price: 499,
    currency: 'MXN',
    priceId: PRICE_IDS.yearly,
    mode: 'subscription',
    description: 'Cancela cuando quieras',
    badge: 'POPULAR',
    popular: true,
  },
  {
    id: 'lifetime',
    name: 'De por vida',
    price: 799,
    currency: 'MXN',
    priceId: PRICE_IDS.lifetime,
    mode: 'payment',
    description: 'Un solo pago, tuyo para siempre',
    badge: '🔥 PARA SIEMPRE',
  },
];
