/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
 Search, 
 Handshake, 
 ShieldCheck, 
 Star, 
 Clock, 
 MapPin, 
 ClipboardList, 
 User, 
 Plus, 
 LayoutGrid,
 ChevronRight, 
 ArrowLeft, 
 Send, 
 Image as ImageIcon, 
 X, 
 CheckCircle2, 
 AlertTriangle,
 LogOut,
 Info,
 FileText,
 Copy,
 Camera,
 Building2,
 Trash2,
 PauseCircle,
 PlayCircle,
 Edit3,
 Wrench,
 MessageSquare,
 Phone,
 Bell,
 ChevronDown,
 Heart,
 Hourglass,
 ShoppingBag,
 Tag,
 Store,
 Zap,
 Wallet
} from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useChat } from './hooks/useChat';
import { useOrder } from './hooks/useOrder';
import { useUI } from './hooks/useUI';
import { 
 CATEGORIES, 
 SUB_CATEGORIES, 
 SERVICES as INITIAL_SERVICES, 
 CategoryId, 
 Service, 
 SubCategory,
 PROVINCES,
 CITIES,
 DISTRICTS
} from './constants';
import { auth, db, storage, isFirebaseConfigured } from './lib/firebase';
import { onAuthStateChanged, User as FirebaseUser, signOut, updateProfile, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { collection, query, onSnapshot, addDoc, serverTimestamp, getDocs, where, orderBy, updateDoc, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

import { Page, Payment, Transaction, ChatMessage, Order } from './types';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { AppBottomNav } from './components/AppBottomNav';
import { Modals } from './components/Modals';
import { PageHeader } from './components/PageHeader';
import { Login } from './pages/Login';
import { Account } from './pages/Account';
import { DaftarMitraUnggulan } from './pages/DaftarMitraUnggulan';
import { PusatBantuan } from './pages/PusatBantuan';
import { BantuanDetail } from './pages/BantuanDetail';
import { Home } from './pages/Home';
import Messages from './pages/Messages';
import EditProfile from './pages/EditProfile';
import MyAddress from './pages/MyAddress';
import MyAds from './pages/MyAds';
import Progress from './pages/Progress';
import ChatRoom from './pages/ChatRoom';
import AdminPayment from './pages/AdminPayment';
import { SubCategory as SubCategoryPage } from './pages/SubCategory';
import { IncomingOrders } from './pages/IncomingOrders';
import { MitraProfile } from './pages/MitraProfile';
import { RegisterMitra } from './pages/RegisterMitra';
import { SemuaKategori } from './pages/SemuaKategori';
import { Favorit } from './pages/Favorit';
import { Invoice } from './pages/Invoice';
import { MitraStats } from './pages/MitraStats';
import { MitraSchedule } from './pages/MitraSchedule';
import { LiveTracking } from './pages/LiveTracking';
import { PeraturanPelanggan } from './pages/PeraturanPelanggan';
import { ProtokolMitra } from './pages/ProtokolMitra';
import { JaminanKeamanan } from './pages/JaminanKeamanan';
import { SyaratKetentuan } from './pages/SyaratKetentuan';
import { KebijakanPrivasi } from './pages/KebijakanPrivasi';
import { SyaratPendaftaranMitra } from './pages/SyaratPendaftaranMitra';

// --- Components ---
// --- Components ---


export default function App() {
  const [isSplash, setIsSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const { user, setUser, userRole, setUserRole, isMitra, setIsMitra, mitraStatus, userAddress, setUserAddress, logout } = useAuth();
  const { userChats, chatMitra, setChatMitra, chatMitraPhone, messages, inputText, setInputText, sendMessage } = useChat(user);
  const {
    showLoginMitraModal, setShowLoginMitraModal,
    showAdModal, setShowAdModal,
    showReviewModal, setShowReviewModal,
    showRejectModal, setShowRejectModal,
    selectedMitra, setSelectedMitra,
    editProfileName, setEditProfileName,
    editProfileEmail, setEditProfileEmail,
    editProfilePhone, setEditProfilePhone,
    rejectionNote, setRejectionNote,
    reviewRating, setReviewRating,
    reviewText, setReviewText,
    reviewTransaction, setReviewTransaction,
    isEditingAddress, setIsEditingAddress,
    tempAddress, setTempAddress,
    isUploadingProfile, setIsUploadingProfile
  } = useUI();
  const [activePage, setActivePage] = useState<Page>('beranda');
  const [prevPage, setPrevPage] = useState<Page | null>(null);

  const {
    mitraOrders, transactions, pendingPayments, selectedPaymentForView, setSelectedPaymentForView,
    showDealModal, setShowDealModal, activeDeal, setActiveDeal, activeTransaction, setActiveTransaction,
    showPaymentModal, setShowPaymentModal, paymentAmount, setPaymentAmount, paymentProof, setPaymentProof,
    paymentProofPreview, setPaymentProofPreview, isUploadingPayment, showOfferModal, setShowOfferModal,
    offerPrice, setOfferPrice, isSendingOffer, confirmDeal, handleSendOffer, submitPayment
  } = useOrder(user, userRole, activePage, chatMitra);

  const handleLogout = async () => {
    try {
      await logout();
      setShowOnboarding(true);
      setActivePage('beranda');
      alert('Berhasil keluar');
    } catch (error: any) {
      alert('Gagal keluar: ' + error.message);
    }
  };

 const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
 const [favorites, setFavorites] = useState<string[]>(() => {
   const saved = localStorage.getItem('jasamitra_favorites');
   return saved ? JSON.parse(saved) : [];
 });
 const toggleFavorite = (serviceId: string) => {
   setFavorites(prev => {
     const newFavs = prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId];
     localStorage.setItem('jasamitra_favorites', JSON.stringify(newFavs));
     return newFavs;
   });
 };
 const [featuredMitras, setFeaturedMitras] = useState<any[]>([]);
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedCat, setSelectedCat] = useState<CategoryId>('all');
 const [selectedSub, setSelectedSub] = useState<string>('all');
 const [bookingService, setBookingService] = useState<Service | null>(null);
           const [isSubmittingReview, setIsSubmittingReview] = useState(false);
      const [mitraReviews, setMitraReviews] = useState<any[]>([]);
 const [experiences, setExperiences] = useState([{ id: 1, company: '', position: '', start: '', end: '', desc: '' }]);
 const [adImage, setAdImage] = useState<string | null>(null);
 const [adProvince, setAdProvince] = useState('Jawa Barat');
 const [adCity, setAdCity] = useState('');
 const [adDistrict, setAdDistrict] = useState('');
 const [adTitle, setAdTitle] = useState('');
 const [adCategory, setAdCategory] = useState('');
 const [adSubCategory, setAdSubCategory] = useState('');
 const [adPrice, setAdPrice] = useState('');
 const [adDesc, setAdDesc] = useState('');
 const [adServicePolicy, setAdServicePolicy] = useState('Bisa bawa Alat & Material');
 const [adCoverageAreas, setAdCoverageAreas] = useState<string[]>([]);
 const [adSkills, setAdSkills] = useState<string[]>([]);
 const [newSkill, setNewSkill] = useState('');
 const [bookingName, setBookingName] = useState('');
 const [bookingAddress, setBookingAddress] = useState('');
 const [bookingDesc, setBookingDesc] = useState('');
 const [isSubmittingAd, setIsSubmittingAd] = useState(false);
 const [editingAdId, setEditingAdId] = useState<string | null>(null);
 const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
 const [notifications, setNotifications] = useState<any[]>([]);
 const [unreadNotifCount, setUnreadNotifCount] = useState(0);
 const [showNotifDropdown, setShowNotifDropdown] = useState(false);
   const [kaffaForm, setKaffaForm] = useState({
 nama: '',
 wa: '',
 jenis: 'Handphone',
 model: '',
 keluhan: ''
 });
 const [kaffaPhotos, setKaffaPhotos] = useState<string[]>([]);

  const [currentAddress, setCurrentAddress] = useState(() => {
    return localStorage.getItem('currentAddress') || 'Lokasi Bandung Raya & Cimahi';
  });

  useEffect(() => {
    localStorage.setItem('currentAddress', currentAddress);
  }, [currentAddress]);

  const [recentLocations, setRecentLocations] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentLocations');
    return saved ? JSON.parse(saved) : ['Lokasi Bandung Raya & Cimahi', 'Kota Bandung', 'Cimahi'];
  });

  useEffect(() => {
    localStorage.setItem('recentLocations', JSON.stringify(recentLocations));
  }, [recentLocations]);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const handleSetCurrentAddress = (address: string) => {
    setCurrentAddress(address);
    if (address !== 'Mendeteksi...' && address !== 'Lokasi Terdeteksi') {
      setRecentLocations(prev => {
        const newRecent = [address, ...prev.filter(loc => loc !== address)].slice(0, 5);
        return newRecent;
      });
    }
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      setCurrentAddress('Mendeteksi...');
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
            const data = await response.json();
            
            // Extract a readable location name (suburb, village, or city)
            const address = data.address;
            let locationName = address.village || address.suburb || address.city_district || address.city || address.town || 'Lokasi Terdeteksi';
            
            // Try to map to our known districts
            let mappedLocation = locationName;
            for (const city in DISTRICTS) {
              if (DISTRICTS[city].includes(locationName)) {
                mappedLocation = `${locationName}, ${city}`;
                break;
              }
            }
            
            handleSetCurrentAddress(mappedLocation);
          } catch (error) {
            console.error("Error reverse geocoding:", error);
            handleSetCurrentAddress('Lokasi Terdeteksi');
          }
          setShowLocationModal(false);
        },
        (error) => {
          alert('Gagal mendeteksi lokasi. Pastikan izin lokasi diberikan.');
          handleSetCurrentAddress('Lokasi Bandung Raya & Cimahi');
        }
      );
    } else {
      alert('Geolocation tidak didukung oleh browser ini.');
    }
  };

 // Data Iklan
 const [myAds, setMyAds] = useState<any[]>([]);

     
 const chatEndRef = useRef<HTMLDivElement>(null);
 const fileInputRef = useRef<HTMLInputElement>(null);
 const profilePhotoInputRef = useRef<HTMLInputElement>(null);
      
 

 useEffect(() => {
 if (!isFirebaseConfigured) return;
 
 try {
 const q = query(collection(db, 'iklan'));
 const unsubscribe = onSnapshot(q, (snapshot) => {
 const ads = snapshot.docs.map(doc => ({
 id: doc.id,
 ...doc.data()
 })) as Service[];
 
 // Sort client-side to avoid index requirements
 ads.sort((a, b) => {
 let timeA = 0;
 if (a.createdAt) {
 if (typeof a.createdAt.toMillis === 'function') timeA = a.createdAt.toMillis();
 else if (a.createdAt instanceof Date) timeA = a.createdAt.getTime();
 else if (typeof a.createdAt === 'number') timeA = a.createdAt;
 else if (typeof a.createdAt === 'string') timeA = new Date(a.createdAt).getTime();
 } else {
 // If createdAt is null (e.g. pending server timestamp), treat it as very new
 timeA = Date.now();
 }
 
 let timeB = 0;
 if (b.createdAt) {
 if (typeof b.createdAt.toMillis === 'function') timeB = b.createdAt.toMillis();
 else if (b.createdAt instanceof Date) timeB = b.createdAt.getTime();
 else if (typeof b.createdAt === 'number') timeB = b.createdAt;
 else if (typeof b.createdAt === 'string') timeB = new Date(b.createdAt).getTime();
 } else {
 timeB = Date.now();
 }
 
 return timeB - timeA;
 });
 
 setServices(ads);
 }, (error) => {
 if (error.code === 'permission-denied') {
 console.warn("Firestore iklan listener: Permission denied.");
 } else {
 console.error("Firestore iklan listener failed:", error);
 }
 });
 return () => unsubscribe();
 } catch (error) {
 console.error("Failed to setup iklan listener:", error);
 }
 }, []);

 useEffect(() => {
 if (user) {
 const filtered = services.filter(s => s.mitraId === user.uid);
 setMyAds(filtered);
 } else {
 setMyAds([]);
 }
 }, [services, user]);

 useEffect(() => {
 if (!isFirebaseConfigured) return;
 
 const fetchMitras = async () => {
 try {
 const q = query(collection(db, 'mitras'), where('isFeatured', '==', true));
 const snapshot = await getDocs(q);
 const mitras = snapshot.docs.map(doc => ({
 id: doc.id,
 ...doc.data()
 }));
 setFeaturedMitras(mitras);
 } catch (error: any) {
 if (error.code === 'permission-denied') {
 console.warn("Firestore mitras fetch: Permission denied.");
 } else {
 console.error("Failed to fetch featured mitras:", error);
 }
 }
 };
 fetchMitras();
 }, []);

 

 

 useEffect(() => {
 if (!user || !isFirebaseConfigured) {
 setNotifications([]);
 setUnreadNotifCount(0);
 return;
 }
 
 try {
 const q = query(
 collection(db, 'notifications'),
 where('recipientId', '==', user.uid),
 orderBy('createdAt', 'desc')
 );
 
 const unsubscribe = onSnapshot(q, (snapshot) => {
 const notifs = snapshot.docs.map(doc => ({
 id: doc.id,
 ...doc.data()
 }));
 
 // Check for new payment_success notifications to play sound
 snapshot.docChanges().forEach((change) => {
 if (change.type === 'added') {
 const data = change.doc.data();
 if (data.type === 'payment_success' && !data.isRead) {
 try {
 // Play a short notification sound
 const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
 audio.play().catch(e => console.log('Audio play failed:', e));
 } catch (e) {
 // Ignore audio errors
 }
 }
 }
 });
 
 setNotifications(notifs);
 setUnreadNotifCount(notifs.filter((n: any) => !n.isRead).length);
 }, (error) => {
 if (error.code === 'permission-denied') {
 console.warn("Firestore notifications listener: Permission denied.");
 } else {
 console.error("Failed to listen to notifications:", error);
 }
 });
 
 return () => unsubscribe();
 } catch (error) {
 console.error("Failed to setup notifications listener:", error);
 }
 }, [user]);

 const markNotifsAsRead = async () => {
 if (!user || unreadNotifCount === 0) return;
 
 try {
 const unreadNotifs = notifications.filter(n => !n.isRead);
 for (const notif of unreadNotifs) {
 await updateDoc(doc(db, 'notifications', notif.id), {
 isRead: true
 });
 }
 // Optimistically update UI
 setNotifications(notifications.map(n => ({ ...n, isRead: true })));
 setUnreadNotifCount(0);
 } catch (error) {
 console.error("Error marking notifications as read:", error);
 }
 };

 

 

 

 const verifyPayment = async (payment: Payment) => {
 if (!user) return;
 try {
 await updateDoc(doc(db, 'payments', payment.id), {
 status: 'verified',
 verifiedBy: user.uid,
 verifiedAt: serverTimestamp()
 });

 if ((payment as any).type === 'highlight_ad') {
   // Update the ad to be highlighted
   await updateDoc(doc(db, 'iklan', (payment as any).adId), {
     isHighlight: true,
     img: (payment as any).bannerUrl,
     foto: (payment as any).bannerUrl
   });
   
   alert('Pembayaran Mitra Unggulan berhasil diverifikasi!');
   return;
 }

 // Update transaction status to paid
 if ((payment as any).transactionId) {
 await updateDoc(doc(db, 'transactions', (payment as any).transactionId), {
 status: 'paid',
 updatedAt: serverTimestamp()
 });
 }

 // Send notification to chat
 await addDoc(collection(db, 'chats', payment.mitraId, 'messages'), {
 sender: 'mitra', // Admin acting as system/mitra
 type: 'text',
 content: `✅ Pembayaran DP 10% sebesar Rp ${payment.dpAmount.toLocaleString()} telah diverifikasi. Pekerjaan dapat dimulai.`,
 time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
 timestamp: serverTimestamp()
 });

 // Send payment_success notification to Mitra
 await addDoc(collection(db, 'notifications'), {
 recipientId: payment.mitraId,
 title: 'Pembayaran DP Diverifikasi!',
 message: `Pelanggan sudah bayar DP 10%.\nSilahkan hubungi pelanggan\nSelamat bekerja dan semangat demi keluarga ❤️`,
 type: 'payment_success',
 isRead: false,
 createdAt: serverTimestamp()
 });

 alert('Pembayaran berhasil diverifikasi!');
 } catch (error: any) {
 alert('Gagal memverifikasi: ' + error.message);
 }
 };

 const rejectPayment = async () => {
 if (!user || !selectedPaymentForView) return;
 try {
 await updateDoc(doc(db, 'payments', selectedPaymentForView.id), {
 status: 'rejected',
 verifiedBy: user.uid,
 verifiedAt: serverTimestamp(),
 verificationNote: rejectionNote
 });

 if ((selectedPaymentForView as any).type === 'highlight_ad') {
   alert(`Pendaftaran Mitra Unggulan ditolak. Alasan: ${rejectionNote}`);
   setShowRejectModal(false);
   setSelectedPaymentForView(null);
   setRejectionNote('');
   return;
 }

 // Send notification to chat
 await addDoc(collection(db, 'chats', selectedPaymentForView.mitraId, 'messages'), {
 sender: 'mitra',
 type: 'text',
 content: `❌ Pembayaran DP 10% ditolak. Alasan: ${rejectionNote}. Silakan upload ulang.`,
 time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
 timestamp: serverTimestamp()
 });

 setShowRejectModal(false);
 setSelectedPaymentForView(null);
 setRejectionNote('');
 alert('Pembayaran ditolak.');
 } catch (error: any) {
 alert('Gagal menolak: ' + error.message);
 }
 };

 useEffect(() => {
 if (chatEndRef.current) {
 chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
 }
 }, [messages]);

 const formatPrice = (price: any) => {
 if (!price) return '0';
 const num = typeof price === 'string' ? parseInt(price.replace(/\D/g, ''), 10) : price;
 return isNaN(num) ? '0' : num.toLocaleString('id-ID');
 };

  const filteredServices = services.filter(s => {
    // Only show active ads (loose check)
    if (s.status !== 'aktif' && s.status !== 'active') return false;
    
    const title = s.title || '';
    const adCat = (s.category || s.cat || '').toLowerCase();
    const adSubCat = (s.subcat || s.subCategory || '').toLowerCase();
    
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCat === 'all' || adCat === selectedCat.toLowerCase();
    const matchesSubCat = selectedSub === 'all' || adSubCat === selectedSub.toLowerCase();
    
    let matchesLocation = true;
    if (currentAddress && currentAddress !== 'Lokasi Bandung Raya & Cimahi' && currentAddress !== 'Lokasi Terdeteksi' && currentAddress !== 'Mendeteksi...') {
      const adCity = s.city || '';
      const adDistrict = s.district || '';
      const adCoverage = s.coverageAreas || [];
      
      if (currentAddress.includes(',')) {
        // Format: "District, City"
        const [dist, city] = currentAddress.split(',').map(str => str.trim());
        matchesLocation = (adCity === city && adDistrict === dist) || adCoverage.includes(city);
      } else {
        // Format: "City" or detected location
        // If it's a known city, filter by it. Otherwise, assume it's a detected location and don't strictly filter, or maybe we should?
        // Let's just check if it's a known city.
        const knownCities = ['Kota Bandung', 'Kota Cimahi', 'Kab. Bandung', 'Kab. Bandung Barat (KBB)'];
        if (knownCities.includes(currentAddress)) {
          matchesLocation = adCity === currentAddress || adCoverage.includes(currentAddress);
        } else {
          // It's a detected location (e.g., "Cibiru") or something else. We won't filter strictly to avoid hiding all ads.
          matchesLocation = true;
        }
      }
    }
    
    return matchesSearch && matchesCat && matchesSubCat && matchesLocation;
  });



 const handleSaveAddress = async () => {
 if (!user) return;
 try {
 if (isMitra) {
 await updateDoc(doc(db, 'mitras', user.uid), { address: tempAddress });
 } else {
 await setDoc(doc(db, 'users', user.uid), { address: tempAddress }, { merge: true });
 }
 setUserAddress(tempAddress);
 setIsEditingAddress(false);
 alert('Alamat berhasil disimpan!');
 } catch (error: any) {
 alert('Gagal menyimpan alamat: ' + error.message);
 }
 };

 

 const handleProfilePhotoClick = () => {
 profilePhotoInputRef.current?.click();
 };

 const handleProfilePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (!file || !user) return;

 if (file.size > 2 * 1024 * 1024) {
 alert('File terlalu besar. Maksimal 2MB.');
 return;
 }

 setIsUploadingProfile(true);
 try {
 const photoRef = storageRef(storage, `profile_photos/${user.uid}`);
 await uploadBytes(photoRef, file);
 const downloadURL = await getDownloadURL(photoRef);
 
 await updateProfile(user, { photoURL: downloadURL });
 
 // Force reload user to update UI
 await auth.currentUser?.reload();
 setUser({ ...auth.currentUser } as FirebaseUser);
 
 // Update firestore if user is a mitra
 if (isMitra) {
 const mitraDocRef = doc(db, 'mitras', user.uid);
 await updateDoc(mitraDocRef, { foto: downloadURL });
 }

 alert('Foto profil berhasil diperbarui!');
 } catch (error: any) {
 console.error("Error uploading profile photo:", error);
 alert('Gagal mengunggah foto profil: ' + error.message);
 } finally {
 setIsUploadingProfile(false);
 }
 };

 const navigateTo = (page: Page) => {
 if (page === 'beranda') {
 setSelectedCat('all');
 setSelectedSub('all');
 }
 if (page === 'edit-profil' && user) {
 setEditProfileName(user.displayName || '');
 setEditProfileEmail(user.email || '');
 getDoc(doc(db, isMitra ? 'mitras' : 'users', user.uid)).then(docSnap => {
 if (docSnap.exists()) {
 setEditProfilePhone(docSnap.data().phone || docSnap.data().wa || '');
 }
 });
 }
 setPrevPage(activePage);
 setActivePage(page);
 window.scrollTo({ top: 0, behavior: 'smooth' });
 };

 const handleBack = () => {
 if (prevPage) {
 if (prevPage === 'beranda') {
 setSelectedCat('all');
 setSelectedSub('all');
 }
 setActivePage(prevPage);
 setPrevPage(null);
 } else {
 setSelectedCat('all');
 setSelectedSub('all');
 setActivePage('beranda');
 }
 };

 const handleToggleAdStatus = async (adId: string, currentStatus: string) => {
 try {
 const newStatus = currentStatus === 'aktif' ? 'nonaktif' : 'aktif';
 await updateDoc(doc(db, 'iklan', adId), { status: newStatus });
 } catch (error) {
 console.error("Error toggling ad status:", error);
 alert('Gagal mengubah status iklan.');
 }
 };

 const handleDeleteAd = async (adId: string) => {
 if (!window.confirm('Apakah Anda yakin ingin menghapus iklan ini?')) return;
 try {
 await deleteDoc(doc(db, 'iklan', adId));
 } catch (error) {
 console.error("Error deleting ad:", error);
 alert('Gagal menghapus iklan.');
 }
 };

 const handleEditAd = (ad: any) => {
 setEditingAdId(ad.id);
 setAdTitle(ad.title);
 setAdCategory(ad.cat || ad.category);
 setAdSubCategory(ad.subcat);
 setAdPrice(ad.price.toString());
 setAdServicePolicy(ad.servicePolicy || 'Bisa bawa Alat & Material');
 setAdDesc(ad.desc);
 setAdImage(ad.img);
 setAdProvince(ad.province || 'Jawa Barat');
 setAdCity(ad.city || '');
 setAdDistrict(ad.district || '');
 setAdCoverageAreas(ad.coverageAreas || []);
 setAdSkills(ad.skills || []);
 setShowAdModal(true);
 };

 const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (file) {
 const reader = new FileReader();
 reader.onloadend = () => {
 setAdImage(reader.result as string);
 };
 reader.readAsDataURL(file);
 }
 };

 const openMitraProfile = async (service: any) => {
 if (!service.mitraId) {
 alert('Data mitra tidak ditemukan.');
 return;
 }
 try {
 let mitraData: any = null;
 try {
 const mitraDoc = await getDoc(doc(db, 'mitras', service.mitraId));
 if (mitraDoc.exists()) {
 mitraData = mitraDoc.data();
 }
 } catch (err: any) {
 console.warn("Could not fetch mitra doc, using fallback data:", err);
 }

 if (mitraData) {
 setSelectedMitra({
 id: service.mitraId,
 name: mitraData.namaUsaha || mitraData.namaLengkap || service.mitraName || 'Mitra',
 foto: mitraData.fotoProfil || service.img,
 lokasi: mitraData.city || 'Lokasi tidak diketahui',
 tentang: mitraData.bio || 'Belum ada deskripsi profil.',
 alamatLengkap: mitraData.address || mitraData.alamatLengkap || 'Alamat tidak tersedia',
 phone: mitraData.phone || '-',
 jenisMitra: mitraData.jenisMitra || '-',
 statusKeahlian: mitraData.statusKeahlian || '-',
 pengalaman: mitraData.pengalaman || 0,
 proyek: mitraData.proyekSelesai || 0,
 kepuasan: mitraData.rating ? `${(mitraData.rating * 20)}%` : '0%',
 rating: mitraData.rating || 0,
 layanan: mitraData.layanan || [service.category],
 coverageAreas: mitraData.coverageAreas || service.coverageAreas || [],
 skills: mitraData.skills || service.skills || []
 });
 } else {
 // Fallback if mitra document is not accessible or doesn't exist
 setSelectedMitra({
 id: service.mitraId,
 name: service.mitraName || 'Mitra',
 foto: service.img,
 lokasi: service.location || 'Lokasi tidak diketahui',
 tentang: 'Belum ada deskripsi profil.',
 alamatLengkap: 'Alamat tidak tersedia',
 phone: '-',
 jenisMitra: '-',
 statusKeahlian: '-',
 pengalaman: 0,
 proyek: 0,
 kepuasan: '0%',
 rating: service.rating || 0,
 layanan: [service.category],
 coverageAreas: service.coverageAreas || [],
 skills: service.skills || []
 });
 }
 
 // Fetch reviews
 try {
 const reviewsQuery = query(collection(db, 'reviews'), where('mitraId', '==', service.mitraId));
 const reviewsSnapshot = await getDocs(reviewsQuery);
 const reviewsData = reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
 setMitraReviews(reviewsData);
 } catch (err: any) {
 console.warn("Could not fetch reviews:", err);
 setMitraReviews([]);
 }
 
 navigateTo('profil-mitra');
 } catch (error) {
 console.error("Error fetching mitra profile:", error);
 alert('Gagal memuat profil mitra.');
 }
 };

 const addExperience = () => {
 setExperiences([...experiences, { id: experiences.length + 1, company: '', position: '', start: '', end: '', desc: '' }]);
 };

 const removeExperience = (id: number) => {
 if (experiences.length > 1) {
 setExperiences(experiences.filter(e => e.id !== id));
 }
 };
 const openDealModal = () => {
 const trans = transactions.find(t => 
 ((t.customerID === user?.uid && t.mitraID === chatMitra?.id) ||
 (t.mitraID === user?.uid && t.customerID === chatMitra?.id)) &&
 (t.status === 'pending' || t.status === 'deal_agreed')
 );

 if (!trans) {
 alert("Belum ada penawaran harga yang aktif. Silakan minta mitra untuk mengirimkan penawaran terlebih dahulu.");
 return;
 }

 setActiveTransaction(trans);
 const price = trans.totalPrice || 0;
 const jaminan = trans.dpAmount || 0;
 setActiveDeal({
 jasa: chatMitra?.serviceTitle || 'Layanan Jasa',
 mitra: chatMitra?.name || 'Mitra Jasa',
 total: price,
 jaminan: jaminan,
 sisa: price - jaminan
 });
 setShowDealModal(true);
 };

 

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (file) {
 if (file.size > 2 * 1024 * 1024) {
 alert('File terlalu besar. Maksimal 2MB.');
 return;
 }
 setPaymentProof(file);
 const reader = new FileReader();
 reader.onloadend = () => {
 setPaymentProofPreview(reader.result as string);
 };
 reader.readAsDataURL(file);
 }
 };

 

 




  const submitAd = async () => {
    if (!adTitle || !adCategory || !adSubCategory || !adPrice || !adDesc || !adProvince || !adCity || !adDistrict) {
      alert('Mohon lengkapi semua data iklan');
      return;
    }
    
    setIsSubmittingAd(true);
    try {
      const cleanPrice = Number(adPrice.toString().replace(/[^0-9]/g, ''));

      const adData = {
        title: adTitle,
        cat: adCategory,
        category: adCategory,
        subcat: adSubCategory,
        price: cleanPrice,
        servicePolicy: adServicePolicy,
        desc: adDesc,
        province: adProvince,
        city: adCity,
        district: adDistrict,
        location: `${adDistrict}, ${adCity}, ${adProvince}`,
        coverageAreas: adCoverageAreas,
        skills: adSkills,
        img: adImage || '',
        mitraId: user?.uid,
        mitraName: user?.displayName || 'Mitra Baru',
      };

      if (editingAdId) {
        await updateDoc(doc(db, 'iklan', editingAdId), adData);
        alert('Iklan jasa berhasil diperbarui!');
      } else {
        await addDoc(collection(db, 'iklan'), {
          ...adData,
          rating: 5.0,
          reviews: 0,
          status: 'aktif',
          createdAt: serverTimestamp()
        });
        alert('Iklan jasa berhasil dipasang!');
      }
      
      setShowAdModal(false); 
      setEditingAdId(null);
      setAdTitle('');
      setAdCategory('');
      setAdSubCategory('');
      setAdPrice('');
      setAdServicePolicy('Bisa bawa Alat & Material');
      setAdDesc('');
      setAdImage(null);
      setAdProvince('');
      setAdCity('');
      setAdDistrict('');
      setAdCoverageAreas([]);
      setAdSkills([]);
    } catch (error) {
      console.error("Error saving ad:", error);
      alert('Gagal menyimpan iklan. Silakan coba lagi.');
    } finally {
      setIsSubmittingAd(false);
    }
  };

  const submitBooking = async () => {
    if (!bookingName || !bookingAddress || !bookingDesc) {
      alert('Mohon lengkapi data pemesanan');
      return;
    }

    setIsSubmittingBooking(true);
    try {
      const basePrice = parseInt(bookingService.price.replace(/[^0-9]/g, '')) || 0;
      const total = basePrice;
      const dp = Math.round(total * 0.1);

      await addDoc(collection(db, 'orders'), {
        serviceId: bookingService.id,
        serviceTitle: bookingService.title,
        mitraId: bookingService.mitraId || 'unknown',
        mitraName: bookingService.mitraName || 'Mitra Jasa',
        customerId: user?.uid,
        customerName: bookingName,
        address: bookingAddress,
        description: bookingDesc,
        category: bookingService.category,
        servicePolicy: bookingService.servicePolicy || 'Bisa bawa Alat & Material',
        totalPrice: total,
        dpAmount: dp,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      alert('Pemesanan berhasil dikirim! Silakan tunggu konfirmasi dari mitra.');
      setBookingService(null);
      setBookingName('');
      setBookingAddress('');
      setBookingDesc('');
      navigateTo('pesan');
    } catch (error) {
      console.error("Error adding booking:", error);
      alert('Gagal mengirim pemesanan. Silakan coba lagi.');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const submitReview = async () => {
    if (!reviewTransaction || !user) return;
    setIsSubmittingReview(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        mitraId: reviewTransaction.mitraID,
        customerId: user.uid,
        customerName: user.displayName || 'Pelanggan',
        rating: reviewRating,
        text: reviewText,
        serviceId: reviewTransaction.serviceId,
        transactionId: reviewTransaction.id,
        createdAt: serverTimestamp()
      });
      
      // Optional: Update average rating on the ad (service)
      if (reviewTransaction.serviceId) {
        const adRef = doc(db, 'iklan', reviewTransaction.serviceId);
        const adSnap = await getDoc(adRef);
        if (adSnap.exists()) {
          const adData = adSnap.data();
          const currentReviews = adData.reviews || 0;
          const currentRating = adData.rating || 5;
          const newReviews = currentReviews + 1;
          const newRating = ((currentRating * currentReviews) + reviewRating) / newReviews;
          await updateDoc(adRef, {
            rating: newRating,
            reviews: newReviews
          });
        }
      }
      
      // Update transaction to mark as reviewed
      await updateDoc(doc(db, 'transactions', reviewTransaction.id), {
        isReviewed: true
      });
      
      alert('Terima kasih atas ulasan Anda!');
      setShowReviewModal(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Gagal mengirim ulasan. Silakan coba lagi.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

 if (isSplash) return <SplashScreen onComplete={() => { 
 setIsSplash(false); 
 if (!user) {
 setShowOnboarding(true); 
 }
 }} />;
 if (showOnboarding) return <OnboardingScreen onSelect={(role) => { 
 setUserRole(role); 
 localStorage.setItem('userRole', role);
 setShowOnboarding(false); 
 }} />;

 if (user && userRole === 'mitra' && mitraStatus === 'pending') {
 return (
 <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
 <motion.div 
 initial={{ scale: 0.8, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 className="w-32 h-32 bg-primary/10 rounded-[40px] flex items-center justify-center text-primary mb-8"
 >
 <Hourglass size={64} className="animate-pulse" />
 </motion.div>
 <h1 className="text-2xl font-black text-slate-800 mb-4 tracking-tighter">
 Akun Anda Sedang Ditinjau Admin <span className="text-primary">JASAMITRA</span>
 </h1>
 <p className="text-sm text-slate-500 font-medium leading-relaxed mb-12">
 Kami sedang memverifikasi KTP dan Sertifikat Anda (Estimasi 1x24 jam). Anda akan menerima notifikasi jika sudah aktif.
 </p>
 <button 
 onClick={handleLogout}
 className="w-full max-w-xs bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
 >
 <LogOut size={18} /> Logout / Keluar
 </button>
 </div>
 );
 }

 return (
 <div className="min-h-screen pb-24">
 <AnimatePresence mode="wait">
 
 {/* --- BERANDA --- */}

 {activePage === 'beranda' && (
 <Home
 user={user}
 userRole={userRole}
 navigateTo={navigateTo}
 isFirebaseConfigured={isFirebaseConfigured}
 searchQuery={searchQuery}
 setSearchQuery={setSearchQuery}
 showNotifDropdown={showNotifDropdown}
 setShowNotifDropdown={setShowNotifDropdown}
 unreadNotifCount={unreadNotifCount}
 markNotifsAsRead={markNotifsAsRead}
 notifications={notifications}
 CATEGORIES={CATEGORIES}
 selectedCat={selectedCat}
 setSelectedCat={setSelectedCat}
 setSelectedSub={setSelectedSub}
 services={services}
 filteredServices={filteredServices}
 openMitraProfile={openMitraProfile}
 formatPrice={formatPrice}
 currentAddress={currentAddress}
 setShowLocationModal={setShowLocationModal}
 favorites={favorites}
 toggleFavorite={toggleFavorite}
 />
 )}

 {/* --- PESAN (CHAT LIST) --- */}

 {activePage === 'pesan' && (
 <Messages
 user={user}
 userChats={userChats}
 setChatMitra={setChatMitra}
 navigateTo={navigateTo}
 />
 )}

 {/* --- EDIT PROFIL --- */}

 {activePage === 'edit-profil' && (
 <EditProfile
 user={user}
 isMitra={isMitra}
 handleBack={handleBack}
 navigateTo={navigateTo}
 profilePhotoInputRef={profilePhotoInputRef}
 handleProfilePhotoChange={handleProfilePhotoChange}
 handleProfilePhotoClick={handleProfilePhotoClick}
 isUploadingProfile={isUploadingProfile}
 editProfileName={editProfileName}
 setEditProfileName={setEditProfileName}
 editProfileEmail={editProfileEmail}
 setEditProfileEmail={setEditProfileEmail}
 editProfilePhone={editProfilePhone}
 setEditProfilePhone={setEditProfilePhone}
 />
 )}

 {/* --- ALAMAT SAYA --- */}

 {activePage === 'alamat-saya' && (
 <MyAddress
 handleBack={handleBack}
 isEditingAddress={isEditingAddress}
 setIsEditingAddress={setIsEditingAddress}
 tempAddress={tempAddress}
 setTempAddress={setTempAddress}
 handleSaveAddress={handleSaveAddress}
 userAddress={userAddress}
 />
 )}

 {/* --- IKLAN SAYA --- */}

 {activePage === 'iklan-saya' && (
 <MyAds
 handleBack={handleBack}
 myAds={myAds}
 CATEGORIES={CATEGORIES}
 SUB_CATEGORIES={SUB_CATEGORIES}
 formatPrice={formatPrice}
 handleEditAd={handleEditAd}
 handleToggleAdStatus={handleToggleAdStatus}
 handleDeleteAd={handleDeleteAd}
 />
 )}

 {activePage === 'daftar-mitra-unggulan' && (
 <DaftarMitraUnggulan
 user={user}
 myAds={myAds}
 handleBack={handleBack}
 navigateTo={navigateTo}
 />
 )}

 {activePage === 'pusat-bantuan' && (
 <PusatBantuan
 userRole={userRole}
 handleBack={handleBack}
 navigateTo={navigateTo}
 />
 )}

 {['bantuan-order', 'bantuan-akun', 'bantuan-pembayaran', 'bantuan-aplikasi', 'bantuan-pesanan-pelanggan', 'bantuan-akun-pelanggan', 'bantuan-pembayaran-pelanggan', 'bantuan-layanan-pelanggan'].includes(activePage) && (
 <BantuanDetail
 type={activePage.replace('bantuan-', '') as any}
 handleBack={handleBack}
 navigateTo={navigateTo}
 />
 )}

 {activePage === 'semua-kategori' && (
 <SemuaKategori
 CATEGORIES={CATEGORIES}
 setSelectedCat={setSelectedCat}
 setSelectedSub={setSelectedSub}
 navigateTo={navigateTo}
 handleBack={handleBack}
 />
 )}

 {activePage === 'favorit' && (
 <Favorit
 favorites={favorites}
 services={services}
 toggleFavorite={toggleFavorite}
 navigateTo={navigateTo}
 handleBack={handleBack}
 openMitraProfile={openMitraProfile}
 user={user}
 />
 )}

 {activePage === 'invoice' && (
 <Invoice handleBack={handleBack} />
 )}

 {activePage === 'statistik-mitra' && (
 <MitraStats handleBack={handleBack} transactions={transactions} user={user} />
 )}

 {activePage === 'jadwal-mitra' && (
 <MitraSchedule handleBack={handleBack} />
 )}

 {activePage === 'lacak-lokasi' && (
 <LiveTracking handleBack={handleBack} />
 )}

 {/* --- LAYANAN (PROGRESS) --- */}

 {activePage === 'layanan' && (
 <Progress
 user={user}
 transactions={transactions}
 setReviewTransaction={setReviewTransaction}
 setReviewRating={setReviewRating}
 setReviewText={setReviewText}
 setShowReviewModal={setShowReviewModal}
 navigateTo={navigateTo}
 />
 )}

 
 {/* --- AKUN --- */}
 {activePage === 'akun' && (
 <Account 
 user={user} 
 userRole={userRole} 
 navigateTo={navigateTo} 
 setShowLoginMitraModal={setShowLoginMitraModal} 
 handleLogout={handleLogout} 
 />
 )}

 {/* --- CHAT --- */}

 {activePage === 'chat' && (
 <ChatRoom
 user={user}
 userRole={userRole}
 chatMitra={chatMitra}
 chatMitraPhone={chatMitraPhone}
 transactions={transactions}
 messages={messages}
 inputText={inputText}
 setInputText={setInputText}
 sendMessage={sendMessage}
 handleBack={handleBack}
 setShowOfferModal={setShowOfferModal}
 setActiveTransaction={setActiveTransaction}
 setPaymentAmount={setPaymentAmount}
 setPaymentProof={setPaymentProof}
 setPaymentProofPreview={setPaymentProofPreview}
 setShowPaymentModal={setShowPaymentModal}
 openDealModal={openDealModal}
 chatEndRef={chatEndRef}
 />
 )}

 {/* --- ADMIN PEMBAYARAN --- */}

 {activePage === 'admin-pembayaran' && (
 <AdminPayment
 handleBack={handleBack}
 pendingPayments={pendingPayments}
 setSelectedPaymentForView={setSelectedPaymentForView}
 verifyPayment={verifyPayment}
 setShowRejectModal={setShowRejectModal}
 />
 )}

 {/* --- SUBKATEGORI & POSTINGAN --- */}
 {activePage === 'subkategori' && (
 <SubCategoryPage
 selectedCat={selectedCat}
 selectedSub={selectedSub}
 CATEGORIES={CATEGORIES}
 SUB_CATEGORIES={SUB_CATEGORIES}
 filteredServices={filteredServices}
 user={user}
 setSelectedSub={setSelectedSub}
 handleBack={handleBack}
 navigateTo={navigateTo}
 openMitraProfile={openMitraProfile}
 setBookingService={setBookingService}
 formatPrice={formatPrice}
 favorites={favorites}
 toggleFavorite={toggleFavorite}
 />
 )}


 {/* --- PESANAN MASUK (MITRA) --- */}
 {activePage === 'pesanan' && (
 <IncomingOrders
 mitraOrders={mitraOrders}
 handleBack={handleBack}
 navigateTo={navigateTo}
 setChatMitra={setChatMitra}
 />
 )}
 {activePage === 'profil-mitra' && selectedMitra && (
 <MitraProfile
 selectedMitra={selectedMitra}
 mitraReviews={mitraReviews}
 transactions={transactions}
 user={user}
 onBack={handleBack}
 onChat={(id, name) => {
 setChatMitra({ id, name });
 navigateTo('chat');
 }}
 />
 )}
 {activePage === 'daftar-mitra' && (
 <RegisterMitra
        DISTRICTS={DISTRICTS}
 handleBack={handleBack}
 navigateTo={navigateTo}
 setIsMitra={setIsMitra}
 />
 )}

 {/* --- SYARAT PENDAFTARAN MITRA --- */}
 {activePage === 'syarat-pendaftaran-mitra' && (
 <SyaratPendaftaranMitra handleBack={() => navigateTo('daftar-mitra')} />
 )}

 {/* --- PERATURAN PELANGGAN --- */}
 {activePage === 'peraturan-pelanggan' && (
 <PeraturanPelanggan handleBack={handleBack} />
 )}

 {/* --- PROTOKOL MITRA --- */}
 {activePage === 'protokol-mitra' && (
 <ProtokolMitra handleBack={handleBack} />
 )}

 {/* --- JAMINAN KEAMANAN --- */}
 {activePage === 'jaminan-keamanan' && (
 <JaminanKeamanan handleBack={handleBack} />
 )}

 {/* --- LOGIN --- */}
 {activePage === 'login' && (
 <Login userRole={userRole} handleBack={handleBack} navigateTo={navigateTo} />
 )}

 {/* --- KEBIJAKAN --- */}
 {activePage === 'kebijakan' && (
 <KebijakanPrivasi handleBack={handleBack} navigateTo={navigateTo} />
 )}

 {/* --- SYARAT & KETENTUAN --- */}
 {activePage === 'syarat-ketentuan' && (
 <SyaratKetentuan handleBack={handleBack} navigateTo={navigateTo} />
 )}

 </AnimatePresence>

  {/* --- MODALS --- */}
  <Modals
    showAdModal={showAdModal} setShowAdModal={setShowAdModal} editingAdId={editingAdId} setEditingAdId={setEditingAdId}
    adTitle={adTitle} setAdTitle={setAdTitle} adCategory={adCategory} setAdCategory={setAdCategory} adSubCategory={adSubCategory} setAdSubCategory={setAdSubCategory}
    adCity={adCity} setAdCity={setAdCity} adDistrict={adDistrict} setAdDistrict={setAdDistrict} adProvince={adProvince} setAdProvince={setAdProvince}
    adCoverageAreas={adCoverageAreas} setAdCoverageAreas={setAdCoverageAreas} adPrice={adPrice} setAdPrice={setAdPrice}
    adServicePolicy={adServicePolicy} setAdServicePolicy={setAdServicePolicy} adImage={adImage} setAdImage={setAdImage}
    adDesc={adDesc} setAdDesc={setAdDesc} adSkills={adSkills} setAdSkills={setAdSkills} newSkill={newSkill} setNewSkill={setNewSkill}
    isSubmittingAd={isSubmittingAd} fileInputRef={fileInputRef} handleImageUpload={handleImageUpload} submitAd={submitAd}
    showDealModal={showDealModal} setShowDealModal={setShowDealModal} activeDeal={activeDeal} confirmDeal={confirmDeal}
    bookingService={bookingService} setBookingService={setBookingService} bookingName={bookingName} setBookingName={setBookingName}
    bookingAddress={bookingAddress} setBookingAddress={setBookingAddress} bookingDesc={bookingDesc} setBookingDesc={setBookingDesc}
    isSubmittingBooking={isSubmittingBooking} submitBooking={submitBooking}
    showReviewModal={showReviewModal} setShowReviewModal={setShowReviewModal} reviewRating={reviewRating} setReviewRating={setReviewRating}
    reviewText={reviewText} setReviewText={setReviewText} isSubmittingReview={isSubmittingReview} reviewTransaction={reviewTransaction} submitReview={submitReview}
    showOfferModal={showOfferModal} setShowOfferModal={setShowOfferModal} offerPrice={offerPrice} setOfferPrice={setOfferPrice}
    isSendingOffer={isSendingOffer} handleSendOffer={handleSendOffer}
    showPaymentModal={showPaymentModal} setShowPaymentModal={setShowPaymentModal} paymentAmount={paymentAmount} paymentProofPreview={paymentProofPreview}
    isUploadingPayment={isUploadingPayment} handleFileChange={handleFileChange} submitPayment={submitPayment}
    showRejectModal={showRejectModal} setShowRejectModal={setShowRejectModal} rejectionNote={rejectionNote} setRejectionNote={setRejectionNote}
    rejectPayment={rejectPayment} selectedPaymentForView={selectedPaymentForView} setSelectedPaymentForView={setSelectedPaymentForView}
    showLoginMitraModal={showLoginMitraModal} setShowLoginMitraModal={setShowLoginMitraModal} navigateTo={navigateTo}
    showLocationModal={showLocationModal} setShowLocationModal={setShowLocationModal} currentAddress={currentAddress} setCurrentAddress={handleSetCurrentAddress} recentLocations={recentLocations} detectLocation={detectLocation}
  />

 {/* Bottom Nav (Only on main pages) */}
 {['beranda', 'pesan', 'layanan', 'akun'].includes(activePage) && (
 <AppBottomNav 
 activePage={activePage} 
 onNav={navigateTo} 
 onAdd={() => {
 if (isMitra) {
 setEditingAdId(null);
 setAdTitle('');
 setAdCategory('');
 setAdSubCategory('');
 setAdPrice('');
 setAdServicePolicy('Bisa bawa Alat & Material');
 setAdDesc('');
 setAdImage(null);
 setAdProvince('');
 setAdCity('');
 setAdDistrict('');
 setShowAdModal(true);
 } else {
 navigateTo('daftar-mitra');
 }
 }} 
 userRole={userRole} 
 />
 )}
 </div>
 );
}

