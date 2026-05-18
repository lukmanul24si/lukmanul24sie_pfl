import React from 'react';

const Topbar = () => {
  // Mengambil nama secara dinamis, kalau kosong defaultnya Lukman
  const activeUser = localStorage.getItem('logged_in_user') || 'Lukman';

  return (
    <div className="w-full h-12 bg-transparent flex justify-between items-center px-4 shrink-0 select-none">
      
      {/* Sapaan Karib, Akrab & Gaul dengan Animasi Ambiance */}
      <div className="flex items-center gap-2">
        {/* Kontainer Cangkir Kopi Melayang Elegan */}
        <div className="relative flex items-center justify-center w-6 h-6 rounded-lg bg-[#EDD6C8]/40 text-[#C67C4E] animate-[float_3s_ease-in-out_infinite]">
          <span className="text-[12px]">☕</span>
          {/* Animasi Efek Kilau Bintang */}
          <span className="absolute -top-1 -right-1 text-[8px] animate-pulse">✨</span>
        </div>

        <div className="leading-tight">
          <h2 className="text-[11px] font-black tracking-tight text-[#313131]">
            Yo, Semangat Brew Hari Ini, <span className="text-[#C67C4E] underline decoration-wavy decoration-[#EDD6C8] underline-offset-2">{activeUser}</span>! 🙌
          </h2>
          <p className="text-[8px] text-[#9B9B9B] font-bold mt-0.5">
            Kelola pesanan kedai dengan efisiensi tingkat tinggi.
          </p>
        </div>
      </div>

      {/* Profil Badge Admin Pojok Kanan */}
      <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-xl border-[0.5px] border-[#E3E3E3] shadow-sm">
        <div className="w-5 h-5 rounded-lg bg-[#313131] text-white flex items-center justify-center text-[8px] font-black">
          LH
        </div>
        <div className="leading-none pr-1">
          <h4 className="text-[8px] font-black tracking-tight text-[#313131] uppercase">Lukman Hakim</h4>
          <p className="text-[6px] font-bold text-[#C67C4E] uppercase tracking-wider mt-0.5">Owner / Admin</p>
        </div>
      </div>

      {/* Inject Keyframe Khusus Animasi Floating */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(4deg); }
        }
      `}</style>

    </div>
  );
};

export default Topbar;