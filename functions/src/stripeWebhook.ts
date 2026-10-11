import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';
import { stripeSecretKey, stripeWebhookSecret, type PremiumPlan } from './utils/stripe';
import {
  activatePremium,
  updateSubscriptionStatus,
  updateSubscriptionExpiry,
  findUidByStripeCustomer,
} from './utils/firestore';

if (!admin.apps.length) {
  admin.initializeApp();
}

export const stripeWebhook = onRequest(
  {
    secrets: [stripeSecretKey, stripeWebhookSecret],
    region: 'us-central1',
  },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    const stripe = new Stripe(stripeSecretKey.value(), {
      apiVersion: '2023-10-16',
    });

    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        stripeWebhookSecret.value(),
      );
    } catch (err: any) {
      console.error('[Webhook] Signature verification failed:', err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    console.log(`[Webhook] Received event: ${event.type}, id: ${event.id}`);

    // CRITICAL: Process the event BEFORE responding.
    // In Cloud Functions, the runtime can terminate after res.send(),
    // so Firestore writes must complete before we respond.
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session, stripe);
          break;

        case 'checkout.session.async_payment_succeeded':
          await handleAsyncPaymentSucceeded(event.data.object as Stripe.Checkout.Session, stripe);
          break;

        case 'checkout.session.async_payment_failed':
          console.log('[Webhook] Async payment failed (OXXO/transfer expired):', event.data.object);
          break;

        case 'invoice.payment_succeeded':
          await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;

        case 'invoice.payment_failed':
          await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
          break;

        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;

        default:
          console.log('[Webhook] Unhandled event type:', event.type);
      }

      res.status(200).json({ received: true });
    } catch (err) {
      console.error('[Webhook] Error processing event:', event.type, err);
      // Still respond 200 so Stripe doesn't retry indefinitely
      res.status(200).json({ received: true, error: 'processing_failed' });
    }
  },
);

async function handleCheckoutCompleted(session: Stripe.Checkout.Session, stripe: Stripe) {
  console.log('[Webhook] handleCheckoutCompleted — session:', session.id, 'mode:', session.mode, 'payment_status:', session.payment_status);
  console.log('[Webhook] Session metadata:', JSON.stringify(session.metadata));

  // Extract UID from session metadata, or fallback to payment_intent/subscription metadata
  let uid = session.metadata?.firebaseUid;
  let plan = session.metadata?.plan as PremiumPlan | undefined;

  if (!uid && session.mode === 'payment' && session.payment_intent) {
    const piId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent.id;
    console.log('[Webhook] No UID in session metadata, checking payment_intent:', piId);
    const pi = await stripe.paymentIntents.retrieve(piId);
    uid = pi.metadata?.firebaseUid;
    plan = plan || (pi.metadata?.plan as PremiumPlan | undefined);
    console.log('[Webhook] PaymentIntent metadata:', JSON.stringify(pi.metadata));
  }

  if (!uid && session.mode === 'subscription' && session.subscription) {
    const subId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id;
    console.log('[Webhook] No UID in session metadata, checking subscription:', subId);
    const sub = await stripe.subscriptions.retrieve(subId);
    uid = sub.metadata?.firebaseUid;
    plan = plan || (sub.metadata?.plan as PremiumPlan | undefined);
    console.log('[Webhook] Subscription metadata:', JSON.stringify(sub.metadata));
  }

  if (!uid) {
    console.error('[Webhook] FATAL: Could not extract firebaseUid from any metadata source, session:', session.id);
    return;
  }

  if (!plan || plan === ('unknown' as any)) {
    console.error('[Webhook] FATAL: Plan is missing or unknown, session:', session.id, 'plan:', plan);
    return;
  }

  console.log('[Webhook] Resolved uid:', uid, 'plan:', plan);

  // For OXXO/transfer: payment_status will be 'unpaid' — don't activate yet
  if (session.payment_status !== 'paid') {
    console.log('[Webhook] Payment not yet completed (async method), waiting for confirmation:', session.id);
    return;
  }

  const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;

  if (session.mode === 'payment') {
    // One-time payment (daily, weekly, lifetime)
    const expiresAt = calculateExpiry(plan);
    console.log('[Webhook] Activating one-time premium — uid:', uid, 'plan:', plan, 'expiresAt:', expiresAt?.toISOString() ?? 'lifetime');
    await activatePremium(uid, {
      plan,
      stripeCustomerId: customerId || '',
      priceId: session.metadata?.priceId || '',
      expiresAt,
      stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : undefined,
    });
    console.log('[Webhook] Firestore write COMPLETED for uid:', uid);
  } else if (session.mode === 'subscription') {
    // Subscription — get current_period_end
    const subId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;
    if (subId) {
      const subscription = await stripe.subscriptions.retrieve(subId);
      const expiresAt = new Date(subscription.current_period_end * 1000);
      console.log('[Webhook] Activating subscription premium — uid:', uid, 'plan:', plan, 'subId:', subId, 'expiresAt:', expiresAt.toISOString());
      await activatePremium(uid, {
        plan,
        stripeCustomerId: customerId || '',
        priceId: session.metadata?.priceId || '',
        expiresAt,
        stripeSubscriptionId: subId,
      });
      console.log('[Webhook] Firestore write COMPLETED for uid:', uid);
    } else {
      console.error('[Webhook] No subscription ID found in session:', session.id);
    }
  }

  console.log(`[Webhook] Premium activated for ${uid} with plan ${plan}`);
}

