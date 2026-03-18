import { collection, query, getDocs, addDoc, updateDoc, doc, deleteDoc, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const getActiveAds = (callback: (ads: any[]) => void) => {
 const q = query(collection(db, 'iklan'));
 return onSnapshot(q, (snapshot) => {
 const ads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
 // Sort client-side
 ads.sort((a: any, b: any) => {
 let timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : Date.now();
 let timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : Date.now();
 return timeB - timeA;
 });
 callback(ads);
 });
};

export const getMyAds = async (userId: string) => {
 const q = query(collection(db, 'iklan'), where('mitraId', '==', userId));
 const snapshot = await getDocs(q);
 return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createAd = async (adData: any) => {
 return await addDoc(collection(db, 'iklan'), adData);
};

export const updateAd = async (adId: string, adData: any) => {
 return await updateDoc(doc(db, 'iklan', adId), adData);
};

export const deleteAd = async (adId: string) => {
 return await deleteDoc(doc(db, 'iklan', adId));
};
