import React from 'react';
import { motion } from 'motion/react';
import { User, ChevronRight, Sparkles } from 'lucide-react';

export const OnboardingScreen = ({ onSelect }: { onSelect: (role: 'pelanggan' | 'mitra') => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9998] bg-slate-50 text-slate-800 flex flex-col px-6 py-10 overflow-hidden"
    >
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-100/50 rounded-full blur-3xl" />
      </div>

      <div className="flex-1 flex flex-col justify-center relative z-10 max-w-md mx-auto w-full">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center p-2 bg-white rounded-3xl shadow-sm border border-slate-100 mb-6">
            <img 
              src="https://i.ibb.co.com/k25Dk8Lz/JM-2.webp" 
              alt="JasaMitra Logo" 
              className="w-16 h-16 object-contain" 
              referrerPolicy="no-referrer" 
            />
          </div>
          <h2 className="text-3xl font-black leading-tight tracking-tight mb-3 text-slate-900">
            Selamat Datang di <br/>
            <span className="text-[#003366]">Jasa</span>
            <span className="text-[#F27D26]">Mitra</span>
          </h2>
          <p className="text-slate-500 text-sm font-medium leading-relaxed px-4">
            Pilih peran Anda untuk memulai pengalaman terbaik bersama kami.
          </p>
        </motion.div>

        <div className="space-y-4">
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
            whileHover={{ scale: 1.02, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('pelanggan')}
            className="w-full bg-white border-2 border-transparent hover:border-blue-100 p-5 rounded-[24px] flex items-center gap-4 shadow-sm hover:shadow-md transition-all group text-left relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#003366] group-hover:bg-[#003366] group-hover:text-white transition-colors relative z-10">
              <User size={24} />
            </div>
            <div className="flex-1 relative z-10">
              <h3 className="font-bold text-lg text-slate-800 group-hover:text-[#003366] transition-colors">Sebagai Pelanggan</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Cari jasa & pesan layanan dengan mudah</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-[#003366] transition-colors relative z-10">
              <ChevronRight size={18} />
            </div>
          </motion.button>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
            whileHover={{ scale: 1.02, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('mitra')}
            className="w-full bg-white border-2 border-transparent hover:border-orange-100 p-5 rounded-[24px] flex items-center gap-4 shadow-sm hover:shadow-md transition-all group text-left relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-[#F27D26] group-hover:bg-[#F27D26] group-hover:text-white transition-colors relative z-10">
              <Sparkles size={24} />
            </div>
            <div className="flex-1 relative z-10">
              <h3 className="font-bold text-lg text-slate-800 group-hover:text-[#F27D26] transition-colors">Sebagai Mitra</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Tawarkan jasa & raih penghasilan tambahan</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-orange-100 group-hover:text-[#F27D26] transition-colors relative z-10">
              <ChevronRight size={18} />
            </div>
          </motion.button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="text-center relative z-10 mt-auto"
      >
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
          Dengan melanjutkan, Anda menyetujui <br/>
          <span className="text-[#003366] underline decoration-blue-200 underline-offset-4 hover:decoration-[#003366] transition-colors cursor-pointer">Syarat & Ketentuan</span> kami
        </p>
      </motion.div>
    </motion.div>
  );
};
