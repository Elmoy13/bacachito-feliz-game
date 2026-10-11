import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { getStripe, stripeSecretKey } from './utils/stripe';
import { getStripeCustomerId } from './utils/firestore';

if (!admin.apps.length) {
  admin.initializeApp();
}

export const createPortalSession = onCall(
  {
    secrets: [stripeSecretKey],
    region: 'us-central1',
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Debes iniciar sesión');
    }

    const { uid, returnUrl } = request.data as {
      uid: string;
      returnUrl: string;
    };

    if (!uid || !returnUrl) {
      throw new HttpsError('invalid-argument', 'Faltan parámetros');
    }

    if (request.auth.uid !== uid) {
      throw new HttpsError('permission-denied', 'UID no coincide');
    }

    const stripe = getStripe();
    const customerId = await getStripeCustomerId(uid);

    if (!customerId) {
      throw new HttpsError('not-found', 'No se encontró el cliente de Stripe');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return { url: session.url };
  },
);
