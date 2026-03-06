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
  Heart
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
import { auth, db, isFirebaseConfigured } from './lib/firebase';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { collection, query, onSnapshot, addDoc, serverTimestamp, getDocs, where, orderBy, updateDoc, doc, setDoc } from 'firebase/firestore';

// --- Types ---
type Page = 'beranda' | 'pesan' | 'layanan' | 'akun' | 'login' | 'daftar-mitra' | 'kebijakan' | 'syarat-ketentuan' | 'edit-profil' | 'alamat-saya' | 'iklan-saya' | 'chat' | 'profil-mitra' | 'pesanan' | 'subkategori' | 'peraturan-pelanggan' | 'protokol-mitra' | 'admin-pembayaran' | 'syarat-pendaftaran-mitra';

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
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white text-slate-900"
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <div className="w-32 h-32 bg-primary/5 rounded-[40px] flex items-center justify-center border-4 border-slate-50 shadow-xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent animate-pulse" />
          <Handshake size={64} className="text-primary relative z-10" />
        </div>
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <h1 className="text-3xl font-black tracking-tighter text-primary">JASA<span className="text-accent">MITRA</span></h1>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-2">Solusi Jasa Terpercaya</p>
      </motion.div>
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
          <h2 className="text-4xl font-black leading-tight tracking-tighter mb-4 text-primary">
            Selamat Datang di <br/>
            JASA<span className="text-accent">MITRA</span>
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
      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 border border-slate-100">
        <Bell size={18} />
      </div>
    </div>
  </header>
);

