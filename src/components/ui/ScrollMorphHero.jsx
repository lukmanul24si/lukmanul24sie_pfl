// src/components/ui/ScrollMorphHero.jsx
// v4 FIXES:
//   - Lingkaran digeser ke kanan (offset +15% dari tengah)
//   - Arc description tidak terpotong (posisi & opacity disesuaikan)
//   - Performa lebih ringan (spring lebih ringan, RAF dioptimasi)
//   - Hapus best seller cards di fase final
//   - Scroll indicator lebih jelas + progress bar

"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import { ArrowRight, Heart, Coffee, Star, Users, ChevronDown } from "lucide-react";

// ─── ASET LOKAL ──────────────────────────────────────────────────────
import espressoImg        from "../../assets/espresso.png";
import caramelImg         from "../../assets/caramel_macchiato.png";
import palmSugarImg       from "../../assets/palm_sugar_coffee.png";
import matchaImg          from "../../assets/matcha_latte.png";
import chococreamylavaImg from "../../assets/chococreamy_lava.png";
import redvelvetImg       from "../../assets/redvelvet.png";
import nasigorengImg      from "../../assets/nasigoreng.jpg";
import sandwichImg        from "../../assets/sandwich.jpg";
import spagetiImg         from "../../assets/spageti.jpg";
import dimsumImg          from "../../assets/dimsum.jpg";
import cirengImg          from "../../assets/cire1.png";
import frenchImg          from "../../assets/french.jpg";

// ─── KONSTANTA ────────────────────────────────────────────────────────
const MAX_SCROLL  = 3000;
const MORPH_END   = 600;
const ROTATE_END  = 3000;

const MENU_ITEMS = [
  { id:101, name:"Espresso Bold",        cat:"Kopi",     price:"Rp 25.000", img: espressoImg },
  { id:102, name:"Caramel Macchiato",    cat:"Kopi",     price:"Rp 35.000", img: caramelImg },
  { id:103, name:"Palm Sugar Coffee",    cat:"Kopi",     price:"Rp 28.000", img: palmSugarImg },
  { id:104, name:"Matcha Latte",         cat:"Non-Kopi", price:"Rp 32.000", img: matchaImg },
  { id:105, name:"Choco Creamy Lava",    cat:"Non-Kopi", price:"Rp 30.000", img: chococreamylavaImg },
  { id:106, name:"Red Velvet Cream",     cat:"Non-Kopi", price:"Rp 30.000", img: redvelvetImg },
  { id:201, name:"Nasi Goreng Spesial",  cat:"Makanan",  price:"Rp 25.000", img: nasigorengImg },
  { id:202, name:"Sandwich Smoked Beef", cat:"Makanan",  price:"Rp 27.000", img: sandwichImg },
  { id:203, name:"Spageti Aglio Olio",   cat:"Makanan",  price:"Rp 28.000", img: spagetiImg },
  { id:204, name:"Dimsum Ayam",          cat:"Cemilan",  price:"Rp 20.000", img: dimsumImg },
  { id:205, name:"Cireng Bumbu Rujak",   cat:"Cemilan",  price:"Rp 15.000", img: cirengImg },
  { id:206, name:"French Fries Crispy",  cat:"Cemilan",  price:"Rp 18.000", img: frenchImg },
];

const MORPH_ITEMS = [
  ...MENU_ITEMS,
  MENU_ITEMS[0], MENU_ITEMS[1], MENU_ITEMS[2],
  MENU_ITEMS[3], MENU_ITEMS[4], MENU_ITEMS[5],
  MENU_ITEMS[6], MENU_ITEMS[7],
];
const TOTAL_CARDS = MORPH_ITEMS.length; // 20

// ─── HELPER ───────────────────────────────────────────────────────────
const lerp  = (a, b, t) => a * (1 - t) + b * t;
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const norm  = (val, min, max) => clamp((val - min) / (max - min), 0, 1);

// ─── SVG SHAPES ───────────────────────────────────────────────────────
function LeafSVG({ size, color, style }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 100 140"
      fill={color} style={style} aria-hidden="true">
      <path d="M50 4C78 28 92 64 50 136C8 64 22 28 50 4Z" />
      <path d="M50 14V126" stroke="white" strokeOpacity=".25" strokeWidth="2" fill="none" />
    </svg>
  );
}

