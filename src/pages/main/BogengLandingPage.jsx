// src/pages/main/BogengLandingPage.jsx
//
// Landing page publik Bogeng Coffee Shop — project akhir.
// Fitur di file ini:
//   1. Cursor custom (lingkaran ngikutin mouse, membesar di tombol/link)
//   2. Background daun kopi bergerak halus pas di-scroll (opacity rendah, tenang)
//   3. Hero dengan menu yang muter/melayang melingkar (orbit), klik -> detail
//   4. Katalog menu lengkap per kategori (Kopi / Non-Kopi / Makanan / Cemilan)
//   5. Penjelasan tingkatan Member (Reguler / Loyal / VIP) tanpa istilah "CRM"
//   6. Ulasan pelanggan — tampil hanya yang sudah disetujui admin (lihat
//      ReviewModeration.jsx & utils/reviewsStore.js)
//   7. Form kirim ulasan baru (otomatis masuk status "pending")
//   8. FAQ accordion
//   9. Kontak & form keluhan/saran yang langsung kebuka ke WhatsApp
//
// Tema: terang/cream (sesuai request), bukan dark mode.
import logoImg from '../../assets/logo.png';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useAnimationFrame,
  useSpring,
} from 'framer-motion';
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
  ArrowRight,
  Menu as MenuIcon,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { addReview, getApprovedReviews, subscribeReviews } from '../../utils/reviewsStore';

// Ganti dengan gambar menu asli kamu (sesuai struktur folder src/assets/ punyamu)
import espressoImg from '../../assets/espresso.png';
import caramelImg from '../../assets/caramel_macchiato.png';
import palmSugarImg from '../../assets/palm_sugar_coffee.png';
import matchaImg from '../../assets/matcha_latte.png';
import chococreamylavaImg from '../../assets/chococreamy_lava.png';
import redvelvetImg from '../../assets/redvelvet.png';
import nasigorengImg from '../../assets/nasigoreng.jpg';
import sandwichImg from '../../assets/sandwich.jpg';
import spagetiImg from '../../assets/spageti.jpg';
import dimsumImg from '../../assets/dimsum.jpg';
import cirengImg from '../../assets/cire1.png';
import frenchImg from '../../assets/french.jpg';

// 👇 GANTI nomor ini dengan nomor WhatsApp admin/kasir Bogeng yang asli
const WHATSAPP_NUMBER = '6281234567890';

// =====================================================================
// DATA MENU — sumber tunggal dipakai di orbit hero & katalog lengkap
// =====================================================================
const MENU_ITEMS = [
  {
    id: 101,
    category: 'Kopi',
    name: 'Espresso Bold',
    price: 25000,
    desc: 'Ekstrak kopi murni dengan tekanan tinggi, pahit-pekat buat yang butuh suntikan energi cepat.',
    img: espressoImg,
    featured: true,
  },
  {
    id: 102,
    category: 'Kopi',
    name: 'Caramel Macchiato',
    price: 35000,
    desc: 'Espresso, susu creamy, dan sirup karamel emas — manis pas tanpa bikin enek.',
    img: caramelImg,
    featured: true,
  },
  {
    id: 103,
    category: 'Kopi',
    name: 'Palm Sugar Coffee',
    price: 28000,
    desc: 'Kopi susu khas Bogeng dengan manis legit gula aren asli, favorit pelanggan setia.',
    img: palmSugarImg,
    featured: true,
  },
  {
    id: 104,
    category: 'Non-Kopi',
    name: 'Matcha Latte Premium',
    price: 32000,
    desc: 'Bubuk matcha kualitas perkebunan Uji dipadu susu segar, cocok buat yang gak minum kopi.',
    img: matchaImg,
    featured: true,
  },
  {
    id: 105,
    category: 'Non-Kopi',
    name: 'Choco Creamy Lava',
    price: 30000,
    desc: 'Cokelat lumer pekat dengan foam susu tebal di atasnya, manis dan memanjakan lidah.',
    img: chococreamylavaImg,
    featured: true,
  },
  {
    id: 106,
    category: 'Non-Kopi',
    name: 'Red Velvet Cream',
    price: 30000,
    desc: 'Red velvet creamy dengan cream cheese lembut, manis seimbang gak berlebihan.',
    img: redvelvetImg,
    featured: true,
  },
  {
    id: 201,
    category: 'Makanan',
    name: 'Nasi Goreng Spesial',
    price: 25000,
    desc: 'Nasi goreng rumahan dengan telur, ayam suwir, dan kerupuk renyah — pas buat ganjal lapar.',
    img: nasigorengImg,
  },
  {
    id: 202,
    category: 'Makanan',
    name: 'Sandwich Smoked Beef',
    price: 27000,
    desc: 'Roti gandum lapis smoked beef, telur, dan saus mustard madu. Ringan tapi mengenyangkan.',
    img: sandwichImg,
  },
  {
    id: 203,
    category: 'Makanan',
    name: 'Spageti Aglio Olio',
    price: 28000,
    desc: 'Spageti aglio olio dengan bawang putih sangrai dan taburan parmesan, simpel tapi nagih.',
    img: spagetiImg,
  },
  {
    id: 204,
    category: 'Cemilan',
    name: 'Dimsum Ayam',
    price: 20000,
    desc: 'Dimsum ayam kukus lembut, disajikan dengan saus sambal rumahan.',
    img: dimsumImg,
  },
  {
    id: 205,
    category: 'Cemilan',
    name: 'Cireng Bumbu Rujak',
    price: 15000,
    desc: 'Cireng renyah dengan bumbu rujak pedas-manis ala Riau, camilan favorit anak kos.',
    img: cirengImg,
  },
  {
    id: 206,
    category: 'Cemilan',
    name: 'French Fries Crispy',
    price: 18000,
    desc: 'Kentang goreng renyah di luar, lembut di dalam, disajikan dengan saus pilihanmu.',
    img: frenchImg,
  },
];

