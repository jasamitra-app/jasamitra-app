import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Plus } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

interface MyAddressProps {
 handleBack: () => void;
 isEditingAddress: boolean;
 setIsEditingAddress: (isEditing: boolean) => void;
 tempAddress: string;
 setTempAddress: (address: string) => void;
 handleSaveAddress: () => void;
 userAddress: string;
}

const MyAddress: React.FC<MyAddressProps> = ({
 handleBack,
 isEditingAddress,
 setIsEditingAddress,
 tempAddress,
 setTempAddress,
 handleSaveAddress,
 userAddress
}) => {
 return (
 <motion.div key="alamat-saya" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="min-h-screen bg-slate-50/50 relative overflow-hidden perspective-[1000px]">
 {/* 3D Background Elements */}
 <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent -skew-y-6 transform-origin-top-left -z-10" />
 <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
 <div className="absolute top-40 -left-20 w-48 h-48 bg-accent/20 rounded-full blur-3xl -z-10" />

 <PageHeader title="Alamat Saya" subtitle="Kelola alamat pengiriman" onBack={handleBack} />
 <main className="px-6 pt-6 space-y-4 pb-24">
 {isEditingAddress ? (
 <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-200 space-y-4 ">
 <h3 className="text-sm font-bold text-slate-800 mb-2">Edit Alamat</h3>
 <textarea 
 value={tempAddress}
 onChange={(e) => setTempAddress(e.target.value)}
 placeholder="Masukkan alamat lengkap Anda..."
 className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-medium outline-none min-h-[120px] focus:ring-2 ring-primary/20 shadow-sm"
 />
 <div className="flex gap-3">
 <motion.button 
 whileHover={{ scale: 1.02 }}
 whileTap={{ scale: 0.98 }}
 onClick={() => setIsEditingAddress(false)}
 className="flex-1 py-4 text-slate-400 font-bold text-sm bg-white border border-slate-200 rounded-2xl shadow-sm"
 >
 Batal
 </motion.button>
 <motion.button 
 whileHover={{ scale: 1.02, translateY: -2 }}
 whileTap={{ scale: 0.98 }}
 onClick={handleSaveAddress}
 className="flex-[2] bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-sm border border-slate-200"
 >
 Simpan
 </motion.button>
 </div>
 </div>
 ) : (
 <>
 {userAddress ? (
 <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-200 flex items-start gap-4 ">
 <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0 shadow-sm border border-slate-200">
 <MapPin size={24} />
 </div>
 <div className="flex-1">
 <div className="flex justify-between items-start mb-2">
 <h3 className="text-sm font-bold text-slate-800">Alamat Utama</h3>
 <motion.button 
 whileHover={{ scale: 1.1 }}
 whileTap={{ scale: 0.9 }}
 onClick={() => {
 setTempAddress(userAddress);
 setIsEditingAddress(true);
 }}
 className="text-primary text-xs font-bold"
 >
 Edit
 </motion.button>
 </div>
 <p className="text-xs font-medium text-slate-500 leading-relaxed">{userAddress}</p>
 </div>
 </div>
 ) : (
 <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-200 text-center py-12 ">
 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4 shadow-sm border border-slate-200">
 <MapPin size={32} />
 </div>
 <h3 className="text-sm font-bold text-slate-800">Belum Ada Alamat</h3>
 <p className="text-xs font-medium text-slate-400 mt-2">Anda belum menambahkan alamat pengiriman.</p>
 </div>
 )}
 {!userAddress && (
 <motion.button 
 whileHover={{ scale: 1.02, translateY: -2 }}
 whileTap={{ scale: 0.98 }}
 onClick={() => {
 setTempAddress('');
 setIsEditingAddress(true);
 }}
 className="w-full py-6 bg-white/40 border-2 border-dashed border-primary/30 rounded-[40px] text-primary font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/60 transition-colors"
 >
 <Plus size={20} /> Tambah Alamat Baru
 </motion.button>
 )}
 </>
 )}
 </main>
 </motion.div>
 );
};

export default MyAddress;
