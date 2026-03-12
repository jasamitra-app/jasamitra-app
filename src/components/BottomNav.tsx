import React from 'react';
import { Home, ClipboardList, User, MessageSquare, ShieldCheck } from 'lucide-react';

interface BottomNavProps {
  activePage: string;
  userRole: 'tamu' | 'mitra' | 'admin' | null;
  onNavigate: (page: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activePage, userRole, onNavigate }) => {
  const navItems = [
    { id: 'beranda', icon: Home, label: 'Beranda', show: true },
    { id: 'pesanan', icon: ClipboardList, label: 'Pesanan', show: userRole !== 'admin' },
    { id: 'admin-pembayaran', icon: ShieldCheck, label: 'Admin', show: userRole === 'admin' },
    { id: 'chat', icon: MessageSquare, label: 'Pesan', show: userRole !== 'admin' },
    { id: 'akun', icon: User, label: 'Akun', show: true }
  ].filter(item => item.show);

  return (
    <nav className="fixed bottom-0 w-full max-w-md bg-white/90 backdrop-blur-2xl border-t border-slate-100 pb-safe z-50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-20 px-6">
        {navItems.map(({ id, icon: Icon, label }) => {
          const isActive = activePage === id;
          return (
            <button 
              key={id}
              onClick={() => onNavigate(id)}
              className="flex flex-col items-center justify-center w-16 h-16 relative group"
            >
              <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${isActive ? 'bg-primary/10 scale-100' : 'scale-0 group-hover:bg-slate-50 group-hover:scale-100'}`} />
              <Icon 
                size={24} 
                className={`relative z-10 transition-all duration-300 ${isActive ? 'text-primary scale-110 mb-1' : 'text-slate-400 group-hover:text-slate-600'}`} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`relative z-10 text-[10px] font-bold transition-all duration-300 ${isActive ? 'text-primary opacity-100' : 'text-slate-400 opacity-0 group-hover:opacity-100'}`}>
                {label}
              </span>
              {isActive && (
                <div className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--color-primary),0.5)]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
