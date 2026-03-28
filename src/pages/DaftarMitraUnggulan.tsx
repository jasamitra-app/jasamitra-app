import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Upload, Star, CheckCircle2, AlertCircle, Copy } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { db, storage } from '../lib/firebase';
import { doc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

interface DaftarMitraUnggulanProps {
  user: any;
  myAds: any[];
  handleBack: () => void;
  navigateTo: (page: any) => void;
}

export const DaftarMitraUnggulan: React.FC<DaftarMitraUnggulanProps> = ({ user, myAds, handleBack, navigateTo }) => {
  const [selectedAdId, setSelectedAdId] = useState<string>('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const paymentInputRef = useRef<HTMLInputElement>(null);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB');
      return;
    }

    setBannerFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePaymentProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB');
      return;
    }

    setPaymentProofFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPaymentProofPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Nomor rekening disalin!');
  };

  const handleSubmit = async () => {
    if (!selectedAdId) {
      alert('Pilih iklan jasa yang ingin diunggulkan.');
      return;
    }
    if (!bannerFile) {
      alert('Harap unggah foto banner/portofolio khusus.');
      return;
    }
    if (!paymentProofFile) {
      alert('Harap unggah bukti transfer pembayaran.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload the new banner image
      const bannerRef = storageRef(storage, `highlights/${user.uid}/${Date.now()}_${bannerFile.name}`);
      await uploadBytes(bannerRef, bannerFile);
      const bannerUrl = await getDownloadURL(bannerRef);

      // 2. Upload the payment proof
      const paymentRef = storageRef(storage, `payments/${user.uid}/${Date.now()}_proof_${paymentProofFile.name}`);
      await uploadBytes(paymentRef, paymentProofFile);
      const paymentUrl = await getDownloadURL(paymentRef);

      // 3. Create a payment record for admin verification
      await addDoc(collection(db, 'payments'), {
        type: 'highlight_ad',
        adId: selectedAdId,
        userId: user.uid,
        userName: user.displayName || 'Mitra',
        amount: 100000,
        dealAmount: 100000,
        dpAmount: 100000,
        proofUrl: paymentUrl,
        bannerUrl: bannerUrl, // Store banner URL to apply later
        status: 'pending',
        createdAt: serverTimestamp()
      });

      alert('Pendaftaran berhasil dikirim! Silakan tunggu verifikasi dari Admin.');
      navigateTo('beranda');
    } catch (error: any) {
      console.error('Error submitting highlight request:', error);
      alert('Gagal memproses pendaftaran: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      key="daftar-mitra-unggulan"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen bg-slate-50 pb-24"
    >
      <PageHeader title="Daftar Mitra Unggulan" onBack={handleBack} />

      <main className="p-6 space-y-6">
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <Star size={32} className="mb-4 text-amber-200" />
          <h2 className="text-xl font-black mb-2">Tampil Paling Depan!</h2>
          <p className="text-sm text-amber-50 opacity-90 mb-4">
            Jadikan jasa Anda sebagai Mitra Unggulan dan dapatkan lebih banyak pelanggan dengan tampil di halaman utama.
          </p>
          <div className="bg-white/20 rounded-xl p-3 inline-block">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-100 mb-1">Biaya Promosi</p>
            <p className="text-2xl font-black">Rp 100.000 <span className="text-sm font-normal opacity-80">/ 14 hari</span></p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-4">1. Pilih Iklan Jasa</h3>
          {myAds.length === 0 ? (
            <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <AlertCircle size={24} className="mx-auto text-slate-400 mb-2" />
              <p className="text-sm text-slate-500">Anda belum memiliki iklan jasa aktif.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myAds.map(ad => (
                <div 
                  key={ad.id}
                  onClick={() => setSelectedAdId(ad.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedAdId === ad.id 
                      ? 'border-amber-500 bg-amber-50' 
                      : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{ad.title}</p>
                      <p className="text-xs text-slate-500">{ad.category}</p>
                    </div>
                    {selectedAdId === ad.id && <CheckCircle2 size={20} className="text-amber-500" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-4">2. Upload Banner / Portofolio</h3>
          <p className="text-xs text-slate-500 mb-4">
            Unggah foto terbaik yang merepresentasikan jasa Anda. Foto ini akan ditampilkan di deretan Mitra Unggulan.
          </p>
          
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={bannerInputRef}
            onChange={handleBannerChange}
          />

          {bannerPreview ? (
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 group">
              <img src={bannerPreview} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={() => bannerInputRef.current?.click()}
                  className="bg-white text-slate-800 px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Ganti Foto
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => bannerInputRef.current?.click()}
              className="w-full aspect-video rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:text-amber-500 hover:border-amber-500 hover:bg-amber-50 transition-colors"
            >
              <Upload size={32} className="mb-2" />
              <span className="text-sm font-bold">Pilih Foto Banner</span>
              <span className="text-xs mt-1">Maks. 2MB (Rekomendasi 16:9)</span>
            </button>
          )}
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-4">3. Pembayaran</h3>
          
          <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
            <p className="text-xs text-slate-500 mb-1">Transfer ke Rekening BCA</p>
            <div className="flex items-center justify-between">
              <p className="text-lg font-black text-slate-800 tracking-wider">123 456 7890</p>
              <button 
                onClick={() => copyToClipboard('1234567890')}
                className="p-2 bg-white rounded-xl shadow-sm text-primary hover:bg-primary hover:text-white transition-colors"
              >
                <Copy size={16} />
              </button>
            </div>
            <p className="text-xs font-bold text-slate-600 mt-1">a.n JasaMitra Indonesia</p>
          </div>

          <p className="text-xs text-slate-500 mb-4">
            Silakan transfer sebesar <span className="font-bold text-slate-800">Rp 100.000</span> dan unggah bukti transfer di bawah ini.
          </p>

          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={paymentInputRef}
            onChange={handlePaymentProofChange}
          />

          {paymentProofPreview ? (
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 group">
              <img src={paymentProofPreview} alt="Bukti Transfer" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={() => paymentInputRef.current?.click()}
                  className="bg-white text-slate-800 px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Ganti Bukti Transfer
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => paymentInputRef.current?.click()}
              className="w-full py-8 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
            >
              <Upload size={24} className="mb-2" />
              <span className="text-sm font-bold">Upload Bukti Transfer</span>
            </button>
          )}
        </div>

        <button 
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedAdId || !bannerFile || !paymentProofFile}
          className="w-full bg-amber-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-amber-500/30 active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
        >
          {isSubmitting ? 'Memproses...' : 'Kirim Pendaftaran'}
        </button>
      </main>
    </motion.div>
  );
};
