import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Upload, CheckCircle, Clock, AlertCircle, Info, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { Page } from '../types';
import { db, storage } from '../lib/firebase';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface PartnerJasaMitraProps {
  user: any;
  navigateTo: (page: Page) => void;
  setActiveSubscriptionInvoiceId: (id: string) => void;
}

const PACKAGES = [
  { id: '1_month', durationDays: 30, price: 200000, label: '1 Bulan' },
  { id: '3_months', durationDays: 90, price: 550000, label: '3 Bulan (Lebih Hemat)' }
];

export const PartnerJasaMitraPage: React.FC<PartnerJasaMitraProps> = ({ user, navigateTo, setActiveSubscriptionInvoiceId }) => {
  const [showAbout, setShowAbout] = useState(false);
  const [request, setRequest] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [namaToko, setNamaToko] = useState('');
  const [alamat, setAlamat] = useState('');
  const [linkTujuan, setLinkTujuan] = useState('WhatsApp');
  const [linkValue, setLinkValue] = useState('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(PACKAGES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Check if there's an existing active or pending subscription invoice for this user
    const q = query(
      collection(db, 'subscription_invoices'), 
      where('userId', '==', user.uid),
      where('type', '==', 'partner')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        // Find the most relevant invoice (active > waiting > pending)
        const docs = snapshot.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
        const active = docs.find(d => d.status === 'paid');
        const waiting = docs.find(d => d.status === 'waiting_verification');
        const pending = docs.find(d => d.status === 'pending');
        
        setRequest(active || waiting || pending || null);
      } else {
        setRequest(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching partner request:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !bannerFile || !namaToko || !alamat || !linkValue) return;

    setIsSubmitting(true);
    try {
      // Upload banner
      const bannerRef = ref(storage, `partners/${user.uid}_${Date.now()}_${bannerFile.name}`);
      await uploadBytes(bannerRef, bannerFile);
      const bannerUrl = await getDownloadURL(bannerRef);

      // Generate unique code and calculate total
      const uniqueCode = Math.floor(Math.random() * 900) + 100; // 100-999
      const totalAmount = selectedPackage.price + uniqueCode;

      // Create a subscription invoice
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours to pay

      const invoiceRef = await addDoc(collection(db, 'subscription_invoices'), {
        type: 'partner',
        userId: user.uid,
        userName: user.displayName || user.email || 'User',
        namaToko,
        alamat,
        linkTujuan,
        linkValue,
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
    } catch (error) {
      console.error("Error submitting request:", error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showAbout) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-slate-100 sticky top-0 z-20">
          <button onClick={() => setShowAbout(false)} className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-slate-800">Tentang Partner JasaMitra</h1>
        </div>
        <div className="p-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <Info size={32} />
            </div>
            <p className="text-slate-700 leading-relaxed">
              Partner JasaMitra adalah solusi promosi bagi usaha lokal untuk tampil di halaman utama aplikasi dan menjangkau lebih banyak pelanggan. Dengan menjadi partner, bisnis Anda akan lebih mudah ditemukan, dipercaya, dan dihubungi langsung oleh calon pelanggan melalui WhatsApp atau marketplace.
            </p>
          </div>
          <button 
            onClick={() => setShowAbout(false)}
            className="w-full mt-6 bg-slate-800 text-white font-bold py-4 rounded-xl shadow-sm"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20">
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-slate-100 sticky top-0 z-20">
        <button onClick={() => navigateTo('akun')} className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-slate-800">Partner JasaMitra</h1>
      </div>

      <div className="p-4">
        {/* Menu Tentang */}
        <button 
          onClick={() => setShowAbout(true)}
          className="w-full bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3 text-slate-700 font-medium">
            <Info size={20} className="text-blue-500" />
            Tentang Partner JasaMitra
          </div>
          <ChevronLeft size={20} className="text-slate-400 rotate-180" />
        </button>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : request ? (
          // Status Views
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 text-center border-b border-slate-100">
              {request.status === 'pending' && (
                <>
                  <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock size={32} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800 mb-2">Menunggu Pembayaran</h2>
                  <p className="text-sm text-slate-500">Selesaikan pembayaran untuk mengaktifkan Partner Anda.</p>
                  <button 
                    onClick={() => {
                      setActiveSubscriptionInvoiceId(request.id);
                      navigateTo('subscription-invoice');
                    }}
                    className="mt-4 bg-amber-500 text-white px-6 py-2 rounded-xl font-bold"
                  >
                    Lihat Tagihan
                  </button>
                </>
              )}
              {request.status === 'waiting_verification' && (
                <>
                  <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock size={32} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800 mb-2">Verifikasi Pembayaran</h2>
                  <p className="text-sm text-slate-500">Bukti pembayaran Anda sedang diverifikasi. Banner akan segera aktif.</p>
                </>
              )}
              {request.status === 'paid' && (
                <>
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800 mb-2">Partner Aktif</h2>
                  <p className="text-sm text-slate-500">Banner Anda saat ini sedang tayang di halaman utama.</p>
                </>
              )}
              {request.status === 'rejected' && (
                <>
                  <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle size={32} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800 mb-2">Pengajuan Ditolak</h2>
                  <p className="text-sm text-slate-500">Maaf, pengajuan Anda tidak dapat kami proses saat ini.</p>
                </>
              )}
            </div>
          </div>
        ) : (
          // Registration Form
          <>
            <form onSubmit={handleSubmitRequest} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h3 className="font-bold text-slate-800 mb-4">Form Pendaftaran Partner</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Nama Toko / Bisnis</label>
                  <input 
                    type="text" 
                    value={namaToko}
                    onChange={(e) => setNamaToko(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    placeholder="Contoh: Toko Bangunan Berkah"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Alamat</label>
                  <textarea 
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 min-h-[80px]"
                    placeholder="Alamat lengkap toko Anda"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Pilihan Link Tujuan</label>
                  <select 
                    value={linkTujuan}
                    onChange={(e) => {
                      setLinkTujuan(e.target.value);
                      setLinkValue('');
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Shopee">Shopee</option>
                    <option value="Tokopedia">Tokopedia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    {linkTujuan === 'WhatsApp' ? 'Nomor WhatsApp' : 'Link URL'}
                  </label>
                  <input 
                    type={linkTujuan === 'WhatsApp' ? 'tel' : 'url'} 
                    value={linkValue}
                    onChange={(e) => setLinkValue(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    placeholder={linkTujuan === 'WhatsApp' ? 'Contoh: 6281234567890' : 'https://...'}
                    required
                  />
                  {linkTujuan === 'WhatsApp' && (
                    <p className="text-xs text-slate-500 mt-1">Gunakan format 62 tanpa spasi atau +</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Upload Banner Partner</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center relative bg-slate-50">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleBannerChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required
                    />
                    {bannerPreview ? (
                      <img src={bannerPreview} alt="Preview" className="max-h-32 mx-auto rounded-lg" />
                    ) : (
                      <div className="py-4">
                        <ImageIcon size={28} className="mx-auto text-slate-400 mb-2" />
                        <span className="text-sm text-slate-500">Tap untuk upload foto banner</span>
                        <p className="text-xs text-slate-400 mt-1">Rekomendasi rasio 16:9</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 mt-4">Pilih Paket</label>
                  <div className="space-y-3">
                    {PACKAGES.map(pkg => (
                      <div 
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          selectedPackage.id === pkg.id 
                            ? 'border-emerald-500 bg-emerald-50' 
                            : 'border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{pkg.label}</p>
                            <p className="text-xs font-bold text-emerald-600 mt-1">Rp {pkg.price.toLocaleString('id-ID')}</p>
                          </div>
                          {selectedPackage.id === pkg.id && <CheckCircle2 size={20} className="text-emerald-500" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || !bannerFile}
                className="w-full mt-6 bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Memproses...' : 'Lanjut ke Pembayaran'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
