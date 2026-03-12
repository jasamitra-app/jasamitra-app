import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, ChevronRight } from 'lucide-react';
import { loginUser, registerUser } from '../services/authService';

interface LoginProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onBack, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        await loginUser(email, password);
        alert('Login berhasil!');
      } else {
        await registerUser(email, password, 'tamu', name, phone);
        alert('Pendaftaran berhasil! Silakan login.');
        setIsLogin(true);
        return; // Don't call onSuccess yet, let them login
      }
      onSuccess();
    } catch (error: any) {
      alert((isLogin ? 'Login gagal: ' : 'Pendaftaran gagal: ') + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div key="login" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="min-h-screen bg-slate-50 flex flex-col">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <div>
          <h1 className="text-lg font-black text-slate-800 tracking-tight">{isLogin ? 'Masuk' : 'Daftar'}</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isLogin ? 'Selamat datang kembali' : 'Buat akun baru'}</p>
        </div>
      </header>

      <main className="flex-1 px-6 pt-8 pb-12 flex flex-col justify-center">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 neo-3d">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Jasa<span className="text-primary">Mitra</span></h2>
            <p className="text-xs font-medium text-slate-500">{isLogin ? 'Masuk untuk melanjutkan' : 'Daftar sebagai pelanggan'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="relative">
                  <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Nama Lengkap" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="relative">
                  <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="tel" 
                    placeholder="Nomor Telepon" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </>
            )}
            <div className="relative">
              <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="relative">
              <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl font-black text-sm shadow-xl transition-all ${isLoading ? 'bg-slate-300 text-slate-500' : 'bg-primary text-white shadow-primary/30 hover:bg-primary-dark'}`}
            >
              {isLoading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs font-medium text-slate-500">
              {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-primary font-bold hover:underline"
              >
                {isLogin ? 'Daftar sekarang' : 'Masuk di sini'}
              </button>
            </p>
          </div>
        </div>
      </main>
    </motion.div>
  );
};
