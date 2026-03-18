import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Phone, Plus, ShieldCheck, Handshake, AlertTriangle, ImageIcon, Send } from 'lucide-react';

interface ChatRoomProps {
 user: any;
 userRole: string;
 chatMitra: any;
 chatMitraPhone: string | null;
 transactions: any[];
 messages: any[];
 inputText: string;
 setInputText: (text: string) => void;
 sendMessage: () => void;
 handleBack: () => void;
 setShowOfferModal: (show: boolean) => void;
 setActiveTransaction: (t: any) => void;
 setPaymentAmount: (amount: number) => void;
 setPaymentProof: (proof: any) => void;
 setPaymentProofPreview: (preview: string | null) => void;
 setShowPaymentModal: (show: boolean) => void;
 openDealModal: () => void;
 chatEndRef: React.RefObject<HTMLDivElement>;
}

const ChatRoom: React.FC<ChatRoomProps> = ({
 user,
 userRole,
 chatMitra,
 chatMitraPhone,
 transactions,
 messages,
 inputText,
 setInputText,
 sendMessage,
 handleBack,
 setShowOfferModal,
 setActiveTransaction,
 setPaymentAmount,
 setPaymentProof,
 setPaymentProofPreview,
 setShowPaymentModal,
 openDealModal,
 chatEndRef
}) => {
 const hasPaid = transactions.some(t => 
 ((t.customerID === user?.uid && t.mitraID === chatMitra?.id) || 
 (t.mitraID === user?.uid && t.customerID === chatMitra?.id)) && 
 (t.status === 'paid' || t.status === 'in_progress' || t.status === 'completed')
 );

 return (
 <motion.div 
 key="chat"
 initial={{ opacity: 0, y: 100 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: 100 }}
 className="fixed inset-0 z-[2000] bg-slate-50/50 flex flex-col relative overflow-hidden perspective-[1000px]"
 >
 {/* 3D Background Elements */}
 <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent -skew-y-6 transform-origin-top-left -z-10" />
 <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
 <div className="absolute top-40 -left-20 w-48 h-48 bg-accent/20 rounded-full blur-3xl -z-10" />

 <header className="bg-white text-slate-800 p-5 pt-8 flex items-center gap-4 border-b border-slate-200 shadow-sm z-20 ">
 <motion.button 
 whileHover={{ scale: 1.05, translateY: -2 }}
 whileTap={{ scale: 0.9 }}
 onClick={handleBack} 
 className="p-2 -ml-2 bg-white rounded-xl text-slate-600 shadow-sm border border-slate-200 "
 >
 <ArrowLeft size={24} />
 </motion.button>
 <div className="flex-1">
 <h2 className="text-lg font-bold text-primary">Chat dengan {chatMitra?.name || 'Mitra'}</h2>
 <div className="flex items-center gap-1.5">
 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm" />
 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Online</span>
 {hasPaid && chatMitraPhone && (
 <>
 <span className="text-slate-300">•</span>
 <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
 <Phone size={10} /> {chatMitraPhone}
 </span>
 </>
 )}
 </div>
 </div>
 <div className="flex gap-2">
 {userRole === 'mitra' ? (
 <motion.button 
 whileHover={{ scale: 1.05, translateY: -2 }}
 whileTap={{ scale: 0.95 }}
 onClick={() => setShowOfferModal(true)}
 className="bg-primary text-white px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm border border-slate-200"
 >
 <Plus size={14} />
 Kirim Penawaran
 </motion.button>
 ) : (
 <motion.button 
 whileHover={{ scale: 1.05, translateY: -2 }}
 whileTap={{ scale: 0.95 }}
 onClick={() => {
 // Find deal_agreed transaction for this mitra
 const agreedTrans = transactions.find(t => 
 t.customerID === user?.uid && 
 t.mitraID === chatMitra?.id && 
 t.status === 'deal_agreed'
 );
 if (agreedTrans) {
 setActiveTransaction(agreedTrans);
 setPaymentAmount(agreedTrans.dpAmount);
 setPaymentProof(null);
 setPaymentProofPreview(null);
 setShowPaymentModal(true);
 } else {
 alert("Silakan klik 'Bayar DP 10%' terlebih dahulu untuk menyetujui penawaran.");
 }
 }} 
 className="bg-emerald-50/80 text-emerald-600 px-3 py-2 rounded-xl border border-emerald-200 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm "
 >
 <ShieldCheck size={14} />
 Upload Bukti DP
 </motion.button>
 )}
 <motion.button 
 whileHover={{ scale: 1.05, translateY: -2 }}
 whileTap={{ scale: 0.95 }}
 onClick={openDealModal} 
 className="bg-white p-2 rounded-xl border border-slate-200 text-primary text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm "
 >
 <Handshake size={14} /> Bayar DP 10%
 </motion.button>
 </div>
 </header>

 <main className="flex-1 overflow-y-auto p-6 space-y-4 z-10">
 {!hasPaid && (
 <motion.div 
 initial={{ opacity: 0, y: -20 }}
 animate={{ opacity: 1, y: 0 }}
 className="bg-accent/10 border border-accent/20 p-4 rounded-2xl text-[11px] text-accent font-medium leading-relaxed shadow-sm "
 >
 <AlertTriangle size={16} className="inline mr-2 -mt-1" />
 Jaga keamanan bersama! Semua komunikasi wajib melalui chat internal. Dilarang berbagi nomor WhatsApp atau kontak pribadi lainnya sebelum pembayaran DP.
 </motion.div>
 )}

 {messages.length === 0 ? (
 <div className="flex flex-col items-center justify-center h-full opacity-30">
 <motion.div
 animate={{ rotateY: [0, 180, 360] }}
 transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
 className=""
 >
 <Handshake size={64} className="mb-4" />
 </motion.div>
 <p className="text-sm font-bold">Belum ada pesan</p>
 </div>
 ) : (
 messages.map((m) => (
 <motion.div 
 initial={{ opacity: 0, scale: 0.9, y: 10 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 key={m.id} 
 className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
 >
 <div className={`max-w-[80%] p-4 rounded-[24px] text-sm font-medium shadow-sm ${m.sender === 'user' ? 'bg-primary text-white rounded-br-none border border-slate-200' : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'}`}>
 {m.content}
 </div>
 <span className="text-[9px] font-bold text-slate-400 mt-1 px-2">{m.time}</span>
 </motion.div>
 ))
 )}
 <div ref={chatEndRef} />
 </main>

 <footer className="bg-white p-4 border-t border-slate-200 flex items-end gap-3 safe-bottom z-20 shadow-sm ">
 <motion.button 
 whileHover={{ scale: 1.05, translateY: -2 }}
 whileTap={{ scale: 0.95 }}
 className="w-12 h-12 bg-white text-slate-400 rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm "
 >
 <ImageIcon size={20} />
 </motion.button>
 <textarea 
 value={inputText}
 onChange={(e) => setInputText(e.target.value)}
 onKeyDown={(e) => {
 if (e.key === 'Enter' && !e.shiftKey) {
 e.preventDefault();
 sendMessage();
 }
 }}
 placeholder="Ketik pesan..."
 className="flex-1 bg-white border border-slate-200 rounded-2xl p-3 text-sm font-medium outline-none focus:ring-2 ring-primary/20 transition-all resize-none max-h-32 shadow-sm"
 rows={1}
 />
 <motion.button 
 whileHover={{ scale: 1.05, translateY: -2 }}
 whileTap={{ scale: 0.95 }}
 onClick={sendMessage}
 disabled={!inputText.trim()}
 className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border border-slate-200 ${inputText.trim() ? 'bg-primary text-white shadow-sm' : 'bg-slate-100/50 text-slate-300'}`}
 >
 <Send size={20} />
 </motion.button>
 </footer>
 </motion.div>
 );
};

export default ChatRoom;
