export type Page = 'beranda' | 'pesan' | 'layanan' | 'akun' | 'login' | 'daftar-mitra' | 'kebijakan' | 'syarat-ketentuan' | 'edit-profil' | 'alamat-saya' | 'iklan-saya' | 'chat' | 'profil-mitra' | 'pesanan' | 'subkategori' | 'peraturan-pelanggan' | 'protokol-mitra' | 'jaminan-keamanan' | 'admin-pembayaran' | 'syarat-pendaftaran-mitra' | 'daftar-mitra-unggulan' | 'pusat-bantuan' | 'bantuan-order' | 'bantuan-akun' | 'bantuan-pembayaran' | 'bantuan-aplikasi' | 'bantuan-pesanan-pelanggan' | 'bantuan-akun-pelanggan' | 'bantuan-pembayaran-pelanggan' | 'bantuan-layanan-pelanggan' | 'semua-kategori' | 'favorit' | 'statistik-mitra' | 'jadwal-mitra' | 'lacak-lokasi' | 'invoice' | 'partner-jasamitra' | 'admin-partner' | 'mitra-unggulan';

export interface Payment {
 id: string;
 orderId: string;
 userId: string;
 userName: string;
 mitraId: string;
 mitraName: string;
 dealAmount: number;
 dpAmount: number;
 mitraAmount: number;
 proofUrl: string;
 status: 'pending' | 'verified' | 'rejected';
 verifiedBy?: string;
 verifiedAt?: any;
 verificationNote?: string;
 createdAt: any;
}

export interface Transaction {
 id: string;
 customerID: string;
 mitraID: string;
 serviceId?: string;
 totalPrice: number;
 dpAmount: number;
 status: 'pending' | 'paid' | 'completed';
 proofUrl?: string;
 createdAt: any;
}

export interface ChatMessage {
 id: string;
 sender: 'user' | 'mitra';
 type: 'text' | 'image';
 content: string;
 time: string;
 isDeal?: boolean;
 dealData?: any;
}

export interface Order {
 id: string;
 title: string;
 status: 'proses' | 'selesai' | 'batal';
 price: string;
 date: string;
 technician: string;
 progress: number;
 update?: string;
}
