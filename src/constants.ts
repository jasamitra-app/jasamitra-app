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
  Flame
} from 'lucide-react';

export type CategoryId = 'all' | 'elektronik' | 'bangunan' | 'cleaning' | 'otomotif' | 'instalasi' | 'furnitur' | 'pengelasan' | 'lainnya';

export interface SubCategory {
  id: string;
  nama: string;
  icon: any;
  count: number;
}

export interface Service {
  id: number;
  cat: CategoryId;
  subcat: string;
  title: string;
  price: string;
  img: string;
  rating: number;
  reviews: number;
  location?: string;
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
    { id: 'tukang', nama: 'Tukang Bangunan', icon: HardHat, count: 0 },
    { id: 'cat', nama: 'Pengecatan', icon: PaintRoller, count: 0 },
    { id: 'keramik', nama: 'Pasang Keramik', icon: Grid3X3, count: 0 },
    { id: 'plafon', nama: 'Pasang Plafon', icon: Building, count: 0 },
    { id: 'pipa', nama: 'Perbaikan Pipa', icon: Droplets, count: 0 },
    { id: 'atap', nama: 'Perbaikan Atap', icon: Home, count: 0 }
  ],
  cleaning: [
    { id: 'rumah', nama: 'Cuci Rumah', icon: Brush, count: 0 },
    { id: 'sofa', nama: 'Cuci Sofa', icon: Sofa, count: 0 },
    { id: 'karpet', nama: 'Cuci Karpet', icon: Brush, count: 0 },
    { id: 'spring_bed', nama: 'Cuci Spring Bed', icon: Bed, count: 0 },
    { id: 'ac', nama: 'Cuci AC', icon: Snowflake, count: 0 }
  ],
  otomotif: [
    { id: 'mobil', nama: 'Servis Mobil', icon: Car, count: 0 },
    { id: 'motor', nama: 'Servis Motor', icon: Bike, count: 0 },
    { id: 'ac_mobil', nama: 'Servis AC Mobil', icon: Snowflake, count: 0 },
    { id: 'body_repair', nama: 'Body Repair', icon: PaintRoller, count: 0 }
  ],
  instalasi: [
    { id: 'listrik', nama: 'Instalasi Listrik', icon: Bolt, count: 0 },
    { id: 'cctv', nama: 'Pasang CCTV', icon: Video, count: 0 },
    { id: 'internet', nama: 'Instalasi Internet', icon: Wifi, count: 0 },
    { id: 'pompa_air', nama: 'Pasang Pompa Air', icon: Droplets, count: 0 },
    { id: 'speaker_inst', nama: 'Instalasi Speaker', icon: Volume2, count: 0 },
    { id: 'kitchen_set', nama: 'Instalasi Kitchen Set', icon: Home, count: 0 }
  ],
  furnitur: [
    { id: 'sofa', nama: 'Servis Sofa', icon: Sofa, count: 0 },
    { id: 'spring_bed', nama: 'Servis Spring Bed', icon: Bed, count: 0 },
    { id: 'lemari', nama: 'Servis Lemari', icon: Home, count: 0 },
    { id: 'meja', nama: 'Servis Meja', icon: Grid3X3, count: 0 },
    { id: 'kursi_makan', nama: 'Servis Kursi Makan', icon: Sofa, count: 0 },
    { id: 'rotan', nama: 'Servis Furnitur Rotan', icon: Wrench, count: 0 },
    { id: 'furnitur_lain', nama: 'Servis Furnitur Lainnya', icon: MoreHorizontal, count: 0 }
  ],
  pengelasan: [
    { id: 'las_pagar', nama: 'Las Pagar', icon: Flame, count: 0 },
    { id: 'las_pipa', nama: 'Las Pipa', icon: Droplets, count: 0 },
    { id: 'las_kanopi', nama: 'Las Kanopi', icon: Home, count: 0 },
    { id: 'las_tangga', nama: 'Las Tangga', icon: Grid3X3, count: 0 },
    { id: 'las_balkon', nama: 'Las Balkon', icon: Building, count: 0 },
    { id: 'las_rangka_baja', nama: 'Las Rangka Baja', icon: HardHat, count: 0 },
    { id: 'las_lainnya', nama: 'Las Lainnya', icon: Wrench, count: 0 }
  ],
  lainnya: [
    { id: 'lain1', nama: 'Servis Lainnya', icon: Wrench, count: 0 }
  ]
};

export const SERVICES: Service[] = [];

export const PROVINCES = [
  "Aceh D.I.",
  "Bali",
  "Bangka Belitung",
  "Banten",
  "Bengkulu",
  "Gorontalo",
  "Jakarta D.K.I.",
  "Jambi",
  "Jawa Barat",
  "Jawa Tengah",
  "Jawa Timur",
  "Kalimantan Barat",
  "Kalimantan Selatan",
  "Kalimantan Tengah",
  "Kalimantan Timur",
  "Kalimantan Utara",
  "Kepulauan Riau",
  "Lampung",
  "Maluku",
  "Maluku Utara",
  "Nusa Tenggara Barat",
  "Nusa Tenggara Timur",
  "Papua",
  "Papua Barat",
  "Papua Barat Daya",
  "Papua Pegunungan",
  "Papua Selatan",
  "Papua Tengah",
  "Riau",
  "Sulawesi Barat",
  "Sulawesi Selatan",
  "Sulawesi Tengah",
  "Sulawesi Tenggara",
  "Sulawesi Utara",
  "Sumatera Barat",
  "Sumatera Selatan",
  "Sumatera Utara",
  "Yogyakarta D.I."
];

