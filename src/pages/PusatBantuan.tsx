import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, User, CreditCard, Settings, AlertTriangle, ChevronRight, MessageCircle, X, Wrench } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Page } from '../types';

interface PusatBantuanProps {
  userRole: 'pelanggan' | 'mitra' | 'admin' | null;
  handleBack: () => void;
  navigateTo: (page: Page) => void;
}

export const PusatBantuan: React.FC<PusatBantuanProps> = ({ userRole, handleBack, navigateTo }) => {
  const [showReportModal, setShowReportModal] = useState(false);

  const mitraMenuItems = [
    { id: 'bantuan-order', label: 'Masalah Order', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'bantuan-akun', label: 'Akun & Profil', icon: User, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'bantuan-pembayaran', label: 'Pembayaran', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'bantuan-aplikasi', label: 'Aplikasi Error', icon: Settings, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'laporkan-masalah', label: 'Laporkan Masalah', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const pelangganMenuItems = [
    { id: 'bantuan-pesanan-pelanggan', label: 'Pesanan Saya', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'bantuan-akun-pelanggan', label: 'Akun & Profil', icon: User, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'bantuan-pembayaran-pelanggan', label: 'Pembayaran', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'bantuan-layanan-pelanggan', label: 'Layanan Bermasalah', icon: Wrench, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'laporkan-masalah', label: 'Laporkan Masalah', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const menuItems = userRole === 'mitra' ? mitraMenuItems : pelangganMenuItems;
  const title = userRole === 'mitra' ? 'Pusat Bantuan Mitra' : 'Pusat Bantuan Pelanggan';

  const handleMenuClick = (id: string) => {
    if (id === 'laporkan-masalah') {
      setShowReportModal(true);
    } else {
      navigateTo(id as Page);
    }
  };

  return (
    <motion.div 
      key="pusat-bantuan"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen bg-slate-50 pb-24"
    >
      <PageHeader title={title} onBack={handleBack} />

      <main className="p-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-lg mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />
          <h2 className="text-xl font-black mb-2">Halo {userRole === 'mitra' ? 'Mitra' : 'Pelanggan'}!</h2>
          <p className="text-sm text-slate-300 opacity-90">
            Ada yang bisa kami bantu hari ini? Pilih topik di bawah untuk menemukan solusi dari masalah Anda.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {menuItems.map((item, index) => (
            <motion.button 
              key={item.id}
              whileHover={{ backgroundColor: 'rgba(248, 250, 252, 0.8)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleMenuClick(item.id)}
              className="w-full flex items-center justify-between p-5 transition-colors border-b border-slate-100/50 last:border-0"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${item.bg} rounded-2xl flex items-center justify-center ${item.color}`}>
                  <item.icon size={24} />
                </div>
                <span className="text-sm font-bold text-left text-slate-700">{item.label}</span>
              </div>
              <ChevronRight size={20} className="text-slate-300" />
            </motion.button>
          ))}
        </div>
      </main>

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReportModal(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-[32px] p-6 shadow-xl z-50"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                  <AlertTriangle size={24} />
                </div>
                <button 
                  onClick={() => setShowReportModal(false)}
                  className="p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>
              
              <h3 className="text-xl font-black text-slate-800 mb-2">Masalah apa yang Anda hadapi?</h3>
              <p className="text-sm text-slate-500 mb-6">Ceritakan kendala Anda kepada tim Customer Support kami. Kami siap membantu 24/7.</p>
              
              <button 
                onClick={() => {
                  setShowReportModal(false);
                  navigateTo('chat');
                }}
                className="w-full bg-slate-800 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-slate-800/20 active:scale-95 transition-transform"
              >
                <MessageCircle size={20} />
                Chat Customer Support
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