function BeanSVG({ size, color, style }) {
  return (
    <svg width={size} height={size * 0.67} viewBox="0 0 60 40"
      fill={color} style={style} aria-hidden="true">
      <ellipse cx="30" cy="20" rx="28" ry="18" />
      <path d="M30 4Q38 12 38 20Q38 28 30 36" stroke="rgba(255,255,255,.3)" strokeWidth="2" fill="none" />
      <path d="M30 4Q22 12 22 20Q22 28 30 36" stroke="rgba(255,255,255,.3)" strokeWidth="2" fill="none" />
    </svg>
  );
}

// ─── AMBIENT BG ───────────────────────────────────────────────────────
const LEAVES_CFG = [
  { top:"2%",  left:"-5%", size:200, rot:-18, col:"#8B5E34", dur:22, dl:0 },
  { top:"18%", left:"91%", size:140, rot:22,  col:"#6F8F5C", dur:18, dl:-5 },
  { top:"44%", left:"-4%", size:170, rot:6,   col:"#6F8F5C", dur:26, dl:-8 },
  { top:"65%", left:"93%", size:210, rot:-10, col:"#8B5E34", dur:20, dl:-12 },
  { top:"85%", left:"5%",  size:140, rot:28,  col:"#6F8F5C", dur:24, dl:-3 },
];
const BEANS_CFG = [
  { top:"10%", left:"8%",  size:36, rot:25,  col:"#8B5E34", dur:16, dl:-6 },
  { top:"30%", left:"87%", size:28, rot:-15, col:"#6F4E37", dur:20, dl:-2 },
  { top:"52%", left:"12%", size:32, rot:40,  col:"#8B5E34", dur:18, dl:-9 },
  { top:"72%", left:"80%", size:30, rot:-35, col:"#6F4E37", dur:22, dl:-4 },
  { top:"88%", left:"45%", size:26, rot:15,  col:"#8B5E34", dur:14, dl:-7 },
  { top:"5%",  left:"55%", size:22, rot:-20, col:"#6F4E37", dur:19, dl:-1 },
];

function AmbientBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      <style>{`
        @keyframes bgLeaf {
          0%,100% { transform: var(--br) rotate(0deg) translate(0,0); }
          33%      { transform: var(--br) rotate(5deg) translate(6px,-5px); }
          66%      { transform: var(--br) rotate(-3deg) translate(-4px,3px); }
        }
        @keyframes bgBean {
          0%,100% { transform: var(--br) translateY(0); }
          50%      { transform: var(--br) translateY(-7px); }
        }
        .bg-leaf { animation: bgLeaf var(--d) ease-in-out infinite; animation-delay: var(--dl); will-change: transform; }
        .bg-bean { animation: bgBean var(--d) ease-in-out infinite; animation-delay: var(--dl); will-change: transform; }
      `}</style>
      {LEAVES_CFG.map((l, i) => (
        <div key={i} className="bg-leaf absolute opacity-[0.055]"
          style={{ top:l.top, left:l.left, "--br":`rotate(${l.rot}deg)`, "--d":`${l.dur}s`, "--dl":`${l.dl}s` }}>
          <LeafSVG size={l.size} color={l.col} />
        </div>
      ))}
      {BEANS_CFG.map((b, i) => (
        <div key={i} className="bg-bean absolute opacity-[0.08]"
          style={{ top:b.top, left:b.left, "--br":`rotate(${b.rot}deg)`, "--d":`${b.dur}s`, "--dl":`${b.dl}s` }}>
          <BeanSVG size={b.size} color={b.col} />
        </div>
      ))}
    </div>
  );
}

// ─── PARTIKEL HERO (dikurangi untuk performa) ─────────────────────────
const PARTICLES = [
  { l:"8%",  s:22, d:18, dl:0   },
  { l:"38%", s:18, d:20, dl:-10 },
  { l:"70%", s:20, d:16, dl:-14 },
  { l:"93%", s:24, d:19, dl:-2  },
];
const LEAF_PARTS = [
  { l:"15%", s:28, d:26, dl:-7 },
  { l:"72%", s:32, d:30, dl:-3 },
];

function HeroParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[4] overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0) rotate(0deg) scale(1); opacity:0; }
          10%  { opacity:.55; }
          90%  { opacity:.28; }
          100% { transform: translateY(-110vh) rotate(360deg) scale(.6); opacity:0; }
        }
        .hp { animation: floatUp linear infinite; will-change: transform; position:absolute; bottom:0; }
      `}</style>
      {PARTICLES.map((p, i) => (
        <div key={i} className="hp" style={{ left:p.l, animationDuration:`${p.d}s`, animationDelay:`${p.dl}s`, opacity:.5 }}>
          <BeanSVG size={p.s} color="#8B5E34" />
        </div>
      ))}
      {LEAF_PARTS.map((p, i) => (
        <div key={i} className="hp" style={{ left:p.l, animationDuration:`${p.d}s`, animationDelay:`${p.dl}s`, opacity:.4 }}>
          <LeafSVG size={p.s} color="#6F8F5C" />
        </div>
      ))}
    </div>
  );
}

// ─── MORPH CARD (spring diringankan untuk performa) ───────────────────
function MorphCard({ item, target, isVisible }) {
  return (
    <motion.div
      animate={{
        x: target.x, y: target.y,
        rotate: target.rotation, scale: target.scale,
        opacity: isVisible ? target.opacity : 0,
      }}
      // FIX PERFORMA: stiffness & damping lebih ringan, mass sedikit lebih besar
      transition={{ type:"spring", stiffness:28, damping:12, mass:0.8 }}
      style={{ position:"absolute", width:60, height:85, transformStyle:"preserve-3d", perspective:"1000px" }}
      className="cursor-pointer group"
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle:"preserve-3d" }}
        transition={{ duration:.5, type:"spring", stiffness:220, damping:22 }}
        whileHover={{ rotateY:180 }}
      >
        <div className="absolute inset-0 overflow-hidden rounded-xl shadow-lg bg-[#EFE6DC]"
          style={{ backfaceVisibility:"hidden" }}>
          <img src={item.img} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
        </div>
        <div
          className="absolute inset-0 overflow-hidden rounded-xl shadow-lg bg-[#2F2D2C] flex flex-col items-center justify-center p-3 border border-[#C67C4E]/30"
          style={{ backfaceVisibility:"hidden", transform:"rotateY(180deg)" }}
        >
          <p className="text-[8px] font-black text-[#C67C4E] uppercase tracking-widest mb-1">{item.cat}</p>
          <p className="text-[9px] font-bold text-white text-center leading-snug">{item.name}</p>
          <p className="text-[8px] font-bold text-[#C67C4E] mt-1">{item.price}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── CUSTOM CURSOR ────────────────────────────────────────────────────
function FollowCursor() {
  const [isHover, setIsHover] = useState(false);
  const mX = useMotionValue(-100);
  const mY = useMotionValue(-100);
  const rX = useSpring(mX, { damping:25, stiffness:280, mass:.5 });
  const rY = useSpring(mY, { damping:25, stiffness:280, mass:.5 });

  useEffect(() => {
    const move = (e) => {
      mX.set(e.clientX); mY.set(e.clientY);
      setIsHover(!!e.target.closest("a,button,[data-cursor-hover]"));
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [mX, mY]);

  return (
    <>
      <motion.div className="fixed top-0 left-0 w-1.5 h-1.5 bg-[#C67C4E] rounded-full pointer-events-none z-[9999] hidden md:block"
        style={{ x:mX, y:mY, translateX:"-50%", translateY:"-50%" }} />
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-[#C67C4E]/50 pointer-events-none z-[9998] hidden md:block"
        style={{ x:rX, y:rY, translateX:"-50%", translateY:"-50%" }}
        animate={{ width:isHover?54:30, height:isHover?54:30, backgroundColor:isHover?"rgba(198,124,78,0.08)":"rgba(198,124,78,0)" }}
        transition={{ duration:.25, ease:"easeOut" }}
      />
    </>
  );
}

// ─── STAT MINI CARD ────────────────────────────────────────────────────
function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
      <div className="w-8 h-8 bg-[#C67C4E]/10 rounded-xl flex items-center justify-center shrink-0">
        <Icon size={15} className="text-[#C67C4E]" />
      </div>
      <div>
        <p className="text-sm font-black text-[#2F2D2C] leading-none">{value}</p>
        <p className="text-[10px] text-gray-400 font-bold mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ─── SCROLL PROGRESS BAR ──────────────────────────────────────────────
function ScrollProgressBar({ progress }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100 z-30 pointer-events-none">
      <motion.div
        className="h-full bg-gradient-to-r from-[#C67C4E] to-[#A05C32] origin-left"
        style={{ scaleX: progress }}
      />
    </div>
  );
}

// ─── SCROLL DOWN HINT (fase circle awal) ──────────────────────────────
function ScrollHint({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="scroll-hint"
          initial={{ opacity:0, y:10 }}
          animate={{ opacity:1, y:0 }}
          exit={{ opacity:0, y:10 }}
          transition={{ duration:.8, delay:.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none select-none"
        >
          <motion.p
            animate={{ opacity:[.5, 1, .5] }}
            transition={{ repeat:Infinity, duration:2, ease:"easeInOut" }}
            className="text-[10px] font-black tracking-[.3em] text-gray-400 uppercase"
          >
          </motion.p>
          {/* Animated chevron stack */}
          <div className="flex flex-col items-center gap-0.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity:[0, 1, 0], y:[0, 6, 0] }}
                transition={{
                  repeat:Infinity,
                  duration:1.4,
                  delay: i * 0.2,
                  ease:"easeInOut",
                }}
              >
                <ChevronDown size={14} className="text-[#C67C4E]" />
              </motion.div>
            ))}
          </div>
          {/* Mouse scroll icon */}
          <motion.div
            className="w-5 h-8 border-2 border-[#C67C4E]/50 rounded-full flex items-start justify-center p-1 mt-1"
            animate={{ opacity:[.6,1,.6] }}
            transition={{ repeat:Infinity, duration:2 }}
          >
            <motion.div
              className="w-1 h-1.5 bg-[#C67C4E] rounded-full"
              animate={{ y:[0, 12, 0] }}
              transition={{ repeat:Infinity, duration:1.4, ease:"easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ═════════════════════════════════════════════════════════════════════
// KOMPONEN UTAMA
// ═════════════════════════════════════════════════════════════════════
export default function ScrollMorphHero({ onNavigate }) {
  const containerRef   = useRef(null);
  const scrollRef      = useRef(0);
  const rafRef         = useRef(null);
  const autoRotRef     = useRef(0);
  // Batasi frekuensi setState untuk performa
  const lastRenderRef  = useRef(0);

  const [containerSize, setContainerSize] = useState({ width:0, height:0 });

  const morphProgress  = useRef(0);
  const rotateProgress = useRef(0);
  const [morphValue,  setMorphValue]  = useState(0);
  const [rotateValue, setRotateValue] = useState(0);

  // fase intro
  const [introPhase, setIntroPhase] = useState("scatter");
  const [morphActive, setMorphActive] = useState(false);

  // FASE FINAL
  const [finalPhase, setFinalPhase]   = useState(false);
  const [finalTrans, setFinalTrans]   = useState(0);
  const [autoRotate, setAutoRotate]   = useState(0);

  // parallax
  const mouseX  = useMotionValue(0);
  const sMouseX = useSpring(mouseX, { stiffness:20, damping:18 });
  const [parallax, setParallax] = useState(0);

  // scroll progress 0→1 untuk progress bar
  const scrollProgress = scrollRef.current / MAX_SCROLL;

  // ── container size ──
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(([e]) => {
      setContainerSize({ width:e.contentRect.width, height:e.contentRect.height });
    });
    obs.observe(containerRef.current);
    setContainerSize({ width:containerRef.current.offsetWidth, height:containerRef.current.offsetHeight });
    return () => obs.disconnect();
  }, []);

  // ── apply scroll (throttled untuk performa) ──
  const applyScroll = useCallback((next) => {
    scrollRef.current = next;
    morphProgress.current  = norm(next, 0, MORPH_END);
    rotateProgress.current = norm(next, MORPH_END, ROTATE_END);

    // Throttle setState: max 60fps
    const now = performance.now();
    if (now - lastRenderRef.current < 14) return;
    lastRenderRef.current = now;

    setMorphValue(morphProgress.current);
    setRotateValue(rotateProgress.current);

    if (next > 20 && !morphActive) setMorphActive(true);
    if (next <= 5) setMorphActive(false);

    if (next >= MAX_SCROLL && !finalPhase) {
      setFinalPhase(true);
    }
  }, [morphActive, finalPhase]);

  // ── Wheel / Touch handler ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e) => {
      const cur = scrollRef.current;
      if (finalPhase) return;

      const atBottom = cur >= MAX_SCROLL && e.deltaY > 0;
      const atTop    = cur <= 0          && e.deltaY < 0;
      if (atBottom || atTop) return;

      e.preventDefault();
      applyScroll(clamp(cur + e.deltaY, 0, MAX_SCROLL));
    };

    let ty = 0;
    const onTouchStart = (e) => { ty = e.touches[0].clientY; };
    const onTouchMove  = (e) => {
      const cur = scrollRef.current;
      if (finalPhase) return;
      const dy = ty - e.touches[0].clientY;
      ty = e.touches[0].clientY;
      const atBottom = cur >= MAX_SCROLL && dy > 0;
      const atTop    = cur <= 0          && dy < 0;
      if (atBottom || atTop) return;
      e.preventDefault();
      applyScroll(clamp(cur + dy, 0, MAX_SCROLL));
    };

    el.addEventListener("wheel",      onWheel,      { passive:false });
    el.addEventListener("touchstart", onTouchStart, { passive:true });
    el.addEventListener("touchmove",  onTouchMove,  { passive:false });
    return () => {
      el.removeEventListener("wheel",      onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove",  onTouchMove);
    };
  }, [morphActive, finalPhase, applyScroll]);

  // ── Reset saat page kembali ke atas ──
  useEffect(() => {
    if (!finalPhase) return;
    const onWinScroll = () => {
      if (window.scrollY <= 10) {
        if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
        autoRotRef.current = 0;
        setAutoRotate(0);
        setFinalPhase(false);
        setFinalTrans(0);
        scrollRef.current = 0;
        setMorphValue(0);
        setRotateValue(0);
        setMorphActive(false);
        setIntroPhase("circle");
      }
    };
    window.addEventListener("scroll", onWinScroll, { passive:true });
    return () => window.removeEventListener("scroll", onWinScroll);
  }, [finalPhase]);

  // ── Auto-rotate half-circle saat finalPhase ──
  useEffect(() => {
    if (!finalPhase) return;
    let startTime = null;
    const transDur = 800;

    const step = (ts) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const t = Math.min(elapsed / transDur, 1);
      setFinalTrans(t);

      autoRotRef.current += 0.10; // sedikit lebih lambat = lebih smooth
      setAutoRotate(autoRotRef.current);

      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [finalPhase]);

  // ── Mouse parallax ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      mouseX.set(((e.clientX - r.left) / r.width * 2 - 1) * 60);
    };
    el.addEventListener("mousemove", onMove, { passive: true });
    return () => el.removeEventListener("mousemove", onMove);
  }, [mouseX]);

  useEffect(() => {
    const unsub = sMouseX.on("change", setParallax);
    return unsub;
  }, [sMouseX]);

  // ── Intro sequence ──
  useEffect(() => {
    if (finalPhase) return;
    const t1 = setTimeout(() => setIntroPhase("line"),   500);
    const t2 = setTimeout(() => setIntroPhase("circle"), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [finalPhase]);

  // ── Scatter positions ──
  const scatterPos = useMemo(() =>
    MORPH_ITEMS.map(() => ({
      x: (Math.random() - .5) * 1400, y: (Math.random() - .5) * 900,
      rotation: (Math.random() - .5) * 180, scale:.6, opacity:0,
    })), []);

  // ── FIX #1: Circle & arc targets — lingkaran digeser ke KANAN ──
  const arcTargets = useMemo(() => {
    const { width:W, height:H } = containerSize;
    if (!W || !H) return MORPH_ITEMS.map(() => ({ x:0, y:0, rotation:0, scale:1, opacity:1 }));

    const isMobile  = W < 768;
    const minDim    = Math.min(W, H);
    const circleR   = Math.min(minDim * .35, 350);

    // FIX: geser pusat lingkaran ke kanan (15% dari tengah untuk desktop)
    const circleOffsetX = isMobile ? 0 : W * 0.15;

    const baseR     = Math.min(W, H * 1.5);
    const arcR      = baseR * (isMobile ? 1.4 : 1.1);
    const apexY     = H * (isMobile ? .35 : .25);
    const arcCY     = apexY + arcR;
    const spread    = isMobile ? 100 : 130;
    const startA    = -90 - spread / 2;
    const stepA     = spread / (TOTAL_CARDS - 1);
    const maxRot    = spread * .8;
    const boundedRot = -rotateValue * maxRot;

    return MORPH_ITEMS.map((_, i) => {
      const cAngle = (i / TOTAL_CARDS) * 360;
      const cRad   = cAngle * Math.PI / 180;
      // FIX: tambahkan circleOffsetX agar lingkaran lebih ke kanan
      const cx     = Math.cos(cRad) * circleR + circleOffsetX;
      const cy     = Math.sin(cRad) * circleR;

      const aAngle = startA + i * stepA + boundedRot;
      const aRad   = aAngle * Math.PI / 180;
      const ax     = Math.cos(aRad) * arcR + parallax;
      const ay     = Math.sin(aRad) * arcR + arcCY;
      const arcScale = isMobile ? 1.4 : 1.8;

      return {
        x:        lerp(cx, ax, morphValue),
        y:        lerp(cy, ay, morphValue),
        rotation: lerp(cAngle + 90, aAngle + 90, morphValue),
        scale:    lerp(1, arcScale, morphValue),
        opacity:  1,
      };
    });
  }, [containerSize, morphValue, rotateValue, parallax]);

  // ── Half-circle targets (fase final, posisi KANAN) ──
  const halfCircleTargets = useMemo(() => {
    const { width:W, height:H } = containerSize;
    if (!W || !H) return MORPH_ITEMS.map(() => ({ x:0, y:0, rotation:0, scale:1, opacity:1 }));

    const isMobile = W < 768;
    const R        = Math.min(Math.min(W, H) * 0.40, 320);
    const cx       = isMobile ? 0 : W * 0.26;
    const cy       = 0;
    const cardScale = isMobile ? 1.2 : 1.5;

    return MORPH_ITEMS.map((_, i) => {
      const angle    = (i / (TOTAL_CARDS - 1)) * 180 - 90 + autoRotate;
      const rad      = angle * Math.PI / 180;
      const x        = Math.cos(rad) * R + cx;
      const y        = Math.sin(rad) * R + cy;

      return {
        x, y,
        rotation: angle + 90,
        scale:    cardScale,
        opacity:  1,
      };
    });
  }, [containerSize, autoRotate]);

  // ── Lerp antara arc → half-circle saat transisi ──
  const blendedTargets = useMemo(() => {
    if (!finalPhase) return arcTargets;
    return MORPH_ITEMS.map((_, i) => {
      const a = arcTargets[i];
      const h = halfCircleTargets[i];
      const t = finalTrans;
      const e = t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2;
      return {
        x:        lerp(a.x, h.x, e),
        y:        lerp(a.y, h.y, e),
        rotation: lerp(a.rotation, h.rotation, e),
        scale:    lerp(a.scale, h.scale, e),
        opacity:  1,
      };
    });
  }, [finalPhase, finalTrans, arcTargets, halfCircleTargets]);

  // ── Get card target ──
  function getCardTarget(i) {
    if (finalPhase || morphActive) return blendedTargets[i];
    if (introPhase === "scatter")  return scatterPos[i];
    if (introPhase === "line") {
      const spacing = 70, total = TOTAL_CARDS * spacing;
      return { x: i * spacing - total / 2, y:0, rotation:0, scale:1, opacity:1 };
    }
    // circle
    const { width:W, height:H } = containerSize;
    if (!W) return { x:0, y:0, rotation:0, scale:1, opacity:1 };
    const R = Math.min(Math.min(W,H) * .35, 350);
    const a = (i / TOTAL_CARDS) * 360;
    const r = a * Math.PI / 180;
    // FIX: apply same rightward offset untuk circle stage
    const circleOffsetX = W < 768 ? 0 : W * 0.15;
    return {
      x: Math.cos(r)*R + circleOffsetX,
      y: Math.sin(r)*R,
      rotation: a+90, scale:1, opacity:1,
    };
  }

  // ── Visibility & opacity ──
  const heroLeftOpacity = morphActive && !finalPhase ? Math.max(0, 1 - morphValue * 2.5) : 1;
  const heroLeftY       = morphActive && !finalPhase ? morphValue * -20 : 0;

  // FIX #2: arc content — opacity mulai lebih awal & posisi tidak terpotong
  // Sebelumnya: top-[8%] dan opacity mulai dari morphValue .8
  // Fix: muncul lebih smooth, dan posisi center secara vertikal agar tidak terpotong navbar
  const arcContentOpacity = morphActive && !finalPhase
    ? Math.max(0, (morphValue - 0.75) / 0.25)
    : 0;
  // Tidak pakai y offset besar supaya teks tidak terpotong
  const arcContentY = morphActive && !finalPhase
    ? lerp(16, 0, norm(morphValue, 0.75, 1))
    : 16;

  // final layout opacity
  const finalContentOp = finalPhase ? Math.min(1, finalTrans * 2) : 0;

  // scroll progress untuk progress bar (reaktif)
  const [scrollPct, setScrollPct] = useState(0);
  useEffect(() => {
    // update progress bar setiap kali morphValue berubah
    setScrollPct(scrollRef.current / MAX_SCROLL);
  }, [morphValue]);

  return (
    <div ref={containerRef}
      className="relative w-full overflow-hidden bg-[#FAFAF8]"
      style={{ height:"100vh", minHeight:600, cursor:"none" }}>

      <FollowCursor />
      <AmbientBg />
      <HeroParticles />

      {/* ─── SCROLL PROGRESS BAR ─── */}
      <ScrollProgressBar progress={scrollPct} />

      {/* ─── HERO KIRI: teks + CTA ─── */}
      <motion.div
        className="absolute z-10 flex flex-col justify-center h-full pl-10 sm:pl-16"
        style={{ opacity: heroLeftOpacity, y: heroLeftY, maxWidth: 460 }}
      >
        <motion.div
          initial={{ opacity:0, y:24, filter:"blur(10px)" }}
          animate={{ opacity:1, y:0,  filter:"blur(0px)" }}
          transition={{ duration:.8, ease:[.16,1,.3,1] }}
        >
          <span className="inline-block text-[10px] font-black text-[#C67C4E] uppercase tracking-[.3em] mb-5 bg-[#C67C4E]/10 px-4 py-1.5 rounded-full">
            Sejak Pagi, Tanpa Basa-basi
          </span>
          <h1 style={{ fontSize:"clamp(30px, 4.2vw, 54px)", lineHeight:1.06 }}
            className="font-black mb-5 text-[#2F2D2C]">
            Kopi yang{" "}
            <span className="font-serif text-[#C67C4E]" style={{ fontStyle:"italic" }}>diingat</span>,
            <br />bukan cuma diminum.
          </h1>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed max-w-sm">
            Setiap cangkir diseduh dari biji pilihan. Makin sering mampir,
            makin banyak untungnya lewat sistem member otomatis kami.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate?.("menu")}
              data-cursor-hover
              className="inline-flex items-center gap-2 bg-[#C67C4E] hover:bg-[#A05C32] text-white px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Lihat Menu <ArrowRight size={14} />
            </button>
            <button
              onClick={() => onNavigate?.("/member-login")}
              data-cursor-hover
              className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-[#C67C4E] px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-gray-600 transition-colors"
            >
              <Heart size={13} className="text-[#C67C4E]" /> Portal Member
            </button>
          </div>

          {/* Stat mini cards — muncul di fase final */}
          <AnimatePresence>
            {finalPhase && (
              <motion.div
                key="stats"
                initial={{ opacity:0, y:14 }}
                animate={{ opacity: finalContentOp, y:0 }}
                exit={{ opacity:0 }}
                transition={{ duration:.5, delay:.2 }}
                className="mt-6 flex flex-col gap-2.5"
              >
                <StatCard icon={Coffee} value="12+" label="Pilihan menu" />
                <StatCard icon={Star}   value="4.9" label="Rating pelanggan" />
                <StatCard icon={Users}  value="3 Tier" label="Sistem member" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* ─── KARTU (circle → arc → half-circle) ─── */}
      {/* FIX: justify-center tetap, lingkaran offset-nya sudah ada di getCardTarget */}
      <div className="absolute inset-0 flex items-center justify-center z-[5] pointer-events-none">
        {MORPH_ITEMS.map((item, i) => (
          <MorphCard
            key={`${item.id}-${i}`}
            item={item}
            target={getCardTarget(i)}
            isVisible={introPhase !== "scatter"}
          />
        ))}
      </div>

      {/* ─── FIX #2: Arc content — posisi tidak terpotong ─── */}
      {/* Sebelumnya: top-[8%] → sekarang top-[15%] agar tidak terpotong navbar */}
      {/* Dan min-height agar konten tidak kepotong */}
      <motion.div
        className="absolute top-[15%] left-0 right-0 z-[15] flex flex-col items-center text-center px-6 pointer-events-none"
        style={{ opacity: arcContentOpacity, y: arcContentY }}
      >
        <h2 className="text-3xl sm:text-5xl font-black text-[#2F2D2C] font-serif italic tracking-tight mb-4">
          Jelajahi Menu Kami
        </h2>
        <p className="text-sm text-gray-500 max-w-md leading-relaxed">
          Scroll terus untuk menelusuri koleksi kopi dan makanan Bogeng.
          <br className="hidden md:block" />
          Hover kartu untuk melihat nama dan harga.
        </p>
        {/* Subtle scroll reminder saat arc muncul */}
        <motion.div
          className="flex flex-col items-center gap-1.5 mt-6"
          animate={{ opacity:[.4,1,.4] }}
          transition={{ repeat:Infinity, duration:2, ease:"easeInOut" }}
        >
          <p className="text-[9px] font-black tracking-[.25em] text-gray-400 uppercase">Terus scroll</p>
          <ChevronDown size={16} className="text-[#C67C4E]" />
        </motion.div>
      </motion.div>

      {/* ─── FIX #3: Konten fase final — HAPUS best seller cards ─── */}
      {/* Diganti dengan: stats sudah ada di kiri, kanan ada scroll hint yang jelas */}
      <AnimatePresence>
        {finalPhase && (
          <motion.div
            key="final-center"
            initial={{ opacity:0, y:12 }}
            animate={{ opacity: finalContentOp, y:0 }}
            exit={{ opacity:0 }}
            transition={{ duration:.6 }}
            className="absolute z-[15] pointer-events-auto flex flex-col items-center justify-center text-center"
            style={{
              left: "clamp(280px, 30%, 400px)",
              right: "clamp(200px, 28%, 320px)",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {/* Label */}
            <motion.p
              initial={{ opacity:0, y:8 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:.3 }}
              className="text-[9px] font-black text-gray-400 uppercase tracking-[.3em] mb-4"
            >
              Semua sudah siap
            </motion.p>
            {/* Tagline */}
            <motion.p
              initial={{ opacity:0, scale:.95 }}
              animate={{ opacity:1, scale:1 }}
              transition={{ delay:.4 }}
              className="text-lg font-black text-[#2F2D2C] leading-tight mb-2"
            >
              12+ menu siap<br/>
              <span className="font-serif italic text-[#C67C4E]">menggugah selera</span>
            </motion.p>
            {/* CTA scroll ke bawah */}
            <motion.div
              className="flex flex-col items-center gap-2 mt-5"
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              transition={{ delay:.6 }}
            >
              <motion.div
                animate={{ opacity:[.4,1,.4], y:[0,5,0] }}
                transition={{ repeat:Infinity, duration:1.6, ease:"easeInOut" }}
                className="flex flex-col items-center gap-0.5"
              >
                <p className="text-[9px] font-black tracking-[.25em] text-[#C67C4E] uppercase mb-1">
                  Scroll untuk lihat halaman
                </p>
                {[0,1].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity:[0,1,0], y:[0,6,0] }}
                    transition={{ repeat:Infinity, duration:1.4, delay:i*0.18 }}
                  >
                    <ChevronDown size={14} className="text-[#C67C4E]" />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── FIX: Scroll hint yang lebih baik di fase circle awal ─── */}
      <ScrollHint visible={introPhase === "circle" && !morphActive} />

      {/* ─── Radial glow ─── */}
      {morphActive && (
        <div
          className="absolute inset-0 z-[3] pointer-events-none"
          style={{
            background: [
              "radial-gradient(ellipse 70% 60% at 50% 80%, rgba(255,252,248,.5) 0%, transparent 100%)",
              "linear-gradient(to bottom, rgba(250,247,242,.3) 0%, transparent 40%)",
            ].join(","),
          }}
        />
      )}
    </div>
  );
}