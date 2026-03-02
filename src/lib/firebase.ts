import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Cek apakah environment variables tersedia
const checkEnv = (key: string): boolean => {
  return !!import.meta.env[key];
};

const hasValidConfig = 
  checkEnv('VITE_FIREBASE_API_KEY') &&
  checkEnv('VITE_FIREBASE_AUTH_DOMAIN') &&
  checkEnv('VITE_FIREBASE_PROJECT_ID') &&
  checkEnv('VITE_FIREBASE_STORAGE_BUCKET') &&
  checkEnv('VITE_FIREBASE_MESSAGING_SENDER_ID') &&
  checkEnv('VITE_FIREBASE_APP_ID');

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app: any;
let auth: any;
let db: any;
let storage: any;

if (hasValidConfig) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    // Buat objek dummy agar aplikasi tidak crash
    auth = {
      onAuthStateChanged: (cb: any) => { cb(null); return () => {}; },
      currentUser: null
    };
    db = {};
    storage = {};
  }
} else {
  console.warn('⚠️ Firebase configuration missing, using dummy services');
  auth = {
    onAuthStateChanged: (cb: any) => { cb(null); return () => {}; },
    currentUser: null
  };
  db = {};
  storage = {};
}

export { auth, db, storage };
export const isFirebaseConfigured = hasValidConfig;
export default app;
