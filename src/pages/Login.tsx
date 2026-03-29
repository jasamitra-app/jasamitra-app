import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PageHeader } from '../components/PageHeader';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { Eye, EyeOff } from 'lucide-react';

interface LoginProps {
 userRole: 'tamu' | 'mitra' | 'admin' | null;
 handleBack: () => void;
 navigateTo: (page: string) => void;
}

export const Login: React.FC<LoginProps> = ({ userRole, handleBack, navigateTo }) => {
 const [isLogin, setIsLogin] = useState(true);
 const [loginEmail, setLoginEmail] = useState('');
 const [loginPassword, setLoginPassword] = useState('');
 const [confirmPassword, setConfirmPassword] = useState('');
 const [showPassword, setShowPassword] = useState(false);
 const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 const [fullName, setFullName] = useState('');
 const [isLoading, setIsLoading] = useState(false);

 const handleGoogleSignIn = async () => {
   setIsLoading(true);
   try {
     const provider = new GoogleAuthProvider();
     const result = await signInWithPopup(auth, provider);
     const user = result.user;

     // Check if user document already exists
     const userDocRef = doc(db, 'users', user.uid);
     const userDocSnap = await getDoc(userDocRef);

     if (!userDocSnap.exists()) {
       // Create new user document if it doesn't exist
       await setDoc(userDocRef, {
         uid: user.uid,
         name: user.displayName || 'Pengguna Google',
         email: user.email,
         phone: user.phoneNumber || null,
         role: 'pelanggan',
         createdAt: serverTimestamp()
       });
     }

     alert('Berhasil masuk dengan Google!');
     navigateTo('beranda');
   } catch (error: any) {
     console.error("Google Auth error:", error);
     alert('Gagal masuk dengan Google: ' + error.message);
   } finally {
     setIsLoading(false);
   }
 };

 const handleSubmit = async () => {
   if (!loginEmail || !loginPassword) {
     alert('Mohon isi email/nomor HP dan kata sandi.');
     return;
   }
   if (!isLogin) {
     if (!fullName) {
       alert('Mohon isi nama lengkap untuk mendaftar.');
       return;
     }
     if (loginPassword !== confirmPassword) {
       alert('Konfirmasi kata sandi tidak cocok!');
       return;
     }
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
 <div className="relative">
   <input 
     type={showPassword ? "text" : "password"} 
     placeholder="Minimal 6 karakter" 
     value={loginPassword}
     onChange={(e) => setLoginPassword(e.target.value)}
     className="w-full bg-slate-50 rounded-2xl p-4 pr-12 text-sm font-medium outline-none focus:ring-2 ring-primary/20" 
   />
   <button
     type="button"
     onClick={() => setShowPassword(!showPassword)}
     className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
   >
     {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
   </button>
 </div>
 </div>

 {!isLogin && (
   <div className="space-y-2">
     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Konfirmasi Kata Sandi *</label>
     <div className="relative">
       <input 
         type={showConfirmPassword ? "text" : "password"} 
         placeholder="Masukkan ulang kata sandi" 
         value={confirmPassword}
         onChange={(e) => setConfirmPassword(e.target.value)}
         className="w-full bg-slate-50 rounded-2xl p-4 pr-12 text-sm font-medium outline-none focus:ring-2 ring-primary/20" 
       />
       <button
         type="button"
         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
         className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
       >
         {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
       </button>
     </div>
   </div>
 )}
 </div>
 <button 
 onClick={handleSubmit}
 disabled={isLoading}
 className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-sm active:scale-95 transition-transform disabled:opacity-70"
 >
 {isLoading ? 'Memproses...' : (isLogin ? 'Masuk Sekarang' : 'Daftar Sekarang')}
 </button>

 {userRole !== 'mitra' && (
   <>
     <div className="relative flex items-center py-2">
       <div className="flex-grow border-t border-slate-200"></div>
       <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-medium">ATAU</span>
       <div className="flex-grow border-t border-slate-200"></div>
     </div>

     <button
       onClick={handleGoogleSignIn}
       disabled={isLoading}
       className="w-full bg-white border border-slate-200 text-slate-700 py-4 rounded-2xl font-bold text-sm shadow-sm active:scale-95 transition-transform disabled:opacity-70 flex items-center justify-center gap-3 hover:bg-slate-50"
     >
       <svg className="w-5 h-5" viewBox="0 0 24 24">
         <path
           d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
           fill="#4285F4"
         />
         <path
           d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
           fill="#34A853"
         />
         <path
           d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
           fill="#FBBC05"
         />
         <path
           d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
           fill="#EA4335"
         />
       </svg>
       Lanjutkan dengan Google
     </button>
   </>
 )}
 
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
