import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDmi6_5t3gvC8wcaTraz6XQ0LJyMuV_FB0",
  authDomain: "qlosino-6f549.firebaseapp.com",
  projectId: "qlosino-6f549",
  storageBucket: "qlosino-6f549.firebasestorage.app",
  messagingSenderId: "158942132246",
  appId: "1:158942132246:web:ad14cfe711521b9ffe5d37",
  measurementId: "G-FBFM2KM1NV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Analytics only if supported
isSupported().then((supported) => {
  if (supported) {
    getAnalytics(app);
  }
});

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

export { db, collection, getDocs };
