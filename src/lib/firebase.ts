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
  if (isConfigValid) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } else {
    throw new Error("Firebase configuration is missing or invalid.");
  }
} catch (error) {
  console.warn("Firebase initialization failed, using dummy services:", error);
  // Provide dummy objects to prevent immediate crashes
  app = { name: "[DEFAULT]", options: {} };
  auth = { 
    onAuthStateChanged: (cb: any) => {
      // Simulate no user
      cb(null);
      return () => {};
    },
    signOut: async () => {},
    currentUser: null,
    app: app
  } as any;
  db = {
    app: app
  } as any;
  storage = {
    app: app
  } as any;
}

export { auth, db, storage };
export const isFirebaseConfigured = isConfigValid;

export default app;
