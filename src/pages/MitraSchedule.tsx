import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar as CalendarIcon, Clock, Plus, CheckCircle2 } from 'lucide-react';

interface MitraScheduleProps {
  handleBack: () => void;
}

export const MitraSchedule: React.FC<MitraScheduleProps> = ({ handleBack }) => {
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());
  
  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      day: days[d.getDay()],
      date: d.getDate(),
      fullDate: d
    };
  });

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-slate-50 pb-24"
    >
      <header className="bg-white pt-12 pb-4 px-6 sticky top-0 z-50 border-b border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-black text-slate-800 tracking-tight">Jadwal Kerja</h1>
        </div>
        <button className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
          <Plus size={20} />
        </button>
      </header>

      <div className="p-5 space-y-6">
        {/* Calendar Strip */}
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
          {dates.map((d, i) => (
            <button
              key={i}
              onClick={() => setSelectedDate(d.date)}
              className={`flex flex-col items-center justify-center min-w-[60px] h-[80px] rounded-2xl transition-colors ${
                selectedDate === d.date 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-white text-slate-600 border border-slate-200 shadow-sm'
              }`}
            >
              <span className={`text-[10px] font-bold uppercase ${selectedDate === d.date ? 'text-white/80' : 'text-slate-400'}`}>
                {d.day}
              </span>
              <span className="text-xl font-black mt-1">{d.date}</span>
            </button>
          ))}
        </div>

        {/* Schedule List */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <CalendarIcon size={16} className="text-primary" />
            Jadwal Hari Ini
          </h2>
          
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex gap-4 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500"></div>
            <div className="flex flex-col items-center justify-center min-w-[60px] border-r border-slate-100 pr-4">
              <span className="text-sm font-black text-slate-800">09:00</span>
              <span className="text-[10px] font-bold text-slate-400">WIB</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-800">Servis AC Cuci</h3>
              <p className="text-xs text-slate-500 mt-1">Budi Santoso</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md text-[9px] font-bold flex items-center gap-1">
                  <CheckCircle2 size={10} /> Dikonfirmasi
                </span>
                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[9px] font-bold flex items-center gap-1">
                  <Clock size={10} /> 1 Jam
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex gap-4 relative overflow-hidden opacity-60">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-300"></div>
            <div className="flex flex-col items-center justify-center min-w-[60px] border-r border-slate-100 pr-4">
              <span className="text-sm font-black text-slate-800">13:00</span>
              <span className="text-[10px] font-bold text-slate-400">WIB</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-800">Instalasi Listrik</h3>
              <p className="text-xs text-slate-500 mt-1">Siti Aminah</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[9px] font-bold flex items-center gap-1">
                  <Clock size={10} /> Menunggu
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
