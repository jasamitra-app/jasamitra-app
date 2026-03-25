import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PageHeader } from '../components/PageHeader';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface LoginProps {
 userRole: 'tamu' | 'mitra' | 'admin' | null;
 handleBack: () => void;
 navigateTo: (page: string) => void;
}

export const Login: React.FC<LoginProps> = ({ userRole, handleBack, navigateTo }) => {
 const [isLogin, setIsLogin] = useState(true);
 const [loginEmail, setLoginEmail] = useState('');
 const [loginPassword, setLoginPassword] = useState('');
 const [fullName, setFullName] = useState('');
 const [isLoading, setIsLoading] = useState(false);

 const handleSubmit = async () => {
   if (!loginEmail || !loginPassword) {
     alert('Mohon isi email/nomor HP dan kata sandi.');
     return;
   }
   if (!isLogin && !fullName) {
     alert('Mohon isi nama lengkap untuk mendaftar.');
     return;
   }

   setIsLoading(true);
   try {
     let emailToUse = loginEmail.trim();
     
     // If it looks like a phone number (only digits, possibly starting with 0 or 62 or +62)
     if (/^(\+62|62|0)[0-9]{8,15}$/.test(emailToUse)) {
       // Normalize to 08... format for consistency if needed, but simple append is fine
       emailToUse = `${emailToUse}@jasamitra.com`;
     }

     if (isLogin) {
       // LOGIN
       await signInWithEmailAndPassword(auth, emailToUse, loginPassword);
       alert('Berhasil masuk!');
       navigateTo('beranda');
     } else {
       // REGISTER (Only for Pelanggan, Mitra uses a different page)
       const userCredential = await createUserWithEmailAndPassword(auth, emailToUse, loginPassword);
       const user = userCredential.user;
       
       // Update profile name
       await updateProfile(user, { displayName: fullName });
       
       // Create user document in Firestore
       await setDoc(doc(db, 'users', user.uid), {
         uid: user.uid,
         name: fullName,
         email: emailToUse.includes('@jasamitra.com') ? null : emailToUse,
         phone: emailToUse.includes('@jasamitra.com') ? loginEmail.trim() : null,
         role: 'pelanggan',
         createdAt: serverTimestamp()
       });

       alert('Berhasil mendaftar dan masuk!');
       navigateTo('beranda');
     }
   } catch (error: any) {
     console.error("Auth error:", error);
     let errorMsg = error.message;
     if (error.code === 'auth/invalid-credential') {
       errorMsg = 'Email/Nomor HP atau kata sandi salah. Jika belum punya akun, silakan Daftar terlebih dahulu.';
     } else if (error.code === 'auth/email-already-in-use') {
       errorMsg = 'Email/Nomor HP ini sudah terdaftar. Silakan Masuk.';
     } else if (error.code === 'auth/weak-password') {
       errorMsg = 'Kata sandi terlalu lemah. Minimal 6 karakter.';
     }
     alert(`Gagal ${isLogin ? 'masuk' : 'mendaftar'}: ` + errorMsg);
   } finally {
     setIsLoading(false);
   }
 };

 const toggleMode = () => {
   if (userRole === 'mitra' && isLogin) {
     // If they are a mitra and want to register, send them to the dedicated page
     navigateTo('daftar-mitra');
   } else {
     setIsLogin(!isLogin);
   }
 };

 return (
 <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
 <PageHeader 
   title={userRole === 'mitra' ? "Login Mitra" : (isLogin ? "Login Pelanggan" : "Daftar Pelanggan")} 
   subtitle={isLogin ? "Masuk untuk menikmati semua fitur JasaMitra" : "Buat akun baru untuk mulai menggunakan JasaMitra"} 
   onBack={handleBack} 
 />
 <main className="px-6 pt-6 pb-24">
 <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 space-y-6">
 <div className="space-y-4">
   
   {!isLogin && (
     <div className="space-y-2">
       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Nama Lengkap *</label>
       <input 
         type="text" 
         placeholder="Contoh: Budi Santoso" 
         value={fullName}
         onChange={(e) => setFullName(e.target.value)}
         className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20" 
       />
     </div>
   )}

 <div className="space-y-2">
 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Nomor WhatsApp / Email *</label>
 <input 
 type="text" 
 placeholder="Contoh: 08123456789 atau email@gmail.com" 
 value={loginEmail}
 onChange={(e) => setLoginEmail(e.target.value)}
 className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20" 
 />
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Kata Sandi *</label>
 <input 
 type="password" 
 placeholder="Minimal 6 karakter" 
 value={loginPassword}
 onChange={(e) => setLoginPassword(e.target.value)}
 className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20" 
 />
 </div>
 </div>
 <button 
 onClick={handleSubmit}
 disabled={isLoading}
 className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-sm active:scale-95 transition-transform disabled:opacity-70"
 >
 {isLoading ? 'Memproses...' : (isLogin ? 'Masuk Sekarang' : 'Daftar Sekarang')}
 </button>
 
 <div className="text-center mt-6">
   <p className="text-sm text-slate-500">
     {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{' '}
     <button 
       onClick={toggleMode}
       className="text-primary font-bold hover:underline"
     >
       {isLogin ? "Daftar di sini" : "Masuk di sini"}
     </button>
   </p>
 </div>

 <div id="recaptcha-container"></div>
 </div>
 </main>
 </motion.div>
 );
};
