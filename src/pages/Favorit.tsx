import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Heart, Star } from 'lucide-react';
import { Page } from '../types';

interface FavoritProps {
  favorites: string[];
  services: any[];
  toggleFavorite: (id: string) => void;
  navigateTo: (page: Page) => void;
  handleBack: () => void;
  openMitraProfile: (service: any) => void;
  user: any;
}

export const Favorit: React.FC<FavoritProps> = ({
  favorites,
  services,
  toggleFavorite,
  navigateTo,
  handleBack,
  openMitraProfile,
  user
}) => {
  const favoriteServices = services.filter(s => favorites.includes(s.id));

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
        <h1 className="text-lg font-black text-slate-800 tracking-tight">Favorit Saya</h1>
      </header>

      <div className="p-5">
        {favoriteServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <Heart size={40} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Belum ada favorit</h3>
            <p className="text-sm text-slate-500 max-w-[250px] mx-auto">
              Anda belum menambahkan layanan apapun ke daftar favorit.
            </p>
            <button 
              onClick={() => navigateTo('beranda')}
              className="mt-8 px-6 py-3 bg-primary text-white rounded-full font-bold text-sm shadow-sm"
            >
              Cari Layanan
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {favoriteServices.map((service) => (
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
                  <Heart size={16} className="fill-rose-500 text-rose-500" />
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
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-slate-200 overflow-hidden">
                        {service.mitraFoto ? (
                          <img src={service.mitraFoto} alt={service.mitraName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full bg-primary/10 flex items-center justify-center text-[8px] font-bold text-primary">
                            {service.mitraName?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-medium text-slate-600 line-clamp-1">{service.mitraName}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
