import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { CustomCard, CustomPack } from '@/types/customCards';

// --- Custom Cards ---

export const subscribeToCustomCards = (
  uid: string,
  onData: (cards: CustomCard[]) => void,
  onError: (error: Error) => void
) => {
  const ref = collection(db, 'users', uid, 'customCards');
  const q = query(ref, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const cards: CustomCard[] = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as CustomCard[];
      onData(cards);
    },
    onError
  );
};

export const addCustomCard = async (
  uid: string,
  card: Omit<CustomCard, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const ref = collection(db, 'users', uid, 'customCards');
  const now = Date.now();
  const docRef = await addDoc(ref, {
    ...card,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
};

export const updateCustomCard = async (
  uid: string,
  cardId: string,
  updates: Partial<CustomCard>
): Promise<void> => {
  const ref = doc(db, 'users', uid, 'customCards', cardId);
  await updateDoc(ref, {
    ...updates,
    updatedAt: Date.now(),
  });
};

export const deleteCustomCard = async (uid: string, cardId: string): Promise<void> => {
  const ref = doc(db, 'users', uid, 'customCards', cardId);
  await deleteDoc(ref);
};

// --- Custom Packs ---

export const subscribeToCustomPacks = (
  uid: string,
  onData: (packs: CustomPack[]) => void,
  onError: (error: Error) => void
) => {
  const ref = collection(db, 'users', uid, 'customPacks');
  const q = query(ref, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const packs: CustomPack[] = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as CustomPack[];
      onData(packs);
    },
    onError
  );
};

export const addCustomPack = async (
  uid: string,
  pack: Omit<CustomPack, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const ref = collection(db, 'users', uid, 'customPacks');
  const now = Date.now();
  const docRef = await addDoc(ref, {
    ...pack,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
};

export const updateCustomPack = async (
  uid: string,
  packId: string,
  updates: Partial<CustomPack>
): Promise<void> => {
  const ref = doc(db, 'users', uid, 'customPacks', packId);
  await updateDoc(ref, {
    ...updates,
    updatedAt: Date.now(),
  });
};

export const deleteCustomPack = async (uid: string, packId: string): Promise<void> => {
  const ref = doc(db, 'users', uid, 'customPacks', packId);
  await deleteDoc(ref);
};

// --- Waitlist ---

export const addToWaitlist = async (email: string): Promise<void> => {
  const ref = collection(db, 'waitlist');
  await addDoc(ref, {
    email,
    createdAt: serverTimestamp(),
  });
};
