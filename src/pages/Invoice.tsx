import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Download, CheckCircle2, FileText, AlertTriangle } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface InvoiceProps {
  handleBack: () => void;
  transaction?: any; // Pass the active transaction here
}

export const Invoice: React.FC<InvoiceProps> = ({ handleBack, transaction }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fallback data if no transaction is passed (for preview/testing)
  const t = transaction || {
    id: 'INV-20260328-001',
    customerName: 'Budi Santoso',
    customerPhone: '081234567890',
    address: 'Jl. Merdeka No. 123, Bandung',
    mitraName: 'Ahmad Teknisi',
    serviceTitle: 'Servis AC & Elektronik',
    totalPrice: 1000000,
    createdAt: { toDate: () => new Date() }
  };

  const dpAmount = t.totalPrice ? t.totalPrice * 0.1 : 0;
  const sisaAmount = t.totalPrice ? t.totalPrice * 0.9 : 0;
  const dateStr = t.createdAt?.toDate ? t.createdAt.toDate().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }) : new Date().toLocaleDateString('id-ID');

  const generatePDF = async () => {
    if (!invoiceRef.current) return;
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`SPK_Invoice_${t.id || 'JasaMitra'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Gagal membuat PDF. Silakan coba lagi.');
    } finally {
      setIsGenerating(false);
    }
  };

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
        <h1 className="text-lg font-black text-slate-800 tracking-tight">Surat Kesepakatan & Invoice</h1>
      </header>

      <div className="p-5">
        {/* Printable Area */}
        <div 
          ref={invoiceRef}
          className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8"
        >
          {/* KOP SURAT */}
          <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-6">
            <div className="flex items-center gap-3">
              <img src="https://i.ibb.co.com/k25Dk8Lz/JM-2.webp" alt="Logo" className="w-12 h-12 object-contain" crossOrigin="anonymous" />
              <div>
                <h2 className="text-xl font-black text-[#003366] tracking-tight leading-none">JASA<span className="text-[#F27D26]">MITRA</span></h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Solusi Jasa Terpercaya</p>
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-lg font-black text-slate-800">SURAT KESEPAKATAN KERJA</h1>
              <p className="text-xs font-bold text-slate-500 mt-1">ID: {t.id}</p>
              <p className="text-[10px] text-slate-400">{dateStr}</p>
            </div>
          </div>

          {/* DATA PIHAK TERLIBAT */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 border-b border-slate-100 pb-1">Data Pelanggan</p>
              <p className="text-sm font-bold text-slate-800">{t.customerName || 'Pelanggan JasaMitra'}</p>
              <p className="text-xs text-slate-600 mt-1">{t.customerPhone || '-'}</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t.address || 'Alamat tidak tersedia'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 border-b border-slate-100 pb-1">Data Mitra</p>
              <p className="text-sm font-bold text-slate-800">{t.mitraName || 'Mitra JasaMitra'}</p>
              <p className="text-xs text-slate-600 mt-1">{t.serviceTitle || 'Layanan Jasa'}</p>
            </div>
          </div>

          {/* RINCIAN BIAYA */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 mb-8">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
              <FileText size={14} /> Rincian Biaya Kesepakatan
            </p>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-sm font-bold text-slate-700">Total Harga Kesepakatan</p>
                <p className="text-sm font-black text-slate-800">Rp {t.totalPrice?.toLocaleString()}</p>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-slate-200/60">
                <div>
                  <p className="text-xs font-bold text-slate-600">Biaya Aplikasi (DP 10%)</p>
                  <p className="text-[9px] text-emerald-600 font-bold mt-0.5 flex items-center gap-1"><CheckCircle2 size={10} /> LUNAS VIA TRANSFER</p>
                </div>
                <p className="text-xs font-bold text-slate-600">Rp {dpAmount.toLocaleString()}</p>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                <div>
                  <p className="text-sm font-black text-slate-800">Sisa Pembayaran (90%)</p>
                  <p className="text-[10px] text-amber-600 font-bold mt-0.5 flex items-center gap-1"><AlertTriangle size={12} /> WAJIB DIBAYAR TUNAI KEPADA MITRA</p>
                </div>
                <p className="text-lg font-black text-[#003366]">Rp {sisaAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* SYARAT & KETENTUAN */}
          <div className="border-t-2 border-dashed border-slate-200 pt-6">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Syarat & Ketentuan Mengikat</h3>
            
            <div className="space-y-4 text-[10px] text-slate-600 leading-relaxed text-justify">
              <p>
                <strong className="text-slate-800">1. Kewajiban Pembayaran (Perlindungan Mitra):</strong><br/>
                Dengan diterbitkannya surat ini, Pelanggan telah sepakat dan mengikatkan diri secara sah untuk membayar sisa tagihan sebesar <strong className="text-slate-800">Rp {sisaAmount.toLocaleString()}</strong> secara tunai langsung kepada Mitra setelah pekerjaan selesai sesuai dengan kesepakatan awal.
              </p>
              <p>
                <strong className="text-slate-800">2. Hak Penyesuaian Harga (Perlindungan Pelanggan):</strong><br/>
                Apabila hasil pekerjaan yang diselesaikan oleh Mitra terbukti <strong className="text-slate-800">tidak sesuai dengan ruang lingkup atau kesepakatan awal</strong>, Pelanggan berhak untuk mengajukan penyesuaian harga (negosiasi ulang) atas sisa tagihan tersebut. Penyesuaian harga ini harus diselesaikan secara musyawarah dan disetujui oleh kedua belah pihak di lokasi pengerjaan.
              </p>
              <p>
                <strong className="text-slate-800">3. Penyelesaian Kendala (Mediasi Admin):</strong><br/>
                Jika Pelanggan dan Mitra tidak menemukan titik temu terkait kualitas pekerjaan atau penyesuaian harga, kedua belah pihak dilarang melakukan tindakan sepihak dan <strong className="text-slate-800">wajib segera melaporkan</strong> kendala ini kepada Admin JasaMitra melalui aplikasi untuk proses mediasi.
              </p>
            </div>
          </div>

          {/* TTD Area */}
          <div className="mt-12 flex justify-between px-4">
            <div className="text-center">
              <p className="text-[10px] text-slate-400 mb-12">Pelanggan</p>
              <p className="text-xs font-bold text-slate-800 border-b border-slate-800 pb-1 inline-block min-w-[100px]">{t.customerName || '......................'}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-slate-400 mb-12">Mitra Jasa</p>
              <p className="text-xs font-bold text-slate-800 border-b border-slate-800 pb-1 inline-block min-w-[100px]">{t.mitraName || '......................'}</p>
            </div>
          </div>

          {/* Download Button (Hidden in PDF) */}
          <button 
            id="download-btn"
            data-html2canvas-ignore="true"
            onClick={generatePDF}
            disabled={isGenerating}
            className={`w-full mt-8 py-4 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all ${isGenerating ? 'bg-slate-100 text-slate-400' : 'bg-[#003366] text-white hover:bg-blue-900'}`}
          >
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <><Download size={16} /> Unduh PDF Kesepakatan</>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
