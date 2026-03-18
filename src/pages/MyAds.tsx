import React from 'react';
import { motion } from 'motion/react';
import { Edit3, PauseCircle, PlayCircle, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

interface MyAdsProps {
 handleBack: () => void;
 myAds: any[];
 CATEGORIES: any[];
 SUB_CATEGORIES: any;
 formatPrice: (price: number | string) => string;
 handleEditAd: (ad: any) => void;
 handleToggleAdStatus: (id: string, currentStatus: string) => void;
 handleDeleteAd: (id: string) => void;
}

const MyAds: React.FC<MyAdsProps> = ({
 handleBack,
 myAds,
 CATEGORIES,
 SUB_CATEGORIES,
 formatPrice,
 handleEditAd,
 handleToggleAdStatus,
 handleDeleteAd
}) => {
 return (
 <motion.div key="iklan-saya" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="min-h-screen bg-slate-50/50 relative overflow-hidden perspective-[1000px]">
 {/* 3D Background Elements */}
 <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent -skew-y-6 transform-origin-top-left -z-10" />
 <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
 <div className="absolute top-40 -left-20 w-48 h-48 bg-accent/20 rounded-full blur-3xl -z-10" />

 <PageHeader title="Iklan Saya" subtitle="Kelola iklan jasa Anda" onBack={handleBack} />
 <main className="px-6 pt-6 space-y-6 pb-24">
 <div className="space-y-4">
 {myAds.map(ad => (
 <div key={ad.id} className={`bg-white p-4 rounded-[32px] shadow-sm border border-slate-200 ${ad.status === 'nonaktif' ? 'opacity-60 grayscale' : ''}`}>
 <div className="flex gap-4">
 <img src={ad.img || undefined} className="w-20 h-20 rounded-2xl object-cover shadow-sm border border-slate-200" />
 <div className="flex-1">
 <div className="flex justify-between items-start">
 <h3 className="text-sm font-bold text-slate-800">{ad.title}</h3>
 <span className={`text-[8px] font-extrabold px-2 py-1 rounded-full uppercase tracking-widest shadow-sm border border-slate-200 ${ad.status === 'aktif' ? 'bg-primary/10 text-primary' : 'bg-slate-100/80 text-slate-500'}`}>{ad.status}</span>
 </div>
 <p className="text-[10px] font-bold text-slate-400 mt-1">
 {CATEGORIES.find(c => c.id === ad.cat)?.name} • {SUB_CATEGORIES[ad.cat]?.find((s: any) => s.id === ad.subcat)?.nama || ad.subcat}
 </p>
 <p className="text-xs font-extrabold text-primary mt-2">Rp {formatPrice(ad.price)}</p>
 </div>
 </div>
 <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
 <motion.button 
 whileHover={{ scale: 1.05, translateY: -2 }}
 whileTap={{ scale: 0.95 }}
 onClick={() => handleEditAd(ad)}
 className="flex-1 bg-primary/10 text-primary p-2 rounded-xl shadow-sm border border-slate-200 "
 >
 <Edit3 size={16} className="mx-auto" />
 </motion.button>
 <motion.button 
 whileHover={{ scale: 1.05, translateY: -2 }}
 whileTap={{ scale: 0.95 }}
 onClick={() => handleToggleAdStatus(ad.id, ad.status)}
 className={`flex-1 p-2 rounded-xl shadow-sm border border-slate-200 ${ad.status === 'aktif' ? 'bg-accent/10 text-accent' : 'bg-emerald-50/80 text-emerald-600'}`}
 >
 {ad.status === 'aktif' ? <PauseCircle size={16} className="mx-auto" /> : <PlayCircle size={16} className="mx-auto" />}
 </motion.button>
 <motion.button 
 whileHover={{ scale: 1.05, translateY: -2 }}
 whileTap={{ scale: 0.95 }}
 onClick={() => handleDeleteAd(ad.id)}
 className="flex-1 bg-rose-50/80 text-rose-600 p-2 rounded-xl shadow-sm border border-slate-200 "
 >
 <Trash2 size={16} className="mx-auto" />
 </motion.button>
 </div>
 </div>
 ))}
 </div>
 </main>
 </motion.div>
 );
};

export default MyAds;
