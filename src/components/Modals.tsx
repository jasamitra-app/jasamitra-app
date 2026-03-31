import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, ShieldCheck, Wallet, CheckCircle2, Star, Info, Send, AlertTriangle, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { CATEGORIES, SUB_CATEGORIES, DISTRICTS } from '../constants';

export function Modals({
  // Ad Modal
  showAdModal, setShowAdModal, editingAdId, setEditingAdId,
  adTitle, setAdTitle, adCategory, setAdCategory, adSubCategory, setAdSubCategory,
  adCity, setAdCity, adDistrict, setAdDistrict, adProvince, setAdProvince,
  adCoverageAreas, setAdCoverageAreas, adPrice, setAdPrice,
  adServicePolicy, setAdServicePolicy, adImage, setAdImage,
  adDesc, setAdDesc, adSkills, setAdSkills, newSkill, setNewSkill,
  isSubmittingAd, fileInputRef, handleImageUpload, submitAd,

  // Deal Modal
  showDealModal, setShowDealModal, activeDeal, confirmDeal,

  // Booking Modal
  bookingService, setBookingService, bookingName, setBookingName,
  bookingAddress, setBookingAddress, bookingDesc, setBookingDesc,
  isSubmittingBooking, submitBooking,

  // Review Modal
  showReviewModal, setShowReviewModal, reviewRating, setReviewRating,
  reviewText, setReviewText, isSubmittingReview, reviewTransaction, submitReview,

  // Offer Modal
  showOfferModal, setShowOfferModal, offerPrice, setOfferPrice,
  isSendingOffer, handleSendOffer,

  // Payment Modal
  showPaymentModal, setShowPaymentModal, paymentAmount, paymentProofPreview,
  isUploadingPayment, handleFileChange, submitPayment,

  // Reject Modal
  showRejectModal, setShowRejectModal, rejectionNote, setRejectionNote,
  rejectPayment, selectedPaymentForView, setSelectedPaymentForView,

  // Login Mitra Modal
  showLoginMitraModal, setShowLoginMitraModal, navigateTo,

  // Location Modal
  showLocationModal, setShowLocationModal, currentAddress, setCurrentAddress, recentLocations, detectLocation
}: any) {
  const [expandedCity, setExpandedCity] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {/* Location Modal */}
      {showLocationModal && (
        <motion.div key="location-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[4000] flex items-end justify-center bg-slate-900/60">
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bg-white w-full max-w-md rounded-t-3xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-4 border-b flex justify-between items-center bg-white sticky top-0 z-10">
              <h3 className="font-bold text-lg">Pilih Lokasi</h3>
              <button onClick={() => setShowLocationModal(false)} className="p-2 bg-slate-100 rounded-full text-slate-500">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <button onClick={detectLocation} className="w-full flex items-center gap-3 p-4 bg-primary/5 text-primary rounded-2xl font-bold mb-3">
                <MapPin size={20} />
                Gunakan Lokasi Saat Ini
              </button>

              <button onClick={() => { setCurrentAddress('Lokasi Bandung Raya & Cimahi'); setShowLocationModal(false); }} className="w-full flex items-center gap-3 p-4 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors rounded-2xl font-bold mb-6 border border-slate-100">
                <MapPin size={20} className="text-slate-400" />
                Lokasi Bandung Raya & Cimahi
              </button>
              
              {recentLocations && recentLocations.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Pencarian Terakhir</h4>
                  <div className="flex flex-wrap gap-2">
                    {recentLocations.map((loc: string) => (
                      <button
                        key={loc}
                        onClick={() => { setCurrentAddress(loc); setShowLocationModal(false); }}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-full transition-colors"
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Pilih Wilayah</h4>
              <div className="space-y-3">
                {Object.keys(DISTRICTS).map((city) => (
                  <div key={city} className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                    <button 
                      onClick={() => setExpandedCity(expandedCity === city ? null : city)}
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin size={18} className={expandedCity === city ? "text-primary" : "text-slate-400"} />
                        <span className={`font-bold text-sm ${expandedCity === city ? "text-primary" : "text-slate-700"}`}>{city}</span>
                      </div>
                      {expandedCity === city ? <ChevronUp size={18} className="text-primary" /> : <ChevronDown size={18} className="text-slate-400" />}
                    </button>
                    
                    <AnimatePresence>
                      {expandedCity === city && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="bg-white border-t border-slate-100"
                        >
                          <div className="p-2 grid grid-cols-1 gap-1 max-h-48 overflow-y-auto">
                            <button
                              onClick={() => { setCurrentAddress(city); setShowLocationModal(false); }}
                              className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
                            >
                              Semua {city}
                            </button>
                            {DISTRICTS[city].map((district) => (
                              <button
                                key={district}
                                onClick={() => { setCurrentAddress(`${district}, ${city}`); setShowLocationModal(false); }}
                                className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                              >
                                {district}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Ad Modal */}
      {showAdModal && (
        <motion.div key="ad-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[4000] flex items-end justify-center bg-slate-900/60 ">
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="bg-white w-full rounded-t-[40px] p-8 shadow-sm max-h-[90vh] overflow-y-auto hide-scrollbar"
          >
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
            <h3 className="text-xl font-extrabold text-slate-800 mb-2">{editingAdId ? 'Edit Iklan Jasa' : 'Buat Iklan Jasa'}</h3>
            <p className="text-xs text-slate-400 font-medium mb-8">{editingAdId ? 'Perbarui informasi iklan jasa Anda.' : 'Pasang iklan jasamu dan dapatkan lebih banyak pelanggan!'}</p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Judul Jasa</label>
                <input 
                  type="text" 
                  value={adTitle}
                  onChange={(e) => setAdTitle(e.target.value)}
                  placeholder="Contoh: Servis AC Bergaransi" 
                  className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Kategori</label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.filter(c => c.id !== 'all').map(c => {
                    const Icon = c.icon;
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          setAdCategory(c.id);
                          setAdSubCategory('');
                        }}
                        className={`p-3 rounded-xl flex items-center gap-2 text-left transition-all border-2 ${adCategory === c.id ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 bg-white text-slate-600 hover:border-primary/30'}`}
                      >
                        <div className={`p-2 rounded-lg ${adCategory === c.id ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400'}`}>
                          <Icon size={16} />
                        </div>
                        <span className="text-xs font-bold leading-tight">{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Sub-Kategori</label>
                {!adCategory ? (
                  <div className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium text-slate-400 text-center border-2 border-dashed border-slate-200">
                    Pilih Kategori Terlebih Dahulu
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {SUB_CATEGORIES[adCategory]?.map((sub: any) => {
                      const Icon = sub.icon;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => setAdSubCategory(sub.id)}
                          className={`p-3 rounded-xl flex items-center gap-2 text-left transition-all border-2 ${adSubCategory === sub.id ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 bg-white text-slate-600 hover:border-primary/30'}`}
                        >
                          <div className={`p-2 rounded-lg ${adSubCategory === sub.id ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400'}`}>
                            <Icon size={16} />
                          </div>
                          <span className="text-xs font-bold leading-tight">{sub.nama}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Location Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Wilayah Operasional</label>
                <select 
                  value={adCity}
                  onChange={(e) => { setAdCity(e.target.value); setAdDistrict(''); setAdProvince('Jawa Barat'); }}
                  className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none appearance-none"
                >
                  <option value="">Pilih Kota/Kab</option>
                  <option value="Kota Bandung">Kota Bandung</option>
                  <option value="Kota Cimahi">Kota Cimahi</option>
                  <option value="Kab. Bandung">Kab. Bandung</option>
                  <option value="Kab. Bandung Barat (KBB)">Kab. Bandung Barat (KBB)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Kecamatan</label>
                <select 
                  value={adDistrict}
                  onChange={(e) => setAdDistrict(e.target.value)}
                  disabled={!adCity}
                  className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none appearance-none disabled:opacity-50"
                >
                  <option value="">Pilih Kecamatan</option>
                  {adCity && DISTRICTS[adCity]?.map((d: string) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Jangkauan Wilayah (Opsional)</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Kota Bandung', 'Kota Cimahi', 'Kab. Bandung', 'Kab. Bandung Barat (KBB)'].map(area => (
                    <button
                      key={area}
                      onClick={() => {
                        if (adCoverageAreas.includes(area)) {
                          setAdCoverageAreas(adCoverageAreas.filter((a: string) => a !== area));
                        } else {
                          setAdCoverageAreas([...adCoverageAreas, area]);
                        }
                      }}
                      className={`p-3 rounded-xl border-2 text-[10px] font-bold transition-all text-left ${adCoverageAreas.includes(area) ? 'border-primary bg-primary/5 text-primary' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Tarif / Harga Mulai</label>
                <input 
                  type="text" 
                  value={adPrice}
                  onChange={(e) => setAdPrice(e.target.value)}
                  placeholder="Rp 150.000" 
                  className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Kebijakan Layanan</label>
                <div className="grid grid-cols-1 gap-2">
                  {['Bisa bawa Alat & Material', 'Hanya Sedia Jasa'].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => setAdServicePolicy(opt)}
                      className={`p-3 rounded-xl border-2 text-[10px] font-bold transition-all text-left ${adServicePolicy === opt ? 'border-primary bg-primary/5 text-primary' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
                    >
                      {opt === 'Hanya Sedia Jasa' ? 'Hanya Sedia Jasa (Mitra bawa alat, material/bahan dari pelanggan)' : opt}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Foto Jasa</label>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-2 cursor-pointer overflow-hidden relative group"
                >
                  {adImage ? (
                    <>
                      <img src={adImage || undefined} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Camera size={24} className="text-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <Camera size={24} />
                      <span className="text-[10px] font-bold">Upload Foto</span>
                    </>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Deskripsi Keahlian</label>
                <textarea 
                  value={adDesc}
                  onChange={(e) => setAdDesc(e.target.value)}
                  placeholder="Jelaskan keahlian dan pengalaman Anda..." 
                  className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none min-h-[120px]" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Keahlian Spesifik (Maks 5)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newSkill.trim() && adSkills.length < 5) {
                          setAdSkills([...adSkills, newSkill.trim()]);
                          setNewSkill('');
                        }
                      }
                    }}
                    placeholder="Contoh: Pasang Keramik" 
                    className="flex-1 bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none" 
                  />
                  <button 
                    onClick={() => {
                      if (newSkill.trim() && adSkills.length < 5) {
                        setAdSkills([...adSkills, newSkill.trim()]);
                        setNewSkill('');
                      }
                    }}
                    disabled={adSkills.length >= 5 || !newSkill.trim()}
                    className="bg-primary text-white px-6 rounded-2xl font-bold text-sm disabled:opacity-50"
                  >
                    Tambah
                  </button>
                </div>
                {adSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {adSkills.map((skill: string, index: number) => (
                      <div key={index} className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                        {skill}
                        <button onClick={() => setAdSkills(adSkills.filter((_: any, i: number) => i !== index))} className="hover:text-red-500">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="pt-4 space-y-3">
                <button 
                  disabled={isSubmittingAd}
                  onClick={submitAd} 
                  className="w-full bg-primary text-white py-5 rounded-[30px] font-bold text-sm shadow-sm disabled:opacity-50"
                >
                  {isSubmittingAd ? 'Memproses...' : (editingAdId ? 'Simpan Perubahan' : 'Kirim Pendaftaran Iklan')}
                </button>
                <button onClick={() => {
                  setShowAdModal(false); 
                  setEditingAdId(null);
                  setAdTitle('');
                  setAdCategory('');
                  setAdSubCategory('');
                  setAdPrice('');
                  setAdServicePolicy('Bisa bawa Alat & Material');
                  setAdDesc('');
                  setAdImage(null);
                  setAdProvince('');
                  setAdCity('');
                  setAdDistrict('');
                }} className="w-full py-4 text-slate-400 font-bold text-sm">Batal</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Deal Modal */}
      {showDealModal && activeDeal && (
        <motion.div key="deal-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[4000] flex items-center justify-center bg-slate-900/80 p-6">
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white w-full max-w-sm rounded-[48px] p-8 shadow-sm overflow-hidden relative border border-slate-100">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-50 to-transparent -z-10" />
            
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center mx-auto mb-4 text-primary shadow-sm border border-slate-50 relative">
                <div className="absolute -top-2 -right-2 bg-primary text-white p-1.5 rounded-full shadow-sm">
                  <ShieldCheck size={16} />
                </div>
                <Wallet size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tighter italic">Bayar <span className="text-primary">DP 10%</span></h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Sistem Jaminan Transaksi Aman</p>
            </div>

            <div className="bg-slate-50/80 p-6 rounded-[32px] border border-slate-100 mb-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Kesepakatan</span>
                <span className="text-lg font-black text-slate-800">Rp {activeDeal.total.toLocaleString()}</span>
              </div>
              
              <div className="h-px bg-slate-200/50 w-full" />
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">DP Jaminan (10%)</span>
                    <span className="text-[8px] text-primary/60 font-medium">Dibayar ke Aplikasi</span>
                  </div>
                  <span className="text-sm font-black text-primary">Rp {activeDeal.jaminan.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sisa Bayar (90%)</span>
                    <span className="text-[8px] text-slate-400 font-medium">Bayar Tunai di Lokasi</span>
                  </div>
                  <span className="text-sm font-black text-slate-400">Rp {(activeDeal.total - activeDeal.jaminan).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-[32px] mb-8 text-white shadow-sm shadow-slate-200 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
              <div className="relative z-10">
                <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">Metode Transfer Bank</p>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xl font-black tracking-wider">5150 5566 45</p>
                  <div className="bg-white/10 px-2 py-1 rounded-lg text-[10px] font-black">BCA</div>
                </div>
                <p className="text-[10px] font-bold text-white/60">a.n. Admin Jasamitra</p>
              </div>
            </div>

            <div className="space-y-3">
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={confirmDeal} 
                className="w-full bg-primary text-white py-5 rounded-[24px] font-black text-xs tracking-[0.15em] shadow-sm flex items-center justify-center gap-3"
              >
                <CheckCircle2 size={18} /> BAYAR DP 10%
              </motion.button>
              <button onClick={() => setShowDealModal(false)} className="w-full py-3 text-slate-400 font-bold text-[10px] uppercase tracking-widest">Batalkan Transaksi</button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Booking Modal */}
      {bookingService && (
        <motion.div 
          key="booking-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[3000] flex items-end justify-center bg-slate-900/60 p-4"
        >
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="bg-white w-full max-w-lg rounded-[40px] p-8 shadow-sm relative overflow-y-auto max-h-[90vh]"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-100 rounded-full mt-3" />
            <button 
              onClick={() => setBookingService(null)}
              className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full text-slate-400"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-slate-800 mb-2">{bookingService.title}</h3>
            <p className="text-xs text-slate-400 font-medium mb-8">Lengkapi data pengerjaan di bawah ini</p>

            <div className="space-y-6 mb-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-2">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    placeholder="Nama Anda" 
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-2">Alamat Pengerjaan</label>
                  <textarea 
                    value={bookingAddress}
                    onChange={(e) => setBookingAddress(e.target.value)}
                    placeholder="Alamat lengkap..." 
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20 resize-none h-24" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-2">Deskripsi Kerusakan</label>
                  <textarea 
                    value={bookingDesc}
                    onChange={(e) => setBookingDesc(e.target.value)}
                    placeholder="Ceritakan kendala Anda..." 
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20 resize-none h-24" 
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Kebijakan Layanan Mitra</p>
                <p className="text-sm font-bold text-slate-700">{bookingService.servicePolicy || 'Bisa bawa Alat & Material'}</p>
              </div>

              <div className="bg-slate-900 p-6 rounded-[32px] text-white">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Estimasi Total</span>
                  <span className="text-xl font-black">
                    Rp {(() => {
                      const basePrice = parseInt(bookingService.price.replace(/[^0-9]/g, '')) || 0;
                      return basePrice.toLocaleString();
                    })()}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">DP Jaminan (10%)</span>
                    <span className="text-[8px] text-white/40 font-medium">Wajib dibayar di awal</span>
                  </div>
                  <span className="text-lg font-black text-primary">
                    Rp {(() => {
                      const basePrice = parseInt(bookingService.price.replace(/[^0-9]/g, '')) || 0;
                      return Math.round(basePrice * 0.1).toLocaleString();
                    })()}
                  </span>
                </div>
              </div>
            </div>

            <button 
              disabled={isSubmittingBooking}
              onClick={submitBooking}
              className="w-full bg-primary text-white py-5 rounded-[24px] font-bold text-sm shadow-sm disabled:opacity-50"
            >
              {isSubmittingBooking ? 'Mengirim...' : 'PESAN SEKARANG'}
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <motion.div key="review-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
          <div 
            onClick={() => setShowReviewModal(false)}
            className="absolute inset-0 bg-primary/60 "
          />
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            className="relative w-full max-w-md bg-white rounded-t-[40px] sm:rounded-[40px] p-8 shadow-sm"
          >
            <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6 sm:hidden" />
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center text-accent mx-auto mb-4 shadow-sm">
                <Star size={40} fill="currentColor" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Beri Ulasan</h3>
              <p className="text-sm text-slate-400 mt-2">Bagaimana pengalaman Anda dengan {reviewTransaction?.mitraName || 'Mitra'}?</p>
            </div>

            <div className="flex justify-center gap-2 mb-8">
              {[1,2,3,4,5].map(star => (
                <motion.button 
                  key={star}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => setReviewRating(star)}
                  className="text-accent"
                >
                  <Star size={32} fill={star <= reviewRating ? "currentColor" : "none"} />
                </motion.button>
              ))}
            </div>

            <textarea 
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tulis ulasan Anda di sini..."
              className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20 min-h-[120px] resize-none mb-6"
            />

            <div className="flex gap-3">
              <button 
                onClick={() => setShowReviewModal(false)}
                className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold text-sm active:scale-95 transition-transform"
              >
                Batal
              </button>
              <button 
                disabled={isSubmittingReview}
                onClick={submitReview}
                className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-sm active:scale-95 transition-transform disabled:opacity-50"
              >
                {isSubmittingReview ? 'Mengirim...' : 'Kirim'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Offer Modal */}
      {showOfferModal && (
        <motion.div key="offer-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[3000] flex items-end sm:items-center justify-center p-4">
          <div 
            onClick={() => setShowOfferModal(false)}
            className="absolute inset-0 bg-slate-900/60 "
          />
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            className="relative w-full max-w-md bg-white rounded-t-[40px] sm:rounded-[40px] p-8 shadow-sm"
          >
            <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6 sm:hidden" />
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Kirim Penawaran Jasa</h3>
              <button onClick={() => setShowOfferModal(false)} className="p-2 bg-slate-50 rounded-full text-slate-400">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-2">Total Harga Jasa (100%)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                  <input 
                    type="number" 
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    placeholder="Contoh: 1000000" 
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-10 text-sm font-black outline-none focus:ring-2 ring-primary/20" 
                  />
                </div>
              </div>

              {offerPrice && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">DP 10% (Wajib)</p>
                    <p className="text-sm font-black text-primary">Rp {(Number(offerPrice) * 0.1).toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sisa 90% (Cash)</p>
                    <p className="text-sm font-black text-slate-400">Rp {(Number(offerPrice) * 0.9).toLocaleString()}</p>
                  </div>
                </div>
              )}

              <div className="bg-primary/5 p-4 rounded-2xl flex items-start gap-3">
                <Info size={18} className="text-primary shrink-0" />
                <p className="text-[10px] text-primary font-medium leading-relaxed">
                  Sistem akan otomatis menghitung DP 10% yang wajib dibayar pelanggan melalui platform JasaMitra. Sisa 90% akan dibayar cash langsung kepada Anda setelah pekerjaan selesai.
                </p>
              </div>

              <button 
                onClick={handleSendOffer}
                disabled={isSendingOffer || !offerPrice}
                className={`w-full py-5 rounded-[24px] font-black text-xs tracking-[0.15em] shadow-sm flex items-center justify-center gap-3 transition-all ${isSendingOffer || !offerPrice ? 'bg-slate-100 text-slate-300' : 'bg-primary text-white active:scale-95'}`}
              >
                {isSendingOffer ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    Kirim Penawaran
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <motion.div key="payment-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[3000] flex items-end sm:items-center justify-center p-4">
          <div 
            onClick={() => setShowPaymentModal(false)}
            className="absolute inset-0 bg-slate-900/60 "
          />
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            className="relative w-full max-w-md bg-white rounded-t-[40px] sm:rounded-[40px] p-8 shadow-sm max-h-[90vh] overflow-y-auto"
          >
            <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6 sm:hidden" />
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Upload Pembayaran DP</h3>
              <button onClick={() => setShowPaymentModal(false)} className="p-2 bg-slate-50 rounded-full text-slate-400">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-8">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-2">Upload Bukti Transfer</label>
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden" 
                    id="payment-proof"
                  />
                  <label 
                    htmlFor="payment-proof"
                    className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    {paymentProofPreview ? (
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-sm">
                        <img src={paymentProofPreview || undefined} className="w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <p className="text-white text-[10px] font-bold uppercase tracking-widest">Ganti Foto</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm">
                          <Camera size={24} />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Klik untuk upload foto</p>
                        <p className="text-[8px] text-slate-300 font-medium">Maksimal 5MB (JPG/PNG)</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Checkbox Persetujuan */}
              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 mt-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input 
                      type="checkbox" 
                      id="payment-agreement"
                      className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded bg-white checked:bg-blue-600 checked:border-blue-600 transition-colors cursor-pointer"
                    />
                    <CheckCircle2 size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed flex-1">
                    Saya setuju dan mengikat janji untuk membayar sisa tagihan sebesar <strong className="text-slate-800">90% secara tunai</strong> langsung kepada Mitra setelah pekerjaan selesai sesuai kesepakatan.
                  </p>
                </label>
              </div>
            </div>

            <button 
              onClick={() => {
                const checkbox = document.getElementById('payment-agreement') as HTMLInputElement;
                if (!checkbox?.checked) {
                  alert('Silakan centang kotak persetujuan terlebih dahulu untuk melanjutkan pembayaran.');
                  return;
                }
                submitPayment();
              }}
              disabled={isUploadingPayment || !paymentProofPreview || paymentAmount <= 0}
              className={`w-full py-5 rounded-[24px] font-black text-xs tracking-[0.15em] shadow-sm flex items-center justify-center gap-3 transition-all ${isUploadingPayment || !paymentProofPreview || paymentAmount <= 0 ? 'bg-slate-100 text-slate-300' : 'bg-emerald-600 text-white active:scale-95'}`}
            >
              {isUploadingPayment ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 size={18} /> KONFIRMASI PEMBAYARAN
                </>
              )}
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <motion.div key="reject-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[4000] flex items-end sm:items-center justify-center p-4">
          <div 
            onClick={() => setShowRejectModal(false)}
            className="absolute inset-0 bg-slate-900/60 "
          />
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            className="relative w-full max-w-md bg-white rounded-t-[40px] sm:rounded-[40px] p-8 shadow-sm"
          >
            <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6 sm:hidden" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Tolak Pembayaran</h3>
            <p className="text-xs text-slate-400 font-medium mb-6">Berikan alasan penolakan agar pelanggan dapat memperbaiki data.</p>

            <textarea 
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
              placeholder="Contoh: Bukti transfer tidak terbaca atau nominal tidak sesuai."
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-rose-500/20 resize-none h-32 mb-6"
            />

            <div className="flex gap-3">
              <button 
                onClick={() => setShowRejectModal(false)}
                className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold text-sm active:scale-95 transition-transform"
              >
                Batal
              </button>
              <button 
                onClick={rejectPayment}
                disabled={!rejectionNote.trim()}
                className={`flex-1 py-4 rounded-2xl font-bold text-sm shadow-sm active:scale-95 transition-transform ${rejectionNote.trim() ? 'bg-rose-600 text-white ' : 'bg-slate-100 text-slate-300'}`}
              >
                Tolak Sekarang
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {selectedPaymentForView && !showRejectModal && (
        <motion.div key="view-payment-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
          <div 
            onClick={() => setSelectedPaymentForView(null)}
            className="absolute inset-0 bg-slate-900/95 "
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-3xl aspect-auto max-h-[80vh] rounded-3xl overflow-hidden shadow-sm"
          >
            <button 
              onClick={() => setSelectedPaymentForView(null)}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white z-10 transition-colors"
            >
              <X size={24} />
            </button>
            <img src={selectedPaymentForView.proofUrl || undefined} className="w-full h-full object-contain" alt="Bukti Transfer Zoom" />
          </motion.div>
        </motion.div>
      )}

      {/* Login Mitra Modal */}
      {showLoginMitraModal && (
        <motion.div key="login-mitra-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[4000] flex items-end sm:items-center justify-center p-4">
          <div 
            onClick={() => setShowLoginMitraModal(false)}
            className="absolute inset-0 bg-slate-900/60 "
          />
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            className="relative w-full max-w-md bg-white rounded-t-[40px] sm:rounded-[40px] p-8 shadow-sm text-center"
          >
            <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6 sm:hidden" />
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6 shadow-sm">
              <AlertTriangle size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Akses Terbatas</h3>
            <p className="text-sm text-slate-500 mb-8">Anda harus login sebagai Mitra untuk mengakses halaman ini.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLoginMitraModal(false)}
                className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold text-sm active:scale-95 transition-transform"
              >
                Tutup
              </button>
              <button 
                onClick={() => {
                  setShowLoginMitraModal(false);
                  navigateTo('login');
                }}
                className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-sm active:scale-95 transition-transform"
              >
                Login Mitra
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