const FEATURED_ITEMS = MENU_ITEMS.filter((item) => item.featured);

const MEMBER_TIERS = [
  {
    name: 'Reguler',
    icon: Coffee,
    req: 'Aktif otomatis sejak transaksi pertama',
    benefit: 'Mulai kumpulkan poin dari setiap pembelian yang kamu lakukan di kasir.',
  },
  {
    name: 'Loyal Member',
    icon: Heart,
    req: 'Minimal 10x transaksi dalam sebulan',
    benefit: 'Dapat diskon otomatis 5% setiap belanja, tanpa perlu kode promo apa pun.',
  },
  {
    name: 'VIP Member',
    icon: Crown,
    req: 'Minimal 25x transaksi atau total belanja Rp500rb / bulan',
    benefit: 'Diskon otomatis 15% plus akses lebih dulu ke menu edisi terbatas.',
  },
];

const FAQ_ITEMS = [
  {
    q: 'Gimana cara naik level jadi Loyal atau VIP Member?',
    a: 'Sistem kasir kami otomatis menghitung jumlah transaksimu berdasarkan nomor HP yang terdaftar. Begitu syaratnya terpenuhi, level kamu naik sendiri tanpa perlu daftar ulang.',
  },
  {
    q: 'Diskon member bisa digabung sama promo lain, gak?',
    a: 'Diskon otomatis member berlaku sendiri di setiap transaksi supaya kamu selalu dapat harga terbaik secara transparan, tanpa drama hitung-hitungan.',
  },
  {
    q: 'Kalau mau pesan, harus lewat aplikasi?',
    a: 'Belum ada aplikasi pemesanan online untuk pelanggan. Untuk sekarang seluruh pesanan dilayani langsung oleh kasir di kedai.',
  },
  {
    q: 'Jam operasional Bogeng Coffee jam berapa?',
    a: 'Kami buka setiap hari pukul 08.00–22.00 WIB, termasuk akhir pekan dan hari libur nasional.',
  },
];

function formatIDR(num) {
  return `Rp ${num.toLocaleString('id-ID')}`;
}

