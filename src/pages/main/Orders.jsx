import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Eye, Trash2, Calendar, X, ShoppingBag, Tag, FileSpreadsheet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// =========================================================================
// 🔴 GLOBAL AUDIO CONTEXT SINGLETON (ANTI BLOKIR, ANTI CRASH, & GURIH TERUS)
// =========================================================================
let globalAudioCtx = null;

const getAudioContext = () => {
  if (!globalAudioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      globalAudioCtx = new AudioContext();
    }
  }
  if (globalAudioCtx && globalAudioCtx.state === "suspended") {
    globalAudioCtx.resume();
  }
  return globalAudioCtx;
};

const playSoundEffect = (type) => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    if (type === "creamyKey") {
      // Efek ketikan ASMR mekanik linier
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      const randomPitch = 140 + Math.random() * 40;
      osc1.frequency.setValueAtTime(randomPitch, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(randomPitch * 0.4, ctx.currentTime + 0.04);
      
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(450, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.03);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(550, ctx.currentTime);

      osc1.connect(gain1);
      osc2.connect(gain2);
      gain1.connect(filter);
      gain2.connect(filter);
      filter.connect(ctx.destination);

      gain1.gain.setValueAtTime(0.4, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      gain2.gain.setValueAtTime(0.25, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.05);
      osc2.stop(ctx.currentTime + 0.05);

    } else if (type === "clickTab") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      osc.type = "sine";
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(650, ctx.currentTime);
      
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(filter);
      filter.connect(ctx.destination);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.04);

    } else if (type === "clickPop") {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      const gain2 = ctx.createGain();
      
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(180, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.05);
      gain1.gain.setValueAtTime(0.3, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(400, ctx.currentTime);
      gain2.gain.setValueAtTime(0.15, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      
      osc1.connect(gain1); gain1.connect(ctx.destination);
      osc2.connect(gain2); gain2.connect(ctx.destination);
      
      osc1.start(ctx.currentTime); osc2.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.05); osc2.stop(ctx.currentTime + 0.05);

    } else if (type === "deletePop") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(130, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.06);

    } else if (type === "marioStarExcel") {
      // 🔥 EFEK MARIO BROS DAPAT BINTANG (8-Bit Retro Arpeggio Pentatonik)
      const notes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50]; // Nada: C5, D5, E5, G5, A5, C6
      const tempo = 0.07; // Jeda antar nada super cepat
      
      notes.forEach((freq, index) => {
        setTimeout(() => {
          try {
            const ctx2 = getAudioContext();
            if (!ctx2) return;
            
            const osc = ctx2.createOscillator();
            const gain = ctx2.createGain();
            
            // Menggunakan jenis square/triangle biar mirip console jadul nes
            osc.type = index % 2 === 0 ? "square" : "triangle";
            osc.frequency.setValueAtTime(freq, ctx2.currentTime);
            
            gain.gain.setValueAtTime(0.08, ctx2.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx2.currentTime + 0.12);
            
            osc.connect(gain);
            gain.connect(ctx2.destination);
            
            osc.start(ctx2.currentTime);
            osc.stop(ctx2.currentTime + 0.12);
          } catch (err) {}
        }, index * tempo * 1000);
      });

      // Tambahan efek krincing uang kasir di akhir nada biar afdol rekap datanya
      setTimeout(() => {
        try {
          const ctx3 = getAudioContext();
          if (!ctx3) return;
          const oscHigh = ctx3.createOscillator();
          const gainHigh = ctx3.createGain();
          oscHigh.type = "sine";
          oscHigh.frequency.setValueAtTime(1600, ctx3.currentTime);
          gainHigh.gain.setValueAtTime(0.06, ctx3.currentTime);
          gainHigh.gain.exponentialRampToValueAtTime(0.001, ctx3.currentTime + 0.25);
          oscHigh.connect(gainHigh);
          gainHigh.connect(ctx3.destination);
          oscHigh.start(ctx3.currentTime);
          oscHigh.stop(ctx3.currentTime + 0.25);
        } catch (err) {}
      }, notes.length * tempo * 1000);
    }
  } catch (e) {
    console.log("Audio Engine Error:", e);
  }
};

