import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Copy, Upload, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { db, storage } from '../lib/firebase';
import { doc, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

interface SubscriptionInvoiceProps {
  user: any;
  invoiceId: string | null;
  handleBack: () => void;
  navigateTo: (page: any) => void;
}

export const SubscriptionInvoice: React.FC<SubscriptionInvoiceProps> = ({ user, invoiceId, handleBack, navigateTo }) => {
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const paymentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!invoiceId) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'subscription_invoices', invoiceId), (docSnap) => {
      if (docSnap.exists()) {
        setInvoice({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [invoiceId]);

  useEffect(() => {
    if (!invoice || invoice.status !== 'pending') return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const expiresAt = invoice.expiresAt?.toDate ? invoice.expiresAt.toDate().getTime() : 0;
      const distance = expiresAt - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft('Kedaluwarsa');
        // Optionally update status to expired here or let a cloud function handle it
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}j ${minutes}m ${seconds}d`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [invoice]);

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
    alert('Disalin ke clipboard!');
  };

  const handleSubmit = async () => {
    if (!paymentProofFile || !invoice) return;

    setIsSubmitting(true);
    try {
      const paymentRef = storageRef(storage, `payments/${user.uid}/${Date.now()}_proof_${paymentProofFile.name}`);
      await uploadBytes(paymentRef, paymentProofFile);
      const paymentUrl = await getDownloadURL(paymentRef);

      await updateDoc(doc(db, 'subscription_invoices', invoice.id), {
        proofUrl: paymentUrl,
        status: 'waiting_verification',
        updatedAt: new Date()
      });

      alert('Bukti pembayaran berhasil dikirim! Silakan tunggu verifikasi dari Admin.');
    } catch (error: any) {
      console.error('Error submitting payment proof:', error);
      alert('Gagal mengirim bukti: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle size={48} className="text-slate-400 mb-4" />
        <h2 className="text-lg font-bold text-slate-800 mb-2">Invoice Tidak Ditemukan</h2>
        <p className="text-slate-500 mb-6">Maaf, data tagihan tidak dapat ditemukan.</p>
        <button onClick={() => navigateTo('beranda')} className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-bold">
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-slate-50 pb-24"
    >
      <header className="bg-white pt-12 pb-4 px-6 sticky top-0 z-50 border-b border-slate-100 shadow-sm flex items-center gap-4">
        <button onClick={handleBack} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-black text-slate-800 tracking-tight">Tagihan Pembayaran</h1>
      </header>

      <main className="p-6 space-y-6">
        {/* Status Banner */}
        {invoice.status === 'pending' && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <Clock className="text-amber-500 shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-bold text-amber-800 text-sm">Menunggu Pembayaran</h3>
              <p className="text-xs text-amber-700 mt-1">Selesaikan pembayaran sebelum waktu habis.</p>
              <p className="text-lg font-black text-amber-600 mt-2">{timeLeft}</p>
            </div>
          </div>
        )}

        {invoice.status === 'waiting_verification' && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
            <Clock className="text-blue-500 shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-bold text-blue-800 text-sm">Menunggu Verifikasi</h3>
              <p className="text-xs text-blue-700 mt-1">Bukti pembayaran Anda sedang dicek oleh Admin. Mohon tunggu maksimal 1x24 jam.</p>
            </div>
          </div>
        )}

        {invoice.status === 'paid' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-bold text-emerald-800 text-sm">Pembayaran Berhasil</h3>
              <p className="text-xs text-emerald-700 mt-1">Paket {invoice.type === 'mitra_unggulan' ? 'Mitra Unggulan' : 'Partner JasaMitra'} Anda sudah aktif!</p>
            </div>
          </div>
        )}

        {/* Invoice Details */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
            <div>
              <p className="text-xs text-slate-500">ID Tagihan</p>
              <p className="font-bold text-slate-800 text-sm">{invoice.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Tanggal</p>
              <p className="font-bold text-slate-800 text-sm">
                {invoice.createdAt?.toDate ? invoice.createdAt.toDate().toLocaleDateString('id-ID') : '-'}
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <p className="text-sm text-slate-600">Paket</p>
              <p className="text-sm font-bold text-slate-800">
                {invoice.type === 'mitra_unggulan' ? 'Mitra Unggulan' : 'Partner JasaMitra'} ({invoice.package?.durationDays} Hari)
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-slate-600">Harga</p>
              <p className="text-sm font-bold text-slate-800">Rp {invoice.package?.price?.toLocaleString('id-ID')}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-slate-600">Kode Unik</p>
              <p className="text-sm font-bold text-emerald-600">+{invoice.uniqueCode}</p>
            </div>
            <div className="flex justify-between pt-3 border-t border-slate-100">
              <p className="text-sm font-bold text-slate-800">Total Pembayaran</p>
              <p className="text-xl font-black text-emerald-600">Rp {invoice.totalAmount?.toLocaleString('id-ID')}</p>
            </div>
          </div>

          {/* Payment Instructions */}
          {(invoice.status === 'pending' || invoice.status === 'waiting_verification') && (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Transfer ke Rekening BCA</p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-black text-slate-800 tracking-wider">123 456 7890</p>
                <button 
                  onClick={() => copyToClipboard('1234567890')}
                  className="p-2 bg-white rounded-xl shadow-sm text-emerald-600 hover:bg-emerald-50 transition-colors"
                >
                  <Copy size={16} />
                </button>
              </div>
              <p className="text-xs font-bold text-slate-600 mt-1">a.n JasaMitra Indonesia</p>
              
              <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-xs text-amber-800 font-medium">
                  <span className="font-bold">PENTING:</span> Transfer tepat hingga 3 digit terakhir (Rp {invoice.totalAmount?.toLocaleString('id-ID')}) agar pembayaran otomatis terdeteksi.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Upload Proof */}
        {invoice.status === 'pending' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Upload Bukti Transfer</h3>
            
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={paymentInputRef}
              onChange={handlePaymentProofChange}
            />

            {paymentProofPreview ? (
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 group mb-4">
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
                className="w-full py-8 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-500 hover:bg-emerald-50 transition-colors mb-4"
              >
                <Upload size={24} className="mb-2" />
                <span className="text-sm font-bold">Pilih Foto Bukti Transfer</span>
              </button>
            )}

            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || !paymentProofFile}
              className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-500/30 active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Memproses...' : 'Kirim Bukti Pembayaran'}
            </button>
          </div>
        )}
      </main>
    </motion.div>
  );
};
