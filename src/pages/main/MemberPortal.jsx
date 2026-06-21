// src/pages/main/MemberPortal.jsx
// Halaman khusus pelanggan yang sudah daftar member Bogeng.
// Fitur: pesan menu → pesanan masuk ke admin, riwayat transaksi,
// status & progress tier (Reguler → Loyal → VIP), benefit per level.

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coffee, Heart, Crown, Star, ShoppingBag, Plus, Minus,
  Search, CheckCircle2, ChevronRight, LogOut, User,
  Clock, Gift, TrendingUp, X, Sparkles, ArrowRight,
  ReceiptText, Home,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useApp } from '../../context/AppContext';

// ─── Import gambar menu sama persis dengan BogengLandingPage ──────────
import espressoImg      from '../../assets/espresso.png';
import caramelImg       from '../../assets/caramel_macchiato.png';
import palmSugarImg     from '../../assets/palm_sugar_coffee.png';
import matchaImg        from '../../assets/matcha_latte.png';
import chococreamylavaImg from '../../assets/chococreamy_lava.png';
import redvelvetImg     from '../../assets/redvelvet.png';
import nasigorengImg    from '../../assets/nasigoreng.jpg';
import sandwichImg      from '../../assets/sandwich.jpg';
import spagetiImg       from '../../assets/spageti.jpg';
import dimsumImg        from '../../assets/dimsum.jpg';
import cirengImg        from '../../assets/cire1.png';
import frenchImg        from '../../assets/french.jpg';

// ─── Data menu (sumber sama dengan landing page) ──────────────────────
const MENU_ITEMS = [
  { id: 101, category: 'Kopi',     name: 'Espresso Bold',       price: 25000, img: espressoImg,       isBestSeller: true  },
  { id: 102, category: 'Kopi',     name: 'Caramel Macchiato',   price: 35000, img: caramelImg,        isBestSeller: true  },
  { id: 103, category: 'Kopi',     name: 'Palm Sugar Coffee',   price: 28000, img: palmSugarImg,      isBestSeller: false },
  { id: 104, category: 'Non-Kopi', name: 'Matcha Latte Premium',price: 32000, img: matchaImg,         isBestSeller: false },
  { id: 105, category: 'Non-Kopi', name: 'Choco Creamy Lava',   price: 30000, img: chococreamylavaImg,isBestSeller: true  },
  { id: 106, category: 'Non-Kopi', name: 'Red Velvet Cream',    price: 30000, img: redvelvetImg,      isBestSeller: false },
  { id: 201, category: 'Makanan',  name: 'Nasi Goreng Spesial', price: 25000, img: nasigorengImg,     isBestSeller: true  },
  { id: 202, category: 'Makanan',  name: 'Sandwich Smoked Beef',price: 27000, img: sandwichImg,       isBestSeller: false },
  { id: 203, category: 'Makanan',  name: 'Spageti Aglio Olio',  price: 28000, img: spagetiImg,        isBestSeller: false },
  { id: 204, category: 'Cemilan',  name: 'Dimsum Ayam',         price: 20000, img: dimsumImg,         isBestSeller: false },
  { id: 205, category: 'Cemilan',  name: 'Cireng Bumbu Rujak',  price: 15000, img: cirengImg,         isBestSeller: false },
  { id: 206, category: 'Cemilan',  name: 'French Fries Crispy', price: 18000, img: frenchImg,         isBestSeller: true  },
];

const CATEGORIES = ['Semua', 'Kopi', 'Non-Kopi', 'Makanan', 'Cemilan'];

function formatIDR(n) { return `Rp ${n.toLocaleString('id-ID')}`; }

