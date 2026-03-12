import React from 'react';
import { motion } from 'framer-motion';
import { User, LogOut, FileText, Shield, MapPin, ClipboardList, Settings, ChevronRight } from 'lucide-react';

interface AccountProps {
  user: any;
  userRole: 'tamu' | 'mitra' | 'admin' | null;
  isMitra: boolean;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export const Account: React.FC<AccountProps> = ({ user, userRole, isMitra, onNavigate, onLogout }) => {
  const accountMenu = [
    { id: 'edit-profil', label: 'Edit Profil', icon: User, color: 'text-primary', bg: 'bg-primary/10', show: true },
    { id: 'alamat-saya', label: 'Alamat Saya', icon: MapPin, color: 'text-slate-600', bg: 'bg-slate-50', show: true },
    { id: 'iklan-saya', label: 'Iklan Saya', icon: ClipboardList, color: 'text-slate-600', bg: 'bg-slate-50', show: isMitra },
    { id: 'pengaturan', label: 'Pengaturan Akun', icon: Settings, color: 'text-slate-600', bg: 'bg-slate-50', show: true },
    { id: 'kebijakan', label: 'Kebijakan Privasi', icon: Shield, color: 'text-slate-600', bg: 'bg-slate-50', show: true },
    { id: 'syarat-ketentuan', label: 'Syarat & Ketentuan', icon: FileText, color: 'text-slate-600', bg: 'bg-slate-50', show: true },
  ];

  return (
    <motion.div key="akun" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="pb-24">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm px-6 py-4">
        <h1 className="text-lg font-black text-slate-800 tracking-tight">Akun Saya</h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kelola profil & pengaturan</p>
      </header>

      <main className="px-6 pt-6 space-y-6">
        {user ? (
          <div className="bg-white p-6 rounded-[40px] shadow-sm border border-slate-100 flex items-center gap-4 neo-3d">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0 border-4 border-white shadow-md">
              <User size={32} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-black text-slate-800 truncate">{user.email?.split('@')[0] || 'Pengguna'}</h2>
              <p className="text-xs font-medium text-slate-500 truncate">{user.email}</p>
              <div className="mt-2 inline-block bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-slate-600 uppercase tracking-widest">
                {userRole === 'admin' ? 'Administrator' : userRole === 'mitra' ? 'Mitra Jasa' : 'Pelanggan'}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-[40px] shadow-sm border border-slate-100 text-center neo-3d">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
              <User size={32} />
            </div>
            <h2 className="text-sm font-black text-slate-800 mb-1">Belum Masuk</h2>
            <p className="text-xs font-medium text-slate-400 mb-4">Silakan masuk atau daftar untuk melanjutkan</p>
            <button 
              onClick={() => onNavigate('login')}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/30"
            >
              Masuk / Daftar
            </button>
          </div>
        )}

        {user && (
          <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
            {accountMenu.filter(m => m.show).map((item, index) => (
              <button 
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors ${index !== accountMenu.filter(m => m.show).length - 1 ? 'border-b border-slate-100' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${item.bg} ${item.color}`}>
                    <item.icon size={20} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-slate-300" />
              </button>
            ))}
          </div>
        )}

        {user && (
          <button 
            onClick={onLogout}
            className="w-full bg-red-50 text-red-600 py-5 rounded-[32px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
          >
            <LogOut size={18} /> Keluar
          </button>
        )}
      </main>
    </motion.div>
  );
};
