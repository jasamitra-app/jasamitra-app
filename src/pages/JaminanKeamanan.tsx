import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

interface JaminanKeamananProps {
 handleBack: () => void;
}

export const JaminanKeamanan: React.FC<JaminanKeamananProps> = ({ handleBack }) => {
 return (
 <motion.div key="jaminan-keamanan" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
 <PageHeader title="Jaminan Keamanan" subtitle="Keamanan & Kepercayaan Anda" onBack={handleBack} />
 <main className="px-6 pt-6 pb-12">
 <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 space-y-8 ">
 <div className="space-y-4">
 <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-6">
 <ShieldCheck size={32} />
 </div>
 <h3 className="text-xl font-black text-slate-800 tracking-tighter">Jaminan Keamanan <span className="text-primary">Verified</span></h3>
 <p className="text-sm text-slate-500 leading-relaxed font-medium">
 JasaMitra berkomitmen menghadirkan layanan yang aman, transparan, dan terpercaya bagi seluruh pengguna.
 </p>
 </div>

 <div className="space-y-8 pt-6 border-t border-slate-50">
 {[
 { title: '1. Verifikasi Identitas Mitra', desc: 'Setiap mitra melalui proses verifikasi data dan identitas sebelum dapat memberikan layanan kepada pelanggan.' },
 { title: '2. Sistem Rating & Ulasan Terbuka', desc: 'Pelanggan dapat memberikan penilaian dan ulasan setelah layanan selesai, sehingga kualitas layanan mitra dapat terus terjaga secara transparan.' },
 { title: '3. Riwayat Layanan Tercatat', desc: 'Setiap pesanan dan aktivitas layanan tercatat dalam sistem untuk memastikan transparansi dan kemudahan pelacakan riwayat layanan.' },
 { title: '4. Dukungan Bantuan Pelanggan', desc: 'Tim dukungan siap membantu apabila pelanggan membutuhkan bantuan atau mengalami kendala selama proses layanan berlangsung.' }
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

 <div className="pt-8 border-t border-slate-50">
 <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
 <p className="text-xs text-slate-500 leading-relaxed font-bold text-center italic">
 "JasaMitra berkomitmen menghadirkan layanan yang aman, transparan, dan terpercaya bagi seluruh pengguna"
 </p>
 </div>
 </div>
 </div>
 </main>
 </motion.div>
 );
};
