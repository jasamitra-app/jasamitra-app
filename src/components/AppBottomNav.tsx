import React from 'react';
import { motion } from 'motion/react';
import { Home, MessageSquare, Plus, LayoutGrid, User } from 'lucide-react';
import { Page } from '../types';

export const AppBottomNav = ({ activePage, onNav, onAdd, userRole }: { activePage: Page, onNav: (p: Page) => void, onAdd: () => void, userRole: 'pelanggan' | 'mitra' | 'admin' | null }) => {
 const navItems = [
 { id: 'beranda', label: 'Beranda', icon: Home },
 { id: 'pesan', label: 'Pesan', icon: MessageSquare },
 { id: 'add', label: '', icon: Plus, isSpecial: true },
 { id: 'layanan', label: 'Progress', icon: LayoutGrid },
 { id: 'akun', label: 'Akun', icon: User },
 ];

 return (
 <nav className="fixed bottom-6 left-6 right-6 bg-white h-16 flex items-center justify-around px-2 z-[1000] rounded-[24px] shadow-sm border border-slate-200 ">
 {navItems.map((item) => {
 if (item.isSpecial) {
 if (userRole === 'pelanggan') return <div key={item.id} className="flex-1" />;
 return (
 <div key={item.id} className="relative -top-8">
 <motion.button 
 whileHover={{ scale: 1.1, translateY: -2 }}
 whileTap={{ scale: 0.9 }}
 onClick={onAdd}
 className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-sm border-4 border-slate-200 "
 >
 <Plus size={28} strokeWidth={3} />
 </motion.button>
 </div>
 );
 }

 const isActive = activePage === item.id;
 const Icon = item.icon;

 return (
 <button 
 key={item.id}
 onClick={() => onNav(item.id as Page)}
 className={`flex flex-col items-center justify-center flex-1 transition-all duration-300 relative ${isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
 >
 <motion.div
 animate={isActive ? { y: -2 } : { y: 0 }}
 className="flex flex-col items-center"
 >
 <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
 <span className={`text-[9px] mt-1 font-bold uppercase tracking-tighter transition-opacity ${isActive ? 'opacity-100' : 'opacity-70'}`}>{item.label}</span>
 </motion.div>
 {isActive && (
 <motion.div 
 layoutId="nav-indicator"
 className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"
 />
 )}
 </button>
 );
 })}
 </nav>
 );
};
