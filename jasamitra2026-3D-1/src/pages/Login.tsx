import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PageHeader } from '../components/PageHeader';
import { auth } from '../lib/firebase';

interface LoginProps {
 userRole: 'tamu' | 'mitra' | 'admin' | null;
 handleBack: () => void;
 navigateTo: (page: string) => void;
}

export const Login: React.FC<LoginProps> = ({ userRole, handleBack, navigateTo }) => {
 const [loginEmail, setLoginEmail] = useState('');
 const [loginPassword, setLoginPassword] = useState('');

 const handleLogin = async () => {
 try {
 const { signInWithEmailAndPassword } = await import('firebase/auth');
 let emailToUse = loginEmail.trim();
 
 // If it looks like a phone number (only digits, possibly starting with 0 or 62 or +62)
 if (/^(\+62|62|0)[0-9]{8,15}$/.test(emailToUse)) {
 // Normalize to 08... format for consistency if needed, but simple append is fine
 emailToUse = `${emailToUse}@jasamitra.com`;
 }

 await signInWithEmailAndPassword(auth, emailToUse, loginPassword);
 alert('Berhasil masuk!');
 navigateTo('beranda');
 } catch (error: any) {
 alert('Gagal masuk: ' + error.message);
 }
 };

 return (
 <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
 <PageHeader title={userRole === 'mitra' ? "Login Mitra" : "Login Pelanggan"} subtitle="Masuk untuk menikmati semua fitur JasaMitra" onBack={handleBack} />
 <main className="px-6 pt-6">
 <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 space-y-6">
 <div className="space-y-4">
 <div className="space-y-2">
 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Nomor WhatsApp / Email *</label>
 <input 
 type="text" 
 placeholder="Contoh: 08123456789" 
 value={loginEmail}
 onChange={(e) => setLoginEmail(e.target.value)}
 className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20" 
 />
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Kata Sandi *</label>
 <input 
 type="password" 
 placeholder="Minimal 8 karakter" 
 value={loginPassword}
 onChange={(e) => setLoginPassword(e.target.value)}
 className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20" 
 />
 </div>
 </div>
 <button 
 onClick={handleLogin}
 className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-sm active:scale-95 transition-transform"
 >
 Masuk Sekarang
 </button>
 
 <div id="recaptcha-container"></div>
 </div>
 </main>
 </motion.div>
 );
};
