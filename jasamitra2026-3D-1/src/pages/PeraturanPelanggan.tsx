import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

interface PeraturanPelangganProps {
 handleBack: () => void;
}

export const PeraturanPelanggan: React.FC<PeraturanPelangganProps> = ({ handleBack }) => {
 return (
 <motion.div key="peraturan-pelanggan" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
 <PageHeader title="Peraturan Pelanggan" subtitle="Hak & Kewajiban Pengguna Jasa" onBack={handleBack} />
 <main className="px-6 pt-6 pb-12">
 <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 space-y-8 ">
 <div className="space-y-4">
 <div className="w-16 h-16 bg-primary/5 rounded-3xl flex items-center justify-center text-primary mb-6">
 <ShieldCheck size={32} />
 </div>
 <h3 className="text-xl font-black text-slate-800 tracking-tighter italic">Jaminan Keamanan <span className="text-primary">Pelanggan</span></h3>
 <p className="text-sm text-slate-500 leading-relaxed font-medium">
 Sebagai platform jasa terpercaya, kami berkomitmen menjaga keamanan transaksi Anda melalui sistem jaminan 10%.
 </p>
 </div>

 <div className="space-y-6 pt-6 border-t border-slate-50">
 {[
 { title: 'Sistem Pembayaran', desc: 'Pelanggan wajib membayar DP 10% melalui aplikasi sebagai jaminan pesanan. Sisa 90% dibayarkan tunai langsung ke mitra setelah pekerjaan selesai.' },
 { title: 'Pembatalan Pesanan', desc: 'Pembatalan oleh pelanggan setelah mitra berangkat akan dikenakan biaya administrasi dari nilai DP yang telah dibayarkan.' },
 { title: 'Keamanan Data', desc: 'Dilarang memberikan nomor WhatsApp atau kontak pribadi di dalam chat sebelum terjadi kesepakatan deal untuk menghindari penipuan.' },
 { title: 'Etika Berinteraksi', desc: 'Berkomunikasilah dengan sopan dan hargai profesi mitra. Segala bentuk pelecehan akan berakibat pada pemblokiran akun permanen.' }
 ].map((item, i) => (
 <div key={i} className="flex gap-4">
 <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-primary font-bold text-xs shrink-0">{i + 1}</div>
 <div>
 <h4 className="text-sm font-bold text-slate-800 mb-1">{item.title}</h4>
 <p className="text-xs text-slate-400 leading-relaxed font-medium">{item.desc}</p>
 </div>
 </div>
 ))}
 </div>

 <div className="bg-accent/10 p-6 rounded-3xl border border-accent/20">
 <div className="flex items-center gap-2 mb-2 text-accent">
 <AlertTriangle size={18} />
 <h4 className="text-xs font-bold uppercase tracking-widest">Peringatan Penting</h4>
 </div>
 <p className="text-[10px] text-accent font-medium leading-relaxed">
 JasaMitra tidak bertanggung jawab atas transaksi yang dilakukan di luar sistem aplikasi. Pastikan selalu menggunakan fitur "Deal" untuk perlindungan maksimal.
 </p>
 </div>
 </div>
 </main>
 </motion.div>
 );
};
