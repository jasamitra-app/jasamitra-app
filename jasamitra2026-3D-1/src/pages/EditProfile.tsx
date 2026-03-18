import React from 'react';
import { motion } from 'motion/react';
import { Camera, Copy, User, Wrench } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface EditProfileProps {
 user: any;
 isMitra: boolean;
 handleBack: () => void;
 navigateTo: (page: string) => void;
 profilePhotoInputRef: React.RefObject<HTMLInputElement>;
 handleProfilePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
 handleProfilePhotoClick: () => void;
 isUploadingProfile: boolean;
 editProfileName: string;
 setEditProfileName: (name: string) => void;
 editProfileEmail: string;
 setEditProfileEmail: (email: string) => void;
 editProfilePhone: string;
 setEditProfilePhone: (phone: string) => void;
}

const EditProfile: React.FC<EditProfileProps> = ({
 user,
 isMitra,
 handleBack,
 navigateTo,
 profilePhotoInputRef,
 handleProfilePhotoChange,
 handleProfilePhotoClick,
 isUploadingProfile,
 editProfileName,
 setEditProfileName,
 editProfileEmail,
 setEditProfileEmail,
 editProfilePhone,
 setEditProfilePhone
}) => {
 return (
 <motion.div key="edit-profil" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="min-h-screen bg-slate-50/50 relative overflow-hidden perspective-[1000px]">
 {/* 3D Background Elements */}
 <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent -skew-y-6 transform-origin-top-left -z-10" />
 <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
 <div className="absolute top-40 -left-20 w-48 h-48 bg-accent/20 rounded-full blur-3xl -z-10" />

 <PageHeader title="Edit Profil" subtitle="Perbarui data diri Anda" onBack={handleBack} />
 <main className="px-6 pt-6 space-y-6 pb-24">
 <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-200 text-center ">
 <div className="relative w-24 h-24 mx-auto mb-4">
 <input 
 type="file" 
 ref={profilePhotoInputRef} 
 onChange={handleProfilePhotoChange} 
 className="hidden" 
 accept="image/*"
 />
 <div 
 onClick={handleProfilePhotoClick}
 className="relative w-full h-full cursor-pointer group"
 >
 <img src={user?.photoURL || "https://ui-avatars.com/api/?name=User&background=2563eb&color=fff&size=100"} className="w-full h-full rounded-full border-4 border-white shadow-sm object-cover" />
 <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
 <Camera size={24} className="text-white" />
 </div>
 {isUploadingProfile && (
 <div className="absolute inset-0 bg-white/60 rounded-full flex items-center justify-center">
 <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
 </div>
 )}
 </div>
 <button 
 onClick={handleProfilePhotoClick}
 className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-sm hover:scale-110 transition-transform border border-slate-200"
 >
 <Camera size={16} />
 </button>
 </div>
 <div className="bg-white p-3 rounded-2xl flex items-center justify-between border border-slate-200 shadow-sm">
 <div className="text-left">
 <p className="text-[10px] font-bold text-slate-400 uppercase">No. Member Mitra</p>
 <p className="text-xs font-bold text-slate-700">-</p>
 </div>
 <button className="p-2 text-primary hover:scale-110 transition-transform"><Copy size={16} /></button>
 </div>
 </div>
 <div className="bg-white p-6 rounded-[40px] shadow-sm border border-slate-200 space-y-4 ">
 <h3 className="text-sm font-bold text-primary flex items-center gap-2"><User size={18} /> Data Pribadi</h3>
 <div className="space-y-4">
 <input 
 type="text" 
 value={editProfileName} 
 onChange={(e) => setEditProfileName(e.target.value)} 
 className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20 shadow-sm" 
 placeholder="Nama Lengkap" 
 />
 <input 
 type="email" 
 value={editProfileEmail} 
 onChange={(e) => setEditProfileEmail(e.target.value)} 
 className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl p-4 text-sm font-medium outline-none text-slate-400 shadow-sm" 
 placeholder="Email" 
 disabled
 />
 <input 
 type="tel" 
 value={editProfilePhone} 
 onChange={(e) => setEditProfilePhone(e.target.value)} 
 className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20 shadow-sm" 
 placeholder="Nomor HP" 
 />
 </div>
 <h3 className="text-sm font-bold text-primary flex items-center gap-2 mt-6"><Wrench size={18} /> Bidang Keahlian</h3>
 <div className="flex flex-wrap gap-2">
 <p className="text-xs text-slate-400 italic">Belum ada keahlian ditambahkan</p>
 </div>
 <motion.button 
 whileHover={{ scale: 1.02, translateY: -2 }}
 whileTap={{ scale: 0.98 }}
 onClick={async () => {
 if (!user) return;
 try {
 await updateProfile(user, { displayName: editProfileName });
 const userRef = doc(db, isMitra ? 'mitras' : 'users', user.uid);
 await setDoc(userRef, { 
 name: editProfileName,
 phone: editProfilePhone,
 wa: editProfilePhone
 }, { merge: true });
 alert('Profil berhasil disimpan!'); 
 navigateTo('akun');
 } catch (error) {
 console.error("Error updating profile:", error);
 alert('Gagal menyimpan profil.');
 }
 }} 
 className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-sm mt-4 border border-slate-200"
 >
 Simpan Perubahan
 </motion.button>
 </div>
 </main>
 </motion.div>
 );
};

export default EditProfile;
