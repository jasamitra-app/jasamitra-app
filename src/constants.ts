import { 
 Tv, 
 HardHat, 
 Brush, 
 Car, 
 Plug, 
 MoreHorizontal, 
 Smartphone, 
 WashingMachine, 
 Thermometer, 
 Snowflake, 
 Volume2, 
 Music, 
 Laptop, 
 PaintRoller, 
 Grid3X3, 
 Building, 
 Droplets, 
 Home, 
 Sofa, 
 Bed, 
 Bike, 
 Bolt, 
 Video, 
 Wifi,
 LayoutGrid,
 Wrench,
 Camera,
 Flame,
 PartyPopper,
 Printer,
 Hammer,
 TreePine,
 Heart,
 Image,
 Video as VideoIcon,
 Mic,
 Scissors,
 PenTool,
 Leaf,
 Store,
 FileText,
 Tag,
 Zap
} from 'lucide-react';

export type CategoryId = 'all' | 'elektronik' | 'bangunan' | 'cleaning' | 'otomotif' | 'instalasi' | 'furnitur' | 'pengelasan' | 'event' | 'percetakan' | 'custom' | 'taman' | 'lainnya';

export interface SubCategory {
 id: string;
 nama: string;
 icon: any;
 count: number;
}

export interface Service {
 id: string | number;
 cat: CategoryId;
 category?: string;
 subcat: string;
 title: string;
 price: number;
 servicePolicy?: string;
 img: string;
 rating: number;
 reviews: number;
 location?: string;
 desc?: string;
 mitraId?: string;
 mitraName?: string;
 status?: 'aktif' | 'nonaktif';
 createdAt?: any;
}

export const CATEGORIES = [
 { id: 'all' as CategoryId, name: 'Semua', icon: LayoutGrid, color: 'from-primary to-primary-light' },
 { id: 'elektronik' as CategoryId, name: 'Elektronik', icon: Tv, color: 'from-accent to-secondary' },
 { id: 'bangunan' as CategoryId, name: 'Bangunan', icon: HardHat, color: 'from-primary to-primary-light' },
 { id: 'cleaning' as CategoryId, name: 'Cleaning', icon: Brush, color: 'from-accent to-secondary' },
 { id: 'otomotif' as CategoryId, name: 'Otomotif', icon: Car, color: 'from-primary to-primary-light' },
 { id: 'instalasi' as CategoryId, name: 'Instalasi', icon: Plug, color: 'from-accent to-secondary' },
 { id: 'furnitur' as CategoryId, name: 'Furnitur', icon: Sofa, color: 'from-primary to-primary-light' },
 { id: 'pengelasan' as CategoryId, name: 'Pengelasan', icon: Flame, color: 'from-accent to-secondary' },
 { id: 'event' as CategoryId, name: 'Event & Pernikahan', icon: PartyPopper, color: 'from-primary to-primary-light' },
 { id: 'percetakan' as CategoryId, name: 'Percetakan & Reklame', icon: Printer, color: 'from-accent to-secondary' },
 { id: 'custom' as CategoryId, name: 'Custom & Kerajinan', icon: Hammer, color: 'from-primary to-primary-light' },
 { id: 'taman' as CategoryId, name: 'Taman & Outdoor', icon: TreePine, color: 'from-accent to-secondary' },
 { id: 'lainnya' as CategoryId, name: 'Lainnya', icon: MoreHorizontal, color: 'from-slate-400 to-slate-500' },
];

