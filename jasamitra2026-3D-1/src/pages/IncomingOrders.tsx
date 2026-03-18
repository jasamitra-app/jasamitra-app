import React from 'react';
import { motion } from 'motion/react';
import { ClipboardList, CheckCircle2, MessageSquare } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface IncomingOrdersProps {
 mitraOrders: any[];
 handleBack: () => void;
 navigateTo: (page: string) => void;
 setChatMitra: (mitra: any) => void;
}

export const IncomingOrders: React.FC<IncomingOrdersProps> = ({
 mitraOrders,
 handleBack,
 navigateTo,
 setChatMitra
}) => {
 return (
 <motion.div key="pesanan" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
 <PageHeader title="Pesanan Masuk" subtitle="Kelola pesanan dari pelanggan" onBack={handleBack} />
 <main className="px-6 pt-6 space-y-4 pb-12">
 {mitraOrders.length === 0 ? (
 <div className="py-20 text-center">
 <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
 <ClipboardList size={32} className="text-slate-400" />
 </div>
 <p className="text-slate-400 font-bold">Belum ada pesanan masuk</p>
 </div>
 ) : (
 mitraOrders.map((order) => (
 <div key={order.id} className="bg-white p-6 rounded-[40px] shadow-sm border border-slate-100 space-y-4">
 {order.status === 'paid' && (
 <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-start gap-3 mb-2">
 <div className="bg-emerald-100 p-2 rounded-full shrink-0">
 <CheckCircle2 size={16} className="text-emerald-600" />
 </div>
 <div>
 <p className="text-xs font-bold text-emerald-800">Pelanggan sudah bayar DP 10%.</p>
 <p className="text-[11px] text-emerald-600 mt-0.5">Silahkan hubungi pelanggan</p>
 <p className="text-[11px] text-emerald-600 mt-0.5">Selamat bekerja dan semangat demi keluarga ❤️</p>
 </div>
 </div>
 )}
 <div className="flex justify-between items-start">
 <div>
 <h3 className="text-sm font-bold text-slate-800">{order.serviceTitle}</h3>
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{order.customerName}</p>
 </div>
 <span className={`text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest ${
 order.status === 'accepted' ? 'bg-primary/10 text-primary' : 
 order.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
 order.status === 'rejected' ? 'bg-rose-50 text-rose-600' : 
 'bg-accent/10 text-accent'
 }`}>
 {order.status === 'pending' ? 'Menunggu' : order.status === 'accepted' ? 'Diterima' : order.status === 'paid' ? 'Lunas (DP)' : 'Ditolak'}
 </span>
 </div>
 
 <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center">
 <div>
 <p className="text-[9px] font-bold text-slate-400 uppercase">Total Deal</p>
 <p className="text-sm font-extrabold text-primary">Rp {order.totalPrice?.toLocaleString()}</p>
 <p className="text-[9px] font-bold text-slate-400 uppercase mt-2">Sisa Cash ke Mitra</p>
 <p className="text-sm font-extrabold text-emerald-600">Rp {((order.totalPrice || 0) * 0.9).toLocaleString()}</p>
 </div>
 <div className="text-right">
 <p className="text-[9px] font-bold text-slate-400 uppercase">Tanggal</p>
 <p className="text-[10px] font-bold text-slate-700">{order.date}</p>
 </div>
 </div>

 {order.status === 'paid' && order.customerPhone && (
 <div className="bg-blue-50 p-4 rounded-2xl flex items-center justify-between">
 <div>
 <p className="text-[9px] font-bold text-blue-400 uppercase mb-1">Kontak Pelanggan</p>
 <p className="text-sm font-black text-blue-700">{order.customerPhone}</p>
 </div>
 <a href={`https://wa.me/${order.customerPhone.replace(/\\D/g, '')}`} target="_blank" rel="noreferrer" className="bg-blue-600 text-white p-2 rounded-xl shadow-sm active:scale-95 transition-transform">
 <MessageSquare size={16} />
 </a>
 </div>
 )}

 <div className="flex gap-3 pt-2">
 <button 
 onClick={() => {
 setChatMitra({ id: order.customerID, name: order.customerName });
 navigateTo('chat');
 }}
 className="flex-1 bg-slate-50 text-primary py-3 rounded-xl font-bold text-xs border border-slate-100 active:scale-95 transition-transform flex items-center justify-center gap-2"
 >
 <MessageSquare size={14} /> Chat Pelanggan
 </button>
 {order.status === 'pending' && (
 <>
 <button 
 onClick={async () => {
 try {
 await updateDoc(doc(db, 'transactions', order.id), { status: 'accepted' });
 alert('Pesanan diterima!');
 } catch (error) {
 console.error("Error accepting order:", error);
 alert('Gagal menerima pesanan');
 }
 }}
 className="flex-1 bg-primary text-white py-3 rounded-xl font-bold text-xs shadow-sm active:scale-95 transition-transform"
 >
 Terima
 </button>
 <button 
 onClick={async () => {
 try {
 await updateDoc(doc(db, 'transactions', order.id), { status: 'rejected' });
 alert('Pesanan ditolak');
 } catch (error) {
 console.error("Error rejecting order:", error);
 alert('Gagal menolak pesanan');
 }
 }}
 className="flex-1 bg-white border border-slate-200 text-rose-500 py-3 rounded-xl font-bold text-xs active:scale-95 transition-transform"
 >
 Tolak
 </button>
 </>
 )}
 </div>
 </div>
 ))
 )}
 </main>
 </motion.div>
 );
};
