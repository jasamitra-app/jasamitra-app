import { useState, useEffect } from 'react';
import { db, storage, isFirebaseConfigured } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, getDocs, updateDoc, doc, serverTimestamp, addDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { User as FirebaseUser } from 'firebase/auth';
import { Transaction, Payment } from '../types';

export function useOrder(user: FirebaseUser | null, userRole: string | null, activePage: string, chatMitra: any) {
  const [mitraOrders, setMitraOrders] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pendingPayments, setPendingPayments] = useState<Payment[]>([]);
  const [selectedPaymentForView, setSelectedPaymentForView] = useState<Payment | null>(null);
  const [showDealModal, setShowDealModal] = useState(false);
  const [activeDeal, setActiveDeal] = useState<any>(null);
  const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);
  const [isUploadingPayment, setIsUploadingPayment] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const [isSendingOffer, setIsSendingOffer] = useState(false);

  useEffect(() => {
    if (!user || !isFirebaseConfigured) {
      setMitraOrders([]);
      return;
    }
    
    try {
      const q = query(
        collection(db, 'transactions'),
        where('mitraID', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const orders = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            serviceTitle: data.serviceTitle || 'Layanan Jasa',
            customerName: data.customerName || 'Pelanggan',
            customerPhone: data.customerPhone || '',
            date: data.createdAt ? new Date(data.createdAt.toDate()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Baru saja'
          };
        });
        setMitraOrders(orders);
      }, (error) => {
        if (error.code === 'permission-denied') {
          console.warn("Firestore mitra orders listener: Permission denied.");
        } else {
          console.error("Failed to listen to mitra orders:", error);
        }
      });
      
      return () => unsubscribe();
    } catch (error) {
      console.error("Failed to setup mitra orders listener:", error);
    }
  }, [user]);

  useEffect(() => {
    if (!isFirebaseConfigured || !user) {
      setTransactions([]);
      return;
    }
    
    const fetchTransactions = async () => {
      try {
        const q = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const transList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Transaction[];
        setTransactions(transList);
      } catch (error: any) {
        if (error.code === 'permission-denied') {
          console.warn("Firestore transactions fetch: Permission denied.");
        } else {
          console.error("Failed to fetch transactions:", error);
        }
      }
    };
    fetchTransactions();
  }, [user, activePage]);

  useEffect(() => {
    if (!isFirebaseConfigured || !user || userRole !== 'admin') return;

    const fetchPendingPayments = async () => {
      try {
        const q = query(
          collection(db, 'payments'),
          where('status', '==', 'pending'),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const paymentsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Payment[];
        setPendingPayments(paymentsData);
      } catch (error: any) {
        if (error.code === 'permission-denied') {
          console.warn("Firestore payments fetch: Permission denied.");
        } else {
          console.error("Failed to fetch payments:", error);
        }
      }
    };
    fetchPendingPayments();
  }, [user, userRole, activePage]);

  const confirmDeal = async () => {
    if (!user || !activeDeal) return;
    if (!isFirebaseConfigured) {
      alert('Firebase tidak terkonfigurasi. Silakan hubungi admin.');
      return;
    }

    try {
      const dealContent = `✅ DEAL DISEPAKATI\nTotal: Rp ${activeDeal.total.toLocaleString()}\nJaminan 10%: Rp ${activeDeal.jaminan.toLocaleString()}`;
      
      const chatId = [user.uid, chatMitra?.id || 'general'].sort().join('_');

      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        sender: 'user',
        senderId: user.uid,
        type: 'text',
        content: dealContent,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        isDeal: true,
        timestamp: serverTimestamp()
      });

      if (activeTransaction) {
        await updateDoc(doc(db, 'transactions', activeTransaction.id), {
          status: 'deal_agreed',
          updatedAt: serverTimestamp()
        });
      }

      await addDoc(collection(db, 'notifications'), {
        recipientId: chatMitra?.id,
        senderId: user.uid,
        title: 'Pesanan Baru!',
        message: `${user.displayName || 'Pelanggan'} telah menyetujui deal untuk ${activeDeal.jasa}.`,
        type: 'order',
        isRead: false,
        createdAt: serverTimestamp()
      });

      setShowDealModal(false);
      setPaymentAmount(activeDeal.total);
      setShowPaymentModal(true);
      alert('Silakan upload bukti TF untuk melanjutkan pesanan.');
    } catch (error: any) {
      alert('Gagal mengonfirmasi deal: ' + error.message);
    }
  };

  const handleSendOffer = async () => {
    if (!user || !offerPrice || !activeTransaction) return;
    setIsSendingOffer(true);
    try {
      const priceNum = parseInt(offerPrice.replace(/\D/g, ''));
      if (isNaN(priceNum) || priceNum <= 0) throw new Error("Harga tidak valid");

      const dpAmount = priceNum * 0.1;

      await updateDoc(doc(db, 'transactions', activeTransaction.id), {
        status: 'offer_sent',
        amount: priceNum,
        dpAmount: dpAmount,
        updatedAt: serverTimestamp()
      });

      const chatId = [user.uid, activeTransaction.customerID].sort().join('_');
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        sender: 'mitra',
        senderId: user.uid,
        type: 'offer',
        content: `Menawarkan harga Rp ${priceNum.toLocaleString()} untuk jasa ini.`,
        amount: priceNum,
        dpAmount: dpAmount,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        timestamp: serverTimestamp()
      });

      await addDoc(collection(db, 'notifications'), {
        recipientId: activeTransaction.customerID,
        senderId: user.uid,
        title: 'Penawaran Baru!',
        message: `${user.displayName || 'Mitra'} telah memberikan penawaran harga untuk pesanan Anda.`,
        type: 'offer',
        isRead: false,
        createdAt: serverTimestamp()
      });

      setShowOfferModal(false);
      setOfferPrice('');
      alert('Penawaran berhasil dikirim!');
    } catch (error: any) {
      alert('Gagal mengirim penawaran: ' + error.message);
    } finally {
      setIsSendingOffer(false);
    }
  };

  const submitPayment = async () => {
    if (!user || !paymentProof || !activeTransaction) {
      alert('Harap pilih file bukti transfer.');
      return;
    }

    setIsUploadingPayment(true);
    try {
      const fileRef = storageRef(storage, `payments/${user.uid}/${Date.now()}_${paymentProof.name}`);
      await uploadBytes(fileRef, paymentProof);
      const url = await getDownloadURL(fileRef);

      await addDoc(collection(db, 'payments'), {
        transactionId: activeTransaction.id,
        userId: user.uid,
        mitraId: activeTransaction.mitraID || activeTransaction.mitraId || 'unknown',
        amount: paymentAmount,
        proofUrl: url,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      await updateDoc(doc(db, 'transactions', activeTransaction.id), {
        status: 'paid',
        paymentProof: url,
        updatedAt: serverTimestamp()
      });

      await addDoc(collection(db, 'notifications'), {
        recipientId: 'admin',
        senderId: user.uid,
        title: 'Pembayaran Baru',
        message: `Pelanggan ${user.displayName || ''} telah mengupload bukti pembayaran.`,
        type: 'payment',
        isRead: false,
        createdAt: serverTimestamp()
      });

      setShowPaymentModal(false);
      setPaymentProof(null);
      setPaymentProofPreview(null);
      alert('Bukti pembayaran berhasil diupload. Menunggu verifikasi admin.');
    } catch (error: any) {
      console.error("Payment error:", error);
      alert('Gagal mengupload bukti pembayaran: ' + error.message);
    } finally {
      setIsUploadingPayment(false);
    }
  };

  return {
    mitraOrders,
    transactions,
    pendingPayments,
    selectedPaymentForView,
    setSelectedPaymentForView,
    showDealModal,
    setShowDealModal,
    activeDeal,
    setActiveDeal,
    activeTransaction,
    setActiveTransaction,
    showPaymentModal,
    setShowPaymentModal,
    paymentAmount,
    setPaymentAmount,
    paymentProof,
    setPaymentProof,
    paymentProofPreview,
    setPaymentProofPreview,
    isUploadingPayment,
    showOfferModal,
    setShowOfferModal,
    offerPrice,
    setOfferPrice,
    isSendingOffer,
    confirmDeal,
    handleSendOffer,
    submitPayment
  };
}
