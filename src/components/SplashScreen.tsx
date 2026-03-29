import React, { useEffect } from 'react';
import { motion } from 'motion/react';

export const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white overflow-hidden"
    >
      {/* Soft Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #003366 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Soft floating orbs - very subtle */}
      <motion.div 
        animate={{ 
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-96 h-96 rounded-full bg-[#003366]/5 blur-[100px]"
      />
      <motion.div 
        animate={{ 
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[#F27D26]/5 blur-[100px]"
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 w-full max-w-lg mx-auto">
        
        {/* LOGO */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="mb-8"
        >
          <div className="relative flex items-center justify-center">
            {/* Soft glow behind logo */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-[#F27D26]/10 to-[#003366]/10 blur-3xl"
            />
            
            {/* Logo with floating animation */}
            <motion.div
              animate={{ 
                y: [-6, 6, -6],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <img 
                src="https://i.ibb.co.com/G3Crzbc1/jasamitra-logo.webp"
                alt="JASAMITRA Logo" 
                className="w-52 h-52 md:w-64 md:h-64 object-contain"
                style={{
                  filter: "drop-shadow(0 20px 25px rgba(0,51,102,0.15))"
                }}
                onError={(e) => {
                  e.currentTarget.src = "/images/logo.png";
                }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* TEXT SECTION - JASA biru navy, MITRA orange */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center space-y-4"
        >
          <motion.h1 
            animate={{ 
              textShadow: [
                "0 2px 10px rgba(0,51,102,0.1)",
                "0 4px 15px rgba(0,51,102,0.2)",
                "0 2px 10px rgba(0,51,102,0.1)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-5xl md:text-7xl font-black tracking-tight"
          >
            <span className="text-[#003366] drop-shadow-sm">JASA</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F27D26] to-[#FFB84D] ml-3 drop-shadow-sm">
              MITRA
            </span>
          </motion.h1>
          
          <motion.p
            animate={{ 
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="text-sm md:text-base text-slate-600 font-medium tracking-[0.3em] uppercase"
          >
            Solusi Jasa Terpercaya
          </motion.p>
        </motion.div>

        {/* Loading Bar - navy blue */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-16 w-64 max-w-[80%]"
        >
          <div className="relative h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.8, 
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#003366] to-transparent"
              style={{
                boxShadow: "0 0 10px rgba(0,51,102,0.3)"
              }}
            />
          </div>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-xs text-slate-500 text-center mt-3 tracking-[0.2em] font-light"
          >
            LOADING
          </motion.p>
        </motion.div>
      </div>

      {/* Decorative corner lines - navy */}
      <div className="absolute top-12 left-12 w-16 h-16 border-l-2 border-t-2 border-[#003366]/20 rounded-tl-2xl" />
      <div className="absolute bottom-12 right-12 w-16 h-16 border-r-2 border-b-2 border-[#F27D26]/20 rounded-br-2xl" />
      
      {/* Small decorative dots */}
      <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-[#003366]/20 rounded-full" />
      <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-[#F27D26]/20 rounded-full" />
    </motion.div>
  );
};
