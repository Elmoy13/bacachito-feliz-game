import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  linkWithCredential,
  linkWithPopup,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db, googleProvider, trackEvent } from '@/lib/firebase';
import type { PlanId } from '@/config/stripe';

export type SubscriptionStatus = 'active' | 'past_due' | 'cancelled' | 'expired' | 'pending' | (string & {});

export interface Subscription {
  status: SubscriptionStatus;
  plan: PlanId;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePaymentIntentId?: string;
  priceId?: string;
  startedAt: Date;
  expiresAt: Date | null;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  user: User | null;
  uid: string | null;
  isAnonymous: boolean;
  isAuthenticated: boolean;
  isPremium: boolean;
  premiumPlan: PlanId | null;
  premiumExpiresAt: Date | null;
  subscriptionStatus: SubscriptionStatus | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  openPaywall: () => void;
  closePaywall: () => void;
  isPaywallOpen: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subLoading, setSubLoading] = useState(false);

  // Auth state: every visitor gets at least an anonymous session
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setAuthLoading(false);
      } else {
        // Sign in anonymously
        try {
          await signInAnonymously(auth);
          // onAuthStateChanged will fire again with the new user
        } catch (error) {
          console.error('Anonymous auth error:', error);
          setAuthLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Premium subscription listener (only for real, non-anonymous accounts)
  useEffect(() => {
    if (!user || user.isAnonymous) {
      setSubscription(null);
      setSubLoading(false);
      return;
    }

    setSubLoading(true);
    const subRef = doc(db, 'users', user.uid, 'subscription', 'current');
    const unsubscribe = onSnapshot(
      subRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setSubscription({
            status: data.status,
            plan: data.plan,
            stripeCustomerId: data.stripeCustomerId,
            stripeSubscriptionId: data.stripeSubscriptionId,
            stripePaymentIntentId: data.stripePaymentIntentId,
            priceId: data.priceId,
            // Firestore Timestamps -> Date (fallback for raw values)
            startedAt: data.startedAt?.toDate?.() ?? new Date(data.startedAt),
            expiresAt: data.expiresAt ? (data.expiresAt.toDate?.() ?? new Date(data.expiresAt)) : null,
            cancelledAt: data.cancelledAt ? (data.cancelledAt.toDate?.() ?? new Date(data.cancelledAt)) : undefined,
            createdAt: data.createdAt?.toDate?.() ?? new Date(data.createdAt),
            updatedAt: data.updatedAt?.toDate?.() ?? new Date(data.updatedAt),
          });
        } else {
          setSubscription(null);
        }
        setSubLoading(false);
      },
      (error) => {
        console.error('Error listening to subscription:', error);
        setSubscription(null);
        setSubLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const isPremium = useMemo(() => {
    if (!subscription) return false;
    const { status, expiresAt } = subscription;
    if (status !== 'active' && status !== 'past_due') return false;
    // Lifetime plans have no expiration
    if (expiresAt === null) return true;
    return expiresAt.getTime() > Date.now();
  }, [subscription]);

  const signInWithGoogle = useCallback(async () => {
    // Upgrade the anonymous account so its data is kept
    try {
      if (auth.currentUser?.isAnonymous) {
        await linkWithPopup(auth.currentUser, googleProvider);
        trackEvent('auth_anonymous_linked', { method: 'google' });
        trackEvent('auth_login', { method: 'google' });
        setIsAuthModalOpen(false);
        return;
      }
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') return;

      // The Google account already exists: sign in with it directly
      if (error.code === 'auth/credential-already-in-use') {
        const credential = GoogleAuthProvider.credentialFromError(error);
        if (credential) {
          await signInWithCredential(auth, credential);
          trackEvent('auth_login', { method: 'google' });
          setIsAuthModalOpen(false);
          return;
        }
      }
      console.warn('linkWithPopup failed:', error.code, error.message);
    }

    try {
      await signInWithPopup(auth, googleProvider);
      trackEvent('auth_login', { method: 'google' });
      setIsAuthModalOpen(false);
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') return;
      if (error.code === 'auth/popup-blocked') {
        console.error('Popup blocked by browser. User needs to allow popups.');
      }
      throw error;
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (auth.currentUser?.isAnonymous) {
      try {
        const credential = EmailAuthProvider.credential(email, password);
        await linkWithCredential(auth.currentUser, credential);
        trackEvent('auth_anonymous_linked', { method: 'email' });
        trackEvent('auth_login', { method: 'email' });
        setIsAuthModalOpen(false);
        return;
      } catch (error) {
        // Existing account: fall through to a regular sign in
        if (!(error.code === 'auth/credential-already-in-use' || error.code === 'auth/email-already-in-use')) {
          throw error;
        }
      }
    }

    await signInWithEmailAndPassword(auth, email, password);
    trackEvent('auth_login', { method: 'email' });
    setIsAuthModalOpen(false);
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    if (!auth.currentUser) return;
    try {
      if (auth.currentUser.isAnonymous) {
        const credential = EmailAuthProvider.credential(email, password);
        await linkWithCredential(auth.currentUser, credential);
        trackEvent('auth_anonymous_linked', { method: 'email' });
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      trackEvent('auth_register', { method: 'email' });
      setIsAuthModalOpen(false);
    } catch (error) {
      if (error.code === 'auth/credential-already-in-use' || error.code === 'auth/email-already-in-use') {
        // Email already registered: the auth modal shows the message
        throw error;
      }
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      uid: user?.uid ?? null,
      isAnonymous: user?.isAnonymous ?? true,
      isAuthenticated: !!user && !user.isAnonymous,
      isPremium,
      premiumPlan: subscription?.plan ?? null,
      premiumExpiresAt: subscription?.expiresAt ?? null,
      subscriptionStatus: subscription?.status ?? null,
      loading: authLoading || subLoading,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      resetPassword,
      signOut,
      openAuthModal: () => setIsAuthModalOpen(true),
      closeAuthModal: () => setIsAuthModalOpen(false),
      isAuthModalOpen,
      openPaywall: () => setIsPaywallOpen(true),
      closePaywall: () => setIsPaywallOpen(false),
      isPaywallOpen,
    }),
    [
      user,
      isPremium,
      subscription,
      authLoading,
      subLoading,
      isAuthModalOpen,
      isPaywallOpen,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      resetPassword,
      signOut,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
