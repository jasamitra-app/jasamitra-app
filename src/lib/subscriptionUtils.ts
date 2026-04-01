import { db } from './firebase';
import { collection, query, where, getDocs, updateDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';

export const checkAndExpireSubscriptions = async (userId: string) => {
  if (!userId) return;

  try {
    const now = new Date();
    
    // 1. Check Mitra Unggulan subscriptions
    const adsQuery = query(
      collection(db, 'iklan'),
      where('mitraId', '==', userId),
      where('isFeatured', '==', true)
    );
    
    const adsSnapshot = await getDocs(adsQuery);
    
    for (const adDoc of adsSnapshot.docs) {
      const adData = adDoc.data();
      if (adData.featuredUntil && adData.featuredUntil.toDate() < now) {
        // Expired! Update the ad
        await updateDoc(doc(db, 'iklan', adDoc.id), {
          isFeatured: false,
          featuredUntil: null
        });

        // Send notification
        await addDoc(collection(db, 'notifications'), {
          recipientId: userId,
          title: 'Mitra Unggulan Berakhir',
          body: `Masa aktif Mitra Unggulan untuk iklan "${adData.title}" telah berakhir.`,
          type: 'subscription_expired',
          read: false,
          createdAt: serverTimestamp()
        });
      } else if (adData.featuredUntil) {
        // Check if it expires in 2 days (48 hours)
        const timeDiff = adData.featuredUntil.toDate().getTime() - now.getTime();
        const daysLeft = timeDiff / (1000 * 3600 * 24);
        
        if (daysLeft <= 2 && daysLeft > 1 && !adData.expiryNotified) {
          // Send reminder notification
          await addDoc(collection(db, 'notifications'), {
            recipientId: userId,
            title: 'Pengingat Mitra Unggulan',
            body: `Masa aktif Mitra Unggulan untuk iklan "${adData.title}" akan berakhir dalam 2 hari. Segera perpanjang untuk tetap tampil di depan!`,
            type: 'subscription_reminder',
            read: false,
            createdAt: serverTimestamp()
          });
          
          // Mark as notified to prevent spam
          await updateDoc(doc(db, 'iklan', adDoc.id), {
            expiryNotified: true
          });
        }
      }
    }

    // 2. Check Partner JasaMitra subscriptions
    const partnerQuery = query(
      collection(db, 'subscription_invoices'),
      where('userId', '==', userId),
      where('type', '==', 'partner'),
      where('status', '==', 'paid')
    );
    
    const partnerSnapshot = await getDocs(partnerQuery);
    
    for (const partnerDoc of partnerSnapshot.docs) {
      const partnerData = partnerDoc.data();
      if (partnerData.activeUntil && partnerData.activeUntil.toDate() < now) {
        // Expired! Update the partner status
        await updateDoc(doc(db, 'subscription_invoices', partnerDoc.id), {
          status: 'expired'
        });

        // Send notification
        await addDoc(collection(db, 'notifications'), {
          recipientId: userId,
          title: 'Partner JasaMitra Berakhir',
          body: `Masa aktif Partner JasaMitra untuk toko "${partnerData.namaToko}" telah berakhir.`,
          type: 'subscription_expired',
          read: false,
          createdAt: serverTimestamp()
        });
      } else if (partnerData.activeUntil) {
        // Check if it expires in 2 days (48 hours)
        const timeDiff = partnerData.activeUntil.toDate().getTime() - now.getTime();
        const daysLeft = timeDiff / (1000 * 3600 * 24);
        
        if (daysLeft <= 2 && daysLeft > 1 && !partnerData.expiryNotified) {
          // Send reminder notification
          await addDoc(collection(db, 'notifications'), {
            recipientId: userId,
            title: 'Pengingat Partner JasaMitra',
            body: `Masa aktif Partner JasaMitra untuk toko "${partnerData.namaToko}" akan berakhir dalam 2 hari. Segera perpanjang untuk tetap tampil di halaman utama!`,
            type: 'subscription_reminder',
            read: false,
            createdAt: serverTimestamp()
          });
          
          // Mark as notified to prevent spam
          await updateDoc(doc(db, 'subscription_invoices', partnerDoc.id), {
            expiryNotified: true
          });
        }
      }
    }

  } catch (error) {
    console.error("Error checking subscriptions:", error);
  }
};
