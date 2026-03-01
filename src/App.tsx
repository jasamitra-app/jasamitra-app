            </main>
          </motion.div>
        )}
        {activePage === 'profil-mitra' && selectedMitra && (
          <motion.div key="profil-mitra" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <PageHeader title="Profil Mitra" subtitle="Informasi lengkap penyedia jasa" onBack={handleBack} />
            <main className="px-6 -mt-4 pb-12 space-y-6">
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 text-center neo-3d">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <img src={selectedMitra.foto} className="w-full h-full rounded-full border-4 border-primary shadow-lg object-cover" />
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">{selectedMitra.name}</h3>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="bg-blue-50 text-primary text-[9px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={10} /> Terverifikasi
                  </span>
                  <span className="bg-amber-50 text-amber-600 text-[9px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star size={10} fill="currentColor" /> {selectedMitra.rating}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium mt-3 flex items-center justify-center gap-1">
                  <MapPin size={12} className="text-primary" /> {selectedMitra.lokasi}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 text-center">
                  <span className="text-lg font-bold text-primary block">{selectedMitra.pengalaman}</span>
                  <span className="text-[8px] text-slate-400 font-bold uppercase">Tahun</span>
                </div>
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 text-center">
                  <span className="text-lg font-bold text-primary block">{selectedMitra.proyek}</span>
                  <span className="text-[8px] text-slate-400 font-bold uppercase">Proyek</span>
                </div>
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 text-center">
                  <span className="text-lg font-bold text-primary block">{selectedMitra.kepuasan}</span>
                  <span className="text-[8px] text-slate-400 font-bold uppercase">Kepuasan</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[40px] shadow-sm border border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-primary flex items-center gap-2"><User size={18} /> Tentang Saya</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{selectedMitra.tentang}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedMitra.layanan.map((l: string) => (
                    <span key={l} className="bg-blue-50 text-primary text-[9px] font-bold px-3 py-1.5 rounded-full">{l}</span>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-[40px] shadow-sm border border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-primary flex items-center gap-2"><MapPin size={18} /> Alamat & Area Layanan</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{selectedMitra.alamatLengkap}</p>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Area Layanan:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Jakarta Selatan', 'Jakarta Pusat', 'Jakarta Barat', 'Depok'].map(a => (
                      <span key={a} className="bg-white text-slate-600 text-[9px] font-bold px-3 py-1 rounded-lg shadow-sm">{a}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    setChatMitra({ id: selectedMitra.id.toString(), name: selectedMitra.name });
                    navigateTo('chat');
                  }}
                  className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/30 flex items-center justify-center gap-2"
                >
                  <Send size={18} /> Chat Mitra
                </button>
                <button onClick={handleBack} className="flex-1 bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl font-bold text-sm">Kembali</button>
              </div>
            </main>
          </motion.div>
        )}
        {activePage === 'daftar-mitra' && (
          <motion.div key="daftar-mitra" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <PageHeader title="Pendaftaran Mitra" subtitle="Lengkapi data diri & dokumen keamanan" onBack={handleBack} />
            <main className="px-6 -mt-4 pb-12">
              <div className="bg-white p-6 rounded-[40px] shadow-sm border border-slate-100 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Nama Lengkap <span className="text-rose-500">*</span></label>
                    <input type="text" placeholder="Sesuai KTP" className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">No Handphone <span className="text-rose-500">*</span></label>
                    <input type="tel" placeholder="Contoh: 081234567890" className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20" />
                  </div>

                  <div className="flex items-center gap-4 py-2">
                    <div className="flex-1 h-px bg-slate-100" />
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Atau</span>
                    <div className="flex-1 h-px bg-slate-100" />
                  </div>

                  <button className="w-full bg-white border border-slate-200 text-slate-700 py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-3 shadow-sm active:scale-95 transition-transform">
                    <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" className="w-4 h-4" /> Daftar dengan Google
                  </button>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Kata Sandi <span className="text-rose-500">*</span></label>
                    <input type="password" placeholder="Minimal 8 karakter" className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Tipe Pendaftar</label>
                    <select className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none appearance-none">
                      <option>Perorangan (Individu)</option>
                      <option>CV (Persekutuan Komanditer)</option>
                      <option>PT (Perseroan Terbatas)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">NIK</label>
                    <input type="number" placeholder="16 Digit NIK" className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none" />
                  </div>

                  <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100 space-y-4">
                    <h4 className="text-[10px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-2"><ShieldCheck size={16} /> Dokumen Keamanan Wajib</h4>
                    <p className="text-[10px] text-rose-600 font-medium">Untuk melindungi pelanggan, berkas ini wajib dilampirkan.</p>
                    
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-xl border border-rose-200">
                        <label className="text-[9px] font-bold text-rose-900 block mb-2">1. Foto KTP Asli</label>
                        <input type="file" className="text-[10px]" />
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-rose-200">
                        <label className="text-[9px] font-bold text-rose-900 block mb-2">2. Selfie Memegang KTP</label>
                        <input type="file" className="text-[10px]" />
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-rose-200">
                        <label className="text-[9px] font-bold text-rose-900 block mb-2">3. SKCK Aktif</label>
                        <input type="file" className="text-[10px]" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2"><ImageIcon size={16} /> Informasi Rekening Bank</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Nama di rekening wajib sama dengan KTP.</p>
                    <div className="space-y-3">
                      <input type="text" placeholder="Nama Bank" className="w-full bg-white rounded-xl p-3 text-xs font-medium outline-none border border-slate-200" />
                      <input type="number" placeholder="Nomor Rekening" className="w-full bg-white rounded-xl p-3 text-xs font-medium outline-none border border-slate-200" />
                      <input type="text" placeholder="Nama Pemilik" className="w-full bg-white rounded-xl p-3 text-xs font-medium outline-none border border-slate-200" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Alamat Rumah</label>
                    <textarea placeholder="Tulis alamat lengkap..." className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none min-height-[100px]" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Pengalaman Kerja</h4>
                      <button onClick={addExperience} className="text-primary text-[10px] font-bold flex items-center gap-1"><Plus size={14} /> Tambah</button>
                    </div>
                    {experiences.map((exp) => (
                      <div key={exp.id} className="bg-slate-50 p-5 rounded-3xl border border-slate-100 space-y-3 relative">
                        {experiences.length > 1 && (
                          <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-rose-500"><Trash2 size={16} /></button>
                        )}
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Pengalaman {exp.id}</p>
                        <input type="text" placeholder="Nama Perusahaan" className="w-full bg-white rounded-xl p-3 text-xs font-medium outline-none border border-slate-200" />
                        <input type="text" placeholder="Posisi / Jabatan" className="w-full bg-white rounded-xl p-3 text-xs font-medium outline-none border border-slate-200" />
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" placeholder="Tahun Mulai" className="w-full bg-white rounded-xl p-3 text-xs font-medium outline-none border border-slate-200" />
                          <input type="text" placeholder="Tahun Selesai" className="w-full bg-white rounded-xl p-3 text-xs font-medium outline-none border border-slate-200" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 space-y-4">
                    <h4 className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-2"><AlertTriangle size={16} /> Peraturan & Kode Etik</h4>
                    <ul className="text-[10px] text-amber-700 font-medium space-y-3 list-disc ml-4">
                      <li>
                        <span className="font-bold">Biaya layanan & sistem pembayaran:</span> Setiap transaksi di JasaMitra dikenakan biaya layanan sebesar <span className="font-bold">10%</span> dari total nilai jasa yang dibayarkan oleh pelanggan sebagai biaya operasional platform. Sisa pembayaran wajib dilakukan secara <span className="font-bold">cash di lokasi</span> langsung kepada Mitra setelah pekerjaan selesai.
                      </li>
                      <li>
                        <span className="font-bold">Larangan manipulasi kerusakan:</span> Mitra dilarang keras merekayasa, melebih-lebihkan, atau memperbesar kerusakan barang maupun kebutuhan perbaikan demi keuntungan pribadi.
                      </li>
                      <li>
                        <span className="font-bold">Larangan transaksi di luar platform:</span> Seluruh bentuk transaksi, negosiasi biaya, penjadwalan, dan pembayaran wajib dilakukan melalui sistem JasaMitra demi keamanan, transparansi, serta perlindungan Mitra dan pelanggan.
                      </li>
                      <li>
                        <span className="font-bold">Kewajiban menjaga etika dan keamanan:</span> Mitra wajib bersikap profesional, sopan, menjaga keamanan, serta memberikan pelayanan terbaik kepada pelanggan selama proses pengerjaan di lokasi.
                      </li>
                    </ul>
                    <label className="flex items-start gap-3 text-[11px] text-amber-900 font-medium cursor-pointer bg-amber-100/50 p-4 rounded-xl border-l-[3px] border-amber-700 mt-4">
                      <input type="checkbox" className="mt-0.5 w-4 h-4 accent-amber-700" />
                      <span>
                        Dengan mencentang kotak ini, saya menyatakan telah membaca, memahami, dan menyetujui seluruh Kode Etik Mitra serta bersedia mematuhi semua ketentuan yang berlaku di platform JasaMitra, termasuk sistem biaya layanan dan tata cara pembayaran.
                      </span>
                    </label>
                  </div>

                  <button onClick={() => {
                    alert('Pendaftaran dikirim! Silakan login untuk melanjutkan.'); 
                    setIsMitra(true);
                    navigateTo('login');
                  }} className="w-full bg-primary text-white py-5 rounded-[30px] font-bold text-sm shadow-xl shadow-primary/30 mt-6">Kirim Pendaftaran</button>
                </div>
              </div>
            </main>
          </motion.div>
        )}

        {/* --- LOGIN --- */}
        {activePage === 'login' && (
          <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <PageHeader title="Selamat Datang!" subtitle="Masuk untuk menikmati semua fitur JasaMitra" onBack={handleBack} />
            <main className="px-6 -mt-4">
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 space-y-6">
                <div className="space-y-4">
                  <input type="email" placeholder="Email / Nomor HP" className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20" />
                  <input type="password" placeholder="Kata Sandi" className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20" />
                </div>
                <button onClick={() => {alert('Fitur login dalam pengembangan'); navigateTo('beranda');}} className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/30 active:scale-95 transition-transform">Masuk</button>
                <div className="flex items-center gap-4 py-2">
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Atau</span>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>
                <button className="w-full bg-white border border-slate-200 text-slate-700 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 shadow-sm active:scale-95 transition-transform">
                  <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" className="w-5 h-5" /> Lanjutkan dengan Google
                </button>
              </div>
            </main>
          </motion.div>
        )}

        {/* --- KEBIJAKAN --- */}
        {activePage === 'kebijakan' && (
          <motion.div key="kebijakan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PageHeader title="Kebijakan Privasi" subtitle="Syarat & Ketentuan Penggunaan" onBack={handleBack} />
            <main className="px-6 -mt-4">
              <div className="bg-white p-6 rounded-[30px] shadow-sm border border-slate-100 h-[60vh] overflow-y-auto hide-scrollbar">
                <h3 className="text-sm font-bold text-primary mb-3">1. SYARAT & KETENTUAN PENGGUNAAN</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">Selamat datang di platform JasaMitra, sebuah layanan teknologi yang mempertemukan Pengguna (Pemberi Kerja) dengan Mitra (Penyedia Jasa) untuk berbagai layanan perbaikan, servis, dan instalasi. Dengan mengakses dan menggunakan aplikasi JasaMitra, Anda dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang berlaku.</p>
                
                <p className="text-xs text-slate-600 leading-relaxed mb-3">JasaMitra bertindak sebagai fasilitator yang mempertemukan kedua belah pihak dan bukan merupakan penyedia jasa langsung. Seluruh perjanjian kerja, kesepakatan harga, dan pelaksanaan pekerjaan merupakan tanggung jawab masing-masing pihak. JasaMitra hanya menyediakan platform dan sistem jaminan keamanan untuk melindungi kedua belah pihak dari risiko penipuan dan wanprestasi.</p>
                
                <p className="text-xs text-slate-600 leading-relaxed mb-6">Pengguna dilarang keras melakukan transaksi di luar mekanisme yang telah ditentukan oleh platform, termasuk namun tidak terbatas pada transfer langsung ke rekening pribadi Mitra tanpa melalui sistem jaminan. Pelanggaran terhadap ketentuan ini dapat mengakibatkan pemblokiran akun secara permanen tanpa pemberitahuan terlebih dahulu.</p>
                
                <h3 className="text-sm font-bold text-primary mb-3 mt-5">2. KEBIJAKAN PRIVASI DAN PERLINDUNGAN DATA</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">PT JasaMitra Indonesia berkomitmen untuk melindungi data pribadi Anda sesuai dengan Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP). Data yang kami kumpulkan meliputi nama lengkap, alamat email, nomor telepon, alamat domisili, foto KTP, swafoto, Surat Keterangan Catatan Kepolisian (SKCK), dan informasi rekening bank yang digunakan semata-mata untuk keperluan verifikasi identitas, keamanan transaksi, dan pencegahan tindak penipuan.</p>
                
                <p className="text-xs text-slate-600 leading-relaxed mb-3">Kami tidak akan pernah menjual, menyewakan, atau menukar data pribadi Anda kepada pihak ketiga untuk tujuan komersial tanpa persetujuan eksplisit dari Anda. Data Anda hanya akan diungkapkan apabila diwajibkan oleh hukum, peraturan, atau permintaan resmi dari instansi penegak hukum Republik Indonesia.</p>
                
                <p className="text-xs text-slate-600 leading-relaxed mb-6">Seluruh data disimpan dalam server yang aman dengan sistem enkripsi berlapis. Anda berhak untuk mengakses, memperbarui, mengoreksi, atau meminta penghapusan data pribadi Anda dengan menghubungi layanan pelanggan kami. Permintaan penghapusan data akan diproses dalam waktu maksimal 3x24 jam, kecuali untuk data transaksi yang wajib disimpan sesuai ketentuan perpajakan yang berlaku.</p>
                
                <h3 className="text-sm font-bold text-primary mb-3 mt-5">3. KEBJIAKAN KEAMANAN DAN VERIFIKASI MITRA</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">Keamanan Pengguna adalah prioritas utama JasaMitra. Setiap Mitra yang terdaftar dalam platform kami wajib melewati proses verifikasi identitas berlapis yang mencakup pemeriksaan keaslian Kartu Tanda Penduduk (KTP), validasi wajah melalui swafoto, verifikasi kepemilikan rekening bank (nama pemilik harus sesuai dengan KTP), dan pemeriksaan Surat Keterangan Catatan Kepolisian (SKCK) yang masih berlaku untuk memastikan latar belakang yang bersih.</p>
                
                <p className="text-xs text-slate-600 leading-relaxed mb-3">JasaMitra menerapkan kebijakan toleransi nol (zero tolerance policy) terhadap segala bentuk tindak kekerasan, pelecehan seksual, pencurian, intimidasi, atau penipuan yang dilakukan oleh Mitra maupun Pengguna. Setiap pelanggaran akan ditindak tegas dengan pemblokiran akun permanen dan pelaporan kepada pihak kepolisian untuk diproses lebih lanjut sesuai hukum yang berlaku.</p>
                
                <p className="text-xs text-slate-600 leading-relaxed mb-3">Kami juga menyediakan sistem escrow sederhana berupa jaminan 10% (sepuluh persen) dari nilai kesepakatan yang bertujuan untuk melindungi kedua belah pihak. Jaminan ini akan ditahan oleh sistem selama proses pekerjaan berlangsung dan akan dikembalikan atau dicairkan sesuai dengan kesepakatan penyelesaian pekerjaan. Sistem ini dirancang untuk meminimalisir risiko kerugian akibat pembatalan sepihak atau ketidaksesuaian hasil pekerjaan.</p>
                
                <p className="text-xs text-slate-600 leading-relaxed">Dengan menggunakan layanan JasaMitra, Anda menyatakan setuju untuk tunduk pada seluruh kebijakan, syarat, dan ketentuan yang telah diuraikan di atas. JasaMitra berhak untuk melakukan perubahan terhadap kebijakan ini sewaktu-waktu dengan atau tanpa pemberitahuan terlebih dahulu. Penggunaan berkelanjutan atas platform kami setelah perubahan kebijakan dianggap sebagai penerimaan Anda terhadap perubahan tersebut.</p>
              </div>
              <button onClick={handleBack} className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/30 mt-6 uppercase tracking-widest">Saya Mengerti & Kembali</button>
            </main>
          </motion.div>
        )}

        {/* --- SYARAT & KETENTUAN --- */}
        {activePage === 'syarat-ketentuan' && (
          <motion.div key="syarat-ketentuan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PageHeader title="Syarat & Ketentuan" subtitle="JasaMitra - Tukang Jagoan" onBack={handleBack} />
            <main className="px-6 -mt-4 pb-12">
              <div className="bg-slate-50 rounded-[30px] p-4 overflow-y-auto max-h-[75vh] hide-scrollbar">
                <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-2xl shadow-sm">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">JASA<span className="text-primary">MITRA</span></h3>
                    <p className="text-[11px] text-slate-400 font-medium">Solusi jasa terpercaya dengan jaminan 10%</p>
                  </div>
                </div>

                {/* Navigasi Cepat */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 hide-scrollbar sticky top-0 z-10 bg-slate-50/80 backdrop-blur-sm -mx-2 px-2">
                  {[
                    { id: 'umum', label: 'Ketentuan Umum' },
                    { id: 'jaminan', label: 'Jaminan 10%', active: true },
                    { id: 'mitra', label: 'Mitra' },
                    { id: 'pelanggan', label: 'Pelanggan' },
                  ].map((nav) => (
                    <button 
                      key={nav.id}
                      onClick={() => document.getElementById(nav.id)?.scrollIntoView({ behavior: 'smooth' })}
                      className={`px-4 py-2 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${nav.active ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-white text-slate-600 border border-slate-100'}`}
                    >
                      {nav.label}
                    </button>
                  ))}
                </div>

                {/* Konten Syarat & Ketentuan */}
                <div className="bg-white rounded-[30px] p-6 shadow-sm border border-slate-100 space-y-8">
                  {/* Bagian 1: Ketentuan Umum */}
                  <div id="umum" className="scroll-mt-20">
                    <h3 className="text-base font-bold text-primary mb-4 flex items-center gap-3">
                      <div className="w-1.5 h-5 bg-primary rounded-full" />
                      KETENTUAN UMUM
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 mb-2">1. PENGGUNAAN APLIKASI JASAMITRA</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          JasaMitra adalah platform teknologi yang mempertemukan Pengguna (Pelanggan) dengan Mitra (Penyedia Jasa) untuk berbagai layanan perbaikan, servis, dan instalasi. Kami bukan penyedia jasa langsung, melainkan fasilitator yang memastikan transaksi berjalan aman dan terpercaya.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 mb-2">2. PENDAFTARAN DAN AKUN</h4>
                        <p className="text-xs text-slate-500 leading-relaxed mb-3">
                          Setiap Pengguna wajib mendaftar dan memiliki akun untuk mengakses layanan JasaMitra. Data yang diberikan harus benar dan dapat dipertanggungjawabkan. Pengguna bertanggung jawab penuh atas keamanan akun dan aktivitas yang dilakukan.
                        </p>
                        <ul className="text-xs text-slate-500 leading-relaxed space-y-2 list-disc ml-4 font-medium">
                          <li>Pengguna dilarang memberikan akses akun kepada pihak lain.</li>
                          <li>JasaMitra berhak menonaktifkan akun jika ditemukan pelanggaran.</li>
                          <li>Data pribadi akan dilindungi sesuai Kebijakan Privasi.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent" />

                  {/* Bagian 2: JAMINAN KEAMANAN TRANSAKSI 10% */}
                  <div id="jaminan" className="scroll-mt-20 bg-blue-50/50 rounded-3xl p-6 border-l-4 border-primary">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <ShieldCheck size={20} />
                      </div>
                      <h3 className="text-lg font-extrabold text-primary">JAMINAN KEAMANAN TRANSAKSI 10%</h3>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-5 space-y-6 shadow-sm border border-blue-100">
                      <div className="flex gap-4">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 mb-1">Jaminan keamanan transaksi adalah <span className="text-primary">BIAYA LAYANAN</span> sebesar 10% dari nilai kesepakatan.</p>
                          <p className="text-[11px] text-slate-400 font-medium">Contoh: Deal Rp 1.000.000 → Biaya jaminan Rp 100.000 ke aplikasi, sisanya Rp 900.000 ke mitra.</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 mb-1">Biaya layanan ini <span className="text-rose-500">BUKAN</span> merupakan simpanan atau titipan dana perbankan.</p>
                          <p className="text-[11px] text-slate-400 font-medium">Kami hanya memfasilitasi jaminan, bukan bank atau lembaga keuangan.</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 mb-2">Biaya layanan berfungsi sebagai:</p>
                          <ul className="text-xs text-slate-500 space-y-1.5 list-disc ml-4 font-medium">
                            <li>Jaminan komitmen Mitra untuk menyelesaikan pekerjaan</li>
                            <li>Kompensasi kepada Pengguna jika Mitra membatalkan sepihak</li>
                            <li>Dana perlindungan transaksi (dispute resolution)</li>
                          </ul>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">4</div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 leading-relaxed">PT JasaMitra Indonesia <span className="text-rose-500">BUKAN</span> merupakan penyelenggara sistem pembayaran sebagaimana dimaksud dalam peraturan Bank Indonesia/OJK.</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">5</div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 leading-relaxed">Sisa pembayaran (90%) dilakukan langsung antara Pengguna dan Mitra di luar sistem JasaMitra.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-2xl mt-6">
                      <p className="text-[11px] text-amber-800 font-bold flex items-center gap-2">
                        <Info size={14} /> Penting:
                      </p>
                      <p className="text-[11px] text-amber-700 font-medium mt-1">
                        Dengan menggunakan JasaMitra, Anda menyetujui mekanisme jaminan 10% ini sebagai bentuk perlindungan bersama.
                      </p>
                    </div>
                  </div>

                  {/* Bagian 3: Ketentuan Mitra */}
                  <div id="mitra" className="scroll-mt-20">
                    <h3 className="text-base font-bold text-primary mb-4 flex items-center gap-3">
                      <div className="w-1.5 h-5 bg-primary rounded-full" />
                      KETENTUAN MITRA
                    </h3>
                    <div className="bg-slate-50 rounded-2xl p-5">
                      <ul className="text-xs text-slate-600 space-y-3 list-disc ml-4 font-medium leading-relaxed">
                        <li>Mitra wajib menyelesaikan pekerjaan sesuai kesepakatan dengan Pengguna.</li>
                        <li>Mitra dilarang meminta pembayaran di luar mekanisme yang ditentukan.</li>
                        <li>Jika Mitra membatalkan sepihak, jaminan 10% akan dikembalikan kepada Pengguna.</li>
                        <li>Mitra wajib menjaga etika, kesopanan, dan keamanan saat di lokasi Pengguna.</li>
                        <li>Pelanggaran berat (penipuan, pelecehan, pencurian) akan diproses secara hukum.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Bagian 4: Ketentuan Pelanggan */}
                  <div id="pelanggan" className="scroll-mt-20">
                    <h3 className="text-base font-bold text-primary mb-4 flex items-center gap-3">
                      <div className="w-1.5 h-5 bg-primary rounded-full" />
                      KETENTUAN PELANGGAN
                    </h3>
                    <div className="bg-slate-50 rounded-2xl p-5">
                      <ul className="text-xs text-slate-600 space-y-3 list-disc ml-4 font-medium leading-relaxed">
                        <li>Pelanggan wajib membayar jaminan 10% sesuai kesepakatan sebelum pekerjaan dimulai.</li>
                        <li>Pelanggan wajib memberikan informasi yang jelas dan benar mengenai pekerjaan.</li>
                        <li>Jika Pelanggan membatalkan sepihak setelah Mitra datang, jaminan 10% menjadi hak Mitra.</li>
                        <li>Pelanggan wajib membayar sisa 90% langsung kepada Mitra setelah pekerjaan selesai.</li>
                        <li>Pelanggan dapat memberikan rating dan ulasan untuk membantu pengguna lain.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-8 border-t border-slate-100 text-center space-y-4">
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                      © 2026 PT JasaMitra Indonesia. Hak Cipta Dilindungi.<br />
                      Terakhir diperbarui: 24 Februari 2026
                    </p>
                    <div className="flex justify-center gap-4">
                      <button onClick={() => navigateTo('kebijakan')} className="text-[10px] font-bold text-primary">Kebijakan Privasi</button>
                      <div className="w-px h-3 bg-slate-200" />
                      <button onClick={() => navigateTo('syarat-ketentuan')} className="text-[10px] font-bold text-primary">Syarat & Ketentuan</button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <button 
                    onClick={() => navigateTo('akun')}
                    className="bg-white border border-slate-200 px-8 py-4 rounded-full text-xs font-bold text-slate-600 flex items-center gap-2 mx-auto active:scale-95 transition-transform shadow-sm"
                  >
                    <ArrowLeft size={16} /> Kembali ke Akun
                  </button>
                </div>
              </div>
            </main>
          </motion.div>
        )}

      </AnimatePresence>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {showAdModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[4000] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full rounded-t-[40px] p-8 shadow-2xl max-h-[90vh] overflow-y-auto hide-scrollbar"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">Buat Iklan Jasa</h3>
              <p className="text-xs text-slate-400 font-medium mb-8">Pasang iklan jasamu dan dapatkan lebih banyak pelanggan!</p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Judul Jasa</label>
                  <input type="text" placeholder="Contoh: Servis AC Bergaransi" className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Kategori</label>
                  <select className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none appearance-none">
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Tarif / Harga Mulai</label>
                  <input type="text" placeholder="Rp 150.000" className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none" />
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
                        <img src={adImage} className="w-full h-full object-cover" />
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
                  <textarea placeholder="Jelaskan keahlian dan pengalaman Anda..." className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium outline-none min-h-[120px]" />
                </div>
                
                <div className="pt-4 space-y-3">
                  <button onClick={() => {alert('Iklan dikirim!'); setShowAdModal(false); setAdImage(null);}} className="w-full bg-primary text-white py-5 rounded-[30px] font-bold text-sm shadow-xl shadow-primary/30">Kirim Pendaftaran Iklan</button>
                  <button onClick={() => {setShowAdModal(false); setAdImage(null);}} className="w-full py-4 text-slate-400 font-bold text-sm">Batal</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showDealModal && activeDeal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[4000] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl overflow-hidden relative">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary shadow-inner"><Handshake size={40} /></div>
                <h3 className="text-xl font-extrabold text-slate-800">Konfirmasi Deal</h3>
                <p className="text-xs text-slate-400 font-medium">Anda telah sepakat dengan mitra</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl space-y-3 mb-6">
                <div className="flex justify-between text-xs font-bold"><span className="text-slate-400">Jasa</span><span className="text-slate-700">{activeDeal.jasa}</span></div>
                <div className="flex justify-between text-xs font-bold"><span className="text-slate-400">Mitra</span><span className="text-slate-700">{activeDeal.mitra}</span></div>
                <div className="flex justify-between text-sm font-extrabold pt-3 border-t border-slate-200"><span className="text-slate-400">Total Deal</span><span className="text-primary">Rp {activeDeal.total.toLocaleString()}</span></div>
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 mt-4">
                  <div className="flex justify-between text-xs font-extrabold text-emerald-600"><span><ShieldCheck size={14} className="inline mr-1" /> Jaminan 10%</span><span>Rp {activeDeal.jaminan.toLocaleString()}</span></div>
                  <p className="text-[9px] text-emerald-500 font-bold mt-1 uppercase tracking-tighter">*Dibayarkan ke aplikasi sebagai jaminan</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-2xl mb-6 border-l-4 border-primary">
                <p className="text-[10px] font-bold text-blue-800 mb-2 uppercase tracking-widest">🏦 Rekening JasaMitra</p>
                <p className="text-sm font-extrabold text-slate-800">BCA 8123-4567-89</p>
                <p className="text-[10px] font-medium text-slate-500">a.n. PT JasaMitra Indonesia</p>
              </div>

              <div className="space-y-3">
                <button onClick={confirmDeal} className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/30 active:scale-95 transition-transform flex items-center justify-center gap-2">
                  <CheckCircle2 size={18} /> Saya Sudah Transfer
                </button>
                <button onClick={() => setShowDealModal(false)} className="w-full py-3 text-slate-400 font-bold text-sm">Batalkan</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {bookingService && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[3000] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="bg-white w-full max-w-lg rounded-[40px] p-8 shadow-2xl relative overflow-hidden"
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

              <div className="space-y-4 mb-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-2">Nama Lengkap</label>
                  <input type="text" placeholder="Nama Anda" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-2">Alamat Pengerjaan</label>
                  <textarea placeholder="Alamat lengkap..." className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20 resize-none h-24" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-2">Deskripsi Kerusakan</label>
                  <textarea placeholder="Ceritakan kendala Anda..." className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-primary/20 resize-none h-24" />
                </div>
              </div>

              <button 
                onClick={() => {
                  setBookingService(null);
                  navigateTo('chat');
                }}
                className="w-full bg-primary text-white py-5 rounded-[24px] font-bold text-sm shadow-xl shadow-primary/30 active:scale-95 transition-transform"
              >
                PESAN SEKARANG
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {showTrackingModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowTrackingModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="relative w-full max-w-md bg-white rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl overflow-hidden"
            >
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6 sm:hidden" />
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Lacak Teknisi</h3>
                <button onClick={() => setShowTrackingModal(false)} className="p-2 bg-slate-50 rounded-full text-slate-400">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="relative h-48 bg-slate-100 rounded-3xl overflow-hidden shadow-inner">
                  <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400" className="w-full h-full object-cover opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-12 h-12 bg-primary rounded-full animate-ping absolute inset-0 opacity-20" />
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-lg relative z-10">
                        <MapPin size={24} />
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-sm border border-white">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Lokasi Terkini</p>
                    <p className="text-xs font-bold text-slate-700 truncate">Jl. Sederhana No. 20, Bandung</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { time: '10:30', status: 'Teknisi menuju lokasi', desc: 'Budi Santoso sedang dalam perjalanan', active: true },
                    { time: '10:15', status: 'Pesanan Dikonfirmasi', desc: 'Mitra telah menerima permintaan Anda', active: false },
                    { time: '10:00', status: 'Mencari Teknisi', desc: 'Sistem sedang mencocokkan dengan mitra terdekat', active: false },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${step.active ? 'bg-primary ring-4 ring-primary/20' : 'bg-slate-200'}`} />
                        {i !== 2 && <div className="w-0.5 h-10 bg-slate-100" />}
                      </div>
                      <div className="-mt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400">{step.time}</span>
                          <h4 className={`text-xs font-bold ${step.active ? 'text-slate-800' : 'text-slate-400'}`}>{step.status}</h4>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setShowTrackingModal(false)}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm mt-8 active:scale-95 transition-transform"
              >
                Tutup
              </button>
            </motion.div>
          </div>
        )}

        {showReviewModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowReviewModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="relative w-full max-w-md bg-white rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6 sm:hidden" />
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center text-amber-500 mx-auto mb-4 shadow-inner">
                  <Star size={40} fill="currentColor" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Beri Ulasan</h3>
                <p className="text-sm text-slate-400 mt-2">Bagaimana pengalaman Anda dengan Hendra Wijaya?</p>
              </div>

              <div className="flex justify-center gap-2 mb-8">
                {[1,2,3,4,5].map(star => (
                  <motion.button 
                    key={star}
                    whileTap={{ scale: 0.8 }}
                    className="text-amber-400"
                  >
                    <Star size={32} fill={star <= 4 ? "currentColor" : "none"} />
                  </motion.button>
                ))}
              </div>

              <textarea 
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
                  onClick={() => {
                    alert('Terima kasih atas ulasan Anda!');
                    setShowReviewModal(false);
                  }}
                  className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-primary/30 active:scale-95 transition-transform"
                >
                  Kirim
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Nav (Only on main pages) */}
      {['beranda', 'pesan', 'layanan', 'akun'].includes(activePage) && (
        <BottomNav activePage={activePage} onNav={navigateTo} onAdd={() => setShowAdModal(true)} />
      )}
    </div>
  );
}

