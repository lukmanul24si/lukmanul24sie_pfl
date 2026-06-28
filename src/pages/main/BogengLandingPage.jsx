// src/pages/main/BogengLandingPage.jsx
// =====================================================================
// CHANGELOG v3:
//   - Hero lama (FloatingMenu + HeroBgAnimation) diganti <ScrollMorphHero/>
//   - FollowCursor lama dihapus (sudah ada di dalam ScrollMorphHero)
//   - FLOAT_CONFIGS, FloatingMenuItem, FloatingMenu, HeroBgAnimation,
//     FEATURED_ITEMS dihapus karena tak lagi dipakai
// =====================================================================
import logoImg from "../../assets/logo.png";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coffee,
  Heart,
  Crown,
  Star,
  Send,
  MessageCircle,
  MapPin,
  Clock,
  Phone,
  ChevronDown,
  ArrowUp,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  addReview,
  getApprovedReviews,
  subscribeReviews,
} from "../../utils/reviewsStore";

// ── HERO BARU ────────────────────────────────────────────────────────
import ScrollMorphHero from "../../components/ui/ScrollMorphHero";

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

const WHATSAPP_NUMBER = "6281234567890";

const MENU_ITEMS = [
  {
    id: 101,
    category: "Kopi",
    name: "Espresso Bold",
    price: 25000,
    desc: "Ekstrak kopi murni dengan tekanan tinggi, pahit-pekat buat yang butuh suntikan energi cepat.",
    img: espressoImg,
    featured: true,
  },
  {
    id: 102,
    category: "Kopi",
    name: "Caramel Macchiato",
    price: 35000,
    desc: "Espresso, susu creamy, dan sirup karamel emas — manis pas tanpa bikin enek.",
    img: caramelImg,
    featured: true,
  },
  {
    id: 103,
    category: "Kopi",
    name: "Palm Sugar Coffee",
    price: 28000,
    desc: "Kopi susu khas Bogeng dengan manis legit gula aren asli, favorit pelanggan setia.",
    img: palmSugarImg,
    featured: true,
  },
  {
    id: 104,
    category: "Non-Kopi",
    name: "Matcha Latte Premium",
    price: 32000,
    desc: "Bubuk matcha kualitas perkebunan Uji dipadu susu segar, cocok buat yang gak minum kopi.",
    img: matchaImg,
    featured: true,
  },
  {
    id: 105,
    category: "Non-Kopi",
    name: "Choco Creamy Lava",
    price: 30000,
    desc: "Cokelat lumer pekat dengan foam susu tebal di atasnya, manis dan memanjakan lidah.",
    img: chococreamylavaImg,
    featured: true,
  },
  {
    id: 106,
    category: "Non-Kopi",
    name: "Red Velvet Cream",
    price: 30000,
    desc: "Red velvet creamy dengan cream cheese lembut, manis seimbang gak berlebihan.",
    img: redvelvetImg,
    featured: true,
  },
  {
    id: 201,
    category: "Makanan",
    name: "Nasi Goreng Spesial",
    price: 25000,
    desc: "Nasi goreng rumahan dengan telur, ayam suwir, dan kerupuk renyah.",
    img: nasigorengImg,
  },
  {
    id: 202,
    category: "Makanan",
    name: "Sandwich Smoked Beef",
    price: 27000,
    desc: "Roti gandum lapis smoked beef, telur, dan saus mustard madu.",
    img: sandwichImg,
  },
  {
    id: 203,
    category: "Makanan",
    name: "Spageti Aglio Olio",
    price: 28000,
    desc: "Spageti aglio olio dengan bawang putih sangrai dan taburan parmesan.",
    img: spagetiImg,
  },
  {
    id: 204,
    category: "Cemilan",
    name: "Dimsum Ayam",
    price: 20000,
    desc: "Dimsum ayam kukus lembut, disajikan dengan saus sambal rumahan.",
    img: dimsumImg,
  },
  {
    id: 205,
    category: "Cemilan",
    name: "Cireng Bumbu Rujak",
    price: 15000,
    desc: "Cireng renyah dengan bumbu rujak pedas-manis ala Riau.",
    img: cirengImg,
  },
  {
    id: 206,
    category: "Cemilan",
    name: "French Fries Crispy",
    price: 18000,
    desc: "Kentang goreng renyah di luar, lembut di dalam.",
    img: frenchImg,
  },
];

