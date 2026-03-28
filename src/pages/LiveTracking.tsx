import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Phone, MessageSquare, Navigation } from 'lucide-react';

interface LiveTrackingProps {
  handleBack: () => void;
}

export const LiveTracking: React.FC<LiveTrackingProps> = ({ handleBack }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-slate-50 relative"
    >
      {/* Fake Map Background */}
      <div className="absolute inset-0 z-0 bg-slate-200 overflow-hidden">
        <div className="w-full h-full opacity-30" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
        {/* Route Line */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-blue-500 rounded-full border-t-transparent border-r-transparent transform rotate-45 opacity-50"></div>
        {/* Mitra Marker */}
        <motion.div 
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg border-4 border-white">
            <Navigation size={20} className="text-white fill-white transform rotate-45" />
          </div>
        </motion.div>
        {/* Destination Marker */}
        <div className="absolute top-1/3 left-1/3 z-10">
          <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <MapPin size={14} className="text-white fill-white" />
          </div>
        </div>
      </div>

      <header className="absolute top-12 left-6 z-50">
        <button onClick={handleBack} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-800 shadow-lg hover:bg-slate-50 transition-colors">
          <ArrowLeft size={24} />
        </button>
      </header>

      {/* Bottom Sheet Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 p-6 pb-12">
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-800">Mitra sedang menuju lokasi</h2>
            <p className="text-sm font-bold text-slate-500 mt-1">Estimasi tiba: 15 Menit</p>
          </div>
          <div className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-[10px] font-bold">
            2.5 km
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img src="https://picsum.photos/seed/mitra1/200" alt="Mitra" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-slate-800">Ahmad Teknisi</h3>
            <p className="text-xs text-slate-500">B 1234 XYZ • Honda Beat</p>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 hover:bg-emerald-200 transition-colors">
              <Phone size={18} />
            </button>
            <button className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors">
              <MessageSquare size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
