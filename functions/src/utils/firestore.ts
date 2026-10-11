import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

interface SubscriptionWrite {
  status: 'active' | 'expired' | 'cancelled' | 'past_due';
  plan: string;
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  stripePaymentIntentId?: string;
  priceId: string;
  startedAt: admin.firestore.Timestamp;
  expiresAt: admin.firestore.Timestamp | null;
  cancelledAt?: admin.firestore.Timestamp;
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
}

export const activatePremium = async (
  uid: string,
  data: {
    plan: string;
    stripeCustomerId: string;
    priceId: string;
    expiresAt: Date | null;
    stripeSubscriptionId?: string;
    stripePaymentIntentId?: string;
  },
): Promise<void> => {
  const now = admin.firestore.Timestamp.now();
  const doc: SubscriptionWrite = {
    status: 'active',
    plan: data.plan,
    stripeCustomerId: data.stripeCustomerId,
    priceId: data.priceId,
    startedAt: now,
    expiresAt: data.expiresAt ? admin.firestore.Timestamp.fromDate(data.expiresAt) : null,
    createdAt: now,
    updatedAt: now,
  };
  if (data.stripeSubscriptionId) doc.stripeSubscriptionId = data.stripeSubscriptionId;
  if (data.stripePaymentIntentId) doc.stripePaymentIntentId = data.stripePaymentIntentId;

  await db.doc(`users/${uid}/subscription/current`).set(doc, { merge: true });
};

export const updateSubscriptionStatus = async (
  uid: string,
  status: 'active' | 'expired' | 'cancelled' | 'past_due',
  extra?: Record<string, any>,
): Promise<void> => {
  await db.doc(`users/${uid}/subscription/current`).update({
    status,
    updatedAt: admin.firestore.Timestamp.now(),
    ...extra,
  });
};

export const updateSubscriptionExpiry = async (
  uid: string,
  expiresAt: Date,
): Promise<void> => {
  await db.doc(`users/${uid}/subscription/current`).update({
    status: 'active',
    expiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
    updatedAt: admin.firestore.Timestamp.now(),
  });
};

export const getStripeCustomerId = async (uid: string): Promise<string | null> => {
  const snap = await db.doc(`users/${uid}/stripe/customer`).get();
  return snap.exists ? snap.data()?.stripeCustomerId ?? null : null;
};

export const saveStripeCustomerId = async (uid: string, customerId: string): Promise<void> => {
  await db.doc(`users/${uid}/stripe/customer`).set({ stripeCustomerId: customerId });
};

export const findUidByStripeCustomer = async (customerId: string): Promise<string | null> => {
  const snap = await db.collectionGroup('stripe').where('stripeCustomerId', '==', customerId).limit(1).get();
  if (snap.empty) return null;
  // Path is users/{uid}/stripe/customer
  return snap.docs[0].ref.parent.parent?.id ?? null;
};
