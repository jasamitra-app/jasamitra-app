import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const loginUser = async (email: string, pass: string) => {
 return await signInWithEmailAndPassword(auth, email, pass);
};

export const registerUser = async (email: string, pass: string, role: 'pelanggan' | 'mitra' | 'admin', name: string, phone: string) => {
 const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
 const user = userCredential.user;
 
 if (role === 'pelanggan') {
 await setDoc(doc(db, 'users', user.uid), {
 name,
 phone,
 email,
 role: 'pelanggan',
 createdAt: new Date()
 });
 } else if (role === 'mitra') {
 await setDoc(doc(db, 'mitras', user.uid), {
 namaLengkap: name,
 phone,
 email,
 status: 'pending',
 createdAt: new Date()
 });
 }
 
 return user;
};

export const logoutUser = async () => {
 return await signOut(auth);
};

export const getUserRole = async (uid: string) => {
 const mitraDoc = await getDoc(doc(db, 'mitras', uid));
 if (mitraDoc.exists()) {
 return { role: 'mitra', data: mitraDoc.data() };
 }
 
 const userDoc = await getDoc(doc(db, 'users', uid));
 if (userDoc.exists()) {
 let role = userDoc.data().role || 'pelanggan';
 if (role === 'tamu') role = 'pelanggan';
 return { role, data: userDoc.data() };
 }
 
 return { role: 'pelanggan', data: null };
};