const MEMBER_TIERS = [
  {
    name: "Reguler",
    icon: Coffee,
    req: "Aktif otomatis sejak transaksi pertama",
    benefit:
      "Mulai kumpulkan poin dari setiap pembelian yang kamu lakukan di kasir.",
  },
  {
    name: "Loyal Member",
    icon: Heart,
    req: "Minimal 10x transaksi dalam sebulan",
    benefit:
      "Dapat diskon otomatis 5% setiap belanja, tanpa perlu kode promo apa pun.",
  },
  {
    name: "VIP Member",
    icon: Crown,
    req: "Minimal 25x transaksi atau total belanja Rp500rb / bulan",
    benefit:
      "Diskon otomatis 15% plus akses lebih dulu ke menu edisi terbatas.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Gimana cara naik level jadi Loyal atau VIP Member?",
    a: "Sistem kasir kami otomatis menghitung jumlah transaksimu berdasarkan nomor HP yang terdaftar. Begitu syaratnya terpenuhi, level kamu naik sendiri tanpa perlu daftar ulang.",
  },
  {
    q: "Diskon member bisa digabung sama promo lain, gak?",
    a: "Diskon otomatis member berlaku sendiri di setiap transaksi supaya kamu selalu dapat harga terbaik secara transparan, tanpa drama hitung-hitungan.",
  },
  {
    q: "Kalau mau pesan, harus lewat aplikasi?",
    a: "Belum ada aplikasi pemesanan online untuk pelanggan. Untuk sekarang seluruh pesanan dilayani langsung oleh kasir di kedai.",
  },
  {
    q: "Jam operasional Bogeng Coffee jam berapa?",
    a: "Kami buka setiap hari pukul 08.00–22.00 WIB, termasuk akhir pekan dan hari libur nasional.",
  },
];

function formatIDR(num) {
  return `Rp ${num.toLocaleString("id-ID")}`;
}

