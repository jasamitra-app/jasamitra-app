import React from 'react';

interface BadgeProps {
  status: string;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const getStatusColor = (s: string) => {
    switch (s) {
      case 'aktif':
      case 'active':
        return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'nonaktif':
      case 'inactive':
        return 'bg-slate-100 text-slate-500 border-slate-200';
      case 'pending':
        return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'approved':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'rejected':
        return 'bg-red-100 text-red-600 border-red-200';
      default:
        return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  return (
    <span className={`text-[8px] font-extrabold px-2 py-1 rounded-full uppercase tracking-widest border ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};
