import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Star, ShieldCheck, ChevronRight, Bell, Heart, ChevronDown, AlertTriangle, X, ClipboardList, MessageSquare, Zap, Image as ImageIcon, SlidersHorizontal, Store } from 'lucide-react';
import { Page } from '../types';
import { PartnerJasaMitra } from '../components/PartnerJasaMitra';

interface HomeProps {
 user: any;
 userRole: 'tamu' | 'mitra' | 'admin' | 'pelanggan' | null;
 navigateTo: (page: Page) => void;
 isFirebaseConfigured: boolean;
 searchQuery: string;
 setSearchQuery: (query: string) => void;
 showNotifDropdown: boolean;
 setShowNotifDropdown: (show: boolean) => void;
 unreadNotifCount: number;
 markNotifsAsRead: () => Promise<void>;
 notifications: any[];
 CATEGORIES: any[];
 selectedCat: string;
 setSelectedCat: (cat: string) => void;
 setSelectedSub: (sub: string) => void;
 services: any[];
 filteredServices: any[];
 openMitraProfile: (service: any) => void;
 formatPrice: (price: any) => string;
  currentAddress?: string;
  setShowLocationModal?: (show: boolean) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

export const Home: React.FC<HomeProps> = ({
 user,
 userRole,
 navigateTo,
 isFirebaseConfigured,
 searchQuery,
 setSearchQuery,
 showNotifDropdown,
 setShowNotifDropdown,
 unreadNotifCount,
 markNotifsAsRead,
 notifications,
 CATEGORIES,
 selectedCat,
 setSelectedCat,
 setSelectedSub,
 services,
 filteredServices,
 openMitraProfile,
 formatPrice,
  currentAddress = 'Lokasi Bandung Raya & Cimahi',
  setShowLocationModal,
  favorites,
  toggleFavorite
}) => {
 return (
 <motion.div 
 key="beranda"
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: 20 }}
 className="flex flex-col bg-slate-50/50 min-h-screen relative overflow-hidden"
 >
 <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
 <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-[#003366]/5 to-transparent blur-3xl" />
 <div className="absolute top-[40%] -right-[10%] w-[30%] h-[30%] rounded-full bg-gradient-to-tl from-[#F27D26]/5 to-transparent blur-3xl" />
 </div>
 <header className="bg-white pt-4 pb-4 px-6 relative overflow-hidden border-b border-slate-100 shadow-sm z-20">
 <div className="relative z-10 flex flex-col gap-4">
 {/* Top Row: Logo & Location */}
 <div className="flex items-center justify-between">
 <h1 className="text-xl font-black tracking-tighter">
 <span className="text-[#003366]">JASA</span>
 <span className="text-[#F27D26]">MITRA</span>
 </h1>
  <div id="location-selector" onClick={() => setShowLocationModal && setShowLocationModal(true)} className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
    <MapPin size={14} className="text-primary" />
    <span className="text-[10px] font-bold text-slate-700 max-w-[100px] truncate">{currentAddress}</span>
    <ChevronDown size={12} className="text-slate-400" />
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
 <div className="relative flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:bg-white focus-within:border-primary/40 transition-all shadow-sm">
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
 <motion.div 
 whileHover={{ scale: 1.1, translateY: -2 }}
 whileTap={{ scale: 0.9 }} 
 onClick={() => navigateTo('favorit')}
 className="relative text-slate-600 bg-white p-2 rounded-xl border border-slate-200 shadow-sm cursor-pointer"
 >
 <Heart size={20} />
 {favorites.length > 0 && (
 <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-white rounded-full flex items-center justify-center shadow-sm">
 <span className="text-[8px] text-white font-bold">{favorites.length}</span>
 </div>
 )}
 </motion.div>
 <motion.div 
 whileHover={{ scale: 1.1, translateY: -2 }}
 whileTap={{ scale: 0.9 }} 
 className="relative text-slate-600 cursor-pointer bg-white p-2 rounded-xl border border-slate-200 shadow-sm"
 onClick={() => {
 setShowNotifDropdown(!showNotifDropdown);
 if (!showNotifDropdown) markNotifsAsRead();
 }}
 >
 <Bell size={20} />
 {unreadNotifCount > 0 && (
 <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center shadow-sm">
 <span className="text-[8px] text-white font-bold">{unreadNotifCount}</span>
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
 className="absolute top-24 right-6 left-6 z-[3000] bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden max-h-[70vh] flex flex-col"
 >
 <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-white ">
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
 className={`p-4 rounded-2xl transition-all duration-300 cursor-pointer hover:bg-white/60 hover:shadow-sm hover:translate-y-[-1px] flex gap-4 ${!n.isRead ? 'bg-primary/5 border-l-4 border-primary' : 'bg-white/40 border border-slate-200'}`}
 onClick={() => {
 if (n.type === 'chat') navigateTo('chat');
 if (n.type === 'order') navigateTo('pesanan');
 setShowNotifDropdown(false);
 }}
 >
 <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-slate-200 ${
 n.type === 'order' ? 'bg-emerald-100/80 text-emerald-600' : 
 n.type === 'payment' ? 'bg-blue-100/80 text-blue-600' : 
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
 whileHover={{ scale: 1.02, translateY: -2 }}
 whileTap={{ scale: 0.98 }}
 onClick={() => navigateTo('jaminan-keamanan')}
 className="min-w-[85%] bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex gap-4 relative overflow-hidden group cursor-pointer transition-transform snap-center"
 >
 <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
 <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0 relative z-10 shadow-sm border border-slate-200 group-hover:bg-primary group-hover:text-white transition-colors">
 <ShieldCheck size={20} />
 </div>
 <div className="relative z-10">
 <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider mb-0.5 flex items-center gap-1.5 group-hover:text-primary transition-colors">
 Jaminan Keamanan <span className="text-accent">Verified</span>
 </h4>
 <p className="text-[8px] text-slate-500 leading-relaxed font-medium">
 Mitra terverifikasi ketat untuk keamanan & profesionalisme Anda.
 </p>
 </div>
 <div className="ml-auto self-center text-slate-300 group-hover:text-primary transition-colors group-hover:translate-x-1 transform duration-300">
 <ChevronRight size={14} />
 </div>
 </motion.div>
 </div>

 {/* Static Safety Protocol Banner */}
 <section className="mb-5">
 <motion.div 
 whileHover={{ scale: 1.02, translateY: -2 }}
 whileTap={{ scale: 0.98 }}
 className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 cursor-pointer group"
 >
 <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
 <img src="https://i.ibb.co.com/wF3vLkXV/1774644753080.png" alt="Protokol Keselamatan" className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
 </motion.div>
 </section>

 {/* Kategori (Grid) */}
 <section className="mb-8 relative z-20">
 <div className="flex items-center justify-between mb-4">
 <h2 className="text-base font-bold text-slate-800 tracking-tight">Pilih Kategori Jasa</h2>
 </div>
 <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar -mx-5 px-5 snap-x snap-mandatory">
 {CATEGORIES.map((cat) => {
 const isActive = selectedCat === cat.id;
 return (
 <motion.button 
 key={cat.id}
 whileHover={{ scale: 1.05 }}
 whileTap={{ scale: 0.95 }}
 onClick={() => {
 if (cat.id === 'all') {
 navigateTo('semua-kategori');
 } else {
 setSelectedCat(cat.id);
 setSelectedSub('all');
 navigateTo('subkategori');
 }
 }}
 className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border shadow-sm shrink-0 snap-center min-w-[85px] max-w-[85px] transition-all duration-300 aspect-square ${isActive ? 'bg-primary border-primary text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-primary/30 hover:bg-slate-50'}`}
 >
 <cat.icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-white' : 'text-slate-500'} />
 <span className={`text-[10px] font-bold tracking-tight text-center leading-tight ${isActive ? 'text-white' : 'text-slate-700'}`}>{cat.name}</span>
 </motion.button>
 );
 })}
 </div>
 </section>

 {/* Mitra Unggulan (Featured Partners) */}
 <section className="mb-10 relative z-20">
 <div className="flex items-center justify-between mb-4">
 <h2 className="text-base font-bold text-slate-800 tracking-tight">Mitra Unggulan</h2>
 <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">Lihat Semua</button>
 </div>
 <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar -mx-5 px-5">
 {[...services.filter(s => s.isHighlight === true), ...Array(10)].slice(0, 10).map((slot, i) => slot ? (
 <motion.div 
 whileHover={{ scale: 1.02, translateY: -4 }}
 whileTap={{ scale: 0.98 }}
 key={`highlight-${slot.id || i}`} 
 className="min-w-[150px] max-w-[150px] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col shrink-0 cursor-pointer snap-start transition-transform group"
 onClick={() => {
 openMitraProfile(slot);
 }}
 >
 <div className="h-28 bg-slate-200 relative flex items-center justify-center overflow-hidden">
 {slot.img || slot.foto ? (
 <img src={slot.img || slot.foto} alt={slot.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
 ) : (
 <ImageIcon size={24} className="text-slate-400 opacity-50" />
 )}
 {/* Heart Icon */}
 <div 
 onClick={(e) => {
 e.stopPropagation();
 toggleFavorite(slot.id);
 }}
 className="absolute top-2 right-2 w-7 h-7 bg-black/40 rounded-full flex items-center justify-center border border-slate-200 hover:bg-black/60 transition-colors"
 >
 <Heart size={14} className={favorites.includes(slot.id) ? "fill-rose-500 text-rose-500" : "text-white"} />
 </div>
 </div>
 
 {/* Highlight Bar */}
 <div className="bg-[#FACC15] py-1 flex items-center justify-center gap-1 shadow-sm">
 <Zap size={12} className="text-black fill-black" />
 <span className="text-[11px] font-bold text-black">Highlight</span>
 </div>
 
 {/* Content Area */}
 <div className="p-2.5 flex flex-col flex-1 bg-white">
 <h3 className="text-[11px] font-bold text-slate-800 line-clamp-1 mb-0.5 group-hover:text-primary transition-colors">{slot.title}</h3>
 <p className="text-[13px] font-black text-primary mb-3">Rp {formatPrice(slot.price)}</p>
 
 <div className="mt-auto">
 <p className="text-[10px] font-bold text-slate-700 line-clamp-1">{slot.mitraName || 'Mitra'}</p>
 <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-1">{slot.subcat || slot.category || 'Keahlian Spesifik'}</p>
 </div>
 </div>
 </motion.div>
 ) : (
 <motion.div 
 whileHover={{ scale: 1.02, translateY: -4 }}
 whileTap={{ scale: 0.98 }}
 key={`highlight-empty-${i}`} 
 className="min-w-[150px] max-w-[150px] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col shrink-0 cursor-pointer snap-start transition-transform group"
 onClick={() => alert('Hubungi admin untuk memesan posisi Highlight ini.')}
 >
 {/* Image Area */}
 <div className="h-28 bg-slate-200/50 relative overflow-hidden">
 <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-100/50 ">
 <ImageIcon size={24} className="mb-1 opacity-50 group-hover:scale-110 transition-transform" />
 <span className="text-[9px] font-medium px-2 text-center">Space Iklan Tersedia</span>
 </div>
 {/* Heart Icon */}
 <div className="absolute top-2 right-2 w-7 h-7 bg-black/20 rounded-full flex items-center justify-center border border-slate-200">
 <Heart size={14} className="text-white/50" />
 </div>
 </div>
 
 {/* Highlight Bar */}
 <div className="bg-slate-200/80 py-1 flex items-center justify-center gap-1 ">
 <Zap size={12} className="text-slate-400" />
 <span className="text-[11px] font-bold text-slate-500">Highlight</span>
 </div>
 
 {/* Content Area */}
 <div className="p-2.5 flex flex-col flex-1 bg-white/30">
 <h3 className="text-[11px] text-slate-600 line-clamp-1 mb-0.5 group-hover:text-slate-800 transition-colors">Pesan posisi ini</h3>
 <p className="text-[13px] font-black text-slate-400 mb-3">Rp ---</p>
 
 <div className="mt-auto">
 <p className="text-[10px] font-bold text-slate-500 line-clamp-1">Mitra Unggulan</p>
 <p className="text-[9px] text-slate-400 mt-0.5">Tersedia</p>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </section>

 {/* Partner JasaMitra */}
 <PartnerJasaMitra />

 {/* Home Service List (Recommendations Only) */}
 <section className="mb-8 relative z-20">
 <div className="flex items-center justify-between mb-4">
 <h2 className="text-lg font-bold text-slate-800">Rekomendasi Jasa</h2>
 <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50 transition-colors">
 <SlidersHorizontal size={14} />
 Filter
 </button>
 </div>
 <div className="grid grid-cols-2 gap-3">
 {filteredServices.length > 0 ? filteredServices.slice(0, 6).map((service) => (
 <motion.div 
 key={service.id}
 whileHover={{ scale: 1.02, translateY: -4 }}
 whileTap={{ scale: 0.98 }}
 className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden transition-transform cursor-pointer group"
 onClick={() => {
 if (service.mitraId === user?.uid) {
 navigateTo('iklan-saya');
 } else {
 openMitraProfile(service);
 }
 }}
 >
 <div className="relative aspect-square w-full overflow-hidden">
 <img 
 src={service.img || undefined} 
 alt={service.title}
 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
 referrerPolicy="no-referrer"
 />
 <div className="absolute top-2 right-2 bg-white px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm border border-slate-200">
 <Star size={10} className="text-accent fill-accent" />
 <span className="text-[9px] font-bold text-slate-700">{service.rating}</span>
 </div>
 </div>
 <div className="p-3 flex flex-col flex-1 bg-white">
 <h3 className="text-[11px] font-bold text-slate-800 line-clamp-2 leading-snug mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
 <div className="mt-auto flex flex-col gap-1.5">
 <span className="text-sm font-black text-primary">Rp {formatPrice(service.price)}</span>
 <div className="flex items-center gap-1 text-slate-400 border-t border-slate-200 pt-2">
 <ShieldCheck size={12} className="text-blue-500 shrink-0" />
 <span className="text-[9px] font-bold truncate">{service.mitraName || 'Mitra Jasa'}</span>
 </div>
 </div>
 </div>
 </motion.div>
 )) : (
 <div className="col-span-2 text-center py-10 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
 <p className="text-xs text-slate-400 italic">Tidak ada jasa di lokasi ini.</p>
 </div>
 )}
 </div>
 </section>
 </main>
 </motion.div>
 );
};
