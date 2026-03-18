import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Star, User, CheckCircle2, Phone, AlertTriangle, Send, ChevronRight } from 'lucide-react';

interface MitraProfileProps {
 selectedMitra: any;
 mitraReviews: any[];
 transactions: any[];
 user: any;
 onBack: () => void;
 onChat: (mitraId: string, mitraName: string) => void;
}

export const MitraProfile: React.FC<MitraProfileProps> = ({
 selectedMitra,
 mitraReviews,
 transactions,
 user,
 onBack,
 onChat
}) => {
 if (!selectedMitra) return null;

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
 <motion.div key="profil-mitra" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
 <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm px-6 py-4 flex items-center gap-4">
 <button onClick={onBack} className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
 <ChevronRight size={20} className="rotate-180" />
 </button>
 <div>
 <h1 className="text-lg font-black text-slate-800 tracking-tight">Profil Mitra</h1>
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Informasi lengkap penyedia jasa</p>
 </div>
 </header>

 <main className="px-6 pt-6 pb-12 space-y-6">
 <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 text-center ">
 <div className="relative w-24 h-24 mx-auto mb-4">
 <img src={selectedMitra.foto} className="w-full h-full rounded-full border-4 border-primary shadow-sm object-cover" />
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
 className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm "
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
 </div>

 <div className="bg-white p-6 rounded-[40px] shadow-sm border border-slate-100 space-y-4">
 <h3 className="text-sm font-bold text-primary flex items-center gap-2"><Star size={18} /> Review dari Pelanggan</h3>
 {mitraReviews && mitraReviews.length > 0 ? (
 <div className="space-y-4">
 {mitraReviews.map((review: any) => (
 <div key={review.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
 <div className="flex items-center gap-2 mb-2">
 <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold text-xs">
 {review.customerName ? review.customerName.charAt(0).toUpperCase() : 'P'}
 </div>
 <div>
 <p className="text-xs font-bold text-slate-800">{review.customerName || 'Pelanggan'}</p>
 <div className="flex items-center gap-1">
 {[...Array(5)].map((_, i) => (
 <Star key={i} size={10} className={i < (review.rating || 5) ? "text-accent fill-accent" : "text-slate-200"} />
 ))}
 </div>
 </div>
 </div>
 <p className="text-xs text-slate-600 leading-relaxed">{review.comment || 'Tidak ada komentar.'}</p>
 </div>
 ))}
 </div>
 ) : (
 <div className="text-center py-6 bg-slate-50 rounded-2xl">
 <p className="text-xs font-medium text-slate-400">Belum ada review dari pelanggan.</p>
 </div>
 )}
 </div>

 <div className="flex gap-4">
 <button 
 onClick={() => onChat(selectedMitra.id.toString(), selectedMitra.name)}
 className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-sm flex items-center justify-center gap-2"
 >
 <Send size={18} /> Chat Mitra
 </button>
 <button onClick={onBack} className="flex-1 bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl font-bold text-sm">Kembali</button>
 </div>
 </main>
 </motion.div>
 );
};
