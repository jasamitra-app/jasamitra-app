import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, ChevronRight } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

interface MessagesProps {
 user: any;
 userChats: any[];
 setChatMitra: (mitra: any) => void;
 navigateTo: (page: string) => void;
}

const Messages: React.FC<MessagesProps> = ({ user, userChats, setChatMitra, navigateTo }) => {
 return (
 <motion.div 
 key="pesan" 
 initial={{ opacity: 0, y: 20 }} 
 animate={{ opacity: 1, y: 0 }} 
 exit={{ opacity: 0, y: -20 }}
 className="min-h-screen bg-slate-50/50 relative overflow-hidden perspective-[1000px]"
 >
 {/* 3D Background Elements */}
 <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
 <div className="absolute top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-[#003366]/5 to-transparent blur-3xl" />
 <div className="absolute top-[60%] -right-[10%] w-[30%] h-[30%] rounded-full bg-gradient-to-tl from-[#F27D26]/5 to-transparent blur-3xl" />
 </div>

 <div className="relative z-10">
 <PageHeader title="Pesan" subtitle="Percakapan dengan mitra & pelanggan" />
 <main className="px-6 pt-6 space-y-4 pb-32">
 {userChats.length === 0 ? (
 <div className="flex flex-col items-center justify-center min-h-[400px] opacity-40 ">
 <motion.div 
 animate={{ y: [-5, 5, -5] }}
 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
 className="w-24 h-24 bg-white rounded-[32px] shadow-sm border border-slate-200 flex items-center justify-center mb-6"
 >
 <MessageSquare size={40} className="text-slate-400" />
 </motion.div>
 <h3 className="text-base font-black text-slate-800 mb-2">Belum Ada Pesan</h3>
 <p className="text-xs font-medium text-slate-500 text-center max-w-[220px] leading-relaxed">
 Mulai percakapan dengan mitra untuk melihat pesan di sini.
 </p>
 </div>
 ) : (
 userChats.map((chat, index) => {
 const otherId = chat.participants.find((p: string) => p !== user?.uid);
 const otherName = chat.participantNames[otherId] || 'User';
 return (
 <motion.button 
 key={chat.id}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: index * 0.1 }}
 whileHover={{ scale: 1.02, translateY: -2 }}
 whileTap={{ scale: 0.98 }}
 onClick={() => {
 setChatMitra({ id: otherId, name: otherName });
 navigateTo('chat');
 }}
 className="w-full bg-white p-4 rounded-[24px] shadow-sm border border-slate-200 flex items-center gap-4 transition-all "
 >
 <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center text-primary font-black text-lg shadow-sm border border-primary/10">
 {otherName.charAt(0)}
 </div>
 <div className="flex-1 text-left">
 <div className="flex justify-between items-center mb-1.5">
 <h4 className="text-sm font-black text-slate-800">{otherName}</h4>
 <span className="text-[9px] font-bold text-slate-400 bg-slate-100/50 px-2 py-0.5 rounded-full">{chat.lastTime}</span>
 </div>
 <p className="text-xs text-slate-500 font-medium truncate max-w-[200px]">{chat.lastMessage}</p>
 </div>
 <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
 <ChevronRight size={16} />
 </div>
 </motion.button>
 );
 })
 )}
 </main>
 </div>
 </motion.div>
 );
};

export default Messages;
