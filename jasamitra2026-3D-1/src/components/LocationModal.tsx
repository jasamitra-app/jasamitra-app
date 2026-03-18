import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, X, Search, MapPin, ChevronRight } from 'lucide-react';
import { PROVINCES, CITIES, DISTRICTS } from '../constants';

export const LocationModal = ({ 
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
 className="fixed inset-0 z-[2000] bg-white flex flex-col "
 >
 {/* Header */}
 <div className="flex items-center px-4 py-4 border-b border-slate-200 bg-white shadow-sm z-10 ">
 <motion.button 
 whileHover={{ scale: 1.05, translateY: -2 }}
 whileTap={{ scale: 0.9 }}
 onClick={handleBack} 
 className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 transition-colors "
 >
 {selectedCity ? <ArrowLeft size={24} className="text-slate-600" /> : <X size={24} className="text-slate-600" />}
 </motion.button>
 <h2 className="ml-4 text-xl font-bold text-slate-800">
 {!selectedCity ? 'Pilih Kota/Kabupaten' : `Kecamatan di ${selectedCity}`}
 </h2>
 </div>

 {/* Search Bar */}
 <div className="px-6 py-4 ">
 <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-3 focus-within:border-primary/30 transition-all shadow-sm">
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

 <div className="flex-1 overflow-y-auto ">
 {!selectedCity && (
 <>
 {/* Gunakan Lokasi Saat Ini */}
 <motion.button 
 whileHover={{ scale: 1.02, translateY: -1 }}
 whileTap={{ scale: 0.98 }}
 onClick={onDetectLocation}
 className="w-full px-6 py-4 flex items-start gap-4 hover:bg-white/60 transition-colors border-b border-slate-200 group "
 >
 <div className="mt-1 p-2 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-sm border border-slate-200">
 <MapPin size={20} />
 </div>
 <div className="text-left">
 <h3 className="font-bold text-primary">Gunakan lokasi saat ini</h3>
 <p className="text-xs text-slate-500 font-medium mt-0.5">{currentAddress || 'Mendeteksi lokasi...'}</p>
 </div>
 </motion.button>

 {/* Semua Lokasi */}
 <motion.button 
 whileHover={{ scale: 1.02, translateY: -1 }}
 whileTap={{ scale: 0.98 }}
 onClick={() => onSelect('Indonesia')}
 className="w-full px-6 py-4 flex items-start gap-4 hover:bg-white/60 transition-colors border-b border-slate-200 group "
 >
 <div className="mt-1 p-2 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-sm border border-slate-200">
 <MapPin size={20} />
 </div>
 <div className="text-left">
 <h3 className="font-bold text-primary">Semua Lokasi</h3>
 <p className="text-xs text-slate-500 font-medium mt-0.5">Tampilkan jasa dari seluruh Indonesia</p>
 </div>
 </motion.button>

 {/* Saat Ini Digunakan */}
 <div className="px-6 py-6 ">
 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Saat Ini Digunakan</h4>
 <div className="space-y-4">
 {recentLocations.map((loc, i) => (
 <motion.button 
 whileHover={{ scale: 1.02, x: 5 }}
 key={i} 
 onClick={() => onSelect(loc)}
 className="w-full flex items-center gap-4 text-slate-700 hover:text-primary transition-colors "
 >
 <MapPin size={18} className="text-slate-400" />
 <span className="text-sm font-bold">{loc}</span>
 </motion.button>
 ))}
 </div>
 </div>

 <div className="h-2 bg-white/30 border-y border-slate-200" />
 </>
 )}

 <div className="px-6 py-6 pb-24 ">
 {!selectedCity && (
 <>
 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Pilih Kota/Kabupaten</h4>
 <div className="space-y-1">
 {filteredCities.map((city, i) => (
 <motion.button 
 whileHover={{ scale: 1.02, x: 5 }}
 key={i}
 onClick={() => {
 setSelectedCity(city);
 setSearch('');
 }}
 className="w-full flex items-center justify-between py-4 border-b border-slate-200 group hover:bg-white/60 px-2 -mx-2 rounded-lg transition-colors "
 >
 <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">{city}</span>
 <ChevronRight size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
 </motion.button>
 ))}
 </div>
 </>
 )}

 {selectedCity && (
 <>
 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Kecamatan di {selectedCity}</h4>
 <div className="space-y-1">
 {filteredDistricts.map((district, i) => (
 <motion.button 
 whileHover={{ scale: 1.02, x: 5 }}
 key={i}
 onClick={() => onSelect(`${district}, ${selectedCity}`)}
 className="w-full flex items-center justify-between py-4 border-b border-slate-200 group hover:bg-white/60 px-2 -mx-2 rounded-lg transition-colors "
 >
 <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">{district}</span>
 <ChevronRight size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
 </motion.button>
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
