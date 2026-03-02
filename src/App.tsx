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
  Phone
} from 'lucide-react';
import { 
  CATEGORIES, 
  SUB_CATEGORIES, 
  SERVICES as INITIAL_SERVICES, 
  CategoryId, 
  Service, 
  SubCategory 
} from './constants';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { collection, query, onSnapshot, addDoc, serverTimestamp, getDocs, where, orderBy } from 'firebase/firestore';

// --- Types ---
type Page = 'beranda' | 'pesan' | 'layanan' | 'akun' | 'login' | 'daftar-mitra' | 'kebijakan' | 'syarat-ketentuan' | 'edit-profil' | 'alamat-saya' | 'iklan-saya' | 'chat' | 'profil-mitra' | 'pesanan' | 'kaffa-cellular' | 'subkategori' | 'peraturan-pelanggan';

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
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0F172A] text-white"
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <div className="w-32 h-32 bg-primary/20 rounded-[40px] flex items-center justify-center border-4 border-white/10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-transparent animate-pulse" />
          <Handshake size={64} className="text-white relative z-10" />
        </div>
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <h1 className="text-3xl font-black italic tracking-tighter">JASA<span className="text-primary">MITRA</span></h1>
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
      className="fixed inset-0 z-[9998] bg-[#0F172A] text-white flex flex-col px-8 py-12"
    >
      <div className="flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-4xl font-black leading-tight tracking-tighter mb-4">
            Selamat Datang di <br/>
            <span className="text-primary italic">JASAMITRA</span>
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
            className="w-full bg-white text-slate-900 p-6 rounded-[32px] flex items-center gap-5 shadow-2xl group transition-all hover:bg-primary hover:text-white"
          >
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-900 group-hover:bg-white/20 group-hover:text-white transition-colors">
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
            className="w-full bg-white/5 border border-white/10 p-6 rounded-[32px] flex items-center gap-5 backdrop-blur-xl group transition-all hover:bg-white/10"
          >
            <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
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
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          Dengan melanjutkan, Anda menyetujui <br/>
          <span className="text-primary">Syarat & Ketentuan</span> kami
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
                className="w-14 h-14 bg-gradient-to-br from-primary to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/40 border-4 border-white neo-3d"
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
  <header className="bg-gradient-to-br from-blue-900 to-blue-700 text-white pt-6 pb-8 px-6 rounded-b-[32px] shadow-lg relative overflow-hidden">
    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
    <div className="relative z-10 flex items-center gap-4">
      {onBack && (
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
      )}
      <div className="flex-1 text-center pr-8">
        <h1 className="text-lg font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-[9px] opacity-80 font-medium uppercase tracking-widest">{subtitle}</p>}
      </div>
    </div>
  </header>
);


