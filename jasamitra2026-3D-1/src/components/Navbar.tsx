import React from 'react';
import { Bell, User, Menu } from 'lucide-react';

interface NavbarProps {
 userRole: 'pelanggan' | 'mitra' | 'admin' | null;
 unreadCount: number;
 onNotifClick: () => void;
 onProfileClick: () => void;
 onMenuClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ userRole, unreadCount, onNotifClick, onProfileClick, onMenuClick }) => {
 return (
 <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
 <div className="flex items-center justify-between px-6 py-4">
 <div className="flex items-center gap-3">
 {onMenuClick && (
 <button onClick={onMenuClick} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl">
 <Menu size={20} />
 </button>
 )}
 <div>
 <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
 Jasa<span className="text-primary">Mitra</span>
 </h1>
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
 {userRole === 'admin' ? 'Admin Panel' : userRole === 'mitra' ? 'Mitra Dashboard' : 'Pesan Jasa Cepat'}
 </p>
 </div>
 </div>
 
 <div className="flex items-center gap-3">
 <button 
 onClick={onNotifClick}
 className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 relative hover:bg-slate-100 transition-colors"
 >
 <Bell size={20} />
 {unreadCount > 0 && (
 <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
 )}
 </button>
 <button 
 onClick={onProfileClick}
 className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
 >
 <User size={20} />
 </button>
 </div>
 </div>
 </header>
 );
};
