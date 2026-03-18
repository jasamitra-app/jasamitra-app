import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

interface ProtokolMitraProps {
 handleBack: () => void;
}

export const ProtokolMitra: React.FC<ProtokolMitraProps> = ({ handleBack }) => {
 return (
 <motion.div key="protokol-mitra" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
 <PageHeader title="Protokol Keselamatan & Profesionalisme" subtitle="Pedoman kerja bagi seluruh mitra" onBack={handleBack} />
 <main className="px-6 pt-6 pb-12">
 <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 space-y-8 ">
 <div className="space-y-4">
 <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-6">
 <ShieldCheck size={32} />
 </div>
 <h3 className="text-xl font-black text-slate-800 tracking-tighter">Protokol Keselamatan & <span className="text-primary">Profesionalisme</span></h3>
 <p className="text-sm text-slate-500 leading-relaxed font-medium">
 Pedoman kerja bagi seluruh mitra dalam memberikan layanan yang aman, profesional, and terpercaya.
 </p>
 </div>

 <div className="space-y-8 pt-6 border-t border-slate-50">
 {[
 { title: '1. Alat Pelindung Diri (APD)', desc: 'Gunakan perlengkapan keselamatan kerja yang sesuai dengan jenis pekerjaan untuk melindungi diri sendiri, pelanggan, dan lingkungan sekitar.' },
 { title: '2. Identitas Profesional', desc: 'Tunjukkan identitas diri yang jelas dan hadir dengan penampilan yang rapi serta profesional saat melayani pelanggan.' },
 { title: '3. Kebersihan Area Kerja', desc: 'Jaga kerapian selama proses pekerjaan berlangsung dan pastikan area kerja kembali bersih serta tertata setelah pekerjaan selesai.' },
 { title: '4. Komunikasi Sopan & Informatif', desc: 'Berkomunikasilah dengan bahasa yang santun, jelas, dan informatif agar pelanggan memahami proses pekerjaan yang dilakukan.' },
 { title: '5. Ketepatan Waktu', desc: 'Hadir sesuai jadwal yang telah disepakati dan berikan informasi kepada pelanggan apabila terjadi perubahan waktu atau keterlambatan.' },
 { title: '6. Kehati-hatian dalam Bekerja', desc: 'Laksanakan setiap pekerjaan dengan penuh kehati-hatian dan tanggung jawab untuk meminimalkan risiko serta menjaga keamanan properti pelanggan.' },
 { title: '7. Tanggung Jawab atas Pekerjaan', desc: 'Selesaikan pekerjaan sesuai standar layanan yang baik serta pastikan pelanggan mengetahui hasil pekerjaan yang telah dilakukan.' }
 ].map((item, i) => (
 <div key={i} className="flex gap-4">
 <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-xs shrink-0">{i + 1}</div>
 <div>
 <h4 className="text-sm font-black text-slate-800 mb-1">{item.title}</h4>
 <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </main>
 </motion.div>
 );
};
