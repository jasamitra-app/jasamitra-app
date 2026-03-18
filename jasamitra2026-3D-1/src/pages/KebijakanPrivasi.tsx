import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, AlertTriangle, ArrowLeft } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

interface KebijakanPrivasiProps {
 handleBack: () => void;
 navigateTo: (page: string) => void;
}

export const KebijakanPrivasi: React.FC<KebijakanPrivasiProps> = ({ handleBack, navigateTo }) => {
 return (
 <motion.div key="kebijakan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-slate-50">
 <PageHeader title="Kebijakan Privasi" subtitle="Keamanan & Perlindungan Data" onBack={handleBack} />
 <main className="px-4 pt-6 pb-20">
 <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
 <div className="p-8 border-b border-slate-50 bg-slate-50/30">
 <div className="flex items-center gap-5">
 <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-sm ">
 <ShieldCheck size={32} />
 </div>
 <div>
 <h1 className="text-2xl font-black tracking-tighter text-primary">PRIVASI & <span className="text-accent">KEAMANAN</span></h1>
 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Data Protection Officer</p>
 </div>
 </div>
 </div>

 <div className="p-8 space-y-12">
 {/* Bagian 1: Syarat Penggunaan */}
 <section className="space-y-6">
 <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
 <div className="w-2 h-6 bg-primary rounded-full" />
 1. SYARAT & KETENTUAN PENGGUNAAN
 </h3>
 <div className="space-y-4">
 <p className="text-sm text-slate-600 leading-relaxed font-medium">
 Selamat datang di platform JasaMitra, sebuah layanan teknologi yang mempertemukan Pengguna (Pemberi Kerja) dengan Mitra (Penyedia Jasa) untuk berbagai layanan perbaikan, servis, dan instalasi. Dengan mengakses dan menggunakan aplikasi JasaMitra, Anda dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang berlaku.
 </p>
 <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
 <p className="text-sm text-slate-600 leading-relaxed font-bold italic">
 "JasaMitra bertindak sebagai fasilitator yang mempertemukan kedua belah pihak dan bukan merupakan penyedia jasa langsung."
 </p>
 </div>
 <p className="text-sm text-slate-600 leading-relaxed font-medium">
 Seluruh perjanjian kerja, kesepakatan harga, dan pelaksanaan pekerjaan merupakan tanggung jawab masing-masing pihak. JasaMitra hanya menyediakan platform dan sistem jaminan keamanan untuk melindungi kedua belah pihak dari risiko penipuan dan wanprestasi.
 </p>
 </div>
 </section>

 {/* Bagian 2: Kebijakan Privasi */}
 <section className="space-y-6">
 <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
 <div className="w-2 h-6 bg-primary rounded-full" />
 2. KEBIJAKAN PRIVASI & PERLINDUNGAN DATA
 </h3>
 <div className="bg-primary/5 p-8 rounded-[40px] border border-primary/10 space-y-6">
 <p className="text-sm text-slate-700 leading-relaxed font-bold">
 PT JasaMitra Indonesia berkomitmen untuk melindungi data pribadi Anda sesuai dengan Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP).
 </p>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {[
 'Nama Lengkap & Email',
 'Nomor Telepon & WhatsApp',
 'Alamat Domisili',
 'Foto KTP & Swafoto',
 'Dokumen SKCK',
 'Informasi Rekening Bank'
 ].map((item, idx) => (
 <div key={idx} className="bg-white p-4 rounded-2xl flex items-center gap-3 shadow-sm border border-primary/5">
 <div className="w-2 h-2 bg-primary rounded-full" />
 <span className="text-xs font-bold text-slate-600">{item}</span>
 </div>
 ))}
 </div>
 <p className="text-sm text-slate-600 leading-relaxed font-medium">
 Data yang kami kumpulkan digunakan semata-mata untuk keperluan verifikasi identitas, keamanan transaksi, dan pencegahan tindak penipuan. Kami tidak akan pernah menjual, menyewakan, atau menukar data pribadi Anda kepada pihak ketiga untuk tujuan komersial.
 </p>
 </div>
 </section>

 {/* Bagian 3: Keamanan & Verifikasi */}
 <section className="space-y-6">
 <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
 <div className="w-2 h-6 bg-primary rounded-full" />
 3. KEBIJAKAN KEAMANAN & VERIFIKASI MITRA
 </h3>
 <div className="space-y-6">
 <div className="bg-rose-50 p-8 rounded-[40px] border border-rose-100">
 <div className="flex items-center gap-3 mb-4 text-rose-600">
 <AlertTriangle size={24} />
 <h4 className="text-base font-black uppercase tracking-tight">Zero Tolerance Policy</h4>
 </div>
 <p className="text-sm text-rose-800 leading-relaxed font-bold">
 JasaMitra menerapkan kebijakan toleransi nol terhadap segala bentuk tindak kekerasan, pelecehan seksual, pencurian, intimidasi, atau penipuan. Setiap pelanggaran akan ditindak tegas dengan pemblokiran akun permanen dan pelaporan kepada pihak kepolisian.
 </p>
 </div>
 
 <p className="text-sm text-slate-600 leading-relaxed font-medium">
 Keamanan Pengguna adalah prioritas utama kami. Setiap Mitra wajib melewati proses verifikasi identitas berlapis yang mencakup pemeriksaan keaslian KTP, validasi wajah, verifikasi rekening bank, dan pemeriksaan SKCK yang masih berlaku.
 </p>

 <div className="bg-accent/10 p-8 rounded-[40px] border border-accent/20">
 <h4 className="text-sm font-black text-accent mb-3 uppercase tracking-widest flex items-center gap-2">
 <ShieldCheck size={18} /> Sistem Escrow Jaminan 10%
 </h4>
 <p className="text-sm text-accent font-bold leading-relaxed">
 Kami menyediakan sistem jaminan 10% dari nilai kesepakatan untuk melindungi kedua belah pihak. Jaminan ini ditahan oleh sistem selama proses pekerjaan berlangsung untuk meminimalisir risiko kerugian akibat pembatalan sepihak atau ketidaksesuaian hasil pekerjaan.
 </p>
 </div>
 </div>
 </section>

 {/* Persetujuan */}
 <div className="pt-12 border-t border-slate-100">
 <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-sm ">
 <p className="text-sm font-medium leading-relaxed opacity-80 mb-6">
 Dengan menggunakan layanan JasaMitra, Anda menyatakan setuju untuk tunduk pada seluruh kebijakan, syarat, dan ketentuan yang telah diuraikan di atas. JasaMitra berhak untuk melakukan perubahan terhadap kebijakan ini sewaktu-waktu.
 </p>
 <button 
 onClick={handleBack}
 className="w-full bg-primary text-white py-5 rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-sm active:scale-95 transition-all"
 >
 Saya Mengerti & Setuju
 </button>
 </div>
 </div>
 </div>
 </div>

 <div className="mt-10 text-center">
 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">
 Terakhir diperbarui: 05 Maret 2026
 </p>
 <button 
 onClick={() => navigateTo('akun')}
 className="bg-white border border-slate-200 px-10 py-5 rounded-full text-xs font-black text-slate-600 uppercase tracking-[0.2em] shadow-sm active:scale-95 transition-all flex items-center gap-3 mx-auto"
 >
 <ArrowLeft size={18} /> Kembali ke Akun
 </button>
 </div>
 </main>
 </motion.div>
 );
};
