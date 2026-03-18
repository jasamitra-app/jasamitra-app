import React from 'react';
import { motion } from 'motion/react';
import { User, LogOut, FileText, ShieldCheck, MapPin, ClipboardList, Edit3, Handshake, Info, ChevronRight } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Page } from '../types';

interface AccountProps {
 user: any;
 userRole: 'pelanggan' | 'mitra' | 'admin' | null;
 navigateTo: (page: Page) => void;
 setShowLoginMitraModal: (show: boolean) => void;
 handleLogout: () => void;
}

export const Account: React.FC<AccountProps> = ({ user, userRole, navigateTo, setShowLoginMitraModal, handleLogout }) => {
 return (
 <motion.div 
 key="akun"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 className="min-h-screen bg-slate-50/50 relative overflow-hidden perspective-[1000px]"
 >
 {/* 3D Background Elements */}
 <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
 <div className="absolute top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-[#003366]/5 to-transparent blur-3xl" />
 <div className="absolute top-[60%] -right-[10%] w-[30%] h-[30%] rounded-full bg-gradient-to-tl from-[#F27D26]/5 to-transparent blur-3xl" />
 </div>

 <div className="relative z-10">
 <PageHeader title="Akun Saya" subtitle="Kelola profil dan preferensi Anda" />
 <main className="px-6 pt-6 pb-32">
 <motion.div 
 whileHover={{ scale: 1.01, translateY: -2 }}
 className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-200 text-center mb-8 transition-transform"
 >
 <div className="w-24 h-24 bg-slate-100/50 rounded-full mx-auto mb-4 flex items-center justify-center text-slate-300 border-4 border-white shadow-sm overflow-hidden relative">
 <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent z-10 pointer-events-none" />
 {user?.photoURL ? (
 <img src={user.photoURL || undefined} className="w-full h-full object-cover relative z-0" referrerPolicy="no-referrer" />
 ) : (
 <User size={48} className="relative z-0" />
 )}
 </div>
 {user ? (
 <>
 <h3 className="text-lg font-black text-slate-800">{user.displayName || 'Pengguna JasaMitra'}</h3>
 <p className="text-xs text-slate-500 font-medium mb-6 bg-slate-100/50 inline-block px-3 py-1 rounded-full">{user.email || user.phoneNumber}</p>
 </>
 ) : (
 <div className="mb-6">
 <h3 className="text-lg font-black text-slate-800">{userRole === 'mitra' ? 'Mitra' : 'Pelanggan'}</h3>
 <p className="text-xs text-slate-500 font-medium">Silakan {userRole === 'mitra' ? 'daftar atau login' : 'login'} untuk melanjutkan</p>
 </div>
 )}
 {!user && (
 <div className="flex flex-col gap-3">
 {userRole === 'mitra' ? (
 <>
 <motion.button 
 whileTap={{ scale: 0.95 }}
 onClick={() => navigateTo('daftar-mitra')}
 className="bg-accent text-white text-xs font-bold px-8 py-3.5 rounded-2xl shadow-sm "
 >
 Daftar Menjadi Mitra
 </motion.button>
 <motion.button 
 whileTap={{ scale: 0.95 }}
 onClick={() => setShowLoginMitraModal(true)}
 className="text-primary text-xs font-bold px-8 py-3.5 rounded-2xl border border-primary/20 bg-primary/5 "
 >
 Sudah punya akun? Login Mitra
 </motion.button>
 </>
 ) : (
 <motion.button 
 whileTap={{ scale: 0.95 }}
 onClick={() => navigateTo('login')}
 className="bg-primary text-white text-xs font-bold px-8 py-3.5 rounded-2xl shadow-sm "
 >
 Login Pelanggan
 </motion.button>
 )}
 </div>
 )}
 </motion.div>

 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.1 }}
 className="bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden mb-8 "
 >
 {[
 { id: 'admin-pembayaran', label: 'Verifikasi Pembayaran', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', show: userRole === 'admin' },
 { id: 'peraturan-pelanggan', label: 'Peraturan Pelanggan', icon: Info, color: 'text-slate-600', bg: 'bg-slate-100', show: userRole === 'pelanggan' },
 { id: 'protokol-mitra', label: 'Protokol Keselamatan', icon: ShieldCheck, color: 'text-slate-600', bg: 'bg-slate-100', show: userRole === 'mitra' },
 { id: 'pesanan', label: 'Pesanan Masuk (Mitra)', icon: Handshake, color: 'text-slate-600', bg: 'bg-slate-100', show: userRole === 'mitra' },
 { id: 'edit-profil', label: 'Edit Profil', icon: Edit3, color: 'text-slate-600', bg: 'bg-slate-50', show: true },
 { id: 'alamat-saya', label: 'Alamat Saya', icon: MapPin, color: 'text-slate-600', bg: 'bg-slate-50', show: true },
 { id: 'iklan-saya', label: 'Iklan Saya', icon: ClipboardList, color: 'text-slate-600', bg: 'bg-slate-50', show: userRole === 'mitra' },
 { id: 'kebijakan', label: 'Kebijakan Privasi & Keamanan', icon: ShieldCheck, color: 'text-slate-500', bg: 'bg-slate-50', show: true },
 { id: 'syarat-ketentuan', label: 'Syarat & Ketentuan', icon: FileText, color: 'text-slate-500', bg: 'bg-slate-50', show: true },
 ].filter(item => item.show).map((item, index) => (
 <motion.button 
 key={item.id}
 whileHover={{ backgroundColor: 'rgba(248, 250, 252, 0.8)' }}
 whileTap={{ scale: 0.98 }}
 onClick={() => {
 const publicPages = ['daftar-mitra', 'kebijakan', 'syarat-ketentuan', 'peraturan-pelanggan', 'protokol-mitra'];
 if (!user && !publicPages.includes(item.id)) {
 if (userRole === 'mitra') {
 setShowLoginMitraModal(true);
 } else {
 navigateTo('login');
 }
 } else {
 navigateTo(item.id as Page);
 }
 }}
 className="w-full flex items-center justify-between p-5 transition-colors border-b border-slate-100/50 last:border-0"
 >
 <div className="flex items-center gap-4">
 <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center ${item.color}`}>
 <item.icon size={20} />
 </div>
 <span className={`text-sm font-bold text-left text-slate-700`}>{item.label}</span>
 </div>
 <ChevronRight size={18} className="text-slate-300" />
 </motion.button>
 ))}
 </motion.div>

 <motion.button 
 whileTap={{ scale: 0.95 }}
 onClick={handleLogout}
 className="w-full p-5 bg-rose-50/80 text-rose-600 rounded-[32px] font-bold text-sm flex items-center justify-center gap-2 shadow-sm border border-rose-100 transition-transform"
 >
 <LogOut size={20} /> Keluar
 </motion.button>
 </main>
 </div>
 </motion.div>
 );
};

