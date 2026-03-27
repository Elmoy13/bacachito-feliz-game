import { initializeApp } from 'firebase/app';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';
import { getAuth, signInAnonymously, onAuthStateChanged, type User } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDmi6_5t3gvC8wcaTraz6XQ0LJyMuV_FB0",
  authDomain: "qlosino-6f549.firebaseapp.com",
  // NOTE: Enable Realtime Database in Firebase Console → Realtime Database → Create Database
  // Then copy the databaseURL here. Format: https://<project-id>-default-rtdb.<region>.firebasedatabase.app
  databaseURL: "https://qlosino-6f549-default-rtdb.firebaseio.com",
  projectId: "qlosino-6f549",
  storageBucket: "qlosino-6f549.firebasestorage.app",
  messagingSenderId: "158942132246",
  appId: "1:158942132246:web:ad14cfe711521b9ffe5d37",
  measurementId: "G-FBFM2KM1NV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});
const auth = getAuth(app);
const rtdb = getDatabase(app);

// Initialize Analytics only if supported
let analyticsInstance: ReturnType<typeof getAnalytics> | null = null;
isSupported().then((supported) => {
  if (supported) {
    analyticsInstance = getAnalytics(app);
  }
});

// NOTE: Firebase Anonymous Auth must be enabled in the Firebase Console:
// Authentication → Sign-in method → Anonymous → Enable

// Analytics helper
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  try {
    if (analyticsInstance) {
      logEvent(analyticsInstance, eventName, params);
    }
  } catch {
    // Analytics is non-critical
  }
};

// Game session interface
export interface GameSession {
  players: string[];
  gameMode: string;
  startedAt: any;
  sessionId?: string;
}

// Save a new game session
export const saveGameSession = async (players: string[], gameMode: string): Promise<string> => {
  try {
    const gameSession: GameSession = {
      players,
      gameMode,
      startedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, 'gameSessions'), gameSession);
    console.log('Partida guardada con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error guardando partida:', error);
    throw error;
  }
};

export { db, rtdb, auth, collection, getDocs, signInAnonymously, onAuthStateChanged, type User };
