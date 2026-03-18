import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Info, ArrowLeft } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

interface SyaratKetentuanProps {
 handleBack: () => void;
 navigateTo: (page: string) => void;
}

export const SyaratKetentuan: React.FC<SyaratKetentuanProps> = ({ handleBack, navigateTo }) => {
 return (
 <motion.div key="syarat-ketentuan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-slate-50">
 <PageHeader title="Syarat & Ketentuan" subtitle="JasaMitra - Tukang Jagoan" onBack={handleBack} />
 <main className="px-4 pt-6 pb-20">
 <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
 <div className="p-6 border-b border-slate-50 bg-slate-50/30">
 <div className="flex items-center gap-4">
 <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-sm ">
 <ShieldCheck size={28} />
 </div>
 <div>
 <h1 className="text-2xl font-black tracking-tighter">
 <span className="text-[#003366]">JASA</span>
 <span className="text-[#F27D26]">MITRA</span>
 </h1>
 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Legal & Compliance</p>
 </div>
 </div>
 </div>

 <div className="p-6 space-y-8">
 {/* Navigasi Cepat */}
 <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar sticky top-0 z-10 bg-white -mx-2 px-2 py-2">
 {[
 { id: 'umum', label: 'Ketentuan Umum' },
 { id: 'jaminan', label: 'Jaminan 10%' },
 { id: 'mitra', label: 'Mitra' },
 { id: 'pelanggan', label: 'Pelanggan' },
 ].map((nav) => (
 <button 
 key={nav.id}
 onClick={() => document.getElementById(nav.id)?.scrollIntoView({ behavior: 'smooth' })}
 className="px-5 py-2.5 rounded-full text-[11px] font-bold whitespace-nowrap bg-slate-50 text-slate-600 border border-slate-100 hover:bg-primary hover:text-white transition-all"
 >
 {nav.label}
 </button>
 ))}
 </div>

 {/* Konten Syarat & Ketentuan */}
 <div className="space-y-12">
 {/* Bagian 1: Ketentuan Umum */}
 <div id="umum" className="scroll-mt-24">
 <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
 <div className="w-2 h-6 bg-primary rounded-full" />
 KETENTUAN UMUM
 </h3>
 
 <div className="space-y-6">
 <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
 <h4 className="text-sm font-black text-slate-800 mb-3 uppercase tracking-tight">1. PENGGUNAAN APLIKASI JASAMITRA</h4>
 <p className="text-sm text-slate-500 leading-relaxed font-medium">
 JasaMitra adalah platform teknologi yang mempertemukan Pengguna (Pelanggan) dengan Mitra (Penyedia Jasa) untuk berbagai layanan perbaikan, servis, dan instalasi. Kami bukan penyedia jasa langsung, melainkan fasilitator yang memastikan transaksi berjalan aman dan terpercaya.
 </p>
 </div>
 
 <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
 <h4 className="text-sm font-black text-slate-800 mb-3 uppercase tracking-tight">2. PENDAFTARAN DAN AKUN</h4>
 <p className="text-sm text-slate-500 leading-relaxed mb-4 font-medium">
 Setiap Pengguna wajib mendaftar dan memiliki akun untuk mengakses layanan JasaMitra. Data yang diberikan harus benar dan dapat dipertanggungjawabkan. Pengguna bertanggung jawab penuh atas keamanan akun dan aktivitas yang dilakukan.
 </p>
 <ul className="text-sm text-slate-500 leading-relaxed space-y-3 list-disc ml-5 font-bold">
 <li>Pengguna dilarang memberikan akses akun kepada pihak lain.</li>
 <li>JasaMitra berhak menonaktifkan akun jika ditemukan pelanggaran.</li>
 <li>Data pribadi akan dilindungi sesuai Kebijakan Privasi.</li>
 </ul>
 </div>
 </div>
 </div>

 {/* Bagian 2: JAMINAN KEAMANAN TRANSAKSI 10% */}
 <div id="jaminan" className="scroll-mt-24 bg-primary/5 rounded-[40px] p-8 border border-primary/10">
 <div className="flex items-center gap-4 mb-8">
 <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-sm ">
 <ShieldCheck size={24} />
 </div>
 <h3 className="text-xl font-black text-primary tracking-tight">JAMINAN KEAMANAN TRANSAKSI 10%</h3>
 </div>
 
 <div className="space-y-6">
 {[
 { id: 1, title: 'Biaya Layanan', desc: 'Jaminan keamanan transaksi adalah BIAYA LAYANAN sebesar 10% dari nilai kesepakatan.', sub: 'Contoh: Deal Rp 1.000.000 → Biaya jaminan Rp 100.000 ke aplikasi, sisanya Rp 900.000 ke mitra.' },
 { id: 2, title: 'Bukan Simpanan', desc: 'Biaya layanan ini BUKAN merupakan simpanan atau titipan dana perbankan.', sub: 'Kami hanya memfasilitasi jaminan, bukan bank atau lembaga keuangan.' },
 { id: 3, title: 'Fungsi Biaya', desc: 'Biaya layanan berfungsi sebagai jaminan komitmen Mitra, kompensasi pembatalan, dan dana perlindungan transaksi.', sub: 'Memastikan kedua belah pihak terlindungi secara profesional.' },
 { id: 4, title: 'Regulasi', desc: 'PT JasaMitra Indonesia BUKAN merupakan penyelenggara sistem pembayaran sebagaimana dimaksud dalam peraturan Bank Indonesia/OJK.', sub: 'Sesuai dengan regulasi platform teknologi di Indonesia.' },
 { id: 5, title: 'Sisa Pembayaran', desc: 'Sisa pembayaran (90%) dilakukan langsung antara Pengguna dan Mitra di luar sistem JasaMitra.', sub: 'Dibayarkan tunai atau transfer langsung ke Mitra setelah pekerjaan selesai.' }
 ].map((item) => (
 <div key={item.id} className="flex gap-5 bg-white p-6 rounded-3xl shadow-sm border border-primary/5">
 <div className="w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center text-sm font-black shrink-0 shadow-sm ">{item.id}</div>
 <div>
 <p className="text-sm font-black text-slate-800 mb-1">{item.title}</p>
 <p className="text-sm text-slate-600 font-bold leading-relaxed mb-1">{item.desc}</p>
 <p className="text-[11px] text-slate-400 font-medium italic">{item.sub}</p>
 </div>
 </div>
 ))}
 </div>
 
 <div className="bg-primary text-white p-6 rounded-3xl mt-8 shadow-sm ">
 <div className="flex items-center gap-3 mb-2">
 <Info size={18} />
 <p className="text-xs font-black uppercase tracking-widest">Penting Diperhatikan</p>
 </div>
 <p className="text-sm font-bold leading-relaxed">
 Dengan menggunakan JasaMitra, Anda menyetujui mekanisme jaminan 10% ini sebagai bentuk perlindungan bersama demi kenyamanan transaksi.
 </p>
 </div>
 </div>

 {/* Bagian 3: Ketentuan Mitra */}
 <div id="mitra" className="scroll-mt-24">
 <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
 <div className="w-2 h-6 bg-primary rounded-full" />
 KETENTUAN MITRA
 </h3>
 <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100">
 <ul className="text-sm text-slate-600 space-y-4 list-disc ml-5 font-bold leading-relaxed">
 <li>Mitra wajib menyelesaikan pekerjaan sesuai kesepakatan dengan Pengguna.</li>
 <li>Mitra dilarang meminta pembayaran di luar mekanisme yang ditentukan.</li>
 <li>Jika Mitra membatalkan sepihak, jaminan 10% akan dikembalikan kepada Pengguna.</li>
 <li>Mitra wajib menjaga etika, kesopanan, dan keamanan saat di lokasi Pengguna.</li>
 <li>Pelanggaran berat (penipuan, pelecehan, pencurian) akan diproses secara hukum.</li>
 </ul>
 </div>
 </div>

 {/* Bagian 4: Ketentuan Pelanggan */}
 <div id="pelanggan" className="scroll-mt-24">
 <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
 <div className="w-2 h-6 bg-primary rounded-full" />
 KETENTUAN PELANGGAN
 </h3>
 <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100">
 <ul className="text-sm text-slate-600 space-y-4 list-disc ml-5 font-bold leading-relaxed">
 <li>Pelanggan wajib membayar jaminan 10% sesuai kesepakatan sebelum pekerjaan dimulai.</li>
 <li>Pelanggan wajib memberikan informasi yang jelas dan benar mengenai pekerjaan.</li>
 <li>Jika Pelanggan membatalkan sepihak setelah Mitra datang, jaminan 10% menjadi hak Mitra.</li>
 <li>Pelanggan wajib membayar sisa 90% langsung kepada Mitra setelah pekerjaan selesai.</li>
 <li>Pelanggan dapat memberikan rating dan ulasan untuk membantu pengguna lain.</li>
 </ul>
 </div>
 </div>

 {/* Footer */}
 <div className="pt-12 border-t border-slate-100 text-center space-y-6">
 <p className="text-xs text-slate-400 font-bold leading-relaxed">
 © 2026 PT JasaMitra Indonesia. Hak Cipta Dilindungi.<br />
 Terakhir diperbarui: 24 Februari 2026
 </p>
 <div className="flex justify-center gap-6">
 <button onClick={() => navigateTo('kebijakan')} className="text-xs font-black text-primary uppercase tracking-widest">Kebijakan Privasi</button>
 <div className="w-px h-4 bg-slate-200" />
 <button onClick={() => navigateTo('syarat-ketentuan')} className="text-xs font-black text-primary uppercase tracking-widest">Syarat & Ketentuan</button>
 </div>
 </div>
 </div>
 </div>
 </div>

 <div className="mt-10 text-center">
 <button 
 onClick={() => navigateTo('akun')}
 className="bg-primary text-white px-10 py-5 rounded-full text-sm font-black uppercase tracking-[0.2em] shadow-sm active:scale-95 transition-all flex items-center gap-3 mx-auto"
 >
 <ArrowLeft size={20} /> Kembali ke Akun
 </button>
 </div>
 </main>
 </motion.div>
 );
};
