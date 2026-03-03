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
  Camera
} from 'lucide-react';

export type CategoryId = 'all' | 'elektronik' | 'bangunan' | 'cleaning' | 'otomotif' | 'instalasi' | 'furnitur' | 'lainnya';

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
}

export const CATEGORIES = [
  { id: 'all' as CategoryId, name: 'Semua', icon: LayoutGrid, color: 'from-primary to-primary-light' },
  { id: 'elektronik' as CategoryId, name: 'Elektronik', icon: Tv, color: 'from-accent to-secondary' },
  { id: 'bangunan' as CategoryId, name: 'Bangunan', icon: HardHat, color: 'from-primary to-primary-light' },
  { id: 'cleaning' as CategoryId, name: 'Cleaning', icon: Brush, color: 'from-accent to-secondary' },
  { id: 'otomotif' as CategoryId, name: 'Otomotif', icon: Car, color: 'from-primary to-primary-light' },
  { id: 'instalasi' as CategoryId, name: 'Instalasi', icon: Plug, color: 'from-accent to-secondary' },
  { id: 'furnitur' as CategoryId, name: 'Furnitur', icon: Sofa, color: 'from-primary to-primary-light' },
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
    { id: 'pompa_air', nama: 'Pasang Pompa Air', icon: Droplets, count: 0 }
  ],
  furnitur: [
    { id: 'kursi', nama: 'Servis Kursi', icon: Sofa, count: 0 },
    { id: 'spring_bed', nama: 'Servis Spring Bed', icon: Bed, count: 0 },
    { id: 'lemari', nama: 'Servis Lemari', icon: Home, count: 0 },
    { id: 'meja', nama: 'Servis Meja', icon: Grid3X3, count: 0 },
    { id: 'kursi_makan', nama: 'Servis Kursi Makan', icon: Sofa, count: 0 },
    { id: 'rotan', nama: 'Servis Furnitur Rotan', icon: Wrench, count: 0 },
    { id: 'furnitur_lain', nama: 'Servis Furnitur Lainnya', icon: MoreHorizontal, count: 0 }
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

