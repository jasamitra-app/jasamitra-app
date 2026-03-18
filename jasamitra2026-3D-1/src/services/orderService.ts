import { collection, query, getDocs, addDoc, updateDoc, doc, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const getMyOrders = async (userId: string, role: 'pelanggan' | 'mitra') => {
 const field = role === 'pelanggan' ? 'customerID' : 'mitraID';
 const q = query(collection(db, 'orders'), where(field, '==', userId));
 const snapshot = await getDocs(q);
 return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createOrder = async (orderData: any) => {
 return await addDoc(collection(db, 'orders'), {
 ...orderData,
 createdAt: serverTimestamp()
 });
};

export const updateOrderStatus = async (orderId: string, status: string) => {
 return await updateDoc(doc(db, 'orders', orderId), { status });
};

export const getPendingPayments = async () => {
 const q = query(collection(db, 'payments'), where('status', '==', 'pending'));
 const snapshot = await getDocs(q);
 return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const approvePayment = async (paymentId: string, orderId: string) => {
 await updateDoc(doc(db, 'payments', paymentId), { status: 'approved' });
 await updateDoc(doc(db, 'orders', orderId), { status: 'paid' });
};

export const rejectPayment = async (paymentId: string, orderId: string, reason: string) => {
 await updateDoc(doc(db, 'payments', paymentId), { status: 'rejected', rejectionNote: reason });
 await updateDoc(doc(db, 'orders', orderId), { status: 'payment_rejected' });
};