// =====================================================================
// CURSOR CUSTOM — lingkaran kecil ngikutin mouse, membesar di area klik
// =====================================================================
function FollowCursor() {
  const [isHover, setIsHover] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const ringX = useSpring(mouseX, { damping: 25, stiffness: 280, mass: 0.5 });
  const ringY = useSpring(mouseY, { damping: 25, stiffness: 280, mass: 0.5 });

  useEffect(() => {
    const handleMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsHover(!!e.target.closest('a, button, [data-cursor-hover]'));
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-[#C67C4E] rounded-full pointer-events-none z-[9999] hidden md:block"
        style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-[#C67C4E]/50 pointer-events-none z-[9998] hidden md:block"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: isHover ? 54 : 30,
          height: isHover ? 54 : 30,
          backgroundColor: isHover ? 'rgba(198,124,78,0.08)' : 'rgba(198,124,78,0)',
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      />
    </>
  );
}

// =====================================================================
// BACKGROUND DAUN + BIJI KOPI — pure CSS animation, NO useScroll/fixed
// will-change: transform supaya browser composites di GPU layer terpisah
// =====================================================================
function LeafShape({ className, style }) {
  return (
    <svg viewBox="0 0 100 140" className={className} style={style} fill="currentColor">
      <path d="M50 4C78 28 92 64 50 136C8 64 22 28 50 4Z" />
      <path d="M50 14V126" stroke="white" strokeOpacity="0.25" strokeWidth="2" fill="none" />
    </svg>
  );
}

function CoffeeBeanShape({ className, style }) {
  return (
    <svg viewBox="0 0 60 40" className={className} style={style} fill="currentColor">
      <ellipse cx="30" cy="20" rx="28" ry="18" />
      <path d="M30 4 Q38 12 38 20 Q38 28 30 36" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
      <path d="M30 4 Q22 12 22 20 Q22 28 30 36" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
    </svg>
  );
}

function AmbientLeaves() {
  // Pakai absolute bukan fixed — tidak trigger compositing layer global
  const leaves = [
    { top: '2%',  left: '-5%',  size: 200, rotate: -18, color: '#8B5E34', dur: 22, delay: 0    },
    { top: '18%', left: '91%',  size: 140, rotate: 22,  color: '#6F8F5C', dur: 18, delay: -5   },
    { top: '44%', left: '-4%',  size: 170, rotate: 6,   color: '#6F8F5C', dur: 26, delay: -8   },
    { top: '65%', left: '93%',  size: 210, rotate: -10, color: '#8B5E34', dur: 20, delay: -12  },
    { top: '85%', left: '5%',   size: 140, rotate: 28,  color: '#6F8F5C', dur: 24, delay: -3   },
  ];

  const beans = [
    { top: '10%', left: '8%',   size: 36, rotate: 25,  color: '#8B5E34', dur: 16, delay: -6   },
    { top: '30%', left: '87%',  size: 28, rotate: -15, color: '#6F4E37', dur: 20, delay: -2   },
    { top: '52%', left: '12%',  size: 32, rotate: 40,  color: '#8B5E34', dur: 18, delay: -9   },
    { top: '72%', left: '80%',  size: 30, rotate: -35, color: '#6F4E37', dur: 22, delay: -4   },
    { top: '88%', left: '45%',  size: 26, rotate: 15,  color: '#8B5E34', dur: 14, delay: -7   },
    { top: '5%',  left: '55%',  size: 22, rotate: -20, color: '#6F4E37', dur: 19, delay: -1   },
    { top: '40%', left: '50%',  size: 34, rotate: 50,  color: '#8B5E34', dur: 17, delay: -11  },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      <style>{`
        @keyframes leafFloat {
          0%,100% { transform: var(--base-t) rotate(0deg) translateX(0px) translateY(0px); }
          33%      { transform: var(--base-t) rotate(5deg)  translateX(6px)  translateY(-5px); }
          66%      { transform: var(--base-t) rotate(-3deg) translateX(-4px) translateY(3px); }
        }
        @keyframes beanFloat {
          0%,100% { transform: var(--base-t) rotate(0deg) translateY(0px); }
          50%      { transform: var(--base-t) rotate(8deg)  translateY(-7px); }
        }
        .leaf-anim  { animation: leafFloat var(--dur) ease-in-out infinite; animation-delay: var(--delay); will-change: transform; }
        .bean-anim  { animation: beanFloat var(--dur) ease-in-out infinite; animation-delay: var(--delay); will-change: transform; }
      `}</style>

      {leaves.map((l, i) => (
        <div
          key={`leaf-${i}`}
          className="leaf-anim absolute opacity-[0.055]"
          style={{
            top: l.top, left: l.left,
            '--base-t': `rotate(${l.rotate}deg)`,
            '--dur': `${l.dur}s`,
            '--delay': `${l.delay}s`,
            color: l.color,
          }}
        >
          <LeafShape style={{ width: l.size, height: l.size * 1.3 }} className="fill-current" />
        </div>
      ))}

      {beans.map((b, i) => (
        <div
          key={`bean-${i}`}
          className="bean-anim absolute opacity-[0.08]"
          style={{
            top: b.top, left: b.left,
            '--base-t': `rotate(${b.rotate}deg)`,
            '--dur': `${b.dur}s`,
            '--delay': `${b.delay}s`,
            color: b.color,
          }}
        >
          <CoffeeBeanShape style={{ width: b.size, height: b.size * 0.67 }} className="fill-current" />
        </div>
      ))}
    </div>
  );
}

// =====================================================================
// ORBIT MENU — scattered oval bubbles miring ala Shamoni, foto penuh,
// tanpa badge harga. Tiap item punya offset orbit & tilt sendiri-sendiri.
// =====================================================================

// Posisi scatter organic: [radiusX, radiusY, baseAngle, staticTilt]
// radiusX/Y bikin orbit OVAL (bukan lingkaran), tilt bikin foto miring
const ORBIT_CONFIGS = [
  { rx: 175, ry: 115, baseAngle: -80, tilt: -14, size: 86 },
  { rx: 175, ry: 115, baseAngle: -20, tilt: 10,  size: 78 },
  { rx: 175, ry: 115, baseAngle: 40,  tilt: -8,  size: 90 },
  { rx: 175, ry: 115, baseAngle: 100, tilt: 16,  size: 80 },
  { rx: 175, ry: 115, baseAngle: 155, tilt: -12, size: 84 },
  { rx: 175, ry: 115, baseAngle: 215, tilt: 8,   size: 76 },
];

function OrbitItem({ item, cfg, rotation, selected, onSelect }) {
  // posisi oval: x = rx * cos, y = ry * sin
  const x = useTransform(
    rotation,
    (r) => Math.cos(((cfg.baseAngle + r) * Math.PI) / 180) * cfg.rx,
  );
  const y = useTransform(
    rotation,
    (r) => Math.sin(((cfg.baseAngle + r) * Math.PI) / 180) * cfg.ry,
  );

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ x, y }}
      whileHover={{ scale: 1.22 }}
      whileTap={{ scale: 0.9 }}
      data-cursor-hover
      onClick={() => onSelect(item)}
    >
      {/* tilt statis + slight shadow = kesan foto fisik dihampar */}
      <motion.div
        style={{ rotate: cfg.tilt }}
        className="relative"
      >
        <div
          className={`overflow-hidden rounded-[18px] shadow-[0_10px_28px_rgba(0,0,0,0.13)] border-[3px] transition-colors duration-300 ${
            selected
              ? 'border-[#C67C4E] ring-4 ring-[#C67C4E]/20'
              : 'border-white/90'
          }`}
          style={{ width: cfg.size, height: cfg.size }}
        >
          <img
            src={item.img}
            alt={item.name}
            className="w-full h-full object-cover pointer-events-none"
          />
        </div>
        {/* nama menu kecil di bawah foto, muncul saat selected */}
        {selected && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-black text-[#C67C4E] bg-white/90 px-2 py-0.5 rounded-full shadow"
          >
            {item.name}
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
}

function OrbitMenu({ items, selectedId, onSelect }) {
  const rotation = useMotionValue(0);
  useAnimationFrame((_, delta) => {
    // Diperlambat dari 0.005 → 0.003 supaya orbit lebih ringan
    rotation.set(rotation.get() + delta * 0.003);
  });

  const configs = ORBIT_CONFIGS.slice(0, items.length);

  return (
    <div className="relative h-[380px] sm:h-[430px] w-full max-w-[440px] mx-auto flex items-center justify-center select-none">
      {/* Teks tengah ala Shamoni */}
      <div className="absolute text-center px-6 z-10 pointer-events-none">
        <span className="block text-5xl sm:text-6xl font-black text-[#EFE6DC] font-serif italic tracking-tighter leading-none drop-shadow-sm">
          Bogeng
        </span>
        <span className="block text-[10px] uppercase tracking-[0.35em] text-[#C9B8A8] font-bold mt-2">
          Roasted Daily
        </span>
      </div>

      {items.map((item, i) => (
        <OrbitItem
          key={item.id}
          item={item}
          cfg={configs[i]}
          rotation={rotation}
          selected={selectedId === item.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

// =====================================================================
// DETAIL MENU — muncul smooth (zoom + fade) waktu salah satu menu diklik
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
          transition={{ type: 'spring', stiffness: 140, damping: 14 }}
          src={item.img}
          alt={item.name}
          className="w-40 sm:w-56 h-40 sm:h-56 object-contain drop-shadow-xl"
        />
      </div>
      <div>
        <span className="text-[10px] font-black uppercase tracking-widest text-[#C67C4E] bg-[#C67C4E]/10 px-3 py-1 rounded-full">
          {item.category}
        </span>
        <h3 className="text-2xl sm:text-3xl font-black mt-3 mb-1 text-[#2F2D2C] font-serif italic">{item.name}</h3>
        <p className="text-[#C67C4E] text-xl sm:text-2xl font-black mb-4">{formatIDR(item.price)}</p>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-6 max-w-sm">{item.desc}</p>
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
// DAUN BERGERAK DI SECTION MENU — lebih banyak & terlihat (opacity lebih tinggi)
// =====================================================================
function MenuSectionLeaves() {
  const leaves = [
    { top: '8%',  left: '-2%', size: 100, rotate: -20, color: 'text-[#6F8F5C]', dur: 14 },
    { top: '25%', left: '98%', size: 80,  rotate: 30,  color: 'text-[#8B5E34]', dur: 18 },
    { top: '55%', left: '-1%', size: 90,  rotate: 10,  color: 'text-[#6F8F5C]', dur: 16 },
    { top: '70%', left: '96%', size: 110, rotate: -15, color: 'text-[#8B5E34]', dur: 20 },
    { top: '90%', left: '10%', size: 70,  rotate: 25,  color: 'text-[#6F8F5C]', dur: 12 },
    { top: '3%',  left: '60%', size: 60,  rotate: -30, color: 'text-[#8B5E34]', dur: 22 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {leaves.map((leaf, i) => (
        <motion.div
          key={i}
          style={{ position: 'absolute', top: leaf.top, left: leaf.left }}
          animate={{
            rotate: [leaf.rotate, leaf.rotate + 8, leaf.rotate - 5, leaf.rotate],
            x: [0, 6, -4, 0],
            y: [0, -5, 3, 0],
          }}
          transition={{ repeat: Infinity, duration: leaf.dur, ease: 'easeInOut' }}
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
// KATALOG MENU LENGKAP — foto penuh, popup scale saat dipilih, daun bergerak
// =====================================================================
function FullMenuGrid({ items, selectedId, onSelect }) {
  const [activeCat, setActiveCat] = useState('Semua');
  const categories = ['Semua', ...Array.from(new Set(items.map((i) => i.category)))];
  const filtered = activeCat === 'Semua' ? items : items.filter((i) => i.category === activeCat);

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
                ? 'bg-[#2F2D2C] text-white'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-[#C67C4E]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.map((item, i) => {
          const isSelected = selectedId === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onSelect(item)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 8) * 0.05 }}
              /* Popup scale saat dipilih, hover naik sedikit */
              animate={isSelected ? { scale: 1.05, y: -6 } : { scale: 1, y: 0 }}
              whileHover={!isSelected ? { y: -5, scale: 1.03 } : {}}
              whileTap={{ scale: 0.97 }}
              data-cursor-hover
              className={`text-left rounded-2xl overflow-hidden border-2 transition-all shadow-sm ${
                isSelected
                  ? 'border-[#C67C4E] shadow-[0_8px_24px_rgba(198,124,78,0.22)]'
                  : 'border-transparent hover:border-[#EFE6DC] hover:shadow-md'
              }`}
            >
              {/* Foto penuh — tidak ada padding, object-cover */}
              <div className="w-full aspect-[4/3] overflow-hidden relative">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {/* overlay gradient bawah */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>

              {/* Info di bawah foto */}
              <div className={`px-3 py-2.5 ${isSelected ? 'bg-[#FFF7F2]' : 'bg-white'}`}>
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isSelected ? 'text-[#C67C4E]' : 'text-gray-400'}`}>
                  {item.category}
                </p>
                <h5 className="text-xs font-black text-[#2F2D2C] leading-snug">{item.name}</h5>
                <p className={`text-[11px] font-bold mt-1 ${isSelected ? 'text-[#C67C4E]' : 'text-gray-500'}`}>
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
// REVIEW — bintang kecil dipakai ulang di kartu ulasan
// =====================================================================
function Stars({ count }) {
  return (
    <div className="flex gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} fill={i < count ? 'currentColor' : 'none'} strokeWidth={1.5} />
      ))}
    </div>
  );
}

function ReviewForm() {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverStar, setHoverStar] = useState(0);
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addReview({ name, rating, text });
    setSent(true);
    setName('');
    setText('');
    setRating(5);
    setTimeout(() => setSent(false), 4500);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-[28px] border border-gray-100 p-6 sm:p-8 max-w-xl mx-auto shadow-sm"
    >
      <h4 className="text-lg font-black text-[#2F2D2C] font-serif italic mb-1">Ceritakan pengalamanmu</h4>
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
              fill={(hoverStar || rating) >= n ? 'currentColor' : 'none'}
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
// KELUHAN / SARAN — langsung buka WhatsApp dengan teks yang udah disiapin
// =====================================================================
function ComplaintForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const text = `Halo Bogeng Coffee, saya ${name || 'pelanggan'} ingin menyampaikan keluhan/saran:\n\n${message}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
    setMessage('');
  };

  return (
    <form onSubmit={handleSend} className="bg-[#FAF7F2] rounded-[28px] p-6 sm:p-8 border border-[#EFE6DC]">
      <div className="flex items-center gap-2 mb-1">
        <MessageCircle size={16} className="text-[#C67C4E]" />
        <h4 className="text-sm font-black text-[#2F2D2C]">Ada keluhan atau saran?</h4>
      </div>
      <p className="text-[11px] text-gray-400 mb-4">Kirim langsung, kami balas lewat WhatsApp secepatnya.</p>
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
// SMOOTH SCROLL HELPER — intercept anchor klik, scroll halus ke section
// =====================================================================
function smoothScrollTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const navHeight = 72; // tinggi navbar
  const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
  window.scrollTo({ top, behavior: 'smooth' });
}

// =====================================================================
// SCROLL REVEAL — wrapper supaya tiap section muncul smooth saat discroll
// =====================================================================
function RevealSection({ children, className = '', id }) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.section>
  );
}

// =====================================================================
// HERO SPOTLIGHT — cursor mengungkap gambar suasana kafe di balik bg cream
// OPTIMASI: pakai ref + direct DOM manipulation, BUKAN setState
// =====================================================================
const SPOTLIGHT_R = 220;

const CAFE_SCENES = [
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&q=85',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1600&q=85',
];

function HeroSpotlightBg() {
  const canvasRef   = useRef(null);
  const revealRef   = useRef(null);
  const sceneRef    = useRef(0);
  const lastZoneRef = useRef(-1);
  // store cursor WITHOUT setState — no re-render
  const posRef      = useRef({ x: -999, y: -999 });
  const rafRef      = useRef(null);

  useEffect(() => {
    const canvas  = canvasRef.current;
    const reveal  = revealRef.current;
    if (!canvas || !reveal) return;

    const fit = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    fit();
    window.addEventListener('resize', fit);

    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };

      // Zone change → swap scene image
      const zone = e.clientX < window.innerWidth / 2 ? 0 : 1;
      if (zone !== lastZoneRef.current) {
        lastZoneRef.current = zone;
        sceneRef.current    = zone % CAFE_SCENES.length;
        reveal.style.backgroundImage = `url(${CAFE_SCENES[sceneRef.current]})`;
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    // Paint mask tanpa setState — langsung ke DOM
    const paint = () => {
      const { x, y } = posRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const grad = ctx.createRadialGradient(x, y, 0, x, y, SPOTLIGHT_R);
      grad.addColorStop(0,    'rgba(255,255,255,1)');
      grad.addColorStop(0.35, 'rgba(255,255,255,1)');
      grad.addColorStop(0.60, 'rgba(255,255,255,0.80)');
      grad.addColorStop(0.80, 'rgba(255,255,255,0.35)');
      grad.addColorStop(0.92, 'rgba(255,255,255,0.08)');
      grad.addColorStop(1,    'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, SPOTLIGHT_R, 0, Math.PI * 2);
      ctx.fill();
      const url = canvas.toDataURL();
      reveal.style.maskImage       = `url(${url})`;
      reveal.style.webkitMaskImage = `url(${url})`;
      reveal.style.maskSize        = '100% 100%';
      reveal.style.webkitMaskSize  = '100% 100%';
      rafRef.current = requestAnimationFrame(paint);
    };
    rafRef.current = requestAnimationFrame(paint);

    return () => {
      window.removeEventListener('resize', fit);
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div
        ref={revealRef}
        className="absolute inset-0 pointer-events-none z-[5] bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${CAFE_SCENES[0]})` }}
      />
      <div className="absolute inset-0 pointer-events-none z-[6]"
        style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 45%, rgba(255,253,248,0.55) 100%)' }}
      />
    </>
  );
}

// =====================================================================
// NAVBAR — dengan animasi page-exit smooth ke /login
// =====================================================================
function Navbar() {
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');
  const [leaving, setLeaving]             = useState(false);
  const navigate                          = useNavigate();

  const navLinks = [
    { label: 'Beranda', id: 'beranda' },
    { label: 'Menu',    id: 'menu'    },
    { label: 'Member',  id: 'member'  },
    { label: 'Ulasan',  id: 'ulasan'  },
    { label: 'FAQ',     id: 'faq'     },
    { label: 'Kontak',  id: 'kontak'  },
  ];

  // Highlight link aktif saat scroll
  useEffect(() => {
    const sections = navLinks.map((l) => document.getElementById(l.id)).filter(Boolean);
    const onScroll = () => {
      const scrollY = window.scrollY + 100;
      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollY >= sections[i].offsetTop) {
          setActiveSection(navLinks[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
    // Langsung navigate tanpa setTimeout — overlay CSS transition cukup
    setTimeout(() => navigate('/login'), 280);
  };

  return (
    <>
      {/* Overlay tipis — hanya pakai inline style, BUKAN AnimatePresence
          agar tidak "bocor" ke halaman Login setelah unmount */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: '#2F2D2C',
          opacity: leaving ? 1 : 0,
          pointerEvents: 'none',
          transition: 'opacity 0.28s ease-in-out',
        }}
      />

      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 sm:px-10 py-4 bg-white/85 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
  onClick={(e) => handleNavClick(e, 'beranda')}
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
                className={`relative transition-colors hover:text-[#C67C4E] ${
                  activeSection === link.id ? 'text-[#C67C4E]' : ''
                }`}
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
            {/* Tombol Portal Member — untuk pelanggan */}
            <motion.button
              onClick={() => navigate('/member-login')}
              data-cursor-hover
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="hidden sm:inline-flex items-center gap-1.5 border-2 border-[#C67C4E] text-[#C67C4E] hover:bg-[#C67C4E] hover:text-white px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-wider transition-colors duration-300 cursor-pointer"
            >
              <Heart size={11} /> Portal Member
            </motion.button>
            {/* Tombol MASUK — untuk admin/kasir */}
            <motion.button
              onClick={handleGoLogin}
              data-cursor-hover
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
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
              animate={{ opacity: 1, height: 'auto' }}
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
                    className={`px-2 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                      activeSection === link.id ? 'text-[#C67C4E]' : 'text-gray-500 hover:text-[#C67C4E]'
                    }`}
                  >
                    {link.label}
                  </motion.a>
                ))}
                <motion.button
                  onClick={() => { navigate('/member-login'); setMobileOpen(false); }}
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

  useEffect(() => {
    setApprovedReviews(getApprovedReviews());
    const unsubscribe = subscribeReviews(() => setApprovedReviews(getApprovedReviews()));
    return unsubscribe;
  }, []);

  return (
    <div className="relative min-h-screen bg-white text-[#2F2D2C] overflow-x-hidden selection:bg-[#C67C4E] selection:text-white font-sans">
      <FollowCursor />
      <AmbientLeaves />
      <Navbar />

      {/* ============================== HERO ============================== */}
      <section id="beranda" className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden">
        {/* Spotlight reveal background — self-contained, zero re-render */}
        <HeroSpotlightBg />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block text-[10px] font-black text-[#C67C4E] uppercase tracking-[0.3em] mb-4 bg-[#C67C4E]/10 px-3 py-1.5 rounded-full">
              Sejak Pagi, Tanpa Basa-basi
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] mb-6 text-[#2F2D2C]">
              Kopi yang <span className="font-serif italic text-[#C67C4E]">diingat</span>,
              <br />
              bukan cuma diminum.
            </h1>
            <p className="max-w-md text-sm text-gray-500 mb-8 leading-relaxed">
              Bogeng menghadirkan pengalaman menikmati kopi dari biji pilihan terbaik dengan penyajian yang terjaga kualitasnya. 
              Loyalitas Anda kami hargai melalui sistem keanggotaan yang berjalan secara otomatis.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#menu"
                onClick={(e) => { e.preventDefault(); smoothScrollTo('menu'); }}
                data-cursor-hover
                className="inline-flex items-center gap-2 bg-[#C67C4E] hover:bg-[#A05C32] text-white px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Lihat Menu <ArrowRight size={14} />
              </a>
              <button
                onClick={() => navigate('/member-login')}
                data-cursor-hover
                className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-[#C67C4E] px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-gray-600 transition-colors"
              >
                Portal Member
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <OrbitMenu items={FEATURED_ITEMS} selectedId={selectedMenu?.id} onSelect={setSelectedMenu} />
            <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">
              Klik salah satu menu yang berputar
            </p>
            <p className="text-center text-[9px] text-[#C67C4E]/60 font-bold uppercase tracking-widest mt-1">
              ✦ Gerakkan kursor untuk mengungkap suasana ✦
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============================== MENU ============================== */}
      <RevealSection id="menu" className="relative py-16 sm:py-20 bg-white border-y border-gray-100 z-10 overflow-hidden">
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
                <MenuDetailPanel item={selectedMenu} onClose={() => setSelectedMenu(null)} />
              ) : (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-10 border-2 border-dashed border-gray-200 rounded-[28px] text-xs font-bold text-gray-400 uppercase tracking-wider"
                >
                  Klik salah satu menu di atas atau di bawah untuk lihat detailnya
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <FullMenuGrid items={MENU_ITEMS} selectedId={selectedMenu?.id} onSelect={setSelectedMenu} />
        </div>
      </RevealSection>

      {/* ============================== MEMBER ============================== */}
      <RevealSection id="member" className="relative py-20 sm:py-24 bg-[#FAF7F2] z-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <div className="max-w-lg mb-14">
            <span className="text-[#C67C4E] font-black uppercase tracking-[0.25em] text-[10px] mb-2 block">
              Keuntungan Pelanggan Setia
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif italic text-[#2F2D2C] mb-3">
              Makin Sering Mampir, Makin Banyak Untungnya
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Gak perlu daftar ribet. Cukup kasih nama atau nomor HP saat bayar, sistem kasir kami yang
              ngitung semuanya buat naikin levelmu otomatis.
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
                  transition={{ duration: 0.55, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -8, scale: 1.03, boxShadow: '0 20px 40px rgba(198,124,78,0.13)' }}
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
                  <h4 className="font-black text-sm text-[#2F2D2C] mb-1">{tier.name}</h4>
                  <p className="text-[11px] text-[#C67C4E] font-bold mb-3">{tier.req}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{tier.benefit}</p>
                </motion.div>
              );
            })}
          </div>

          {/* ── CTA Banner Portal Member ── */}
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
                Masuk ke Portal Member<br />
                <span className="font-serif italic text-[#C67C4E]">dan mulai pesan sekarang.</span>
              </h3>
              <p className="text-xs text-gray-400 font-bold mt-2">
                Lihat riwayat pesanan, cek progress tier, dan nikmati diskon otomatis member.
              </p>
            </div>
            <motion.button
              onClick={() => navigate('/member-login')}
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
      <RevealSection id="ulasan" className="relative py-20 sm:py-24 bg-white border-t border-gray-100 overflow-hidden z-10">
        <div className="text-center mb-12 px-6">
          <span className="text-[10px] font-black text-[#C67C4E] tracking-[0.3em] uppercase block mb-2">
            Suara Pelanggan
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-serif italic text-[#2F2D2C]">
            Kisah dari Cangkir Mereka
          </h2>
        </div>

        {/* Inject CSS marquee — pure CSS, zero JS overhead */}
        <style>{`
          @keyframes marqueeLeft  { from { transform: translateX(0) } to { transform: translateX(-50%) } }
          @keyframes marqueeRight { from { transform: translateX(-50%) } to { transform: translateX(0) } }
          .marquee-left  { animation: marqueeLeft  36s linear infinite; }
          .marquee-right { animation: marqueeRight 40s linear infinite; }
          .marquee-left:hover, .marquee-right:hover { animation-play-state: paused; }
        `}</style>

        {(() => {
          // Data dummy yang selalu ada supaya 2 baris tidak pernah kosong
          const DUMMY = [
            { id: 'd1', name: 'Aldi R.',    tier: 'Loyal Member', rating: 5, text: 'Espresso Bold-nya mantap banget, pas banget buat nemenin kerja pagi!' },
            { id: 'd2', name: 'Sari W.',    tier: 'Reguler',      rating: 5, text: 'Caramel Macchiato di sini juara, creamy dan nggak terlalu manis.' },
            { id: 'd3', name: 'Dimas F.',   tier: 'VIP Member',   rating: 4, text: 'Tempatnya cozy banget, cocok buat ngerjain tugas sambil ngopi.' },
            { id: 'd4', name: 'Reza M.',    tier: 'Loyal Member', rating: 5, text: 'Palm Sugar Coffee-nya khas banget, rasa gula aren-nya kerasa asli.' },
            { id: 'd5', name: 'Nadia K.',   tier: 'Reguler',      rating: 5, text: 'Matcha Latte Premium disini beda dari yang lain, worth it banget!' },
            { id: 'd6', name: 'Bagas P.',   tier: 'VIP Member',   rating: 5, text: 'Sistem member-nya keren, nggak perlu download app apapun.' },
            { id: 'd7', name: 'Fitri A.',   tier: 'Loyal Member', rating: 4, text: 'Red Velvet Cream-nya enak banget, jadi favorit baru aku.' },
            { id: 'd8', name: 'Hendra S.',  tier: 'Reguler',      rating: 5, text: 'Nasi Goreng Spesialnya porsi besar, rasanya nggak kaleng-kaleng!' },
          ];

          // Gabung ulasan asli + dummy, min 6 item per baris
          const all = [...approvedReviews, ...DUMMY];
          // Bagi dua baris
          const half = Math.ceil(all.length / 2);
          const row1 = all.slice(0, half);
          const row2 = all.slice(half);

          // Double untuk seamless loop
          const r1 = [...row1, ...row1];
          const r2 = [...row2, ...row2];

          const Card = ({ rev }) => (
            <div className="w-[270px] sm:w-[300px] shrink-0 bg-[#FAF7F2] p-5 rounded-2xl border border-gray-100 mx-2.5">
              <Stars count={rev.rating} />
              <p className="text-xs text-gray-500 leading-relaxed italic my-3 line-clamp-3">"{rev.text}"</p>
              <div className="flex items-center gap-2.5 pt-3 border-t border-gray-200/60">
                <div className="w-8 h-8 bg-[#C67C4E] rounded-full flex items-center justify-center text-white font-black text-xs shrink-0">
                  {rev.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h5 className="font-bold text-xs text-[#2F2D2C]">{rev.name}</h5>
                  <span className="text-[9px] font-bold text-amber-700 uppercase tracking-wider">{rev.tier}</span>
                </div>
              </div>
            </div>
          );

          return (
            <div className="flex flex-col gap-4 overflow-hidden mb-16">
              {/* Baris 1 — gerak kiri */}
              <div className="flex w-max marquee-left">
                {r1.map((rev, i) => <Card key={`r1-${rev.id}-${i}`} rev={rev} />)}
              </div>
              {/* Baris 2 — gerak kanan */}
              <div className="flex w-max marquee-right">
                {r2.map((rev, i) => <Card key={`r2-${rev.id}-${i}`} rev={rev} />)}
              </div>
            </div>
          );
        })()}

        <div className="px-6">
          <ReviewForm />
        </div>
      </RevealSection>

      {/* ============================== FAQ ============================== */}
      <RevealSection id="faq" className="relative py-20 sm:py-24 bg-[#FAF7F2] z-10">
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
                  <motion.span animate={{ rotate: activeFaq === idx ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown size={16} className="text-[#C67C4E] shrink-0" />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-xs text-gray-500 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ============================== KONTAK ============================== */}
      <RevealSection id="kontak" className="relative py-20 sm:py-24 bg-white z-10">
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
                <MapPin size={16} className="text-[#C67C4E] shrink-0" /> Jl. Kopi Santai No.12, Pekanbaru
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-[#C67C4E] shrink-0" /> Setiap hari, 08.00 – 22.00 WIB
              </div>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                className="flex items-center gap-3 hover:text-[#C67C4E] transition-colors"
              >
                <Phone size={16} className="text-[#C67C4E] shrink-0" /> Chat WhatsApp Langsung
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
          .marquee-left, .marquee-right, .leaf-anim, .bean-anim { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