// =====================================================================
// SHAPES
// =====================================================================
function LeafShape({ className, style }) {
  return (
    <svg
      viewBox="0 0 100 140"
      className={className}
      style={style}
      fill="currentColor"
    >
      <path d="M50 4C78 28 92 64 50 136C8 64 22 28 50 4Z" />
      <path
        d="M50 14V126"
        stroke="white"
        strokeOpacity="0.25"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}

function CoffeeBeanShape({ className, style }) {
  return (
    <svg
      viewBox="0 0 60 40"
      className={className}
      style={style}
      fill="currentColor"
    >
      <ellipse cx="30" cy="20" rx="28" ry="18" />
      <path
        d="M30 4 Q38 12 38 20 Q38 28 30 36"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M30 4 Q22 12 22 20 Q22 28 30 36"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}

function AmbientLeaves() {
  const leaves = [
    { top: "2%", left: "-5%", size: 200, rotate: -18, color: "#8B5E34", dur: 22, delay: 0 },
    { top: "18%", left: "91%", size: 140, rotate: 22, color: "#6F8F5C", dur: 18, delay: -5 },
    { top: "44%", left: "-4%", size: 170, rotate: 6, color: "#6F8F5C", dur: 26, delay: -8 },
    { top: "65%", left: "93%", size: 210, rotate: -10, color: "#8B5E34", dur: 20, delay: -12 },
    { top: "85%", left: "5%", size: 140, rotate: 28, color: "#6F8F5C", dur: 24, delay: -3 },
  ];
  const beans = [
    { top: "10%", left: "8%", size: 36, rotate: 25, color: "#8B5E34", dur: 16, delay: -6 },
    { top: "30%", left: "87%", size: 28, rotate: -15, color: "#6F4E37", dur: 20, delay: -2 },
    { top: "52%", left: "12%", size: 32, rotate: 40, color: "#8B5E34", dur: 18, delay: -9 },
    { top: "72%", left: "80%", size: 30, rotate: -35, color: "#6F4E37", dur: 22, delay: -4 },
    { top: "88%", left: "45%", size: 26, rotate: 15, color: "#8B5E34", dur: 14, delay: -7 },
    { top: "5%", left: "55%", size: 22, rotate: -20, color: "#6F4E37", dur: 19, delay: -1 },
    { top: "40%", left: "50%", size: 34, rotate: 50, color: "#8B5E34", dur: 17, delay: -11 },
  ];
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      <style>{`
        @keyframes leafFloat { 0%,100%{transform:var(--base-t) rotate(0deg) translateX(0) translateY(0);} 33%{transform:var(--base-t) rotate(5deg) translateX(6px) translateY(-5px);} 66%{transform:var(--base-t) rotate(-3deg) translateX(-4px) translateY(3px);} }
        @keyframes beanFloat { 0%,100%{transform:var(--base-t) rotate(0deg) translateY(0);} 50%{transform:var(--base-t) rotate(8deg) translateY(-7px);} }
        .leaf-anim{animation:leafFloat var(--dur) ease-in-out infinite;animation-delay:var(--delay);will-change:transform;}
        .bean-anim{animation:beanFloat var(--dur) ease-in-out infinite;animation-delay:var(--delay);will-change:transform;}
      `}</style>
      {leaves.map((l, i) => (
        <div
          key={`leaf-${i}`}
          className="leaf-anim absolute opacity-[0.055]"
          style={{
            top: l.top,
            left: l.left,
            "--base-t": `rotate(${l.rotate}deg)`,
            "--dur": `${l.dur}s`,
            "--delay": `${l.delay}s`,
            color: l.color,
          }}
        >
          <LeafShape
            style={{ width: l.size, height: l.size * 1.3 }}
            className="fill-current"
          />
        </div>
      ))}
      {beans.map((b, i) => (
        <div
          key={`bean-${i}`}
          className="bean-anim absolute opacity-[0.08]"
          style={{
            top: b.top,
            left: b.left,
            "--base-t": `rotate(${b.rotate}deg)`,
            "--dur": `${b.dur}s`,
            "--delay": `${b.delay}s`,
            color: b.color,
          }}
        >
          <CoffeeBeanShape
            style={{ width: b.size, height: b.size * 0.67 }}
            className="fill-current"
          />
        </div>
      ))}
    </div>
  );
}

// =====================================================================
// MENU DETAIL PANEL
// =====================================================================
function MenuDetailPanel({ item, onClose }) {
  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.97 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 items-center bg-[#FAF7F2] p-7 sm:p-10 rounded-[28px] border border-[#EFE6DC]"
    >
      <div className="flex justify-center">
        <motion.img
          initial={{ scale: 0.85, rotate: -4 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 14 }}
          src={item.img}
          alt={item.name}
          className="w-40 sm:w-56 h-40 sm:h-56 object-contain drop-shadow-xl"
        />
      </div>
      <div>
        <span className="text-[10px] font-black uppercase tracking-widest text-[#C67C4E] bg-[#C67C4E]/10 px-3 py-1 rounded-full">
          {item.category}
        </span>
        <h3 className="text-2xl sm:text-3xl font-black mt-3 mb-1 text-[#2F2D2C] font-serif italic">
          {item.name}
        </h3>
        <p className="text-[#C67C4E] text-xl sm:text-2xl font-black mb-4">
          {formatIDR(item.price)}
        </p>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-6 max-w-sm">
          {item.desc}
        </p>
        <button
          onClick={onClose}
          data-cursor-hover
          className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-[#2F2D2C] transition-colors"
        >
          ← Tutup detail
        </button>
      </div>
    </motion.div>
  );
}

// =====================================================================
// DAUN DI SECTION MENU
// =====================================================================
function MenuSectionLeaves() {
  const leaves = [
    { top: "8%", left: "-2%", size: 100, rotate: -20, color: "text-[#6F8F5C]", dur: 14 },
    { top: "25%", left: "98%", size: 80, rotate: 30, color: "text-[#8B5E34]", dur: 18 },
    { top: "55%", left: "-1%", size: 90, rotate: 10, color: "text-[#6F8F5C]", dur: 16 },
    { top: "70%", left: "96%", size: 110, rotate: -15, color: "text-[#8B5E34]", dur: 20 },
    { top: "90%", left: "10%", size: 70, rotate: 25, color: "text-[#6F8F5C]", dur: 12 },
    { top: "3%", left: "60%", size: 60, rotate: -30, color: "text-[#8B5E34]", dur: 22 },
  ];
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {leaves.map((leaf, i) => (
        <motion.div
          key={i}
          style={{ position: "absolute", top: leaf.top, left: leaf.left }}
          animate={{
            rotate: [leaf.rotate, leaf.rotate + 8, leaf.rotate - 5, leaf.rotate],
            x: [0, 6, -4, 0],
            y: [0, -5, 3, 0],
          }}
          transition={{ repeat: Infinity, duration: leaf.dur, ease: "easeInOut" }}
        >
          <LeafShape
            className={`${leaf.color} opacity-[0.10]`}
            style={{ width: leaf.size, height: leaf.size * 1.3 }}
          />
        </motion.div>
      ))}
    </div>
  );
}

// =====================================================================
// FULL MENU GRID — popup INSTANT (duration 0)
// =====================================================================
function FullMenuGrid({ items, selectedId, onSelect }) {
  const [activeCat, setActiveCat] = useState("Semua");
  const categories = [
    "Semua",
    ...Array.from(new Set(items.map((i) => i.category))),
  ];
  const filtered =
    activeCat === "Semua"
      ? items
      : items.filter((i) => i.category === activeCat);

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 -mx-1 px-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            data-cursor-hover
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-colors ${
              activeCat === cat
                ? "bg-[#2F2D2C] text-white"
                : "bg-white text-gray-500 border border-gray-200 hover:border-[#C67C4E]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onSelect(item)}
              animate={isSelected ? { scale: 1.05, y: -6 } : { scale: 1, y: 0 }}
              transition={{ duration: 0 }}
              whileHover={
                !isSelected
                  ? { y: -4, scale: 1.03, transition: { duration: 0 } }
                  : {}
              }
              whileTap={{ scale: 0.97, transition: { duration: 0 } }}
              data-cursor-hover
              className={`text-left rounded-2xl overflow-hidden border-2 transition-all shadow-sm ${
                isSelected
                  ? "border-[#C67C4E] shadow-[0_8px_24px_rgba(198,124,78,0.22)]"
                  : "border-transparent hover:border-[#EFE6DC] hover:shadow-md"
              }`}
            >
              <div className="w-full aspect-[4/3] overflow-hidden relative">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
              <div
                className={`px-3 py-2.5 ${isSelected ? "bg-[#FFF7F2]" : "bg-white"}`}
              >
                <p
                  className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isSelected ? "text-[#C67C4E]" : "text-gray-400"}`}
                >
                  {item.category}
                </p>
                <h5 className="text-xs font-black text-[#2F2D2C] leading-snug">
                  {item.name}
                </h5>
                <p
                  className={`text-[11px] font-bold mt-1 ${isSelected ? "text-[#C67C4E]" : "text-gray-500"}`}
                >
                  {formatIDR(item.price)}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// =====================================================================
// STARS
// =====================================================================
function Stars({ count }) {
  return (
    <div className="flex gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          fill={i < count ? "currentColor" : "none"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

// =====================================================================
// REVIEW FORM
// =====================================================================
function ReviewForm() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverStar, setHoverStar] = useState(0);
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addReview({ name, rating, text });
    setSent(true);
    setName("");
    setText("");
    setRating(5);
    setTimeout(() => setSent(false), 4500);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-[28px] border border-gray-100 p-6 sm:p-8 max-w-xl mx-auto shadow-sm"
    >
      <h4 className="text-lg font-black text-[#2F2D2C] font-serif italic mb-1">
        Ceritakan pengalamanmu
      </h4>
      <p className="text-xs text-gray-400 mb-5">
        Ulasanmu akan ditinjau dulu oleh tim kami sebelum tampil di halaman ini.
      </p>
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            type="button"
            key={n}
            data-cursor-hover
            onMouseEnter={() => setHoverStar(n)}
            onMouseLeave={() => setHoverStar(0)}
            onClick={() => setRating(n)}
          >
            <Star
              size={22}
              className="text-amber-400 transition-transform hover:scale-110"
              fill={(hoverStar || rating) >= n ? "currentColor" : "none"}
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama kamu (opsional)"
        className="w-full bg-[#FAF7F2] border border-gray-100 rounded-xl px-4 py-3 text-sm mb-3 outline-none focus:border-[#C67C4E] transition-colors"
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
        rows={3}
        placeholder="Gimana rasanya ngopi di Bogeng?"
        className="w-full bg-[#FAF7F2] border border-gray-100 rounded-xl px-4 py-3 text-sm mb-4 outline-none focus:border-[#C67C4E] transition-colors resize-none"
      />
      <button
        type="submit"
        data-cursor-hover
        className="w-full flex items-center justify-center gap-2 bg-[#2F2D2C] hover:bg-[#C67C4E] text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-full transition-colors"
      >
        <Send size={14} /> Kirim Ulasan
      </button>
      <AnimatePresence>
        {sent && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-[11px] font-bold text-emerald-600 mt-3"
          >
            Terima kasih! Ulasanmu masuk antrean moderasi admin ✨
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

// =====================================================================
// COMPLAINT FORM
// =====================================================================
function ComplaintForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const text = `Halo Bogeng Coffee, saya ${name || "pelanggan"} ingin menyampaikan keluhan/saran:\n\n${message}`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      "_blank",
    );
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSend}
      className="bg-[#FAF7F2] rounded-[28px] p-6 sm:p-8 border border-[#EFE6DC]"
    >
      <div className="flex items-center gap-2 mb-1">
        <MessageCircle size={16} className="text-[#C67C4E]" />
        <h4 className="text-sm font-black text-[#2F2D2C]">
          Ada keluhan atau saran?
        </h4>
      </div>
      <p className="text-[11px] text-gray-400 mb-4">
        Kirim langsung, kami balas lewat WhatsApp secepatnya.
      </p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama kamu"
        className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm mb-2.5 outline-none focus:border-[#C67C4E]"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        rows={3}
        placeholder="Tulis keluhan atau saranmu di sini..."
        className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm mb-3 outline-none focus:border-[#C67C4E] resize-none"
      />
      <button
        type="submit"
        data-cursor-hover
        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-full transition-colors"
      >
        <Send size={13} /> Kirim via WhatsApp
      </button>
    </form>
  );
}

// =====================================================================
// SMOOTH SCROLL
// =====================================================================
function smoothScrollTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - 72,
    behavior: "smooth",
  });
}

// =====================================================================
// REVEAL SECTION
// =====================================================================
function RevealSection({ children, className = "", id }) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.section>
  );
}

// =====================================================================
// INFINITE MARQUEE — review jalan otomatis, seamless, hover pause
// =====================================================================
function InfiniteMarquee({ reviews }) {
  const doubled = [...reviews, ...reviews];
  return (
    <div
      className="relative overflow-hidden mb-14"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
      }}
    >
      <style>{`
        @keyframes marqueeLeft{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
        .marquee-track{display:flex;gap:16px;width:max-content;animation:marqueeLeft 32s linear infinite;will-change:transform;}
        .marquee-track:hover{animation-play-state:paused;}
      `}</style>
      <div className="marquee-track">
        {doubled.map((rev, i) => (
          <div
            key={`${rev.id}-${i}`}
            className="bg-[#FAF7F2] p-5 rounded-2xl border border-gray-100 select-none shrink-0"
            style={{ width: 260 }}
          >
            <Stars count={rev.rating} />
            <p className="text-xs text-gray-500 leading-relaxed italic my-3 line-clamp-4">
              "{rev.text}"
            </p>
            <div className="flex items-center gap-2.5 pt-3 border-t border-gray-200/60">
              <div className="w-8 h-8 bg-[#C67C4E] rounded-full flex items-center justify-center text-white font-black text-xs shrink-0">
                {rev.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h5 className="font-bold text-xs text-[#2F2D2C]">{rev.name}</h5>
                <span className="text-[9px] font-bold text-amber-700 uppercase tracking-wider">
                  {rev.tier || "Pelanggan"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =====================================================================
// BACK TO TOP
// =====================================================================
function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.7, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 12 }}
          transition={{ type: "spring", stiffness: 360, damping: 24 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          data-cursor-hover
          aria-label="Kembali ke atas"
          className="fixed bottom-6 right-6 z-[200] w-11 h-11 bg-[#2F2D2C] hover:bg-[#C67C4E] text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-300 cursor-pointer"
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// =====================================================================
// NAVBAR
// =====================================================================
function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("beranda");
  const [leaving, setLeaving] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: "Beranda", id: "beranda" },
    { label: "Menu", id: "menu" },
    { label: "Member", id: "member" },
    { label: "Ulasan", id: "ulasan" },
    { label: "FAQ", id: "faq" },
    { label: "Kontak", id: "kontak" },
  ];

  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.id))
      .filter(Boolean);
    const onScroll = () => {
      const scrollY = window.scrollY + 100;
      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollY >= sections[i].offsetTop) {
          setActiveSection(navLinks[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    smoothScrollTo(id);
    setMobileOpen(false);
  };
  const handleGoLogin = (e) => {
    e.preventDefault();
    if (leaving) return;
    setLeaving(true);
    setTimeout(() => navigate("/login"), 280);
  };

  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "#2F2D2C",
          opacity: leaving ? 1 : 0,
          pointerEvents: "none",
          transition: "opacity 0.28s ease-in-out",
        }}
      />
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 sm:px-10 py-4 bg-white/85 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={(e) => handleNavClick(e, "beranda")}
            className="flex items-center gap-2 select-none"
            data-cursor-hover
          >
            <img
              src={logoImg}
              alt="Logo Bogeng"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="text-base font-black tracking-tight font-serif italic text-[#2F2D2C]">
              Bogeng<span className="text-[#C67C4E]">.</span>
            </span>
          </button>
          <div className="hidden md:flex items-center gap-7 text-[11px] font-bold tracking-wide uppercase text-gray-500">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className={`relative transition-colors hover:text-[#C67C4E] ${activeSection === link.id ? "text-[#C67C4E]" : ""}`}
              >
                {link.label}
                {activeSection === link.id && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#C67C4E] rounded-full"
                  />
                )}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => navigate("/member-login")}
              data-cursor-hover
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="hidden sm:inline-flex items-center gap-1.5 border-2 border-[#C67C4E] text-[#C67C4E] hover:bg-[#C67C4E] hover:text-white px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-wider transition-colors duration-300 cursor-pointer"
            >
              <Heart size={11} /> Portal Member
            </motion.button>
            <motion.button
              onClick={handleGoLogin}
              data-cursor-hover
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="hidden sm:inline-flex bg-[#2F2D2C] hover:bg-[#C67C4E] text-white px-5 sm:px-6 py-2.5 rounded-full font-bold text-[11px] uppercase tracking-wider transition-colors duration-300 cursor-pointer"
            >
              Masuk
            </motion.button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              data-cursor-hover
              className="md:hidden text-[#2F2D2C]"
              aria-label="Buka menu navigasi"
            >
              {mobileOpen ? <X size={22} /> : <MenuIcon size={22} />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-1 pt-4 pb-2">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.id}
                    href={`#${link.id}`}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={(e) => handleNavClick(e, link.id)}
                    className={`px-2 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors ${activeSection === link.id ? "text-[#C67C4E]" : "text-gray-500 hover:text-[#C67C4E]"}`}
                  >
                    {link.label}
                  </motion.a>
                ))}
                <motion.button
                  onClick={() => {
                    navigate("/member-login");
                    setMobileOpen(false);
                  }}
                  whileTap={{ scale: 0.96 }}
                  className="mt-1 text-center border-2 border-[#C67C4E] text-[#C67C4E] px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider w-full"
                >
                  Portal Member
                </motion.button>
                <motion.button
                  onClick={handleGoLogin}
                  whileTap={{ scale: 0.96 }}
                  className="mt-1 text-center bg-[#2F2D2C] text-white px-5 py-3 rounded-full font-bold text-xs uppercase tracking-wider w-full"
                >
                  Masuk (Admin)
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}

