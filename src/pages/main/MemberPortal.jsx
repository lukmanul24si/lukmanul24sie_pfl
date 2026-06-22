// src/pages/main/MemberPortal.jsx
// ✅ SUMBER DATA: AppContext (bukan Supabase langsung)
// ✅ SESI: { name, phone } dari loginMember() di AppContext
// ✅ TIER: Loyal = 10 trx / Rp250rb · VIP = 25 trx / Rp500rb
// ✅ DISKON: Loyal 10% · VIP 20%
// ✅ Cursor custom, sound, ripple, daun, biji kopi, Best Seller toggle

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  Coffee,
  Heart,
  Crown,
  Star,
  ShoppingBag,
  Plus,
  Minus,
  Search,
  CheckCircle2,
  LogOut,
  Gift,
  Sparkles,
  ArrowRight,
  ReceiptText,
  Flame,
  Send,
  MessageSquareText,
  ThumbsUp,
  Calendar,
  XCircle,
  Clock,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import {
  addReview,
  getAllReviews,
  subscribeReviews,
} from "../../utils/reviewsStore";

// ─── Asset imports ─────────────────────────────────────────────────────
import espressoImg from "../../assets/espresso.png";
import caramelImg from "../../assets/caramel_macchiato.png";
import palmSugarImg from "../../assets/palm_sugar_coffee.png";
import matchaImg from "../../assets/matcha_latte.png";
import chococreamylavaImg from "../../assets/chococreamy_lava.png";
import redvelvetImg from "../../assets/redvelvet.png";
import nasigorengImg from "../../assets/nasigoreng.jpg";
import sandwichImg from "../../assets/sandwich.jpg";
import spagetiImg from "../../assets/spageti.jpg";
import dimsumImg from "../../assets/dimsum.jpg";
import cirengImg from "../../assets/cire1.png";
import frenchImg from "../../assets/french.jpg";

// ─── Konstanta ─────────────────────────────────────────────────────────
const MENU_ITEMS = [
  {
    id: 101,
    category: "Coffee",
    name: "Espresso Bold",
    price: 25000,
    img: espressoImg,
    isBestSeller: true,
  },
  {
    id: 102,
    category: "Coffee",
    name: "Caramel Macchiato",
    price: 35000,
    img: caramelImg,
    isBestSeller: true,
  },
  {
    id: 103,
    category: "Coffee",
    name: "Palm Sugar Coffee",
    price: 28000,
    img: palmSugarImg,
    isBestSeller: false,
  },
  {
    id: 104,
    category: "Non-Coffee",
    name: "Matcha Latte Premium",
    price: 32000,
    img: matchaImg,
    isBestSeller: false,
  },
  {
    id: 105,
    category: "Non-Coffee",
    name: "Choco Creamy Lava",
    price: 30000,
    img: chococreamylavaImg,
    isBestSeller: true,
  },
  {
    id: 106,
    category: "Non-Coffee",
    name: "Red Velvet Cream",
    price: 30000,
    img: redvelvetImg,
    isBestSeller: false,
  },
  {
    id: 201,
    category: "Food",
    name: "Nasi Goreng Spesial",
    price: 25000,
    img: nasigorengImg,
    isBestSeller: true,
  },
  {
    id: 202,
    category: "Food",
    name: "Sandwich Smoked Beef",
    price: 27000,
    img: sandwichImg,
    isBestSeller: false,
  },
  {
    id: 203,
    category: "Food",
    name: "Spageti Aglio Olio",
    price: 28000,
    img: spagetiImg,
    isBestSeller: false,
  },
  {
    id: 204,
    category: "Snack",
    name: "Dimsum Ayam",
    price: 20000,
    img: dimsumImg,
    isBestSeller: false,
  },
  {
    id: 205,
    category: "Snack",
    name: "Cireng Bumbu Rujak",
    price: 15000,
    img: cirengImg,
    isBestSeller: false,
  },
  {
    id: 206,
    category: "Snack",
    name: "French Fries Crispy",
    price: 18000,
    img: frenchImg,
    isBestSeller: true,
  },
];

const CATEGORIES = ["All", "Coffee", "Non-Coffee", "Food", "Snack"];
const CAT_LABEL = {
  All: "Semua",
  Coffee: "Kopi",
  "Non-Coffee": "Non-Kopi",
  Food: "Makanan",
  Snack: "Cemilan",
};
const fmt = (n) => `Rp ${Number(n || 0).toLocaleString("id-ID")}`;

// ─── TIER CONFIG — sesuai gambar ───────────────────────────────────────
const TIERS = {
  Reguler: {
    key: "Reguler",
    label: "Reguler",
    icon: Coffee,
    color: "#9B9B9B",
    bg: "#F5F5F5",
    minTrx: 0,
    minSpend: 0,
    discount: 0,
    benefits: [
      "Kumpulkan poin dari setiap pembelian",
      "Akses riwayat pesanan personal",
      "Notifikasi promo khusus member",
    ],
  },
  Loyal: {
    key: "Loyal",
    label: "Loyal Member",
    icon: Heart,
    color: "#C67C4E",
    bg: "#FFF7F2",
    minTrx: 10,
    minSpend: 250000,
    discount: 10,
    benefits: [
      "Diskon otomatis 10% setiap belanja",
      "Prioritas pesanan di jam sibuk",
      "Akses menu seasonal lebih awal",
      "Semua benefit Reguler",
    ],
  },
  VIP: {
    key: "VIP",
    label: "VIP Member",
    icon: Crown,
    color: "#C9AA71",
    bg: "#FFFBF0",
    minTrx: 25,
    minSpend: 500000,
    discount: 20,
    benefits: [
      "Diskon otomatis 20% setiap belanja",
      "Akses pertama menu edisi terbatas",
      "Free 1 minuman setiap 25 transaksi",
      "Layanan prioritas & meja reserved",
      "Semua benefit Loyal Member",
    ],
  },
};
const TIER_ORDER = ["Reguler", "Loyal", "VIP"];

function computeTier(trxCount, totalSpend) {
  if (trxCount >= 25 || totalSpend >= 500000) return TIERS.VIP;
  if (trxCount >= 10 || totalSpend >= 250000) return TIERS.Loyal;
  return TIERS.Reguler;
}