// ─── Tier config ──────────────────────────────────────────────────────
const TIERS = [
  {
    key: 'Member',
    label: 'Reguler',
    icon: Coffee,
    color: '#9B9B9B',
    bg: '#F5F5F5',
    minTrx: 0,
    nextAt: 10,
    discount: 0,
    benefits: [
      'Kumpulkan poin dari setiap pembelian',
      'Akses riwayat pesanan personal',
      'Notifikasi promo khusus member',
    ],
  },
  {
    key: 'Loyal',
    label: 'Loyal Member',
    icon: Heart,
    color: '#C67C4E',
    bg: '#FFF7F2',
    minTrx: 10,
    nextAt: 25,
    discount: 5,
    benefits: [
      'Diskon otomatis 5% setiap belanja',
      'Prioritas pesanan di jam sibuk',
      'Akses menu seasonal lebih awal',
      'Semua benefit Reguler',
    ],
  },
  {
    key: 'Vip',
    label: 'VIP Member',
    icon: Crown,
    color: '#C9AA71',
    bg: '#FFFBF0',
    minTrx: 25,
    nextAt: null,
    discount: 15,
    benefits: [
      'Diskon otomatis 15% setiap belanja',
      'Akses pertama menu edisi terbatas',
      'Free 1 minuman setiap 25 transaksi',
      'Layanan prioritas & meja reserved',
      'Semua benefit Loyal Member',
    ],
  },
];

function getTier(trxCount) {
  if (trxCount >= 25) return TIERS[2];
  if (trxCount >= 10) return TIERS[1];
  return TIERS[0];
}

// ─── Komponen kecil ───────────────────────────────────────────────────
function TierBadge({ tier, size = 'sm' }) {
  const Icon = tier.icon;
  const sz = size === 'lg' ? 'px-4 py-2 text-sm gap-2' : 'px-2.5 py-1 text-[10px] gap-1.5';
  return (
    <span
      className={`inline-flex items-center rounded-full font-black uppercase tracking-wider ${sz}`}
      style={{ background: tier.bg, color: tier.color, border: `1.5px solid ${tier.color}30` }}
    >
      <Icon size={size === 'lg' ? 16 : 11} />
      {tier.label}
    </span>
  );
}

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={10} className={i <= count ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
      ))}
    </div>
  );
}

