import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const isConfigValid = !!(import.meta as any).env?.VITE_FIREBASE_API_KEY;

const firebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || "dummy-key",
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || "dummy-project",
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID,
  measurementId: (import.meta as any).env?.VITE_FIREBASE_MEASUREMENT_ID
};

let app: any;
let auth: any;
let db: any;
let storage: any;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.error("Firebase initialization failed:", error);
  // Provide dummy objects to prevent immediate crashes
  auth = { onAuthStateChanged: () => () => {} } as any;
  db = {} as any;
  storage = {} as any;
}

export { auth, db, storage };
export const isFirebaseConfigured = isConfigValid;

export default app;
