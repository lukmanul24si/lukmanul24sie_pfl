import React from 'react';
import { User } from 'lucide-react';

// =========================================================================
// 🟢 TOPBAR / HEADER WORKSPACE — dipakai bareng di MainLayout.jsx
// (sebelumnya markup ini di-copy manual di dalam MainLayout, sekarang
// disatukan di sini biar satu-satunya sumber kebenaran/reusable)
// =========================================================================
const Topbar = () => {
  return (
    <header className="flex justify-between items-center pb-3 px-1 shrink-0 select-none">
      <div className="flex items-center gap-2.5">
        <div className="relative flex items-center justify-center w-7 h-7 rounded-xl bg-[#EDD6C8]/50 text-[#C67C4E] animate-[float_3s_ease-in-out_infinite] border-[0.5px] border-[#EDD6C8] shadow-sm">
          <span className="text-[14px]">☕</span>
          <span className="absolute -top-1.5 -right-1.5 text-[8px] animate-pulse">✨</span>
        </div>
        <div className="leading-tight">
          <h2 className="text-[13px] font-black tracking-tight text-[#313131]">
            Yo, Semangat Brew Hari Ini, <span className="text-[#C67C4E] underline decoration-wavy decoration-[#EDD6C8]/80 underline-offset-4 font-black">Lukman</span>! 🙌
          </h2>
          <p className="text-[9px] text-[#9B9B9B] font-bold mt-0.5">Kelola pesanan kedai dengan tingkat efisiensi luar nalar.</p>
        </div>
      </div>

      {/* Profil Singkat Admin */}
      <div className="flex items-center gap-2 bg-white p-1 pr-3 rounded-lg border-[0.5px] border-[#E3E3E3] shadow-sm">
        <div className="w-7 h-7 bg-[#313131] text-white rounded-md flex items-center justify-center shadow-sm">
          <User size={12} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black tracking-tight text-[#313131]">Lukmanul Hakim</span>
          <span className="text-[8px] font-bold text-[#C67C4E] tracking-wider uppercase">Owner / Admin</span>
        </div>
      </div>

      {/* Keyframe khusus Topbar */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-4px) rotate(6deg); }
        }
      `}</style>
    </header>
  );
};

export default Topbar;