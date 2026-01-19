import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDmi6_5t3gvC8wcaTraz6XQ0LJyMuV_FB0",
  authDomain: "qlosino-6f549.firebaseapp.com",
  projectId: "qlosino-6f549",
  storageBucket: "qlosino-6f549.firebasestorage.app",
  messagingSenderId: "158942132246",
  appId: "1:158942132246:web:e6c1b6b6b2109218fe5d37",
  measurementId: "G-MMECSCCS86"
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

export { db, collection, getDocs };
