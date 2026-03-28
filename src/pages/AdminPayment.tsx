import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck, User, Search } from 'lucide-react';

interface AdminPaymentProps {
 handleBack: () => void;
 pendingPayments: any[];
 setSelectedPaymentForView: (payment: any) => void;
 verifyPayment: (payment: any) => void;
 setShowRejectModal: (show: boolean) => void;
}

const AdminPayment: React.FC<AdminPaymentProps> = ({
 handleBack,
 pendingPayments,
 setSelectedPaymentForView,
 verifyPayment,
 setShowRejectModal
}) => {
 return (
 <motion.div 
 key="admin-pembayaran"
 initial={{ opacity: 0, x: 100 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -100 }}
 className="min-h-screen bg-slate-50 pb-24"
 >
 <header className="bg-white p-6 pt-12 border-b border-slate-100 flex items-center gap-4 sticky top-0 z-10">
 <button onClick={handleBack} className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-600">
 <ArrowLeft size={24} />
 </button>
 <h2 className="text-xl font-black text-slate-800 tracking-tight">Verifikasi Pembayaran</h2>
 </header>

 <main className="p-6 space-y-6">
 {pendingPayments.length === 0 ? (
 <div className="flex flex-col items-center justify-center py-20 opacity-30">
 <ShieldCheck size={64} className="mb-4" />
 <p className="text-sm font-bold">Tidak ada pembayaran pending</p>
 </div>
 ) : (
 pendingPayments.map((p) => (
 <motion.div 
 key={p.id}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 overflow-hidden"
 >
 <div className="flex items-center justify-between mb-6">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
 <User size={20} />
 </div>
 <div>
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.type === 'highlight_ad' ? 'Mitra' : 'Pelanggan'}</p>
 <p className="text-sm font-black text-slate-800">{p.userName}</p>
 </div>
 </div>
 <div className="text-right">
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
 <span className="bg-amber-50 text-amber-600 text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-wider">Pending</span>
 </div>
 </div>

 {p.type === 'highlight_ad' ? (
   <div className="bg-amber-50 p-4 rounded-2xl mb-6 border border-amber-100">
     <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest mb-1">Jenis Pembayaran</p>
     <p className="text-sm font-black text-slate-800">Daftar Mitra Unggulan</p>
     <p className="text-xs font-bold text-emerald-600 mt-1">Rp {p.amount?.toLocaleString()}</p>
   </div>
 ) : (
   <div className="grid grid-cols-2 gap-4 mb-6">
   <div className="bg-slate-50 p-4 rounded-2xl">
   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nominal Deal</p>
   <p className="text-sm font-black text-slate-800">Rp {p.dealAmount?.toLocaleString()}</p>
   </div>
   <div className="bg-slate-50 p-4 rounded-2xl">
   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">DP 10% (Dibayar)</p>
   <p className="text-sm font-black text-emerald-600">Rp {p.dpAmount?.toLocaleString()}</p>
   </div>
   </div>
 )}

 <div className="mb-6">
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Bukti Transfer</p>
 <div 
 onClick={() => setSelectedPaymentForView(p)}
 className="relative aspect-video rounded-2xl overflow-hidden shadow-sm cursor-pointer group"
 >
 <img src={p.proofUrl || undefined} className="w-full h-full object-cover" alt="Bukti Transfer" />
 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
 <Search size={24} className="text-white" />
 </div>
 </div>
 </div>

 <div className="flex gap-3">
 <button 
 onClick={() => verifyPayment(p)}
 className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold text-xs shadow-sm active:scale-95 transition-transform"
 >
 Verifikasi
 </button>
 <button 
 onClick={() => {
 setSelectedPaymentForView(p);
 setShowRejectModal(true);
 }}
 className="flex-1 bg-rose-50 text-rose-600 py-4 rounded-2xl font-bold text-xs border border-rose-100 active:scale-95 transition-transform"
 >
 Tolak
 </button>
 </div>
 </motion.div>
 ))
 )}
 </main>
 </motion.div>
 );
};

export default AdminPayment;
