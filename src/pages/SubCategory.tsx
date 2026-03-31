import React from 'react';
import { motion } from 'motion/react';
import { LayoutGrid, Search, Star, Heart, SlidersHorizontal } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

interface SubCategoryProps {
 selectedCat: string;
 selectedSub: string;
 CATEGORIES: any[];
 SUB_CATEGORIES: any;
 filteredServices: any[];
 user: any;
 setSelectedSub: (sub: string) => void;
 handleBack: () => void;
 navigateTo: (page: string) => void;
 openMitraProfile: (service: any) => void;
 setBookingService: (service: any) => void;
 formatPrice: (price: number) => string;
 favorites: string[];
 toggleFavorite: (id: string) => void;
}

export const SubCategory: React.FC<SubCategoryProps> = ({
 selectedCat,
 selectedSub,
 CATEGORIES,
 SUB_CATEGORIES,
 filteredServices,
 user,
 setSelectedSub,
 handleBack,
 navigateTo,
 openMitraProfile,
 setBookingService,
 formatPrice,
 favorites,
 toggleFavorite
}) => {
 return (
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
 className={`px-4 py-2 rounded-[12px] flex items-center gap-2 transition-all whitespace-nowrap font-bold text-[10px] ${selectedSub === 'all' ? 'bg-primary text-white shadow-[0_4px_12px_-4px_rgba(0,51,102,0.3)]' : 'bg-white text-slate-500 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:bg-slate-50'}`}
 >
 <LayoutGrid size={14} />
 Semua
 </button>
 {SUB_CATEGORIES[selectedCat].map((sub: any) => (
 <button 
 key={sub.id}
 onClick={() => setSelectedSub(sub.id)}
 className={`px-4 py-2 rounded-[12px] flex items-center gap-2 transition-all whitespace-nowrap font-bold text-[10px] ${selectedSub === sub.id ? 'bg-primary text-white shadow-[0_4px_12px_-4px_rgba(0,51,102,0.3)]' : 'bg-white text-slate-500 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:bg-slate-50'}`}
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
 Daftar Jasa {selectedSub === 'all' ? '' : SUB_CATEGORIES[selectedCat]?.find((s: any) => s.id === selectedSub)?.nama}
 </h2>
 <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50 transition-colors">
 <SlidersHorizontal size={14} />
 Filter
 </button>
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
 <p className="text-xs text-slate-300 mt-1">Coba pilih subkategori lainnya</p>
 </div>
 )}
 </div>
 </section>
 </main>
 </motion.div>
 );
};
