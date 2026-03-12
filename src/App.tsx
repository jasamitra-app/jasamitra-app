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
  Home, 
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

// --- Types ---
type Page = 'beranda' | 'pesan' | 'layanan' | 'akun' | 'login' | 'daftar-mitra' | 'kebijakan' | 'syarat-ketentuan' | 'edit-profil' | 'alamat-saya' | 'iklan-saya' | 'chat' | 'profil-mitra' | 'pesanan' | 'subkategori' | 'peraturan-pelanggan' | 'protokol-mitra' | 'jaminan-keamanan' | 'admin-pembayaran' | 'syarat-pendaftaran-mitra';

interface Payment {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  mitraId: string;
  mitraName: string;
  dealAmount: number;
  dpAmount: number;
  mitraAmount: number;
  proofUrl: string;
  status: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
  verifiedAt?: any;
  verificationNote?: string;
  createdAt: any;
}

interface Transaction {
  id: string;
  customerID: string;
  mitraID: string;
  serviceId?: string;
  totalPrice: number;
  dpAmount: number;
  status: 'pending' | 'paid' | 'completed';
  proofUrl?: string;
  createdAt: any;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'mitra';
  type: 'text' | 'image';
  content: string;
  time: string;
  isDeal?: boolean;
  dealData?: any;
}

interface Order {
  id: string;
  title: string;
  status: 'proses' | 'selesai' | 'batal';
  price: string;
  date: string;
  technician: string;
  progress: number;
  update?: string;
}

