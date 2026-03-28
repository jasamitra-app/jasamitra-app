import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, TrendingUp, Users, CheckCircle2, Star, DollarSign } from 'lucide-react';

interface MitraStatsProps {
  handleBack: () => void;
  transactions: any[];
  user: any;
}

export const MitraStats: React.FC<MitraStatsProps> = ({ handleBack, transactions, user }) => {
  const mitraTransactions = transactions.filter(t => t.mitraID === user?.uid);
  const completedTransactions = mitraTransactions.filter(t => t.status === 'completed');
  const totalRevenue = completedTransactions.reduce((sum, t) => sum + (t.totalPrice || 0), 0);
  
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
        <h1 className="text-lg font-black text-slate-800 tracking-tight">Statistik Mitra</h1>
      </header>

      <div className="p-5 space-y-4">
        <div className="bg-gradient-to-br from-primary to-blue-600 p-6 rounded-3xl shadow-sm text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <p className="text-sm font-medium text-white/80 mb-1">Total Pendapatan</p>
          <h2 className="text-3xl font-black mb-4">Rp {totalRevenue.toLocaleString()}</h2>
          <div className="flex items-center gap-2 text-xs font-medium bg-white/20 w-fit px-3 py-1.5 rounded-full">
            <TrendingUp size={14} /> +12% dari bulan lalu
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
              <CheckCircle2 size={20} className="text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-slate-800">{completedTransactions.length}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Pesanan Selesai</p>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mb-3">
              <Star size={20} className="text-amber-600" />
            </div>
            <p className="text-2xl font-black text-slate-800">4.8</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Rating Rata-rata</p>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <Users size={20} className="text-blue-600" />
            </div>
            <p className="text-2xl font-black text-slate-800">24</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Pelanggan Unik</p>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <DollarSign size={20} className="text-purple-600" />
            </div>
            <p className="text-2xl font-black text-slate-800">Rp 150k</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Rata-rata Order</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
