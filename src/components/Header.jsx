import React from 'react';

const Header = () => (
  <header className="h-20 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10 border-b border-orange-50">
    <div className="flex items-center gap-2">
      <span className="text-2xl">☕</span>
      <h1 className="text-lg font-black text-orange-900 uppercase tracking-tight">Coffee Shop POS</h1>
    </div>
    <div className="flex items-center gap-4 bg-orange-50 px-4 py-2 rounded-2xl">
      <div className="text-right">
        <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">Kasir Aktif</p>
        <p className="text-sm font-black text-gray-800">Abang Kopi</p>
      </div>
      <div className="w-10 h-10 bg-orange-600 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white font-bold">A</div>
    </div>
  </header>
);

export default Header;