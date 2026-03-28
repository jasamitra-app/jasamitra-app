import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Building2, ImageIcon, FileText, Star, ShieldCheck, Camera, AlertTriangle } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../lib/firebase';
import { SyaratPendaftaranMitra } from './SyaratPendaftaranMitra';

interface RegisterMitraProps {
  DISTRICTS: Record<string, string[]>;
  handleBack: () => void;
  navigateTo: (page: string) => void;
  setIsMitra: (isMitra: boolean) => void;
}

export const RegisterMitra: React.FC<RegisterMitraProps> = ({
  handleBack,
  DISTRICTS,
  navigateTo,
  setIsMitra
}) => {
  const [step, setStep] = useState(1);
  const [showSyarat, setShowSyarat] = useState(false);
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupAddress, setSignupAddress] = useState('');
  const [signupCity, setSignupCity] = useState('');
  const [signupDistrict, setSignupDistrict] = useState('');
  const [jenisMitra, setJenisMitra] = useState('Perorangan');
  const [namaUsaha, setNamaUsaha] = useState('');
  const [logoUsahaFile, setLogoUsahaFile] = useState<File | null>(null);
  const [legalitasFile, setLegalitasFile] = useState<File | null>(null);
  const [statusKeahlian, setStatusKeahlian] = useState('Non Sertifikat');
  const [sertifikatFile, setSertifikatFile] = useState<File | null>(null);
  const [signupKtpFile, setSignupKtpFile] = useState<File | null>(null);
  const [signupSelfieFile, setSignupSelfieFile] = useState<File | null>(null);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async () => {
    // Basic validation
    if (!signupName || !signupEmail || !signupPassword || !signupAddress || !signupCity || !signupDistrict || !signupKtpFile || !signupSelfieFile || !isTermsAccepted) {
      alert('Silakan Isi full Formulir dan centang setuju untuk terdaftar di jasamitra,');
      return;
    }

    // Additional validation for CV/PT
    if ((jenisMitra === 'CV' || jenisMitra === 'PT') && !namaUsaha) {
      alert('Silakan isi Nama Usaha Anda.');
      return;
    }

    // Additional validation for Sertifikat
    if (statusKeahlian === 'Sertifikat' && !sertifikatFile) {
      alert('Silakan upload Sertifikat Keahlian Anda.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
      
      let emailToUse = signupEmail.trim();
      if (/^(\+62|62|0)[0-9]{8,15}$/.test(emailToUse)) {
        emailToUse = `${emailToUse}@jasamitra.com`;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, emailToUse, signupPassword);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: signupName });

      // Helper function to upload file
      const uploadFile = async (file: File, path: string) => {
        const fileRef = ref(storage, path);
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
      };

      // Upload files
      let ktpUrl = '';
      let selfieUrl = '';
      let logoUrl = '';
      let legalitasUrl = '';
      let sertifikatUrl = '';

      if (signupKtpFile) {
        ktpUrl = await uploadFile(signupKtpFile, `mitras/${user.uid}/ktp_${signupKtpFile.name}`);
      }
      if (signupSelfieFile) {
        selfieUrl = await uploadFile(signupSelfieFile, `mitras/${user.uid}/selfie_${signupSelfieFile.name}`);
      }
      if (logoUsahaFile) {
        logoUrl = await uploadFile(logoUsahaFile, `mitras/${user.uid}/logo_${logoUsahaFile.name}`);
      }
      if (legalitasFile) {
        legalitasUrl = await uploadFile(legalitasFile, `mitras/${user.uid}/legalitas_${legalitasFile.name}`);
      }
      if (sertifikatFile) {
        sertifikatUrl = await uploadFile(sertifikatFile, `mitras/${user.uid}/sertifikat_${sertifikatFile.name}`);
      }

      // Simpan data mitra ke Firestore
      await setDoc(doc(db, 'mitras', user.uid), {
        uid: user.uid,
        name: signupName,
        email: emailToUse,
        city: signupCity,
        district: signupDistrict,
        address: signupAddress,
        jenisMitra,
        namaUsaha: (jenisMitra === 'CV' || jenisMitra === 'PT') ? namaUsaha : '',
        statusKeahlian,
        status: 'pending',
        ktpUrl,
        selfieUrl,
        logoUrl,
        legalitasUrl,
        sertifikatUrl,
        role: 'mitra',
        createdAt: serverTimestamp(),
        isVerified: false
      });

      setIsMitra(true);
      alert('Pendaftaran berhasil! Silakan login.');
      navigateTo('login');
    } catch (error: any) {
      alert('Pendaftaran gagal: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSyarat) {
    return (
      <div className="absolute inset-0 z-50 bg-slate-50 overflow-y-auto">
        <SyaratPendaftaranMitra handleBack={() => setShowSyarat(false)} />
      </div>
    );
  }

  return (
    <motion.div key="daftar-mitra" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <PageHeader title="Pendaftaran Mitra" subtitle="Lengkapi data diri & wilayah operasional" onBack={handleBack} />
      <main className="px-6 pt-6 pb-12">

        <div className="bg-white p-6 rounded-[40px] shadow-sm border border-slate-100 space-y-6">
          
          {/* Progress Bar */}
          <div id="registration-steps" className="flex items-center justify-between mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= s ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {s}
                </div>
                <span className={`text-[8px] mt-1 font-bold uppercase tracking-wider ${step >= s ? 'text-primary' : 'text-slate-400'}`}>
                  Tahap {s}
                </span>
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-3">
                  <User size={24} />
                </div>
                <h3 className="text-sm font-black text-slate-800">Data Diri & Alamat</h3>
                <p className="text-[10px] text-slate-400 font-medium">Lengkapi detail pendaftaran Anda</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Nama Lengkap <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="Sesuai KTP" 
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Nomor WhatsApp / Email <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="Contoh: 08123456789" 
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Kata Sandi <span className="text-rose-500">*</span></label>
                  <input 
                    type="password" 
                    placeholder="Minimal 8 karakter" 
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Alamat Lengkap / No Rumah <span className="text-rose-500">*</span></label>
                  <textarea 
                    placeholder="Tulis alamat lengkap (Jalan, No Rumah, RT/RW)..." 
                    value={signupAddress}
                    onChange={(e) => setSignupAddress(e.target.value)}
                    className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none min-h-[100px]" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Kota/Kabupaten <span className="text-rose-500">*</span></label>
                  <select 
                    value={signupCity}
                    onChange={(e) => { setSignupCity(e.target.value); setSignupDistrict(''); }}
                    className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none appearance-none"
                  >
                    <option value="">Pilih Kota/Kab</option>
                    <option value="Kota Bandung">Kota Bandung</option>
                    <option value="Kota Cimahi">Kota Cimahi</option>
                    <option value="Kab. Bandung">Kab. Bandung</option>
                    <option value="Kab. Bandung Barat (KBB)">Kab. Bandung Barat (KBB)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Kecamatan <span className="text-rose-500">*</span></label>
                  <select 
                    value={signupDistrict}
                    onChange={(e) => setSignupDistrict(e.target.value)}
                    disabled={!signupCity}
                    className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none appearance-none disabled:opacity-50"
                  >
                    <option value="">Pilih Kecamatan</option>
                    {signupCity && DISTRICTS[signupCity]?.map((d: string) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                disabled={!signupName || !signupEmail || !signupPassword || !signupAddress || !signupCity || !signupDistrict}
                className={`w-full py-5 rounded-[30px] font-bold text-sm shadow-sm transition-all mt-6 ${
                  (signupName && signupEmail && signupPassword && signupAddress && signupCity && signupDistrict)
                  ? 'bg-primary text-white' : 'bg-slate-200 text-slate-400'
                }`}
              >
                Lanjut ke Tahap 2
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* --- VERIFIKASI LEGALITAS & KEAHLIAN --- */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-6">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Building2 size={16} className="text-primary" /> 1. JENIS MITRA
                  </h4>
                  <div className="flex gap-3">
                    {['Perorangan', 'CV', 'PT'].map((type) => (
                      <label 
                        key={type}
                        className={`flex-1 flex items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer ${jenisMitra === type ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 bg-white text-slate-500'}`}
                      >
                        <input 
                          type="radio" 
                          name="jenisMitra" 
                          value={type} 
                          checked={jenisMitra === type}
                          onChange={(e) => setJenisMitra(e.target.value)}
                          className="hidden"
                        />
                        <span className="text-xs font-bold">{type}</span>
                      </label>
                    ))}
                  </div>

                  {(jenisMitra === 'CV' || jenisMitra === 'PT') && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Nama Usaha <span className="text-rose-500">*</span></label>
                        <input 
                          type="text" 
                          placeholder="Contoh: CV Maju Jaya" 
                          value={namaUsaha}
                          onChange={(e) => setNamaUsaha(e.target.value)}
                          className="w-full bg-white rounded-2xl p-4 text-sm font-medium outline-none border border-slate-200 focus:ring-2 ring-primary/20" 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-slate-500 block ml-1">Logo Usaha (Opsional)</label>
                          <div className="relative group">
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => setLogoUsahaFile(e.target.files?.[0] || null)}
                              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                            />
                            <div className="bg-white border border-dashed border-slate-300 p-3 rounded-xl flex flex-col items-center justify-center gap-1 group-hover:border-primary transition-colors">
                              <ImageIcon size={16} className="text-slate-400 group-hover:text-primary" />
                              <span className="text-[8px] font-bold text-slate-400 group-hover:text-primary truncate max-w-full">
                                {logoUsahaFile ? logoUsahaFile.name : 'Upload Logo'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-slate-500 block ml-1">NIB / Legalitas</label>
                          <div className="relative group">
                            <input 
                              type="file" 
                              accept="image/*,application/pdf"
                              onChange={(e) => setLegalitasFile(e.target.files?.[0] || null)}
                              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                            />
                            <div className="bg-white border border-dashed border-slate-300 p-3 rounded-xl flex flex-col items-center justify-center gap-1 group-hover:border-primary transition-colors">
                              <FileText size={16} className="text-slate-400 group-hover:text-primary" />
                              <span className="text-[8px] font-bold text-slate-400 group-hover:text-primary truncate max-w-full">
                                {legalitasFile ? legalitasFile.name : 'Upload NIB'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Star size={16} className="text-amber-500" /> 2. STATUS KEAHLIAN
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'Non Sertifikat', label: 'Non Sertifikat', icon: <ShieldCheck size={14} /> },
                      { id: 'Sertifikat', label: 'Sertifikat', icon: <Star size={14} /> }
                    ].map((status) => (
                      <label 
                        key={status.id}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${statusKeahlian === status.id ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200 bg-white text-slate-500'}`}
                      >
                        <input 
                          type="radio" 
                          name="statusKeahlian" 
                          value={status.id} 
                          checked={statusKeahlian === status.id}
                          onChange={(e) => setStatusKeahlian(e.target.value)}
                          className="hidden"
                        />
                        {status.icon}
                        <span className="text-[10px] font-bold">{status.label}</span>
                      </label>
                    ))}
                  </div>

                  {statusKeahlian === 'Sertifikat' && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2 pt-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Upload Sertifikat Keahlian <span className="text-rose-500">*</span></label>
                      <div className="relative group">
                        <input 
                          type="file" 
                          accept="image/*,application/pdf"
                          onChange={(e) => setSertifikatFile(e.target.files?.[0] || null)}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                        />
                        <div className="bg-white border border-dashed border-slate-300 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 group-hover:border-amber-500 transition-colors">
                          <Camera size={20} className="text-slate-400 group-hover:text-amber-500" />
                          <span className="text-xs font-bold text-slate-400 group-hover:text-amber-500">
                            {sertifikatFile ? sertifikatFile.name : 'Pilih Gambar atau PDF'}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setStep(1)}
                  className="w-1/3 py-5 rounded-[30px] font-bold text-sm shadow-sm transition-all bg-slate-100 text-slate-600"
                >
                  Kembali
                </button>
                <button 
                  onClick={() => setStep(3)}
                  disabled={((jenisMitra === 'CV' || jenisMitra === 'PT') && !namaUsaha) || (statusKeahlian === 'Sertifikat' && !sertifikatFile)}
                  className={`w-2/3 py-5 rounded-[30px] font-bold text-sm shadow-sm transition-all ${
                    !(((jenisMitra === 'CV' || jenisMitra === 'PT') && !namaUsaha) || (statusKeahlian === 'Sertifikat' && !sertifikatFile))
                    ? 'bg-primary text-white' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  Lanjut ke Tahap 3
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100 space-y-4">
                <h4 className="text-[10px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-2"><ShieldCheck size={16} /> Dokumen Keamanan Wajib</h4>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-xl border border-rose-200">
                    <label className="text-[9px] font-bold text-rose-900 block mb-2">1. Foto KTP Asli</label>
                    <input 
                      type="file" 
                      className="text-[10px]" 
                      onChange={(e) => setSignupKtpFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-rose-200">
                    <label className="text-[9px] font-bold text-rose-900 block mb-2">2. Selfie Memegang KTP</label>
                    <input 
                      type="file" 
                      className="text-[10px]" 
                      onChange={(e) => setSignupSelfieFile(e.target.files?.[0] || null)}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-accent/10 p-6 rounded-3xl border border-accent/20 space-y-4">
                <h4 className="text-[10px] font-bold text-accent uppercase tracking-wider flex items-center gap-2"><AlertTriangle size={16} /> SYARAT PENDAFTARAN</h4>
                <button 
                  onClick={() => setShowSyarat(true)}
                  className="text-[11px] text-accent font-bold underline cursor-pointer text-left"
                >
                  Baca Syarat Pendaftaran Mitra
                </button>
                <label className="flex items-center gap-2 cursor-pointer mt-2">
                  <input 
                    type="checkbox" 
                    checked={isTermsAccepted} 
                    onChange={(e) => setIsTermsAccepted(e.target.checked)} 
                    className="w-4 h-4 accent-primary" 
                  />
                  <span className="text-[10px] text-slate-600 font-bold">Saya telah membaca dan menyetujui Syarat Pendaftaran Mitra JasaMitra</span>
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setStep(2)}
                  className="w-1/3 py-5 rounded-[30px] font-bold text-sm shadow-sm transition-all bg-slate-100 text-slate-600"
                >
                  Kembali
                </button>
                <button 
                  onClick={handleSignUp} 
                  disabled={isSubmitting || !signupKtpFile || !signupSelfieFile || !isTermsAccepted}
                  className={`w-2/3 py-5 rounded-[30px] font-bold text-sm shadow-sm transition-all ${
                    (signupKtpFile && signupSelfieFile && isTermsAccepted)
                    ? 'bg-primary text-white '
                    : 'bg-slate-400 text-white shadow-none'
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Mengirim...' : 'Kirim Pendaftaran'}
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </motion.div>
  );
};
