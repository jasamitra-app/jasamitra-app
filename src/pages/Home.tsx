import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, ShieldCheck, ChevronRight, Bell, User, Menu, MessageSquare, ClipboardList, X } from 'lucide-react';
import { getActiveAds } from '../services/adService';
import { Navbar } from '../components/Navbar';

interface HomeProps {
  userRole: 'tamu' | 'mitra' | 'admin' | null;
  unreadCount: number;
  notifications: any[];
  banners: any[];
  featuredMitras: any[];
  onNavigate: (page: string) => void;
  onOpenMitraProfile: (service: any) => void;
  onMarkNotifsAsRead: () => void;
}

export const Home: React.FC<HomeProps> = ({
  userRole,
  unreadCount,
  notifications,
  banners,
  featuredMitras,
  onNavigate,
  onOpenMitraProfile,
  onMarkNotifsAsRead
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [services, setServices] = useState<any[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  useEffect(() => {
    // Real-time listener for ads
    const unsubscribe = getActiveAds((ads) => {
      setServices(ads);
    });
    return () => unsubscribe();
  }, []);

  const filteredServices = services.filter(s => {
    // Loose filter: only active ads
    if (s.status !== 'aktif' && s.status !== 'active') return false;
    
    const title = s.title || '';
    const adCat = (s.category || s.cat || '').toLowerCase();
    
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCat === 'all' || adCat === selectedCat.toLowerCase();
    
    return matchesSearch && matchesCat;
  });

  const formatPrice = (price: any) => {
    if (!price) return '0';
    const num = typeof price === 'string' ? parseInt(price.replace(/\D/g, ''), 10) : price;
    return isNaN(num) ? '0' : num.toLocaleString('id-ID');
  };

  const CATEGORIES = [
    { id: 'all', name: 'Semua', icon: '🌟' },
    { id: 'Tukang Bangunan', name: 'Bangunan', icon: '🏗️' },
    { id: 'Tukang Listrik', name: 'Listrik', icon: '⚡' },
    { id: 'Tukang Ledeng', name: 'Ledeng', icon: '🚰' },
    { id: 'Tukang AC', name: 'Service AC', icon: '❄️' },
    { id: 'Tukang Kebun', name: 'Kebun', icon: '🌿' },
    { id: 'Tukang Cat', name: 'Cat', icon: '🎨' },
    { id: 'Tukang Kayu', name: 'Kayu', icon: '🪚' },
    { id: 'Tukang Las', name: 'Las', icon: '🔥' },
    { id: 'Tukang Kunci', name: 'Kunci', icon: '🔑' },
    { id: 'Tukang Elektronik', name: 'Elektronik', icon: '📺' },
    { id: 'Tukang Pipa', name: 'Pipa', icon: '🔧' },
    { id: 'Tukang Atap', name: 'Atap', icon: '🏠' }
  ];

  return (
    <motion.div key="beranda" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pb-24">
      <Navbar 
        userRole={userRole} 
        unreadCount={unreadCount} 
        onNotifClick={() => setShowNotifDropdown(!showNotifDropdown)} 
        onProfileClick={() => onNavigate('akun')} 
      />

      {showNotifDropdown && (
        <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm" onClick={() => setShowNotifDropdown(false)}>
          <div className="absolute top-20 right-6 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[60vh]" onClick={e => e.stopPropagation()}>
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
                      if (n.type === 'chat') onNavigate('chat');
                      if (n.type === 'order') onNavigate('pesanan');
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
                    </div>
                  </div>
                ))
              )}
            </div>
            {notifications.length > 0 && (
              <div className="p-4 border-t border-slate-100 text-center">
                <button 
                  onClick={onMarkNotifsAsRead}
                  className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                >
                  Tandai Semua Dibaca
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <main className="px-6 pt-6 space-y-8">
        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
            <Search size={22} strokeWidth={2.5} />
          </div>
          <input 
            type="text" 
            placeholder="Cari jasa yang Anda butuhkan..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-2 border-slate-100 rounded-[32px] py-5 pl-14 pr-6 text-sm font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
          />
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Kategori Layanan</h2>
          </div>
          <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-4 -mx-6 px-6 snap-x">
            {CATEGORIES.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-[32px] min-w-[100px] snap-start transition-all duration-300 ${
                  selectedCat === cat.id 
                    ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-105' 
                    : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50 hover:scale-105'
                }`}
              >
                <span className="text-3xl mb-3 filter drop-shadow-sm">{cat.icon}</span>
                <span className={`text-[11px] font-black tracking-wide ${selectedCat === cat.id ? 'text-white' : 'text-slate-700'}`}>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Ads List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Rekomendasi Jasa</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {filteredServices.length > 0 ? filteredServices.map((service) => (
              <div 
                key={service.id} 
                className="bg-white rounded-[40px] p-4 shadow-sm border border-slate-100 flex gap-4 cursor-pointer hover:shadow-md transition-all group"
                onClick={() => onOpenMitraProfile(service)}
              >
                <div className="relative w-28 h-28 shrink-0">
                  <img src={service.img} alt={service.title} className="w-full h-full object-cover rounded-[28px] shadow-inner" />
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-xl flex items-center gap-1 shadow-sm">
                    <Star size={10} className="text-amber-500 fill-amber-500" />
                    <span className="text-[10px] font-black text-slate-800">{service.rating || 'Baru'}</span>
                  </div>
                </div>
                <div className="flex-1 py-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-lg">{service.cat}</span>
                    </div>
                    <h3 className="font-black text-slate-800 text-sm leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 truncate">
                      <MapPin size={12} className="text-primary shrink-0" /> {service.location || 'Bandung Raya'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-black text-primary text-base">Rp {formatPrice(service.price)}</p>
                    <button className="w-8 h-8 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <ChevronRight size={16} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-12 bg-white rounded-[40px] border border-slate-100 border-dashed">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
                  <Search size={32} />
                </div>
                <h3 className="text-sm font-black text-slate-800 mb-1">Tidak ada jasa ditemukan</h3>
                <p className="text-xs font-medium text-slate-400">Coba gunakan kata kunci lain</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </motion.div>
  );
};
