import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MessageCircle, Package, User, CreditCard, Settings, HelpCircle, Wrench } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Page } from '../types';

interface BantuanDetailProps {
  type: 'order' | 'akun' | 'pembayaran' | 'aplikasi' | 'pesanan-pelanggan' | 'akun-pelanggan' | 'pembayaran-pelanggan' | 'layanan-pelanggan';
  handleBack: () => void;
  navigateTo: (page: Page) => void;
}

export const BantuanDetail: React.FC<BantuanDetailProps> = ({ type, handleBack, navigateTo }) => {
  const contentMap = {
    order: {
      title: 'Masalah Order',
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      faqs: [
        { q: 'Bagaimana cara membatalkan pesanan?', a: 'Pesanan hanya dapat dibatalkan jika statusnya masih "Menunggu Konfirmasi". Silakan hubungi pelanggan atau admin jika ada kendala mendesak.' },
        { q: 'Apa yang harus dilakukan jika pelanggan tidak ada di tempat?', a: 'Cobalah menghubungi pelanggan melalui fitur chat atau telepon. Jika tidak ada respons selama 30 menit, Anda dapat melaporkan masalah ini ke admin.' },
        { q: 'Bagaimana cara mengubah jadwal layanan?', a: 'Jadwal layanan dapat diubah atas kesepakatan bersama dengan pelanggan. Pastikan untuk memperbarui status di aplikasi.' }
      ]
    },
    akun: {
      title: 'Akun & Profil',
      icon: User,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      faqs: [
        { q: 'Bagaimana cara mengubah foto profil?', a: 'Buka menu Akun > Edit Profil, lalu ketuk ikon kamera pada foto profil Anda untuk mengunggah foto baru.' },
        { q: 'Mengapa akun saya ditangguhkan?', a: 'Akun dapat ditangguhkan karena pelanggaran Syarat & Ketentuan atau laporan dari pelanggan. Hubungi admin untuk informasi lebih lanjut.' },
        { q: 'Bagaimana cara menghapus akun?', a: 'Untuk menghapus akun secara permanen, silakan hubungi Customer Support kami.' }
      ]
    },
    pembayaran: {
      title: 'Pembayaran',
      icon: CreditCard,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      faqs: [
        { q: 'Kapan penghasilan saya dicairkan?', a: 'Penghasilan akan dicairkan ke rekening terdaftar Anda setiap hari Selasa dan Jumat.' },
        { q: 'Bagaimana cara mengubah rekening bank?', a: 'Buka menu Akun > Pengaturan Pembayaran untuk memperbarui informasi rekening bank Anda.' },
        { q: 'Mengapa pembayaran saya tertunda?', a: 'Penundaan bisa terjadi karena hari libur nasional atau masalah verifikasi bank. Jika lebih dari 3 hari kerja, hubungi admin.' }
      ]
    },
    aplikasi: {
      title: 'Aplikasi Error',
      icon: Settings,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      faqs: [
        { q: 'Aplikasi sering keluar sendiri (force close)', a: 'Pastikan Anda menggunakan versi aplikasi terbaru. Coba hapus cache aplikasi di pengaturan HP Anda.' },
        { q: 'Tidak bisa menerima notifikasi pesanan baru', a: 'Periksa pengaturan notifikasi di HP Anda dan pastikan izin notifikasi untuk aplikasi JasaMitra sudah diaktifkan.' },
        { q: 'Lokasi GPS tidak akurat', a: 'Pastikan layanan lokasi (GPS) di HP Anda aktif dan disetel ke akurasi tinggi.' }
      ]
    },
    'pesanan-pelanggan': {
      title: 'Pesanan Saya',
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      faqs: [
        { q: 'Bagaimana cara pesan jasa?', a: 'Pilih kategori jasa di Beranda, pilih mitra yang sesuai, lalu klik tombol "Pesan Sekarang". Isi detail pesanan dan jadwal yang diinginkan.' },
        { q: 'Bagaimana cara melihat status pesanan?', a: 'Anda dapat melihat status pesanan di menu "Pesanan" (ikon keranjang di navigasi bawah).' },
        { q: 'Bagaimana cara membatalkan pesanan?', a: 'Pesanan dapat dibatalkan sebelum mitra mengonfirmasi. Buka detail pesanan dan klik "Batalkan Pesanan". Jika sudah dikonfirmasi, hubungi admin.' }
      ]
    },
    'akun-pelanggan': {
      title: 'Akun & Profil',
      icon: User,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      faqs: [
        { q: 'Bagaimana cara edit profil?', a: 'Buka menu Akun, lalu pilih "Edit Profil". Anda dapat mengubah nama, foto, dan informasi lainnya di sana.' },
        { q: 'Bagaimana cara ganti nomor HP?', a: 'Saat ini penggantian nomor HP harus melalui bantuan admin untuk alasan keamanan. Silakan hubungi Customer Support.' },
        { q: 'Saya mengalami masalah login', a: 'Pastikan koneksi internet stabil. Jika menggunakan login Google, pastikan akun Google aktif di perangkat Anda.' }
      ]
    },
    'pembayaran-pelanggan': {
      title: 'Pembayaran',
      icon: CreditCard,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      faqs: [
        { q: 'Bagaimana cara melakukan pembayaran?', a: 'Setelah pesanan dikonfirmasi mitra, Anda akan diminta membayar DP 10%. Transfer ke rekening yang tertera dan unggah bukti transfer.' },
        { q: 'Bagaimana cara upload bukti transfer?', a: 'Buka detail pesanan yang menunggu pembayaran, klik "Upload Bukti", pilih foto dari galeri, lalu kirim.' },
        { q: 'Kapan sisa pembayaran dilakukan?', a: 'Sisa pembayaran (90%) dibayarkan langsung kepada mitra setelah pekerjaan selesai dilakukan.' }
      ]
    },
    'layanan-pelanggan': {
      title: 'Layanan Bermasalah',
      icon: Wrench,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      faqs: [
        { q: 'Mitra tidak datang sesuai jadwal', a: 'Silakan hubungi mitra melalui fitur chat terlebih dahulu. Jika tidak ada respons, segera laporkan ke admin untuk dicarikan mitra pengganti.' },
        { q: 'Pekerjaan tidak sesuai harapan', a: 'Anda dapat mengajukan komplain melalui halaman detail pesanan atau langsung menghubungi Customer Support kami.' },
        { q: 'Bagaimana cara komplain layanan?', a: 'Gunakan tombol "Laporkan Masalah" di Pusat Bantuan atau hubungi admin dengan menyertakan foto bukti pekerjaan yang bermasalah.' }
      ]
    }
  };

  const data = contentMap[type];
  const Icon = data.icon;

  return (
    <motion.div 
      key={`bantuan-${type}`}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen bg-slate-50 pb-32"
    >
      <PageHeader title={data.title} onBack={handleBack} />

      <main className="p-6 space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center">
          <div className={`w-16 h-16 ${data.bg} rounded-full flex items-center justify-center ${data.color} mx-auto mb-4`}>
            <Icon size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-800 mb-2">{data.title}</h2>
          <p className="text-sm text-slate-500">Temukan jawaban untuk pertanyaan umum seputar {data.title.toLowerCase()}.</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 px-2">Pertanyaan yang Sering Diajukan</h3>
          {data.faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex gap-3 mb-2">
                <HelpCircle size={18} className="text-orange-500 shrink-0 mt-0.5" />
                <h4 className="text-sm font-bold text-slate-800">{faq.q}</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed pl-7">{faq.a}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent z-10">
        <button 
          onClick={() => navigateTo('chat')}
          className="w-full bg-slate-800 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-slate-800/20 active:scale-95 transition-transform"
        >
          <MessageCircle size={20} />
          Hubungi Admin
        </button>
      </div>
    </motion.div>
  );
};