// =====================================================================
// HALAMAN UTAMA
// =====================================================================
export default function BogengLandingPage() {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const [approvedReviews, setApprovedReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setApprovedReviews(getApprovedReviews());
    const unsubscribe = subscribeReviews(() =>
      setApprovedReviews(getApprovedReviews()),
    );
    return unsubscribe;
  }, []);

  return (
    <div className="relative min-h-screen bg-white text-[#2F2D2C] overflow-x-hidden selection:bg-[#C67C4E] selection:text-white font-sans">
      <AmbientLeaves />
      <BackToTop />
      <Navbar />

      {/* ============================== HERO (ScrollMorph) ============================== */}
      <div id="beranda">
        <ScrollMorphHero
          onNavigate={(target) => {
            if (target.startsWith("/")) navigate(target);
            else smoothScrollTo(target);
          }}
        />
      </div>

      {/* ============================== MENU ============================== */}
      <RevealSection
        id="menu"
        className="relative py-16 sm:py-20 bg-white border-y border-gray-100 z-10 overflow-hidden"
      >
        <MenuSectionLeaves />
        <div className="max-w-6xl mx-auto px-6 sm:px-10 relative z-10">
          <div className="text-center mb-10">
            <span className="text-[10px] font-black text-[#C67C4E] uppercase tracking-[0.3em] block mb-2">
              Koleksi Rasa
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif italic text-[#2F2D2C]">
              Menu Lengkap Bogeng
            </h2>
          </div>
          <div className="mb-10">
            <AnimatePresence mode="wait">
              {selectedMenu ? (
                <MenuDetailPanel
                  item={selectedMenu}
                  onClose={() => setSelectedMenu(null)}
                />
              ) : (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-10 border-2 border-dashed border-gray-200 rounded-[28px] text-xs font-bold text-gray-400 uppercase tracking-wider"
                >
                  Klik salah satu menu di bawah untuk lihat detailnya
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <FullMenuGrid
            items={MENU_ITEMS}
            selectedId={selectedMenu?.id}
            onSelect={setSelectedMenu}
          />
        </div>
      </RevealSection>

      {/* ============================== MEMBER ============================== */}
      <RevealSection
        id="member"
        className="relative py-20 sm:py-24 bg-[#FAF7F2] z-10"
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <div className="max-w-lg mb-14">
            <span className="text-[#C67C4E] font-black uppercase tracking-[0.25em] text-[10px] mb-2 block">
              Keuntungan Pelanggan Setia
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif italic text-[#2F2D2C] mb-3">
              Makin Sering Mampir, Makin Banyak Untungnya
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Gak perlu daftar ribet. Cukup kasih nama atau nomor HP saat bayar,
              sistem kasir kami yang ngitung semuanya buat naikin levelmu
              otomatis.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MEMBER_TIERS.map((tier, idx) => {
              const Icon = tier.icon;
              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 32, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.55,
                    delay: idx * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.03,
                    boxShadow: "0 20px 40px rgba(198,124,78,0.13)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 cursor-default transition-colors"
                >
                  <motion.div
                    className="w-10 h-10 bg-[#C67C4E]/10 text-[#C67C4E] rounded-xl flex items-center justify-center mb-4"
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Icon size={18} />
                  </motion.div>
                  <h4 className="font-black text-sm text-[#2F2D2C] mb-1">
                    {tier.name}
                  </h4>
                  <p className="text-[11px] text-[#C67C4E] font-bold mb-3">
                    {tier.req}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {tier.benefit}
                  </p>
                </motion.div>
              );
            })}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 bg-[#2F2D2C] rounded-3xl p-7 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
          >
            <div>
              <p className="text-[10px] font-black text-[#C67C4E] uppercase tracking-[0.3em] mb-2">
                Sudah terdaftar?
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                Masuk ke Portal Member
                <br />
                <span className="font-serif italic text-[#C67C4E]">
                  dan mulai pesan sekarang.
                </span>
              </h3>
              <p className="text-xs text-gray-400 font-bold mt-2">
                Lihat riwayat pesanan, cek progress tier, dan nikmati diskon
                otomatis member.
              </p>
            </div>
            <motion.button
              onClick={() => navigate("/member-login")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              data-cursor-hover
              className="shrink-0 flex items-center gap-2 bg-[#C67C4E] hover:bg-white hover:text-[#2F2D2C] text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-full transition-all duration-300 shadow-lg shadow-[#C67C4E]/20 cursor-pointer"
            >
              <Heart size={13} /> Masuk Portal Member
            </motion.button>
          </motion.div>
        </div>
      </RevealSection>

      {/* ============================== ULASAN ============================== */}
      <RevealSection
        id="ulasan"
        className="relative py-20 sm:py-24 bg-white border-t border-gray-100 overflow-hidden z-10"
      >
        <div className="text-center mb-12 px-6">
          <span className="text-[10px] font-black text-[#C67C4E] tracking-[0.3em] uppercase block mb-2">
            Suara Pelanggan
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-serif italic text-[#2F2D2C]">
            Kisah dari Cangkir Mereka
          </h2>
        </div>

        {(() => {
          const DUMMY = [
            { id: "d1", name: "Aldi R.", tier: "Loyal Member", rating: 5, text: "Espresso Bold-nya mantap banget, pas banget buat nemenin kerja pagi!" },
            { id: "d2", name: "Sari W.", tier: "Reguler", rating: 5, text: "Caramel Macchiato di sini juara, creamy dan nggak terlalu manis." },
            { id: "d3", name: "Dimas F.", tier: "VIP Member", rating: 4, text: "Tempatnya cozy banget, cocok buat ngerjain tugas sambil ngopi." },
            { id: "d4", name: "Reza M.", tier: "Loyal Member", rating: 5, text: "Palm Sugar Coffee-nya khas banget, rasa gula aren-nya kerasa asli." },
            { id: "d5", name: "Nadia K.", tier: "Reguler", rating: 5, text: "Matcha Latte Premium disini beda dari yang lain, worth it banget!" },
            { id: "d6", name: "Bagas P.", tier: "VIP Member", rating: 5, text: "Sistem member-nya keren, nggak perlu download app apapun." },
            { id: "d7", name: "Fitri A.", tier: "Loyal Member", rating: 4, text: "Red Velvet Cream-nya enak banget, jadi favorit baru aku." },
            { id: "d8", name: "Hendra S.", tier: "Reguler", rating: 5, text: "Nasi Goreng Spesialnya porsi besar, rasanya nggak kaleng-kaleng!" },
          ];
          const all = [...approvedReviews, ...DUMMY];
          return <InfiniteMarquee reviews={all} />;
        })()}

        <div className="px-6">
          <ReviewForm />
        </div>
      </RevealSection>

      {/* ============================== FAQ ============================== */}
      <RevealSection
        id="faq"
        className="relative py-20 sm:py-24 bg-[#FAF7F2] z-10"
      >
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-[10px] font-black text-[#C67C4E] uppercase tracking-[0.3em] block mb-2">
              Sering Ditanya
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif italic text-[#2F2D2C]">
              Pertanyaan Umum
            </h2>
          </div>
          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  data-cursor-hover
                  className="w-full flex justify-between items-center gap-4 p-5 text-left font-bold text-xs sm:text-sm text-[#2F2D2C]"
                >
                  <span>{faq.q}</span>
                  <motion.span
                    animate={{ rotate: activeFaq === idx ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ChevronDown size={16} className="text-[#C67C4E] shrink-0" />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-xs text-gray-500 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ============================== KONTAK ============================== */}
      <RevealSection
        id="kontak"
        className="relative py-20 sm:py-24 bg-white z-10"
      >
        <div className="max-w-5xl mx-auto px-6 sm:px-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[10px] font-black text-[#C67C4E] uppercase tracking-[0.3em] block mb-2">
              Hubungi Kami
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif italic text-[#2F2D2C] mb-4">
              Kami Siap Dengar Ceritamu
            </h2>
            <div className="space-y-3 text-sm text-gray-500">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-[#C67C4E] shrink-0" /> Jl.
                Kopi Santai No.12, Pekanbaru
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-[#C67C4E] shrink-0" /> Setiap
                hari, 08.00 – 22.00 WIB
              </div>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                className="flex items-center gap-3 hover:text-[#C67C4E] transition-colors"
              >
                <Phone size={16} className="text-[#C67C4E] shrink-0" /> Chat
                WhatsApp Langsung
              </a>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <ComplaintForm />
          </motion.div>
        </div>
      </RevealSection>

      <footer className="py-8 text-center bg-[#FAF7F2] border-t border-gray-100">
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em]">
          © 2026 Bogeng Coffee — Project Akhir Sistem Informasi
        </p>
      </footer>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .leaf-anim,.bean-anim,.hero-particle,.hero-glow,.marquee-track{animation:none!important;opacity:0.04!important;}
        }
      `}</style>
    </div>
  );
}