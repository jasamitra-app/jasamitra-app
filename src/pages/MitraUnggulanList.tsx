import React from 'react';
import { motion } from 'motion/react';
import { PageHeader } from '../components/PageHeader';
import { Service } from '../constants';
import { Star, MapPin, Image as ImageIcon } from 'lucide-react';

interface MitraUnggulanListProps {
  services: Service[];
  handleBack: () => void;
  openMitraProfile: (mitra: Service) => void;
}

export const MitraUnggulanList: React.FC<MitraUnggulanListProps> = ({ services, handleBack, openMitraProfile }) => {
  const highlightServices = services.filter(s => s.isHighlight === true);

  return (
    <motion.div 
      key="mitra-unggulan" 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-slate-50 pb-24"
    >
      <PageHeader title="Mitra Unggulan" onBack={handleBack} />
      
      <main className="px-5 pt-6">
        <div className="grid grid-cols-1 gap-4">
          {highlightServices.length > 0 ? (
            highlightServices.map((service) => (
              <motion.div
                key={service.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openMitraProfile(service)}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex cursor-pointer"
              >
                <div className="w-1/3 min-w-[120px] bg-slate-200 relative flex items-center justify-center overflow-hidden">
                  {service.img || service.foto ? (
                    <img src={service.img || service.foto} alt={service.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <ImageIcon size={24} className="text-slate-400 opacity-50" />
                  )}
                  <div className="absolute top-2 left-2 bg-amber-500 text-white text-[8px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Star size={8} fill="currentColor" />
                    UNGGULAN
                  </div>
                </div>
                
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight mb-1">{service.title}</h3>
                    <p className="text-[10px] font-bold text-primary mb-2">{service.category}</p>
                    <div className="flex items-center gap-1 text-slate-500 mb-2">
                      <MapPin size={12} />
                      <span className="text-[10px]">{service.location || 'Lokasi tidak tersedia'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-amber-500" fill="currentColor" />
                      <span className="text-xs font-bold text-slate-700">{service.rating || 'Baru'}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800">
                      {service.price ? `Rp ${service.price.toLocaleString('id-ID')}` : 'Harga bervariasi'}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-10">
              <Star size={48} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-medium text-slate-500">Belum ada Mitra Unggulan saat ini.</p>
            </div>
          )}
        </div>
      </main>
    </motion.div>
  );
};