// ─── Receipt modal ────────────────────────────────────────────────────
function ReceiptModal({ order, onClose }) {
  if (!order) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.88, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 16, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        className="bg-white rounded-3xl p-7 w-full max-w-sm shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header struk */}
        <div className="text-center mb-5">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
            className="w-14 h-14 bg-[#C67C4E]/10 rounded-full flex items-center justify-center mx-auto mb-3"
          >
            <CheckCircle2 size={28} className="text-[#C67C4E]" />
          </motion.div>
          <h3 className="font-black text-[#2F2D2C] text-lg">Pesanan Masuk!</h3>
          <p className="text-xs text-gray-400 font-bold mt-0.5">Pesanan kamu sedang diproses kasir ☕</p>
        </div>

        {/* Info order */}
        <div className="bg-[#FAF7F2] rounded-2xl p-4 space-y-2 text-xs border border-[#EFE6DC] mb-4">
          <div className="flex justify-between text-gray-400">
            <span>ID Order</span>
            <span className="font-black text-[#2F2D2C] font-mono">{order.id}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Pelanggan</span>
            <span className="font-black text-[#2F2D2C] uppercase">{order.customer}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Tipe</span>
            <span className="font-black text-[#C67C4E]">{order.type === 'DINE-IN' ? '🍽️ Dine In' : '🛍️ Take Away'}</span>
          </div>
          <div className="border-t border-[#EFE6DC] pt-2 mt-2 space-y-1">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between text-[#2F2D2C]">
                <span className="font-bold">{item.name} <span className="text-[#C67C4E]">×{item.qty}</span></span>
                <span className="font-black">{formatIDR(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#EFE6DC] pt-2 flex justify-between items-center">
            <span className="font-black text-[#2F2D2C] uppercase text-[11px]">Total</span>
            <span className="font-black text-[#C67C4E] text-base">{formatIDR(order.total)}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-[#2F2D2C] hover:bg-[#C67C4E] text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-colors duration-300"
        >
          Tutup & Lihat Riwayat
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────
export default function MemberPortal() {
  const { addOrder } = useApp();
  const navigate = useNavigate();

  // ── State member dari Supabase ──
  const [member,   setMember]   = useState(null); // data customer dari DB
  const [loading,  setLoading]  = useState(true);
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'riwayat' | 'benefit'

  // ── State pesan menu ──
  const [cat,      setCat]      = useState('Semua');
  const [search,   setSearch]   = useState('');
  const [cart,     setCart]     = useState([]);
  const [orderType, setOrderType] = useState('dine-in');

  // ── State checkout ──
  const [receipt,  setReceipt]  = useState(null); // order yang baru selesai

  // ── Riwayat pesanan member (simpan di localStorage per username) ──
  const [history,  setHistory]  = useState([]);

  // ── Load member dari localStorage (username yang login) ──
  useEffect(() => {
    const loadMember = async () => {
      try {
        const saved = localStorage.getItem('bogeng_member_session');
        if (!saved) { navigate('/member-login'); return; }
        const session = JSON.parse(saved);

        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('username_akun', session.username)
          .single();

        if (error || !data) { navigate('/member-login'); return; }
        setMember(data);

        // Load riwayat dari localStorage
        const histKey = `bogeng_history_${data.username_akun}`;
        const savedHist = localStorage.getItem(histKey);
        if (savedHist) setHistory(JSON.parse(savedHist));
      } catch {
        navigate('/member-login');
      } finally {
        setLoading(false);
      }
    };
    loadMember();
  }, [navigate]);

  const saveHistory = useCallback((newOrder) => {
    if (!member) return;
    const histKey = `bogeng_history_${member.username_akun}`;
    const updated = [newOrder, ...history].slice(0, 50); // max 50 riwayat
    setHistory(updated);
    localStorage.setItem(histKey, JSON.stringify(updated));
  }, [member, history]);

  // ── Hitung tier dari riwayat ──
  const trxCount = history.length;
  const tier     = getTier(trxCount);
  const nextTier = TIERS.find(t => t.minTrx > trxCount);
  const progress = nextTier
    ? Math.min(100, ((trxCount - tier.minTrx) / (nextTier.minTrx - tier.minTrx)) * 100)
    : 100;

  // ── Diskon tier ──
  const discountPct = tier.discount;

  // ── Filter menu ──
  const filtered = MENU_ITEMS.filter(item => {
    const matchCat    = cat === 'Semua' || item.category === cat;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // ── Cart helpers ──
  const subtotal  = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discounted = Math.round(subtotal * (1 - discountPct / 100));

  const addToCart = (item) => {
    setCart(prev => {
      const ex = prev.find(c => c.id === item.id);
      if (ex) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) { setCart(prev => prev.filter(c => c.id !== id)); return; }
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty } : c));
  };

  // ── Checkout ──
  const handleCheckout = () => {
    if (!cart.length) return;
    const order = {
      id:       `MBR-${Date.now().toString().slice(-8)}`,
      customer: member?.nama_lengkap?.toUpperCase() || 'MEMBER',
      items:    cart,
      total:    discounted,
      subtotal,
      discount: discountPct,
      status:   'PROCESS',
      type:     orderType === 'dine-in' ? 'DINE-IN' : 'TAKE-AWAY',
      date:     new Date().toLocaleDateString('id-ID'),
      tier:     tier.label,
      member:   member?.username_akun,
    };
    addOrder(order);     // masuk ke admin
    saveHistory(order);  // simpan di riwayat member
    setReceipt(order);
  };

  const handleCloseReceipt = () => {
    setReceipt(null);
    setCart([]);
    setActiveTab('riwayat');
  };

  const handleLogout = () => {
    localStorage.removeItem('bogeng_member_session');
    navigate('/member-login');
  };

  // ─── Loading / Guard ─────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#EFE6DC] border-t-[#C67C4E] rounded-full animate-spin" />
        <p className="text-xs font-black text-[#C67C4E] uppercase tracking-widest">Memuat portal…</p>
      </div>
    </div>
  );

  const TierIcon = tier.icon;

  // ─── RENDER ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans text-[#2F2D2C] selection:bg-[#C67C4E]/20">

      {/* ── Receipt Modal ── */}
      <AnimatePresence>
        {receipt && <ReceiptModal order={receipt} onClose={handleCloseReceipt} />}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#EFE6DC] px-5 sm:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#C67C4E] rounded-lg flex items-center justify-center text-white font-black text-xs">
            B
          </div>
          <span className="font-black text-sm tracking-tight font-serif italic text-[#2F2D2C]">
            Bogeng<span className="text-[#C67C4E]">.</span>
          </span>
        </Link>

        {/* Tab navigasi desktop */}
        <nav className="hidden sm:flex items-center gap-1 bg-[#FAF7F2] border border-[#EFE6DC] rounded-full p-1">
          {[
            { id: 'menu',    label: 'Pesan Menu',   icon: Coffee       },
            { id: 'riwayat', label: 'Riwayat',      icon: ReceiptText  },
            { id: 'benefit', label: 'Benefit',       icon: Gift         },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#2F2D2C] text-white shadow-sm'
                    : 'text-gray-400 hover:text-[#2F2D2C]'
                }`}
              >
                <Icon size={12} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Profil + logout */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 bg-[#FAF7F2] border border-[#EFE6DC] rounded-xl px-3 py-1.5">
            <div className="w-6 h-6 bg-[#C67C4E] rounded-lg flex items-center justify-center text-white font-black text-[10px]">
              {member?.nama_lengkap?.[0]?.toUpperCase() || 'M'}
            </div>
            <div className="leading-tight">
              <p className="text-[11px] font-black text-[#2F2D2C] truncate max-w-[100px]">{member?.nama_lengkap}</p>
              <TierBadge tier={tier} />
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl border border-[#EFE6DC] bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors text-gray-400"
            title="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>
      </header>

      {/* ── Tab mobile ── */}
      <div className="sm:hidden flex gap-1 p-3 bg-white border-b border-[#EFE6DC]">
        {[
          { id: 'menu',    label: 'Pesan',   icon: Coffee      },
          { id: 'riwayat', label: 'Riwayat', icon: ReceiptText },
          { id: 'benefit', label: 'Benefit', icon: Gift        },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? 'bg-[#2F2D2C] text-white'
                  : 'text-gray-400 bg-[#FAF7F2]'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          CONTENT
      ══════════════════════════════════════════════════════════════ */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">

          {/* ────────────────────────── TAB: PESAN MENU ──────────────────── */}
          {activeTab === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* ── Katalog menu (kiri/atas) ── */}
              <div className="lg:col-span-8 flex flex-col gap-4">

                {/* Tier banner */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-4 flex items-center gap-4 border"
                  style={{ background: tier.bg, borderColor: `${tier.color}30` }}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${tier.color}18` }}>
                    <TierIcon size={20} style={{ color: tier.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-[#2F2D2C]">
                      Halo, <span style={{ color: tier.color }}>{member?.nama_lengkap}</span>!
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <TierBadge tier={tier} />
                      {discountPct > 0 && (
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                          Diskon {discountPct}% aktif ✓
                        </span>
                      )}
                    </div>
                  </div>
                  {nextTier && (
                    <div className="hidden sm:block text-right shrink-0">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Menuju {nextTier.label}
                      </p>
                      <div className="w-28 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full rounded-full"
                          style={{ background: tier.color }}
                        />
                      </div>
                      <p className="text-[9px] font-bold text-gray-400 mt-1">
                        {trxCount}/{nextTier.minTrx} transaksi
                      </p>
                    </div>
                  )}
                </motion.div>

                {/* Search + filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      type="text"
                      placeholder="Cari menu favoritmu…"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#EFE6DC] rounded-xl text-[12px] font-bold outline-none focus:border-[#C67C4E] transition-colors placeholder-gray-300 text-[#2F2D2C]"
                    />
                  </div>
                  {/* Tipe order */}
                  <div className="flex gap-2">
                    {['dine-in', 'take-away'].map(type => (
                      <button
                        key={type}
                        onClick={() => setOrderType(type)}
                        className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${
                          orderType === type
                            ? 'bg-[#2F2D2C] text-white border-[#2F2D2C]'
                            : 'bg-white text-gray-400 border-[#EFE6DC] hover:border-[#C67C4E]'
                        }`}
                      >
                        {type === 'dine-in' ? '🍽️ Dine In' : '🛍️ Take Away'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Kategori pills */}
                <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                  {CATEGORIES.map(c => (
                    <button
                      key={c}
                      onClick={() => setCat(c)}
                      className={`shrink-0 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all ${
                        cat === c
                          ? 'bg-[#C67C4E] text-white border-[#C67C4E]'
                          : 'bg-white text-gray-400 border-[#EFE6DC] hover:border-[#C67C4E]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                {/* Grid menu */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  <AnimatePresence mode="wait">
                    {filtered.map((item, i) => {
                      const inCart = cart.find(c => c.id === item.id);
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04, duration: 0.35 }}
                          whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(198,124,78,0.1)' }}
                          onClick={() => addToCart(item)}
                          className={`bg-white rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                            inCart
                              ? 'border-[#C67C4E] shadow-md shadow-[#C67C4E]/10'
                              : 'border-transparent hover:border-[#EFE6DC]'
                          }`}
                        >
                          {/* Foto penuh */}
                          <div className="w-full aspect-[4/3] overflow-hidden relative">
                            <motion.img
                              src={item.img}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              whileHover={{ scale: 1.07 }}
                              transition={{ duration: 0.35 }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                            {item.isBestSeller && (
                              <span className="absolute top-2 left-2 bg-[#C67C4E] text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Best Seller
                              </span>
                            )}
                            {inCart && (
                              <span className="absolute top-2 right-2 bg-[#2F2D2C] text-white text-[8px] font-black px-2 py-0.5 rounded-full">
                                ×{inCart.qty}
                              </span>
                            )}
                          </div>
                          {/* Info */}
                          <div className="p-2.5">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{item.category}</p>
                            <h4 className="text-[11px] font-black text-[#2F2D2C] leading-tight line-clamp-1">{item.name}</h4>
                            <div className="flex items-center justify-between mt-1.5">
                              <span className="text-[11px] font-black text-[#C67C4E]">{formatIDR(item.price)}</span>
                              <div className="w-5 h-5 bg-[#C67C4E] rounded-md flex items-center justify-center">
                                <Plus size={10} className="text-white" strokeWidth={3} />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {filtered.length === 0 && (
                  <div className="py-20 text-center text-gray-400 text-xs font-bold">
                    Menu tidak ditemukan ☕
                  </div>
                )}
              </div>

              {/* ── Keranjang (kanan) ── */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-2xl border border-[#EFE6DC] p-5 sticky top-24 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-[#2F2D2C]">
                      Keranjang ({cart.reduce((s,c) => s + c.qty, 0)})
                    </h3>
                    {cart.length > 0 && (
                      <button
                        onClick={() => setCart([])}
                        className="text-[9px] font-black text-red-400 hover:text-red-600 uppercase tracking-wider"
                      >
                        Hapus Semua
                      </button>
                    )}
                  </div>

                  {/* List cart */}
                  <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                    <AnimatePresence>
                      {cart.length === 0 ? (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="py-10 flex flex-col items-center gap-2 text-gray-400"
                        >
                          <ShoppingBag size={28} strokeWidth={1.5} />
                          <p className="text-[10px] font-black uppercase tracking-wider">Keranjang kosong</p>
                          <p className="text-[9px] text-center max-w-[140px] leading-relaxed">
                            Klik menu di sebelah kiri untuk menambahkan pesanan
                          </p>
                        </motion.div>
                      ) : cart.map(item => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -12, scale: 0.95 }}
                          className="flex items-center gap-2 bg-[#FAF7F2] rounded-xl p-2 border border-[#EFE6DC]"
                        >
                          <img src={item.img} alt={item.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black text-[#2F2D2C] truncate">{item.name}</p>
                            <p className="text-[9px] font-bold text-[#C67C4E]">{formatIDR(item.price)}</p>
                          </div>
                          <div className="flex items-center gap-1 bg-white rounded-lg p-0.5 border border-[#EFE6DC]">
                            <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-red-500">
                              <Minus size={10} strokeWidth={3} />
                            </button>
                            <span className="text-[10px] font-black w-4 text-center">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-[#C67C4E]">
                              <Plus size={10} strokeWidth={3} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Summary */}
                  {cart.length > 0 && (
                    <div className="border-t border-[#EFE6DC] pt-3 space-y-1.5 text-xs">
                      <div className="flex justify-between text-gray-400">
                        <span>Subtotal</span>
                        <span className="font-black text-[#2F2D2C]">{formatIDR(subtotal)}</span>
                      </div>
                      {discountPct > 0 && (
                        <div className="flex justify-between text-emerald-600">
                          <span className="font-bold">Diskon {tier.label} ({discountPct}%)</span>
                          <span className="font-black">-{formatIDR(subtotal - discounted)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[#2F2D2C] font-black text-sm pt-1">
                        <span>Total</span>
                        <span className="text-[#C67C4E]">{formatIDR(discounted)}</span>
                      </div>
                    </div>
                  )}

                  <motion.button
                    onClick={handleCheckout}
                    disabled={!cart.length}
                    whileHover={cart.length ? { scale: 1.02 } : {}}
                    whileTap={cart.length ? { scale: 0.97 } : {}}
                    className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-colors duration-300 flex items-center justify-center gap-2 ${
                      cart.length
                        ? 'bg-[#2F2D2C] hover:bg-[#C67C4E] text-white cursor-pointer'
                        : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingBag size={13} />
                    Pesan Sekarang
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ────────────────────────── TAB: RIWAYAT ─────────────────────── */}
          {activeTab === 'riwayat' && (
            <motion.div
              key="riwayat"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <div className="mb-6">
                <h2 className="text-xl font-black text-[#2F2D2C]">Riwayat Pesanan</h2>
                <p className="text-xs text-gray-400 font-bold mt-0.5">
                  {trxCount} transaksi total · Level aktif: <span style={{ color: tier.color }}>{tier.label}</span>
                </p>
              </div>

              {/* Progress ke tier berikutnya */}
              {nextTier && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-4 border mb-5"
                  style={{ background: tier.bg, borderColor: `${tier.color}30` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] font-black text-[#2F2D2C]">
                      Menuju <span style={{ color: nextTier.color || '#C67C4E' }}>{nextTier.label}</span>
                    </p>
                    <span className="text-[10px] font-black" style={{ color: tier.color }}>
                      {trxCount}/{nextTier.minTrx} transaksi
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full"
                      style={{ background: tier.color }}
                    />
                  </div>
                  <p className="text-[9px] text-gray-400 font-bold mt-1.5">
                    Butuh {nextTier.minTrx - trxCount} transaksi lagi untuk naik ke {nextTier.label}
                  </p>
                </motion.div>
              )}

              {/* Notifikasi naik tier */}
              {tier.key !== 'Member' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl p-4 border border-emerald-100 bg-emerald-50 mb-5 flex items-center gap-3"
                >
                  <Sparkles size={18} className="text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-[11px] font-black text-emerald-800">
                      Selamat! Kamu sudah jadi {tier.label} 🎉
                    </p>
                    <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
                      {tier.discount > 0 ? `Diskon ${tier.discount}% aktif di setiap pembelian.` : ''}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* List riwayat */}
              {history.length === 0 ? (
                <div className="py-24 text-center flex flex-col items-center gap-3">
                  <ReceiptText size={36} strokeWidth={1} className="text-gray-200" />
                  <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Belum ada pesanan</p>
                  <p className="text-[11px] text-gray-400 max-w-[200px] leading-relaxed">
                    Mulai pesan di tab "Pesan Menu" dan riwayatmu akan muncul di sini.
                  </p>
                  <button
                    onClick={() => setActiveTab('menu')}
                    className="mt-2 px-5 py-2.5 bg-[#2F2D2C] text-white text-[10px] font-black uppercase tracking-wider rounded-full"
                  >
                    Pesan Sekarang
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((order, i) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white rounded-2xl border border-[#EFE6DC] p-4"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <p className="text-[11px] font-black text-[#2F2D2C] font-mono">{order.id}</p>
                          <p className="text-[9px] text-gray-400 font-bold mt-0.5">{order.date} · {order.type}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-black text-[#C67C4E]">{formatIDR(order.total)}</p>
                          {order.discount > 0 && (
                            <p className="text-[9px] text-emerald-500 font-bold">Hemat {order.discount}%</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {order.items.map(item => (
                          <span key={item.id} className="text-[9px] font-bold bg-[#FAF7F2] border border-[#EFE6DC] text-gray-500 px-2 py-0.5 rounded-full">
                            {item.name} ×{item.qty}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2.5 pt-2.5 border-t border-[#EFE6DC] flex items-center justify-between">
                        <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          ✓ Selesai
                        </span>
                        <TierBadge tier={getTier(history.length - i)} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ────────────────────────── TAB: BENEFIT ─────────────────────── */}
          {activeTab === 'benefit' && (
            <motion.div
              key="benefit"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              <div className="mb-6">
                <h2 className="text-xl font-black text-[#2F2D2C]">Benefit Member</h2>
                <p className="text-xs text-gray-400 font-bold mt-0.5">Semakin sering mampir, makin banyak untungnya.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {TIERS.map((t, i) => {
                  const Icon = t.icon;
                  const isActive = t.key === tier.key;
                  const isUnlocked = TIERS.indexOf(t) <= TIERS.indexOf(tier);
                  return (
                    <motion.div
                      key={t.key}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className={`rounded-2xl p-5 border-2 relative overflow-hidden transition-all ${
                        isActive
                          ? 'shadow-lg'
                          : isUnlocked
                          ? 'opacity-90'
                          : 'opacity-50 grayscale'
                      }`}
                      style={{
                        background: t.bg,
                        borderColor: isActive ? t.color : `${t.color}30`,
                        boxShadow: isActive ? `0 12px 32px ${t.color}22` : undefined,
                      }}
                    >
                      {isActive && (
                        <span className="absolute top-3 right-3 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                          style={{ background: t.color }}>
                          Level Aktif
                        </span>
                      )}

                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                        style={{ background: `${t.color}18` }}>
                        <Icon size={20} style={{ color: t.color }} />
                      </div>

                      <h3 className="font-black text-[#2F2D2C] text-base mb-1">{t.label}</h3>
                      <p className="text-[10px] font-bold mb-4" style={{ color: t.color }}>
                        {t.minTrx === 0 ? 'Aktif sejak transaksi pertama' : `Minimal ${t.minTrx}× transaksi`}
                      </p>

                      {t.discount > 0 && (
                        <div className="text-2xl font-black mb-3" style={{ color: t.color }}>
                          {t.discount}%
                          <span className="text-xs font-bold text-gray-400 ml-1">diskon otomatis</span>
                        </div>
                      )}

                      <ul className="space-y-2">
                        {t.benefits.map((b, bi) => (
                          <li key={bi} className="flex items-start gap-2 text-[11px] text-[#2F2D2C] font-bold">
                            <CheckCircle2 size={13} className="shrink-0 mt-0.5" style={{ color: isUnlocked ? t.color : '#D1D5DB' }} />
                            {b}
                          </li>
                        ))}
                      </ul>

                      {!isUnlocked && (
                        <div className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                          🔒 Butuh {t.minTrx} transaksi
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA balik pesan */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 bg-[#2F2D2C] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <p className="font-black text-white text-base">Mau naik level lebih cepat?</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Kamu perlu {nextTier ? `${nextTier.minTrx - trxCount} transaksi lagi` : 'sudah di level tertinggi!'} untuk jadi {nextTier?.label || 'VIP 🎉'}.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('menu')}
                  className="shrink-0 flex items-center gap-2 bg-[#C67C4E] hover:bg-[#A05C32] text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded-full transition-colors"
                >
                  Pesan Sekarang <ArrowRight size={13} />
                </button>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
