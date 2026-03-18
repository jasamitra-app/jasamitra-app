import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export function useAuth() {
  const [userRole, setUserRole] = useState<'pelanggan' | 'mitra' | 'admin' | null>(() => {
    const saved = localStorage.getItem('userRole');
    if (saved === 'tamu') return 'pelanggan';
    return (saved as 'pelanggan' | 'mitra' | 'admin') || null;
  });
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isMitra, setIsMitra] = useState(false);
  const [mitraStatus, setMitraStatus] = useState<'pending' | 'active' | 'rejected' | 'approved' | null>(null);
  const [userAddress, setUserAddress] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userRef);
          
          let currentRole = 'pelanggan';
          
          if (!userDoc.exists()) {
            await setDoc(userRef, {
              role: 'pelanggan',
              email: currentUser.email || '',
              name: currentUser.displayName || 'Pengguna',
              createdAt: serverTimestamp()
            });
            setUserAddress('');
          } else {
            const userData = userDoc.data();
            currentRole = userData.role || 'pelanggan';
            setUserAddress(userData.address || '');
          }

          const mitraDoc = await getDoc(doc(db, 'mitras', currentUser.uid));
          if (mitraDoc.exists()) {
            const mitraData = mitraDoc.data();
            setMitraStatus(mitraData.status || 'pending');
            setIsMitra(true);
            currentRole = 'mitra';
            setUserAddress(mitraData.address || '');
          } else {
            setMitraStatus(null);
            setIsMitra(false);
          }

          if (currentRole === 'admin') {
            setUserRole('admin');
            localStorage.setItem('userRole', 'admin');
          } else if (currentRole === 'mitra') {
            setUserRole('mitra');
            localStorage.setItem('userRole', 'mitra');
          } else {
            setUserRole('pelanggan');
            localStorage.setItem('userRole', 'pelanggan');
          }

        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserRole('pelanggan');
          localStorage.setItem('userRole', 'pelanggan');
        }
      } else {
        setMitraStatus(null);
        setIsMitra(false);
        setUserRole(null);
        setUserAddress('');
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUserRole(null);
      localStorage.removeItem('userRole');
      setIsMitra(false);
    } catch (error: any) {
      throw error;
    }
  };

  return {
    user,
    setUser,
    userRole,
    setUserRole,
    isMitra,
    setIsMitra,
    mitraStatus,
    userAddress,
    setUserAddress,
    logout
  };
}