const LocationModal = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  currentLocation,
  recentLocations,
  currentAddress 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSelect: (loc: string) => void,
  currentLocation: string,
  recentLocations: string[],
  currentAddress: string
}) => {
  const [search, setSearch] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const filteredProvinces = PROVINCES.filter(p => p.toLowerCase().includes(search.toLowerCase()));
  const filteredCities = selectedProvince ? (CITIES[selectedProvince] || []).filter(c => c.toLowerCase().includes(search.toLowerCase())) : [];
  const filteredDistricts = selectedCity ? (DISTRICTS[selectedCity] || []).filter(d => d.toLowerCase().includes(search.toLowerCase())) : [];

  const handleBack = () => {
    if (selectedCity) {
      setSelectedCity(null);
    } else if (selectedProvince) {
      setSelectedProvince(null);
    } else {
      onClose();
    }
  };

  const resetSelection = () => {
    setSelectedProvince(null);
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
              {selectedProvince ? <ArrowLeft size={24} className="text-slate-600" /> : <X size={24} className="text-slate-600" />}
            </button>
            <h2 className="ml-4 text-xl font-bold text-slate-800">
              {!selectedProvince ? 'Pilih Provinsi' : !selectedCity ? `Kota di ${selectedProvince}` : `Kecamatan di ${selectedCity}`}
            </h2>
          </div>

          {/* Search Bar */}
          <div className="px-6 py-4">
            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-primary/30 transition-all">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder={!selectedProvince ? "Cari provinsi..." : !selectedCity ? "Cari kota/kabupaten..." : "Cari kecamatan..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ml-3 w-full bg-transparent outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {!selectedProvince && (
              <>
                {/* Gunakan Lokasi Saat Ini */}
                <button 
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition((position) => {
                        onSelect(currentAddress);
                      }, (error) => {
                        console.warn("Geolocation failed:", error);
                        onSelect(currentAddress);
                      });
                    } else {
                      onSelect(currentAddress);
                    }
                  }}
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
              {!selectedProvince && (
                <>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Pilih Provinsi</h4>
                  <button 
                    onClick={() => onSelect('Indonesia')}
                    className="w-full text-left py-3 text-primary font-bold text-sm mb-4"
                  >
                    Semua dalam Indonesia
                  </button>
                  
                  <div className="space-y-1">
                    {filteredProvinces.map((prov, i) => (
                      <button 
                        key={i}
                        onClick={() => {
                          setSelectedProvince(prov);
                          setSearch('');
                        }}
                        className="w-full flex items-center justify-between py-4 border-b border-slate-50 group hover:bg-slate-50 px-2 -mx-2 rounded-lg transition-colors"
                      >
                        <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">{prov}</span>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
                      </button>
                    ))}
                  </div>
                </>
              )}

              {selectedProvince && !selectedCity && (
                <>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Pilih Kota/Kabupaten di {selectedProvince}</h4>
                  <div className="space-y-1">
                    {filteredCities.length > 0 ? filteredCities.map((city, i) => (
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
                    )) : (
                      <p className="text-xs text-slate-400 italic py-4">Data kota belum tersedia untuk provinsi ini.</p>
                    )}
                  </div>
                </>
              )}

              {selectedCity && (
                <>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Pilih Kecamatan di {selectedCity}</h4>
                  <div className="space-y-1">
                    {filteredDistricts.length > 0 ? filteredDistricts.map((dist, i) => (
                      <button 
                        key={i}
                        onClick={() => {
                          onSelect(`${dist}, ${selectedCity}, ${selectedProvince}`);
                        }}
                        className="w-full flex items-center justify-between py-4 border-b border-slate-50 group hover:bg-slate-50 px-2 -mx-2 rounded-lg transition-colors"
                      >
                        <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">{dist}</span>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
                      </button>
                    )) : (
                      <p className="text-xs text-slate-400 italic py-4">Data kecamatan belum tersedia untuk kota ini.</p>
                    )}
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
  const [chatMitra, setChatMitra] = useState<{ id: string, name: string, serviceTitle?: string } | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [showDealModal, setShowDealModal] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeDeal, setActiveDeal] = useState<any>(null);
  const [selectedMitra, setSelectedMitra] = useState<any>(null);
  const [experiences, setExperiences] = useState([{ id: 1, company: '', position: '', start: '', end: '', desc: '' }]);
  const [adImage, setAdImage] = useState<string | null>(null);
  const [adProvince, setAdProvince] = useState('');
  const [adCity, setAdCity] = useState('');
  const [adDistrict, setAdDistrict] = useState('');
  const [adTitle, setAdTitle] = useState('');
  const [adCategory, setAdCategory] = useState('');
  const [adPrice, setAdPrice] = useState('');
  const [adDesc, setAdDesc] = useState('');
  const [bookingName, setBookingName] = useState('');
  const [bookingAddress, setBookingAddress] = useState('');
  const [bookingDesc, setBookingDesc] = useState('');
  const [isSubmittingAd, setIsSubmittingAd] = useState(false);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [regStep, setRegStep] = useState(1);
  const [toolProvider, setToolProvider] = useState('mitra');
  const [materialProvider, setMaterialProvider] = useState('mitra');
  const [materialPrice, setMaterialPrice] = useState('');
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
  const [selectedLocation, setSelectedLocation] = useState('Jawa Barat');
  const [currentAddress, setCurrentAddress] = useState('Kec. Cimahi Utara, Kota Cimahi');
  const [recentLocations, setRecentLocations] = useState(['Jawa Barat', 'Indonesia', 'Bekasi Kab., Jawa Barat']);

  // Data Iklan (Mock dari HTML)
  const [myAds, setMyAds] = useState<any[]>([]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const [isSendingOffer, setIsSendingOffer] = useState(false);
  const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    
    try {
      const q = query(collection(db, 'services'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const svcs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as any;
        setServices(svcs.length > 0 ? svcs : INITIAL_SERVICES);
      }, (error) => {
        if (error.code === 'permission-denied') {
          console.warn("Firestore services listener: Permission denied. User likely not authenticated.");
          setServices(INITIAL_SERVICES);
        } else {
          console.error("Firestore services listener failed:", error);
        }
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Failed to fetch services:", error);
    }
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    
    try {
      const q = query(collection(db, 'mitras'), where('isFeatured', '==', true));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const mitras = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFeaturedMitras(mitras);
      }, (error) => {
        if (error.code === 'permission-denied') {
          console.warn("Firestore mitras listener: Permission denied.");
        } else {
          console.error("Firestore mitras listener failed:", error);
        }
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Failed to fetch featured mitras:", error);
    }
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    
    try {
      const q = query(collection(db, 'banners'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const bns = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBanners(bns.length > 0 ? bns : [
          { id: 'default-1', name: 'Protokol Keselamatan & Profesionalisme', img: 'https://i.ibb.co.com/27j0Cgqf/1772634130721.png', desc: 'Standar Keamanan Mitra', color: 'from-slate-800 to-slate-900', page: 'protokol-mitra', btn: 'Lihat Protokol' }
        ]);
      }, (error) => {
        if (error.code === 'permission-denied') {
          console.warn("Firestore banners listener: Permission denied.");
        } else {
          console.error("Firestore banners listener failed:", error);
        }
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Failed to fetch banners:", error);
    }
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
      const q = query(
        collection(db, 'orders'),
        where('mitraId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMitraOrders(orders);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Failed to fetch mitra orders:", error);
    }
  }, [user]);

  useEffect(() => {
    if (!isFirebaseConfigured || !user) {
      setTransactions([]);
      return;
    }
    
    try {
      const q = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const transList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Transaction[];
        setTransactions(transList);
      }, (error) => {
        if (error.code === 'permission-denied') {
          console.warn("Firestore transactions listener: Permission denied.");
        } else {
          console.error("Firestore transactions listener failed:", error);
        }
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Failed to setup Firestore transactions listener:", error);
    }
  }, [user]);

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

    try {
      const q = query(
        collection(db, 'payments'),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const paymentsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Payment[];
        setPendingPayments(paymentsData);
      }, (error) => {
        if (error.code === 'permission-denied') {
          console.warn("Firestore payments listener: Permission denied.");
        } else {
          console.error("Firestore payments listener failed:", error);
        }
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Failed to setup payments listener:", error);
    }
  }, [user, userRole]);

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

  const filteredServices = services.filter(s => {
    const title = s.title || '';
    const cat = s.cat || '';
    const subcat = s.subcat || '';
    const location = s.location || '';
    
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCat === 'all' || cat === selectedCat;
    const matchesSub = selectedSub === 'all' || subcat === selectedSub;
    
    let matchesLocation = true;
    if (selectedLocation !== 'Indonesia') {
      matchesLocation = location.toLowerCase().includes(selectedLocation.toLowerCase()) || 
                        selectedLocation.toLowerCase().includes(location.toLowerCase());
    }
    
    return matchesSearch && matchesCat && matchesSub && matchesLocation;
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

  const navigateTo = (page: Page) => {
    setPrevPage(activePage);
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (prevPage) {
      setActivePage(prevPage);
      setPrevPage(null);
    } else {
      setActivePage('beranda');
    }
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

  const openMitraProfile = (service: Service) => {
    setSelectedMitra({
      id: service.id,
      name: "Ahmad Fauzi",
      foto: service.img,
      lokasi: "Jakarta Selatan",
      tentang: "Teknisi berpengalaman lebih dari 5 tahun dalam menangani berbagai perbaikan elektronik rumah tangga. Spesialisasi dalam servis AC, kulkas, dan mesin cuci. Memiliki sertifikasi resmi dari teknisi nasional.",
      alamatLengkap: "Jl. Merpati No. 123, RT 01 RW 02, Kel. Pondok Labu, Kec. Cilandak, Jakarta Selatan 12450",
      phone: "081234567890",
      pengalaman: 5,
      proyek: 127,
      kepuasan: "98%",
      rating: 4.9,
      layanan: ["Servis AC", "Servis Kulkas", "Mesin Cuci", "Instalasi Listrik"]
    });
    navigateTo('profil-mitra');
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
    const price = 1000000; // Contoh harga deal
    const jaminan = price * 0.1;
    setActiveDeal({
      jasa: chatMitra?.serviceTitle || 'Servis AC',
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
      
      // Save to chat
      await addDoc(collection(db, 'chats', chatMitra?.id || 'general', 'messages'), {
        sender: 'user',
        senderId: user.uid,
        type: 'text',
        content: dealContent,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        isDeal: true,
        timestamp: serverTimestamp()
      });

      // Save to orders
      await addDoc(collection(db, 'orders'), {
        customerId: user.uid,
        customerName: user.displayName || 'Pengguna JasaMitra',
        mitraId: chatMitra?.id,
        mitraName: chatMitra?.name,
        serviceTitle: activeDeal.jasa,
        totalPrice: activeDeal.total,
        jaminan: activeDeal.jaminan,
        status: 'pending',
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        timestamp: serverTimestamp()
      });

      setShowDealModal(false);
      alert('Pembayaran jaminan dikonfirmasi! Pesanan telah dikirim ke mitra.');
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
        mitraID: user.uid,
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

      // Update transaction if exists
      if (activeTransaction) {
        await updateDoc(doc(db, 'transactions', activeTransaction.id), {
          status: 'paid', // For demo, we mark as paid immediately after upload or wait for admin?
          // The user said: "Jika status transaksi sudah 'paid', nomor WhatsApp dan alamat asli akan otomatis muncul"
          // Usually 'paid' happens after admin verification. 
          // But for this flow, let's assume 'paid' is the goal.
          proofUrl: paymentProofPreview,
          updatedAt: serverTimestamp()
        });
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

      const content = `📤 BUKTI TRANSFER DIUNGGAL\nNominal Deal: Rp ${paymentAmount.toLocaleString()}\nDP 10%: Rp ${dpAmount.toLocaleString()}\nStatus: Menunggu Verifikasi Admin`;

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
      alert('Bukti transfer berhasil diunggah! Mohon tunggu verifikasi admin.');
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
                  <h1 className="text-xl font-black tracking-tighter text-primary">JASA<span className="text-accent">MITRA</span></h1>
                  <div 
                    onClick={() => setShowLocationModal(true)}
                    className="flex items-center gap-1 text-slate-500 cursor-pointer hover:text-primary transition-colors bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100"
                  >
                    <MapPin size={12} className="text-primary" />
                    <span className="text-[10px] font-bold truncate max-w-[80px]">{selectedLocation}</span>
                    <ChevronDown size={12} />
                  </div>
                </div>

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
                    <motion.div whileTap={{ scale: 0.9 }} className="relative text-slate-600">
                      <Bell size={20} />
                      <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center">
                        <span className="text-[7px] text-white font-bold">2</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </header>

            <main className="px-5 pt-5 relative z-20 pb-32 bg-slate-50/30">
              {/* Security Banner (Jaminan) */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 mb-6 relative overflow-hidden group"
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
              </motion.div>

              {/* Banners Toko Mitra (Carousel style with dots) */}
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
                        <img src={banner.img} className="absolute inset-0 w-full h-full object-cover" alt={banner.name} referrerPolicy="no-referrer" />
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

              {/* Mitra Unggulan (Featured Partners) */}
              <section className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-slate-800 tracking-tight">Mitra Unggulan</h2>
                  <button className="text-[10px] font-bold text-primary uppercase tracking-widest">Lihat Semua</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar -mx-5 px-5">
                  {featuredMitras.length === 0 ? (
                    <div className="w-full py-10 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Belum ada mitra unggulan</p>
                    </div>
                  ) : (
                    featuredMitras.map((mitra) => (
                      <motion.div 
                        key={mitra.id} 
                        whileHover={{ y: -8 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedMitra(mitra);
                          navigateTo('profil-mitra');
                        }}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 cursor-pointer min-w-[170px] max-w-[170px] relative group"
                      >
                        <div className="absolute top-2.5 right-2.5 z-10 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-slate-100">
                          <Star size={10} className="text-accent fill-accent" />
                          <span className="text-[10px] font-black text-slate-800">{mitra.rating || 5.0}</span>
                        </div>
                        <div className="h-28 overflow-hidden relative">
                          <img src={mitra.img || mitra.foto} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={mitra.name} referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                        <div className="p-3">
                          <div className="flex items-center gap-1 mb-1">
                            <h3 className="text-[11px] font-bold text-slate-800 truncate">{mitra.name}</h3>
                            <ShieldCheck size={10} className="text-primary shrink-0" />
                          </div>
                          <p className="text-[9px] text-slate-400 font-medium line-clamp-1 mb-3">{mitra.desc || mitra.kategori}</p>
                          <button className="w-full bg-slate-50 hover:bg-primary hover:text-white text-primary text-[9px] font-bold py-2 rounded-lg transition-colors border border-primary/10">
                            Lihat Profil
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </section>

              {/* Home Service List (Recommendations Only) */}
              <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-800">Rekomendasi Untukmu</h2>
                </div>
                <div className="space-y-4">
                  {filteredServices.length > 0 ? filteredServices.slice(0, 5).map((service) => (
                    <motion.div 
                      key={service.id}
                      whileTap={{ scale: 0.98 }}
                      className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex gap-4 neo-3d cursor-pointer"
                      onClick={() => openMitraProfile(service)}
                    >
                      <img 
                        src={service.img} 
                        alt={service.title}
                        className="w-20 h-20 rounded-2xl object-cover shadow-inner"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{service.title}</h3>
                          <div className="flex items-center gap-1 mt-1">
                            <Star size={12} className="text-accent fill-accent" />
                            <span className="text-[10px] font-bold text-slate-600">{service.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-extrabold text-primary">{service.price}</span>
                          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Detail</span>
                        </div>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-200">
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
                  <img src={user?.photoURL || "https://ui-avatars.com/api/?name=User&background=2563eb&color=fff&size=100"} className="w-full h-full rounded-full border-4 border-white shadow-lg object-cover" />
                  <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg"><Camera size={16} /></button>
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
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 text-center py-12">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
                  <MapPin size={32} />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Belum Ada Alamat</h3>
                <p className="text-xs font-medium text-slate-400 mt-2">Anda belum menambahkan alamat pengiriman.</p>
              </div>
              <button className="w-full py-6 border-2 border-dashed border-slate-200 rounded-[40px] text-slate-400 font-bold text-xs flex items-center justify-center gap-2"><Plus size={20} /> Tambah Alamat Baru</button>
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
                      <img src={ad.img} className="w-20 h-20 rounded-2xl object-cover shadow-inner" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-bold text-slate-800">{ad.title}</h3>
                          <span className={`text-[8px] font-extrabold px-2 py-1 rounded-full uppercase tracking-widest ${ad.status === 'aktif' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>{ad.status}</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 mt-1">{ad.cat}</p>
                        <p className="text-xs font-extrabold text-primary mt-2">{ad.price}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
                      <button className="flex-1 bg-primary/10 text-primary p-2 rounded-xl"><Edit3 size={16} className="mx-auto" /></button>
                      <button className="flex-1 bg-accent/10 text-accent p-2 rounded-xl"><PauseCircle size={16} className="mx-auto" /></button>
                      <button className="flex-1 bg-rose-50 text-rose-600 p-2 rounded-xl"><Trash2 size={16} className="mx-auto" /></button>
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
            <main className="px-6 pt-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-1">
                  <span className="text-3xl font-extrabold text-slate-800">0</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aktif</span>
                </div>
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-1">
                  <span className="text-3xl font-extrabold text-accent">0</span>
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

              <div className="space-y-4 flex flex-col items-center justify-center py-12">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Clock size={32} className="text-slate-300" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Belum Ada Progress</h3>
                <p className="text-xs font-medium text-slate-400 text-center max-w-[200px]">
                  Pesanan jasa Anda akan muncul di sini setelah Anda melakukan pemesanan.
                </p>
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
                    <img src={user.photoURL} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
                      // Find pending transaction for this mitra
                      const pendingTrans = transactions.find(t => 
                        t.customerID === user?.uid && 
                        t.mitraID === chatMitra?.id && 
                        t.status === 'pending'
                      );
                      if (pendingTrans) {
                        setActiveTransaction(pendingTrans);
                        setPaymentAmount(pendingTrans.dpAmount);
                        setPaymentProof(null);
                        setPaymentProofPreview(null);
                        setShowPaymentModal(true);
                      } else {
                        alert("Belum ada penawaran dari mitra.");
                      }
                    }} 
                    className="bg-emerald-50 text-emerald-600 px-3 py-2 rounded-xl border border-emerald-100 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <ShieldCheck size={14} />
                    Bayar DP 10%
                  </button>
                )}
                <button onClick={openDealModal} className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-primary"><Handshake size={20} /></button>
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
                        <img src={p.proofUrl} className="w-full h-full object-cover" alt="Bukti Transfer" />
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
                          src={service.img} 
                          alt={service.title}
                          className="w-24 h-24 rounded-2xl object-cover shadow-inner"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div onClick={() => openMitraProfile(service)} className="cursor-pointer">
                            <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{service.title}</h3>
                            <div className="flex items-center gap-1 mt-1">
                              <Star size={12} className="text-accent fill-accent" />
                              <span className="text-[10px] font-bold text-slate-600">{service.rating}</span>
                              <span className="text-[10px] text-slate-400 font-medium">({service.reviews} ulasan)</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-extrabold text-primary">{service.price}</span>
                            <button 
                              onClick={() => setBookingService(service)}
                              className="bg-primary text-white text-[10px] font-bold px-4 py-2 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-transform"
                            >
                              PESAN
                            </button>
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
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">{order.serviceTitle}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{order.customerName}</p>
                      </div>
                      <span className={`text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest ${
                        order.status === 'accepted' ? 'bg-primary/10 text-primary' : 
                        order.status === 'rejected' ? 'bg-rose-50 text-rose-600' : 
                        'bg-accent/10 text-accent'
                      }`}>
                        {order.status === 'pending' ? 'Menunggu' : order.status === 'accepted' ? 'Diterima' : 'Ditolak'}
                      </span>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center">
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Total Deal</p>
                        <p className="text-sm font-extrabold text-primary">Rp {order.totalPrice.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Tanggal</p>
                        <p className="text-[10px] font-bold text-slate-700">{order.date}</p>
                      </div>
                    </div>

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
                                await updateDoc(doc(db, 'orders', order.id), { status: 'accepted' });
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
                                await updateDoc(doc(db, 'orders', order.id), { status: 'rejected' });
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
                  <img src={selectedMitra.foto} className="w-full h-full rounded-full border-4 border-primary shadow-lg object-cover" />
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
                </div>
              </div>

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

                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Area Layanan:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Jakarta Selatan', 'Jakarta Pusat', 'Jakarta Barat', 'Depok'].map(a => (
                      <span key={a} className="bg-white text-slate-600 text-[9px] font-bold px-3 py-1 rounded-lg shadow-sm">{a}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    setChatMitra({ id: selectedMitra.id.toString(), name: selectedMitra.name });
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
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl mb-6 flex items-start gap-3">
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
                      {['Kota Bandung', 'Kab. Bandung', 'Kab. Bandung Barat (KBB)', 'Kota Cimahi', 'Lainnya'].map((city) => (
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
                  <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-primary mb-6">
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
            <PageHeader title="Protokol Mitra" subtitle="Keselamatan & Profesionalisme" onBack={handleBack} />
            <main className="px-6 pt-6 pb-12">
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 space-y-8 neo-3d">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-6">
                    <ShieldCheck size={32} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tighter italic">Harap dipatuhi oleh <span className="text-primary">seluruh mitra</span></h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    Standar operasional untuk menjaga kualitas layanan dan keamanan bersama.
                  </p>
                </div>

                <div className="space-y-6 pt-6 border-t border-slate-50">
                  {[
                    { title: '1. Alat Pelindung Diri (APD)', desc: 'Gunakan perlengkapan keamanan kerja sesuai jenis pekerjaan untuk menjaga keselamatan diri dan pelanggan.' },
                    { title: '2. Identitas Profesional', desc: 'Tunjukkan identitas diri yang sah dan hadir dengan penampilan yang rapi saat melayani pelanggan.' },
                    { title: '3. Kebersihan Area Kerja', desc: 'Pertahankan kerapian selama proses pekerjaan dan pastikan area kerja dibersihkan kembali setelah tugas selesai.' },
                    { title: '4. Komunikasi Sopan & Informatif', desc: 'Berkomunikasilah dengan bahasa yang santun dan jelaskan setiap langkah pekerjaan secara jelas kepada pelanggan.' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-xs shrink-0">{i + 1}</div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 mb-1">{item.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
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

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center gap-2 bg-white border border-slate-200 p-4 rounded-2xl text-xs font-bold text-slate-700 shadow-sm active:scale-95 transition-transform"
                  >
                    <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" className="w-4 h-4" /> Google
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-[#25D366] p-4 rounded-2xl text-xs font-bold text-white shadow-sm active:scale-95 transition-transform">
                    <Phone size={16} /> WhatsApp
                  </button>
                </div>

                {userRole === 'tamu' && (
                  <p className="text-center text-xs font-medium text-slate-400">
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
                      <h1 className="text-2xl font-black tracking-tighter text-primary">JASA<span className="text-accent">MITRA</span></h1>
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
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">Buat Iklan Jasa</h3>
              <p className="text-xs text-slate-400 font-medium mb-8">Pasang iklan jasamu dan dapatkan lebih banyak pelanggan!</p>
              
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
                  <select 
                    value={adCategory}
                    onChange={(e) => setAdCategory(e.target.value)}
                    className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none appearance-none"
                  >
                    <option value="">Pilih Kategori</option>
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Location Selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Provinsi</label>
                  <select 
                    value={adProvince}
                    onChange={(e) => { setAdProvince(e.target.value); setAdCity(''); setAdDistrict(''); }}
                    className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none appearance-none"
                  >
                    <option value="">Pilih Provinsi</option>
                    {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Kota / Kabupaten</label>
                  <select 
                    value={adCity}
                    onChange={(e) => { setAdCity(e.target.value); setAdDistrict(''); }}
                    disabled={!adProvince}
                    className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none appearance-none disabled:opacity-50"
                  >
                    <option value="">Pilih Kota/Kab</option>
                    {adProvince && CITIES[adProvince]?.map(c => <option key={c} value={c}>{c}</option>)}
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
                        <img src={adImage} className="w-full h-full object-cover" />
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
                
                <div className="pt-4 space-y-3">
                  <button 
                    disabled={isSubmittingAd}
                    onClick={async () => {
                      if (!adTitle || !adCategory || !adPrice || !adDesc || !adProvince || !adCity || !adDistrict) {
                        alert('Mohon lengkapi semua data iklan');
                        return;
                      }
                      
                      setIsSubmittingAd(true);
                      try {
                        await addDoc(collection(db, 'services'), {
                          title: adTitle,
                          category: adCategory,
                          price: adPrice,
                          desc: adDesc,
                          province: adProvince,
                          city: adCity,
                          district: adDistrict,
                          img: adImage || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
                          rating: 5.0,
                          reviews: 0,
                          mitraId: user?.uid,
                          mitraName: user?.displayName || 'Mitra Baru',
                          createdAt: serverTimestamp()
                        });
                        
                        alert('Iklan jasa berhasil dipasang!'); 
                        setShowAdModal(false); 
                        setAdTitle('');
                        setAdCategory('');
                        setAdPrice('');
                        setAdDesc('');
                        setAdImage(null);
                        setAdProvince('');
                        setAdCity('');
                        setAdDistrict('');
                      } catch (error) {
                        console.error("Error adding ad:", error);
                        alert('Gagal memasang iklan. Silakan coba lagi.');
                      } finally {
                        setIsSubmittingAd(false);
                      }
                    }} 
                    className="w-full bg-primary text-white py-5 rounded-[30px] font-bold text-sm shadow-xl shadow-primary/30 disabled:opacity-50"
                  >
                    {isSubmittingAd ? 'Memproses...' : 'Kirim Pendaftaran Iklan'}
                  </button>
                  <button onClick={() => {
                    setShowAdModal(false); 
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
                  <Handshake size={48} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tighter italic">Konfirmasi <span className="text-primary">Deal</span></h3>
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
                    <p className="text-xl font-black tracking-wider">8123 4567 89</p>
                    <div className="bg-white/10 px-2 py-1 rounded-lg text-[10px] font-black">BCA</div>
                  </div>
                  <p className="text-[10px] font-bold text-white/60">a.n. PT JasaMitra Indonesia</p>
                </div>
              </div>

              <div className="space-y-3">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmDeal} 
                  className="w-full bg-primary text-white py-5 rounded-[24px] font-black text-xs tracking-[0.15em] shadow-xl shadow-primary/30 flex items-center justify-center gap-3"
                >
                  <CheckCircle2 size={18} /> KONFIRMASI PEMBAYARAN
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

                {(bookingService.category === 'pengelasan' || bookingService.category === 'bangunan') && (
                  <div className="space-y-6 pt-4 border-t border-slate-50">
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-slate-800 uppercase tracking-widest ml-2">Penyedia Alat Kerja</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['mitra', 'pelanggan'].map((opt) => (
                          <button 
                            key={opt}
                            onClick={() => setToolProvider(opt)}
                            className={`p-4 rounded-2xl border-2 text-xs font-bold transition-all ${toolProvider === opt ? 'border-primary bg-primary/5 text-primary' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
                          >
                            {opt === 'mitra' ? 'Disediakan Mitra' : 'Disediakan Pelanggan'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-slate-800 uppercase tracking-widest ml-2">Penyedia Bahan</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['mitra', 'pelanggan', 'konsultasi'].map((opt) => (
                          <button 
                            key={opt}
                            onClick={() => setMaterialProvider(opt)}
                            className={`p-3 rounded-xl border-2 text-[10px] font-bold transition-all ${materialProvider === opt ? 'border-primary bg-primary/5 text-primary' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
                          >
                            {opt === 'mitra' ? 'Mitra' : opt === 'pelanggan' ? 'Pelanggan' : 'Konsultasi'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {materialProvider === 'mitra' && (
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-2">Estimasi Harga Bahan (Rp)</label>
                        <input 
                          type="number" 
                          value={materialPrice}
                          onChange={(e) => setMaterialPrice(e.target.value)}
                          placeholder="Masukkan estimasi harga bahan" 
                          className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20" 
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-slate-900 p-6 rounded-[32px] text-white">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Estimasi Total</span>
                    <span className="text-xl font-black">
                      Rp {(() => {
                        const basePrice = parseInt(bookingService.price.replace(/[^0-9]/g, '')) || 0;
                        const matPrice = materialProvider === 'mitra' ? (parseInt(materialPrice) || 0) : 0;
                        return (basePrice + matPrice).toLocaleString();
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
                        const matPrice = materialProvider === 'mitra' ? (parseInt(materialPrice) || 0) : 0;
                        return Math.round((basePrice + matPrice) * 0.1).toLocaleString();
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
                    const matPrice = materialProvider === 'mitra' ? (parseInt(materialPrice) || 0) : 0;
                    const total = basePrice + matPrice;
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
                      toolProvider: (bookingService.category === 'pengelasan' || bookingService.category === 'bangunan') ? toolProvider : null,
                      materialProvider: (bookingService.category === 'pengelasan' || bookingService.category === 'bangunan') ? materialProvider : null,
                      materialPrice: matPrice,
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
                    setMaterialPrice('');
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

                <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3">
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
                <h3 className="text-xl font-bold text-slate-800">Pembayaran DP 10%</h3>
                <button onClick={() => setShowPaymentModal(false)} className="p-2 bg-slate-50 rounded-full text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Rekening JasaMitra</p>
                    <p className="text-sm font-black text-slate-800">BCA 8123-4567-89</p>
                  </div>
                </div>
                <p className="text-[10px] font-bold text-slate-500">a.n. PT JasaMitra Indonesia</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-2">Nominal Deal (100%)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                    <input 
                      type="number" 
                      value={paymentAmount || ''}
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                      placeholder="Contoh: 1000000" 
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-10 text-sm font-black outline-none focus:ring-2 ring-emerald-500/20" 
                    />
                  </div>
                </div>

                {paymentAmount > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">DP 10% (Transfer)</p>
                      <p className="text-sm font-black text-emerald-600">Rp {(paymentAmount * 0.1).toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sisa 90% (Cash)</p>
                      <p className="text-sm font-black text-slate-400">Rp {(paymentAmount * 0.9).toLocaleString()}</p>
                    </div>
                  </div>
                )}

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
                          <img src={paymentProofPreview} className="w-full h-full object-cover" alt="Preview" />
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
                          <p className="text-[8px] text-slate-300 font-medium">Maksimal 2MB (JPG/PNG)</p>
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
              <img src={selectedPaymentForView.proofUrl} className="w-full h-full object-contain" alt="Bukti Transfer Zoom" />
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

