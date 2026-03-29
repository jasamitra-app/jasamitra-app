import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, CheckCircle, XCircle, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { Page } from '../types';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, updateDoc, doc, orderBy } from 'firebase/firestore';

interface AdminPartnerProps {
  navigateTo: (page: Page) => void;
}

interface PartnerRequest {
  id: string;
  userId: string;
  userName: string;
  namaToko: string;
  alamat: string;
  linkTujuan: string;
  linkValue: string;
  bannerUrl: string;
  status: 'pending' | 'approved' | 'waiting_verification' | 'active' | 'rejected';
  paymentProofUrl?: string;
  createdAt: any;
}

export const AdminPartnerPage: React.FC<AdminPartnerProps> = ({ navigateTo }) => {
  const [requests, setRequests] = useState<PartnerRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'partnerRequests'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: PartnerRequest[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as PartnerRequest);
      });
      setRequests(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching partner requests:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (id: string, status: PartnerRequest['status']) => {
    if (!window.confirm(`Apakah Anda yakin ingin mengubah status menjadi ${status}?`)) return;
    
    try {
      await updateDoc(doc(db, 'partnerRequests', id), { status });
      alert(`Status berhasil diubah menjadi ${status}`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert('Terjadi kesalahan saat mengubah status.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">Menunggu Persetujuan</span>;
      case 'approved': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">Menunggu Pembayaran</span>;
      case 'waiting_verification': return <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold">Verifikasi Pembayaran</span>;
      case 'active': return <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">Aktif</span>;
      case 'rejected': return <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded text-xs font-bold">Ditolak</span>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20">
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-slate-100 sticky top-0 z-20">
        <button onClick={() => navigateTo('akun')} className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-slate-800">Kelola Partner JasaMitra</h1>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            Belum ada pengajuan partner.
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800">{req.namaToko}</h3>
                    <p className="text-xs text-slate-500">Oleh: {req.userName}</p>
                  </div>
                  {getStatusBadge(req.status)}
                </div>
                
                <div className="p-4 space-y-3 text-sm">
                  <div>
                    <span className="text-slate-500 block text-xs">Alamat</span>
                    <p className="text-slate-800">{req.alamat}</p>
                  </div>
                  
                  <div>
                    <span className="text-slate-500 block text-xs">Link Tujuan ({req.linkTujuan})</span>
                    <a 
                      href={req.linkTujuan === 'WhatsApp' ? `https://wa.me/${req.linkValue}` : req.linkValue} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 flex items-center gap-1 hover:underline"
                    >
                      {req.linkValue} <ExternalLink size={14} />
                    </a>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-xs mb-1">Banner</span>
                    <a href={req.bannerUrl} target="_blank" rel="noopener noreferrer" className="block">
                      <img src={req.bannerUrl} alt="Banner" className="w-full h-32 object-cover rounded-xl border border-slate-200" />
                    </a>
                  </div>

                  {req.paymentProofUrl && (
                    <div>
                      <span className="text-slate-500 block text-xs mb-1">Bukti Pembayaran</span>
                      <a href={req.paymentProofUrl} target="_blank" rel="noopener noreferrer" className="block">
                        <img src={req.paymentProofUrl} alt="Bukti Pembayaran" className="w-full h-32 object-cover rounded-xl border border-slate-200" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                  {req.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleUpdateStatus(req.id, 'approved')}
                        className="flex-1 bg-emerald-500 text-white py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-1"
                      >
                        <CheckCircle size={16} /> Approve
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(req.id, 'rejected')}
                        className="flex-1 bg-rose-50 text-rose-600 py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-1 border border-rose-200"
                      >
                        <XCircle size={16} /> Reject
                      </button>
                    </>
                  )}
                  {req.status === 'waiting_verification' && (
                    <>
                      <button 
                        onClick={() => handleUpdateStatus(req.id, 'active')}
                        className="flex-1 bg-emerald-500 text-white py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-1"
                      >
                        <CheckCircle size={16} /> Verifikasi & Aktifkan
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(req.id, 'rejected')}
                        className="flex-1 bg-rose-50 text-rose-600 py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-1 border border-rose-200"
                      >
                        <XCircle size={16} /> Tolak Bukti
                      </button>
                    </>
                  )}
                  {req.status === 'active' && (
                    <button 
                      onClick={() => handleUpdateStatus(req.id, 'rejected')}
                      className="w-full bg-slate-200 text-slate-700 py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-1"
                    >
                      Nonaktifkan Partner
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
