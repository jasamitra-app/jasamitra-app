import React from 'react';

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string | number;
  color: string;
  bg: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, color, bg }) => {
  return (
    <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${bg} ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-xl font-black text-slate-800">{value}</p>
      </div>
    </div>
  );
};
