import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Handshake } from 'lucide-react';

export const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
 useEffect(() => {
 const timer = setTimeout(onComplete, 3500);
 return () => clearTimeout(timer);
 }, [onComplete]);

 return (
 <motion.div 
 initial={{ opacity: 1 }}
 exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
 className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900 overflow-hidden perspective-[1000px]"
 >
 {/* 3D Background Elements */}
 <div className="absolute inset-0 overflow-hidden pointer-events-none">
 <motion.div 
 animate={{ 
 rotate: [0, 360],
 scale: [1, 1.2, 1],
 }}
 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
 className="absolute -top-[30%] -left-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-[#003366]/40 to-transparent blur-[100px]" 
 />
 <motion.div 
 animate={{ 
 rotate: [360, 0],
 scale: [1, 1.5, 1],
 }}
 transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
 className="absolute -bottom-[30%] -right-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-tl from-[#F27D26]/30 to-transparent blur-[100px]" 
 />
 </div>

 <div className="relative z-10 flex flex-col items-center ">
 <motion.div 
 initial={{ scale: 0, rotateX: 90, opacity: 0 }}
 animate={{ scale: 1, rotateX: 0, opacity: 1 }}
 transition={{ duration: 1.2, type: "spring", bounce: 0.5 }}
 className="relative mb-10"
 >
 {/* 3D Floating Logo Box */}
 <motion.div 
 animate={{ 
 y: [-8, 8, -8],
 rotateY: [-5, 5, -5],
 rotateX: [5, -5, 5]
 }}
 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
 className="w-32 h-32 bg-white/10 rounded-[32px] flex items-center justify-center shadow-sm border border-slate-200 relative overflow-hidden "
 >
 <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-50" />
 
 {/* Inner 3D Element */}
 <motion.div
 animate={{ translateZ: 40 }}
 className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-white relative z-10"
 >
 <Handshake size={40} className="text-[#003366] " />
 </motion.div>
 </motion.div>
 
 {/* Floor Shadow */}
 <motion.div 
 animate={{ 
 scale: [1, 0.8, 1],
 opacity: [0.5, 0.2, 0.5]
 }}
 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
 className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-24 h-3 bg-black/40 blur-xl rounded-full"
 />
 </motion.div>

 <motion.div
 initial={{ y: 30, opacity: 0, rotateX: -45 }}
 animate={{ y: 0, opacity: 1, rotateX: 0 }}
 transition={{ delay: 0.5, duration: 1, type: "spring" }}
 className="text-center "
 >
 <motion.h1 
 animate={{ translateZ: 30 }}
 className="text-5xl font-black tracking-tight flex items-center justify-center "
 >
 <span className="text-white">JASA</span>
 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F27D26] to-yellow-400">MITRA</span>
 </motion.h1>
 <motion.p 
 animate={{ translateZ: 20 }}
 className="text-xs text-slate-300 font-bold uppercase tracking-[0.4em] mt-4 "
 >
 Solusi Jasa Terpercaya
 </motion.p>
 </motion.div>

 {/* 3D Loading Bar */}
 <motion.div 
 initial={{ opacity: 0, scale: 0 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: 1, duration: 0.5, type: "spring" }}
 className="mt-16 w-48 h-1.5 bg-slate-800/50 rounded-full overflow-hidden relative shadow-sm border border-slate-200"
 >
 <motion.div 
 initial={{ x: '-100%' }}
 animate={{ x: '100%' }}
 transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
 className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-[#F27D26] to-transparent rounded-full shadow-sm"
 />
 </motion.div>
 </div>
 </motion.div>
 );
};
