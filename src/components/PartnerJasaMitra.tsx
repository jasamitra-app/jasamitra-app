import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Store } from 'lucide-react';
// import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
// import { db } from '../lib/firebase';

export interface Partner {
  id: string;
  name: string;
  imageUrl: string;
  link: string;
  slotIndex: number; // 1 to 9 (0 is reserved for SIDO)
}

export const PartnerJasaMitra: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    // TODO: UNTUK MENGHUBUNGKAN KE FIREBASE, BUKA KOMENTAR KODE DI BAWAH INI
    // Pastikan Anda sudah membuat collection 'partners' di Firestore Anda.
    
    /*
    const q = query(collection(db, 'partners'), orderBy('slotIndex', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const partnerData: Partner[] = [];
      snapshot.forEach((doc) => {
        partnerData.push({ id: doc.id, ...doc.data() } as Partner);
      });
      setPartners(partnerData);
    }, (error) => {
      console.error("Error fetching partners:", error);
    });

    return () => unsubscribe();
    */
  }, []);

  // 9 slot tambahan (Slot 2 sampai 10)
  const additionalSlots = 9;

  return (
    <section className="mb-10 relative z-20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-800 tracking-tight">Partner JasaMitra</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar -mx-5 px-5">
        
        {/* Banner 1: SIDO (Permanen / Promosi Utama) */}
        <motion.div
          whileHover={{ scale: 1.02, translateY: -4 }}
          whileTap={{ scale: 0.98 }}
          className="min-w-[240px] max-w-[240px] h-[135px] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-shrink-0 cursor-pointer snap-start transition-transform group relative"
          onClick={() => window.open('https://sido2026.vercel.app/', '_blank')}
        >
          <img src="https://i.ibb.co.com/N2F5vbXd/1774772885886.png" alt="Sinergi Driver Online" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
            <span className="text-white font-bold text-sm">Sinergi Driver Online</span>
          </div>
        </motion.div>

        {/* Banner 2-10: Dinamis dari Firebase atau Placeholder */}
        {[...Array(additionalSlots)].map((_, index) => {
          const slotIndex = index + 1; // Mulai dari 1 sampai 9
          // Cari apakah ada partner di slot ini dari Firebase
          const partner = partners.find(p => p.slotIndex === slotIndex);

          if (partner) {
            // Tampilkan Banner Partner dari Database
            return (
              <motion.div
                key={partner.id}
                whileHover={{ scale: 1.02, translateY: -4 }}
                whileTap={{ scale: 0.98 }}
                className="min-w-[240px] max-w-[240px] h-[135px] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-shrink-0 cursor-pointer snap-start transition-transform group relative"
                onClick={() => window.open(partner.link, '_blank')}
              >
                <img src={partner.imageUrl} alt={partner.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                  <span className="text-white font-bold text-sm">{partner.name}</span>
                </div>
              </motion.div>
            );
          } else {
            // Tampilkan Placeholder Kosong
            return (
              <motion.div
                key={`partner-empty-${slotIndex}`}
                whileHover={{ scale: 1.02, translateY: -4 }}
                whileTap={{ scale: 0.98 }}
                className="min-w-[240px] max-w-[240px] h-[135px] bg-slate-100 rounded-xl border border-dashed border-slate-300 shadow-sm overflow-hidden flex-shrink-0 cursor-pointer snap-start transition-transform group flex flex-col items-center justify-center"
                onClick={() => alert('Space Partner JasaMitra tersedia. Hubungi admin untuk mendaftar.')}
              >
                <Store size={28} className="text-slate-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-500">Space Partner Tersedia</span>
                <span className="text-[10px] text-slate-400 mt-1">Slot {slotIndex + 1}</span>
              </motion.div>
            );
          }
        })}
      </div>
    </section>
  );
};
