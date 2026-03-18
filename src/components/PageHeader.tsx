import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Bell } from 'lucide-react';

export const PageHeader = ({ 
 title, 
 subtitle, 
 onBack,
 showNotifDropdown,
 setShowNotifDropdown,
 unreadNotifCount,
 markNotifsAsRead
}: { 
 title: string, 
 subtitle?: string, 
 onBack?: () => void,
 showNotifDropdown?: boolean,
 setShowNotifDropdown?: (show: boolean) => void,
 unreadNotifCount?: number,
 markNotifsAsRead?: () => void
}) => (
 <header className="bg-white text-slate-800 pt-5 pb-5 px-6 border-b border-slate-200 shadow-sm relative overflow-hidden z-20 ">
 <div className="relative z-10 flex items-center justify-between">
 <div className="flex items-center gap-4">
 {onBack && (
 <motion.button 
 whileHover={{ scale: 1.05, translateY: -2 }}
 whileTap={{ scale: 0.9 }}
 onClick={onBack} 
 className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-600 border border-slate-200 shadow-sm "
 >
 <ArrowLeft size={18} strokeWidth={2.5} />
 </motion.button>
 )}
 <div>
 <h1 className="text-xl font-black tracking-tighter italic leading-none text-primary">{title}</h1>
 {subtitle && <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.1em] mt-1.5">{subtitle}</p>}
 </div>
 </div>
 {setShowNotifDropdown && (
 <motion.div 
 whileHover={{ scale: 1.05, translateY: -2 }}
 whileTap={{ scale: 0.95 }}
 className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-600 border border-slate-200 shadow-sm relative cursor-pointer "
 onClick={() => {
 setShowNotifDropdown(!showNotifDropdown);
 if (!showNotifDropdown && markNotifsAsRead) markNotifsAsRead();
 }}
 >
 <Bell size={18} />
 {unreadNotifCount !== undefined && unreadNotifCount > 0 && (
 <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center shadow-sm">
 <span className="text-[7px] text-white font-bold">{unreadNotifCount}</span>
 </div>
 )}
 </motion.div>
 )}
 </div>
 </header>
);
