import React from 'react';
import { motion } from 'motion/react';
import { User, Handshake, ChevronRight } from 'lucide-react';

export const OnboardingScreen = ({ onSelect }: { onSelect: (role: 'pelanggan' | 'mitra') => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9998] bg-white text-slate-900 flex flex-col px-6 py-10 overflow-hidden"
    >
      {/* Soft Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #003366 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Soft floating orbs */}
      <motion.div 
        animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-96 h-96 rounded-full bg-[#003366]/5 blur-[100px]"
      />
      <motion.div 
        animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[#F27D26]/5 blur-[100px]"
      />

      <div className="flex-1 flex flex-col justify-center relative z-10">
        {/* LOGO SECTION - SAMA DENGAN SPLASHSCREEN */}
        {/* LOGO SECTION - DIPERBESAR */}
<motion.div
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
  className="mb-8"  // Ubah dari mb-6 ke mb-8 untuk spacing
>
  <div className="relative flex items-center justify-center">
    {/* Soft glow behind logo - DIPERBESAR */}
    <motion.div
      animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
      transition={{ duration: 4, repeat: Infinity }}
      className="absolute w-56 h-56 rounded-full bg-gradient-to-r from-[#F27D26]/10 to-[#003366]/10 blur-2xl"  // Dari w-40 h-40 jadi w-56 h-56
    />
    
    {/* Logo with floating animation - DIPERBESAR */}
    <motion.div
      animate={{ y: [-4, 4, -4] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="relative"
    >
<img 
  src="https://i.ibb.co.com/G3Crzbc1/jasamitra-logo.webp"
  alt="JASA MITRA Logo" 
  className="w-40 h-40 md:w-44 md:h-44 object-contain"  // w-40 h-40 untuk versi besar
  style={{
    filter: "drop-shadow(0 20px 25px rgba(0,51,102,0.25))"
  }}
/>

{/* Glow juga diperbesar */}
<motion.div
  animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
  transition={{ duration: 4, repeat: Infinity }}
  className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-[#F27D26]/10 to-[#003366]/10 blur-2xl"  // w-64 h-64
/>
    </motion.div>
  </div>
</motion.div>

        {/* WELCOME TEXT */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <motion.h2 
            animate={{ textShadow: ["0 2px 10px rgba(0,51,102,0.1)", "0 4px 15px rgba(0,51,102,0.2)", "0 2px 10px rgba(0,51,102,0.1)"] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-3xl md:text-4xl font-black leading-tight tracking-tight mb-3"
          >
            <span className="text-[#003366]">Selamat Datang</span> <br/>
            <span className="text-[#003366]">di </span>
            <span className="text-[#003366]">JASA</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F27D26] to-[#FFB84D]">MITRA</span>
          </motion.h2>
          <motion.p 
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="text-slate-600 text-sm font-medium leading-relaxed max-w-[280px]"
          >
            Pilih peran Anda untuk memulai pengalaman terbaik bersama kami.
          </motion.p>
        </motion.div>

        {/* BUTTONS */}
        <div className="space-y-4">
          {/* Pelanggan Button */}
          <motion.button
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('pelanggan')}
            className="w-full bg-white border-2 border-[#003366]/20 text-slate-900 p-5 rounded-2xl flex items-center gap-4 shadow-md hover:shadow-lg transition-all relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#003366]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="w-14 h-14 bg-[#003366] rounded-xl flex items-center justify-center text-white shadow-sm">
              <User size={24} />
            </div>
            
            <div className="text-left flex-1">
              <h3 className="font-bold text-lg text-[#003366]">Sebagai Pelanggan</h3>
              <p className="text-xs text-slate-500 mt-0.5">Cari jasa & pesan layanan</p>
            </div>
            
            <div className="w-8 h-8 rounded-full bg-[#003366]/10 flex items-center justify-center group-hover:bg-[#003366] group-hover:text-white transition-all">
              <ChevronRight size={18} className="text-[#003366] group-hover:text-white" />
            </div>
          </motion.button>

          {/* Mitra Button */}
          <motion.button
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('mitra')}
            className="w-full bg-white border-2 border-[#F27D26]/20 text-slate-900 p-5 rounded-2xl flex items-center gap-4 shadow-md hover:shadow-lg transition-all relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#F27D26]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="w-14 h-14 bg-gradient-to-r from-[#F27D26] to-[#FFB84D] rounded-xl flex items-center justify-center text-white shadow-sm">
              <Handshake size={24} />
            </div>
            
            <div className="text-left flex-1">
              <h3 className="font-bold text-lg text-[#F27D26]">Sebagai Mitra</h3>
              <p className="text-xs text-slate-500 mt-0.5">Tawarkan jasa & raih penghasilan</p>
            </div>
            
            <div className="w-8 h-8 rounded-full bg-[#F27D26]/10 flex items-center justify-center group-hover:bg-[#F27D26] group-hover:text-white transition-all">
              <ChevronRight size={18} className="text-[#F27D26] group-hover:text-white" />
            </div>
          </motion.button>
        </div>
      </div>

      {/* FOOTER */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="text-center relative z-10 mt-auto pt-6"
      >
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-relaxed">
          Dengan melanjutkan, Anda menyetujui <br/>
          <span className="text-[#003366] underline decoration-[#003366]/30 underline-offset-4 hover:decoration-[#003366] transition-all cursor-pointer font-semibold">
            Syarat & Ketentuan
          </span> kami
        </p>
      </motion.div>

      {/* Decorative corner lines */}
      <div className="absolute top-12 left-12 w-16 h-16 border-l-2 border-t-2 border-[#003366]/20 rounded-tl-2xl" />
      <div className="absolute bottom-12 right-12 w-16 h-16 border-r-2 border-b-2 border-[#F27D26]/20 rounded-br-2xl" />
    </motion.div>
  );
};

