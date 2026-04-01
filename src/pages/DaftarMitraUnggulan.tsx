import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Upload, Star, CheckCircle2, AlertCircle } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { db, storage } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

interface DaftarMitraUnggulanProps {
  user: any;
  myAds: any[];
  handleBack: () => void;
  navigateTo: (page: any) => void;
  setActiveSubscriptionInvoiceId: (id: string) => void;
}

const PACKAGES = [
  { id: '14_days', durationDays: 14, price: 100000, label: '14 Hari' },
  { id: '30_days', durationDays: 30, price: 180000, label: '30 Hari (Lebih Hemat)' }
];

export const DaftarMitraUnggulan: React.FC<DaftarMitraUnggulanProps> = ({ user, myAds, handleBack, navigateTo, setActiveSubscriptionInvoiceId }) => {
  const [selectedAdId, setSelectedAdId] = useState<string>('');
  const [selectedPackage, setSelectedPackage] = useState(PACKAGES[0]);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const bannerInputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = async () => {
    if (!selectedAdId) {
      alert('Pilih iklan jasa yang ingin diunggulkan.');
      return;
    }
    if (!bannerFile) {
      alert('Harap unggah foto banner/portofolio khusus.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload the new banner image
      const bannerRef = storageRef(storage, `highlights/${user.uid}/${Date.now()}_${bannerFile.name}`);
      await uploadBytes(bannerRef, bannerFile);
      const bannerUrl = await getDownloadURL(bannerRef);

      // 2. Generate unique code and calculate total
      const uniqueCode = Math.floor(Math.random() * 900) + 100; // 100-999
      const totalAmount = selectedPackage.price + uniqueCode;

      // 3. Create a subscription invoice
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours to pay

      const invoiceRef = await addDoc(collection(db, 'subscription_invoices'), {
        type: 'mitra_unggulan',
        userId: user.uid,
        userName: user.displayName || 'Mitra',
        adId: selectedAdId,
        package: selectedPackage,
        uniqueCode,
        totalAmount,
        bannerUrl,
        status: 'pending',
        createdAt: serverTimestamp(),
        expiresAt
      });

      setActiveSubscriptionInvoiceId(invoiceRef.id);
      navigateTo('subscription-invoice');
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
          <h3 className="text-sm font-bold text-slate-800 mb-4">2. Pilih Paket</h3>
          <div className="space-y-3">
            {PACKAGES.map(pkg => (
              <div 
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedPackage.id === pkg.id 
                    ? 'border-amber-500 bg-amber-50' 
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{pkg.label}</p>
                    <p className="text-xs font-bold text-amber-600 mt-1">Rp {pkg.price.toLocaleString('id-ID')}</p>
                  </div>
                  {selectedPackage.id === pkg.id && <CheckCircle2 size={20} className="text-amber-500" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-4">3. Upload Banner / Portofolio</h3>
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

        <button 
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedAdId || !bannerFile}
          className="w-full bg-amber-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-amber-500/30 active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
        >
          {isSubmitting ? 'Memproses...' : 'Lanjut ke Pembayaran'}
        </button>
      </main>
    </motion.div>
  );
};
