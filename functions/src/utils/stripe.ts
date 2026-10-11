import Stripe from 'stripe';
import { defineSecret } from 'firebase-functions/params';

export const stripeSecretKey = defineSecret('STRIPE_SECRET_KEY');
export const stripeWebhookSecret = defineSecret('STRIPE_WEBHOOK_SECRET');

let stripeInstance: Stripe | null = null;

export const getStripe = (): Stripe => {
  if (!stripeInstance) {
    stripeInstance = new Stripe(stripeSecretKey.value(), {
      apiVersion: '2023-10-16',
    });
  }
  return stripeInstance;
};

export type PremiumPlan = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'lifetime';

export const PLAN_MODE: Record<PremiumPlan, 'payment' | 'subscription'> = {
  daily: 'payment',
  weekly: 'payment',
  monthly: 'subscription',
  quarterly: 'subscription',
  yearly: 'subscription',
  lifetime: 'payment',
};

export const getPlanFromPriceId = (priceId: string, envPrices: Record<string, string>): PremiumPlan | null => {
  for (const [plan, id] of Object.entries(envPrices)) {
    if (id === priceId) return plan as PremiumPlan;
  }
  return null;
};
