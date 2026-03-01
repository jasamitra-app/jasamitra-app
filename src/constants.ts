import { 
  LayoutGrid,
  Tv, 
  HardHat, 
  Brush, 
  Car, 
  Plug, 
  MoreHorizontal
} from 'lucide-react';

export type CategoryId = 'all' | 'elektronik' | 'bangunan' | 'cleaning' | 'otomotif' | 'instalasi' | 'lainnya';

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

// CATEGORIES - Tetap untuk navigasi
export const CATEGORIES = [
  { id: 'all' as CategoryId, name: 'Semua', icon: LayoutGrid, color: 'from-blue-600 to-blue-700' },
  { id: 'elektronik' as CategoryId, name: 'Elektronik', icon: Tv, color: 'from-rose-500 to-rose-700' },
  { id: 'bangunan' as CategoryId, name: 'Bangunan', icon: HardHat, color: 'from-amber-500 to-amber-700' },
  { id: 'cleaning' as CategoryId, name: 'Cleaning', icon: Brush, color: 'from-emerald-500 to-emerald-700' },
  { id: 'otomotif' as CategoryId, name: 'Otomotif', icon: Car, color: 'from-violet-500 to-violet-700' },
  { id: 'instalasi' as CategoryId, name: 'Instalasi', icon: Plug, color: 'from-cyan-500 to-cyan-700' },
  { id: 'lainnya' as CategoryId, name: 'Lainnya', icon: MoreHorizontal, color: 'from-slate-400 to-slate-500' },
];

// SUB_CATEGORIES - SEMUA DIKOSONGKAN
export const SUB_CATEGORIES: Record<string, SubCategory[]> = {
  elektronik: [],
  bangunan: [],
  cleaning: [],
  otomotif: [],
  instalasi: [],
  lainnya: []
};

// SERVICES - KOSONGKAN TOTAL
export const SERVICES: Service[] = [];
