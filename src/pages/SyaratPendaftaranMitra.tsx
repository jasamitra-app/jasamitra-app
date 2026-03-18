import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PageHeader } from '../components/PageHeader';

interface SyaratPendaftaranMitraProps {
 handleBack: () => void;
}

export const SyaratPendaftaranMitra: React.FC<SyaratPendaftaranMitraProps> = ({ handleBack }) => {
 const [isTermsAccepted, setIsTermsAccepted] = useState(false);

 return (
 <motion.div key="syarat-pendaftaran-mitra" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="min-h-screen bg-slate-50">
 <PageHeader title="Syarat Pendaftaran Mitra" subtitle="JasaMitra - Profesional & Terpercaya" onBack={handleBack} />
 <main className="px-4 pt-6 pb-20">
 <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 space-y-8">
 <div className="space-y-4">
 <h3 className="text-lg font-black text-slate-800 tracking-tight">Syarat Pendaftaran Mitra JasaMitra</h3>
 <p className="text-sm text-slate-500 leading-relaxed font-medium">
 Untuk menjaga kualitas layanan dan kepercayaan pelanggan, setiap calon mitra yang ingin bergabung di platform JasaMitra wajib memenuhi persyaratan berikut:
 </p>
 </div>

 <div className="space-y-6">
 {[
 { title: 'Identitas Diri', desc: 'Memiliki identitas diri yang sah dan masih berlaku (KTP atau identitas resmi lainnya).' },
 { title: 'Keahlian Sesuai Bidang', desc: 'Memiliki keterampilan atau pengalaman kerja sesuai dengan layanan jasa yang didaftarkan.' },
 { title: 'Peralatan Kerja', desc: 'Memiliki atau mampu menyediakan peralatan kerja yang memadai sesuai dengan jenis pekerjaan yang ditawarkan.' },
 { title: 'Sikap Profesional', desc: 'Bersedia bekerja secara profesional, menjaga etika komunikasi, serta memberikan pelayanan yang ramah dan bertanggung jawab kepada pelanggan.' },
 { title: 'Kepatuhan Protokol Kerja', desc: 'Bersedia mematuhi standar keselamatan kerja, penggunaan alat pelindung kerja, kebersihan area kerja, serta identitas profesional selama menjalankan pekerjaan.' },
 { title: 'Sistem Bagi Hasil Platform', desc: 'Bersedia mengikuti sistem bagi hasil platform sebesar 10% dari nilai transaksi yang diperoleh melalui aplikasi JasaMitra.' },
 { title: 'Verifikasi Data', desc: 'Bersedia mengikuti proses verifikasi data oleh tim JasaMitra untuk memastikan keaslian identitas dan kualitas layanan mitra.' }
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
 <label className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer group">
 <input 
 type="checkbox" 
 checked={isTermsAccepted}
 onChange={(e) => setIsTermsAccepted(e.target.checked)}
 className="mt-1 w-5 h-5 accent-primary rounded-md" 
 />
 <span className="text-xs font-bold text-slate-600 leading-relaxed group-hover:text-primary transition-colors">
 Saya telah membaca dan menyetujui Syarat Pendaftaran Mitra JasaMitra
 </span>
 </label>
 </div>

 <button 
 onClick={handleBack}
 className="w-full bg-primary text-white py-5 rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-sm active:scale-95 transition-all"
 >
 Kembali
 </button>
 </div>
 </main>
 </motion.div>
 );
};
