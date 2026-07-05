// src/components/ui/AmbientDecor.jsx
// ─────────────────────────────────────────────────────────────────────
// Komponen dekorasi "daun & biji kopi" yang tadinya di-copy-paste 2x:
//   1) AmbientBg     -> di dalam ScrollMorphHero.jsx
//   2) AmbientLeaves -> di dalam BogengLandingPage.jsx
// Isinya sama persis (posisi, warna, animasi float), cuma beda nama.
// Sekarang digabung jadi satu komponen yang di-import di kedua tempat,
// supaya kalau mau ubah posisi/animasi daun, cukup edit di SATU file ini.
//
// Dipakai juga oleh MenuSectionLeaves & AboutSection (BogengLandingPage)
// lewat named export <LeafShape/>, dan lewat class CSS ".leaf-anim" /
// ".bean-anim" + custom property "--base-t / --dur / --delay" yang
// keyframes-nya didefinisikan sekali di sini (variant="wide").
// ─────────────────────────────────────────────────────────────────────
import React from "react";

// ─── SVG SHAPES (dipakai lepas oleh komponen lain juga) ───────────────
export function LeafShape({ size = 100, color = "currentColor", style, className }) {
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 100 140"
      fill={color}
      style={style}
      className={className}
      aria-hidden="true"
    >
      <path d="M50 4C78 28 92 64 50 136C8 64 22 28 50 4Z" />
      <path d="M50 14V126" stroke="white" strokeOpacity=".25" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function BeanShape({ size = 40, color = "currentColor", style, className }) {
  return (
    <svg
      width={size}
      height={size * 0.67}
      viewBox="0 0 60 40"
      fill={color}
      style={style}
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="30" cy="20" rx="28" ry="18" />
      <path d="M30 4Q38 12 38 20Q38 28 30 36" stroke="rgba(255,255,255,.3)" strokeWidth="2" fill="none" />
      <path d="M30 4Q22 12 22 20Q22 28 30 36" stroke="rgba(255,255,255,.3)" strokeWidth="2" fill="none" />
    </svg>
  );
}

// ─── KONFIGURASI POSISI ────────────────────────────────────────────────
// "wide": sebaran besar untuk full-page background (dulu AmbientBg & AmbientLeaves)
const WIDE_LEAVES = [
  { top: "2%",  left: "-5%", size: 200, rot: -18, col: "#8B5E34", dur: 22, dl: 0 },
  { top: "18%", left: "91%", size: 140, rot: 22,  col: "#6F8F5C", dur: 18, dl: -5 },
  { top: "44%", left: "-4%", size: 170, rot: 6,   col: "#6F8F5C", dur: 26, dl: -8 },
  { top: "65%", left: "93%", size: 210, rot: -10, col: "#8B5E34", dur: 20, dl: -12 },
  { top: "85%", left: "5%",  size: 140, rot: 28,  col: "#6F8F5C", dur: 24, dl: -3 },
];
const WIDE_BEANS = [
  { top: "10%", left: "8%",  size: 36, rot: 25,  col: "#8B5E34", dur: 16, dl: -6 },
  { top: "30%", left: "87%", size: 28, rot: -15, col: "#6F4E37", dur: 20, dl: -2 },
  { top: "52%", left: "12%", size: 32, rot: 40,  col: "#8B5E34", dur: 18, dl: -9 },
  { top: "72%", left: "80%", size: 30, rot: -35, col: "#6F4E37", dur: 22, dl: -4 },
  { top: "88%", left: "45%", size: 26, rot: 15,  col: "#8B5E34", dur: 14, dl: -7 },
  { top: "5%",  left: "55%", size: 22, rot: -20, col: "#6F4E37", dur: 19, dl: -1 },
];

// "menu": sebaran kecil khusus section menu (dulu MenuSectionLeaves)
const MENU_LEAVES = [
  { top: "8%",  left: "-2%", size: 100, rot: -20, col: "#6F8F5C", dur: 14, dl: 0 },
  { top: "25%", left: "98%", size: 80,  rot: 30,  col: "#8B5E34", dur: 18, dl: -4 },
  { top: "55%", left: "-1%", size: 90,  rot: 10,  col: "#6F8F5C", dur: 16, dl: -8 },
  { top: "70%", left: "96%", size: 110, rot: -15, col: "#8B5E34", dur: 20, dl: -6 },
  { top: "90%", left: "10%", size: 70,  rot: 25,  col: "#6F8F5C", dur: 12, dl: -2 },
];

/**
 * AmbientDecor — daun & biji kopi yang melayang pelan di background.
 * variant:
 *   "wide" (default) — sebaran penuh 1 halaman (hero / landing page)
 *   "menu"            — sebaran kecil, khusus dekorasi section menu
 */
export default function AmbientDecor({ variant = "wide" }) {
  const leaves = variant === "menu" ? MENU_LEAVES : WIDE_LEAVES;
  const beans  = variant === "menu" ? [] : WIDE_BEANS;
  const leafOpacity = variant === "menu" ? 0.10 : 0.055;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Keyframes global — dipakai bareng oleh leaf-anim/bean-anim di
          mana pun (termasuk AboutSection & MenuSectionLeaves) via className. */}
      <style>{`
        @keyframes leafFloat {
          0%,100% { transform: var(--base-t) rotate(0deg) translate(0,0); }
          33%      { transform: var(--base-t) rotate(5deg) translate(6px,-5px); }
          66%      { transform: var(--base-t) rotate(-3deg) translate(-4px,3px); }
        }
        @keyframes beanFloat {
          0%,100% { transform: var(--base-t) translateY(0); }
          50%      { transform: var(--base-t) translateY(-7px); }
        }
        .leaf-anim { animation: leafFloat var(--dur) ease-in-out infinite; animation-delay: var(--delay); will-change: transform; }
        .bean-anim { animation: beanFloat var(--dur) ease-in-out infinite; animation-delay: var(--delay); will-change: transform; }
        @media (prefers-reduced-motion: reduce) {
          .leaf-anim, .bean-anim { animation: none !important; opacity: 0.04 !important; }
        }
      `}</style>
      {leaves.map((l, i) => (
        <div
          key={`leaf-${i}`}
          className="leaf-anim absolute"
          style={{
            top: l.top, left: l.left, opacity: leafOpacity,
            "--base-t": `rotate(${l.rot}deg)`, "--dur": `${l.dur}s`, "--delay": `${l.dl}s`,
          }}
        >
          <LeafShape size={l.size} color={l.col} />
        </div>
      ))}
      {beans.map((b, i) => (
        <div
          key={`bean-${i}`}
          className="bean-anim absolute"
          style={{
            top: b.top, left: b.left, opacity: 0.08,
            "--base-t": `rotate(${b.rot}deg)`, "--dur": `${b.dur}s`, "--delay": `${b.dl}s`,
          }}
        >
          <BeanShape size={b.size} color={b.col} />
        </div>
      ))}
    </div>
  );
}