const Orders = () => {
  const context = useApp();
  const rawOrders = context.orders || [];
  const deleteOrder = context.deleteOrder;
  const updateOrderStatus = context.updateOrderStatus;

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // =========================================================================
  // 🔴 LOGIKA HELPER: EXPORT REKAP DATA ORDERS KE EXCEL (CSV INDONESIA)
  // =========================================================================
  const handleExportExcel = () => {
    if (rawOrders.length === 0) {
      alert("Waduh bro, belum ada data pesanan yang bisa direkap!");
      return;
    }

    const headers = [
      "ID Transaksi",
      "Waktu & Tanggal",
      "Nama Pelanggan",
      "Status Pesanan",
      "Detail Menu yang Dibeli",
      "Total Qty Item",
      "Total Omzet (Rp)"
    ];

    let csvContent = headers.join(";") + "\n";

    rawOrders.forEach((order) => {
      if (!order) return;

      const detailItems = order.items
        ? order.items.map(item => `${item.qty}x ${item.name}`).join(", ")
        : "Tidak ada detail";

      const totalQty = order.items
        ? order.items.reduce((sum, item) => sum + (item.qty || 0), 0)
        : 0;

      const id = order.id || "-";
      const date = order.date || new Date().toLocaleString("id-ID");
      const customer = order.customer || "General Customer";
      const status = order.status ? order.status.toUpperCase() : "PROCESS";
      const totalAmount = order.total || 0;

      const row = [
        `"${id}"`,
        `"${date}"`,
        `"${customer.replace(/"/g, '""')}"`,
        `"${status}"`,
        `"${detailItems.replace(/"/g, '""')}"`,
        totalQty,
        totalAmount
      ];

      csvContent += row.join(";") + "\n";
    });

    // 🔴 TRIGGER BUNYI UPGRADE MARIO STAR + CASH REGISTER
    playSoundEffect("marioStarExcel");

    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const formatTanggal = new Date().toLocaleDateString("id-ID").replace(/\//g, "-");
    
    link.setAttribute("href", url);
    link.setAttribute("download", `Rekap_Pesanan_Bogeng_${formatTanggal}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = rawOrders.filter(order => {
    if (!order) return false;
    const matchesId = order.id ? order.id.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    const matchesCustomer = order.customer ? order.customer.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    
    const currentStatus = order.status ? order.status.toUpperCase() : "PROCESS";
    const matchesStatus = statusFilter === "ALL" || currentStatus === statusFilter;

    return (matchesId || matchesCustomer) && matchesStatus;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.03 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 28 } }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white text-[#313131] font-sans antialiased overflow-hidden p-2">
      
      {/* Tab Filter Status & Search */}
      <div className="flex justify-between items-center mb-3 shrink-0 px-2 select-none">
        <div className="flex gap-1.5 bg-[#FBF8F6] p-1 rounded-lg border-[0.5px] border-[#E3E3E3]">
          {["ALL", "PROCESS", "DONE", "CANCEL"].map((status) => (
            <button
              key={status}
              onClick={() => {
                playSoundEffect("clickTab");
                setStatusFilter(status);
              }}
              className={`px-3 py-1 rounded-md text-[9px] font-black tracking-tight transition-all ${
                statusFilter === status 
                  ? 'bg-[#C67C4E] text-white shadow-sm' 
                  : 'text-[#9B9B9B] hover:text-[#313131]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Pencarian & Tombol Rekap Excel */}
        <div className="flex items-center gap-2">
          {/* Tombol Rekap Excel */}
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 bg-[#107C41] hover:bg-[#0A5C30] text-white px-3 py-1.5 rounded-lg font-black text-[9px] tracking-tight shadow-sm transition-all active:scale-95"
          >
            <FileSpreadsheet size={12} strokeWidth={2.5} />
            <span>REKAP EXCEL</span>
          </button>

          {/* Kotak Input Cari */}
          <div className="w-64 relative flex items-center">
            <Search size={13} className="absolute left-3 text-[#9B9B9B]" strokeWidth={2} />
            <input 
              type="text"
              placeholder="Cari ID pesanan atau nama..." 
              onChange={(e) => {
                playSoundEffect("creamyKey"); // ➕ Efek ASMR ketikan pas input pencarian
                setSearchQuery(e.target.value);
              }}
              className="w-full bg-[#FBF8F6] border-[0.5px] border-[#E3E3E3] rounded-lg pl-8 pr-3 py-1.5 text-[10px] font-medium focus:outline-none focus:border-[#C67C4E] focus:bg-white transition-all text-[#313131] placeholder:text-[#B0B0B0]"
            />
          </div>
        </div>
      </div>

      {/* Kontainer Tabel */}
      <div className="flex-1 overflow-y-auto border-[0.5px] border-[#E3E3E3] rounded-xl overflow-hidden custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FBF8F6] border-b border-[#E3E3E3] text-[9px] font-black tracking-wider text-[#9B9B9B] uppercase select-none">
              <th className="py-3 px-6 w-[18%]">Order ID</th>
              <th className="py-3 px-6 w-[22%]">Pelanggan</th>
              <th className="py-3 px-6 w-[15%]">Waktu</th>
              <th className="py-3 px-6 w-[15%]">Total</th>
              <th className="py-3 px-6 w-[15%] text-center">Ubah Status</th>
              <th className="py-3 px-6 w-[15%] text-right">Aksi</th>
            </tr>
          </thead>
          
          <motion.tbody 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="divide-y divide-[#E3E3E3]/60 text-[11px] font-medium"
          >
            {filteredOrders.length === 0 ? (
              <motion.tr variants={itemVariants}>
                <td colSpan="6" className="text-center py-16 text-[#9B9B9B] text-[10px] font-bold">
                  Tidak ada riwayat transaksi yang cocok.
                </td>
              </motion.tr>
            ) : (
              filteredOrders.map((order) => {
                const orderStatus = order.status ? order.status.toUpperCase() : "PROCESS";
                return (
                  <motion.tr 
                    key={order.id} 
                    variants={itemVariants}
                    whileHover={{ backgroundColor: "#FDFBF9", x: 2, transition: { duration: 0.1 } }}
                    className="transition-colors"
                  >
                    <td className="py-2.5 px-6 font-mono font-bold text-[#C67C4E] text-[10px]">
                      {order.id}
                    </td>
                    <td className="py-2.5 px-6 font-bold text-[#313131] tracking-tight">
                      {order.customer}
                    </td>
                    <td className="py-2.5 px-6 text-[#9B9B9B] text-[10px]">
                      <span className="flex items-center gap-1 select-none">
                        <Calendar size={10} strokeWidth={2} />
                        {order.date ? order.date.split(',')[0] : '-'}
                      </span>
                    </td>
                    <td className="py-2.5 px-6 font-black text-[#313131]">
                      Rp {Number(order.total || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-6 text-center">
                      <select
                        value={orderStatus}
                        onChange={(e) => {
                          playSoundEffect("clickTab");
                          updateOrderStatus && updateOrderStatus(order.id, e.target.value);
                        }}
                        className={`text-[9px] font-black px-2 py-1 rounded border outline-none cursor-pointer transition-colors ${
                          orderStatus === 'DONE' ? 'bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]' :
                          orderStatus === 'CANCEL' ? 'bg-red-50 text-red-600 border-red-200' :
                          'bg-amber-50 text-amber-600 border-amber-200 animate-pulse'
                        }`}
                      >
                        <option value="PROCESS">⏳ PROCESS</option>
                        <option value="DONE">✅ DONE</option>
                        <option value="CANCEL">❌ CANCEL</option>
                      </select>
                    </td>
                    <td className="py-2.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            playSoundEffect("clickPop");
                            setSelectedOrder(order);
                          }}
                          className="p-1 text-[#313131] hover:text-[#C67C4E] hover:bg-[#EDD6C8]/30 rounded transition-all"
                        >
                          <Eye size={12} strokeWidth={2.5} />
                        </button>
                        {deleteOrder && (
                          <button 
                            onClick={() => {
                              if(confirm("Hapus pesanan ini, bro?")) {
                                playSoundEffect("deletePop");
                                deleteOrder(order.id);
                              }
                            }}
                            className="p-1 text-[#9B9B9B] hover:text-red-500 hover:bg-red-50 rounded transition-all"
                          >
                            <Trash2 size={12} strokeWidth={2.5} />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </motion.tbody>
        </table>
      </div>

      {/* ANIMATE PRESENCE MODAL */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                playSoundEffect("deletePop");
                setSelectedOrder(null);
              }}
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
                    <p className="text-[9px] font-mono font-bold text-[#C67C4E] mt-0.5">{selectedOrder.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    playSoundEffect("deletePop");
                    setSelectedOrder(null);
                  }}
                  className="p-1 rounded-lg hover:bg-gray-100 text-[#9B9B9B] hover:text-[#313131] transition-all"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>

              <hr className="border-dashed border-[#E3E3E3] mb-3" />

              {/* Info Pelanggan */}
              <div className="bg-[#FBF8F6] p-2.5 rounded-xl border-[0.5px] border-[#E3E3E3] text-[10px] space-y-1.5 mb-4">
                <div className="flex justify-between">
                  <span className="text-[#9B9B9B] font-bold">Nama Kasir/Pelanggan:</span>
                  <span className="font-black text-[#313131] tracking-tight">{selectedOrder.customer?.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9B9B9B] font-bold">Waktu Transaksi:</span>
                  <span className="text-[#313131] font-medium">{selectedOrder.date || '-'}</span>
                </div>
              </div>

              {/* Daftar Item Belanjaan */}
              <h5 className="text-[9px] font-black tracking-wider text-[#9B9B9B] uppercase mb-2 px-1 select-none">Rincian Menu</h5>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar mb-4">
                {selectedOrder.items?.map((item, idx) => (
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
                  Rp {Number(selectedOrder.total || 0).toLocaleString('id-ID')}
                </span>
              </div>

              {/* Tombol Tutup */}
              <button
                onClick={() => {
                  playSoundEffect("deletePop");
                  setSelectedOrder(null);
                }}
                className="w-full mt-4 bg-[#313131] hover:bg-[#C67C4E] text-white font-black text-[10px] uppercase py-2 rounded-xl tracking-wider shadow-md transition-all"
              >
                Selesai & Tutup
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Orders;