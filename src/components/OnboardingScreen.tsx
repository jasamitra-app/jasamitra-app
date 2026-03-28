import React from 'react';
import { motion } from 'motion/react';
import { User, Handshake, ChevronRight } from 'lucide-react';

export const OnboardingScreen = ({ onSelect }: { onSelect: (role: 'pelanggan' | 'mitra') => void }) => {
 return (
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-[9998] bg-slate-900 text-white flex flex-col px-6 py-10 overflow-hidden perspective-[1000px]"
 >
 {/* 3D Background Elements */}
 <div className="absolute inset-0 overflow-hidden pointer-events-none">
 <motion.div 
 animate={{ 
 rotate: [0, 360],
 scale: [1, 1.2, 1],
 }}
 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
 className="absolute -top-[30%] -right-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-[#003366]/40 to-transparent blur-[100px]" 
 />
 <motion.div 
 animate={{ 
 rotate: [360, 0],
 scale: [1, 1.5, 1],
 }}
 transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
 className="absolute -bottom-[30%] -left-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-tl from-[#F27D26]/30 to-transparent blur-[100px]" 
 />
 </div>

 <div className="flex-1 flex flex-col justify-center relative z-10 ">
 <motion.div
 initial={{ y: 50, opacity: 0, rotateX: -30 }}
 animate={{ y: 0, opacity: 1, rotateX: 0 }}
 transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
 className=""
 >
 <motion.h2 
 animate={{ translateZ: 40 }}
 className="text-4xl font-black leading-tight tracking-tighter mb-4 "
 >
 Selamat Datang di <br/>
 <span className="text-white">JASA</span>
 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F27D26] to-yellow-400">MITRA</span>
 </motion.h2>
 <motion.p 
 animate={{ translateZ: 20 }}
 className="text-slate-300 text-xs font-medium leading-relaxed max-w-[260px] "
 >
 Pilih peran Anda untuk memulai pengalaman terbaik bersama kami.
 </motion.p>
 </motion.div>

 <div className="mt-10 space-y-4 ">
 <motion.button
 initial={{ x: -50, opacity: 0, rotateY: 30 }}
 animate={{ x: 0, opacity: 1, rotateY: 0 }}
 transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
 whileHover={{ scale: 1.05, translateZ: 30, rotateX: 5, rotateY: -5 }}
 whileTap={{ scale: 0.95, translateZ: 10 }}
 onClick={() => onSelect('pelanggan')}
 className="w-full bg-white/10 border border-slate-200 text-white p-5 rounded-[24px] flex items-center gap-4 shadow-sm group transition-all relative overflow-hidden "
 >
 <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
 
 <motion.div 
 animate={{ translateZ: 20 }}
 className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-sm border border-slate-200 relative z-10"
 >
 <User size={24} className="" />
 </motion.div>
 <motion.div animate={{ translateZ: 10 }} className="text-left relative z-10">
 <h3 className="font-bold text-lg ">Sebagai Pelanggan</h3>
 <p className="text-[11px] text-slate-300 font-medium mt-0.5">Cari jasa & pesan layanan</p>
 </motion.div>
 <motion.div animate={{ translateZ: 20 }} className="ml-auto relative z-10">
 <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary transition-colors">
 <ChevronRight size={18} />
 </div>
 </motion.div>
 </motion.button>

 <motion.button
 initial={{ x: -50, opacity: 0, rotateY: 30 }}
 animate={{ x: 0, opacity: 1, rotateY: 0 }}
 transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
 whileHover={{ scale: 1.05, translateZ: 30, rotateX: 5, rotateY: -5 }}
 whileTap={{ scale: 0.95, translateZ: 10 }}
 onClick={() => onSelect('mitra')}
 className="w-full bg-white/10 border border-slate-200 text-white p-5 rounded-[24px] flex items-center gap-4 shadow-sm group transition-all relative overflow-hidden "
 >
 <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
 
 <motion.div 
 animate={{ translateZ: 20 }}
 className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center text-white shadow-sm border border-slate-200 relative z-10"
 >
 <Handshake size={24} className="" />
 </motion.div>
 <motion.div animate={{ translateZ: 10 }} className="text-left relative z-10">
 <h3 className="font-bold text-lg ">Sebagai Mitra</h3>
 <p className="text-[11px] text-slate-300 font-medium mt-0.5">Tawarkan jasa & raih penghasilan</p>
 </motion.div>
 <motion.div animate={{ translateZ: 20 }} className="ml-auto relative z-10">
 <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-accent transition-colors">
 <ChevronRight size={18} />
 </div>
 </motion.div>
 </motion.button>
 </div>
 </div>

 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.8, duration: 0.8 }}
 className="text-center relative z-10 mt-auto"
 >
 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
 Dengan melanjutkan, Anda menyetujui <br/>
 <span className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white transition-colors cursor-pointer">Syarat & Ketentuan</span> kami
 </p>
 </motion.div>
 </motion.div>
 );
};
