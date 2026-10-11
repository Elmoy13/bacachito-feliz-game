import { useState, useCallback } from 'react';
import { httpsCallable } from 'firebase/functions';
import { useAuth } from '@/context/AuthContext';
import { functions, trackEvent } from '@/lib/firebase';
import { PRICE_IDS, type PlanId } from '@/config/stripe';

interface CreateCheckoutSessionRequest {
  priceId: string;
  plan: PlanId;
  uid: string;
  email: string;
  successUrl: string;
  cancelUrl: string;
}

interface CreateCheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export const useCheckout = () => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = useCallback(
    async (plan: PlanId) => {
      if (!user || !isAuthenticated) {
        openAuthModal();
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const priceId = PRICE_IDS[plan];
        if (!priceId) throw new Error('Plan no válido');

        trackEvent('checkout_started', { plan, price_mxn: getPlanPrice(plan) });

        const createCheckoutSession = httpsCallable<
          CreateCheckoutSessionRequest,
          CreateCheckoutSessionResponse
        >(functions, 'createCheckoutSession');

        const { data } = await createCheckoutSession({
          priceId,
          plan,
          uid: user.uid,
          email: user.email ?? '',
          successUrl: window.location.origin + '/premium/success',
          cancelUrl: window.location.origin + '/premium/cancelled',
        });

        console.log('[Checkout] Stripe session created:', {
          sessionId: data.sessionId,
          url: data.url,
        });

        // Redirect to Stripe-hosted checkout
        window.location.href = data.url;
      } catch (err) {
        console.error('Checkout error:', err);
        setError((err as Error).message || 'Error al iniciar el pago');
        setLoading(false);
      }
    },
    [user, isAuthenticated, openAuthModal]
  );

  return { startCheckout, loading, error };
};

function getPlanPrice(plan: PlanId): number {
  const prices: Record<PlanId, number> = {
    daily: 19,
    weekly: 49,
    monthly: 79,
    quarterly: 179,
    yearly: 499,
    lifetime: 799,
  };
  return prices[plan];
}