export const SUB_CATEGORIES: Record<string, SubCategory[]> = {
 elektronik: [
 { id: 'hp', nama: 'Servis HP', icon: Smartphone, count: 0 },
 { id: 'mesin_cuci', nama: 'Servis Mesin Cuci', icon: WashingMachine, count: 0 },
 { id: 'kulkas', nama: 'Servis Kulkas', icon: Thermometer, count: 0 },
 { id: 'ac', nama: 'Servis AC', icon: Snowflake, count: 0 },
 { id: 'amplifier', nama: 'Servis Amplifier', icon: Volume2, count: 0 },
 { id: 'speaker', nama: 'Servis Speaker', icon: Music, count: 0 },
 { id: 'tv', nama: 'Servis TV', icon: Tv, count: 0 },
 { id: 'laptop', nama: 'Servis Laptop', icon: Laptop, count: 0 },
 { id: 'camera', nama: 'Servis Camera DSLR/Mirrorless', icon: Camera, count: 0 }
 ],
 bangunan: [
 { id: 'bangun_rumah', nama: 'Bangun Rumah', icon: Home, count: 0 },
 { id: 'renovasi_rumah', nama: 'Renovasi Rumah', icon: Hammer, count: 0 },
 { id: 'tukang_bangunan', nama: 'Tukang Bangunan', icon: HardHat, count: 0 },
 { id: 'tukang_keramik', nama: 'Tukang Keramik', icon: Grid3X3, count: 0 },
 { id: 'tukang_cat', nama: 'Tukang Cat', icon: PaintRoller, count: 0 },
 { id: 'tukang_plafon', nama: 'Tukang Gypsum / Plafon', icon: Building, count: 0 },
 { id: 'pasang_baja', nama: 'Pasang Baja Ringan', icon: Wrench, count: 0 },
 { id: 'pasang_pagar', nama: 'Pasang Pagar / Kanopi', icon: LayoutGrid, count: 0 },
 { id: 'waterproofing', nama: 'Waterproofing', icon: Droplets, count: 0 },
 { id: 'cor_beton', nama: 'Cor Beton', icon: HardHat, count: 0 },
 { id: 'bangunan_semua', nama: 'Semua Bangunan', icon: MoreHorizontal, count: 0 }
 ],
 cleaning: [
 { id: 'clean_rumah', nama: 'Bersih full Rumah', icon: Home, count: 0 },
 { id: 'clean_kantor', nama: 'Bersih Kantor', icon: Building, count: 0 },
 { id: 'clean_deep', nama: 'Deep Cleaning', icon: Brush, count: 0 },
 { id: 'clean_sofa', nama: 'Cuci Sofa', icon: Sofa, count: 0 },
 { id: 'clean_kasur', nama: 'Cuci Kasur', icon: Bed, count: 0 },
 { id: 'clean_karpet', nama: 'Cuci Karpet', icon: LayoutGrid, count: 0 },
 { id: 'clean_gorden', nama: 'Cuci Gorden', icon: Image, count: 0 },
 { id: 'clean_pakaian', nama: 'Cuci pakaian', icon: WashingMachine, count: 0 },
 { id: 'clean_setrika', nama: 'Setrika pakaian', icon: Zap, count: 0 },
 { id: 'clean_lantai', nama: 'Poles Lantai', icon: Brush, count: 0 },
 { id: 'clean_kaca', nama: 'Pembersih Kaca', icon: LayoutGrid, count: 0 },
 { id: 'clean_semua', nama: 'Semua Cleaning', icon: MoreHorizontal, count: 0 }
 ],
 otomotif: [
 { id: 'oto_motor', nama: 'Servis Motor/Injeksi', icon: Bike, count: 0 },
 { id: 'oto_mobil', nama: 'Servis Mobil', icon: Car, count: 0 },
 { id: 'oto_tuneup', nama: 'Tune Up', icon: Wrench, count: 0 },
 { id: 'oto_ac', nama: 'Servis AC Mobil', icon: Snowflake, count: 0 },
 { id: 'oto_listrik', nama: 'Kelistrikan Mobil', icon: Bolt, count: 0 },
 { id: 'oto_salon', nama: 'Salon Mobil', icon: Brush, count: 0 },
 { id: 'oto_derek', nama: 'Derek / Towing', icon: Car, count: 0 },
 { id: 'oto_spooring', nama: 'Spooring & Balancing', icon: Grid3X3, count: 0 },
 { id: 'oto_audio', nama: 'Instalasi Audio Mobil', icon: Volume2, count: 0 },
 { id: 'oto_radiator', nama: 'Servis Radiator Mobil', icon: Thermometer, count: 0 }
 ],
 instalasi: [
 { id: 'inst_ac', nama: 'Instalasi AC', icon: Snowflake, count: 0 },
 { id: 'inst_cctv', nama: 'Instalasi CCTV', icon: Video, count: 0 },
 { id: 'inst_listrik', nama: 'Instalasi Listrik', icon: Bolt, count: 0 },
 { id: 'inst_audio', nama: 'Instalasi Audio indoor/outdoor', icon: Volume2, count: 0 },
 { id: 'inst_pompa', nama: 'Instalasi Pompa Air', icon: Droplets, count: 0 },
 { id: 'inst_toren', nama: 'Instalasi Toren Air', icon: Droplets, count: 0 },
 { id: 'inst_tv', nama: 'Instalasi TV Wall Mount', icon: Tv, count: 0 },
 { id: 'inst_internet', nama: 'Instalasi Internet / WiFi', icon: Wifi, count: 0 },
 { id: 'inst_water_heater', nama: 'Instalasi Water Heater', icon: Thermometer, count: 0 },
 { id: 'inst_kitchen', nama: 'Instalasi Kitchen Set', icon: Home, count: 0 },
 { id: 'inst_pagar', nama: 'Instalasi Pagar Otomatis', icon: Zap, count: 0 }
 ],
 furnitur: [
 { id: 'fur_custom', nama: 'Furniture Custom', icon: Hammer, count: 0 },
 { id: 'fur_perbaikan', nama: 'Perbaikan Furnitur', icon: Wrench, count: 0 },
 { id: 'fur_lemari', nama: 'Pembuatan Lemari', icon: LayoutGrid, count: 0 },
 { id: 'fur_meja', nama: 'Pembuatan Meja', icon: Grid3X3, count: 0 },
 { id: 'fur_kursi', nama: 'Pembuatan Kursi', icon: Sofa, count: 0 },
 { id: 'fur_kitchen', nama: 'Kitchen Set', icon: Home, count: 0 },
 { id: 'fur_rak', nama: 'Rak / Lemari Dinding', icon: LayoutGrid, count: 0 },
 { id: 'fur_kasur', nama: 'Tempat Tidur', icon: Bed, count: 0 },
 { id: 'fur_partisi', nama: 'Partisi Ruangan', icon: Building, count: 0 },
 { id: 'fur_finishing', nama: 'Finishing Furniture', icon: PaintRoller, count: 0 },
 { id: 'fur_semua', nama: 'Semua furnitur', icon: MoreHorizontal, count: 0 }
 ],
 pengelasan: [
 { id: 'las_pagar', nama: 'Las Pagar', icon: Flame, count: 0 },
 { id: 'las_kanopi', nama: 'Las Kanopi', icon: Home, count: 0 },
 { id: 'las_teralis', nama: 'Las Teralis', icon: Grid3X3, count: 0 },
 { id: 'las_pintu', nama: 'Las Pintu Besi', icon: LayoutGrid, count: 0 },
 { id: 'las_tangga', nama: 'Las Railing Tangga', icon: Building, count: 0 },
 { id: 'las_stainless', nama: 'Las Stainless', icon: Zap, count: 0 },
 { id: 'las_aluminium', nama: 'Las Aluminium', icon: Wrench, count: 0 },
 { id: 'las_perbaikan', nama: 'Perbaikan Las', icon: Hammer, count: 0 },
 { id: 'las_rangka', nama: 'Las Rangka Besi', icon: HardHat, count: 0 },
 { id: 'las_rak', nama: 'Las Rak / Meja Besi', icon: Sofa, count: 0 },
 { id: 'las_semua', nama: 'Semua pengelasan', icon: MoreHorizontal, count: 0 }
 ],
 event: [
 { id: 'rias_pengantin', nama: 'Jasa Rias Pengantin', icon: Heart, count: 0 },
 { id: 'dekorasi_pelaminan', nama: 'Jasa Dekorasi Pelaminan', icon: Home, count: 0 },
 { id: 'fotografi_acara', nama: 'Jasa Fotografi Acara', icon: Camera, count: 0 },
 { id: 'videografi_acara', nama: 'Jasa Videografi Acara', icon: VideoIcon, count: 0 },
 { id: 'dokumentasi_wedding', nama: 'Jasa Dokumentasi Wedding', icon: Image, count: 0 },
 { id: 'mua', nama: 'Jasa Makeup Artist (MUA)', icon: Brush, count: 0 },
 { id: 'wedding_organizer', nama: 'Jasa Wedding Organizer', icon: PartyPopper, count: 0 },
 { id: 'mc_acara', nama: 'Jasa MC Acara', icon: Mic, count: 0 },
 { id: 'lighting_acara', nama: 'Jasa Lighting Acara', icon: Bolt, count: 0 },
 { id: 'sewa_baju_pengantin', nama: 'Jasa Sewa Baju Pengantin', icon: Scissors, count: 0 },
 { id: 'sewa_tenda_acara', nama: 'Jasa Sewa Tenda Acara', icon: Home, count: 0 },
 { id: 'dekorasi_balon', nama: 'Jasa Dekorasi Balon', icon: PartyPopper, count: 0 }
 ],
 percetakan: [
 { id: 'neon_box', nama: 'Jasa Pembuatan Neon Box', icon: Printer, count: 0 },
 { id: 'huruf_timbul', nama: 'Jasa Pembuatan Huruf Timbul', icon: PenTool, count: 0 },
 { id: 'papan_nama', nama: 'Jasa Pembuatan Papan Nama Toko', icon: LayoutGrid, count: 0 },
 { id: 'branding_toko', nama: 'Jasa Branding Toko', icon: Store, count: 0 },
 { id: 'cutting_sticker', nama: 'Jasa Cutting Sticker', icon: Scissors, count: 0 },
 { id: 'cetak_banner', nama: 'Jasa Cetak Banner', icon: Image, count: 0 },
 { id: 'cetak_spanduk', nama: 'Jasa Cetak Spanduk', icon: Image, count: 0 },
 { id: 'cetak_brosur', nama: 'Jasa Cetak Brosur', icon: FileText, count: 0 },
 { id: 'cetak_stiker', nama: 'Jasa Cetak Stiker', icon: Tag, count: 0 },
 { id: 'cetak_undangan', nama: 'Jasa Cetak Undangan', icon: Heart, count: 0 }
 ],
 custom: [
 { id: 'box_speaker', nama: 'Jasa Custom Box Speaker', icon: Volume2, count: 0 },
 { id: 'amp_solid_state', nama: 'Jasa Custom Amplifier Solid State', icon: Plug, count: 0 },
 { id: 'amp_tube', nama: 'Jasa Custom Amplifier Tube', icon: Zap, count: 0 },
 { id: 'etalase', nama: 'Jasa Custom Etalase', icon: Grid3X3, count: 0 },
 { id: 'rotan', nama: 'Jasa Custom Rotan', icon: Sofa, count: 0 },
 { id: 'akrilik', nama: 'Jasa Custom Akrilik', icon: LayoutGrid, count: 0 },
 { id: 'rak_display', nama: 'Jasa Custom Rak Display', icon: Grid3X3, count: 0 },
 { id: 'booth_usaha', nama: 'Jasa Custom Booth Usaha', icon: Store, count: 0 },
 { id: 'furniture', nama: 'Jasa Custom Furniture', icon: Sofa, count: 0 },
 { id: 'dekorasi', nama: 'Jasa Custom Dekorasi', icon: Brush, count: 0 }
 ],
 taman: [
 { id: 'tukang_taman', nama: 'Jasa Tukang Taman', icon: TreePine, count: 0 },
 { id: 'pembuatan_taman', nama: 'Pembuatan Taman Rumah', icon: Home, count: 0 },
 { id: 'perawatan_taman', nama: 'Perawatan Taman', icon: Leaf, count: 0 },
 { id: 'potong_rumput', nama: 'Potong Rumput', icon: Scissors, count: 0 },
 { id: 'kolam_ikan', nama: 'Pembuatan Kolam Ikan', icon: Droplets, count: 0 },
 { id: 'landscape', nama: 'Jasa Landscape', icon: TreePine, count: 0 }
 ],
 lainnya: [
 { id: 'lain1', nama: 'Servis Lainnya', icon: Wrench, count: 0 }
 ]
};

