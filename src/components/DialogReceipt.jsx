import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Receipt, Coffee, Printer } from 'lucide-react';

const DialogReceipt = ({ isOpen, onClose, customerName, totalAmount }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center font-sans">
          {/* Overlay Transparan Gelap */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#313131]/40 backdrop-blur-sm"
          />

          {/* Konten Kotak Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="bg-white rounded-2xl border-[0.5px] border-[#E3E3E3] w-full max-w-sm p-5 shadow-2xl relative z-10 m-4 overflow-hidden"
          >
            {/* Header Dialog */}
            <div className="flex justify-between items-center pb-3 border-b-[0.5px] border-dashed border-[#E3E3E3]">
              <div className="flex items-center gap-2 text-[#C67C4E]">
                <Receipt size={16} strokeWidth={2.5} />
                <h3 className="text-xs font-black uppercase tracking-wider">Konfirmasi Transaksi</h3>
              </div>
              <button onClick={onClose} className="text-[#9B9B9B] hover:text-[#313131] transition-colors p-1 rounded-lg hover:bg-gray-50">
                <X size={14} strokeWidth={2.5} />
              </button>
            </div>

            {/* Isi Struktur Struk Nota */}
            <div className="py-5 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#F9F2ED] text-[#C67C4E] rounded-full flex items-center justify-center mb-3 border border-[#EDD6C8]">
                <Coffee size={22} strokeWidth={2} />
              </div>
              <p className="text-[10px] font-bold text-[#9B9B9B] tracking-widest uppercase">BOGENG COFFEE SHOP</p>
              <h4 className="text-xl font-black text-[#313131] mt-1">Rp {totalAmount?.toLocaleString('id-ID')}</h4>
              
              <div className="w-full bg-[#FBF8F6] rounded-xl p-3 mt-4 text-left border-[0.5px] border-[#E3E3E3] text-[11px] space-y-2">
                <div className="flex justify-between"><span className="text-[#9B9B9B] font-bold">Pelanggan:</span><span className="font-black text-[#313131]">{customerName || 'Walk-in Customer'}</span></div>
                <div className="flex justify-between"><span className="text-[#9B9B9B] font-bold">Metode POS:</span><span className="font-black text-[#313131]">Tunai / QRIS</span></div>
                <div className="flex justify-between"><span className="text-[#9B9B9B] font-bold">Status Pajak:</span><span className="font-black text-emerald-600">Paid / Terbayar</span></div>
              </div>
            </div>

            {/* Footer Aksi */}
            <div className="flex gap-2 pt-2">
              <button 
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border-[0.5px] border-[#E3E3E3] text-[11px] font-black text-[#9B9B9B] hover:bg-gray-50 transition-colors"
              >
                Kembali
              </button>
              <button 
                onClick={() => { alert("Struk berhasil dikirim ke printer thermal!"); onClose(); }}
                className="flex-1 bg-[#C67C4E] hover:bg-[#A05C32] py-2.5 rounded-xl text-[11px] font-black text-white flex items-center justify-center gap-1.5 shadow-md shadow-[#C67C4E]/20 transition-all"
              >
                <Printer size={12} strokeWidth={2.5} />
                Cetak Struk
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DialogReceipt;