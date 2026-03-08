import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, getFirestore, CACHE_SIZE_UNLIMITED } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const isConfigValid = !!(import.meta as any).env?.VITE_FIREBASE_API_KEY && 
                     (import.meta as any).env?.VITE_FIREBASE_API_KEY !== "dummy-key" &&
                     !!(import.meta as any).env?.VITE_FIREBASE_PROJECT_ID &&
                     (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID !== "dummy-project";

// Debug helper to check environment variables status
if (typeof window !== 'undefined') {
  (window as any).checkFirebaseConfig = () => {
    const env = (import.meta as any).env;
    console.log("--- Firebase Config Debug ---");
    console.log("VITE_FIREBASE_API_KEY:", env?.VITE_FIREBASE_API_KEY ? "✅ Present" : "❌ Missing");
    console.log("VITE_FIREBASE_AUTH_DOMAIN:", env?.VITE_FIREBASE_AUTH_DOMAIN ? "✅ Present" : "❌ Missing");
    console.log("VITE_FIREBASE_PROJECT_ID:", env?.VITE_FIREBASE_PROJECT_ID ? "✅ Present" : "❌ Missing");
    console.log("Note: All variables MUST start with VITE_ to be visible in the browser.");
    return "Check console for details.";
  };
}

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
  
  // Use initializeFirestore with experimentalForceLongPolling to fix connection issues
  // in environments where WebSockets might be restricted or unstable.
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });
  
  storage = getStorage(app);
} catch (error) {
  console.error("Firebase initialization failed:", error);
  // Provide dummy objects to prevent immediate crashes
  app = { name: "[DEFAULT]" };
  auth = { onAuthStateChanged: () => () => {}, app } as any;
  db = {} as any;
  storage = {} as any;
}

export { auth, db, storage, app };
export const isFirebaseConfigured = isConfigValid;

export default app;
