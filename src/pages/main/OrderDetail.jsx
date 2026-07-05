import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DropdownStatus from '../../components/DropdownStatus';
import IconButton from '../../components/IconButton';

// Sama persis dengan daftar status yang dipakai di Orders.jsx,
// biar dropdown status di modal ini konsisten dengan tabel pesanan.
const ORDER_STATUSES = [
  { id: 'PROCESS', label: '⏳ Process', color: 'bg-amber-500', text: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'DONE',    label: '✅ Done',    color: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'CANCEL',  label: '❌ Cancel',  color: 'bg-rose-500', text: 'text-rose-600', bg: 'bg-rose-50' },
];

const OrderDetail = ({ data, onClose }) => {
  const { updateOrderStatus } = useApp();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#313131]/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
          className="bg-white rounded-2xl max-w-sm w-full border-[0.5px] border-[#E3E3E3] shadow-2xl p-5 overflow-hidden relative z-10"
        >
          {/* Header Modal */}
          <div className="flex justify-between items-start mb-4 select-none">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#EDD6C8]/40 text-[#C67C4E] rounded-lg">
                <ShoppingBag size={14} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="text-[12px] font-black text-[#313131] tracking-tight uppercase">Detail Transaksi</h4>
                <p className="text-[9px] font-mono font-bold text-[#C67C4E] mt-0.5">{data.id}</p>
              </div>
            </div>
            <IconButton
              size="compact"
              variant="ghost"
              icon={<X size={14} strokeWidth={2.5} />}
              onClick={onClose}
            />
          </div>

          <hr className="border-dashed border-[#E3E3E3] mb-3" />

          {/* Info Pelanggan & Status */}
          <div className="bg-[#FBF8F6] p-2.5 rounded-xl border-[0.5px] border-[#E3E3E3] text-[10px] space-y-1.5 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-[#9B9B9B] font-bold">Nama Kasir/Pelanggan:</span>
              <span className="font-black text-[#313131] tracking-tight">{data.customer?.toUpperCase()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#9B9B9B] font-bold">Waktu Transaksi:</span>
              <span className="text-[#313131] font-medium">{data.date || '-'}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-[#9B9B9B] font-bold">Status Pesanan:</span>
              <DropdownStatus
                currentStatus={data.status}
                statuses={ORDER_STATUSES}
                onStatusChange={(newStatus) => updateOrderStatus && updateOrderStatus(data.id, newStatus)}
              />
            </div>
          </div>

          {/* Daftar Item Belanjaan */}
          <h5 className="text-[9px] font-black tracking-wider text-[#9B9B9B] uppercase mb-2 px-1 select-none">Rincian Menu</h5>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar mb-4">
            {data.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-[10px] bg-white border-b border-gray-100 pb-1.5">
                <div>
                  <p className="font-bold text-[#313131]">{item.name}</p>
                  <p className="text-[8px] text-[#9B9B9B] font-medium">Rp {Number(item.price || 0).toLocaleString('id-ID')} x{item.qty}</p>
                </div>
                <span className="font-black text-[#313131]">
                  Rp {Number((item.price || 0) * item.qty).toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>

          <hr className="border-dashed border-[#E3E3E3] mb-3" />

          {/* Total Pembayaran */}
          <div className="flex justify-between items-center bg-[#EDD6C8]/20 border-[0.5px] border-[#EDD6C8] rounded-xl p-3 select-none">
            <span className="text-[10px] font-black text-[#C67C4E] uppercase tracking-wide">Grand Total</span>
            <span className="text-sm font-black text-[#C67C4E]">
              Rp {Number(data.total || 0).toLocaleString('id-ID')}
            </span>
          </div>

          {/* Tombol Tutup */}
          <button
            onClick={onClose}
            className="w-full mt-4 bg-[#313131] hover:bg-[#C67C4E] text-white font-black text-[10px] uppercase py-2 rounded-xl tracking-wider shadow-md transition-all"
          >
            Selesai & Tutup
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OrderDetail;