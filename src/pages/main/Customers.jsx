import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Star, Award, Users, TrendingUp, ShoppingBag, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import StatCard from '../../components/StatCard';
import Input from '../../components/Input';
import IconButton from '../../components/IconButton';
import Badge from '../../components/Badge';

// ================= AUDIO ENGINE =================
let globalAudioCtx = null;
const getAudioContext = () => {
  if (!globalAudioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) globalAudioCtx = new AudioContext();
  }
  if (globalAudioCtx && globalAudioCtx.state === "suspended") globalAudioCtx.resume();
  return globalAudioCtx;
};

const playSoundEffect = (type) => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (type === "creamyKey") {
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
      osc1.connect(gain1); osc2.connect(gain2);
      gain1.connect(filter); gain2.connect(filter); filter.connect(ctx.destination);
      gain1.gain.setValueAtTime(0.4, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      gain2.gain.setValueAtTime(0.25, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      osc1.start(ctx.currentTime); osc2.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.05); osc2.stop(ctx.currentTime + 0.05);
    } else if (type === "clickDelete") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(460, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.04);
    }
  } catch (error) {
    console.log("Audio Engine Error:", error);
  }
};

const Customers = () => {
  const { customers = [], orders = [], deleteCustomer, getMemberTier } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = customers.filter(c =>
    c.name ? c.name.toLowerCase().includes(searchQuery.toLowerCase()) : false
  );

  // Hitung tier live dari fungsi yang sama dengan member portal
  const tierOf = (cust) =>
    getMemberTier ? getMemberTier(cust.visits || 0, cust.totalSpend || 0) : (cust.status || 'MEMBER');

  // ================= ANALISIS FINANSIAL =================
  const validOrders = orders.filter(o => o.status !== "CANCEL");
  const totalGrossRevenue = validOrders.reduce((acc, curr) => acc + Number(curr.total || 0), 0);
  const estimatedNetProfit = totalGrossRevenue * 0.6;
  const averageBasket = validOrders.length > 0 ? totalGrossRevenue / validOrders.length : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.04 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white text-[#313131] font-sans antialiased overflow-hidden p-2">

      {/* CARD ANALITIK */}
      <div className="grid grid-cols-3 gap-3 mb-4 shrink-0 px-1">
        <StatCard
          title="Total Pendapatan (Gross)"
          value={`Rp ${totalGrossRevenue.toLocaleString('id-ID')}`}
          icon={<ShoppingBag size={15} strokeWidth={2.5} />}
          iconBg="bg-[#C67C4E]/10"
          iconColor="text-[#C67C4E]"
          valueColor="text-[#313131]"
          delay={0.05}
        />
        <StatCard
          title="Estimasi Profit Kedai (60%)"
          value={`Rp ${estimatedNetProfit.toLocaleString('id-ID')}`}
          icon={<TrendingUp size={15} strokeWidth={2.5} />}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          valueColor="text-emerald-600"
          delay={0.1}
        />
        <StatCard
          title="Rata-rata Keranjang Belanja"
          value={`Rp ${Math.round(averageBasket).toLocaleString('id-ID')}`}
          icon={<Users size={15} strokeWidth={2.5} />}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          valueColor="text-blue-600"
          delay={0.15}
        />
      </div>

      {/* Header & Search */}
      <div className="flex justify-between items-center mb-3 shrink-0 px-2 select-none">
        <div>
          <h3 className="text-[10px] font-black tracking-wider uppercase text-[#313131]">
            Database CRM & Peringkat Pelanggan
          </h3>
          <p className="text-[8px] text-[#9B9B9B] font-medium mt-0.5">
            Sistem Tingkatan: 10x Transaksi / Rp250rb = LOYAL · 25x Transaksi / Rp500rb = VIP
          </p>
        </div>
        <Input
          className="w-64"
          placeholder="Cari nama pelanggan..."
          icon={<Search size={13} strokeWidth={2} />}
          onChange={(e) => { playSoundEffect("creamyKey"); setSearchQuery(e.target.value); }}
        />
      </div>

      {/* Tabel CRM */}
      <div className="flex-1 overflow-y-auto border-[0.5px] border-[#E3E3E3] rounded-xl overflow-hidden custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FBF8F6] border-b border-[#E3E3E3] text-[9px] font-black tracking-wider text-[#9B9B9B] uppercase select-none">
              <th className="py-3 px-6 w-[35%]">Nama Pelanggan</th>
              <th className="py-3 px-6 w-[20%] text-center">Frekuensi Kunjungan</th>
              <th className="py-3 px-6 w-[20%]">Poin Reward Terkumpul</th>
              <th className="py-3 px-6 w-[15%] text-center">Tingkatan Tier</th>
              <th className="py-3 px-6 w-[10%] text-right">Aksi</th>
            </tr>
          </thead>
          <motion.tbody variants={containerVariants} initial="hidden" animate="show"
            className="divide-y divide-[#E3E3E3]/60 text-[11px] font-medium">
            {filteredCustomers.length === 0 ? (
              <motion.tr variants={itemVariants}>
                <td colSpan="5" className="text-center py-16 text-[#9B9B9B] text-[10px] font-bold">
                  Belum ada data pelanggan yang terdaftar.
                </td>
              </motion.tr>
            ) : (
              filteredCustomers.map((cust) => {
                const tier = tierOf(cust);
                const isVip = tier === 'VIP';
                return (
                  <motion.tr key={cust.id} variants={itemVariants}
                    whileHover={{ backgroundColor: "#FDFBF9", x: 2, transition: { duration: 0.1 } }}
                    className="transition-colors">
                    <td className="py-2.5 px-6 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#EDD6C8]/50 text-[#C67C4E] flex items-center justify-center font-black text-[9px] shrink-0 select-none">
                        {cust.name ? cust.name.charAt(0).toUpperCase() : 'B'}
                      </div>
                      <div className="truncate">
                        <p className="font-bold text-[#313131] tracking-tight">{cust.name}</p>
                        <p className="text-[8px] text-[#9B9B9B]">{cust.email || '-'}</p>
                      </div>
                    </td>
                    <td className="py-2.5 px-6 text-center font-black text-[#313131]">
                      {cust.visits || 0}x transaksi
                    </td>
                    <td className="py-2.5 px-6 font-bold text-[#C67C4E]">
                      ✨ <span className="font-black text-[12px]">{cust.points || 0}</span> <span className="text-[9px] text-[#9B9B9B] font-medium">pts</span>
                    </td>
                    <td className="py-2.5 px-6 text-center">
                      <Badge
                        status={tier}
                        size="compact"
                        icon={isVip ? <Award size={8} strokeWidth={3} /> : <Star size={8} strokeWidth={3} />}
                      />
                    </td>
                    <td className="py-2.5 px-6 text-right">
                      {deleteCustomer && (
                        <IconButton
                          size="compact"
                          variant="ghostDanger"
                          icon={<Trash2 size={12} strokeWidth={2.5} />}
                          onClick={() => { playSoundEffect("clickDelete"); deleteCustomer(cust.id); }}
                        />
                      )}
                    </td>
                  </motion.tr>
                );
              })
            )}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;