import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Handshake, ShieldCheck, Star, Clock, MapPin, 
  ClipboardList, User, Home, Plus, LayoutGrid,
  ChevronRight, ArrowLeft, Send, Image as ImageIcon, X, 
  CheckCircle2, AlertTriangle, LogOut, Info, FileText,
  Copy, Camera, Building2, Trash2, PauseCircle,
  Edit3, Wrench, MessageSquare, Phone, Bell, ChevronDown, Heart, Hourglass
} from 'lucide-react';
import { CATEGORIES, DISTRICTS, INITIAL_SERVICES } from './constants';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, User as FirebaseUser, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { collection, query, onSnapshot, addDoc, serverTimestamp, where, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';

// --- TYPES ---
type Page = 'beranda' | 'pesan' | 'akun' | 'login' | 'daftar-mitra' | 'profil-mitra' | 'iklan-saya';

export default function App() {
  const [activePage, setActivePage] = useState<Page>('beranda');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userRole, setUserRole] = useState<'tamu' | 'mitra' | 'admin' | null>(null);
  const [mitraStatus, setMitraStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSplash, setIsSplash] = useState(true);

  // States Data
  const [services, setServices] = useState<any[]>([]);
  const [myAds, setMyAds] = useState<any[]>([]);
  const [selectedMitra, setSelectedMitra] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  
  // States Form Iklan
  const [showAdModal, setShowAdModal] = useState(false);
  const [adTitle, setAdTitle] = useState('');
  const [adCategory, setAdCategory] = useState('');
  const [adPrice, setAdPrice] = useState('');
  const [adCity, setAdCity] = useState('');
  const [adDistrict, setAdDistrict] = useState('');
  const [adDesc, setAdDesc] = useState('');
  const [servicePolicy, setServicePolicy] = useState('hanya_alat');
  const [isSubmittingAd, setIsSubmittingAd] = useState(false);

  // 1. SINCRONISASI AUTH & DATABASE
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        // Proteksi Admin UID Bapak
        if (u.uid === 'itil5yCk8AXqH3QWWlZsjwhMgHU2' || u.email === 'jasamitra2026@gmail.com') {
           setUserRole('admin');
        } else {
           const mitraDoc = await getDoc(doc(db, 'mitras', u.uid));
           if (mitraDoc.exists()) {
             setUserRole('mitra');
             setMitraStatus(mitraDoc.data().status);
           } else {
             setUserRole('tamu');
           }
        }
        // Ambil Iklan Saya
        onSnapshot(query(collection(db, 'iklan'), where('mitraId', '==', u.uid)), (snap) => {
          setMyAds(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
      }
      // Ambil Semua Iklan untuk Publik (Tamu)
      onSnapshot(collection(db, 'iklan'), (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setServices(data.length > 0 ? data : INITIAL_SERVICES);
      });
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // 2. FUNGSI PROFIL MITRA REAL (TIDAK ADA LAGI AHMAD FAUZI)
  const openMitraProfile = async (ad: any) => {
    try {
      const mitraDoc = await getDoc(doc(db, 'mitras', ad.mitraId));
      if (mitraDoc.exists()) {
        const d = mitraDoc.data();
        setSelectedMitra({
          ...d,
          id: ad.mitraId,
          serviceTitle: ad.title,
          servicePrice: ad.price,
          servicePolicy: ad.servicePolicy
        });
        setActivePage('profil-mitra');
      } else {
        alert("Profil mitra pendaftar tidak ditemukan.");
      }
    } catch (e) { alert("Gagal memuat profil."); }
  };

  // 3. FUNGSI SIMPAN IKLAN (CLEAN PRICE & POLICY)
  const handleSubmitAd = async () => {
    if (!adTitle || !adCategory || !adPrice || !adCity || !adDistrict) {
      alert('Lengkapi semua data iklan!'); return;
    }
    setIsSubmittingAd(true);
    try {
      const cleanPrice = Number(adPrice.toString().replace(/[^0-9]/g, ''));
      await addDoc(collection(db, 'iklan'), {
        title: adTitle,
        category: adCategory,
        price: cleanPrice,
        servicePolicy: servicePolicy,
        desc: adDesc,
        city: adCity,
        district: adDistrict,
        location: `${adDistrict}, ${adCity}`,
        mitraId: user?.uid,
        mitraName: user?.displayName || "Mitra Jasamitra",
        status: 'active',
        img: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
        createdAt: serverTimestamp()
      });
      alert('Iklan Jasa Berhasil Ditayangkan!');
      setShowAdModal(false);
      setAdTitle(''); setAdPrice('');
    } catch (e) { alert('Gagal menyimpan ke database.'); } finally { setIsSubmittingAd(false); }
  };

  const handleLogout = () => signOut(auth).then(() => window.location.reload());

  if (isSplash) return <SplashScreen onComplete={() => setIsSplash(false)} />;
  if (loading) return <div className="h-screen flex items-center justify-center font-black text-blue-600 animate-pulse">SISTEM JASAMITRA...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24">
      {/* HEADER */}
      <header className="bg-white p-5 border-b sticky top-0 z-40 flex justify-between items-center shadow-sm">
        <h1 onClick={()=>setActivePage('beranda')} className="text-2xl font-black italic tracking-tighter text-[#003366] cursor-pointer">JASA<span className="text-[#F27D26]">MITRA</span></h1>
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded-lg uppercase">{userRole}</span>
            <div onClick={()=>setActivePage('akun')} className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg border-2 border-white uppercase cursor-pointer">{user.email?.charAt(0)}</div>
          </div>
        ) : (
          <button onClick={() => setActivePage('login')} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-xs shadow-lg">LOGIN</button>
        )}
      </header>

      <AnimatePresence mode="wait">
        {/* --- BERANDA --- */}
        {activePage === 'beranda' && (
          <motion.main initial={{opacity:0}} animate={{opacity:1}} className="p-5 space-y-6">
             <div className="bg-gradient-to-br from-blue-700 to-blue-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <h2 className="text-xl font-black italic">Solusi Jasa Terpercaya</h2>
                <p className="text-[10px] font-bold opacity-70 mt-1 uppercase tracking-widest">Wilayah Bandung Raya & Cimahi</p>
                <ShieldCheck className="absolute -right-5 -bottom-5 text-white/10" size={150} />
             </div>

             <div className="grid grid-cols-4 gap-4">
                {CATEGORIES.map(c => (
                  <div key={c.id} className="flex flex-col items-center gap-1">
                     <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600"><c.icon size={24}/></div>
                     <span className="text-[9px] font-black text-slate-500 text-center uppercase leading-tight">{c.name}</span>
                  </div>
                ))}
             </div>

             <div className="space-y-5 pt-4">
                <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">🔥 Rekomendasi Untukmu</h3>
                {services.map(s => (
                  <div key={s.id} onClick={()=>openMitraProfile(s)} className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-50 flex gap-5 hover:shadow-xl transition-all cursor-pointer">
                     <img src={s.img} className="w-24 h-24 rounded-3xl object-cover shadow-lg" alt={s.title} />
                     <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h4 className="text-sm font-black text-slate-800 line-clamp-1 uppercase">{s.title}</h4>
                          <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1 uppercase"><MapPin size={10} className="text-blue-500"/> {s.location}</p>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-blue-600 font-black text-lg">Rp {Number(s.price).toLocaleString()}</span>
                           <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">Lihat</span>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </motion.main>
        )}

        {/* --- PROFIL MITRA (REAL DATA) --- */}
        {activePage === 'profil-mitra' && selectedMitra && (
          <motion.main initial={{x:50, opacity:0}} animate={{x:0, opacity:1}} className="p-6 space-y-6">
             <button onClick={()=>setActivePage('beranda')} className="p-3 bg-white rounded-2xl shadow-sm border mb-2"><ArrowLeft size={20}/></button>
             
             <div className="bg-white p-10 rounded-[3.5rem] shadow-xl text-center border relative">
                <img src={selectedMitra.foto || "https://ui-avatars.com/api/?name="+selectedMitra.name} className="w-28 h-28 rounded-full border-4 border-white shadow-2xl mx-auto mb-4 object-cover" />
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">{selectedMitra.name}</h3>
                <p className="text-blue-500 font-black text-[10px] uppercase mt-1 tracking-widest">{selectedMitra.statusKeahlian || "Mitra Terverifikasi"}</p>
                <div className="mt-4 flex items-center justify-center gap-1 text-slate-400 text-[10px] font-bold uppercase">
                   <MapPin size={14} className="text-red-500" /> {selectedMitra.district}, {selectedMitra.city}
                </div>
             </div>

             <div className="bg-white p-8 rounded-[3rem] shadow-sm border space-y-4">
                <h4 className="font-black text-slate-800 flex items-center gap-2 uppercase text-xs tracking-widest"><Info size={18} className="text-blue-600"/> Tentang Mitra</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{selectedMitra.tentang || selectedMitra.desc}</p>
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 mt-4">
                   <p className="text-[10px] font-black text-blue-600 uppercase mb-2">Kebijakan Alat:</p>
                   <p className="text-xs font-bold text-slate-700 capitalize">{selectedMitra.servicePolicy?.replace('_', ' ')}</p>
                </div>
             </div>

             <div className="bg-slate-900 p-8 rounded-[3rem] text-white space-y-4 shadow-2xl">
                <h4 className="font-black flex items-center gap-2 text-xs uppercase tracking-widest"><Phone size={18} className="text-blue-400"/> Kontak & Alamat</h4>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-4">
                   <div>
                      <p className="text-[9px] font-black text-white/40 uppercase mb-1">WhatsApp</p>
                      <p className="text-sm font-black">08xx-xxxx-xxxx (Disensor)</p>
                   </div>
                   <div className="bg-orange-500/10 p-4 rounded-xl border border-orange-500/20 flex gap-3">
                      <AlertTriangle className="text-orange-500 shrink-0" size={18} />
                      <p className="text-[10px] text-orange-200 font-bold">Bayar DP 10% untuk membuka kontak Mitra.</p>
                   </div>
                </div>
                <button className="w-full bg-blue-600 py-5 rounded-[2rem] font-black text-sm shadow-xl active:scale-95 transition uppercase tracking-widest">Mulai Transaksi (DP 10%)</button>
             </div>
          </motion.main>
        )}

        {/* --- AKUN & IKLAN SAYA --- */}
        {activePage === 'akun' && (
          <motion.main initial={{opacity:0}} animate={{opacity:1}} className="p-6 space-y-6">
             <div className="bg-white p-10 rounded-[3rem] shadow-xl border text-center relative overflow-hidden">
                <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-black text-3xl border-4 border-white shadow-2xl uppercase">{user?.email?.charAt(0)}</div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">{user?.displayName || "User JasaMitra"}</h3>
                <p className="text-xs text-slate-400 font-bold mt-1 mb-8">{user?.email}</p>
                <button onClick={handleLogout} className="bg-rose-50 text-rose-600 px-10 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border border-rose-100 shadow-sm active:bg-rose-600 active:text-white transition">Logout Keluar</button>
             </div>

             {userRole === 'mitra' && (
               <div className="space-y-4">
                  <h4 className="font-black text-slate-800 text-lg flex items-center gap-2 px-2 uppercase tracking-tight">📦 Iklan Jasa Saya ({myAds.length})</h4>
                  {myAds.map(ad => (
                    <div key={ad.id} className="bg-white p-5 rounded-[2.5rem] border shadow-sm flex gap-4">
                       <img src={ad.img} className="w-20 h-20 rounded-3xl object-cover shadow-inner" />
                       <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                             <h5 className="text-sm font-black text-slate-800 uppercase line-clamp-1">{ad.title}</h5>
                             <span className="bg-green-50 text-green-600 text-[8px] font-black px-2 py-0.5 rounded-lg uppercase mt-1 inline-block">Active</span>
                          </div>
                          <div className="flex gap-3 mt-3">
                             <button onClick={() => { if(window.confirm("Hapus iklan ini?")) deleteDoc(doc(db, 'iklan', ad.id)) }} className="p-2 bg-rose-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition"><Trash2 size={18}/></button>
                             <button className="p-2 bg-slate-50 text-slate-400 rounded-xl"><Edit3 size={18}/></button>
                          </div>
                       </div>
                    </div>
                  ))}
                  {myAds.length === 0 && <div className="p-12 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold text-xs uppercase italic tracking-widest">Belum ada iklan.</div>}
               </div>
             )}
          </motion.main>
        )}

        {/* --- LOGIN PAGE --- */}
        {activePage === 'login' && (
          <div className="h-screen flex items-center justify-center p-6 bg-white">
             <div className="text-center w-full max-w-sm">
                <h1 className="text-4xl font-black text-[#003366] italic mb-2 tracking-tighter">JASA<span className="text-[#F27D26]">MITRA</span></h1>
                <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-16">Super Admin & Mitra Login</p>
                <button onClick={() => signInWithPopup(auth, new GoogleAuthProvider()).then(()=>setActivePage('beranda'))} className="w-full bg-blue-600 text-white py-5 rounded-[2.5rem] font-black text-sm shadow-2xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition uppercase tracking-widest">Masuk Dengan Google</button>
             </div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL BUAT IKLAN --- */}
      {showAdModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm p-4">
           <motion.div initial={{y:100}} animate={{y:0}} className="bg-white w-full max-w-md rounded-t-[3.5rem] p-10 shadow-2xl overflow-y-auto max-h-[95vh] relative">
              <button onClick={()=>setShowAdModal(false)} className="absolute top-8 right-8 p-2 bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-1 italic">Pasang Iklan Jasa</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-10">Tampilkan keahlian terbaik Bapak!</p>
              
              <div className="space-y-5">
                 <div className="space-y-1.5"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Judul Layanan</label><input value={adTitle} onChange={e=>setAdTitle(e.target.value)} type="text" placeholder="Contoh: Jasa Las Pagar Rumah" className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-black text-sm border border-slate-100 focus:border-blue-300" /></div>
                 
                 <div className="space-y-1.5"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori Jasa</label>
                   <select value={adCategory} onChange={e=>setAdCategory(e.target.value)} className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold text-sm border border-slate-100">
                      <option value="">-- Pilih Kategori --</option>
                      <option value="Pengelas">Pengelas (Konstruksi)</option><option value="Bangunan">Tukang Bangunan</option><option value="Elektronik">Servis Elektronik</option><option value="Kebersihan">Kebersihan</option>
                   </select>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Pilih Kota</label>
                      <select value={adCity} onChange={e=>setAdCity(e.target.value)} className="w-full bg-slate-50 p-4 rounded-2xl font-black text-xs outline-none border border-slate-100">
                         <option value="">KOTA/KAB</option><option value="Kota Bandung">Kota Bandung</option><option value="Kota Cimahi">Kota Cimahi</option><option value="Kab. Bandung">Kab. Bandung</option><option value="Kab. Bandung Barat">KBB</option>
                      </select>
                   </div>
                   <div className="space-y-1.5"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Kecamatan</label>
                      <select value={adDistrict} onChange={e=>setAdDistrict(e.target.value)} disabled={!adCity} className="w-full bg-slate-50 p-4 rounded-2xl font-black text-xs outline-none border border-slate-100">
                         <option value="">WILAYAH</option>{adCity && DISTRICTS[adCity]?.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                   </div>
                 </div>

                 <div className="space-y-1.5"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Tarif Jasa (Mulai Dari)</label><input value={adPrice} onChange={e=>setAdPrice(e.target.value)} type="text" placeholder="Contoh: 150000" className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-black text-blue-600 text-lg border border-slate-100" /></div>

                 <div className="bg-blue-50 p-6 rounded-[2.5rem] border border-blue-100 space-y-4">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest text-center">Kebijakan Sedia Alat & Material</p>
                    <div className="grid grid-cols-2 gap-3">
                       <label className={`flex-1 flex items-center justify-center p-3 rounded-2xl border-2 transition cursor-pointer text-center ${servicePolicy==='sedia_alat_material'?'border-blue-600 bg-white text-blue-600 shadow-lg':'bg-white text-slate-300 border-slate-100'}`}>
                          <input type="radio" className="hidden" checked={servicePolicy==='sedia_alat_material'} onChange={()=>setServicePolicy('sedia_alat_material')} /><span className="text-[8px] font-black uppercase">Alat & Material Dari Kami</span>
                       </label>
                       <label className={`flex-1 flex items-center justify-center p-3 rounded-2xl border-2 transition cursor-pointer text-center ${servicePolicy==='hanya_alat'?'border-blue-600 bg-white text-blue-600 shadow-lg':'bg-white text-slate-300 border-slate-100'}`}>
                          <input type="radio" className="hidden" checked={servicePolicy==='hanya_alat'} onChange={()=>setServicePolicy('hanya_alat')} /><span className="text-[8px] font-black uppercase">Hanya Sedia Alat Saja</span>
                       </label>
                    </div>
                 </div>

                 <button onClick={handleSubmitAd} disabled={isSubmittingAd} className="w-full bg-blue-600 text-white py-5 rounded-[2.5rem] font-black text-sm uppercase shadow-2xl shadow-blue-600/40 active:scale-95 transition disabled:bg-slate-200">
                    {isSubmittingAd ? "MENGIRIM DATA..." : "PUBLIKASIKAN IKLAN"}
                 </button>
              </div>
           </motion.div>
        </div>
      )}

      {/* --- REKENING BCA REAL --- */}
      <AnimatePresence>
         {activePage === 'pesan' && (
           <div className="p-6">
              <h3 className="font-black text-slate-800 mb-4 uppercase tracking-tighter italic">Informasi Pembayaran JasaMitra</h3>
              <BankAccountInfo />
              <div className="bg-orange-50 border border-orange-100 p-6 rounded-[2.5rem] flex gap-4 items-start shadow-sm">
                 <AlertTriangle className="text-orange-500 shrink-0" size={24} />
                 <p className="text-xs text-orange-800 font-bold leading-relaxed italic">"Dilarang melakukan transfer langsung ke rekening Mitra sebelum ada kesepakatan deal di aplikasi JasaMitra."</p>
              </div>
           </div>
         )}
      </AnimatePresence>

      {/* NAVIGATION */}
      <nav className="fixed bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md h-18 rounded-[2.5rem] shadow-2xl border border-slate-100 flex items-center justify-around z-50 px-2 overflow-visible">
        <NavBtn label="Home" icon={<Home size={22}/>} act={activePage==='beranda'} onClick={()=>setActivePage('beranda')} />
        <NavBtn label="Pesan" icon={<MessageSquare size={22}/>} act={activePage==='pesan'} onClick={()=>setActivePage('pesan')} />
        
        {/* Tombol Tambah Tengah */}
        <button onClick={()=>{ if(userRole==='mitra' && mitraStatus==='approved') setShowAdModal(true); else alert("Hanya mitra terverifikasi yang bisa pasang iklan."); }} className="bg-blue-600 w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-600/40 -mt-12 border-4 border-white active:scale-90 transition">
           <Plus size={36} strokeWidth={3} />
        </button>

        <NavBtn label="Progress" icon={<LayoutGrid size={22}/>} act={activePage==='layanan'} onClick={()=>alert("Fitur progres dalam pengembangan.")} />
        <NavBtn label="Akun" icon={<User size={22}/>} act={activePage==='akun'} onClick={()=>setActivePage('akun')} />
      </nav>
    </div>
  );
}

const NavBtn = ({ label, icon, act, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center flex-1 gap-1 transition-all ${act?'text-blue-600 scale-110':'text-slate-300'}`}>
    {icon} 
    <span className={`text-[8px] font-black uppercase tracking-tighter transition-opacity ${act?'opacity-100':'opacity-0'}`}>{label}</span>
  </button>
);