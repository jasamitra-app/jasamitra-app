import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Download, CheckCircle2 } from 'lucide-react';

interface InvoiceProps {
  handleBack: () => void;
}

export const Invoice: React.FC<InvoiceProps> = ({ handleBack }) => {
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
        <h1 className="text-lg font-black text-slate-800 tracking-tight">Invoice Digital</h1>
      </header>

      <div className="p-5">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-black text-slate-800">INVOICE</h2>
              <p className="text-xs font-bold text-slate-400 mt-1">INV-20260328-001</p>
            </div>
            <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
              <CheckCircle2 size={12} /> LUNAS
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Diterbitkan Kepada</p>
              <p className="text-sm font-bold text-slate-800">Budi Santoso</p>
              <p className="text-xs text-slate-500">budi@example.com</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Mitra Jasa</p>
              <p className="text-sm font-bold text-slate-800">Ahmad Teknisi</p>
              <p className="text-xs text-slate-500">Servis AC & Elektronik</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mb-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Detail Layanan</p>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-bold text-slate-800">Servis AC Cuci</p>
              <p className="text-sm font-bold text-slate-800">Rp 75.000</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-500">Biaya Layanan</p>
              <p className="text-xs text-slate-500">Rp 5.000</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mb-6">
            <div className="flex justify-between items-center">
              <p className="text-sm font-black text-slate-800">Total Pembayaran</p>
              <p className="text-lg font-black text-primary">Rp 80.000</p>
            </div>
          </div>

          <button 
            onClick={() => alert('Invoice sedang diunduh...')}
            className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm shadow-sm flex items-center justify-center gap-2"
          >
            <Download size={18} /> Unduh PDF
          </button>
        </div>
      </div>
    </motion.div>
  );
};