// --- Components ---
// --- Components ---

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white overflow-hidden"
    >
      {/* Subtle Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-[#003366]/5 to-transparent blur-3xl" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tl from-[#F27D26]/5 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-8"
        >
          {/* White Logo Box */}
          <div className="w-32 h-32 bg-white rounded-[40px] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent opacity-50" />
            <Handshake size={64} className="text-[#003366] relative z-10 drop-shadow-sm" />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <h1 className="text-5xl font-black tracking-tight flex items-center justify-center drop-shadow-sm">
            <span className="text-[#003366]">JASA</span>
            <span className="text-[#F27D26]">MITRA</span>
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.3em] mt-4">
            Solusi Jasa Terpercaya
          </p>
        </motion.div>

        {/* Loading Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-16 w-48 h-1 bg-slate-100 rounded-full overflow-hidden relative"
        >
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-[#F27D26] to-transparent rounded-full"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

const OnboardingScreen = ({ onSelect }: { onSelect: (role: 'tamu' | 'mitra') => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9998] bg-white text-slate-900 flex flex-col px-8 py-12"
    >
      <div className="flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-4xl font-black leading-tight tracking-tighter mb-4">
            Selamat Datang di <br/>
            <span className="text-[#003366]">JASA</span>
            <span className="text-[#F27D26]">MITRA</span>
          </h2>
          <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[280px]">
            Pilih peran Anda untuk memulai pengalaman terbaik bersama kami.
          </p>
        </motion.div>

        <div className="mt-12 space-y-4">
          <motion.button
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect('tamu')}
            className="w-full bg-slate-50 border border-slate-100 text-slate-900 p-6 rounded-[32px] flex items-center gap-5 shadow-sm group transition-all hover:bg-primary hover:text-white"
          >
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary group-hover:bg-white/20 group-hover:text-white transition-colors shadow-sm">
              <User size={28} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-lg">Sebagai Tamu</h3>
              <p className="text-xs opacity-60 font-medium">Cari jasa & pesan layanan</p>
            </div>
            <ChevronRight className="ml-auto opacity-30" size={20} />
          </motion.button>

          <motion.button
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect('mitra')}
            className="w-full bg-slate-50 border border-slate-100 p-6 rounded-[32px] flex items-center gap-5 group transition-all hover:bg-accent hover:text-slate-900"
          >
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-accent group-hover:bg-white/20 group-hover:text-slate-900 transition-colors shadow-sm">
              <Handshake size={28} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-lg">Sebagai Mitra</h3>
              <p className="text-xs opacity-60 font-medium">Tawarkan jasa & raih penghasilan</p>
            </div>
            <ChevronRight className="ml-auto opacity-30" size={20} />
          </motion.button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          Dengan melanjutkan, Anda menyetujui <br/>
          <span className="text-slate-900 underline">Syarat & Ketentuan</span> kami
        </p>
      </motion.div>
    </motion.div>
  );
};

const BottomNav = ({ activePage, onNav, onAdd, userRole }: { activePage: Page, onNav: (p: Page) => void, onAdd: () => void, userRole: 'tamu' | 'mitra' | null }) => {
  const navItems = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'pesan', label: 'Pesan', icon: MessageSquare },
    { id: 'add', label: '', icon: Plus, isSpecial: true },
    { id: 'layanan', label: 'Progress', icon: LayoutGrid },
    { id: 'akun', label: 'Akun', icon: User },
  ];

  return (
    <nav className="fixed bottom-6 left-6 right-6 bg-white/80 backdrop-blur-xl h-16 flex items-center justify-around px-2 z-[1000] rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/20">
      {navItems.map((item) => {
        if (item.isSpecial) {
          if (userRole === 'tamu') return <div key={item.id} className="flex-1" />;
          return (
            <div key={item.id} className="relative -top-8">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onAdd}
                className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/40 border-4 border-white neo-3d"
              >
                <Plus size={28} strokeWidth={3} />
              </motion.button>
            </div>
          );
        }

        const isActive = activePage === item.id;
        const Icon = item.icon;

        return (
          <button 
            key={item.id}
            onClick={() => onNav(item.id as Page)}
            className={`flex flex-col items-center justify-center flex-1 transition-all duration-300 relative ${isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <motion.div
              animate={isActive ? { y: -2 } : { y: 0 }}
              className="flex flex-col items-center"
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[9px] mt-1 font-bold uppercase tracking-tighter transition-opacity ${isActive ? 'opacity-100' : 'opacity-70'}`}>{item.label}</span>
            </motion.div>
            {isActive && (
              <motion.div 
                layoutId="nav-indicator"
                className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};



const LocationModal = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  currentLocation,
  recentLocations,
  currentAddress,
  onDetectLocation
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSelect: (loc: string) => void,
  currentLocation: string,
  recentLocations: string[],
  currentAddress: string,
  onDetectLocation: () => void
}) => {
  const [search, setSearch] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string | null>("Jawa Barat");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const filteredProvinces = PROVINCES.filter(p => p.toLowerCase().includes(search.toLowerCase()));
  const filteredCities = selectedProvince ? (CITIES[selectedProvince] || []).filter(c => c.toLowerCase().includes(search.toLowerCase())) : [];
  const filteredDistricts = selectedCity ? (DISTRICTS[selectedCity] || []).filter(d => d.toLowerCase().includes(search.toLowerCase())) : [];

  const handleBack = () => {
    if (selectedCity) {
      setSelectedCity(null);
    } else {
      onClose();
    }
  };

  const resetSelection = () => {
    setSelectedProvince("Jawa Barat");
    setSelectedCity(null);
    setSearch('');
  };

  useEffect(() => {
    if (!isOpen) {
      resetSelection();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[2000] bg-white flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center px-4 py-4 border-b border-slate-100">
            <button onClick={handleBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              {selectedCity ? <ArrowLeft size={24} className="text-slate-600" /> : <X size={24} className="text-slate-600" />}
            </button>
            <h2 className="ml-4 text-xl font-bold text-slate-800">
              {!selectedCity ? 'Pilih Kota/Kabupaten' : `Kecamatan di ${selectedCity}`}
            </h2>
          </div>

          {/* Search Bar */}
          <div className="px-6 py-4">
            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-primary/30 transition-all">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder={!selectedCity ? "Cari kota/kabupaten..." : "Cari kecamatan..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ml-3 w-full bg-transparent outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {!selectedCity && (
              <>
                {/* Gunakan Lokasi Saat Ini */}
                <button 
                  onClick={onDetectLocation}
                  className="w-full px-6 py-4 flex items-start gap-4 hover:bg-slate-50 transition-colors border-b border-slate-100 group"
                >
                  <div className="mt-1 p-2 bg-primary/5 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <MapPin size={20} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-primary">Gunakan lokasi saat ini</h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{currentAddress || 'Mendeteksi lokasi...'}</p>
                  </div>
                </button>

                {/* Semua Lokasi */}
                <button 
                  onClick={() => onSelect('Indonesia')}
                  className="w-full px-6 py-4 flex items-start gap-4 hover:bg-slate-50 transition-colors border-b border-slate-100 group"
                >
                  <div className="mt-1 p-2 bg-primary/5 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <MapPin size={20} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-primary">Semua Lokasi</h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Tampilkan jasa dari seluruh Indonesia</p>
                  </div>
                </button>

                {/* Saat Ini Digunakan */}
                <div className="px-6 py-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Saat Ini Digunakan</h4>
                  <div className="space-y-4">
                    {recentLocations.map((loc, i) => (
                      <button 
                        key={i} 
                        onClick={() => onSelect(loc)}
                        className="w-full flex items-center gap-4 text-slate-700 hover:text-primary transition-colors"
                      >
                        <MapPin size={18} className="text-slate-400" />
                        <span className="text-sm font-bold">{loc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-2 bg-slate-50 border-y border-slate-100" />
              </>
            )}

            <div className="px-6 py-6 pb-24">
              {!selectedCity && (
                <>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Pilih Kota/Kabupaten</h4>
                  <div className="space-y-1">
                    {filteredCities.map((city, i) => (
                      <button 
                        key={i}
                        onClick={() => {
                          setSelectedCity(city);
                          setSearch('');
                        }}
                        className="w-full flex items-center justify-between py-4 border-b border-slate-50 group hover:bg-slate-50 px-2 -mx-2 rounded-lg transition-colors"
                      >
                        <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">{city}</span>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
                      </button>
                    ))}
                  </div>
                </>
              )}

              {selectedCity && (
                <>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Kecamatan di {selectedCity}</h4>
                  <div className="space-y-1">
                    {filteredDistricts.map((district, i) => (
                      <button 
                        key={i}
                        onClick={() => onSelect(`${district}, ${selectedCity}`)}
                        className="w-full flex items-center justify-between py-4 border-b border-slate-50 group hover:bg-slate-50 px-2 -mx-2 rounded-lg transition-colors"
                      >
                        <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">{district}</span>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


export default function App() {
  const [isSplash, setIsSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userRole, setUserRole] = useState<'tamu' | 'mitra' | 'admin' | null>(() => {
    const saved = localStorage.getItem('userRole');
    return (saved as 'tamu' | 'mitra' | 'admin') || null;
  });

  const PageHeader = ({ title, subtitle, onBack }: { title: string, subtitle?: string, onBack?: () => void }) => (
    <header className="bg-white text-slate-800 pt-5 pb-5 px-6 border-b border-slate-100 relative overflow-hidden">
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={onBack} 
              className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 border border-slate-100"
            >
              <ArrowLeft size={18} strokeWidth={2.5} />
            </motion.button>
          )}
          <div>
            <h1 className="text-xl font-black tracking-tighter italic leading-none text-primary">{title}</h1>
            {subtitle && <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.1em] mt-1.5">{subtitle}</p>}
          </div>
        </div>
        <div 
          className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 border border-slate-100 relative cursor-pointer active:scale-95 transition-transform"
          onClick={() => {
            setShowNotifDropdown(!showNotifDropdown);
            if (!showNotifDropdown) markNotifsAsRead();
          }}
        >
          <Bell size={18} />
          {unreadNotifCount > 0 && (
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center">
              <span className="text-[7px] text-white font-bold">{unreadNotifCount}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userChats, setUserChats] = useState<any[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);
  const [isUploadingPayment, setIsUploadingPayment] = useState(false);
  const [pendingPayments, setPendingPayments] = useState<Payment[]>([]);
  const [selectedPaymentForView, setSelectedPaymentForView] = useState<Payment | null>(null);
  const [rejectionNote, setRejectionNote] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [featuredMitras, setFeaturedMitras] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [activePage, setActivePage] = useState<Page>('beranda');
  const [prevPage, setPrevPage] = useState<Page | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<CategoryId>('all');
  const [selectedSub, setSelectedSub] = useState<string>('all');
  const [bookingService, setBookingService] = useState<Service | null>(null);
  const [chatMitra, setChatMitra] = useState<{ id: string, name: string, serviceTitle?: string, serviceId?: string } | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [showDealModal, setShowDealModal] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeDeal, setActiveDeal] = useState<any>(null);
  const [selectedMitra, setSelectedMitra] = useState<any>(null);
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
  const [regStep, setRegStep] = useState(1);
  const [isMitra, setIsMitra] = useState(false);
  const [mitraOrders, setMitraOrders] = useState<any[]>([]);
  const [kaffaForm, setKaffaForm] = useState({
    nama: '',
    wa: '',
    jenis: 'Handphone',
    model: '',
    keluhan: ''
  });
  const [kaffaPhotos, setKaffaPhotos] = useState<string[]>([]);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupProvince, setSignupProvince] = useState('');
  const [signupCity, setSignupCity] = useState('');
  const [signupDistrict, setSignupDistrict] = useState('');
  const [signupAddress, setSignupAddress] = useState('');
  const [jenisMitra, setJenisMitra] = useState('Perorangan');
  const [namaUsaha, setNamaUsaha] = useState('');
  const [logoUsahaFile, setLogoUsahaFile] = useState<File | null>(null);
  const [legalitasFile, setLegalitasFile] = useState<File | null>(null);
  const [statusKeahlian, setStatusKeahlian] = useState('Non Sertifikat');
  const [sertifikatFile, setSertifikatFile] = useState<File | null>(null);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [signupKtpFile, setSignupKtpFile] = useState<File | null>(null);
  const [signupSelfieFile, setSignupSelfieFile] = useState<File | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Kota Bandung');
  const [currentAddress, setCurrentAddress] = useState('Mendeteksi lokasi...');
  const [recentLocations, setRecentLocations] = useState(['Kota Bandung', 'Kota Cimahi', 'Kab Bandung', 'Kab Bandung Barat']);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation tidak didukung oleh browser Anda.");
      return;
    }

    setCurrentAddress('Mendeteksi lokasi...');
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
        const data = await response.json();
        if (data.address) {
          const district = data.address.suburb || data.address.village || data.address.neighbourhood || data.address.city_district || '';
          const city = data.address.city || data.address.town || data.address.municipality || '';
          const fullAddress = district && city ? `${district}, ${city}` : data.display_name;
          setCurrentAddress(fullAddress);
          setSelectedLocation(fullAddress);
          setShowLocationModal(false);
          
          // Add to recent
          if (!recentLocations.includes(fullAddress)) {
            setRecentLocations(prev => [fullAddress, ...prev.slice(0, 4)]);
          }
        }
      } catch (error) {
        console.error("Reverse geocoding failed:", error);
        alert("Gagal mendeteksi alamat lengkap. Menggunakan koordinat.");
        const coordLoc = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        setCurrentAddress(coordLoc);
        setSelectedLocation(coordLoc);
        setShowLocationModal(false);
      }
    }, (error) => {
      console.error("Geolocation error:", error);
      alert("Gagal mendapatkan lokasi. Pastikan izin lokasi aktif.");
    });
  };

  // Data Iklan (Mock dari HTML)
  const [myAds, setMyAds] = useState<any[]>([]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const [isSendingOffer, setIsSendingOffer] = useState(false);
  const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [mitraStatus, setMitraStatus] = useState<'pending' | 'active' | 'rejected' | 'approved' | null>(null);
  const [loginPhone, setLoginPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [verificationId, setVerificationId] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [userAddress, setUserAddress] = useState<string>('');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          // 1. Check if user exists in 'users' collection
          const userRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userRef);
          
          let currentRole = 'pelanggan'; // Default role
          
          if (!userDoc.exists()) {
            // 2. If not exists, automatically create it
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

          // 3. Check if user is also a registered mitra
          const mitraDoc = await getDoc(doc(db, 'mitras', currentUser.uid));
          if (mitraDoc.exists()) {
            const mitraData = mitraDoc.data();
            setMitraStatus(mitraData.status || 'pending');
            setIsMitra(true);
            currentRole = 'mitra'; // Override role to mitra
            setUserAddress(mitraData.address || '');
          } else {
            setMitraStatus(null);
            setIsMitra(false);
          }

          // 4. Gatekeeper Logic: Set state based on final role
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
          // Fallback to pelanggan if error occurs
          setUserRole('pelanggan');
          localStorage.setItem('userRole', 'pelanggan');
        }
      } else {
        setMitraStatus(null);
        setIsMitra(false);
        
        // Preserve admin role if logged in via hardcoded admin credentials
        const savedRole = localStorage.getItem('userRole');
        if (savedRole === 'admin') {
          setUserRole('admin');
        } else {
          setUserRole(null);
        }
        
        setUserAddress('');
      }
    });
    return () => unsubscribe();
  }, []);

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
    if (!isFirebaseConfigured) return;
    
    const fetchBanners = async () => {
      try {
        const q = query(collection(db, 'banners'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const bns = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBanners(bns.length > 0 ? bns : [
          { id: 'default-2', name: 'Jaminan Keamanan Verified', img: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800', desc: 'Transaksi Aman & Terpercaya', color: 'from-primary to-primary-light', page: 'jaminan-keamanan', btn: 'Pelajari Lebih Lanjut' }
        ]);
      } catch (error: any) {
        if (error.code === 'permission-denied') {
          console.warn("Firestore banners fetch: Permission denied.");
        } else {
          console.error("Failed to fetch banners:", error);
        }
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (!user || !isFirebaseConfigured) {
      setUserChats([]);
      return;
    }
    
    try {
      const q = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', user.uid),
        orderBy('timestamp', 'desc')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const chats = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUserChats(chats);
      }, (error) => {
        if (error.code === 'permission-denied') {
          console.warn("Firestore chats listener: Permission denied.");
        } else {
          console.error("Firestore chats listener failed:", error);
        }
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Failed to setup user chats listener:", error);
    }
  }, [user]);

  useEffect(() => {
    if (!user || !isFirebaseConfigured) {
      setMitraOrders([]);
      return;
    }
    
    try {
      // Listen to transactions where mitra is the user
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
            // Map transaction fields to order fields for UI compatibility
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
    if (!chatMitra || !isFirebaseConfigured || !user) {
      setMessages([]);
      return;
    }
    
    try {
      const chatId = [user.uid, chatMitra.id].sort().join('_');
      const q = query(
        collection(db, 'chats', chatId, 'messages'),
        orderBy('timestamp', 'asc')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as any;
        setMessages(msgs);
      }, (error) => {
        console.warn("Firestore messages listener failed (likely permissions):", error);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Failed to setup Firestore messages listener:", error);
    }
  }, [chatMitra, user]);

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

  const verifyPayment = async (payment: Payment) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'payments', payment.id), {
        status: 'verified',
        verifiedBy: user.uid,
        verifiedAt: serverTimestamp()
      });

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
    
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCat === 'all' || adCat === selectedCat.toLowerCase();
    
    // Removed strict subcategory and location filters to ensure ads show up
    
    return matchesSearch && matchesCat;
  });

  const handleLogin = async () => {
    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      alert('Berhasil masuk!');
      navigateTo('beranda');
    } catch (error: any) {
      alert('Gagal masuk: ' + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const isConfigured = !!(import.meta as any).env?.VITE_FIREBASE_API_KEY && (import.meta as any).env?.VITE_FIREBASE_API_KEY !== "dummy-key";
    
    if (!isConfigured) {
      alert('Firebase belum terdeteksi. Pastikan Anda sudah:\n1. Menambah variabel di Vercel/Hosting.\n2. Menggunakan prefix VITE_ (contoh: VITE_FIREBASE_API_KEY).\n3. Melakukan REDEPLOY setelah simpan variabel.');
      return;
    }
    try {
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      alert('Berhasil masuk dengan Google!');
      navigateTo('beranda');
    } catch (error: any) {
      if (error.code === 'auth/operation-not-allowed') {
        alert('Metode Google Login belum diaktifkan di Firebase Console. Silakan hubungi admin.');
      } else if (error.code === 'auth/popup-blocked') {
        alert('Popup login diblokir oleh browser. Silakan izinkan popup untuk situs ini.');
      } else {
        alert('Gagal masuk dengan Google: ' + error.message);
      }
    }
  };

  const handleSignUp = async () => {
    // Basic validation
    if (!signupName || !signupEmail || !signupPassword || !signupAddress || !signupKtpFile || !signupSelfieFile || !isTermsAccepted || !signupCity || !signupDistrict) {
      alert('Silakan Isi full Formulir dan centang setuju untuk terdaftar di jasamitra,');
      return;
    }

    // Additional validation for CV/PT
    if ((jenisMitra === 'CV' || jenisMitra === 'PT') && !namaUsaha) {
      alert('Silakan isi Nama Usaha Anda.');
      return;
    }

    // Additional validation for Sertifikat
    if (statusKeahlian === 'Sertifikat' && !sertifikatFile) {
      alert('Silakan upload Sertifikat Keahlian Anda.');
      return;
    }

    try {
      const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: signupName });

      // Simpan data mitra ke Firestore
      await setDoc(doc(db, 'mitras', user.uid), {
        uid: user.uid,
        name: signupName,
        email: signupEmail,
        city: signupCity,
        district: signupDistrict,
        address: signupAddress,
        jenisMitra,
        namaUsaha: (jenisMitra === 'CV' || jenisMitra === 'PT') ? namaUsaha : '',
        statusKeahlian,
        status: 'pending',
        // Note: In a real app, we would upload files to storage first and save URLs
        // For this demo, we'll store indicators about the files
        hasKtp: !!signupKtpFile,
        hasSelfie: !!signupSelfieFile,
        hasLogoUsaha: !!logoUsahaFile,
        hasLegalitasUsaha: !!legalitasFile,
        hasSertifikatKeahlian: !!sertifikatFile,
        role: 'mitra',
        createdAt: serverTimestamp(),
        isVerified: false
      });

      setIsMitra(true);
      alert('Pendaftaran berhasil! Silakan login.');
      navigateTo('login');
    } catch (error: any) {
      alert('Pendaftaran gagal: ' + error.message);
    }
  };

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserRole(null);
      localStorage.removeItem('userRole');
      setIsMitra(false);
      setShowOnboarding(true);
      setActivePage('beranda');
      alert('Berhasil keluar');
    } catch (error: any) {
      alert('Gagal keluar: ' + error.message);
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

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          console.log("Recaptcha verified");
        }
      });
    }
  };

  const handleSendOtp = async () => {
    if (!loginPhone) {
      alert('Masukkan nomor handphone');
      return;
    }
    
    let formattedPhone = loginPhone;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+62' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+62' + formattedPhone;
    }

    setIsSendingOtp(true);
    try {
      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setVerificationId(confirmationResult.verificationId);
      (window as any).confirmationResult = confirmationResult;
      setShowOtpInput(true);
      alert('OTP telah dikirim ke ' + formattedPhone);
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      alert('Gagal mengirim OTP: ' + error.message);
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
        (window as any).recaptchaVerifier = null;
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert('Masukkan kode OTP');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const confirmationResult = (window as any).confirmationResult;
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      
      // Check if user exists in mitras or just set role to tamu
      const mitraDoc = await getDoc(doc(db, 'mitras', user.uid));
      if (mitraDoc.exists()) {
        setUserRole('mitra');
        localStorage.setItem('userRole', 'mitra');
        setIsMitra(true);
      } else {
        setUserRole('tamu');
        localStorage.setItem('userRole', 'tamu');
        setIsMitra(false);
      }
      
      alert('Berhasil masuk!');
      setShowOtpInput(false);
      setLoginPhone('');
      setOtp('');
      navigateTo('beranda');
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      alert('OTP salah atau kadaluarsa');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const navigateTo = (page: Page) => {
    if (page === 'beranda') {
      setSelectedCat('all');
      setSelectedSub('all');
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
      (t.customerID === user?.uid && t.mitraID === chatMitra?.id) ||
      (t.mitraID === user?.uid && t.customerID === chatMitra?.id)
    );

    if (!trans) {
      alert("Belum ada penawaran harga. Silakan minta mitra untuk mengirimkan penawaran terlebih dahulu.");
      return;
    }

    setActiveTransaction(trans);
    const price = trans.totalPrice;
    const jaminan = trans.dpAmount;
    setActiveDeal({
      jasa: chatMitra?.serviceTitle || 'Layanan Jasa',
      mitra: chatMitra?.name || 'Mitra Jasa',
      total: price,
      jaminan: jaminan,
      sisa: price - jaminan
    });
    setShowDealModal(true);
  };

  const confirmDeal = async () => {
    if (!user || !activeDeal) return;
    if (!isFirebaseConfigured) {
      alert('Firebase tidak terkonfigurasi. Silakan hubungi admin.');
      return;
    }

    try {
      const dealContent = `✅ DEAL DISEPAKATI\nTotal: Rp ${activeDeal.total.toLocaleString()}\nJaminan 10%: Rp ${activeDeal.jaminan.toLocaleString()}`;
      
      const chatId = [user.uid, chatMitra?.id || 'general'].sort().join('_');

      // Save to chat
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        sender: 'user',
        senderId: user.uid,
        type: 'text',
        content: dealContent,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        isDeal: true,
        timestamp: serverTimestamp()
      });

      // Update transaction status to deal_agreed
      if (activeTransaction) {
        await updateDoc(doc(db, 'transactions', activeTransaction.id), {
          status: 'deal_agreed',
          updatedAt: serverTimestamp()
        });
      }

      // Add notification for mitra
      await addDoc(collection(db, 'notifications'), {
        recipientId: chatMitra?.id,
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

  const handleSendOffer = async () => {
    if (!user || !chatMitra || !offerPrice) return;
    
    setIsSendingOffer(true);
    try {
      const totalPrice = Number(offerPrice);
      const dpAmount = totalPrice * 0.1;
      const chatId = [user.uid, chatMitra.id].sort().join('_');
      
      const transRef = await addDoc(collection(db, 'transactions'), {
        customerID: chatMitra.id, 
        customerName: chatMitra.name || 'Pelanggan',
        mitraID: user.uid,
        serviceTitle: chatMitra.serviceTitle || 'Layanan Jasa',
        serviceId: chatMitra.serviceId || null,
        totalPrice: totalPrice,
        dpAmount: dpAmount,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      const content = `🏷️ PENAWARAN JASA BARU\nTotal Harga: Rp ${totalPrice.toLocaleString()}\nDP 10% (Wajib): Rp ${dpAmount.toLocaleString()}\n\nSilakan klik tombol "Bayar DP 10%" di atas untuk melanjutkan.`;

      // Send offer message to chat
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        sender: 'mitra',
        senderId: user.uid,
        type: 'text',
        content: content,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        timestamp: serverTimestamp()
      });

      // Update chat metadata for inbox
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: content,
        lastTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        timestamp: serverTimestamp(),
        participants: [user.uid, chatMitra.id],
        participantNames: {
          [user.uid]: user.displayName || 'Mitra',
          [chatMitra.id]: chatMitra.name
        }
      }).catch(async () => {
        const { setDoc } = await import('firebase/firestore');
        await setDoc(doc(db, 'chats', chatId), {
          lastMessage: content,
          lastTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          timestamp: serverTimestamp(),
          participants: [user.uid, chatMitra.id],
          participantNames: {
            [user.uid]: user.displayName || 'Mitra',
            [chatMitra.id]: chatMitra.name
          }
        });
      });

      setShowOfferModal(false);
      setOfferPrice('');
      
      // Add notification for customer
      await addDoc(collection(db, 'notifications'), {
        recipientId: chatMitra.id,
        title: 'Penawaran Jasa Baru',
        message: `Mitra ${user.displayName || 'Mitra'} mengirim penawaran untuk Anda.`,
        type: 'order',
        isRead: false,
        createdAt: serverTimestamp()
      });

      alert('Penawaran berhasil dikirim!');
    } catch (error: any) {
      alert('Gagal mengirim penawaran: ' + error.message);
    } finally {
      setIsSendingOffer(false);
    }
  };

  const submitPayment = async () => {
    if (!user || !paymentProofPreview || paymentAmount <= 0) {
      alert('Mohon lengkapi data pembayaran dan nominal deal.');
      return;
    }

    setIsUploadingPayment(true);
    try {
      const dpAmount = paymentAmount * 0.1;
      const mitraAmount = paymentAmount * 0.9;
      const chatId = [user.uid, chatMitra?.id || 'general'].sort().join('_');

      // Fetch customer phone number
      let customerPhone = '';
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        customerPhone = userDoc.data().wa || userDoc.data().phone || '';
      }

      // Update transaction if exists
      if (activeTransaction) {
        await updateDoc(doc(db, 'transactions', activeTransaction.id), {
          status: 'paid', // Mark as paid immediately
          proofUrl: paymentProofPreview,
          customerPhone: customerPhone,
          updatedAt: serverTimestamp()
        });

        // Deactivate the ad so it doesn't show on the homepage
        if (activeTransaction.serviceId) {
          await updateDoc(doc(db, 'iklan', activeTransaction.serviceId), {
            status: 'nonaktif',
            updatedAt: serverTimestamp()
          }).catch(err => console.error("Failed to deactivate ad:", err));
        }
      }

      await addDoc(collection(db, 'payments'), {
        userId: user.uid,
        userName: user.displayName || 'Pelanggan',
        mitraId: chatMitra?.id || 'unknown',
        mitraName: chatMitra?.name || 'Mitra',
        dealAmount: paymentAmount,
        dpAmount: dpAmount,
        mitraAmount: mitraAmount,
        proofUrl: paymentProofPreview,
        status: 'pending',
        transactionId: activeTransaction?.id || null,
        createdAt: serverTimestamp()
      });

      // Add notification for mitra
      await addDoc(collection(db, 'notifications'), {
        recipientId: chatMitra?.id || 'unknown',
        title: 'Pembayaran DP Berhasil!',
        message: `Pelanggan sudah bayar DP 10%.\nSilahkan hubungi pelanggan\nSelamat bekerja dan semangat demi keluarga ❤️`,
        type: 'payment_success',
        isRead: false,
        createdAt: serverTimestamp()
      });

      const content = `📤 BUKTI TRANSFER DIUNGGAH\nNominal Deal: Rp ${paymentAmount.toLocaleString()}\nDP 10%: Rp ${dpAmount.toLocaleString()}\nStatus: Lunas (DP 10%)`;

      // Send message to chat
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        sender: 'user',
        senderId: user.uid,
        type: 'text',
        content: content,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        timestamp: serverTimestamp()
      });

      // Update chat metadata for inbox
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: content,
        lastTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        timestamp: serverTimestamp(),
        participants: [user.uid, chatMitra?.id || 'unknown'],
        participantNames: {
          [user.uid]: user.displayName || 'User',
          [chatMitra?.id || 'unknown']: chatMitra?.name || 'Mitra'
        }
      }).catch(async () => {
        const { setDoc } = await import('firebase/firestore');
        await setDoc(doc(db, 'chats', chatId), {
          lastMessage: content,
          lastTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          timestamp: serverTimestamp(),
          participants: [user.uid, chatMitra?.id || 'unknown'],
          participantNames: {
            [user.uid]: user.displayName || 'User',
            [chatMitra?.id || 'unknown']: chatMitra?.name || 'Mitra'
          }
        });
      });

      setShowPaymentModal(false);
      alert('Terima kasih atas kepercayaan anda, bukti dp akan kami sampaikan ke mitra');
    } catch (error: any) {
      alert('Gagal mengunggah pembayaran: ' + error.message);
    } finally {
      setIsUploadingPayment(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !user) {
      if (!user) alert('Silakan login untuk mengirim pesan');
      return;
    }
    
    if (!isFirebaseConfigured) {
      alert('Firebase tidak terkonfigurasi. Pesan tidak dapat dikirim.');
      return;
    }
    
    // Sensor WA logic
    const polaWA = /(\+?62|0)8[1-9][0-9]{6,10}/g;
    let content = inputText.replace(polaWA, '🔴 [NOMOR DILARANG]');
    if (/wa|whatsapp|hp|telp|kontak/i.test(content)) {
      content += '\n\n⚠️ DILARANG SHARE KONTAK!';
    }

    try {
      const chatId = [user.uid, chatMitra.id].sort().join('_');
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        sender: 'user',
        senderId: user.uid,
        type: 'text',
        content: content,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        timestamp: serverTimestamp()
      });
      
      // Update chat metadata for inbox
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: content,
        lastTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        timestamp: serverTimestamp(),
        participants: [user.uid, chatMitra.id],
        participantNames: {
          [user.uid]: user.displayName || 'User',
          [chatMitra.id]: chatMitra.name
        }
      }).catch(async () => {
        // Create if doesn't exist
        const { setDoc } = await import('firebase/firestore');
        await setDoc(doc(db, 'chats', chatId), {
          lastMessage: content,
          lastTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          timestamp: serverTimestamp(),
          participants: [user.uid, chatMitra.id],
          participantNames: {
            [user.uid]: user.displayName || 'User',
            [chatMitra.id]: chatMitra.name
          }
        });
      });

      setInputText('');
      if (inputText !== content) alert('⚠️ Dilarang berbagi nomor WA! Pesan telah disensor.');

      // Add notification for recipient
      if (chatMitra?.id) {
        await addDoc(collection(db, 'notifications'), {
          recipientId: chatMitra.id,
          title: 'Pesan Baru',
          message: `${user.displayName || 'Seseorang'} mengirim pesan: "${content.substring(0, 30)}${content.length > 30 ? '...' : ''}"`,
          type: 'chat',
          isRead: false,
          createdAt: serverTimestamp()
        });
      }
    } catch (error: any) {
      alert('Gagal mengirim pesan: ' + error.message);
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
          <motion.div 
            key="beranda"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col"
          >
            <header className="bg-white pt-4 pb-4 px-6 relative overflow-hidden border-b border-slate-100">
              <div className="relative z-10 flex flex-col gap-4">
                {/* Top Row: Logo & Location */}
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-black tracking-tighter">
              <span className="text-[#003366]">JASA</span>
              <span className="text-[#F27D26]">MITRA</span>
            </h1>
                  <div 
                    onClick={() => setShowLocationModal(true)}
                    className="flex items-center gap-1 text-slate-500 cursor-pointer hover:text-primary transition-colors bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100"
                  >
                    <MapPin size={12} className="text-primary" />
                    <span className="text-[10px] font-bold truncate max-w-[80px]">{selectedLocation}</span>
                    <ChevronDown size={12} />
                  </div>
                </div>

                {!isFirebaseConfigured && (
                  <div className="bg-red-50 border border-red-100 p-3 rounded-xl flex items-start gap-3">
                    <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-[9px] text-red-700 font-bold leading-relaxed">
                      Firebase belum dikonfigurasi. Beberapa fitur mungkin tidak berfungsi.
                    </p>
                  </div>
                )}

                {/* Second Row: Search & Icons */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 group">
                    <div className="relative flex items-center bg-slate-100 border border-transparent rounded-xl overflow-hidden focus-within:bg-white focus-within:border-primary/20 transition-all shadow-sm">
                      <Search className="ml-3 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
                      <input 
                        type="text" 
                        placeholder="Cari jasa atau tukang..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent text-slate-900 py-2.5 px-2 outline-none font-bold text-xs placeholder:text-slate-400 placeholder:font-medium"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.div whileTap={{ scale: 0.9 }} className="relative text-slate-600">
                      <Heart size={20} />
                    </motion.div>
                    <motion.div 
                      whileTap={{ scale: 0.9 }} 
                      className="relative text-slate-600 cursor-pointer"
                      onClick={() => {
                        setShowNotifDropdown(!showNotifDropdown);
                        if (!showNotifDropdown) markNotifsAsRead();
                      }}
                    >
                      <Bell size={20} />
                      {unreadNotifCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center">
                          <span className="text-[7px] text-white font-bold">{unreadNotifCount}</span>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>
            </header>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {showNotifDropdown && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowNotifDropdown(false)}
                    className="fixed inset-0 z-[2999] bg-slate-900/20 backdrop-blur-[2px]"
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-24 right-6 left-6 z-[3000] bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden max-h-[70vh] flex flex-col"
                  >
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Notifikasi</h3>
                      <button onClick={() => setShowNotifDropdown(false)} className="text-slate-400 hover:text-primary transition-colors">
                        <X size={18} />
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                      {notifications.length === 0 ? (
                        <div className="py-12 text-center opacity-30">
                          <Bell size={48} className="mx-auto mb-3" />
                          <p className="text-xs font-bold">Belum ada notifikasi</p>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div 
                            key={n.id} 
                            className={`p-4 rounded-2xl transition-colors cursor-pointer hover:bg-slate-50 flex gap-4 ${!n.isRead ? 'bg-primary/5 border-l-4 border-primary' : ''}`}
                            onClick={() => {
                              if (n.type === 'chat') navigateTo('chat');
                              if (n.type === 'order') navigateTo('pesanan');
                              setShowNotifDropdown(false);
                            }}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              n.type === 'order' ? 'bg-emerald-100 text-emerald-600' : 
                              n.type === 'payment' ? 'bg-blue-100 text-blue-600' : 
                              'bg-primary/10 text-primary'
                            }`}>
                              {n.type === 'order' ? <ClipboardList size={18} /> : 
                               n.type === 'payment' ? <ShieldCheck size={18} /> : 
                               <MessageSquare size={18} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-black text-slate-800 mb-0.5">{n.title}</p>
                              <p className="text-[10px] text-slate-500 font-medium leading-relaxed line-clamp-2">{n.message}</p>
                              <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                                {n.createdAt?.toDate ? new Date(n.createdAt.toDate()).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : 'Baru saja'}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="p-4 border-t border-slate-100 text-center">
                        <button 
                          onClick={async () => {
                            await markNotifsAsRead();
                          }}
                          className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                        >
                          Tandai Semua Dibaca
                        </button>
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            <main className="px-5 pt-5 relative z-20 pb-32 bg-slate-50/30">
              {/* Security & Protocol Banners (Horizontal Scroll) */}
              <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar -mx-5 px-5 snap-x snap-mandatory mb-4">
                {/* Security Banner */}
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  onClick={() => navigateTo('jaminan-keamanan')}
                  className="min-w-[85%] bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 relative overflow-hidden group cursor-pointer active:scale-95 transition-transform snap-center"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0 relative z-10">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="relative z-10">
                    <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                      Jaminan Keamanan <span className="text-accent">Verified</span>
                    </h4>
                    <p className="text-[8px] text-slate-500 leading-relaxed font-medium">
                      Mitra terverifikasi ketat untuk keamanan & profesionalisme Anda.
                    </p>
                  </div>
                  <div className="ml-auto self-center text-slate-300">
                    <ChevronRight size={14} />
                  </div>
                </motion.div>
              </div>

              {/* Static Safety Protocol Banner */}
              <section className="mb-5">
                <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-100 neo-3d">
                  <img src="https://i.ibb.co.com/zhMNLMZ2/file-000000000ce0720885e11afeef41a414.png" alt="Protokol Keselamatan" className="w-full h-auto object-cover" />
                </div>
              </section>

              {/* Categories (Smaller boxes like in photo) */}
              <section className="mb-8">
                <div className="grid grid-cols-4 gap-y-5 gap-x-3">
                  {CATEGORIES.map((cat) => (
                    <motion.button 
                      key={cat.id}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setSelectedCat(cat.id);
                        setSelectedSub('all');
                        navigateTo('subkategori');
                      }}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-600 shadow-sm relative overflow-hidden group transition-all`}>
                        <div className={`absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity`} />
                        <cat.icon size={20} strokeWidth={2} className="relative z-10 group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-[9px] font-bold text-slate-500 tracking-tight text-center leading-tight">{cat.name}</span>
                    </motion.button>
                  ))}
                </div>
              </section>

              {/* Banners Toko Mitra (Carousel style with dots) */}
              {(!user || userRole === 'tamu') && (
                <section className="mb-8">
                  <div className="relative group">
                    <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar -mx-5 px-5 snap-x snap-mandatory">
                      {banners.map((banner) => (
                        <motion.div 
                          key={banner.id}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => banner.page && navigateTo(banner.page as Page)}
                          className={`relative min-w-full h-40 rounded-2xl overflow-hidden shadow-md cursor-pointer group snap-center`}
                        >
                          <img src={banner.img || undefined} className="absolute inset-0 w-full h-full object-cover" alt={banner.name} referrerPolicy="no-referrer" />
                          <div className={`absolute inset-0 bg-gradient-to-r ${banner.color || 'from-slate-800 to-slate-900'} opacity-70`} />
                          <div className="absolute inset-0 p-6 flex flex-col justify-center text-white">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] mb-1 opacity-80">{banner.name}</span>
                            <h3 className="text-xl font-black leading-tight mb-4 max-w-[70%]">{banner.desc}</h3>
                            <div className="flex">
                              <span className="bg-white text-slate-900 text-[8px] font-black px-4 py-2 rounded-lg uppercase tracking-wider shadow-lg">{banner.btn || 'Lihat Detail'}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    {/* Pagination Dots */}
                    <div className="flex justify-center gap-1.5 mt-1">
                      {banners.map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all ${i === 0 ? 'w-4 bg-primary' : 'w-1.5 bg-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Mitra Unggulan (Featured Partners) */}
              <section className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-slate-800 tracking-tight">Mitra Unggulan</h2>
                  <button className="text-[10px] font-bold text-primary uppercase tracking-widest">Lihat Semua</button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar -mx-5 px-5">
                  {[...services.filter(s => s.isHighlight === true), ...Array(10)].slice(0, 10).map((slot, i) => slot ? (
                    <div 
                      key={`highlight-${slot.id || i}`} 
                      className="min-w-[150px] max-w-[150px] bg-[#FFFAF0] rounded-xl border-2 border-[#FACC15] overflow-hidden flex flex-col shrink-0 cursor-pointer snap-start"
                      onClick={() => {
                        setSelectedMitra(slot);
                        navigateTo('profil-mitra');
                      }}
                    >
                      {/* Image Area */}
                      <div className="h-28 bg-slate-200 relative">
                        <img src={slot.img || slot.foto || `https://picsum.photos/seed/${slot.id}/150/150`} alt={slot.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        {/* Heart Icon */}
                        <div className="absolute top-2 right-2 w-7 h-7 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <Heart size={14} className="text-white" />
                        </div>
                      </div>
                      
                      {/* Highlight Bar */}
                      <div className="bg-[#FACC15] py-1 flex items-center justify-center gap-1">
                        <Zap size={12} className="text-black fill-black" />
                        <span className="text-[11px] font-bold text-black">Highlight</span>
                      </div>
                      
                      {/* Content Area */}
                      <div className="p-2.5 flex flex-col flex-1">
                        <h3 className="text-[11px] font-bold text-slate-800 line-clamp-1 mb-0.5">{slot.title}</h3>
                        <p className="text-[13px] font-black text-primary mb-3">Rp {formatPrice(slot.price)}</p>
                        
                        <div className="mt-auto">
                          <p className="text-[10px] font-bold text-slate-700 line-clamp-1">{slot.mitraName || 'Mitra'}</p>
                          <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-1">{slot.subcat || slot.category || 'Keahlian Spesifik'}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div 
                      key={`highlight-empty-${i}`} 
                      className="min-w-[150px] max-w-[150px] bg-[#FFFAF0] rounded-xl border-2 border-[#FACC15] overflow-hidden flex flex-col shrink-0 cursor-pointer snap-start"
                      onClick={() => alert('Hubungi admin untuk memesan posisi Highlight ini.')}
                    >
                      {/* Image Area */}
                      <div className="h-28 bg-slate-200 relative">
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                          <ImageIcon size={24} className="mb-1 opacity-50" />
                          <span className="text-[9px] font-medium px-2 text-center">Space Iklan Tersedia</span>
                        </div>
                        {/* Heart Icon */}
                        <div className="absolute top-2 right-2 w-7 h-7 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <Heart size={14} className="text-white" />
                        </div>
                      </div>
                      
                      {/* Highlight Bar */}
                      <div className="bg-[#FACC15] py-1 flex items-center justify-center gap-1">
                        <Zap size={12} className="text-black fill-black" />
                        <span className="text-[11px] font-bold text-black">Highlight</span>
                      </div>
                      
                      {/* Content Area */}
                      <div className="p-2.5 flex flex-col flex-1">
                        <h3 className="text-[11px] text-slate-700 line-clamp-1 mb-0.5">Pesan posisi ini</h3>
                        <p className="text-[13px] font-black text-slate-800 mb-3">Rp ---</p>
                        
                        <div className="mt-auto">
                          <p className="text-[10px] font-bold text-slate-700 line-clamp-1">Mitra Unggulan</p>
                          <p className="text-[9px] text-slate-400 mt-0.5">Tersedia</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Home Service List (Recommendations Only) */}
              <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-800">Rekomendasi Jasa</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {filteredServices.length > 0 ? filteredServices.slice(0, 6).map((service) => (
                    <motion.div 
                      key={service.id}
                      whileTap={{ scale: 0.98 }}
                      className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden neo-3d cursor-pointer"
                      onClick={() => {
                        if (service.mitraId === user?.uid) {
                          navigateTo('iklan-saya');
                        } else {
                          openMitraProfile(service);
                        }
                      }}
                    >
                      <div className="relative aspect-square w-full">
                        <img 
                          src={service.img || undefined} 
                          alt={service.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                          <Star size={10} className="text-accent fill-accent" />
                          <span className="text-[9px] font-bold text-slate-700">{service.rating}</span>
                        </div>
                      </div>
                      <div className="p-3 flex flex-col flex-1">
                        <h3 className="text-[11px] font-bold text-slate-800 line-clamp-2 leading-snug mb-2">{service.title}</h3>
                        <div className="mt-auto flex flex-col gap-1.5">
                          <span className="text-sm font-black text-primary">Rp {formatPrice(service.price)}</span>
                          <div className="flex items-center gap-1 text-slate-400 border-t border-slate-50 pt-2">
                            <ShieldCheck size={12} className="text-blue-500 shrink-0" />
                            <span className="text-[9px] font-bold truncate">{service.mitraName || 'Mitra Jasa'}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="col-span-2 text-center py-10 bg-white rounded-3xl border border-dashed border-slate-200">
                      <p className="text-xs text-slate-400 italic">Tidak ada jasa di lokasi ini.</p>
                    </div>
                  )}
                </div>
              </section>
            </main>
          </motion.div>
        )}

        {/* --- PESAN (CHAT LIST) --- */}
        {activePage === 'pesan' && (
          <motion.div key="pesan" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <PageHeader title="Pesan" subtitle="Percakapan dengan mitra & pelanggan" />
            <main className="px-6 pt-6 space-y-3 pb-24">
              {userChats.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] opacity-30">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare size={32} className="text-slate-300" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">Belum Ada Pesan</h3>
                  <p className="text-xs font-medium text-slate-400 text-center max-w-[200px]">
                    Mulai percakapan dengan mitra untuk melihat pesan di sini.
                  </p>
                </div>
              ) : (
                userChats.map((chat) => {
                  const otherId = chat.participants.find((p: string) => p !== user?.uid);
                  const otherName = chat.participantNames[otherId] || 'User';
                  return (
                    <button 
                      key={chat.id}
                      onClick={() => {
                        setChatMitra({ id: otherId, name: otherName });
                        navigateTo('chat');
                      }}
                      className="w-full bg-white p-4 rounded-[24px] shadow-sm border border-slate-100 flex items-center gap-4 active:scale-[0.98] transition-all"
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-bold">
                        {otherName.charAt(0)}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-sm font-bold text-slate-800">{otherName}</h4>
                          <span className="text-[9px] font-bold text-slate-400">{chat.lastTime}</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium truncate max-w-[200px]">{chat.lastMessage}</p>
                      </div>
                      <ChevronRight size={16} className="text-slate-300" />
                    </button>
                  );
                })
              )}
            </main>
          </motion.div>
        )}

        {/* --- EDIT PROFIL --- */}
        {activePage === 'edit-profil' && (
          <motion.div key="edit-profil" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <PageHeader title="Edit Profil" subtitle="Perbarui data diri Anda" onBack={handleBack} />
            <main className="px-6 pt-6 space-y-6">
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 text-center neo-3d">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <input 
                    type="file" 
                    ref={profilePhotoInputRef} 
                    onChange={handleProfilePhotoChange} 
                    className="hidden" 
                    accept="image/*"
                  />
                  <div 
                    onClick={handleProfilePhotoClick}
                    className="relative w-full h-full cursor-pointer group"
                  >
                    <img src={user?.photoURL || "https://ui-avatars.com/api/?name=User&background=2563eb&color=fff&size=100"} className="w-full h-full rounded-full border-4 border-white shadow-lg object-cover" />
                    <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera size={24} className="text-white" />
                    </div>
                    {isUploadingProfile && (
                      <div className="absolute inset-0 bg-white/60 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={handleProfilePhotoClick}
                    className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                  >
                    <Camera size={16} />
                  </button>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">No. Member Mitra</p>
                    <p className="text-xs font-bold text-slate-700">-</p>
                  </div>
                  <button className="p-2 text-primary"><Copy size={16} /></button>
                </div>
              </div>
              <div className="bg-white p-6 rounded-[40px] shadow-sm border border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-primary flex items-center gap-2"><User size={18} /> Data Pribadi</h3>
                <div className="space-y-4">
                  <input type="text" defaultValue={user?.displayName || ""} className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none" placeholder="Nama Lengkap" />
                  <input type="email" defaultValue={user?.email || ""} className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none" placeholder="Email" />
                  <input type="tel" defaultValue="" className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none" placeholder="Nomor HP" />
                </div>
                <h3 className="text-sm font-bold text-primary flex items-center gap-2 mt-6"><Wrench size={18} /> Bidang Keahlian</h3>
                <div className="flex flex-wrap gap-2">
                  <p className="text-xs text-slate-400 italic">Belum ada keahlian ditambahkan</p>
                </div>
                <button onClick={() => {alert('Profil disimpan!'); navigateTo('akun');}} className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/30 mt-4">Simpan Perubahan</button>
              </div>
            </main>
          </motion.div>
        )}

        {/* --- ALAMAT SAYA --- */}
        {activePage === 'alamat-saya' && (
          <motion.div key="alamat-saya" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <PageHeader title="Alamat Saya" subtitle="Kelola alamat pengiriman" onBack={handleBack} />
            <main className="px-6 pt-6 space-y-4">
              {isEditingAddress ? (
                <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 mb-2">Edit Alamat</h3>
                  <textarea 
                    value={tempAddress}
                    onChange={(e) => setTempAddress(e.target.value)}
                    placeholder="Masukkan alamat lengkap Anda..."
                    className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none min-h-[120px] focus:ring-2 ring-primary/20"
                  />
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setIsEditingAddress(false)}
                      className="flex-1 py-4 text-slate-400 font-bold text-sm"
                    >
                      Batal
                    </button>
                    <button 
                      onClick={handleSaveAddress}
                      className="flex-[2] bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/30"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {userAddress ? (
                    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                        <MapPin size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-sm font-bold text-slate-800">Alamat Utama</h3>
                          <button 
                            onClick={() => {
                              setTempAddress(userAddress);
                              setIsEditingAddress(true);
                            }}
                            className="text-primary text-xs font-bold"
                          >
                            Edit
                          </button>
                        </div>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed">{userAddress}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 text-center py-12">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
                        <MapPin size={32} />
                      </div>
                      <h3 className="text-sm font-bold text-slate-800">Belum Ada Alamat</h3>
                      <p className="text-xs font-medium text-slate-400 mt-2">Anda belum menambahkan alamat pengiriman.</p>
                    </div>
                  )}
                  {!userAddress && (
                    <button 
                      onClick={() => {
                        setTempAddress('');
                        setIsEditingAddress(true);
                      }}
                      className="w-full py-6 border-2 border-dashed border-slate-200 rounded-[40px] text-slate-400 font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <Plus size={20} /> Tambah Alamat Baru
                    </button>
                  )}
                </>
              )}
            </main>
          </motion.div>
        )}

        {/* --- IKLAN SAYA --- */}
        {activePage === 'iklan-saya' && (
          <motion.div key="iklan-saya" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <PageHeader title="Iklan Saya" subtitle="Kelola iklan jasa Anda" onBack={handleBack} />
            <main className="px-6 pt-6 space-y-6">
              <div className="space-y-4">
                {myAds.map(ad => (
                  <div key={ad.id} className={`bg-white p-4 rounded-[32px] shadow-sm border border-slate-100 neo-3d ${ad.status === 'nonaktif' ? 'opacity-60 grayscale' : ''}`}>
                    <div className="flex gap-4">
                      <img src={ad.img || undefined} className="w-20 h-20 rounded-2xl object-cover shadow-inner" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-bold text-slate-800">{ad.title}</h3>
                          <span className={`text-[8px] font-extrabold px-2 py-1 rounded-full uppercase tracking-widest ${ad.status === 'aktif' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>{ad.status}</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 mt-1">
                          {CATEGORIES.find(c => c.id === ad.cat)?.name} • {SUB_CATEGORIES[ad.cat]?.find(s => s.id === ad.subcat)?.nama || ad.subcat}
                        </p>
                        <p className="text-xs font-extrabold text-primary mt-2">Rp {formatPrice(ad.price)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
                      <button 
                        onClick={() => handleEditAd(ad)}
                        className="flex-1 bg-primary/10 text-primary p-2 rounded-xl"
                      >
                        <Edit3 size={16} className="mx-auto" />
                      </button>
                      <button 
                        onClick={() => handleToggleAdStatus(ad.id, ad.status)}
                        className={`flex-1 p-2 rounded-xl ${ad.status === 'aktif' ? 'bg-accent/10 text-accent' : 'bg-emerald-50 text-emerald-600'}`}
                      >
                        {ad.status === 'aktif' ? <PauseCircle size={16} className="mx-auto" /> : <PlayCircle size={16} className="mx-auto" />}
                      </button>
                      <button 
                        onClick={() => handleDeleteAd(ad.id)}
                        className="flex-1 bg-rose-50 text-rose-600 p-2 rounded-xl"
                      >
                        <Trash2 size={16} className="mx-auto" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </motion.div>
        )}

        {/* --- LAYANAN (PROGRESS) --- */}
        {activePage === 'layanan' && (
          <motion.div 
            key="layanan"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
          >
            <PageHeader title="Progress Pekerjaan" subtitle="Pantau status layanan secara real-time" />
            <main className="px-6 pt-6 pb-24">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-1">
                  <span className="text-3xl font-extrabold text-slate-800">
                    {transactions.filter(t => (t.customerID === user?.uid || t.mitraID === user?.uid) && t.status === 'paid').length}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aktif</span>
                </div>
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-1">
                  <span className="text-3xl font-extrabold text-accent">
                    {transactions.filter(t => (t.customerID === user?.uid || t.mitraID === user?.uid) && t.status === 'completed').length}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Selesai</span>
                </div>
              </div>

              {/* Filter Status */}
              <div className="flex gap-3 overflow-x-auto pb-4 mb-4 hide-scrollbar">
                {['Semua', 'Dalam Proses', 'Selesai', 'Dibatalkan'].map((f, i) => (
                  <button 
                    key={f}
                    className={`px-5 py-2.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${i === 0 ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-white text-slate-500 border border-slate-100'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {transactions.filter(t => (t.customerID === user?.uid || t.mitraID === user?.uid) && (t.status === 'paid' || t.status === 'in_progress' || t.status === 'completed')).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <Clock size={32} className="text-slate-300" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">Belum Ada Progress</h3>
                    <p className="text-xs font-medium text-slate-400 text-center max-w-[200px]">
                      Pesanan jasa Anda akan muncul di sini setelah Anda melakukan pemesanan.
                    </p>
                  </div>
                ) : (
                  transactions.filter(t => (t.customerID === user?.uid || t.mitraID === user?.uid) && (t.status === 'paid' || t.status === 'in_progress' || t.status === 'completed')).map(t => (
                    <div key={t.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 neo-3d space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-bold text-slate-800">{t.serviceTitle || 'Layanan Jasa'}</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            {t.customerID === user?.uid ? `Mitra: ${t.mitraID}` : `Pelanggan: ${t.customerName || 'Pelanggan'}`}
                          </p>
                        </div>
                        <span className={`text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest ${
                          t.status === 'completed' ? 'bg-accent/10 text-accent' : 
                          t.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {t.status === 'completed' ? 'Selesai' : 
                           t.status === 'in_progress' ? 'Dikerjakan' : 'Menunggu Mitra'}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center">
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">Total Deal</p>
                          <p className="text-sm font-extrabold text-primary">Rp {t.totalPrice?.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-bold text-slate-400 uppercase">Status Pembayaran</p>
                          <p className="text-[10px] font-bold text-emerald-600">DP Lunas</p>
                        </div>
                      </div>
                      
                      {t.status === 'paid' && t.customerID === user?.uid && (
                        <div className="space-y-3 mt-4">
                          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-3">
                            <Clock size={16} className="text-amber-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-bold text-amber-800">Mitra akan segera menghubungi anda</p>
                              <p className="text-[10px] text-amber-600 mt-1">Silahkan klik tombol di bawah kalau mitra sudah datang dan mulai bekerja.</p>
                            </div>
                          </div>
                          <button 
                            onClick={async () => {
                              if (window.confirm('Apakah mitra sudah mulai bekerja?')) {
                                try {
                                  await updateDoc(doc(db, 'transactions', t.id), {
                                    status: 'in_progress',
                                    updatedAt: serverTimestamp()
                                  });
                                } catch (e) {
                                  console.error(e);
                                  alert('Gagal mengupdate pesanan.');
                                }
                              }
                            }}
                            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/30 active:scale-95 transition-transform flex items-center justify-center gap-2"
                          >
                            <PlayCircle size={16} /> Mulai Pekerjaan
                          </button>
                        </div>
                      )}

                      {t.status === 'in_progress' && t.customerID === user?.uid && (
                        <div className="space-y-3 mt-4">
                          <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex items-start gap-3">
                            <Wrench size={16} className="text-blue-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-bold text-blue-800">Pekerjaan Sedang Berlangsung</p>
                              <p className="text-[10px] text-blue-600 mt-1">Silahkan klik tombol di bawah jika pekerjaan telah selesai.</p>
                            </div>
                          </div>
                          <button 
                            onClick={async () => {
                              if (window.confirm('Apakah pekerjaan sudah selesai?')) {
                                try {
                                  await updateDoc(doc(db, 'transactions', t.id), {
                                    status: 'completed',
                                    updatedAt: serverTimestamp()
                                  });
                                  alert('Terima kasih! Pesanan telah diselesaikan.');
                                } catch (e) {
                                  console.error(e);
                                  alert('Gagal menyelesaikan pesanan.');
                                }
                              }
                            }}
                            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/30 active:scale-95 transition-transform flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 size={16} /> Pekerjaan Selesai
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </main>
          </motion.div>
        )}

        {activePage === 'akun' && (
          <motion.div 
            key="akun"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <PageHeader title="Akun Saya" subtitle="Kelola profil dan preferensi Anda" />
            <main className="px-6 pt-6">
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 text-center mb-8 neo-3d">
                <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center text-slate-300 border-4 border-white shadow-lg overflow-hidden">
                  {user?.photoURL ? (
                    <img src={user.photoURL || undefined} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User size={48} />
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-800">{user?.displayName || 'Pengguna JasaMitra'}</h3>
                <p className="text-xs text-slate-400 font-medium mb-6">{user?.email || 'Belum login'}</p>
                {!user && (
                  <button 
                    onClick={() => navigateTo('login')}
                    className="bg-primary text-white text-xs font-bold px-8 py-3 rounded-2xl shadow-lg shadow-primary/30 active:scale-95 transition-transform"
                  >
                    Login
                  </button>
                )}
              </div>

              <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden mb-8">
                {[
                  { id: 'admin-pembayaran', label: 'Verifikasi Pembayaran', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', show: userRole === 'admin' },
                  { id: 'peraturan-pelanggan', label: 'Peraturan Pelanggan', icon: Info, color: 'text-slate-600', bg: 'bg-slate-100', show: userRole === 'tamu' },
                  { id: 'protokol-mitra', label: 'Protokol Keselamatan', icon: ShieldCheck, color: 'text-slate-600', bg: 'bg-slate-100', show: isMitra },
                  { id: 'daftar-mitra', label: 'Daftar Menjadi Mitra', icon: Wrench, color: 'text-accent', bg: 'bg-accent/10', isSpecial: true, show: userRole === 'mitra' && !isMitra },
                  { id: 'pesanan', label: 'Pesanan Masuk (Mitra)', icon: Handshake, color: 'text-slate-600', bg: 'bg-slate-100', show: isMitra },
                  { id: 'edit-profil', label: 'Edit Profil', icon: Edit3, color: 'text-slate-600', bg: 'bg-slate-50', show: true },
                  { id: 'alamat-saya', label: 'Alamat Saya', icon: MapPin, color: 'text-slate-600', bg: 'bg-slate-50', show: true },
                  { id: 'iklan-saya', label: 'Iklan Saya', icon: ClipboardList, color: 'text-slate-600', bg: 'bg-slate-50', show: isMitra },
                  { id: 'kebijakan', label: 'Kebijakan Privasi & Keamanan', icon: ShieldCheck, color: 'text-slate-500', bg: 'bg-slate-50', show: true },
                  { id: 'syarat-ketentuan', label: 'Syarat & Ketentuan', icon: FileText, color: 'text-slate-500', bg: 'bg-slate-50', show: true },
                ].filter(item => item.show).map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => navigateTo(item.id as Page)}
                    className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center ${item.color}`}>
                        <item.icon size={20} />
                      </div>
                      <span className={`text-sm font-bold text-left ${item.isSpecial ? 'text-accent' : 'text-slate-700'}`}>{item.label}</span>
                    </div>
                    <ChevronRight size={18} className="text-slate-300" />
                  </button>
                ))}
              </div>

              {userRole && (
                <button 
                  onClick={handleLogout}
                  className="w-full p-5 bg-rose-50 text-rose-600 rounded-[30px] font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <LogOut size={20} /> Keluar
                </button>
              )}
            </main>
          </motion.div>
        )}

        {/* --- CHAT --- */}
        {activePage === 'chat' && (
          <motion.div 
            key="chat"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-0 z-[2000] bg-slate-50 flex flex-col"
          >
            <header className="bg-white text-slate-800 p-5 pt-8 flex items-center gap-4 border-b border-slate-100">
              <button onClick={handleBack} className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-600">
                <ArrowLeft size={24} />
              </button>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-primary">Chat dengan Mitra</h2>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Online</span>
                </div>
              </div>
              <div className="flex gap-2">
                {userRole === 'mitra' ? (
                  <button 
                    onClick={() => setShowOfferModal(true)}
                    className="bg-primary text-white px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-primary/20"
                  >
                    <Plus size={14} />
                    Kirim Penawaran
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      // Find deal_agreed transaction for this mitra
                      const agreedTrans = transactions.find(t => 
                        t.customerID === user?.uid && 
                        t.mitraID === chatMitra?.id && 
                        t.status === 'deal_agreed'
                      );
                      if (agreedTrans) {
                        setActiveTransaction(agreedTrans);
                        setPaymentAmount(agreedTrans.dpAmount);
                        setPaymentProof(null);
                        setPaymentProofPreview(null);
                        setShowPaymentModal(true);
                      } else {
                        alert("Silakan klik 'Bayar DP 10%' terlebih dahulu untuk menyetujui penawaran.");
                      }
                    }} 
                    className="bg-emerald-50 text-emerald-600 px-3 py-2 rounded-xl border border-emerald-100 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <ShieldCheck size={14} />
                    Upload Bukti DP
                  </button>
                )}
                <button onClick={openDealModal} className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-primary text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                  <Handshake size={14} /> Bayar DP 10%
                </button>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="bg-accent/10 border-l-4 border-accent p-4 rounded-2xl text-[11px] text-accent font-medium leading-relaxed">
                <AlertTriangle size={16} className="inline mr-2 -mt-1" />
                Jaga keamanan bersama! Semua komunikasi wajib melalui chat internal. Dilarang berbagi nomor WhatsApp atau kontak pribadi lainnya.
              </div>

              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-30">
                  <Handshake size={64} className="mb-4" />
                  <p className="text-sm font-bold">Belum ada pesan</p>
                </div>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-[24px] text-sm font-medium shadow-sm ${m.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none'}`}>
                      {m.content}
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 mt-1 px-2">{m.time}</span>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </main>

            <footer className="bg-white p-4 border-t border-slate-100 flex items-end gap-3 safe-bottom">
              <button className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center active:scale-90 transition-transform">
                <ImageIcon size={20} />
              </button>
              <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ketik pesan..."
                className="flex-1 bg-slate-50 border-none rounded-2xl p-3 text-sm font-medium outline-none focus:ring-2 ring-primary/20 transition-all resize-none max-h-32"
                rows={1}
              />
              <button 
                onClick={sendMessage}
                disabled={!inputText.trim()}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${inputText.trim() ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-100 text-slate-300'}`}
              >
                <Send size={20} />
              </button>
            </footer>
          </motion.div>
        )}

        {/* --- ADMIN PEMBAYARAN --- */}
        {activePage === 'admin-pembayaran' && (
          <motion.div 
            key="admin-pembayaran"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="min-h-screen bg-slate-50 pb-24"
          >
            <header className="bg-white p-6 pt-12 border-b border-slate-100 flex items-center gap-4 sticky top-0 z-10">
              <button onClick={handleBack} className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-600">
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Verifikasi Pembayaran</h2>
            </header>

            <main className="p-6 space-y-6">
              {pendingPayments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-30">
                  <ShieldCheck size={64} className="mb-4" />
                  <p className="text-sm font-bold">Tidak ada pembayaran pending</p>
                </div>
              ) : (
                pendingPayments.map((p) => (
                  <motion.div 
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pelanggan</p>
                          <p className="text-sm font-black text-slate-800">{p.userName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                        <span className="bg-amber-50 text-amber-600 text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-wider">Pending</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-50 p-4 rounded-2xl">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nominal Deal</p>
                        <p className="text-sm font-black text-slate-800">Rp {p.dealAmount.toLocaleString()}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">DP 10% (Dibayar)</p>
                        <p className="text-sm font-black text-emerald-600">Rp {p.dpAmount.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Bukti Transfer</p>
                      <div 
                        onClick={() => setSelectedPaymentForView(p)}
                        className="relative aspect-video rounded-2xl overflow-hidden shadow-md cursor-pointer group"
                      >
                        <img src={p.proofUrl || undefined} className="w-full h-full object-cover" alt="Bukti Transfer" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Search size={24} className="text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => verifyPayment(p)}
                        className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold text-xs shadow-lg shadow-emerald-600/30 active:scale-95 transition-transform"
                      >
                        Verifikasi
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedPaymentForView(p);
                          setShowRejectModal(true);
                        }}
                        className="flex-1 bg-rose-50 text-rose-600 py-4 rounded-2xl font-bold text-xs border border-rose-100 active:scale-95 transition-transform"
                      >
                        Tolak
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </main>
          </motion.div>
        )}

        {/* --- SUBKATEGORI & POSTINGAN --- */}
        {activePage === 'subkategori' && (
          <motion.div key="subkategori" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <PageHeader 
              title={CATEGORIES.find(c => c.id === selectedCat)?.name || 'Layanan'} 
              subtitle={`Temukan jasa ${selectedCat} terbaik`} 
              onBack={handleBack} 
            />
            <main className="px-6 pt-6 pb-24">
              {/* Subcategory Filters */}
              {selectedCat !== 'all' && SUB_CATEGORIES[selectedCat] && (
                <section className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-5 bg-primary rounded-full" />
                    <h2 className="text-sm font-bold text-slate-700">Pilih Subkategori</h2>
                  </div>
                  <div className="flex gap-2.5 overflow-x-auto pb-3 hide-scrollbar">
                    <button 
                      onClick={() => setSelectedSub('all')}
                      className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all border-2 whitespace-nowrap font-bold text-[11px] ${selectedSub === 'all' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white border-slate-100 text-slate-500 shadow-sm'}`}
                    >
                      <LayoutGrid size={14} />
                      Semua
                    </button>
                    {SUB_CATEGORIES[selectedCat].map((sub) => (
                      <button 
                        key={sub.id}
                        onClick={() => setSelectedSub(sub.id)}
                        className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all border-2 whitespace-nowrap font-bold text-[11px] ${selectedSub === sub.id ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white border-slate-100 text-slate-500 shadow-sm'}`}
                      >
                        <sub.icon size={14} />
                        {sub.nama}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* Service List */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-800">
                    Daftar Jasa {selectedSub === 'all' ? '' : SUB_CATEGORIES[selectedCat]?.find(s => s.id === selectedSub)?.nama}
                  </h2>
                </div>
                <div className="space-y-4">
                  {filteredServices.length > 0 ? (
                    filteredServices.map((service) => (
                      <motion.div 
                        key={service.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex gap-4 neo-3d"
                      >
                        <img 
                          src={service.img || undefined} 
                          alt={service.title}
                          className="w-24 h-24 rounded-2xl object-cover shadow-inner"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div 
                            onClick={() => {
                              if (service.mitraId === user?.uid) {
                                navigateTo('iklan-saya');
                              } else {
                                openMitraProfile(service);
                              }
                            }} 
                            className="cursor-pointer"
                          >
                            <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{service.title}</h3>
                            <div className="flex items-center gap-1 mt-1">
                              <Star size={12} className="text-accent fill-accent" />
                              <span className="text-[10px] font-bold text-slate-600">{service.rating}</span>
                              <span className="text-[10px] text-slate-400 font-medium">({service.reviews} ulasan)</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-extrabold text-primary">Rp {formatPrice(service.price)}</span>
                            {service.mitraId === user?.uid ? (
                              <button 
                                onClick={(e) => { e.stopPropagation(); navigateTo('iklan-saya'); }}
                                className="bg-slate-400 text-white text-[10px] font-bold px-4 py-2 rounded-xl shadow-lg shadow-slate-200 active:scale-95 transition-transform"
                              >
                                IKLAN SAYA
                              </button>
                            ) : (
                              <button 
                                onClick={(e) => { e.stopPropagation(); setBookingService(service); }}
                                className="bg-primary text-white text-[10px] font-bold px-4 py-2 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-transform"
                              >
                                PESAN
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Search size={24} className="text-slate-300" />
                      </div>
                      <p className="text-sm text-slate-400 font-bold">Belum ada jasa tersedia</p>
                      <p className="text-xs text-slate-300 mt-1">Coba pilih subkategori lainnya</p>
                    </div>
                  )}
                </div>
              </section>
            </main>
          </motion.div>
        )}


        {/* --- PESANAN MASUK (MITRA) --- */}
        {activePage === 'pesanan' && (
          <motion.div key="pesanan" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <PageHeader title="Pesanan Masuk" subtitle="Kelola pesanan dari pelanggan" onBack={handleBack} />
            <main className="px-6 pt-6 space-y-4 pb-12">
              {mitraOrders.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                    <ClipboardList size={32} className="text-slate-400" />
                  </div>
                  <p className="text-slate-400 font-bold">Belum ada pesanan masuk</p>
                </div>
              ) : (
                mitraOrders.map((order) => (
                  <div key={order.id} className="bg-white p-6 rounded-[40px] shadow-sm border border-slate-100 neo-3d space-y-4">
                    {order.status === 'paid' && (
                      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-start gap-3 mb-2">
                        <div className="bg-emerald-100 p-2 rounded-full shrink-0">
                          <CheckCircle2 size={16} className="text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-emerald-800">Pelanggan sudah bayar DP 10%.</p>
                          <p className="text-[11px] text-emerald-600 mt-0.5">Silahkan hubungi pelanggan</p>
                          <p className="text-[11px] text-emerald-600 mt-0.5">Selamat bekerja dan semangat demi keluarga ❤️</p>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">{order.serviceTitle}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{order.customerName}</p>
                      </div>
                      <span className={`text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest ${
                        order.status === 'accepted' ? 'bg-primary/10 text-primary' : 
                        order.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                        order.status === 'rejected' ? 'bg-rose-50 text-rose-600' : 
                        'bg-accent/10 text-accent'
                      }`}>
                        {order.status === 'pending' ? 'Menunggu' : order.status === 'accepted' ? 'Diterima' : order.status === 'paid' ? 'Lunas (DP)' : 'Ditolak'}
                      </span>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center">
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Total Deal</p>
                        <p className="text-sm font-extrabold text-primary">Rp {order.totalPrice.toLocaleString()}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-2">Sisa Cash ke Mitra</p>
                        <p className="text-sm font-extrabold text-emerald-600">Rp {(order.totalPrice * 0.9).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Tanggal</p>
                        <p className="text-[10px] font-bold text-slate-700">{order.date}</p>
                      </div>
                    </div>

                    {order.status === 'paid' && order.customerPhone && (
                      <div className="bg-blue-50 p-4 rounded-2xl flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-bold text-blue-400 uppercase mb-1">Kontak Pelanggan</p>
                          <p className="text-sm font-black text-blue-700">{order.customerPhone}</p>
                        </div>
                        <a href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-600/30 active:scale-95 transition-transform">
                          <MessageSquare size={16} />
                        </a>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button 
                        onClick={() => {
                          setChatMitra({ id: order.customerID, name: order.customerName });
                          navigateTo('chat');
                        }}
                        className="flex-1 bg-slate-50 text-primary py-3 rounded-xl font-bold text-xs border border-slate-100 active:scale-95 transition-transform flex items-center justify-center gap-2"
                      >
                        <MessageSquare size={14} /> Chat Pelanggan
                      </button>
                      {order.status === 'pending' && (
                        <>
                          <button 
                            onClick={async () => {
                              try {
                                await updateDoc(doc(db, 'transactions', order.id), { status: 'accepted' });
                                alert('Pesanan diterima!');
                              } catch (error) {
                                console.error("Error accepting order:", error);
                                alert('Gagal menerima pesanan');
                              }
                            }}
                            className="flex-1 bg-primary text-white py-3 rounded-xl font-bold text-xs shadow-lg shadow-primary/20 active:scale-95 transition-transform"
                          >
                            Terima
                          </button>
                          <button 
                            onClick={async () => {
                              try {
                                await updateDoc(doc(db, 'transactions', order.id), { status: 'rejected' });
                                alert('Pesanan ditolak');
                              } catch (error) {
                                console.error("Error rejecting order:", error);
                                alert('Gagal menolak pesanan');
                              }
                            }}
                            className="flex-1 bg-white border border-slate-200 text-rose-500 py-3 rounded-xl font-bold text-xs active:scale-95 transition-transform"
                          >
                            Tolak
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </main>
          </motion.div>
        )}
        {activePage === 'profil-mitra' && selectedMitra && (
          <motion.div key="profil-mitra" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <PageHeader title="Profil Mitra" subtitle="Informasi lengkap penyedia jasa" onBack={handleBack} />
            <main className="px-6 pt-6 pb-12 space-y-6">
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 text-center neo-3d">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <img src={selectedMitra.foto || undefined} className="w-full h-full rounded-full border-4 border-primary shadow-lg object-cover" />
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-primary rounded-full border-2 border-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">{selectedMitra.name}</h3>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="bg-primary/10 text-primary text-[9px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={10} /> Terverifikasi
                  </span>
                  <span className="bg-accent/10 text-accent text-[9px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star size={10} fill="currentColor" /> {selectedMitra.rating}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium mt-3 flex items-center justify-center gap-1">
                  <MapPin size={12} className="text-primary" /> {selectedMitra.lokasi}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 text-center">
                  <span className="text-lg font-bold text-primary block">{selectedMitra.pengalaman}</span>
                  <span className="text-[8px] text-slate-400 font-bold uppercase">Tahun</span>
                </div>
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 text-center">
                  <span className="text-lg font-bold text-primary block">{selectedMitra.proyek}</span>
                  <span className="text-[8px] text-slate-400 font-bold uppercase">Proyek</span>
                </div>
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 text-center">
                  <span className="text-lg font-bold text-primary block">{selectedMitra.kepuasan}</span>
                  <span className="text-[8px] text-slate-400 font-bold uppercase">Kepuasan</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[40px] shadow-sm border border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-primary flex items-center gap-2"><User size={18} /> Tentang Saya</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{selectedMitra.tentang}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedMitra.layanan.map((l: string) => (
                    <span key={l} className="bg-primary/10 text-primary text-[9px] font-bold px-3 py-1.5 rounded-full">{l}</span>
                  ))}
                  {selectedMitra.skills?.map((s: string) => (
                    <span key={s} className="bg-accent/10 text-accent text-[9px] font-bold px-3 py-1.5 rounded-full">{s}</span>
                  ))}
                </div>
              </div>

              {selectedMitra.coverageAreas && selectedMitra.coverageAreas.length > 0 && (
                <div className="bg-white p-6 rounded-[40px] shadow-sm border border-slate-100 space-y-4">
                  <h3 className="text-sm font-bold text-primary flex items-center gap-2"><MapPin size={18} /> Jangkauan Wilayah</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMitra.coverageAreas.map((area: string) => (
                      <span key={area} className="bg-slate-100 text-slate-600 text-[9px] font-bold px-3 py-1.5 rounded-full">{area}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white p-6 rounded-[40px] shadow-sm border border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-primary flex items-center gap-2"><MapPin size={18} /> Alamat & Kontak</h3>
                
                {(() => {
                  const hasPaid = transactions.some(t => 
                    t.customerID === user?.uid && 
                    t.mitraID === selectedMitra.id.toString() && 
                    t.status === 'paid'
                  );

                  const censor = (text: string) => {
                    if (!text) return '';
                    if (hasPaid) return text;
                    const parts = text.split(' ');
                    return parts.slice(0, 2).join(' ') + ' ... (Disensor, Bayar DP untuk melihat)';
                  };

                  const censorPhone = (phone: string) => {
                    if (!phone) return '';
                    if (hasPaid) return phone;
                    return phone.substring(0, 4) + '-xxxx-xxxx';
                  };

                  return (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alamat Lengkap</p>
                        <p className="text-xs text-slate-500 leading-relaxed">{censor(selectedMitra.alamatLengkap)}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nomor WhatsApp</p>
                        <p className="text-sm font-bold text-slate-700">{censorPhone(selectedMitra.phone)}</p>
                      </div>

                      {hasPaid ? (
                        <a 
                          href={`https://wa.me/${selectedMitra.phone}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                        >
                          <Phone size={18} /> Hubungi via WhatsApp
                        </a>
                      ) : (
                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3">
                          <AlertTriangle size={18} className="text-amber-500 shrink-0" />
                          <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                            Nomor WhatsApp dan alamat lengkap disensor untuk keamanan. Silakan lakukan transaksi dan bayar DP 10% untuk membuka kontak mitra.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              <div className="bg-white p-6 rounded-[40px] shadow-sm border border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-primary flex items-center gap-2"><Star size={18} /> Review dari Pelanggan</h3>
                {mitraReviews && mitraReviews.length > 0 ? (
                  <div className="space-y-4">
                    {mitraReviews.map((review: any) => (
                      <div key={review.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold text-xs">
                            {review.customerName ? review.customerName.charAt(0).toUpperCase() : 'P'}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{review.customerName || 'Pelanggan'}</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={10} className={i < (review.rating || 5) ? "text-accent fill-accent" : "text-slate-200"} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{review.comment || 'Tidak ada komentar.'}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-slate-50 rounded-2xl">
                    <p className="text-xs font-medium text-slate-400">Belum ada review dari pelanggan.</p>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    setChatMitra({ id: selectedMitra.mitraId || selectedMitra.id.toString(), name: selectedMitra.name, serviceTitle: selectedMitra.title, serviceId: selectedMitra.id });
                    navigateTo('chat');
                  }}
                  className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/30 flex items-center justify-center gap-2"
                >
                  <Send size={18} /> Chat Mitra
                </button>
                <button onClick={handleBack} className="flex-1 bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl font-bold text-sm">Kembali</button>
              </div>
            </main>
          </motion.div>
        )}
        {activePage === 'daftar-mitra' && (
          <motion.div key="daftar-mitra" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <PageHeader title="Pendaftaran Mitra" subtitle="Lengkapi data diri & wilayah operasional" onBack={handleBack} />
            <main className="px-6 pt-6 pb-12">
              <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl mb-6 flex items-start gap-3">
                <Info size={18} className="text-primary shrink-0 mt-0.5" />
                <p className="text-[10px] text-primary font-bold leading-relaxed">
                  Mohon maaf, saat ini JasaMitra baru beroperasi di area Bandung Raya & Cimahi. Wilayah Anda sedang dalam tahap pengembangan.
                </p>
              </div>

              <div className="bg-white p-6 rounded-[40px] shadow-sm border border-slate-100 space-y-6">
                {regStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center mb-2">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-3">
                        <MapPin size={24} />
                      </div>
                      <h3 className="text-sm font-black text-slate-800">Tahap 1: Pilih Kota Operasional</h3>
                      <p className="text-[10px] text-slate-400 font-medium">Pilih wilayah tempat Anda akan bekerja</p>
                    </div>

                    <div className="space-y-3">
                      {['Kota Bandung', 'Kota Cimahi', 'Kab Bandung', 'Kab Bandung Barat', 'Lainnya'].map((city) => (
                        <label 
                          key={city}
                          className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${signupCity === city ? 'border-primary bg-primary/5' : 'border-slate-50 bg-slate-50'}`}
                        >
                          <span className={`text-xs font-bold ${signupCity === city ? 'text-primary' : 'text-slate-600'}`}>{city}</span>
                          <input 
                            type="radio" 
                            name="city" 
                            value={city} 
                            checked={signupCity === city}
                            onChange={(e) => setSignupCity(e.target.value)}
                            className="w-4 h-4 accent-primary"
                          />
                        </label>
                      ))}
                    </div>

                    {signupCity === 'Lainnya' && (
                      <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-start gap-3">
                        <AlertTriangle size={18} className="text-rose-500 shrink-0" />
                        <p className="text-[10px] text-rose-600 font-bold leading-relaxed">
                          Maaf, JasaMitra belum tersedia di wilayah Anda. Pendaftaran hanya dibuka untuk area Bandung Raya & Cimahi.
                        </p>
                      </div>
                    )}

                    <button 
                      onClick={() => setRegStep(2)}
                      disabled={!signupCity || signupCity === 'Lainnya'}
                      className="w-full bg-primary text-white py-5 rounded-[30px] font-bold text-sm shadow-xl shadow-primary/30 disabled:opacity-50 disabled:shadow-none"
                    >
                      Lanjut ke Tahap 2
                    </button>
                  </div>
                )}

                {regStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center mb-2">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-3">
                        <LayoutGrid size={24} />
                      </div>
                      <h3 className="text-sm font-black text-slate-800">Tahap 2: Pilih Kecamatan</h3>
                      <p className="text-[10px] text-slate-400 font-medium">Wilayah operasional di {signupCity}</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Kecamatan</label>
                      <select 
                        value={signupDistrict}
                        onChange={(e) => setSignupDistrict(e.target.value)}
                        className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none appearance-none border-2 border-transparent focus:border-primary/20"
                      >
                        <option value="">Pilih Kecamatan</option>
                        {signupCity && DISTRICTS[signupCity]?.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>

                    <div className="flex gap-3">
                      <button onClick={() => setRegStep(1)} className="flex-1 py-4 text-slate-400 font-bold text-sm">Kembali</button>
                      <button 
                        onClick={() => setRegStep(3)}
                        disabled={!signupDistrict}
                        className="flex-[2] bg-primary text-white py-5 rounded-[30px] font-bold text-sm shadow-xl shadow-primary/30 disabled:opacity-50"
                      >
                        Lanjut ke Tahap 3
                      </button>
                    </div>
                  </div>
                )}

                {regStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center mb-2">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-3">
                        <User size={24} />
                      </div>
                      <h3 className="text-sm font-black text-slate-800">Tahap 3: Data Diri & Alamat</h3>
                      <p className="text-[10px] text-slate-400 font-medium">Lengkapi detail pendaftaran Anda</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Nama Lengkap <span className="text-rose-500">*</span></label>
                        <input 
                          type="text" 
                          placeholder="Sesuai KTP" 
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20" 
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Nomor WhatsApp / Email <span className="text-rose-500">*</span></label>
                        <input 
                          type="text" 
                          placeholder="Contoh: 08123456789" 
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20" 
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Kata Sandi <span className="text-rose-500">*</span></label>
                        <input 
                          type="password" 
                          placeholder="Minimal 8 karakter" 
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Alamat Lengkap / No Rumah <span className="text-rose-500">*</span></label>
                        <textarea 
                          placeholder="Tulis alamat lengkap (Jalan, No Rumah, RT/RW)..." 
                          value={signupAddress}
                          onChange={(e) => setSignupAddress(e.target.value)}
                          className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none min-h-[100px]" 
                        />
                      </div>

                      {/* --- VERIFIKASI LEGALITAS & KEAHLIAN --- */}
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-6">
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                            <Building2 size={16} className="text-primary" /> 1. JENIS MITRA
                          </h4>
                          <div className="flex gap-3">
                            {['Perorangan', 'CV', 'PT'].map((type) => (
                              <label 
                                key={type}
                                className={`flex-1 flex items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer ${jenisMitra === type ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 bg-white text-slate-500'}`}
                              >
                                <input 
                                  type="radio" 
                                  name="jenisMitra" 
                                  value={type} 
                                  checked={jenisMitra === type}
                                  onChange={(e) => setJenisMitra(e.target.value)}
                                  className="hidden"
                                />
                                <span className="text-xs font-bold">{type}</span>
                              </label>
                            ))}
                          </div>

                          {(jenisMitra === 'CV' || jenisMitra === 'PT') && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-2">
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Nama Usaha <span className="text-rose-500">*</span></label>
                                <input 
                                  type="text" 
                                  placeholder="Contoh: CV Maju Jaya" 
                                  value={namaUsaha}
                                  onChange={(e) => setNamaUsaha(e.target.value)}
                                  className="w-full bg-white rounded-2xl p-4 text-sm font-medium outline-none border border-slate-200 focus:ring-2 ring-primary/20" 
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                  <label className="text-[9px] font-bold text-slate-500 block ml-1">Logo Usaha (Opsional)</label>
                                  <div className="relative group">
                                    <input 
                                      type="file" 
                                      accept="image/*"
                                      onChange={(e) => setLogoUsahaFile(e.target.files?.[0] || null)}
                                      className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                    />
                                    <div className="bg-white border border-dashed border-slate-300 p-3 rounded-xl flex flex-col items-center justify-center gap-1 group-hover:border-primary transition-colors">
                                      <ImageIcon size={16} className="text-slate-400 group-hover:text-primary" />
                                      <span className="text-[8px] font-bold text-slate-400 group-hover:text-primary truncate max-w-full">
                                        {logoUsahaFile ? logoUsahaFile.name : 'Upload Logo'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[9px] font-bold text-slate-500 block ml-1">NIB / Legalitas</label>
                                  <div className="relative group">
                                    <input 
                                      type="file" 
                                      accept="image/*,application/pdf"
                                      onChange={(e) => setLegalitasFile(e.target.files?.[0] || null)}
                                      className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                    />
                                    <div className="bg-white border border-dashed border-slate-300 p-3 rounded-xl flex flex-col items-center justify-center gap-1 group-hover:border-primary transition-colors">
                                      <FileText size={16} className="text-slate-400 group-hover:text-primary" />
                                      <span className="text-[8px] font-bold text-slate-400 group-hover:text-primary truncate max-w-full">
                                        {legalitasFile ? legalitasFile.name : 'Upload NIB'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-200">
                          <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                            <Star size={16} className="text-amber-500" /> 2. STATUS KEAHLIAN
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { id: 'Non Sertifikat', label: 'Non Sertifikat', icon: <ShieldCheck size={14} /> },
                              { id: 'Sertifikat', label: 'Sertifikat', icon: <Star size={14} /> }
                            ].map((status) => (
                              <label 
                                key={status.id}
                                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${statusKeahlian === status.id ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200 bg-white text-slate-500'}`}
                              >
                                <input 
                                  type="radio" 
                                  name="statusKeahlian" 
                                  value={status.id} 
                                  checked={statusKeahlian === status.id}
                                  onChange={(e) => setStatusKeahlian(e.target.value)}
                                  className="hidden"
                                />
                                {status.icon}
                                <span className="text-[10px] font-bold">{status.label}</span>
                              </label>
                            ))}
                          </div>

                          {statusKeahlian === 'Sertifikat' && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2 pt-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Upload Sertifikat Keahlian <span className="text-rose-500">*</span></label>
                              <div className="relative group">
                                <input 
                                  type="file" 
                                  accept="image/*,application/pdf"
                                  onChange={(e) => setSertifikatFile(e.target.files?.[0] || null)}
                                  className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                />
                                <div className="bg-white border border-dashed border-slate-300 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 group-hover:border-amber-500 transition-colors">
                                  <Camera size={20} className="text-slate-400 group-hover:text-amber-500" />
                                  <span className="text-xs font-bold text-slate-400 group-hover:text-amber-500">
                                    {sertifikatFile ? sertifikatFile.name : 'Pilih Gambar atau PDF'}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>

                      <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100 space-y-4">
                        <h4 className="text-[10px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-2"><ShieldCheck size={16} /> Dokumen Keamanan Wajib</h4>
                        <div className="space-y-3">
                          <div className="bg-white p-3 rounded-xl border border-rose-200">
                            <label className="text-[9px] font-bold text-rose-900 block mb-2">1. Foto KTP Asli</label>
                            <input 
                              type="file" 
                              className="text-[10px]" 
                              onChange={(e) => setSignupKtpFile(e.target.files?.[0] || null)}
                            />
                          </div>
                          <div className="bg-white p-3 rounded-xl border border-rose-200">
                            <label className="text-[9px] font-bold text-rose-900 block mb-2">2. Selfie Memegang KTP</label>
                            <input 
                              type="file" 
                              className="text-[10px]" 
                              onChange={(e) => setSignupSelfieFile(e.target.files?.[0] || null)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-accent/10 p-6 rounded-3xl border border-accent/20 space-y-4">
                        <h4 className="text-[10px] font-bold text-accent uppercase tracking-wider flex items-center gap-2"><AlertTriangle size={16} /> SYARAT PENDAFTARAN</h4>
                        <button 
                          onClick={() => navigateTo('syarat-pendaftaran-mitra')}
                          className="text-[11px] text-accent font-bold underline cursor-pointer text-left"
                        >
                          Baca Syarat Pendaftaran Mitra
                        </button>
                        {isTermsAccepted && (
                          <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-bold">
                            <ShieldCheck size={14} />
                            <span>Syarat & Ketentuan telah disetujui</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <button onClick={() => setRegStep(2)} className="flex-1 py-4 text-slate-400 font-bold text-sm">Kembali</button>
                        <button 
                          onClick={handleSignUp} 
                          className={`flex-[2] py-5 rounded-[30px] font-bold text-sm shadow-xl transition-all ${
                            (signupName && signupEmail && signupPassword && signupAddress && signupKtpFile && signupSelfieFile && isTermsAccepted && signupCity && signupDistrict && 
                             ((jenisMitra === 'Perorangan') || (namaUsaha)) && 
                             ((statusKeahlian === 'Non Sertifikat') || (sertifikatFile)))
                            ? 'bg-primary text-white shadow-primary/30'
                            : 'bg-slate-400 text-white shadow-none'
                          }`}
                        >
                          Kirim Pendaftaran
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </main>
          </motion.div>
        )}

        {/* --- SYARAT PENDAFTARAN MITRA --- */}
        {activePage === 'syarat-pendaftaran-mitra' && (
          <motion.div key="syarat-pendaftaran-mitra" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="min-h-screen bg-slate-50">
            <PageHeader title="Syarat Pendaftaran Mitra" subtitle="JasaMitra - Profesional & Terpercaya" onBack={handleBack} />
            <main className="px-4 pt-6 pb-20">
              <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">Syarat Pendaftaran Mitra JasaMitra</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    Untuk menjaga kualitas layanan dan kepercayaan pelanggan, setiap calon mitra yang ingin bergabung di platform JasaMitra wajib memenuhi persyaratan berikut:
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    { title: 'Identitas Diri', desc: 'Memiliki identitas diri yang sah dan masih berlaku (KTP atau identitas resmi lainnya).' },
                    { title: 'Keahlian Sesuai Bidang', desc: 'Memiliki keterampilan atau pengalaman kerja sesuai dengan layanan jasa yang didaftarkan.' },
                    { title: 'Peralatan Kerja', desc: 'Memiliki atau mampu menyediakan peralatan kerja yang memadai sesuai dengan jenis pekerjaan yang ditawarkan.' },
                    { title: 'Sikap Profesional', desc: 'Bersedia bekerja secara profesional, menjaga etika komunikasi, serta memberikan pelayanan yang ramah dan bertanggung jawab kepada pelanggan.' },
                    { title: 'Kepatuhan Protokol Kerja', desc: 'Bersedia mematuhi standar keselamatan kerja, penggunaan alat pelindung kerja, kebersihan area kerja, serta identitas profesional selama menjalankan pekerjaan.' },
                    { title: 'Sistem Bagi Hasil Platform', desc: 'Bersedia mengikuti sistem bagi hasil platform sebesar 10% dari nilai transaksi yang diperoleh melalui aplikasi JasaMitra.' },
                    { title: 'Verifikasi Data', desc: 'Bersedia mengikuti proses verifikasi data oleh tim JasaMitra untuk memastikan keaslian identitas dan kualitas layanan mitra.' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-xs shrink-0">{i + 1}</div>
                      <div>
                        <h4 className="text-sm font-black text-slate-800 mb-1">{item.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-slate-50">
                  <label className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={isTermsAccepted}
                      onChange={(e) => setIsTermsAccepted(e.target.checked)}
                      className="mt-1 w-5 h-5 accent-primary rounded-md" 
                    />
                    <span className="text-xs font-bold text-slate-600 leading-relaxed group-hover:text-primary transition-colors">
                      Saya telah membaca dan menyetujui Syarat Pendaftaran Mitra JasaMitra
                    </span>
                  </label>
                </div>

                <button 
                  onClick={handleBack}
                  className="w-full bg-primary text-white py-5 rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/30 active:scale-95 transition-all"
                >
                  Kembali
                </button>
              </div>
            </main>
          </motion.div>
        )}

        {/* --- PERATURAN PELANGGAN --- */}
        {activePage === 'peraturan-pelanggan' && (
          <motion.div key="peraturan-pelanggan" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <PageHeader title="Peraturan Pelanggan" subtitle="Hak & Kewajiban Pengguna Jasa" onBack={handleBack} />
            <main className="px-6 pt-6 pb-12">
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 space-y-8 neo-3d">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-primary/5 rounded-3xl flex items-center justify-center text-primary mb-6">
                    <ShieldCheck size={32} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tighter italic">Jaminan Keamanan <span className="text-primary">Pelanggan</span></h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    Sebagai platform jasa terpercaya, kami berkomitmen menjaga keamanan transaksi Anda melalui sistem jaminan 10%.
                  </p>
                </div>

                <div className="space-y-6 pt-6 border-t border-slate-50">
                  {[
                    { title: 'Sistem Pembayaran', desc: 'Pelanggan wajib membayar DP 10% melalui aplikasi sebagai jaminan pesanan. Sisa 90% dibayarkan tunai langsung ke mitra setelah pekerjaan selesai.' },
                    { title: 'Pembatalan Pesanan', desc: 'Pembatalan oleh pelanggan setelah mitra berangkat akan dikenakan biaya administrasi dari nilai DP yang telah dibayarkan.' },
                    { title: 'Keamanan Data', desc: 'Dilarang memberikan nomor WhatsApp atau kontak pribadi di dalam chat sebelum terjadi kesepakatan deal untuk menghindari penipuan.' },
                    { title: 'Etika Berinteraksi', desc: 'Berkomunikasilah dengan sopan dan hargai profesi mitra. Segala bentuk pelecehan akan berakibat pada pemblokiran akun permanen.' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-primary font-bold text-xs shrink-0">{i + 1}</div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 mb-1">{item.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-accent/10 p-6 rounded-3xl border border-accent/20">
                  <div className="flex items-center gap-2 mb-2 text-accent">
                    <AlertTriangle size={18} />
                    <h4 className="text-xs font-bold uppercase tracking-widest">Peringatan Penting</h4>
                  </div>
                  <p className="text-[10px] text-accent font-medium leading-relaxed">
                    JasaMitra tidak bertanggung jawab atas transaksi yang dilakukan di luar sistem aplikasi. Pastikan selalu menggunakan fitur "Deal" untuk perlindungan maksimal.
                  </p>
                </div>
              </div>
            </main>
          </motion.div>
        )}

        {/* --- PROTOKOL MITRA --- */}
        {activePage === 'protokol-mitra' && (
          <motion.div key="protokol-mitra" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <PageHeader title="Protokol Keselamatan & Profesionalisme" subtitle="Pedoman kerja bagi seluruh mitra" onBack={handleBack} />
            <main className="px-6 pt-6 pb-12">
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 space-y-8 neo-3d">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-6">
                    <ShieldCheck size={32} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tighter">Protokol Keselamatan & <span className="text-primary">Profesionalisme</span></h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    Pedoman kerja bagi seluruh mitra dalam memberikan layanan yang aman, profesional, and terpercaya.
                  </p>
                </div>

                <div className="space-y-8 pt-6 border-t border-slate-50">
                  {[
                    { title: '1. Alat Pelindung Diri (APD)', desc: 'Gunakan perlengkapan keselamatan kerja yang sesuai dengan jenis pekerjaan untuk melindungi diri sendiri, pelanggan, dan lingkungan sekitar.' },
                    { title: '2. Identitas Profesional', desc: 'Tunjukkan identitas diri yang jelas dan hadir dengan penampilan yang rapi serta profesional saat melayani pelanggan.' },
                    { title: '3. Kebersihan Area Kerja', desc: 'Jaga kerapian selama proses pekerjaan berlangsung dan pastikan area kerja kembali bersih serta tertata setelah pekerjaan selesai.' },
                    { title: '4. Komunikasi Sopan & Informatif', desc: 'Berkomunikasilah dengan bahasa yang santun, jelas, dan informatif agar pelanggan memahami proses pekerjaan yang dilakukan.' },
                    { title: '5. Ketepatan Waktu', desc: 'Hadir sesuai jadwal yang telah disepakati dan berikan informasi kepada pelanggan apabila terjadi perubahan waktu atau keterlambatan.' },
                    { title: '6. Kehati-hatian dalam Bekerja', desc: 'Laksanakan setiap pekerjaan dengan penuh kehati-hatian dan tanggung jawab untuk meminimalkan risiko serta menjaga keamanan properti pelanggan.' },
                    { title: '7. Tanggung Jawab atas Pekerjaan', desc: 'Selesaikan pekerjaan sesuai standar layanan yang baik serta pastikan pelanggan mengetahui hasil pekerjaan yang telah dilakukan.' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-xs shrink-0">{i + 1}</div>
                      <div>
                        <h4 className="text-sm font-black text-slate-800 mb-1">{item.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </motion.div>
        )}

        {/* --- JAMINAN KEAMANAN --- */}
        {activePage === 'jaminan-keamanan' && (
          <motion.div key="jaminan-keamanan" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <PageHeader title="Jaminan Keamanan" subtitle="Keamanan & Kepercayaan Anda" onBack={handleBack} />
            <main className="px-6 pt-6 pb-12">
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 space-y-8 neo-3d">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-6">
                    <ShieldCheck size={32} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tighter">Jaminan Keamanan <span className="text-primary">Verified</span></h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    JasaMitra berkomitmen menghadirkan layanan yang aman, transparan, dan terpercaya bagi seluruh pengguna.
                  </p>
                </div>

                <div className="space-y-8 pt-6 border-t border-slate-50">
                  {[
                    { title: '1. Verifikasi Identitas Mitra', desc: 'Setiap mitra melalui proses verifikasi data dan identitas sebelum dapat memberikan layanan kepada pelanggan.' },
                    { title: '2. Sistem Rating & Ulasan Terbuka', desc: 'Pelanggan dapat memberikan penilaian dan ulasan setelah layanan selesai, sehingga kualitas layanan mitra dapat terus terjaga secara transparan.' },
                    { title: '3. Riwayat Layanan Tercatat', desc: 'Setiap pesanan dan aktivitas layanan tercatat dalam sistem untuk memastikan transparansi dan kemudahan pelacakan riwayat layanan.' },
                    { title: '4. Dukungan Bantuan Pelanggan', desc: 'Tim dukungan siap membantu apabila pelanggan membutuhkan bantuan atau mengalami kendala selama proses layanan berlangsung.' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-xs shrink-0">{i + 1}</div>
                      <div>
                        <h4 className="text-sm font-black text-slate-800 mb-1">{item.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-slate-50">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <p className="text-xs text-slate-500 leading-relaxed font-bold text-center italic">
                      "JasaMitra berkomitmen menghadirkan layanan yang aman, transparan, dan terpercaya bagi seluruh pengguna"
                    </p>
                  </div>
                </div>
              </div>
            </main>
          </motion.div>
        )}

        {/* --- LOGIN --- */}
        {activePage === 'login' && (
          <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <PageHeader title="Selamat Datang!" subtitle="Masuk untuk menikmati semua fitur JasaMitra" onBack={handleBack} />
            <main className="px-6 pt-6">
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 space-y-6">
                {!showOtpInput ? (
                  <>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Email / WhatsApp</label>
                        <input 
                          type="text" 
                          placeholder="Masukkan email atau nomor WA" 
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Kata Sandi</label>
                        <input 
                          type="password" 
                          placeholder="Masukkan kata sandi" 
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20" 
                        />
                      </div>
                    </div>
                    <button 
                      onClick={handleLogin}
                      className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/30 active:scale-95 transition-transform"
                    >
                      Masuk Sekarang
                    </button>
                    
                    <div className="relative flex items-center gap-4 py-2">
                      <div className="flex-1 h-px bg-slate-100" />
                      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Atau masuk dengan</span>
                      <div className="flex-1 h-px bg-slate-100" />
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Nomor Handphone</label>
                        <div className="flex gap-2">
                          <input 
                            type="tel" 
                            placeholder="08123456789" 
                            value={loginPhone}
                            onChange={(e) => setLoginPhone(e.target.value)}
                            className="flex-1 bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20" 
                          />
                          <button 
                            onClick={handleSendOtp}
                            disabled={isSendingOtp}
                            className="bg-primary text-white px-6 rounded-2xl font-bold text-xs shadow-lg shadow-primary/20 disabled:opacity-50"
                          >
                            {isSendingOtp ? '...' : 'OTP'}
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <button 
                          onClick={handleGoogleLogin}
                          className="flex items-center justify-center gap-2 bg-white border border-slate-200 p-4 rounded-2xl text-xs font-bold text-slate-700 shadow-sm active:scale-95 transition-transform"
                        >
                          <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" className="w-4 h-4" /> Masuk dengan Google
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                        <Phone size={32} />
                      </div>
                      <h3 className="text-lg font-black text-slate-800">Verifikasi OTP</h3>
                      <p className="text-xs text-slate-400 mt-1">Masukkan kode yang dikirim ke {loginPhone}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2 text-center block">Kode OTP</label>
                      <input 
                        type="text" 
                        maxLength={6}
                        placeholder="123456" 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full bg-slate-50 rounded-2xl p-5 text-2xl font-black text-center tracking-[0.5em] outline-none focus:ring-2 ring-primary/20" 
                      />
                    </div>
                    <button 
                      onClick={handleVerifyOtp}
                      disabled={isVerifyingOtp}
                      className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-sm shadow-xl shadow-primary/30 active:scale-95 transition-transform disabled:opacity-50"
                    >
                      {isVerifyingOtp ? 'Memverifikasi...' : 'Verifikasi & Masuk'}
                    </button>
                    <button 
                      onClick={() => setShowOtpInput(false)}
                      className="w-full text-slate-400 font-bold text-xs py-2"
                    >
                      Ganti Nomor
                    </button>
                  </div>
                )}
                
                <div id="recaptcha-container"></div>

                {userRole === 'tamu' && (
                  <p className="text-center text-xs font-medium text-slate-400 mt-4">
                    Belum punya akun mitra? <button onClick={() => navigateTo('daftar-mitra')} className="text-primary font-bold">Daftar Di Sini</button>
                  </p>
                )}
              </div>
            </main>
          </motion.div>
        )}

        {/* --- KEBIJAKAN --- */}
        {activePage === 'kebijakan' && (
          <motion.div key="kebijakan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-slate-50">
            <PageHeader title="Kebijakan Privasi" subtitle="Keamanan & Perlindungan Data" onBack={handleBack} />
            <main className="px-4 pt-6 pb-20">
              <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary/20">
                      <ShieldCheck size={32} />
                    </div>
                    <div>
                      <h1 className="text-2xl font-black tracking-tighter text-primary">PRIVASI & <span className="text-accent">KEAMANAN</span></h1>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Data Protection Officer</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-12">
                  {/* Bagian 1: Syarat Penggunaan */}
                  <section className="space-y-6">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
                      <div className="w-2 h-6 bg-primary rounded-full" />
                      1. SYARAT & KETENTUAN PENGGUNAAN
                    </h3>
                    <div className="space-y-4">
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        Selamat datang di platform JasaMitra, sebuah layanan teknologi yang mempertemukan Pengguna (Pemberi Kerja) dengan Mitra (Penyedia Jasa) untuk berbagai layanan perbaikan, servis, dan instalasi. Dengan mengakses dan menggunakan aplikasi JasaMitra, Anda dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang berlaku.
                      </p>
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <p className="text-sm text-slate-600 leading-relaxed font-bold italic">
                          "JasaMitra bertindak sebagai fasilitator yang mempertemukan kedua belah pihak dan bukan merupakan penyedia jasa langsung."
                        </p>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        Seluruh perjanjian kerja, kesepakatan harga, dan pelaksanaan pekerjaan merupakan tanggung jawab masing-masing pihak. JasaMitra hanya menyediakan platform dan sistem jaminan keamanan untuk melindungi kedua belah pihak dari risiko penipuan dan wanprestasi.
                      </p>
                    </div>
                  </section>

                  {/* Bagian 2: Kebijakan Privasi */}
                  <section className="space-y-6">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
                      <div className="w-2 h-6 bg-primary rounded-full" />
                      2. KEBIJAKAN PRIVASI & PERLINDUNGAN DATA
                    </h3>
                    <div className="bg-primary/5 p-8 rounded-[40px] border border-primary/10 space-y-6">
                      <p className="text-sm text-slate-700 leading-relaxed font-bold">
                        PT JasaMitra Indonesia berkomitmen untuk melindungi data pribadi Anda sesuai dengan Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP).
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          'Nama Lengkap & Email',
                          'Nomor Telepon & WhatsApp',
                          'Alamat Domisili',
                          'Foto KTP & Swafoto',
                          'Dokumen SKCK',
                          'Informasi Rekening Bank'
                        ].map((item, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-2xl flex items-center gap-3 shadow-sm border border-primary/5">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                            <span className="text-xs font-bold text-slate-600">{item}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        Data yang kami kumpulkan digunakan semata-mata untuk keperluan verifikasi identitas, keamanan transaksi, dan pencegahan tindak penipuan. Kami tidak akan pernah menjual, menyewakan, atau menukar data pribadi Anda kepada pihak ketiga untuk tujuan komersial.
                      </p>
                    </div>
                  </section>

                  {/* Bagian 3: Keamanan & Verifikasi */}
                  <section className="space-y-6">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
                      <div className="w-2 h-6 bg-primary rounded-full" />
                      3. KEBIJAKAN KEAMANAN & VERIFIKASI MITRA
                    </h3>
                    <div className="space-y-6">
                      <div className="bg-rose-50 p-8 rounded-[40px] border border-rose-100">
                        <div className="flex items-center gap-3 mb-4 text-rose-600">
                          <AlertTriangle size={24} />
                          <h4 className="text-base font-black uppercase tracking-tight">Zero Tolerance Policy</h4>
                        </div>
                        <p className="text-sm text-rose-800 leading-relaxed font-bold">
                          JasaMitra menerapkan kebijakan toleransi nol terhadap segala bentuk tindak kekerasan, pelecehan seksual, pencurian, intimidasi, atau penipuan. Setiap pelanggaran akan ditindak tegas dengan pemblokiran akun permanen dan pelaporan kepada pihak kepolisian.
                        </p>
                      </div>
                      
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        Keamanan Pengguna adalah prioritas utama kami. Setiap Mitra wajib melewati proses verifikasi identitas berlapis yang mencakup pemeriksaan keaslian KTP, validasi wajah, verifikasi rekening bank, dan pemeriksaan SKCK yang masih berlaku.
                      </p>

                      <div className="bg-accent/10 p-8 rounded-[40px] border border-accent/20">
                        <h4 className="text-sm font-black text-accent mb-3 uppercase tracking-widest flex items-center gap-2">
                          <ShieldCheck size={18} /> Sistem Escrow Jaminan 10%
                        </h4>
                        <p className="text-sm text-accent font-bold leading-relaxed">
                          Kami menyediakan sistem jaminan 10% dari nilai kesepakatan untuk melindungi kedua belah pihak. Jaminan ini ditahan oleh sistem selama proses pekerjaan berlangsung untuk meminimalisir risiko kerugian akibat pembatalan sepihak atau ketidaksesuaian hasil pekerjaan.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Persetujuan */}
                  <div className="pt-12 border-t border-slate-100">
                    <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl shadow-slate-900/20">
                      <p className="text-sm font-medium leading-relaxed opacity-80 mb-6">
                        Dengan menggunakan layanan JasaMitra, Anda menyatakan setuju untuk tunduk pada seluruh kebijakan, syarat, dan ketentuan yang telah diuraikan di atas. JasaMitra berhak untuk melakukan perubahan terhadap kebijakan ini sewaktu-waktu.
                      </p>
                      <button 
                        onClick={handleBack}
                        className="w-full bg-primary text-white py-5 rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/30 active:scale-95 transition-all"
                      >
                        Saya Mengerti & Setuju
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">
                  Terakhir diperbarui: 05 Maret 2026
                </p>
                <button 
                  onClick={() => navigateTo('akun')}
                  className="bg-white border border-slate-200 px-10 py-5 rounded-full text-xs font-black text-slate-600 uppercase tracking-[0.2em] shadow-sm active:scale-95 transition-all flex items-center gap-3 mx-auto"
                >
                  <ArrowLeft size={18} /> Kembali ke Akun
                </button>
              </div>
            </main>
          </motion.div>
        )}

        {/* --- SYARAT & KETENTUAN --- */}
        {activePage === 'syarat-ketentuan' && (
          <motion.div key="syarat-ketentuan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-slate-50">
            <PageHeader title="Syarat & Ketentuan" subtitle="JasaMitra - Tukang Jagoan" onBack={handleBack} />
            <main className="px-4 pt-6 pb-20">
              <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
                      <ShieldCheck size={28} />
                    </div>
                    <div>
                      <h1 className="text-2xl font-black tracking-tighter">
                  <span className="text-[#003366]">JASA</span>
                  <span className="text-[#F27D26]">MITRA</span>
                </h1>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Legal & Compliance</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-8">
                  {/* Navigasi Cepat */}
                  <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar sticky top-0 z-10 bg-white/80 backdrop-blur-md -mx-2 px-2 py-2">
                    {[
                      { id: 'umum', label: 'Ketentuan Umum' },
                      { id: 'jaminan', label: 'Jaminan 10%' },
                      { id: 'mitra', label: 'Mitra' },
                      { id: 'pelanggan', label: 'Pelanggan' },
                    ].map((nav) => (
                      <button 
                        key={nav.id}
                        onClick={() => document.getElementById(nav.id)?.scrollIntoView({ behavior: 'smooth' })}
                        className="px-5 py-2.5 rounded-full text-[11px] font-bold whitespace-nowrap bg-slate-50 text-slate-600 border border-slate-100 hover:bg-primary hover:text-white transition-all"
                      >
                        {nav.label}
                      </button>
                    ))}
                  </div>

                  {/* Konten Syarat & Ketentuan */}
                  <div className="space-y-12">
                    {/* Bagian 1: Ketentuan Umum */}
                    <div id="umum" className="scroll-mt-24">
                      <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
                        <div className="w-2 h-6 bg-primary rounded-full" />
                        KETENTUAN UMUM
                      </h3>
                      
                      <div className="space-y-6">
                        <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                          <h4 className="text-sm font-black text-slate-800 mb-3 uppercase tracking-tight">1. PENGGUNAAN APLIKASI JASAMITRA</h4>
                          <p className="text-sm text-slate-500 leading-relaxed font-medium">
                            JasaMitra adalah platform teknologi yang mempertemukan Pengguna (Pelanggan) dengan Mitra (Penyedia Jasa) untuk berbagai layanan perbaikan, servis, dan instalasi. Kami bukan penyedia jasa langsung, melainkan fasilitator yang memastikan transaksi berjalan aman dan terpercaya.
                          </p>
                        </div>
                        
                        <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                          <h4 className="text-sm font-black text-slate-800 mb-3 uppercase tracking-tight">2. PENDAFTARAN DAN AKUN</h4>
                          <p className="text-sm text-slate-500 leading-relaxed mb-4 font-medium">
                            Setiap Pengguna wajib mendaftar dan memiliki akun untuk mengakses layanan JasaMitra. Data yang diberikan harus benar dan dapat dipertanggungjawabkan. Pengguna bertanggung jawab penuh atas keamanan akun dan aktivitas yang dilakukan.
                          </p>
                          <ul className="text-sm text-slate-500 leading-relaxed space-y-3 list-disc ml-5 font-bold">
                            <li>Pengguna dilarang memberikan akses akun kepada pihak lain.</li>
                            <li>JasaMitra berhak menonaktifkan akun jika ditemukan pelanggaran.</li>
                            <li>Data pribadi akan dilindungi sesuai Kebijakan Privasi.</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Bagian 2: JAMINAN KEAMANAN TRANSAKSI 10% */}
                    <div id="jaminan" className="scroll-mt-24 bg-primary/5 rounded-[40px] p-8 border border-primary/10">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                          <ShieldCheck size={24} />
                        </div>
                        <h3 className="text-xl font-black text-primary tracking-tight">JAMINAN KEAMANAN TRANSAKSI 10%</h3>
                      </div>
                      
                      <div className="space-y-6">
                        {[
                          { id: 1, title: 'Biaya Layanan', desc: 'Jaminan keamanan transaksi adalah BIAYA LAYANAN sebesar 10% dari nilai kesepakatan.', sub: 'Contoh: Deal Rp 1.000.000 → Biaya jaminan Rp 100.000 ke aplikasi, sisanya Rp 900.000 ke mitra.' },
                          { id: 2, title: 'Bukan Simpanan', desc: 'Biaya layanan ini BUKAN merupakan simpanan atau titipan dana perbankan.', sub: 'Kami hanya memfasilitasi jaminan, bukan bank atau lembaga keuangan.' },
                          { id: 3, title: 'Fungsi Biaya', desc: 'Biaya layanan berfungsi sebagai jaminan komitmen Mitra, kompensasi pembatalan, dan dana perlindungan transaksi.', sub: 'Memastikan kedua belah pihak terlindungi secara profesional.' },
                          { id: 4, title: 'Regulasi', desc: 'PT JasaMitra Indonesia BUKAN merupakan penyelenggara sistem pembayaran sebagaimana dimaksud dalam peraturan Bank Indonesia/OJK.', sub: 'Sesuai dengan regulasi platform teknologi di Indonesia.' },
                          { id: 5, title: 'Sisa Pembayaran', desc: 'Sisa pembayaran (90%) dilakukan langsung antara Pengguna dan Mitra di luar sistem JasaMitra.', sub: 'Dibayarkan tunai atau transfer langsung ke Mitra setelah pekerjaan selesai.' }
                        ].map((item) => (
                          <div key={item.id} className="flex gap-5 bg-white p-6 rounded-3xl shadow-sm border border-primary/5">
                            <div className="w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center text-sm font-black shrink-0 shadow-md shadow-primary/10">{item.id}</div>
                            <div>
                              <p className="text-sm font-black text-slate-800 mb-1">{item.title}</p>
                              <p className="text-sm text-slate-600 font-bold leading-relaxed mb-1">{item.desc}</p>
                              <p className="text-[11px] text-slate-400 font-medium italic">{item.sub}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="bg-primary text-white p-6 rounded-3xl mt-8 shadow-xl shadow-primary/20">
                        <div className="flex items-center gap-3 mb-2">
                          <Info size={18} />
                          <p className="text-xs font-black uppercase tracking-widest">Penting Diperhatikan</p>
                        </div>
                        <p className="text-sm font-bold leading-relaxed">
                          Dengan menggunakan JasaMitra, Anda menyetujui mekanisme jaminan 10% ini sebagai bentuk perlindungan bersama demi kenyamanan transaksi.
                        </p>
                      </div>
                    </div>

                    {/* Bagian 3: Ketentuan Mitra */}
                    <div id="mitra" className="scroll-mt-24">
                      <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
                        <div className="w-2 h-6 bg-primary rounded-full" />
                        KETENTUAN MITRA
                      </h3>
                      <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100">
                        <ul className="text-sm text-slate-600 space-y-4 list-disc ml-5 font-bold leading-relaxed">
                          <li>Mitra wajib menyelesaikan pekerjaan sesuai kesepakatan dengan Pengguna.</li>
                          <li>Mitra dilarang meminta pembayaran di luar mekanisme yang ditentukan.</li>
                          <li>Jika Mitra membatalkan sepihak, jaminan 10% akan dikembalikan kepada Pengguna.</li>
                          <li>Mitra wajib menjaga etika, kesopanan, dan keamanan saat di lokasi Pengguna.</li>
                          <li>Pelanggaran berat (penipuan, pelecehan, pencurian) akan diproses secara hukum.</li>
                        </ul>
                      </div>
                    </div>

                    {/* Bagian 4: Ketentuan Pelanggan */}
                    <div id="pelanggan" className="scroll-mt-24">
                      <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
                        <div className="w-2 h-6 bg-primary rounded-full" />
                        KETENTUAN PELANGGAN
                      </h3>
                      <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100">
                        <ul className="text-sm text-slate-600 space-y-4 list-disc ml-5 font-bold leading-relaxed">
                          <li>Pelanggan wajib membayar jaminan 10% sesuai kesepakatan sebelum pekerjaan dimulai.</li>
                          <li>Pelanggan wajib memberikan informasi yang jelas dan benar mengenai pekerjaan.</li>
                          <li>Jika Pelanggan membatalkan sepihak setelah Mitra datang, jaminan 10% menjadi hak Mitra.</li>
                          <li>Pelanggan wajib membayar sisa 90% langsung kepada Mitra setelah pekerjaan selesai.</li>
                          <li>Pelanggan dapat memberikan rating dan ulasan untuk membantu pengguna lain.</li>
                        </ul>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-12 border-t border-slate-100 text-center space-y-6">
                      <p className="text-xs text-slate-400 font-bold leading-relaxed">
                        © 2026 PT JasaMitra Indonesia. Hak Cipta Dilindungi.<br />
                        Terakhir diperbarui: 24 Februari 2026
                      </p>
                      <div className="flex justify-center gap-6">
                        <button onClick={() => navigateTo('kebijakan')} className="text-xs font-black text-primary uppercase tracking-widest">Kebijakan Privasi</button>
                        <div className="w-px h-4 bg-slate-200" />
                        <button onClick={() => navigateTo('syarat-ketentuan')} className="text-xs font-black text-primary uppercase tracking-widest">Syarat & Ketentuan</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 text-center">
                <button 
                  onClick={() => navigateTo('akun')}
                  className="bg-primary text-white px-10 py-5 rounded-full text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 active:scale-95 transition-all flex items-center gap-3 mx-auto"
                >
                  <ArrowLeft size={20} /> Kembali ke Akun
                </button>
              </div>
            </main>
          </motion.div>
        )}

      </AnimatePresence>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {showAdModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[4000] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full rounded-t-[40px] p-8 shadow-2xl max-h-[90vh] overflow-y-auto hide-scrollbar"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">{editingAdId ? 'Edit Iklan Jasa' : 'Buat Iklan Jasa'}</h3>
              <p className="text-xs text-slate-400 font-medium mb-8">{editingAdId ? 'Perbarui informasi iklan jasa Anda.' : 'Pasang iklan jasamu dan dapatkan lebih banyak pelanggan!'}</p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Judul Jasa</label>
                  <input 
                    type="text" 
                    value={adTitle}
                    onChange={(e) => setAdTitle(e.target.value)}
                    placeholder="Contoh: Servis AC Bergaransi" 
                    className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Kategori</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => {
                      const Icon = c.icon;
                      return (
                        <button
                          key={c.id}
                          onClick={() => {
                            setAdCategory(c.id);
                            setAdSubCategory('');
                          }}
                          className={`p-3 rounded-xl flex items-center gap-2 text-left transition-all border-2 ${adCategory === c.id ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 bg-white text-slate-600 hover:border-primary/30'}`}
                        >
                          <div className={`p-2 rounded-lg ${adCategory === c.id ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400'}`}>
                            <Icon size={16} />
                          </div>
                          <span className="text-xs font-bold leading-tight">{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Sub-Kategori</label>
                  {!adCategory ? (
                    <div className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium text-slate-400 text-center border-2 border-dashed border-slate-200">
                      Pilih Kategori Terlebih Dahulu
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {SUB_CATEGORIES[adCategory]?.map(sub => {
                        const Icon = sub.icon;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => setAdSubCategory(sub.id)}
                            className={`p-3 rounded-xl flex items-center gap-2 text-left transition-all border-2 ${adSubCategory === sub.id ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 bg-white text-slate-600 hover:border-primary/30'}`}
                          >
                            <div className={`p-2 rounded-lg ${adSubCategory === sub.id ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400'}`}>
                              <Icon size={16} />
                            </div>
                            <span className="text-xs font-bold leading-tight">{sub.nama}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Location Selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Wilayah Operasional</label>
                  <select 
                    value={adCity}
                    onChange={(e) => { setAdCity(e.target.value); setAdDistrict(''); setAdProvince('Jawa Barat'); }}
                    className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none appearance-none"
                  >
                    <option value="">Pilih Kota/Kab</option>
                    <option value="Kota Bandung">Kota Bandung</option>
                    <option value="Kota Cimahi">Kota Cimahi</option>
                    <option value="Kab. Bandung">Kab. Bandung</option>
                    <option value="Kab. Bandung Barat (KBB)">Kab. Bandung Barat (KBB)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Kecamatan</label>
                  <select 
                    value={adDistrict}
                    onChange={(e) => setAdDistrict(e.target.value)}
                    disabled={!adCity}
                    className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none appearance-none disabled:opacity-50"
                  >
                    <option value="">Pilih Kecamatan</option>
                    {adCity && DISTRICTS[adCity]?.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Jangkauan Wilayah (Opsional)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Kota Bandung', 'Kota Cimahi', 'Kab. Bandung', 'Kab. Bandung Barat (KBB)'].map(area => (
                      <button
                        key={area}
                        onClick={() => {
                          if (adCoverageAreas.includes(area)) {
                            setAdCoverageAreas(adCoverageAreas.filter(a => a !== area));
                          } else {
                            setAdCoverageAreas([...adCoverageAreas, area]);
                          }
                        }}
                        className={`p-3 rounded-xl border-2 text-[10px] font-bold transition-all text-left ${adCoverageAreas.includes(area) ? 'border-primary bg-primary/5 text-primary' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Tarif / Harga Mulai</label>
                  <input 
                    type="text" 
                    value={adPrice}
                    onChange={(e) => setAdPrice(e.target.value)}
                    placeholder="Rp 150.000" 
                    className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Kebijakan Layanan</label>
                  <div className="grid grid-cols-1 gap-2">
                    {['Bisa bawa Alat & Material', 'Hanya Sedia Jasa'].map(opt => (
                      <button 
                        key={opt}
                        onClick={() => setAdServicePolicy(opt)}
                        className={`p-3 rounded-xl border-2 text-[10px] font-bold transition-all text-left ${adServicePolicy === opt ? 'border-primary bg-primary/5 text-primary' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
                      >
                        {opt === 'Hanya Sedia Jasa' ? 'Hanya Sedia Jasa (Mitra bawa alat, material/bahan dari pelanggan)' : opt}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Foto Jasa</label>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-2 cursor-pointer overflow-hidden relative group"
                  >
                    {adImage ? (
                      <>
                        <img src={adImage || undefined} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Camera size={24} className="text-white" />
                        </div>
                      </>
                    ) : (
                      <>
                        <Camera size={24} />
                        <span className="text-[10px] font-bold">Upload Foto</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Deskripsi Keahlian</label>
                  <textarea 
                    value={adDesc}
                    onChange={(e) => setAdDesc(e.target.value)}
                    placeholder="Jelaskan keahlian dan pengalaman Anda..." 
                    className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none min-h-[120px]" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Keahlian Spesifik (Maks 5)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newSkill.trim() && adSkills.length < 5) {
                            setAdSkills([...adSkills, newSkill.trim()]);
                            setNewSkill('');
                          }
                        }
                      }}
                      placeholder="Contoh: Pasang Keramik" 
                      className="flex-1 bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none" 
                    />
                    <button 
                      onClick={() => {
                        if (newSkill.trim() && adSkills.length < 5) {
                          setAdSkills([...adSkills, newSkill.trim()]);
                          setNewSkill('');
                        }
                      }}
                      disabled={adSkills.length >= 5 || !newSkill.trim()}
                      className="bg-primary text-white px-6 rounded-2xl font-bold text-sm disabled:opacity-50"
                    >
                      Tambah
                    </button>
                  </div>
                  {adSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {adSkills.map((skill, index) => (
                        <div key={index} className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                          {skill}
                          <button onClick={() => setAdSkills(adSkills.filter((_, i) => i !== index))} className="hover:text-red-500">
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="pt-4 space-y-3">
                  <button 
                    disabled={isSubmittingAd}
                    onClick={async () => {
                      if (!adTitle || !adCategory || !adSubCategory || !adPrice || !adDesc || !adProvince || !adCity || !adDistrict) {
                        alert('Mohon lengkapi semua data iklan');
                        return;
                      }

                      if (mitraStatus !== 'approved') {
                        alert('Akun Anda belum disetujui Admin');
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
                          img: adImage || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
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
                    }} 
                    className="w-full bg-primary text-white py-5 rounded-[30px] font-bold text-sm shadow-xl shadow-primary/30 disabled:opacity-50"
                  >
                    {isSubmittingAd ? 'Memproses...' : (editingAdId ? 'Simpan Perubahan' : 'Kirim Pendaftaran Iklan')}
                  </button>
                  <button onClick={() => {
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
                  }} className="w-full py-4 text-slate-400 font-bold text-sm">Batal</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showDealModal && activeDeal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[4000] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white w-full max-w-sm rounded-[48px] p-8 shadow-2xl overflow-hidden relative border border-slate-100">
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-50 to-transparent -z-10" />
              
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center mx-auto mb-4 text-primary shadow-premium border border-slate-50 relative">
                  <div className="absolute -top-2 -right-2 bg-primary text-white p-1.5 rounded-full shadow-lg">
                    <ShieldCheck size={16} />
                  </div>
                  <Wallet size={48} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tighter italic">Bayar <span className="text-primary">DP 10%</span></h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Sistem Jaminan Transaksi Aman</p>
              </div>

              <div className="bg-slate-50/80 backdrop-blur-sm p-6 rounded-[32px] border border-slate-100 mb-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Kesepakatan</span>
                  <span className="text-lg font-black text-slate-800">Rp {activeDeal.total.toLocaleString()}</span>
                </div>
                
                <div className="h-px bg-slate-200/50 w-full" />
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">DP Jaminan (10%)</span>
                      <span className="text-[8px] text-primary/60 font-medium">Dibayar ke Aplikasi</span>
                    </div>
                    <span className="text-sm font-black text-primary">Rp {activeDeal.jaminan.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sisa Bayar (90%)</span>
                      <span className="text-[8px] text-slate-400 font-medium">Bayar Tunai di Lokasi</span>
                    </div>
                    <span className="text-sm font-black text-slate-400">Rp {(activeDeal.total - activeDeal.jaminan).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 p-6 rounded-[32px] mb-8 text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
                <div className="relative z-10">
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">Metode Transfer Bank</p>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xl font-black tracking-wider">5150 5566 45</p>
                    <div className="bg-white/10 px-2 py-1 rounded-lg text-[10px] font-black">BCA</div>
                  </div>
                  <p className="text-[10px] font-bold text-white/60">a.n. Admin Jasamitra</p>
                </div>
              </div>

              <div className="space-y-3">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmDeal} 
                  className="w-full bg-primary text-white py-5 rounded-[24px] font-black text-xs tracking-[0.15em] shadow-xl shadow-primary/30 flex items-center justify-center gap-3"
                >
                  <CheckCircle2 size={18} /> BAYAR DP 10%
                </motion.button>
                <button onClick={() => setShowDealModal(false)} className="w-full py-3 text-slate-400 font-bold text-[10px] uppercase tracking-widest">Batalkan Transaksi</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {bookingService && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[3000] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="bg-white w-full max-w-lg rounded-[40px] p-8 shadow-2xl relative overflow-y-auto max-h-[90vh]"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-100 rounded-full mt-3" />
              <button 
                onClick={() => setBookingService(null)}
                className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full text-slate-400"
              >
                <X size={20} />
              </button>

              <h3 className="text-xl font-bold text-slate-800 mb-2">{bookingService.title}</h3>
              <p className="text-xs text-slate-400 font-medium mb-8">Lengkapi data pengerjaan di bawah ini</p>

              <div className="space-y-6 mb-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-2">Nama Lengkap</label>
                    <input 
                      type="text" 
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      placeholder="Nama Anda" 
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-2">Alamat Pengerjaan</label>
                    <textarea 
                      value={bookingAddress}
                      onChange={(e) => setBookingAddress(e.target.value)}
                      placeholder="Alamat lengkap..." 
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20 resize-none h-24" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-2">Deskripsi Kerusakan</label>
                    <textarea 
                      value={bookingDesc}
                      onChange={(e) => setBookingDesc(e.target.value)}
                      placeholder="Ceritakan kendala Anda..." 
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20 resize-none h-24" 
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Kebijakan Layanan Mitra</p>
                  <p className="text-sm font-bold text-slate-700">{bookingService.servicePolicy || 'Bisa bawa Alat & Material'}</p>
                </div>

                <div className="bg-slate-900 p-6 rounded-[32px] text-white">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Estimasi Total</span>
                    <span className="text-xl font-black">
                      Rp {(() => {
                        const basePrice = parseInt(bookingService.price.replace(/[^0-9]/g, '')) || 0;
                        return basePrice.toLocaleString();
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">DP Jaminan (10%)</span>
                      <span className="text-[8px] text-white/40 font-medium">Wajib dibayar di awal</span>
                    </div>
                    <span className="text-lg font-black text-primary">
                      Rp {(() => {
                        const basePrice = parseInt(bookingService.price.replace(/[^0-9]/g, '')) || 0;
                        return Math.round(basePrice * 0.1).toLocaleString();
                      })()}
                    </span>
                  </div>
                </div>
              </div>

              <button 
                disabled={isSubmittingBooking}
                onClick={async () => {
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
                }}
                className="w-full bg-primary text-white py-5 rounded-[24px] font-bold text-sm shadow-xl shadow-primary/30 disabled:opacity-50"
              >
                {isSubmittingBooking ? 'Mengirim...' : 'PESAN SEKARANG'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {showTrackingModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowTrackingModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="relative w-full max-w-md bg-white rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl overflow-hidden"
            >
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6 sm:hidden" />
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Lacak Teknisi</h3>
                <button onClick={() => setShowTrackingModal(false)} className="p-2 bg-slate-50 rounded-full text-slate-400">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="relative h-48 bg-slate-100 rounded-3xl overflow-hidden shadow-inner">
                  <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400" className="w-full h-full object-cover opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-12 h-12 bg-primary rounded-full animate-ping absolute inset-0 opacity-20" />
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-lg relative z-10">
                        <MapPin size={24} />
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-sm border border-white">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Lokasi Terkini</p>
                    <p className="text-xs font-bold text-slate-700 truncate">Jl. Sederhana No. 20, Bandung</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { time: '10:30', status: 'Teknisi menuju lokasi', desc: 'Budi Santoso sedang dalam perjalanan', active: true },
                    { time: '10:15', status: 'Pesanan Dikonfirmasi', desc: 'Mitra telah menerima permintaan Anda', active: false },
                    { time: '10:00', status: 'Mencari Teknisi', desc: 'Sistem sedang mencocokkan dengan mitra terdekat', active: false },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${step.active ? 'bg-primary ring-4 ring-primary/20' : 'bg-slate-200'}`} />
                        {i !== 2 && <div className="w-0.5 h-10 bg-slate-100" />}
                      </div>
                      <div className="-mt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400">{step.time}</span>
                          <h4 className={`text-xs font-bold ${step.active ? 'text-slate-800' : 'text-slate-400'}`}>{step.status}</h4>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setShowTrackingModal(false)}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm mt-8 active:scale-95 transition-transform"
              >
                Tutup
              </button>
            </motion.div>
          </div>
        )}

        {showReviewModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowReviewModal(false)}
              className="absolute inset-0 bg-primary/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="relative w-full max-w-md bg-white rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6 sm:hidden" />
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center text-accent mx-auto mb-4 shadow-inner">
                  <Star size={40} fill="currentColor" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Beri Ulasan</h3>
                <p className="text-sm text-slate-400 mt-2">Bagaimana pengalaman Anda dengan Hendra Wijaya?</p>
              </div>

              <div className="flex justify-center gap-2 mb-8">
                {[1,2,3,4,5].map(star => (
                  <motion.button 
                    key={star}
                    whileTap={{ scale: 0.8 }}
                    className="text-accent"
                  >
                    <Star size={32} fill={star <= 4 ? "currentColor" : "none"} />
                  </motion.button>
                ))}
              </div>

              <textarea 
                placeholder="Tulis ulasan Anda di sini..."
                className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20 min-h-[120px] resize-none mb-6"
              />

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold text-sm active:scale-95 transition-transform"
                >
                  Batal
                </button>
                <button 
                  onClick={() => {
                    alert('Terima kasih atas ulasan Anda!');
                    setShowReviewModal(false);
                  }}
                  className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-primary/30 active:scale-95 transition-transform"
                >
                  Kirim
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showOfferModal && (
          <div className="fixed inset-0 z-[3000] flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowOfferModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="relative w-full max-w-md bg-white rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6 sm:hidden" />
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Kirim Penawaran Jasa</h3>
                <button onClick={() => setShowOfferModal(false)} className="p-2 bg-slate-50 rounded-full text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-2">Total Harga Jasa (100%)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                    <input 
                      type="number" 
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      placeholder="Contoh: 1000000" 
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-10 text-sm font-black outline-none focus:ring-2 ring-primary/20" 
                    />
                  </div>
                </div>

                {offerPrice && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">DP 10% (Wajib)</p>
                      <p className="text-sm font-black text-primary">Rp {(Number(offerPrice) * 0.1).toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sisa 90% (Cash)</p>
                      <p className="text-sm font-black text-slate-400">Rp {(Number(offerPrice) * 0.9).toLocaleString()}</p>
                    </div>
                  </div>
                )}

                <div className="bg-primary/5 p-4 rounded-2xl flex items-start gap-3">
                  <Info size={18} className="text-primary shrink-0" />
                  <p className="text-[10px] text-primary font-medium leading-relaxed">
                    Sistem akan otomatis menghitung DP 10% yang wajib dibayar pelanggan melalui platform JasaMitra. Sisa 90% akan dibayar cash langsung kepada Anda setelah pekerjaan selesai.
                  </p>
                </div>

                <button 
                  onClick={handleSendOffer}
                  disabled={isSendingOffer || !offerPrice}
                  className={`w-full py-5 rounded-[24px] font-black text-xs tracking-[0.15em] shadow-xl flex items-center justify-center gap-3 transition-all ${isSendingOffer || !offerPrice ? 'bg-slate-100 text-slate-300' : 'bg-primary text-white shadow-primary/30 active:scale-95'}`}
                >
                  {isSendingOffer ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={18} />
                      Kirim Penawaran
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showPaymentModal && (
          <div className="fixed inset-0 z-[3000] flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowPaymentModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="relative w-full max-w-md bg-white rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6 sm:hidden" />
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Upload Pembayaran DP</h3>
                <button onClick={() => setShowPaymentModal(false)} className="p-2 bg-slate-50 rounded-full text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 mb-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-2">Upload Bukti Transfer</label>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden" 
                      id="payment-proof"
                    />
                    <label 
                      htmlFor="payment-proof"
                      className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                      {paymentProofPreview ? (
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md">
                          <img src={paymentProofPreview || undefined} className="w-full h-full object-cover" alt="Preview" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <p className="text-white text-[10px] font-bold uppercase tracking-widest">Ganti Foto</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm">
                            <Camera size={24} />
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Klik untuk upload foto</p>
                          <p className="text-[8px] text-slate-300 font-medium">Maksimal 5MB (JPG/PNG)</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <button 
                onClick={submitPayment}
                disabled={isUploadingPayment || !paymentProofPreview || paymentAmount <= 0}
                className={`w-full py-5 rounded-[24px] font-black text-xs tracking-[0.15em] shadow-xl flex items-center justify-center gap-3 transition-all ${isUploadingPayment || !paymentProofPreview || paymentAmount <= 0 ? 'bg-slate-100 text-slate-300' : 'bg-emerald-600 text-white shadow-emerald-600/30 active:scale-95'}`}
              >
                {isUploadingPayment ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 size={18} /> KONFIRMASI PEMBAYARAN
                  </>
                )}
              </button>
            </motion.div>
          </div>
        )}

        {showRejectModal && (
          <div className="fixed inset-0 z-[4000] flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowRejectModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="relative w-full max-w-md bg-white rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6 sm:hidden" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">Tolak Pembayaran</h3>
              <p className="text-xs text-slate-400 font-medium mb-6">Berikan alasan penolakan agar pelanggan dapat memperbaiki data.</p>

              <textarea 
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                placeholder="Contoh: Bukti transfer tidak terbaca atau nominal tidak sesuai."
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-rose-500/20 resize-none h-32 mb-6"
              />

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold text-sm active:scale-95 transition-transform"
                >
                  Batal
                </button>
                <button 
                  onClick={rejectPayment}
                  disabled={!rejectionNote.trim()}
                  className={`flex-1 py-4 rounded-2xl font-bold text-sm shadow-lg active:scale-95 transition-transform ${rejectionNote.trim() ? 'bg-rose-600 text-white shadow-rose-600/30' : 'bg-slate-100 text-slate-300'}`}
                >
                  Tolak Sekarang
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {selectedPaymentForView && !showRejectModal && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedPaymentForView(null)}
              className="absolute inset-0 bg-slate-900/95 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-3xl aspect-auto max-h-[80vh] rounded-3xl overflow-hidden shadow-2xl"
            >
              <button 
                onClick={() => setSelectedPaymentForView(null)}
                className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md z-10 transition-colors"
              >
                <X size={24} />
              </button>
              <img src={selectedPaymentForView.proofUrl || undefined} className="w-full h-full object-contain" alt="Bukti Transfer Zoom" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Location Modal */}
      <LocationModal 
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelect={(loc) => {
          setSelectedLocation(loc);
          setShowLocationModal(false);
          // Navigate to subkategori to show filtered ads
          setSelectedCat('all');
          setSelectedSub('all');
          navigateTo('subkategori');
          
          // Optional: update recent locations
          if (!recentLocations.includes(loc) && loc !== selectedLocation) {
            setRecentLocations([loc, ...recentLocations.slice(0, 2)]);
          }
        }}
        onDetectLocation={detectLocation}
        currentLocation={selectedLocation}
        recentLocations={recentLocations}
        currentAddress={currentAddress}
      />

      {/* Bottom Nav (Only on main pages) */}
      {['beranda', 'pesan', 'layanan', 'akun'].includes(activePage) && (
        <BottomNav 
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