export default function App() {
  const [isSplash, setIsSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userRole, setUserRole] = useState<'tamu' | 'mitra' | null>(null);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
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

  // Data Iklan (Mock dari HTML)
  const [myAds, setMyAds] = useState<any[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'services'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const servicesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any;
      if (servicesList.length > 0) {
        setServices(servicesList);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!chatMitra) {
      setMessages([]);
      return;
    }
    const q = query(
      collection(db, 'chats', chatMitra.id, 'messages'),
      orderBy('timestamp', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any;
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [chatMitra]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const filteredServices = services.filter(s => {
    const title = s.title || '';
    const cat = s.cat || '';
    const subcat = s.subcat || '';
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCat === 'all' || cat === selectedCat;
    const matchesSub = selectedSub === 'all' || subcat === selectedSub;
    return matchesSearch && matchesCat && matchesSub;
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

  const handleSignUp = async () => {
    try {
      const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      await updateProfile(userCredential.user, { displayName: signupName });
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
      alert('Berhasil keluar');
      navigateTo('beranda');
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

  const sendMessage = async () => {
    if (!inputText.trim() || !user) {
      if (!user) alert('Silakan login untuk mengirim pesan');
      return;
    }
    
    // Sensor WA logic
    const polaWA = /(\+?62|0)8[1-9][0-9]{6,10}/g;
    let content = inputText.replace(polaWA, '🔴 [NOMOR DILARANG]');
    if (/wa|whatsapp|hp|telp|kontak/i.test(content)) {
      content += '\n\n⚠️ DILARANG SHARE KONTAK!';
    }

    try {
      await addDoc(collection(db, 'chats', chatMitra?.id || 'general', 'messages'), {
        sender: 'user',
        senderId: user.uid,
        type: 'text',
        content: content,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        timestamp: serverTimestamp()
      });
      setInputText('');
      if (inputText !== content) alert('⚠️ Dilarang berbagi nomor WA! Pesan telah disensor.');
    } catch (error: any) {
      alert('Gagal mengirim pesan: ' + error.message);
    }
  };

  if (isSplash) return <SplashScreen onComplete={() => { setIsSplash(false); setShowOnboarding(true); }} />;
  if (showOnboarding) return <OnboardingScreen onSelect={(role) => { setUserRole(role); setShowOnboarding(false); }} />;

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
            <header className="bg-[#0F172A] text-white pt-10 pb-14 px-6 rounded-b-[48px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full -mr-20 -mt-20 blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full -ml-10 -mb-10 blur-[60px]" />
              
              <div className="relative z-10">
  <div className="flex justify-between items-center mb-6">
    <div>
      <h1 className="text-2xl font-black tracking-tighter italic">JASA<span className="text-primary">MITRA</span></h1>
      <div className="flex items-center gap-1.5 mt-0.5">
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sistem Jaminan Aktif</span>
      </div>
    </div>
    <motion.div 
      whileTap={{ scale: 0.9 }}
      onClick={() => navigateTo('akun')}
      className="w-11 h-11 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-inner cursor-pointer"
    >
      <User size={20} className="text-slate-300" />
    </motion.div>
  </div>

  <div className="relative group">
    <div className="absolute inset-0 bg-primary/20 blur-xl group-focus-within:bg-primary/30 transition-all opacity-0 group-focus-within:opacity-100" />
    <div className="relative flex items-center bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[24px] overflow-hidden focus-within:bg-white transition-all shadow-2xl">
      <Search className="ml-5 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
      <input 
        type="text" 
        placeholder="Butuh jasa apa sekarang?" 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-transparent text-white group-focus-within:text-slate-900 py-4.5 px-4 outline-none font-bold text-sm placeholder:text-slate-500 placeholder:font-medium"
      />
    </div>
  </div>
</div>
              </div>
            </header>

            <main className="px-6 -mt-8 relative z-20 pb-32">
              {/* Security Banner */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-2xl shadow-lg flex gap-4 mb-8"
              >
                <div className="bg-amber-100 p-2 rounded-xl h-fit">
                  <ShieldCheck className="text-amber-600" size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1">Jaminan Keamanan Customer</h4>
                  <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                    Semua mitra telah melalui proses verifikasi penuh mencakup KTP, SKCK, serta validasi rekening bank untuk memastikan identitas dan keamanan transaksi.
                  </p>
                </div>
              </motion.div>

              {/* Categories */}
              <section className="mb-10">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-slate-800 tracking-tight">Kategori Layanan</h2>
                  <button className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-full">Lihat Semua</button>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {CATEGORIES.map((cat) => (
                    <motion.button 
                      key={cat.id}
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setSelectedCat(cat.id);
                        setSelectedSub('all');
                        navigateTo('subkategori');
                      }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className={`w-full aspect-square rounded-3xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-lg shadow-slate-200/50 relative overflow-hidden group`}>
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <cat.icon size={24} strokeWidth={2.5} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 tracking-tighter text-center leading-tight">{cat.name}</span>
                    </motion.button>
                  ))}
                </div>
              </section>

              {/* Banners Toko */}
              <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-800">Toko Mitra</h2>
                  <button className="text-xs font-bold text-primary uppercase tracking-widest">Lihat Semua</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar -mx-6 px-6">
                  {[
                    { id: 1, name: 'Toko Besi', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200', desc: 'Baja & Konstruksi' },
                    { id: 2, name: 'Keramik', img: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=200', desc: 'Lantai & Dinding' },
                    { id: 3, name: 'Toko Vinyl', img: 'https://images.unsplash.com/photo-1581850518616-bcb8186c3f30?w=200', desc: 'Lantai Modern' },
                    { id: 5, name: 'Nippon Paint', img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200', desc: 'Solusi Cat & Warna' },
                  ].map((toko) => (
                    <motion.div 
                      key={toko.id} 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        alert(`Halaman ${toko.name} dalam pengembangan`);
                      }}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 neo-3d cursor-pointer min-w-[140px] max-w-[140px]"
                    >
                      <img src={toko.img} className="w-full h-24 object-cover" alt={toko.name} referrerPolicy="no-referrer" />
                      <div className="p-3">
                        <h3 className="text-[10px] font-bold text-slate-800 truncate">{toko.name}</h3>
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">{toko.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Rekomendasi Mitra (Subscription) */}
              <section className="mb-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">Mitra Unggulan</h2>
                    <div className="bg-amber-100 text-amber-700 text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border border-amber-200 flex items-center gap-1">
                      <Star size={8} fill="currentColor" /> PRO
                    </div>
                  </div>
                  <button className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-full">Lihat Semua</button>
                </div>
                <div className="flex gap-5 overflow-x-auto pb-6 hide-scrollbar -mx-6 px-6">
                  {[
                    { id: 4, name: 'Kaffa Cellular', img: 'https://i.ibb.co.com/zWJ6DwYx/images-6.webp', desc: 'Spesialis Servis Gadget', rating: 5.0, jobs: 120 },
                    { id: 102, name: 'Siti Clean', img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?w=200', desc: 'Jasa Kebersihan Profesional', rating: 4.8, jobs: 85 },
                    { id: 103, name: 'Aris Bangun', img: 'https://images.unsplash.com/photo-1503387762-592dec5832f2?w=200', desc: 'Renovasi & Konstruksi', rating: 5.0, jobs: 45 },
                    { id: 104, name: 'Dewi Tailor', img: 'https://images.unsplash.com/photo-1552330892-344c53c33f5d?w=200', desc: 'Jahit & Desain Busana', rating: 4.7, jobs: 210 },
                  ].map((mitra) => (
                    <motion.div 
                      key={mitra.id} 
                      whileHover={{ y: -8 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (mitra.id === 4) {
                          navigateTo('kaffa-cellular');
                        } else {
                          alert(`Detail ${mitra.name} akan segera hadir`);
                        }
                      }}
                      className="bg-white rounded-[32px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-slate-100 cursor-pointer min-w-[180px] max-w-[180px] relative group"
                    >
                      <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-md px-2 py-1 rounded-xl flex items-center gap-1 shadow-sm border border-white/50">
                        <Star size={10} className="text-amber-500 fill-amber-500" />
                        <span className="text-[10px] font-black text-slate-800">{mitra.rating}</span>
                      </div>
                      <div className="h-32 overflow-hidden relative">
                        <img src={mitra.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={mitra.name} referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-1 mb-1">
                          <h3 className="text-[12px] font-bold text-slate-800 truncate">{mitra.name}</h3>
                          <ShieldCheck size={12} className="text-primary shrink-0" />
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium line-clamp-1 mb-3">{mitra.desc}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter">Online</span>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400">{mitra.jobs} Selesai</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Home Service List (Recommendations Only) */}
              <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-800">Rekomendasi Untukmu</h2>
                </div>
                <div className="space-y-4">
                  {services.slice(0, 5).map((service) => (
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
                            <Star size={12} className="text-amber-400 fill-amber-400" />
                            <span className="text-[10px] font-bold text-slate-600">{service.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-extrabold text-primary">{service.price}</span>
                          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Detail</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </main>
          </motion.div>
        )}

        {/* --- PESAN (CHAT LIST) --- */}
        {activePage === 'pesan' && (
          <motion.div key="pesan" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <PageHeader title="Pesan" subtitle="Percakapan dengan mitra & pelanggan" />
            <main className="px-6 -mt-4 space-y-3 pb-24 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare size={32} className="text-slate-300" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Belum Ada Pesan</h3>
              <p className="text-xs font-medium text-slate-400 text-center max-w-[200px]">
                Mulai percakapan dengan mitra untuk melihat pesan di sini.
              </p>
            </main>
          </motion.div>
        )}

        {/* --- EDIT PROFIL --- */}
        {activePage === 'edit-profil' && (
          <motion.div key="edit-profil" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <PageHeader title="Edit Profil" subtitle="Perbarui data diri Anda" onBack={handleBack} />
            <main className="px-6 -mt-4 space-y-6">
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
            <main className="px-6 -mt-4 space-y-4">
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
            <main className="px-6 -mt-4 space-y-6">
              <div className="space-y-4">
                {myAds.map(ad => (
                  <div key={ad.id} className={`bg-white p-4 rounded-[32px] shadow-sm border border-slate-100 neo-3d ${ad.status === 'nonaktif' ? 'opacity-60 grayscale' : ''}`}>
                    <div className="flex gap-4">
                      <img src={ad.img} className="w-20 h-20 rounded-2xl object-cover shadow-inner" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-bold text-slate-800">{ad.title}</h3>
                          <span className={`text-[8px] font-extrabold px-2 py-1 rounded-full uppercase tracking-widest ${ad.status === 'aktif' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>{ad.status}</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 mt-1">{ad.cat}</p>
                        <p className="text-xs font-extrabold text-primary mt-2">{ad.price}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
                      <button className="flex-1 bg-blue-50 text-primary p-2 rounded-xl"><Edit3 size={16} className="mx-auto" /></button>
                      <button className="flex-1 bg-amber-50 text-amber-600 p-2 rounded-xl"><PauseCircle size={16} className="mx-auto" /></button>
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
            <main className="px-6 -mt-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-1">
                  <span className="text-3xl font-extrabold text-primary">0</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aktif</span>
                </div>
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-1">
                  <span className="text-3xl font-extrabold text-emerald-500">0</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Selesai</span>
                </div>
              </div>

              {/* Filter Status */}
              <div className="flex gap-3 overflow-x-auto pb-4 mb-4 hide-scrollbar">
                {['Semua', 'Dalam Proses', 'Selesai', 'Dibatalkan'].map((f, i) => (
                  <button 
                    key={f}
                    className={`px-5 py-2.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${i === 0 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-slate-500 border border-slate-100'}`}
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

                {activePage === 'peraturan-pelanggan' && (
                  <motion.div key="peraturan-pelanggan" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <PageHeader title="Peraturan Pelanggan" subtitle="Hak & Kewajiban Pengguna Jasa" onBack={handleBack} />
                    <main className="px-6 -mt-4 pb-12">
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

                        <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                          <div className="flex items-center gap-2 mb-2 text-amber-700">
                            <AlertTriangle size={18} />
                            <h4 className="text-xs font-bold uppercase tracking-widest">Peringatan Penting</h4>
                          </div>
                          <p className="text-[10px] text-amber-600 font-medium leading-relaxed">
                            JasaMitra tidak bertanggung jawab atas transaksi yang dilakukan di luar sistem aplikasi. Pastikan selalu menggunakan fitur "Deal" untuk perlindungan maksimal.
                          </p>
                        </div>
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
            <main className="px-6 -mt-4">
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
                  { id: 'peraturan-pelanggan', label: 'Peraturan Pelanggan', icon: Info, color: 'text-blue-500', bg: 'bg-blue-50', show: userRole === 'tamu' },
                  { id: 'daftar-mitra', label: 'Daftar Menjadi Mitra', icon: Wrench, color: 'text-amber-500', bg: 'bg-amber-50', isSpecial: true, show: userRole === 'mitra' && !isMitra },
                  { id: 'pesanan', label: 'Pesanan Masuk (Mitra)', icon: Handshake, color: 'text-blue-600', bg: 'bg-blue-50', show: isMitra },
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
                      <span className={`text-sm font-bold ${item.isSpecial ? 'text-amber-600' : 'text-slate-700'}`}>{item.label}</span>
                    </div>
                    <ChevronRight size={18} className="text-slate-300" />
                  </button>
                ))}
              </div>

              {user && (
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
            <header className="bg-primary text-white p-5 pt-8 flex items-center gap-4 shadow-lg">
              <button onClick={handleBack} className="p-2 -ml-2 hover:bg-white/10 rounded-full">
                <ArrowLeft size={24} />
              </button>
              <div className="flex-1">
                <h2 className="text-lg font-bold">Chat dengan Mitra</h2>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Online</span>
                </div>
              </div>
              <button onClick={openDealModal} className="bg-white/20 p-2 rounded-xl border border-white/20"><Handshake size={20} /></button>
            </header>

            <main className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-2xl text-[11px] text-amber-800 font-medium leading-relaxed">
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

        {/* --- SUBKATEGORI & POSTINGAN --- */}
        {activePage === 'subkategori' && (
          <motion.div key="subkategori" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <PageHeader 
              title={CATEGORIES.find(c => c.id === selectedCat)?.name || 'Layanan'} 
              subtitle={`Temukan jasa ${selectedCat} terbaik`} 
              onBack={handleBack} 
            />
            <main className="px-6 -mt-4 pb-24">
              {/* Subcategory Filters */}
              {selectedCat !== 'all' && SUB_CATEGORIES[selectedCat] && (
                <section className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-primary rounded-full" />
                    <h2 className="text-sm font-bold text-slate-700">Pilih Subkategori</h2>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                    <button 
                      onClick={() => setSelectedSub('all')}
                      className={`px-6 py-3 rounded-2xl flex items-center gap-2 transition-all border-2 whitespace-nowrap font-bold text-xs ${selectedSub === 'all' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white border-slate-100 text-slate-500 shadow-sm'}`}
                    >
                      <LayoutGrid size={16} />
                      Semua
                    </button>
                    {SUB_CATEGORIES[selectedCat].map((sub) => (
                      <button 
                        key={sub.id}
                        onClick={() => setSelectedSub(sub.id)}
                        className={`px-6 py-3 rounded-2xl flex items-center gap-2 transition-all border-2 whitespace-nowrap font-bold text-xs ${selectedSub === sub.id ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white border-slate-100 text-slate-500 shadow-sm'}`}
                      >
                        <sub.icon size={16} />
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
                              <Star size={12} className="text-amber-400 fill-amber-400" />
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

        {/* --- KAFFA CELLULAR --- */}
        {activePage === 'kaffa-cellular' && (
          <motion.div key="kaffa-cellular" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <PageHeader title="Kaffa Cellular" subtitle="Gadget Solution" onBack={handleBack} />
            <main className="px-6 -mt-4 pb-24 space-y-6">
              {/* Info Toko */}
              <div className="bg-white p-6 rounded-[40px] shadow-sm border border-slate-100 space-y-4 neo-3d">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner">
                    <img src="https://i.ibb.co.com/zWJ6DwYx/images-6.webp" className="w-full h-full object-cover" alt="Kaffa Cellular" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Kaffa Cellular</h3>
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <Clock size={14} />
                      <span className="text-[11px] font-bold uppercase tracking-wider">Buka 12:00 - 24:00</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Alamat Lengkap</p>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl">
                    Jalan Sukasugih Jl. Sederhana No.20, Pasteur, Kec. Sukajadi, Kota Bandung, Jawa Barat 40161
                  </p>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=Kaffa+Cellular+Bandung', '_blank')}
                    className="flex-1 bg-slate-50 text-slate-700 py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    <MapPin size={16} /> Buka Maps
                  </button>
                  <button 
                    onClick={() => window.location.href = 'tel:082240998081'}
                    className="flex-1 bg-primary/10 text-primary py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    <Send size={16} /> Hubungi
                  </button>
                </div>
              </div>

              {/* Form Servis */}
              <div className="bg-white p-6 rounded-[40px] shadow-sm border border-slate-100 space-y-6 neo-3d">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-5 bg-primary rounded-full" />
                  <h3 className="text-sm font-bold text-slate-800">Form Permintaan Servis</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Nama Lengkap <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="Nama Anda" 
                      value={kaffaForm.nama}
                      onChange={(e) => setKaffaForm({...kaffaForm, nama: e.target.value})}
                      className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">No. WhatsApp <span className="text-rose-500">*</span></label>
                    <input 
                      type="tel" 
                      placeholder="Contoh: 081234567890" 
                      value={kaffaForm.wa}
                      onChange={(e) => setKaffaForm({...kaffaForm, wa: e.target.value})}
                      className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Jenis Gadget <span className="text-rose-500">*</span></label>
                    <select 
                      value={kaffaForm.jenis}
                      onChange={(e) => setKaffaForm({...kaffaForm, jenis: e.target.value})}
                      className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none appearance-none"
                    >
                      {['Handphone', 'Tablet'].map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Merk / Model</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: iPhone 13 Pro" 
                      value={kaffaForm.model}
                      onChange={(e) => setKaffaForm({...kaffaForm, model: e.target.value})}
                      className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Keluhan Kerusakan <span className="text-rose-500">*</span></label>
                    <textarea 
                      placeholder="Jelaskan kendala gadget Anda..." 
                      value={kaffaForm.keluhan}
                      onChange={(e) => setKaffaForm({...kaffaForm, keluhan: e.target.value})}
                      className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20 min-h-[100px] resize-none" 
                    />
                  </div>

                  {/* Upload Foto */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Foto Gadget (Maks 3)</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[0, 1, 2].map((idx) => (
                        <div 
                          key={idx}
                          onClick={() => idx === kaffaPhotos.length && document.getElementById('kaffa-photo-upload')?.click()}
                          className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all overflow-hidden ${
                            kaffaPhotos[idx] ? 'border-primary/50 bg-white' : 'border-slate-200 bg-slate-50'
                          } ${idx === kaffaPhotos.length ? 'cursor-pointer hover:border-primary/30' : ''}`}
                        >
                          {kaffaPhotos[idx] ? (
                            <img src={kaffaPhotos[idx]} className="w-full h-full object-cover" />
                          ) : (
                            <>
                              <Camera size={20} className="text-slate-300" />
                              <span className="text-[8px] font-bold text-slate-400 uppercase">Upload</span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                    <input 
                      id="kaffa-photo-upload"
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && kaffaPhotos.length < 3) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setKaffaPhotos([...kaffaPhotos, reader.result as string]);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {kaffaPhotos.length > 0 && (
                      <button 
                        onClick={() => setKaffaPhotos([])}
                        className="text-[9px] font-bold text-rose-500 uppercase tracking-widest ml-2 mt-1"
                      >
                        Hapus Semua Foto
                      </button>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (!kaffaForm.nama || !kaffaForm.wa || !kaffaForm.keluhan) {
                      alert('Mohon lengkapi data yang wajib diisi (*)');
                      return;
                    }
                    if (kaffaForm.wa.length < 10 || kaffaForm.wa.length > 13) {
                      alert('Nomor WhatsApp harus antara 10-13 digit');
                      return;
                    }

                    const message = `Halo Kaffa Cellular,\n\nSaya ingin mengajukan servis gadget:\n\nNama: ${kaffaForm.nama}\nNo. WA: ${kaffaForm.wa}\nJenis: ${kaffaForm.jenis}\nMerk/Model: ${kaffaForm.model || '-'}\nKeluhan: ${kaffaForm.keluhan}\n\nTerima kasih.`;
                    const encodedMsg = encodeURIComponent(message);
                    window.open(`https://wa.me/6282240998081?text=${encodedMsg}`, '_blank');
                  }}
                  className="w-full bg-primary text-white py-5 rounded-[30px] font-bold text-sm shadow-xl shadow-primary/30 mt-4 active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                  <Send size={18} /> Kirim Permintaan
                </button>
              </div>
            </main>
          </motion.div>
        )}

        {/* --- PESANAN MASUK (MITRA) --- */}
        {activePage === 'pesanan' && (
          <motion.div key="pesanan" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <PageHeader title="Pesanan Masuk" subtitle="Kelola pesanan dari pelanggan" onBack={handleBack} />
            <main className="px-6 -mt-4 space-y-4 pb-12">
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
                        order.status === 'accepted' ? 'bg-emerald-50 text-emerald-600' : 
                        order.status === 'rejected' ? 'bg-rose-50 text-rose-600' : 
                        'bg-amber-50 text-amber-600'
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

                    {order.status === 'pending' && (
                      <div className="flex gap-3 pt-2">
                        <button 
                          onClick={() => {
                            setMitraOrders(mitraOrders.map(o => o.id === order.id ? { ...o, status: 'accepted' } : o));
                            alert('Pesanan diterima!');
                          }}
                          className="flex-1 bg-primary text-white py-3 rounded-xl font-bold text-xs shadow-lg shadow-primary/20 active:scale-95 transition-transform"
                        >
                          Terima
                        </button>
                        <button 
                          onClick={() => {
                            setMitraOrders(mitraOrders.map(o => o.id === order.id ? { ...o, status: 'rejected' } : o));
                            alert('Pesanan ditolak');
                          }}
                          className="flex-1 bg-white border border-slate-200 text-rose-500 py-3 rounded-xl font-bold text-xs active:scale-95 transition-transform"
                        >
                          Tolak
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </main>
          </motion.div>
        )}
        {activePage === 'profil-mitra' && selectedMitra && (
          <motion.div key="profil-mitra" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <PageHeader title="Profil Mitra" subtitle="Informasi lengkap penyedia jasa" onBack={handleBack} />
            <main className="px-6 -mt-4 pb-12 space-y-6">
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 text-center neo-3d">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <img src={selectedMitra.foto} className="w-full h-full rounded-full border-4 border-primary shadow-lg object-cover" />
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">{selectedMitra.name}</h3>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="bg-blue-50 text-primary text-[9px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={10} /> Terverifikasi
                  </span>
                  <span className="bg-amber-50 text-amber-600 text-[9px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
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
                    <span key={l} className="bg-blue-50 text-primary text-[9px] font-bold px-3 py-1.5 rounded-full">{l}</span>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-[40px] shadow-sm border border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-primary flex items-center gap-2"><MapPin size={18} /> Alamat & Area Layanan</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{selectedMitra.alamatLengkap}</p>
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
            <PageHeader title="Pendaftaran Mitra" subtitle="Lengkapi data diri & dokumen keamanan" onBack={handleBack} />
            <main className="px-6 -mt-4 pb-12">
              <div className="bg-white p-6 rounded-[40px] shadow-sm border border-slate-100 space-y-6">
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

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Pilihan Masuk / Akun <span className="text-rose-500">*</span></label>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 p-4 rounded-2xl text-xs font-bold text-slate-700 shadow-sm active:scale-95 transition-transform">
                        <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" className="w-4 h-4" /> Google
                      </button>
                      <button className="flex items-center justify-center gap-2 bg-emerald-500 p-4 rounded-2xl text-xs font-bold text-white shadow-sm active:scale-95 transition-transform">
                        <Phone size={16} /> WhatsApp
                      </button>
                    </div>
                    <div className="relative flex items-center gap-4 py-1">
                      <div className="flex-1 h-px bg-slate-100" />
                      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Atau isi manual</span>
                      <div className="flex-1 h-px bg-slate-100" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Nomor WhatsApp atau Email" 
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
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Tipe Pendaftar</label>
                    <select className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none appearance-none">
                      <option>Perorangan (Individu)</option>
                      <option>CV (Persekutuan Komanditer)</option>
                      <option>PT (Perseroan Terbatas)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">NIK</label>
                    <input type="number" placeholder="16 Digit NIK" className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none" />
                  </div>

                  <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100 space-y-4">
                    <h4 className="text-[10px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-2"><ShieldCheck size={16} /> Dokumen Keamanan Wajib</h4>
                    <p className="text-[10px] text-rose-600 font-medium">Untuk melindungi pelanggan, berkas ini wajib dilampirkan.</p>
                    
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-xl border border-rose-200">
                        <label className="text-[9px] font-bold text-rose-900 block mb-2">1. Foto KTP Asli</label>
                        <input type="file" className="text-[10px]" />
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-rose-200">
                        <label className="text-[9px] font-bold text-rose-900 block mb-2">2. Selfie Memegang KTP</label>
                        <input type="file" className="text-[10px]" />
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-rose-200">
                        <label className="text-[9px] font-bold text-rose-900 block mb-2">3. SKCK Aktif</label>
                        <input type="file" className="text-[10px]" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2"><ImageIcon size={16} /> Informasi Rekening Bank</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Nama di rekening wajib sama dengan KTP.</p>
                    <div className="space-y-3">
                      <input type="text" placeholder="Nama Bank" className="w-full bg-white rounded-xl p-3 text-xs font-medium outline-none border border-slate-200" />
                      <input type="number" placeholder="Nomor Rekening" className="w-full bg-white rounded-xl p-3 text-xs font-medium outline-none border border-slate-200" />
                      <input type="text" placeholder="Nama Pemilik" className="w-full bg-white rounded-xl p-3 text-xs font-medium outline-none border border-slate-200" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Alamat Rumah</label>
                    <textarea placeholder="Tulis alamat lengkap..." className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none min-height-[100px]" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Pengalaman Kerja</h4>
                      <button onClick={addExperience} className="text-primary text-[10px] font-bold flex items-center gap-1"><Plus size={14} /> Tambah</button>
                    </div>
                    {experiences.map((exp) => (
                      <div key={exp.id} className="bg-slate-50 p-5 rounded-3xl border border-slate-100 space-y-3 relative">
                        {experiences.length > 1 && (
                          <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-rose-500"><Trash2 size={16} /></button>
                        )}
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Pengalaman {exp.id}</p>
                        <input type="text" placeholder="Nama Perusahaan" className="w-full bg-white rounded-xl p-3 text-xs font-medium outline-none border border-slate-200" />
                        <input type="text" placeholder="Posisi / Jabatan" className="w-full bg-white rounded-xl p-3 text-xs font-medium outline-none border border-slate-200" />
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" placeholder="Tahun Mulai" className="w-full bg-white rounded-xl p-3 text-xs font-medium outline-none border border-slate-200" />
                          <input type="text" placeholder="Tahun Selesai" className="w-full bg-white rounded-xl p-3 text-xs font-medium outline-none border border-slate-200" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 space-y-4">
                    <h4 className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-2"><AlertTriangle size={16} /> Peraturan & Kode Etik</h4>
                    <ul className="text-[10px] text-amber-700 font-medium space-y-3 list-disc ml-4">
                      <li>
                        <span className="font-bold">Biaya layanan & sistem pembayaran:</span> Setiap transaksi di JasaMitra dikenakan biaya layanan sebesar <span className="font-bold">10%</span> dari total nilai jasa yang dibayarkan oleh pelanggan sebagai biaya operasional platform. Sisa pembayaran wajib dilakukan secara <span className="font-bold">cash di lokasi</span> langsung kepada Mitra setelah pekerjaan selesai.
                      </li>
                      <li>
                        <span className="font-bold">Larangan manipulasi kerusakan:</span> Mitra dilarang keras merekayasa, melebih-lebihkan, atau memperbesar kerusakan barang maupun kebutuhan perbaikan demi keuntungan pribadi.
                      </li>
                      <li>
                        <span className="font-bold">Larangan transaksi di luar platform:</span> Seluruh bentuk transaksi, negosiasi biaya, penjadwalan, dan pembayaran wajib dilakukan melalui sistem JasaMitra demi keamanan, transparansi, serta perlindungan Mitra dan pelanggan.
                      </li>
                      <li>
                        <span className="font-bold">Kewajiban menjaga etika dan keamanan:</span> Mitra wajib bersikap profesional, sopan, menjaga keamanan, serta memberikan pelayanan terbaik kepada pelanggan selama proses pengerjaan di lokasi.
                      </li>
                    </ul>
                    <label className="flex items-start gap-3 text-[11px] text-amber-900 font-medium cursor-pointer bg-amber-100/50 p-4 rounded-xl border-l-[3px] border-amber-700 mt-4">
                      <input type="checkbox" className="mt-0.5 w-4 h-4 accent-amber-700" />
                      <span>
                        Dengan mencentang kotak ini, saya menyatakan telah membaca, memahami, dan menyetujui seluruh Kode Etik Mitra serta bersedia mematuhi semua ketentuan yang berlaku di platform JasaMitra, termasuk sistem biaya layanan dan tata cara pembayaran.
                      </span>
                    </label>
                  </div>

                  <button onClick={handleSignUp} className="w-full bg-primary text-white py-5 rounded-[30px] font-bold text-sm shadow-xl shadow-primary/30 mt-6">Kirim Pendaftaran</button>
                </div>
              </div>
            </main>
          </motion.div>
        )}

        {/* --- PERATURAN PELANGGAN --- */}
        {activePage === 'peraturan-pelanggan' && (
          <motion.div key="peraturan-pelanggan" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <PageHeader title="Peraturan Pelanggan" subtitle="Hak & Kewajiban Pengguna Jasa" onBack={handleBack} />
            <main className="px-6 -mt-4 pb-12">
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

                <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                  <div className="flex items-center gap-2 mb-2 text-amber-700">
                    <AlertTriangle size={18} />
                    <h4 className="text-xs font-bold uppercase tracking-widest">Peringatan Penting</h4>
                  </div>
                  <p className="text-[10px] text-amber-600 font-medium leading-relaxed">
                    JasaMitra tidak bertanggung jawab atas transaksi yang dilakukan di luar sistem aplikasi. Pastikan selalu menggunakan fitur "Deal" untuk perlindungan maksimal.
                  </p>
                </div>
              </div>
            </main>
          </motion.div>
        )}

        {/* --- LOGIN --- */}
        {activePage === 'login' && (
          <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <PageHeader title="Selamat Datang!" subtitle="Masuk untuk menikmati semua fitur JasaMitra" onBack={handleBack} />
            <main className="px-6 -mt-4">
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
                  <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 p-4 rounded-2xl text-xs font-bold text-slate-700 shadow-sm active:scale-95 transition-transform">
                    <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" className="w-4 h-4" /> Google
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-emerald-500 p-4 rounded-2xl text-xs font-bold text-white shadow-sm active:scale-95 transition-transform">
                    <Phone size={16} /> WhatsApp
                  </button>
                </div>

                {userRole === 'mitra' && (
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
          <motion.div key="kebijakan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PageHeader title="Kebijakan Privasi" subtitle="Syarat & Ketentuan Penggunaan" onBack={handleBack} />
            <main className="px-6 -mt-4">
              <div className="bg-white p-6 rounded-[30px] shadow-sm border border-slate-100 h-[60vh] overflow-y-auto hide-scrollbar">
                <h3 className="text-sm font-bold text-primary mb-3">1. SYARAT & KETENTUAN PENGGUNAAN</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">Selamat datang di platform JasaMitra, sebuah layanan teknologi yang mempertemukan Pengguna (Pemberi Kerja) dengan Mitra (Penyedia Jasa) untuk berbagai layanan perbaikan, servis, dan instalasi. Dengan mengakses dan menggunakan aplikasi JasaMitra, Anda dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang berlaku.</p>
                
                <p className="text-xs text-slate-600 leading-relaxed mb-3">JasaMitra bertindak sebagai fasilitator yang mempertemukan kedua belah pihak dan bukan merupakan penyedia jasa langsung. Seluruh perjanjian kerja, kesepakatan harga, dan pelaksanaan pekerjaan merupakan tanggung jawab masing-masing pihak. JasaMitra hanya menyediakan platform dan sistem jaminan keamanan untuk melindungi kedua belah pihak dari risiko penipuan dan wanprestasi.</p>
                
                <p className="text-xs text-slate-600 leading-relaxed mb-6">Pengguna dilarang keras melakukan transaksi di luar mekanisme yang telah ditentukan oleh platform, termasuk namun tidak terbatas pada transfer langsung ke rekening pribadi Mitra tanpa melalui sistem jaminan. Pelanggaran terhadap ketentuan ini dapat mengakibatkan pemblokiran akun secara permanen tanpa pemberitahuan terlebih dahulu.</p>
                
                <h3 className="text-sm font-bold text-primary mb-3 mt-5">2. KEBIJAKAN PRIVASI DAN PERLINDUNGAN DATA</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">PT JasaMitra Indonesia berkomitmen untuk melindungi data pribadi Anda sesuai dengan Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP). Data yang kami kumpulkan meliputi nama lengkap, alamat email, nomor telepon, alamat domisili, foto KTP, swafoto, Surat Keterangan Catatan Kepolisian (SKCK), dan informasi rekening bank yang digunakan semata-mata untuk keperluan verifikasi identitas, keamanan transaksi, dan pencegahan tindak penipuan.</p>
                
                <p className="text-xs text-slate-600 leading-relaxed mb-3">Kami tidak akan pernah menjual, menyewakan, atau menukar data pribadi Anda kepada pihak ketiga untuk tujuan komersial tanpa persetujuan eksplisit dari Anda. Data Anda hanya akan diungkapkan apabila diwajibkan oleh hukum, peraturan, atau permintaan resmi dari instansi penegak hukum Republik Indonesia.</p>
                
                <p className="text-xs text-slate-600 leading-relaxed mb-6">Seluruh data disimpan dalam server yang aman dengan sistem enkripsi berlapis. Anda berhak untuk mengakses, memperbarui, mengoreksi, atau meminta penghapusan data pribadi Anda dengan menghubungi layanan pelanggan kami. Permintaan penghapusan data akan diproses dalam waktu maksimal 3x24 jam, kecuali untuk data transaksi yang wajib disimpan sesuai ketentuan perpajakan yang berlaku.</p>
                
                <h3 className="text-sm font-bold text-primary mb-3 mt-5">3. KEBJIAKAN KEAMANAN DAN VERIFIKASI MITRA</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">Keamanan Pengguna adalah prioritas utama JasaMitra. Setiap Mitra yang terdaftar dalam platform kami wajib melewati proses verifikasi identitas berlapis yang mencakup pemeriksaan keaslian Kartu Tanda Penduduk (KTP), validasi wajah melalui swafoto, verifikasi kepemilikan rekening bank (nama pemilik harus sesuai dengan KTP), dan pemeriksaan Surat Keterangan Catatan Kepolisian (SKCK) yang masih berlaku untuk memastikan latar belakang yang bersih.</p>
                
                <p className="text-xs text-slate-600 leading-relaxed mb-3">JasaMitra menerapkan kebijakan toleransi nol (zero tolerance policy) terhadap segala bentuk tindak kekerasan, pelecehan seksual, pencurian, intimidasi, atau penipuan yang dilakukan oleh Mitra maupun Pengguna. Setiap pelanggaran akan ditindak tegas dengan pemblokiran akun permanen dan pelaporan kepada pihak kepolisian untuk diproses lebih lanjut sesuai hukum yang berlaku.</p>
                
                <p className="text-xs text-slate-600 leading-relaxed mb-3">Kami juga menyediakan sistem escrow sederhana berupa jaminan 10% (sepuluh persen) dari nilai kesepakatan yang bertujuan untuk melindungi kedua belah pihak. Jaminan ini akan ditahan oleh sistem selama proses pekerjaan berlangsung dan akan dikembalikan atau dicairkan sesuai dengan kesepakatan penyelesaian pekerjaan. Sistem ini dirancang untuk meminimalisir risiko kerugian akibat pembatalan sepihak atau ketidaksesuaian hasil pekerjaan.</p>
                
                <p className="text-xs text-slate-600 leading-relaxed">Dengan menggunakan layanan JasaMitra, Anda menyatakan setuju untuk tunduk pada seluruh kebijakan, syarat, dan ketentuan yang telah diuraikan di atas. JasaMitra berhak untuk melakukan perubahan terhadap kebijakan ini sewaktu-waktu dengan atau tanpa pemberitahuan terlebih dahulu. Penggunaan berkelanjutan atas platform kami setelah perubahan kebijakan dianggap sebagai penerimaan Anda terhadap perubahan tersebut.</p>
              </div>
              <button onClick={handleBack} className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/30 mt-6 uppercase tracking-widest">Saya Mengerti & Kembali</button>
            </main>
          </motion.div>
        )}

        {/* --- SYARAT & KETENTUAN --- */}
        {activePage === 'syarat-ketentuan' && (
          <motion.div key="syarat-ketentuan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PageHeader title="Syarat & Ketentuan" subtitle="JasaMitra - Tukang Jagoan" onBack={handleBack} />
            <main className="px-6 -mt-4 pb-12">
              <div className="bg-slate-50 rounded-[30px] p-4 overflow-y-auto max-h-[75vh] hide-scrollbar">
                <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-2xl shadow-sm">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">JASA<span className="text-primary">MITRA</span></h3>
                    <p className="text-[11px] text-slate-400 font-medium">Solusi jasa terpercaya dengan jaminan 10%</p>
                  </div>
                </div>

                {/* Navigasi Cepat */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 hide-scrollbar sticky top-0 z-10 bg-slate-50/80 backdrop-blur-sm -mx-2 px-2">
                  {[
                    { id: 'umum', label: 'Ketentuan Umum' },
                    { id: 'jaminan', label: 'Jaminan 10%', active: true },
                    { id: 'mitra', label: 'Mitra' },
                    { id: 'pelanggan', label: 'Pelanggan' },
                  ].map((nav) => (
                    <button 
                      key={nav.id}
                      onClick={() => document.getElementById(nav.id)?.scrollIntoView({ behavior: 'smooth' })}
                      className={`px-4 py-2 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${nav.active ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-white text-slate-600 border border-slate-100'}`}
                    >
                      {nav.label}
                    </button>
                  ))}
                </div>

                {/* Konten Syarat & Ketentuan */}
                <div className="bg-white rounded-[30px] p-6 shadow-sm border border-slate-100 space-y-8">
                  {/* Bagian 1: Ketentuan Umum */}
                  <div id="umum" className="scroll-mt-20">
                    <h3 className="text-base font-bold text-primary mb-4 flex items-center gap-3">
                      <div className="w-1.5 h-5 bg-primary rounded-full" />
                      KETENTUAN UMUM
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 mb-2">1. PENGGUNAAN APLIKASI JASAMITRA</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          JasaMitra adalah platform teknologi yang mempertemukan Pengguna (Pelanggan) dengan Mitra (Penyedia Jasa) untuk berbagai layanan perbaikan, servis, dan instalasi. Kami bukan penyedia jasa langsung, melainkan fasilitator yang memastikan transaksi berjalan aman dan terpercaya.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 mb-2">2. PENDAFTARAN DAN AKUN</h4>
                        <p className="text-xs text-slate-500 leading-relaxed mb-3">
                          Setiap Pengguna wajib mendaftar dan memiliki akun untuk mengakses layanan JasaMitra. Data yang diberikan harus benar dan dapat dipertanggungjawabkan. Pengguna bertanggung jawab penuh atas keamanan akun dan aktivitas yang dilakukan.
                        </p>
                        <ul className="text-xs text-slate-500 leading-relaxed space-y-2 list-disc ml-4 font-medium">
                          <li>Pengguna dilarang memberikan akses akun kepada pihak lain.</li>
                          <li>JasaMitra berhak menonaktifkan akun jika ditemukan pelanggaran.</li>
                          <li>Data pribadi akan dilindungi sesuai Kebijakan Privasi.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent" />

                  {/* Bagian 2: JAMINAN KEAMANAN TRANSAKSI 10% */}
                  <div id="jaminan" className="scroll-mt-20 bg-blue-50/50 rounded-3xl p-6 border-l-4 border-primary">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <ShieldCheck size={20} />
                      </div>
                      <h3 className="text-lg font-extrabold text-primary">JAMINAN KEAMANAN TRANSAKSI 10%</h3>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-5 space-y-6 shadow-sm border border-blue-100">
                      <div className="flex gap-4">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 mb-1">Jaminan keamanan transaksi adalah <span className="text-primary">BIAYA LAYANAN</span> sebesar 10% dari nilai kesepakatan.</p>
                          <p className="text-[11px] text-slate-400 font-medium">Contoh: Deal Rp 1.000.000 → Biaya jaminan Rp 100.000 ke aplikasi, sisanya Rp 900.000 ke mitra.</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 mb-1">Biaya layanan ini <span className="text-rose-500">BUKAN</span> merupakan simpanan atau titipan dana perbankan.</p>
                          <p className="text-[11px] text-slate-400 font-medium">Kami hanya memfasilitasi jaminan, bukan bank atau lembaga keuangan.</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 mb-2">Biaya layanan berfungsi sebagai:</p>
                          <ul className="text-xs text-slate-500 space-y-1.5 list-disc ml-4 font-medium">
                            <li>Jaminan komitmen Mitra untuk menyelesaikan pekerjaan</li>
                            <li>Kompensasi kepada Pengguna jika Mitra membatalkan sepihak</li>
                            <li>Dana perlindungan transaksi (dispute resolution)</li>
                          </ul>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">4</div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 leading-relaxed">PT JasaMitra Indonesia <span className="text-rose-500">BUKAN</span> merupakan penyelenggara sistem pembayaran sebagaimana dimaksud dalam peraturan Bank Indonesia/OJK.</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">5</div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 leading-relaxed">Sisa pembayaran (90%) dilakukan langsung antara Pengguna dan Mitra di luar sistem JasaMitra.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-2xl mt-6">
                      <p className="text-[11px] text-amber-800 font-bold flex items-center gap-2">
                        <Info size={14} /> Penting:
                      </p>
                      <p className="text-[11px] text-amber-700 font-medium mt-1">
                        Dengan menggunakan JasaMitra, Anda menyetujui mekanisme jaminan 10% ini sebagai bentuk perlindungan bersama.
                      </p>
                    </div>
                  </div>

                  {/* Bagian 3: Ketentuan Mitra */}
                  <div id="mitra" className="scroll-mt-20">
                    <h3 className="text-base font-bold text-primary mb-4 flex items-center gap-3">
                      <div className="w-1.5 h-5 bg-primary rounded-full" />
                      KETENTUAN MITRA
                    </h3>
                    <div className="bg-slate-50 rounded-2xl p-5">
                      <ul className="text-xs text-slate-600 space-y-3 list-disc ml-4 font-medium leading-relaxed">
                        <li>Mitra wajib menyelesaikan pekerjaan sesuai kesepakatan dengan Pengguna.</li>
                        <li>Mitra dilarang meminta pembayaran di luar mekanisme yang ditentukan.</li>
                        <li>Jika Mitra membatalkan sepihak, jaminan 10% akan dikembalikan kepada Pengguna.</li>
                        <li>Mitra wajib menjaga etika, kesopanan, dan keamanan saat di lokasi Pengguna.</li>
                        <li>Pelanggaran berat (penipuan, pelecehan, pencurian) akan diproses secara hukum.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Bagian 4: Ketentuan Pelanggan */}
                  <div id="pelanggan" className="scroll-mt-20">
                    <h3 className="text-base font-bold text-primary mb-4 flex items-center gap-3">
                      <div className="w-1.5 h-5 bg-primary rounded-full" />
                      KETENTUAN PELANGGAN
                    </h3>
                    <div className="bg-slate-50 rounded-2xl p-5">
                      <ul className="text-xs text-slate-600 space-y-3 list-disc ml-4 font-medium leading-relaxed">
                        <li>Pelanggan wajib membayar jaminan 10% sesuai kesepakatan sebelum pekerjaan dimulai.</li>
                        <li>Pelanggan wajib memberikan informasi yang jelas dan benar mengenai pekerjaan.</li>
                        <li>Jika Pelanggan membatalkan sepihak setelah Mitra datang, jaminan 10% menjadi hak Mitra.</li>
                        <li>Pelanggan wajib membayar sisa 90% langsung kepada Mitra setelah pekerjaan selesai.</li>
                        <li>Pelanggan dapat memberikan rating dan ulasan untuk membantu pengguna lain.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-8 border-t border-slate-100 text-center space-y-4">
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                      © 2026 PT JasaMitra Indonesia. Hak Cipta Dilindungi.<br />
                      Terakhir diperbarui: 24 Februari 2026
                    </p>
                    <div className="flex justify-center gap-4">
                      <button onClick={() => navigateTo('kebijakan')} className="text-[10px] font-bold text-primary">Kebijakan Privasi</button>
                      <div className="w-px h-3 bg-slate-200" />
                      <button onClick={() => navigateTo('syarat-ketentuan')} className="text-[10px] font-bold text-primary">Syarat & Ketentuan</button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <button 
                    onClick={() => navigateTo('akun')}
                    className="bg-white border border-slate-200 px-8 py-4 rounded-full text-xs font-bold text-slate-600 flex items-center gap-2 mx-auto active:scale-95 transition-transform shadow-sm"
                  >
                    <ArrowLeft size={16} /> Kembali ke Akun
                  </button>
                </div>
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
                  <input type="text" placeholder="Contoh: Servis AC Bergaransi" className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Kategori</label>
                  <select className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none appearance-none">
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Tarif / Harga Mulai</label>
                  <input type="text" placeholder="Rp 150.000" className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none" />
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
                  <textarea placeholder="Jelaskan keahlian dan pengalaman Anda..." className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none min-h-[120px]" />
                </div>
                
                <div className="pt-4 space-y-3">
                  <button onClick={() => {alert('Iklan dikirim!'); setShowAdModal(false); setAdImage(null);}} className="w-full bg-primary text-white py-5 rounded-[30px] font-bold text-sm shadow-xl shadow-primary/30">Kirim Pendaftaran Iklan</button>
                  <button onClick={() => {setShowAdModal(false); setAdImage(null);}} className="w-full py-4 text-slate-400 font-bold text-sm">Batal</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showDealModal && activeDeal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[4000] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl overflow-hidden relative">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary shadow-inner"><Handshake size={40} /></div>
                <h3 className="text-xl font-extrabold text-slate-800">Konfirmasi Deal</h3>
                <p className="text-xs text-slate-400 font-medium">Anda telah sepakat dengan mitra</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl space-y-3 mb-6">
                <div className="flex justify-between text-xs font-bold"><span className="text-slate-400">Jasa</span><span className="text-slate-700">{activeDeal.jasa}</span></div>
                <div className="flex justify-between text-xs font-bold"><span className="text-slate-400">Mitra</span><span className="text-slate-700">{activeDeal.mitra}</span></div>
                <div className="flex justify-between text-sm font-extrabold pt-3 border-t border-slate-200"><span className="text-slate-400">Total Deal</span><span className="text-primary">Rp {activeDeal.total.toLocaleString()}</span></div>
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 mt-4">
                  <div className="flex justify-between text-xs font-extrabold text-emerald-600"><span><ShieldCheck size={14} className="inline mr-1" /> Jaminan 10%</span><span>Rp {activeDeal.jaminan.toLocaleString()}</span></div>
                  <p className="text-[9px] text-emerald-500 font-bold mt-1 uppercase tracking-tighter">*Dibayarkan ke aplikasi sebagai jaminan</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-2xl mb-6 border-l-4 border-primary">
                <p className="text-[10px] font-bold text-blue-800 mb-2 uppercase tracking-widest">🏦 Rekening JasaMitra</p>
                <p className="text-sm font-extrabold text-slate-800">BCA 8123-4567-89</p>
                <p className="text-[10px] font-medium text-slate-500">a.n. PT JasaMitra Indonesia</p>
              </div>

              <div className="space-y-3">
                <button onClick={confirmDeal} className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/30 active:scale-95 transition-transform flex items-center justify-center gap-2">
                  <CheckCircle2 size={18} /> Saya Sudah Transfer
                </button>
                <button onClick={() => setShowDealModal(false)} className="w-full py-3 text-slate-400 font-bold text-sm">Batalkan</button>
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
              className="bg-white w-full max-w-lg rounded-[40px] p-8 shadow-2xl relative overflow-hidden"
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

              <div className="space-y-4 mb-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-2">Nama Lengkap</label>
                  <input type="text" placeholder="Nama Anda" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-2">Alamat Pengerjaan</label>
                  <textarea placeholder="Alamat lengkap..." className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20 resize-none h-24" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-2">Deskripsi Kerusakan</label>
                  <textarea placeholder="Ceritakan kendala Anda..." className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20 resize-none h-24" />
                </div>
              </div>

              <button 
                onClick={() => {
                  setBookingService(null);
                  navigateTo('chat');
                }}
                className="w-full bg-primary text-white py-5 rounded-[24px] font-bold text-sm shadow-xl shadow-primary/30 active:scale-95 transition-transform"
              >
                PESAN SEKARANG
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
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm mt-8 active:scale-95 transition-transform"
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
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="relative w-full max-w-md bg-white rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6 sm:hidden" />
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center text-amber-500 mx-auto mb-4 shadow-inner">
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
                    className="text-amber-400"
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
      </AnimatePresence>

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