async function handleAsyncPaymentSucceeded(session: Stripe.Checkout.Session, stripe: Stripe) {
  // Same as checkout completed but specifically for OXXO/transfer
  await handleCheckoutCompleted({ ...session, payment_status: 'paid' } as any, stripe);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('[Webhook] handleInvoicePaymentSucceeded — invoice:', invoice.id);
  const subId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;
  if (!subId) return;

  const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;
  if (!customerId) return;

  const uid = await findUidByStripeCustomer(customerId);
  if (!uid) {
    console.error('[Webhook] No user found for Stripe customer:', customerId);
    return;
  }

  // Update expiry from the invoice's period end
  const periodEnd = (invoice as any).lines?.data?.[0]?.period?.end;
  if (periodEnd) {
    await updateSubscriptionExpiry(uid, new Date(periodEnd * 1000));
    console.log(`[Webhook] Subscription renewed for ${uid}, new expiry: ${new Date(periodEnd * 1000).toISOString()}`);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('[Webhook] handleInvoicePaymentFailed — invoice:', invoice.id);
  const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;
  if (!customerId) return;

  const uid = await findUidByStripeCustomer(customerId);
  if (!uid) return;

  await updateSubscriptionStatus(uid, 'past_due');
  console.log(`[Webhook] Payment failed for ${uid}, status set to past_due`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('[Webhook] handleSubscriptionDeleted — subscription:', subscription.id);
  const uid = subscription.metadata?.firebaseUid;
  const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id;

  const resolvedUid = uid || (customerId ? await findUidByStripeCustomer(customerId) : null);
  if (!resolvedUid) {
    console.error('[Webhook] Could not resolve UID for cancelled subscription:', subscription.id);
    return;
  }

  const expiresAt = new Date(subscription.current_period_end * 1000);
  await updateSubscriptionStatus(resolvedUid, 'cancelled', {
    cancelledAt: admin.firestore.Timestamp.now(),
    expiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
  });
  console.log(`[Webhook] Subscription cancelled for ${resolvedUid}, access until ${expiresAt.toISOString()}`);
}

function calculateExpiry(plan: PremiumPlan): Date | null {
  const now = new Date();
  switch (plan) {
    case 'daily':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    case 'weekly':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    case 'lifetime':
      return null; // Never expires
    default:
      return null;
  }
}