export const CITIES: Record<string, string[]> = {
  "Jawa Barat": ["Bandung", "Bekasi", "Bogor", "Cimahi", "Cirebon", "Depok", "Sukabumi", "Tasikmalaya", "Banjar", "Bandung Barat", "Bekasi Kab.", "Bogor Kab.", "Ciamis", "Cianjur", "Cirebon Kab.", "Garut", "Indramayu", "Karawang", "Kuningan", "Majalengka", "Pangandaran", "Purwakarta", "Subang", "Sukabumi Kab.", "Sumedang", "Tasikmalaya Kab."],
  "Jakarta D.K.I.": ["Jakarta Pusat", "Jakarta Utara", "Jakarta Barat", "Jakarta Selatan", "Jakarta Timur", "Kepulauan Seribu"],
  "Banten": ["Tangerang", "Tangerang Selatan", "Serang", "Cilegon", "Lebak", "Pandeglang", "Serang Kab.", "Tangerang Kab."],
  "Jawa Tengah": ["Semarang", "Surakarta", "Magelang", "Pekalongan", "Salatiga", "Tegal", "Banyumas", "Batang", "Blora", "Boyolali", "Brebes", "Cilacap", "Demak", "Grobogan", "Jepara", "Karanganyar", "Kebumen", "Kendal", "Klaten", "Kudus", "Magelang Kab.", "Pati", "Pekalongan Kab.", "Pemalang", "Purbalingga", "Purworejo", "Rembang", "Semarang Kab.", "Sragen", "Sukoharjo", "Tegal Kab.", "Temanggung", "Wonogiri", "Wonosobo"],
  "Jawa Timur": ["Surabaya", "Malang", "Batu", "Blitar", "Kediri", "Madiun", "Mojokerto", "Pasuruan", "Probolinggo", "Bangkalan", "Banyuwangi", "Blitar Kab.", "Bojonegoro", "Bondowoso", "Gresik", "Jember", "Jombang", "Kediri Kab.", "Lamongan", "Lumajang", "Madiun Kab.", "Magetan", "Malang Kab.", "Mojokerto Kab.", "Nganjuk", "Ngawi", "Pacitan", "Pamekasan", "Pasuruan Kab.", "Ponorogo", "Probolinggo Kab.", "Sampang", "Sidoarjo", "Situbondo", "Sumenep", "Trenggalek", "Tuban", "Tulungagung"],
  "Bali": ["Denpasar", "Badung", "Bangli", "Buleleng", "Gianyar", "Jembrana", "Karangasem", "Klungkung", "Tabanan"]
};

export const DISTRICTS: Record<string, string[]> = {
  "Kota Bandung": ["Andir", "Antapani", "Arcamanik", "Astanaanyar", "Babakanciparay", "Bandung Kidul", "Bandung Kulon", "Bandung Wetan", "Batununggal", "Bojongloa Kaler", "Bojongloa Kidul", "Buahbatu", "Cibeunying Kaler", "Cibeunying Kidul", "Cibiru", "Cicendo", "Cidadap", "Cinambo", "Coblong", "Gedebage", "Kiaracondong", "Lengkong", "Mandalajati", "Panyileukan", "Rancasari", "Regol", "Sukajadi", "Sukasari", "Sumurbandung", "Ujungberung"],
  "Kota Cimahi": ["Cimahi Utara", "Cimahi Tengah", "Cimahi Selatan"],
  "Kab. Bandung": ["Soreang", "Ciwidey", "Margahayu", "Dayeuhkolot", "Bojongsoang", "Baleendah", "Ciparay", "Majalaya", "Cileunyi"],
  "Kab. Bandung Barat (KBB)": ["Ngamprah", "Padalarang", "Lembang", "Parongpong", "Cisarua", "Batujujur"],
  "Bekasi": ["Bekasi Barat", "Bekasi Timur", "Bekasi Utara", "Bekasi Selatan", "Rawalumbu", "Bantar Gebang", "Pondok Gede", "Jatiasih", "Jatisampurna", "Mustika Jaya", "Medan Satria", "Pondok Melati"],
  "Bogor": ["Bogor Barat", "Bogor Selatan", "Bogor Tengah", "Bogor Timur", "Bogor Utara", "Tanah Sareal"],
  "Depok": ["Beji", "Bojongsari", "Cilodong", "Cimanggis", "Cinere", "Cipayung", "Limo", "Pancoran Mas", "Sawangan", "Sukmajaya", "Tapos"],
  "Tangerang": ["Batuceper", "Benda", "Cibodas", "Ciledug", "Cipondoh", "Jatiuwung", "Karangtengah", "Karawaci", "Larangan", "Neglasari", "Periuk", "Pinang", "Tangerang"],
  "Semarang": ["Banyumanik", "Candisari", "Gajahmungkur", "Gayamsari", "Genuk", "Gunungpati", "Mijen", "Ngaliyan", "Pedurungan", "Semarang Barat", "Semarang Selatan", "Semarang Tengah", "Semarang Timur", "Semarang Utara", "Tembalang", "Tugu"],
  "Surabaya": ["Asemrowo", "Benowo", "Bubutan", "Bulak", "Dukuh Pakis", "Gayungan", "Genteng", "Gubeng", "Gunung Anyar", "Jambangan", "Karang Pilang", "Kenjeran", "Krembangan", "Lakar Santri", "Mulyorejo", "Pabean Cantian", "Pakal", "Rungkut", "Sambikerep", "Sawahan", "Semampir", "Simokerto", "Sukolilo", "Sukomanunggal", "Tandes", "Tegalsari", "Tenggilis Mejoyo", "Wiyung", "Wonocolo", "Wonokromo"],
  "Denpasar": ["Denpasar Barat", "Denpasar Selatan", "Denpasar Timur", "Denpasar Utara"]
};