export const SERVICES: Service[] = [];

export const PROVINCES = [
 "Jawa Barat"
];

export const CITIES: Record<string, string[]> = {
 "Jawa Barat": ["Kota Bandung", "Kota Cimahi", "Kab Bandung", "Kab Bandung Barat"]
};

export const DISTRICTS: Record<string, string[]> = {
 "Kota Bandung": [
 "Andir", "Antapani", "Arcamanik", "Astanaanyar", "Babakanciparay", 
 "Bandung Kidul", "Bandung Kulon", "Bandung Wetan", "Batununggal", 
 "Bojongloa Kaler", "Bojongloa Kidul", "Buahbatu", "Cibeunying Kaler", 
 "Cibeunying Kidul", "Cibiru", "Cicendo", "Cidadap", "Cinambo", 
 "Coblong", "Gedebage", "Kiaracondong", "Lengkong", "Mandalajati", 
 "Panyileukan", "Rancasari", "Regol", "Sukajadi", "Sukasari", 
 "Sumurbandung", "Ujungberung"
 ],
 "Kota Cimahi": ["Cimahi Utara", "Cimahi Tengah", "Cimahi Selatan"],
 "Kab Bandung": [
 "Arjasari", "Baleendah", "Banjaran", "Bojongsoang", "Cangkuang", 
 "Cicalengka", "Cikancung", "Cilengkrang", "Cileunyi", "Cimaung", 
 "Cimenyan", "Ciparay", "Ciwidey", "Dayeuhkolot", "Ibun", "Katapang", 
 "Kertasari", "Kutawaringin", "Majalaya", "Margaasih", "Margahayu", 
 "Nagreg", "Pacet", "Pameungpeuk", "Pangalengan", "Paseh", 
 "Pasirjambu", "Rancabali", "Rancaekek", "Solokanjeruk", "Soreang"
 ],
 "Kab Bandung Barat": [
 "Batujajar", "Cikalongwetan", "Cihampelas", "Cililin", "Cipatat", 
 "Cipeundeuy", "Cipongkor", "Cisarua", "Gununghalu", "Lembang", 
 "Ngamprah", "Padalarang", "Parongpong", "Rongga", "Saguling", 
 "Sindangkerta"
 ]
};

