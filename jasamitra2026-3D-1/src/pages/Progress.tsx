import React from 'react';
import { motion } from 'motion/react';
import { Clock, PlayCircle, Wrench, CheckCircle2, Star } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ProgressProps {
 user: any;
 transactions: any[];
 setReviewTransaction: (t: any) => void;
 setReviewRating: (rating: number) => void;
 setReviewText: (text: string) => void;
 setShowReviewModal: (show: boolean) => void;
}

const Progress: React.FC<ProgressProps> = ({
 user,
 transactions,
 setReviewTransaction,
 setReviewRating,
 setReviewText,
 setShowReviewModal
}) => {
 return (
 <motion.div 
 key="layanan"
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 1.05 }}
 className="min-h-screen bg-slate-50/50 relative overflow-hidden perspective-[1000px]"
 >
 {/* 3D Background Elements */}
 <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
 <div className="absolute top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-[#003366]/5 to-transparent blur-3xl" />
 <div className="absolute top-[60%] -right-[10%] w-[30%] h-[30%] rounded-full bg-gradient-to-tl from-[#F27D26]/5 to-transparent blur-3xl" />
 </div>

 <div className="relative z-10">
 <PageHeader title="Progress Pekerjaan" subtitle="Pantau status layanan secara real-time" />
 <main className="px-6 pt-6 pb-32">
 <div className="grid grid-cols-2 gap-4 mb-6">
 <motion.div 
 whileHover={{ scale: 1.02, translateY: -2 }}
 className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex flex-col gap-1 transition-transform"
 >
 <span className="text-3xl font-extrabold text-slate-800">
 {transactions.filter(t => (t.customerID === user?.uid || t.mitraID === user?.uid) && t.status === 'paid').length}
 </span>
 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aktif</span>
 </motion.div>
 <motion.div 
 whileHover={{ scale: 1.02, translateY: -2 }}
 className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex flex-col gap-1 transition-transform"
 >
 <span className="text-3xl font-extrabold text-accent">
 {transactions.filter(t => (t.customerID === user?.uid || t.mitraID === user?.uid) && t.status === 'completed').length}
 </span>
 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Selesai</span>
 </motion.div>
 </div>

 {/* Filter Status */}
 <div className="flex gap-3 overflow-x-auto pb-4 mb-4 hide-scrollbar">
 {['Semua', 'Dalam Proses', 'Selesai', 'Dibatalkan'].map((f, i) => (
 <button 
 key={f}
 className={`px-5 py-2.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all active:scale-95 ${i === 0 ? 'bg-slate-900 text-white shadow-sm hover:translate-y-[-2px]' : 'bg-white text-slate-500 border border-slate-200 shadow-sm hover:translate-y-[-2px]'}`}
 >
 {f}
 </button>
 ))}
 </div>

 <div className="space-y-4">
 {transactions.filter(t => (t.customerID === user?.uid || t.mitraID === user?.uid) && (t.status === 'paid' || t.status === 'in_progress' || t.status === 'completed')).length === 0 ? (
 <div className="flex flex-col items-center justify-center py-12 opacity-40 ">
 <motion.div 
 animate={{ y: [-5, 5, -5] }}
 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
 className="w-24 h-24 bg-white rounded-[32px] shadow-sm border border-slate-200 flex items-center justify-center mb-6"
 >
 <Clock size={40} className="text-slate-400" />
 </motion.div>
 <h3 className="text-base font-black text-slate-800 mb-2">Belum Ada Progress</h3>
 <p className="text-xs font-medium text-slate-500 text-center max-w-[220px] leading-relaxed">
 Pesanan jasa Anda akan muncul di sini setelah Anda melakukan pemesanan.
 </p>
 </div>
 ) : (
 transactions.filter(t => (t.customerID === user?.uid || t.mitraID === user?.uid) && (t.status === 'paid' || t.status === 'in_progress' || t.status === 'completed')).map((t, index) => (
 <motion.div 
 key={t.id} 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: index * 0.1 }}
 whileHover={{ scale: 1.01, translateY: -2 }}
 className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-200 transition-transform space-y-4"
 >
 <div className="flex justify-between items-start">
 <div>
 <h3 className="text-sm font-bold text-slate-800">{t.serviceTitle || 'Layanan Jasa'}</h3>
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
 {t.customerID === user?.uid ? `Mitra: ${t.mitraID}` : `Pelanggan: ${t.customerName || 'Pelanggan'}`}
 </p>
 </div>
 <span className={`text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm ${
 t.status === 'completed' ? 'bg-accent/10 text-accent border border-accent/20' : 
 t.status === 'in_progress' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
 }`}>
 {t.status === 'completed' ? 'Selesai' : 
 t.status === 'in_progress' ? 'Dikerjakan' : 'Menunggu Mitra'}
 </span>
 </div>
 <div className="bg-slate-50/50 p-4 rounded-2xl flex justify-between items-center border border-slate-100/50">
 <div>
 <p className="text-[9px] font-bold text-slate-400 uppercase">Total Deal</p>
 <p className="text-sm font-extrabold text-primary">Rp {t.totalPrice?.toLocaleString()}</p>
 </div>
 <div className="text-right">
 <p className="text-[9px] font-bold text-slate-400 uppercase">Status Pembayaran</p>
 <p className="text-[10px] font-bold text-emerald-600">DP Lunas</p>
 </div>
 </div>
 
 {t.status === 'paid' && t.customerID === user?.uid && (
 <div className="space-y-3 mt-4">
 <div className="bg-amber-50/80 border border-amber-200/50 p-3 rounded-xl flex items-start gap-3 ">
 <Clock size={16} className="text-amber-500 shrink-0 mt-0.5" />
 <div>
 <p className="text-xs font-bold text-amber-800">Mitra akan segera menghubungi anda</p>
 <p className="text-[10px] text-amber-600 mt-1">Silahkan klik tombol di bawah kalau mitra sudah datang dan mulai bekerja.</p>
 </div>
 </div>
 <motion.button 
 whileTap={{ scale: 0.95 }}
 onClick={async () => {
 if (window.confirm('Apakah mitra sudah mulai bekerja?')) {
 try {
 await updateDoc(doc(db, 'transactions', t.id), {
 status: 'in_progress',
 updatedAt: serverTimestamp()
 });
 } catch (e) {
 console.error(e);
 alert('Gagal mengupdate pesanan.');
 }
 }
 }}
 className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-2 "
 >
 <PlayCircle size={16} /> Mulai Pekerjaan
 </motion.button>
 </div>
 )}

 {t.status === 'in_progress' && t.customerID === user?.uid && (
 <div className="space-y-3 mt-4">
 <div className="bg-blue-50/80 border border-blue-200/50 p-3 rounded-xl flex items-start gap-3 ">
 <Wrench size={16} className="text-blue-500 shrink-0 mt-0.5" />
 <div>
 <p className="text-xs font-bold text-blue-800">Pekerjaan Sedang Berlangsung</p>
 <p className="text-[10px] text-blue-600 mt-1">Silahkan klik tombol di bawah jika pekerjaan telah selesai.</p>
 </div>
 </div>
 <motion.button 
 whileTap={{ scale: 0.95 }}
 onClick={async () => {
 if (window.confirm('Apakah pekerjaan sudah selesai?')) {
 try {
 await updateDoc(doc(db, 'transactions', t.id), {
 status: 'completed',
 updatedAt: serverTimestamp()
 });
 alert('Terima kasih! Pesanan telah diselesaikan.');
 setReviewTransaction(t);
 setReviewRating(5);
 setReviewText('');
 setShowReviewModal(true);
 } catch (e) {
 console.error(e);
 alert('Gagal menyelesaikan pesanan.');
 }
 }
 }}
 className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-2 "
 >
 <CheckCircle2 size={16} /> Pekerjaan Selesai
 </motion.button>
 </div>
 )}

 {t.status === 'completed' && t.customerID === user?.uid && !t.isReviewed && (
 <div className="space-y-3 mt-4">
 <motion.button 
 whileTap={{ scale: 0.95 }}
 onClick={() => {
 setReviewTransaction(t);
 setReviewRating(5);
 setReviewText('');
 setShowReviewModal(true);
 }}
 className="w-full bg-accent text-white py-3 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-2 "
 >
 <Star size={16} /> Beri Ulasan
 </motion.button>
 </div>
 )}
 </motion.div>
 ))
 )}
 </div>
 </main>
 </div>
 </motion.div>
 );
};

export default Progress;