function computeProgress(tier, trxCount, totalSpend) {
  const idx = TIER_ORDER.indexOf(tier.key);
  const nextKey = TIER_ORDER[idx + 1];
  if (!nextKey) return { nextTier: null, pct: 100, trxLeft: 0, spendLeft: 0 };
  const next = TIERS[nextKey];
  const trxPct =
    next.minTrx > 0 ? Math.min(100, (trxCount / next.minTrx) * 100) : 100;
  const spendPct =
    next.minSpend > 0 ? Math.min(100, (totalSpend / next.minSpend) * 100) : 100;
  return {
    nextTier: next,
    pct: Math.max(trxPct, spendPct),
    trxLeft: Math.max(0, next.minTrx - trxCount),
    spendLeft: Math.max(0, next.minSpend - totalSpend),
  };
}

// ─── AUDIO ENGINE ──────────────────────────────────────────────────────
let _actx = null;
const getACtx = () => {
  if (!_actx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) _actx = new AC();
  }
  if (_actx?.state === "suspended") _actx.resume();
  return _actx;
};
const sfx = (type) => {
  try {
    const ctx = getACtx();
    if (!ctx) return;
    const tone = (freq, vol, dur) => {
      const o = ctx.createOscillator(),
        g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.type = "sine";
      o.frequency.setValueAtTime(freq, ctx.currentTime);
      g.gain.setValueAtTime(vol, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      o.start(ctx.currentTime);
      o.stop(ctx.currentTime + dur);
    };
    if (type === "click") tone(580, 0.12, 0.06);
    if (type === "qty") tone(460, 0.08, 0.04);
    if (type === "checkout") {
      tone(1050, 0.15, 0.12);
      setTimeout(() => tone(1350, 0.1, 0.15), 60);
    }
  } catch {}
};

// ─── CURSOR CUSTOM ─────────────────────────────────────────────────────
function CustomCursor() {
  const [hover, setHover] = useState(false);
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const rx = useSpring(mx, { damping: 25, stiffness: 280, mass: 0.5 });
  const ry = useSpring(my, { damping: 25, stiffness: 280, mass: 0.5 });

  useEffect(() => {
    const onMove = (e) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setHover(!!e.target.closest("[data-ch]"));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-[#C67C4E] rounded-full pointer-events-none z-[9999] hidden md:block"
        style={{ x: mx, y: my, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-[#C67C4E]/50 pointer-events-none z-[9998] hidden md:block"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: hover ? 52 : 28,
          height: hover ? 52 : 28,
          backgroundColor: hover
            ? "rgba(198,124,78,0.1)"
            : "rgba(198,124,78,0)",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
    </>
  );
}

// ─── DEKORASI DAUN & BIJI KOPI ─────────────────────────────────────────
function AmbientDeco() {
  const leaves = [
    { t: "4%", l: "-4%", w: 170, rot: -18, col: "#6F8F5C", dur: 22, dl: 0 },
    { t: "22%", l: "92%", w: 130, rot: 22, col: "#8B5E34", dur: 18, dl: -6 },
    { t: "50%", l: "-3%", w: 150, rot: 8, col: "#6F8F5C", dur: 26, dl: -11 },
    { t: "72%", l: "91%", w: 190, rot: -12, col: "#8B5E34", dur: 20, dl: -4 },
    { t: "88%", l: "6%", w: 120, rot: 25, col: "#6F8F5C", dur: 24, dl: -8 },
  ];
  const beans = [
    { t: "8%", l: "9%", w: 30, rot: 25, col: "#8B5E34", dur: 16, dl: -5 },
    { t: "28%", l: "87%", w: 24, rot: -15, col: "#6F4E37", dur: 20, dl: -9 },
    { t: "55%", l: "14%", w: 28, rot: 40, col: "#8B5E34", dur: 18, dl: -3 },
    { t: "78%", l: "83%", w: 26, rot: -30, col: "#6F4E37", dur: 22, dl: -7 },
    { t: "10%", l: "52%", w: 20, rot: 15, col: "#8B5E34", dur: 14, dl: -1 },
    { t: "42%", l: "48%", w: 32, rot: -22, col: "#6F4E37", dur: 17, dl: -12 },
  ];
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
      aria-hidden
    >
      <style>{`
        @keyframes lf2{0%,100%{transform:var(--r) translateY(0) translateX(0)}40%{transform:var(--r) rotate(5deg) translateY(-6px) translateX(6px)}70%{transform:var(--r) rotate(-3deg) translateY(3px) translateX(-4px)}}
        @keyframes bf2{0%,100%{transform:var(--r) translateY(0)}50%{transform:var(--r) translateY(-9px) rotate(7deg)}}
        .lf2{animation:lf2 var(--d) ease-in-out infinite;animation-delay:var(--dl);will-change:transform}
        .bf2{animation:bf2 var(--d) ease-in-out infinite;animation-delay:var(--dl);will-change:transform}
      `}</style>
      {leaves.map((l, i) => (
        <div
          key={`l${i}`}
          className="lf2 absolute opacity-[0.055]"
          style={{
            top: l.t,
            left: l.l,
            color: l.col,
            "--r": `rotate(${l.rot}deg)`,
            "--d": `${l.dur}s`,
            "--dl": `${l.dl}s`,
          }}
        >
          <svg
            viewBox="0 0 100 140"
            style={{ width: l.w, height: l.w * 1.35 }}
            fill="currentColor"
          >
            <path d="M50 4C78 28 92 64 50 136C8 64 22 28 50 4Z" />
            <path
              d="M50 14V126"
              stroke="white"
              strokeOpacity=".2"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
      ))}
      {beans.map((b, i) => (
        <div
          key={`b${i}`}
          className="bf2 absolute opacity-[0.08]"
          style={{
            top: b.t,
            left: b.l,
            color: b.col,
            "--r": `rotate(${b.rot}deg)`,
            "--d": `${b.dur}s`,
            "--dl": `${b.dl}s`,
          }}
        >
          <svg
            viewBox="0 0 60 40"
            style={{ width: b.w, height: b.w * 0.67 }}
            fill="currentColor"
          >
            <ellipse cx="30" cy="20" rx="28" ry="18" />
            <path
              d="M30 4Q38 12 38 20Q38 28 30 36"
              stroke="rgba(255,255,255,.28)"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M30 4Q22 12 22 20Q22 28 30 36"
              stroke="rgba(255,255,255,.28)"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}

// ─── CLICK POP (+1 ☕) ──────────────────────────────────────────────────
function ClickPops({ pops }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[9990]">
      <AnimatePresence>
        {pops.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 0.5, x: p.x, y: p.y }}
            animate={{ opacity: 0, scale: 1, y: p.y - 40 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute font-black text-[#C67C4E] text-sm drop-shadow-md select-none"
            style={{ left: 0, top: 0 }}
          >
            +1 ☕
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── TIER BADGE ────────────────────────────────────────────────────────
function TierBadge({ tier, sm }) {
  const Icon = tier.icon;
  return (
    <span
      className={`inline-flex items-center rounded-full font-black uppercase tracking-wider ${sm ? "px-2 py-0.5 text-[9px] gap-1" : "px-3 py-1 text-[10px] gap-1.5"}`}
      style={{
        background: tier.bg,
        color: tier.color,
        border: `1.5px solid ${tier.color}35`,
      }}
    >
      <Icon size={sm ? 9 : 11} />
      {tier.label}
    </span>
  );
}

// ─── RECEIPT MODAL ─────────────────────────────────────────────────────
function ReceiptModal({ order, onClose }) {
  if (!order) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.86, y: 28 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 340, damping: 26 }}
        className="bg-white rounded-3xl p-7 w-full max-w-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-5">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 18,
              delay: 0.1,
            }}
            className="w-16 h-16 bg-[#C67C4E]/10 rounded-full flex items-center justify-center mx-auto mb-3"
          >
            <CheckCircle2 size={30} className="text-[#C67C4E]" />
          </motion.div>
          <h3 className="font-black text-[#2F2D2C] text-lg">
            Pesanan Masuk! ☕
          </h3>
          <p className="text-xs text-gray-400 font-bold mt-1">
            Sedang diproses kasir Bogeng
          </p>
        </div>

        <div className="bg-[#FAF7F2] rounded-2xl p-4 space-y-2 text-xs border border-[#EFE6DC] mb-4">
          {[
            ["ID Order", order.id, "font-mono"],
            ["Pelanggan", order.customer, "uppercase"],
            [
              "Tipe",
              order.type === "DINE-IN" ? "🍽️ Dine In" : "🛍️ Take Away",
              "text-[#C67C4E]",
            ],
          ].map(([k, v, cls]) => (
            <div key={k} className="flex justify-between text-gray-400">
              <span>{k}</span>
              <span className={`font-black text-[#2F2D2C] ${cls}`}>{v}</span>
            </div>
          ))}
          <div className="border-t border-[#EFE6DC] pt-2 mt-2 space-y-1">
            {order.items.map((it) => (
              <div key={it.id} className="flex justify-between text-[#2F2D2C]">
                <span className="font-bold">
                  {it.name} <span className="text-[#C67C4E]">×{it.qty}</span>
                </span>
                <span className="font-black">{fmt(it.price * it.qty)}</span>
              </div>
            ))}
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 text-[11px] mt-1">
              <span className="font-bold">Diskon {order.discount}%</span>
              <span className="font-black">
                -{fmt(order.subtotal - order.total)}
              </span>
            </div>
          )}
          <div className="border-t border-[#EFE6DC] pt-2 flex justify-between items-center mt-2">
            <span className="font-black text-[#2F2D2C] uppercase text-[11px]">
              Total
            </span>
            <span className="font-black text-[#C67C4E] text-base">
              {fmt(order.total)}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          data-ch
          className="w-full py-3.5 bg-[#2F2D2C] hover:bg-[#C67C4E] text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-colors duration-300 cursor-pointer"
        >
          Tutup & Lihat Riwayat
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── MAIN ──────────────────────────────────────────────────────────────
export default function MemberPortal() {
  const { menuList = [], orders = [], addOrder } = useApp();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("menu");
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [bestOnly, setBestOnly] = useState(false);
  const [orderType, setOrderType] = useState("dine-in");
  const [cart, setCart] = useState([]);
  const [receipt, setReceipt] = useState(null);
  const [pops, setPops] = useState([]);
  const popId = useRef(0);

  // Ulasan form state
  const [rvText, setRvText] = useState("");
  const [rvRating, setRvRating] = useState(5);
  const [rvHover, setRvHover] = useState(0);
  const [rvSent, setRvSent] = useState(false);

  // Ulasan diambil dari reviewsStore — sumber data yang sama dengan admin & landing page
  const [allReviews, setAllReviews] = useState([]);

  useEffect(() => {
    setAllReviews(getAllReviews());
    const unsub = subscribeReviews((list) => setAllReviews(list));
    return unsub;
  }, []);

  // ── Load sesi ──────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("bogeng_member_session");
    if (!saved) {
      navigate("/member-login");
      return;
    }
    try {
      const s = JSON.parse(saved);
      if (!s.name && s.username) s.name = s.username;
      setSession(s);
    } catch {
      navigate("/member-login");
      return;
    }
    setLoading(false);
  }, [navigate]);

  // ── Hitung data tier ────────────────────────────────────────────────
  const myOrders = session
    ? orders.filter(
        (o) => o.customer?.toLowerCase() === (session.name || "").toLowerCase(),
      )
    : [];
  const trxCount = myOrders.length;
  const totalSpend = myOrders.reduce((s, o) => s + (o.total || 0), 0);
  const tier = computeTier(trxCount, totalSpend);
  const {
    nextTier,
    pct: progress,
    trxLeft,
    spendLeft,
  } = computeProgress(tier, trxCount, totalSpend);
  const discPct = tier.discount;
  const TierIcon = tier.icon;

  // ── Menu list builder ───────────────────────────────────────────────
  const activeMenu = menuList.length > 0 ? menuList : MENU_ITEMS;

  const filtered = activeMenu.filter((it) => {
    const mc = cat === "All" || it.category === cat;
    const ms = it.name.toLowerCase().includes(search.toLowerCase());
    const mb = !bestOnly || it.isBestSeller;
    return mc && ms && mb;
  });

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discounted = Math.round(subtotal * (1 - discPct / 100));
  const cartQty = cart.reduce((s, i) => s + i.qty, 0);

  const spawnPop = (e) => {
    const id = ++popId.current;
    setPops((p) => [...p, { id, x: e?.clientX ?? 200, y: e?.clientY ?? 200 }]);
    setTimeout(() => setPops((p) => p.filter((r) => r.id !== id)), 480);
  };

  const addToCart = (item, e) => {
    sfx("click");
    spawnPop(e);
    setCart((prev) => {
      const ex = prev.find((c) => c.id === item.id);
      return ex
        ? prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c))
        : [...prev, { ...item, qty: 1 }];
    });
  };

  const updQty = (id, qty) => {
    sfx("qty");
    if (qty <= 0) {
      setCart((p) => p.filter((c) => c.id !== id));
      return;
    }
    setCart((p) => p.map((c) => (c.id === id ? { ...c, qty } : c)));
  };

  const handleCheckout = () => {
    if (!cart.length || !session) return;
    sfx("checkout");
    const order = {
      id: `MBR-${Date.now().toString().slice(-8)}`,
      customer: (session.name || "MEMBER").toUpperCase(),
      items: cart,
      total: discounted,
      subtotal,
      discount: discPct,
      status: "PROCESS",
      type: orderType === "dine-in" ? "DINE-IN" : "TAKE-AWAY",
      date: new Date().toLocaleDateString("id-ID"),
      tier: tier.label,
    };
    addOrder(order);
    setReceipt(order);
  };

  const closeReceipt = () => {
    setReceipt(null);
    setCart([]);
    setActiveTab("riwayat");
  };
  const logout = () => {
    localStorage.removeItem("bogeng_member_session");
    navigate("/member-login");
  };

  // ── Ulasan milik member ini, langsung dari reviewsStore ──
  const myReviews = React.useMemo(() => {
    if (!session) return [];
    const nameLower = (session.name || "").toLowerCase();
    return allReviews.filter(
      (r) =>
        (r.name || "").toLowerCase() === nameLower ||
        (session.phone && r.phone === session.phone),
    );
  }, [allReviews, session]);

  const submitReview = (e) => {
    e.preventDefault();
    if (!rvText.trim() || !session) return;

    // Simpan ke reviewsStore -> otomatis masuk ke admin (status: pending)
    addReview({
      name: session.name,
      phone: session.phone,
      rating: rvRating,
      text: rvText,
      tier: tier.label,
    });

    setRvText("");
    setRvRating(5);
    setRvSent(true);
    setTimeout(() => setRvSent(false), 4000);
  };

  if (loading || !session)
    return (
      <div className="min-h-screen bg-[#F9F2ED] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#EFE6DC] border-t-[#C67C4E] rounded-full animate-spin" />
          <p className="text-xs font-black text-[#C67C4E] uppercase tracking-widest">
            Memuat portal…
          </p>
        </div>
      </div>
    );

  const TABS = [
    { id: "menu", label: "Pesan Menu", icon: Coffee },
    { id: "riwayat", label: "Riwayat", icon: ReceiptText },
    { id: "ulasan", label: "Ulasan", icon: MessageSquareText },
    { id: "benefit", label: "Benefit", icon: Gift },
  ];

  return (
    <div className="relative min-h-screen bg-[#F9F2ED] p-3 sm:p-4 font-sans antialiased text-[#313131] selection:bg-[#C67C4E]/20">
      <CustomCursor />
      <AmbientDeco />
      <ClickPops pops={pops} />
      <AnimatePresence>
        {receipt && <ReceiptModal order={receipt} onClose={closeReceipt} />}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-[1440px] mx-auto">
        {/* ══ HEADER ══════════════════════════════════════════════════ */}
        <header className="flex items-center justify-between mb-4 select-none">
          <div className="flex items-center gap-3">
            <Link to="/" data-ch>
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                className="w-8 h-8 bg-[#C67C4E] rounded-lg flex items-center justify-center text-white font-black text-sm shadow-md shadow-[#C67C4E]/20"
              >
                B
              </motion.div>
            </Link>
            <div>
              <h2 className="text-[13px] font-black tracking-tight text-[#313131] flex items-center gap-1.5">
                <Coffee size={14} className="text-[#C67C4E]" strokeWidth={2.5} />
                Halo,{" "}
                <span className="text-[#C67C4E] underline decoration-wavy decoration-[#EDD6C8] underline-offset-4">
                  {(session.name || "Member").split(" ")[0]}
                </span>
                !
              </h2>
              <p className="text-[9px] text-[#9B9B9B] font-bold mt-0.5">
                Portal member eksklusif Bogeng Coffee
              </p>
            </div>
          </div>

          {/* Nav desktop */}
          <nav className="hidden sm:flex items-center gap-1 bg-white border border-[#E3E3E3] rounded-full p-1 shadow-sm">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  data-ch
                  onClick={() => {
                    sfx("qty");
                    setActiveTab(tab.id);
                  }}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                    activeTab === tab.id
                      ? "bg-[#C67C4E] text-white shadow-sm"
                      : "text-[#9B9B9B] hover:text-[#313131]"
                  }`}
                >
                  <Icon size={11} />
                  {tab.label}
                  {tab.id === "menu" && cartQty > 0 && (
                    <span className="bg-[#313131] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                      {cartQty}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Profil */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 bg-white border border-[#E3E3E3] rounded-xl px-3 py-1.5 shadow-sm">
              <div className="w-6 h-6 bg-[#C67C4E] rounded-md flex items-center justify-center text-white font-black text-[10px] shadow-sm">
                {(session.name || "M")[0].toUpperCase()}
              </div>
              <div className="leading-none">
                <p className="text-[11px] font-black text-[#313131] truncate max-w-[90px]">
                  {session.name}
                </p>
                <TierBadge tier={tier} sm />
              </div>
            </div>
            <motion.button
              onClick={logout}
              data-ch
              whileHover={{ x: 2 }}
              className="p-2 rounded-xl border border-[#E3E3E3] bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-400 transition-colors text-gray-400 cursor-pointer shadow-sm"
            >
              <LogOut size={14} />
            </motion.button>
          </div>
        </header>

        {/* Tab mobile */}
        <div className="sm:hidden grid grid-cols-4 gap-1.5 mb-4">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                data-ch
                onClick={() => {
                  sfx("qty");
                  setActiveTab(tab.id);
                }}
                className={`flex flex-col items-center gap-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${
                  activeTab === tab.id
                    ? "bg-[#C67C4E] text-white shadow-sm"
                    : "text-[#9B9B9B] bg-white border border-[#E3E3E3]"
                }`}
              >
                <Icon size={13} />
                {tab.label.split(" ")[0]}
              </button>
            );
          })}
        </div>

        {/* ══ CONTENT MAIN ══════════════════════════════════════════════════ */}
        <AnimatePresence mode="wait">
          {/* ── TAB: PESAN MENU ── */}
          {activeTab === "menu" && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-12 gap-4 h-[calc(100vh-7rem)] min-h-[520px]"
            >
              {/* LEFT: katalog */}
              <div className="col-span-12 lg:col-span-9 bg-white rounded-xl border border-[#E3E3E3] shadow-sm p-4 flex flex-col h-full overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl p-3 flex items-center gap-3 mb-3 shrink-0"
                  style={{
                    background: tier.bg,
                    border: `1px solid ${tier.color}30`,
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${tier.color}18` }}
                  >
                    <TierIcon size={18} style={{ color: tier.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <TierBadge tier={tier} sm />
                      {discPct > 0 && (
                        <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                          Diskon {discPct}% aktif ✓
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] text-gray-400 font-bold mt-0.5">
                      {trxCount} transaksi · {fmt(totalSpend)} belanja
                    </p>
                  </div>
                  {nextTier && (
                    <div className="hidden sm:block text-right shrink-0">
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        → {nextTier.label}
                      </p>
                      <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{
                            duration: 0.8,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="h-full rounded-full"
                          style={{ background: tier.color }}
                        />
                      </div>
                      <p className="text-[8px] font-bold text-gray-400 mt-0.5">
                        {trxLeft} trx / {fmt(spendLeft)}
                      </p>
                    </div>
                  )}
                </motion.div>

                <div className="relative mb-3 shrink-0">
                  <Search
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9B9B]"
                    strokeWidth={2.5}
                  />
                  <input
                    type="text"
                    placeholder="Cari menu favoritmu…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#FBF8F6] border border-[#E3E3E3] rounded-xl pl-8 pr-4 py-2 text-[11px] font-medium focus:outline-none focus:border-[#C67C4E] focus:bg-white transition-all placeholder:text-[#B0B0B0]"
                  />
                </div>

                <div className="flex items-center justify-between gap-2 mb-3 shrink-0 flex-wrap">
                  <div className="flex gap-1 overflow-x-auto pb-0.5">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c}
                        data-ch
                        onClick={() => {
                          sfx("qty");
                          setCat(c);
                        }}
                        className={`shrink-0 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wide border transition-all ${
                          cat === c
                            ? "bg-[#C67C4E] text-white border-[#C67C4E]"
                            : "bg-[#FBF8F6] text-gray-400 border-[#E3E3E3] hover:border-[#C67C4E]"
                        }`}
                      >
                        {CAT_LABEL[c] || c}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex bg-[#FBF8F6] border border-[#E3E3E3] rounded-xl p-0.5 gap-0.5">
                      {[
                        { v: "dine-in", l: "🍽️ Dine In" },
                        { v: "take-away", l: "🛍️ Take Away" },
                      ].map(({ v, l }) => (
                        <button
                          key={v}
                          data-ch
                          onClick={() => {
                            sfx("qty");
                            setOrderType(v);
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wide transition-all ${
                            orderType === v
                              ? "bg-[#313131] text-white shadow-sm"
                              : "text-gray-400 hover:text-[#313131]"
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                    <motion.button
                      data-ch
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        sfx("qty");
                        setBestOnly((v) => !v);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wide border transition-all ${
                        bestOnly
                          ? "bg-amber-400 text-white border-amber-400 shadow-sm"
                          : "bg-[#FBF8F6] text-gray-400 border-[#E3E3E3] hover:border-amber-300"
                      }`}
                    >
                      <Flame
                        size={11}
                        className={bestOnly ? "fill-white" : ""}
                      />{" "}
                      Best Seller
                    </motion.button>
                  </div>
                </div>

                <div
                  className="flex-1 overflow-y-auto pr-1"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#EFE6DC transparent",
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={cat + search + String(bestOnly)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pb-3"
                    >
                      {filtered.map((item, i) => {
                        const inCart = cart.find((c) => c.id === item.id);
                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.025, duration: 0.25 }}
                            whileHover={{
                              y: -5,
                              boxShadow: "0 14px 28px rgba(198,124,78,0.12)",
                            }}
                            whileTap={{ scale: 0.96 }}
                            data-ch
                            onClick={(e) => addToCart(item, e)}
                            className={`relative bg-white rounded-xl border-[1.5px] overflow-hidden cursor-pointer transition-colors ${
                              inCart
                                ? "border-[#C67C4E] shadow-sm shadow-[#C67C4E]/10"
                                : "border-transparent hover:border-[#EFE6DC]"
                            }`}
                          >
                            <div className="w-full aspect-[4/3] overflow-hidden relative">
                              <motion.img
                                src={item.img}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                whileHover={{ scale: 1.08 }}
                                transition={{ duration: 0.3 }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-transparent" />
                              {item.isBestSeller && (
                                <span className="absolute top-1.5 left-1.5 bg-[#C67C4E] text-white text-[7px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5 uppercase tracking-wider">
                                  <Flame size={7} className="fill-white" /> Best
                                </span>
                              )}
                              {inCart && (
                                <motion.span
                                  key={inCart.qty}
                                  initial={{ scale: 0.5 }}
                                  animate={{ scale: 1 }}
                                  className="absolute top-1.5 right-1.5 bg-[#2F2D2C] text-white text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center"
                                >
                                  {inCart.qty}
                                </motion.span>
                              )}
                            </div>
                            <div className="p-2.5">
                              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                                {CAT_LABEL[item.category] || item.category}
                              </p>
                              <h4
                                className={`text-[11px] font-black leading-tight line-clamp-1 ${inCart ? "text-[#C67C4E]" : "text-[#2F2D2C]"}`}
                              >
                                {item.name}
                              </h4>
                              <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-[#F5F0EB]">
                                <span className="text-[11px] font-black text-[#2F2D2C]">
                                  {fmt(item.price)}
                                </span>
                                <motion.div
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.85 }}
                                  className="w-5 h-5 rounded-md bg-[#C67C4E] flex items-center justify-center shadow-sm"
                                >
                                  <Plus
                                    size={10}
                                    className="text-white"
                                    strokeWidth={3}
                                  />
                                </motion.div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* RIGHT: keranjang desktop */}
              <div className="hidden lg:flex col-span-3 flex-col h-full">
                <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm p-4 flex flex-col h-full overflow-hidden">
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#F5F0EB] shrink-0">
                    <h3 className="text-[10px] font-black tracking-wider uppercase text-[#313131]">
                      Pesanan ({cartQty})
                    </h3>
                    {cart.length > 0 && (
                      <button
                        data-ch
                        onClick={() => {
                          sfx("qty");
                          setCart([]);
                        }}
                        className="text-[9px] font-black text-red-400 hover:text-red-600 uppercase tracking-wide cursor-pointer"
                      >
                        Hapus Semua
                      </button>
                    )}
                  </div>

                  <div
                    className="flex-1 overflow-y-auto my-3 space-y-2 pr-0.5"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "#EFE6DC transparent",
                    }}
                  >
                    <AnimatePresence>
                      {cart.length === 0 ? (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="h-full flex flex-col items-center justify-center gap-2 text-[#9B9B9B] py-10"
                        >
                          <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 2.5,
                              ease: "easeInOut",
                            }}
                            className="w-12 h-12 bg-[#FBF8F6] rounded-full flex items-center justify-center text-[#C67C4E] border border-[#E3E3E3] shadow-inner"
                          >
                            <ShoppingBag size={20} strokeWidth={1.5} />
                          </motion.div>
                          <p className="text-[9px] font-black uppercase tracking-wider text-[#313131]/60">
                            Keranjang Kosong
                          </p>
                        </motion.div>
                      ) : (
                        cart.map((item) => (
                          <motion.div
                            key={item.id}
                            className="bg-[#FBF8F6] p-2 rounded-xl border border-[#E3E3E3] flex items-center gap-2"
                          >
                            <img
                              src={item.img}
                              alt={item.name}
                              className="w-9 h-9 rounded-lg object-cover shrink-0"
                            />
                            <div className="flex-1 min-w-0 leading-tight">
                              <p className="text-[10px] font-black text-[#313131] truncate">
                                {item.name}
                              </p>
                              <p className="text-[9px] font-bold text-[#C67C4E]">
                                {fmt(item.price)}
                              </p>
                            </div>
                            <div className="flex items-center gap-0.5 bg-white border border-[#E3E3E3] rounded-lg p-0.5">
                              <button
                                data-ch
                                onClick={() => updQty(item.id, item.qty - 1)}
                                className="w-5 h-5 rounded flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-400"
                              >
                                <Minus size={9} strokeWidth={3} />
                              </button>
                              <span className="text-[9px] font-black w-4 text-center">
                                {item.qty}
                              </span>
                              <button
                                data-ch
                                onClick={() => updQty(item.id, item.qty + 1)}
                                className="w-5 h-5 rounded flex items-center justify-center text-gray-400 hover:bg-[#C67C4E]/10 hover:text-[#C67C4E]"
                              >
                                <Plus size={9} strokeWidth={3} />
                              </button>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="pt-3 border-t border-[#E3E3E3]/60 space-y-2 shrink-0">
                    {cart.length > 0 && (
                      <div className="space-y-1 text-[11px]">
                        <div className="flex justify-between text-[#9B9B9B]">
                          <span>Subtotal</span>
                          <span className="font-bold">{fmt(subtotal)}</span>
                        </div>
                        {discPct > 0 && (
                          <div className="flex justify-between text-emerald-600 text-[10px]">
                            <span className="font-bold">
                              Diskon {tier.label} ({discPct}%)
                            </span>
                            <span className="font-black">
                              -{fmt(subtotal - discounted)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center pt-1 text-[#313131]">
                          <span className="font-black text-[10px] uppercase tracking-wider">
                            Total Bayar
                          </span>
                          <span className="font-black text-sm text-[#C67C4E]">
                            {fmt(discounted)}
                          </span>
                        </div>
                      </div>
                    )}
                    <motion.button
                      data-ch
                      onClick={handleCheckout}
                      disabled={!cart.length}
                      className={`w-full font-black text-[10px] tracking-widest uppercase py-2.5 rounded-xl transition-all ${
                        cart.length
                          ? "bg-[#313131] hover:bg-[#C67C4E] text-white cursor-pointer"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {orderType === "dine-in" ? "🍽️" : "🛍️"} Pesan Sekarang
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── TAB: RIWAYAT PESANAN ── */}
          {activeTab === "riwayat" && (
            <motion.div
              key="riwayat"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="max-w-2xl mx-auto w-full"
            >
              <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm p-5 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-base font-black text-[#313131]">
                      Riwayat Pesanan
                    </h2>
                    <p className="text-[10px] text-[#9B9B9B] font-bold mt-0.5">
                      {trxCount} transaksi ·{" "}
                      <span style={{ color: tier.color }}>{tier.label}</span>
                    </p>
                  </div>
                  <TierBadge tier={tier} />
                </div>
                {nextTier && (
                  <>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-[10px] font-bold text-gray-400">
                        Menuju{" "}
                        <span style={{ color: nextTier.color }}>
                          {nextTier.label}
                        </span>
                      </p>
                      <p
                        className="text-[10px] font-black"
                        style={{ color: tier.color }}
                      >
                        {Math.round(progress)}%
                      </p>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full rounded-full"
                        style={{ background: tier.color }}
                      />
                    </div>
                    <p className="text-[9px] text-gray-400 font-bold">
                      Butuh {trxLeft} transaksi lagi atau {fmt(spendLeft)}{" "}
                      belanja lagi
                    </p>
                  </>
                )}
              </div>

              {myOrders.length === 0 ? (
                <div className="bg-white rounded-xl border border-[#E3E3E3] p-16 text-center flex flex-col items-center gap-3">
                  <ReceiptText
                    size={36}
                    strokeWidth={1}
                    className="text-gray-200"
                  />
                  <p className="text-xs font-black text-gray-400 uppercase tracking-wider">
                    Belum ada pesanan
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myOrders.map((order, i) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="bg-white rounded-xl border border-[#E3E3E3] p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <div>
                          <p className="text-[11px] font-black text-[#313131] font-mono">
                            {order.id}
                          </p>
                          <p className="text-[9px] text-[#9B9B9B] font-bold mt-0.5">
                            {order.date} · {order.type}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-black text-[#C67C4E]">
                            {fmt(order.total)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {(order.items || []).map((it) => (
                          <span
                            key={it.id}
                            className="text-[9px] font-bold bg-[#FAF7F2] border border-[#EFE6DC] text-gray-400 px-2 py-0.5 rounded-full"
                          >
                            {it.name} ×{it.qty}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── TAB: ULASAN (MODERNISED RATING SYSTEM) ── */}
          {activeTab === "ulasan" && (
            <motion.div
              key="ulasan"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="max-w-2xl mx-auto w-full pb-10"
            >
              <div className="mb-5 select-none">
                <h2 className="text-lg font-bold text-[#313131] flex items-center gap-2">
                  <Sparkles size={16} className="text-[#C67C4E]" /> Bagikan
                  Pengalamanmu
                </h2>
                <p className="text-xs text-[#9B9B9B] font-medium mt-0.5">
                  Pendapatmu sangat berharga bagi kualitas racikan kopi kami.
                </p>
              </div>

              {/* Form Tulis Ulasan */}
              <form
                onSubmit={submitReview}
                className="bg-white rounded-3xl border border-[#EFE6DC] p-6 mb-6 shadow-md relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C67C4E] to-[#E9AD86]" />

                {/* Interaktif Rating */}
                <div className="flex flex-col items-center justify-center py-4 bg-[#FBF8F6] rounded-2xl border border-[#F0E6DD] mb-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#9B9B9B] mb-2">
                    Pilih Rating Bintang
                  </p>

                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((n) => {
                      const isActive = (rvHover || rvRating) >= n;
                      return (
                        <button
                          type="button"
                          key={n}
                          data-ch
                          onMouseEnter={() => setRvHover(n)}
                          onMouseLeave={() => setRvHover(0)}
                          onClick={() => {
                            sfx("click");
                            setRvRating(n);
                          }}
                          className="relative p-1 focus:outline-none group"
                        >
                          <motion.div
                            animate={{ scale: rvHover === n ? 1.25 : 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 10,
                            }}
                          >
                            <Star
                              size={32}
                              className={`transition-all duration-200 ${
                                isActive
                                  ? "text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.4)]"
                                  : "text-gray-200 hover:text-gray-300"
                              }`}
                              fill={isActive ? "currentColor" : "none"}
                              strokeWidth={isActive ? 1.5 : 1.2}
                            />
                          </motion.div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Teks Status Berdasarkan Bintang */}
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={rvHover || rvRating}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-[11px] font-bold text-[#C67C4E] mt-2.5 uppercase tracking-wide"
                    >
                      {(rvHover || rvRating) === 5
                        ? "Sempurna Banget"
                        : (rvHover || rvRating) === 4
                          ? "Enak & Nyaman"
                          : (rvHover || rvRating) === 3
                            ? "Cukup Oke"
                            : (rvHover || rvRating) === 2
                              ? "Butuh Peningkatan"
                              : "Kurang Puas"}
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* Input Teks */}
                <div className="relative">
                  <textarea
                    value={rvText}
                    onChange={(e) => setRvText(e.target.value)}
                    required
                    rows={3}
                    placeholder="Tulis kritik, saran, atau pujian tentang rasa kopi dan pelayanan di Bogeng..."
                    className="w-full bg-[#FAF7F2] border border-[#EFE6DC] rounded-xl px-4 py-3.5 text-xs font-bold outline-none focus:border-[#C67C4E] focus:bg-white transition-all text-[#313131] placeholder:text-gray-300 resize-none shadow-inner leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  data-ch
                  className="w-full mt-3 flex items-center justify-center gap-2 bg-[#2F2D2C] hover:bg-[#C67C4E] text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all duration-300 cursor-pointer shadow-md"
                >
                  <Send size={13} /> Kirim Ulasan Personal
                </button>

                <AnimatePresence>
                  {rvSent && (
                    <motion.div
                      initial={{ opacity: 0, h: 0 }}
                      animate={{ opacity: 1, h: "auto" }}
                      exit={{ opacity: 0 }}
                      className="text-center bg-emerald-50 border border-emerald-100 rounded-xl p-2.5 mt-3 flex items-center justify-center gap-2"
                    >
                      <Sparkles
                        size={13}
                        className="text-emerald-600 animate-spin"
                      />
                      <p className="text-[11px] font-bold text-emerald-700">
                        Ulasan terkirim! Muncul otomatis di riwayat bawah.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

              {/* Riwayat Ulasan Saya — tampilan tabel, ringan & simpel */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#F0E6DD]">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#9B9B9B] flex items-center gap-1.5">
                    <ReceiptText size={12} /> Riwayat Ulasan Saya (
                    {myReviews.length})
                  </h3>
                  <span className="text-[9px] font-medium text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
                    Sesi Aktif
                  </span>
                </div>

                {myReviews.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white/60 border border-dashed border-[#EFE6DC] rounded-2xl py-12 text-center flex flex-col items-center justify-center p-4"
                  >
                    <MessageSquareText
                      size={28}
                      strokeWidth={1}
                      className="text-gray-300 mb-2"
                    />
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      Belum Ada Ulasan
                    </p>
                    <p className="text-[10px] text-gray-400 max-w-xs mt-1 leading-relaxed">
                      Suaramu penting buat kami. Yuk isi form di atas untuk
                      membuat ulasan pertamamu!
                    </p>
                  </motion.div>
                ) : (
                  <div className="bg-white rounded-xl border border-[#EFE6DC] overflow-hidden">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="bg-[#FAF7F2] text-[9px] font-semibold text-gray-400 uppercase tracking-wider">
                          <th className="px-3 py-2 w-20">Rating</th>
                          <th className="px-3 py-2">Ulasan</th>
                          <th className="px-3 py-2 w-28">Status</th>
                          <th className="px-3 py-2 w-20">Tanggal</th>
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence initial={false}>
                          {myReviews.map((rev) => {
                            const status = rev.status || "pending";
                            const statusMeta =
                              status === "approved"
                                ? {
                                    label: "Tayang",
                                    icon: CheckCircle2,
                                    cls: "text-emerald-600",
                                  }
                                : status === "rejected"
                                  ? {
                                      label: "Ditolak",
                                      icon: XCircle,
                                      cls: "text-red-500",
                                    }
                                  : {
                                      label: "Menunggu",
                                      icon: Clock,
                                      cls: "text-amber-600",
                                    };
                            const StatusIcon = statusMeta.icon;
                            return (
                              <motion.tr
                                key={rev.id || `${rev.text}-${rev.rating}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="border-t border-[#F2ECE4] align-top"
                              >
                                <td className="px-3 py-2.5">
                                  <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((n) => (
                                      <Star
                                        key={n}
                                        size={10}
                                        className={
                                          n <= rev.rating
                                            ? "text-amber-400"
                                            : "text-gray-200"
                                        }
                                        fill={
                                          n <= rev.rating
                                            ? "currentColor"
                                            : "none"
                                        }
                                      />
                                    ))}
                                  </div>
                                </td>
                                <td className="px-3 py-2.5 text-[11px] text-[#313131] font-normal leading-relaxed">
                                  {rev.text}
                                  <div className="text-[9px] text-gray-400 font-medium mt-1">
                                    Level {rev.tier || tier.label}
                                  </div>
                                </td>
                                <td className="px-3 py-2.5">
                                  <span
                                    className={`inline-flex items-center gap-1 text-[10px] font-medium ${statusMeta.cls}`}
                                  >
                                    <StatusIcon size={11} />
                                    {statusMeta.label}
                                  </span>
                                </td>
                                <td className="px-3 py-2.5 text-[10px] text-gray-400 whitespace-nowrap">
                                  {rev.date ||
                                    (rev.createdAt
                                      ? new Date(
                                          rev.createdAt,
                                        ).toLocaleDateString("id-ID")
                                      : new Date().toLocaleDateString(
                                          "id-ID",
                                        ))}
                                </td>
                              </motion.tr>
                            );
                          })}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── TAB: BENEFIT (PREMIUM CARD MEMBERSHIP VIEW) ── */}
          {activeTab === "benefit" && (
            <motion.div
              key="benefit"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <div className="bg-gradient-to-br from-[#2F2D2C] to-[#443E3C] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute right-0 bottom-0 top-0 opacity-10 pointer-events-none w-1/3 flex items-center justify-center">
                  <Sparkles size={160} />
                </div>
                <div className="relative z-10 max-w-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="p-1.5 bg-white/10 rounded-xl">
                      <Sparkles size={14} className="text-[#C67C4E]" />
                    </span>
                    <h3 className="font-black text-sm uppercase tracking-widest text-[#EDD6C8]">
                      Loyalty Club & Privilese
                    </h3>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                    Status Privilege Member Bogeng Coffee
                  </h2>
                  <p className="text-xs text-gray-300 font-medium mt-2 leading-relaxed">
                    Sistem loyalty mendeteksi akumulasi transaksi secara
                    realtime. Naikkan level tier untuk melipatgandakan
                    keuntungan diskon produk.
                  </p>
                </div>
              </div>

              {/* Status Bar Track Progress */}
              <div className="bg-white rounded-3xl p-5 border shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#EFE6DC] flex items-center justify-center text-[#C67C4E]">
                      <Coffee size={18} />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-wider">
                        Level Kamu Saat Ini
                      </h4>
                      <p className="text-base font-black text-[#2F2D2C] flex items-center gap-1.5 mt-0.5">
                        {tier.label} <TierBadge tier={tier} sm />
                      </p>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-[#FAF7F2] px-3 py-1 border rounded-full text-gray-500">
                      {trxCount} Total Transaksi · {fmt(totalSpend)}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden relative mt-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#C67C4E] to-[#C9AA71]"
                  />
                </div>

                <div className="flex justify-between items-center mt-2.5 text-[10px] text-gray-400 font-bold">
                  <span>Reguler</span>
                  <span>Loyal (10 Trx)</span>
                  <span>VIP (25 Trx)</span>
                </div>
              </div>

              {/* Grid 3 Tiers detail */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.values(TIERS).map((t) => {
                  const Icon = t.icon;
                  const isCurrent = tier.key === t.key;
                  return (
                    <motion.div
                      key={t.key}
                      className={`bg-white rounded-3xl p-5 border flex flex-col justify-between transition-all relative overflow-hidden ${isCurrent ? "ring-2 ring-[#C67C4E] shadow-md" : "shadow-sm opacity-90"}`}
                    >
                      {isCurrent && (
                        <span className="absolute top-0 right-0 bg-[#C67C4E] text-white font-black text-[7px] uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-sm z-10">
                          Status Kamu
                        </span>
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{ background: t.bg, color: t.color }}
                          >
                            <Icon size={14} />
                          </div>
                          <h4 className="font-black text-[#2F2D2C] text-sm tracking-tight">
                            {t.label}
                          </h4>
                        </div>
                        <div className="text-[10px] font-black text-[#C67C4E] uppercase tracking-wider bg-[#FAF7F2] px-2.5 py-1 rounded-xl w-fit mb-4">
                          Diskon {t.discount}% OFF
                        </div>
                        <ul className="space-y-2">
                          {t.benefits.map((b, i) => (
                            <li
                              key={i}
                              className="text-[11px] text-gray-500 font-medium flex items-start gap-1.5 leading-relaxed"
                            >
                              <span className="text-[#C67C4E] font-bold mt-0.5">
                                ✓
                              </span>
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {!isCurrent && t.minTrx > 0 && (
                        <div className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                          🔒 Butuh {t.minTrx} transaksi atau {fmt(t.minSpend)}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom CTA Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-6 bg-[#313131] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-black/5 relative overflow-hidden"
              >
                <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none w-1/3 flex items-center justify-center">
                  <Crown
                    size={120}
                    className="text-white transform translate-x-10 translate-y-4 rotate-12"
                  />
                </div>
                <div className="relative z-10">
                  <p className="font-black text-white text-base">
                    Ingin Meningkatkan Privilese?
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">
                    {nextTier
                      ? `Kurang ${trxLeft} transaksi atau belanjakan ${fmt(spendLeft)} lagi untuk otomatis naik ke ${nextTier.label}.`
                      : "Luar biasa! Kamu sudah berada di puncak keuntungan tertinggi Bogeng. 🥳"}
                  </p>
                </div>
                <button
                  data-ch
                  onClick={() => setActiveTab("menu")}
                  className="shrink-0 relative z-10 flex items-center gap-2 bg-[#C67C4E] hover:bg-[#A05C32] text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all cursor-pointer shadow-md shadow-[#C67C4E]/20"
                >
                  Belanja Menu <ArrowRight size={13} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
