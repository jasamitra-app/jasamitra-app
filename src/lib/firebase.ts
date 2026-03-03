
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Vite mengambil variabel dari .env atau Environment Variables di Vercel
const env = import.meta.env;

// Konfigurasi Firebase Asli (Tanpa Dummy)
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID
};

// Cek validasi: Pastikan setidaknya API Key dan Project ID tersedia
export const isFirebaseConfigured = !!(env.VITE_FIREBASE_API_KEY && env.VITE_FIREBASE_PROJECT_ID);

let app;
let auth: any;
let db: any;
let storage: any;

if (isFirebaseConfigured) {
  try {
    // Mencegah inisialisasi ganda (best practice)
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    
    console.log("Firebase Berhasil Terhubung (Mode Produksi)");
  } catch (error) {
    console.error("Gagal menghubungkan Firebase:", error);
  }
} else {
  console.warn("PERINGATAN: Konfigurasi Firebase tidak ditemukan. Pastikan Environment Variables sudah diisi.");
}

export { auth, db, storage };
export default app;
