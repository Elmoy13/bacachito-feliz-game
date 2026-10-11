import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { getStripe, stripeSecretKey, PLAN_MODE, type PremiumPlan } from './utils/stripe';
import { getStripeCustomerId, saveStripeCustomerId } from './utils/firestore';

if (!admin.apps.length) {
  admin.initializeApp();
}

export const createCheckoutSession = onCall(
  {
    secrets: [stripeSecretKey],
    region: 'us-central1',
  },
  async (request) => {
    // Verify authentication
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Debes iniciar sesión');
    }

    const { priceId, plan, uid, email, successUrl, cancelUrl } = request.data as {
      priceId: string;
      plan: string;
      uid: string;
      email: string;
      successUrl: string;
      cancelUrl: string;
    };

    if (!priceId || !plan || !uid || !successUrl || !cancelUrl) {
      throw new HttpsError('invalid-argument', 'Faltan parámetros requeridos');
    }

    // Verify the caller is who they say they are
    if (request.auth.uid !== uid) {
      throw new HttpsError('permission-denied', 'UID no coincide');
    }

    const stripe = getStripe();

    // Find or create Stripe Customer
    let customerId = await getStripeCustomerId(uid);

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: email || undefined,
        metadata: { firebaseUid: uid },
      });
      customerId = customer.id;
      await saveStripeCustomerId(uid, customerId);
    }

    // Determine mode from plan name
    const premiumPlan = (PLAN_MODE[plan as PremiumPlan] ? plan : null) as PremiumPlan | null;
    const mode = premiumPlan ? PLAN_MODE[premiumPlan] : 'payment';

    // Build session params
    const sessionParams: any = {
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode,
      success_url: successUrl + '?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: cancelUrl,
      locale: 'es',
      metadata: {
        firebaseUid: uid,
        plan: premiumPlan || 'unknown',
      },
      allow_promotion_codes: true,
    };

    if (mode === 'payment') {
      sessionParams.payment_intent_data = {
        metadata: { firebaseUid: uid, plan: premiumPlan || 'unknown' },
      };
    } else {
      sessionParams.subscription_data = {
        metadata: { firebaseUid: uid, plan: premiumPlan || 'unknown' },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return { sessionId: session.id, url: session.url };
  },
);


