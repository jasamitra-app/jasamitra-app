import React, { useEffect } from 'react';
import { motion } from 'motion/react';

export const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    // Set to 10 seconds as requested
    const timer = setTimeout(onComplete, 10000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white overflow-hidden"
    >
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-blue-100 to-transparent blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-tl from-orange-100 to-transparent blur-[120px]" 
        />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full px-8">
        {/* Logo Container */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          className="relative mb-8"
        >
          <motion.div 
            animate={{ 
              y: [-8, 8, -8],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-32 h-32 flex items-center justify-center relative"
          >
            <img 
              src="https://i.ibb.co.com/k25Dk8Lz/JM-2.webp" 
              alt="JasaMitra Logo" 
              className="w-full h-full object-contain drop-shadow-xl" 
              referrerPolicy="no-referrer" 
            />
          </motion.div>
          
          {/* Glow effect behind logo */}
          <motion.div 
            animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-blue-200 blur-2xl rounded-full -z-10"
          />
        </motion.div>

        {/* Brand Name */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl font-black tracking-tight flex items-center justify-center gap-1">
            <span className="text-[#003366]">JASA</span>
            <span className="text-[#F27D26]">MITRA</span>
          </h1>
          <p className="text-[11px] text-slate-500 font-medium uppercase tracking-[0.3em] mt-3">
            Solusi Jasa Terpercaya
          </p>
        </motion.div>

        {/* 10-Second Progress Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-16 w-64 max-w-full flex flex-col items-center gap-3"
        >
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 10, ease: "linear" }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#003366] via-blue-500 to-[#F27D26] rounded-full"
            />
          </div>
          <motion.p 
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-[10px] text-slate-400 font-bold tracking-wider uppercase"
          >
            Menyiapkan Aplikasi...
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};
