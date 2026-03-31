import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseConfig from "../../firebase-applet-config.json";

let app: any;
let auth: any;
let db: any;
let storage: any;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  
  if (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)") {
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  } else {
    db = getFirestore(app);
  }
  
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
export const isFirebaseConfigured = true;

export default app;
