import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface SemuaKategoriProps {
  CATEGORIES: any[];
  setSelectedCat: (cat: string) => void;
  setSelectedSub: (sub: string) => void;
  navigateTo: (page: any) => void;
  handleBack: () => void;
}

export const SemuaKategori: React.FC<SemuaKategoriProps> = ({
  CATEGORIES,
  setSelectedCat,
  setSelectedSub,
  navigateTo,
  handleBack
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-slate-50 pb-24"
    >
      <header className="bg-white pt-12 pb-4 px-6 sticky top-0 z-50 border-b border-slate-100 shadow-sm flex items-center gap-4">
        <button onClick={handleBack} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-black text-slate-800 tracking-tight">Semua Kategori</h1>
      </header>

      <div className="p-5">
        <div className="grid grid-cols-4 gap-y-6 gap-x-4">
          {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
            <motion.button 
              key={cat.id}
              whileHover={{ scale: 1.05, translateY: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedCat(cat.id);
                setSelectedSub('all');
                navigateTo('subkategori');
              }}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm relative overflow-hidden transition-all group-hover:bg-white group-hover:shadow-md">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <cat.icon size={24} strokeWidth={2} className="relative z-10 group-hover:text-primary transition-colors" />
              </div>
              <span className="text-[10px] font-bold text-slate-600 tracking-tight text-center leading-tight group-hover:text-primary transition-colors">{cat.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
