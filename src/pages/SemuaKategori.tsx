import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Star, Heart, Search } from 'lucide-react';

interface SemuaKategoriProps {
  CATEGORIES: any[];
  setSelectedCat: (cat: string) => void;
  setSelectedSub: (sub: string) => void;
  navigateTo: (page: any) => void;
  handleBack: () => void;
  filteredServices: any[];
  openMitraProfile: (service: any) => void;
  formatPrice: (price: number) => string;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  user: any;
  setBookingService: (service: any) => void;
}

export const SemuaKategori: React.FC<SemuaKategoriProps> = ({
  CATEGORIES,
  setSelectedCat,
  setSelectedSub,
  navigateTo,
  handleBack,
  filteredServices,
  openMitraProfile,
  formatPrice,
  favorites,
  toggleFavorite,
  user,
  setBookingService
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-slate-50 pb-24"
    >
      <header className="bg-white pt-12 pb-4 px-6 sticky top-0 z-50 border-b border-slate-100 shadow-sm flex items-center gap-4">
        <button onClick={handleBack} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-black text-slate-800 tracking-tight">Semua Kategori & Jasa</h1>
      </header>

      <div className="p-5">
        <div className="flex gap-3 overflow-x-auto pb-4 mb-4 hide-scrollbar -mx-5 px-5 snap-x snap-mandatory">
          {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
            <motion.button 
              key={cat.id}
              whileHover={{ scale: 1.05, translateY: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedCat(cat.id);
                setSelectedSub('all');
                navigateTo('subkategori');
              }}
              className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-[14px] shrink-0 snap-center min-w-[68px] max-w-[68px] transition-all duration-300 aspect-square bg-white text-slate-600 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] hover:bg-slate-50"
            >
              <cat.icon size={20} strokeWidth={2} className="text-slate-500" />
              <span className="text-[8px] font-bold tracking-tight text-center leading-tight text-slate-700">{cat.name}</span>
            </motion.button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">Semua Iklan Mitra</h2>
        </div>
        
        <div className="space-y-4">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <motion.div 
                key={service.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex gap-4 relative"
              >
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(service.id);
                  }}
                  className="absolute top-4 right-4 w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer z-10"
                >
                  <Heart size={16} className={favorites.includes(service.id) ? "fill-rose-500 text-rose-500" : "text-slate-400"} />
                </div>
                <img 
                  src={service.img || undefined} 
                  alt={service.title}
                  className="w-24 h-24 rounded-2xl object-cover shadow-sm"
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
                        className="bg-slate-400 text-white text-[10px] font-bold px-4 py-2 rounded-xl shadow-sm shadow-slate-200 active:scale-95 transition-transform"
                      >
                        IKLAN SAYA
                      </button>
                    ) : (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setBookingService(service); }}
                        className="bg-primary text-white text-[10px] font-bold px-4 py-2 rounded-xl shadow-sm active:scale-95 transition-transform"
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
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
