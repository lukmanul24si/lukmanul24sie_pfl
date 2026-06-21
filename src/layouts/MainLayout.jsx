import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// ✅ UPDATE: Menambahkan ikon UserCheck dan Home ke dalam import
import { Coffee, Receipt, Users, UserCheck, LogOut, Plus, User, Home } from 'lucide-react';
import { MessageSquareText } from 'lucide-react';

// =========================================================================
// 🔴 CUSTOM CURSOR GLOBAL
// =========================================================================
import CustomCursor from "../components/CustomCursor";
import { useApp } from '../context/AppContext'; // ✅ TAMBAHAN: Import context untuk fungsi logout

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useApp(); // ✅ TAMBAHAN: Ambil fungsi logout dari AppContext

  // ✅ UPDATE: Menambahkan menu CRM Members ke dalam array navigasi figma kedai
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Coffee },
    { name: 'Daftar Pesanan', path: '/orders', icon: Receipt },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Ulasan Pelanggan', path: '/reviews', icon: MessageSquareText },
  ];

  // =========================================================================
  // 🔴 HANDLE LOGOUT FIX (ANTI-STUCK & TIDAK MENGHAPUS DATABASE LOCALSTORAGE)
  // =========================================================================
  const handleLogout = () => {
    if (confirm("Keluar dari aplikasi POS Bogeng Coffee?")) {
      try {
        // 1. Paksa bersihkan sisa backdrop modal/dialog Radix UI di root HTML
        document.body.style.removeProperty("pointer-events");
        document.body.style.removeProperty("overflow");
        document.body.style.pointerEvents = "auto";
        document.body.style.overflow = "unset";

        document.documentElement.style.removeProperty("pointer-events");
        document.documentElement.style.removeProperty("overflow");
        document.documentElement.style.pointerEvents = "auto";
        document.documentElement.style.overflow = "unset";

        // 2. 🟢 PERBAIKAN FATAL: Hanya hapus token sesi saja, database aman tidak terhapus!
        localStorage.removeItem('bogeng_user');
        localStorage.removeItem('bogeng_member_session');
        sessionStorage.clear();

        // 3. Update state global user di context menjadi null
        logout();
      } catch (error) {
        console.error("Gagal membersihkan sesi login:", error);
      } finally {
        // 4. Hard-bounce redirect langsung ke login
        setTimeout(() => {
          window.location.replace("/login");
        }, 50);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F2ED] p-4 flex justify-center items-center font-sans antialiased selection:bg-[#C67C4E]/20 text-[#313131]">
      
      {/* 🔴 AKTIVASI TAMPILAN CURSOR HUMANIZED */}
      <CustomCursor />

      <div className="w-full max-w-[1440px] h-[calc(100vh-2rem)] grid grid-cols-12 gap-4 relative overflow-hidden">
        
        {/* ========================================================= */}
        {/* SIDEBAR RAMPING & PRESISI (ANIMATED)                      */}
        {/* ========================================================= */}
        <aside className="col-span-2 bg-white rounded-xl p-4 flex flex-col justify-between border-[0.5px] border-[#E3E3E3] shadow-[0_2px_12px_rgba(0,0,0,0.01)] select-none">
          <div className="flex flex-col gap-6">
            
            {/* Logo Brand "BOGENG" */}
            <motion.div 
              className="flex items-center gap-3 px-1 py-1 cursor-pointer relative group/logo"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/dashboard')}
            >
              <div className="relative">
                {/* Tunas Daun Kopi */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex justify-center items-end pointer-events-none z-20 origin-bottom animate-[leafSway_4s_ease-in-out_infinite]">
                  <div className="w-[1.5px] h-2 bg-[#5D4037]" />
                  <div className="absolute bottom-1 right-0 w-2.5 h-1.5 bg-[#81C784] rounded-tl-full rounded-br-full border-[0.5px] border-[#3E2723] rotate-[-20deg]" />
                  <div className="absolute bottom-1.5 left-0 w-2.5 h-1.5 bg-[#4CAF50] rounded-tr-full rounded-bl-full border-[0.5px] border-[#3E2723] rotate-[20deg]" />
                </div>

                {/* Kotak Logo "B" */}
                <motion.div 
                  animate={{ y: [0, -2, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="w-8 h-8 bg-[#C67C4E] rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0 shadow-md shadow-[#C67C4E]/10 relative z-10 border border-[#A05C32]"
                >
                  B
                </motion.div>
              </div>

              {/* Teks Nama Brand */}
              <div className="flex flex-col leading-none relative">
                <span className="absolute -top-2.5 -right-4 text-[9px] animate-[sparkle_1.5s_ease-in-out_infinite]">✨</span>
                <span className="absolute top-2 -right-3 text-[6px] animate-[sparkle_2s_ease-in-out_infinite_0.5s]">✨</span>

                <span className="text-[11px] font-black tracking-tight text-[#313131] block group-hover/logo:text-[#C67C4E] transition-colors duration-200">
                  BOGENG
                </span>
                <span className="text-[8px] font-bold tracking-[0.12em] text-[#9B9B9B] mt-0.5 block uppercase">
                  COFFEE SHOP
                </span>
              </div>
            </motion.div>

            {/* Menu Navigasi Dinamis */}
            <nav className="flex flex-col gap-1 relative">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const IconComponent = item.icon;
                return (
                  <Link key={item.path} to={item.path} className="relative py-0.5 block group/item">
                    <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-bold text-[11px] transition-colors duration-200 relative z-10 ${
                      isActive ? 'text-white' : 'text-[#9B9B9B] hover:text-[#313131]'
                    }`}>
                      <IconComponent size={14} className="shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                      <span className="tracking-tight truncate">{item.name}</span>
                    </div>

                    {/* Background Slider Aktif */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavigationIndicator"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="absolute inset-0 bg-[#C67C4E] rounded-lg shadow-sm shadow-[#C67C4E]/10"
                      />
                    )}
                  </Link>
                );
              })}

              {/* 🟢 UPDATE TAMBAHAN: AKSES HUBUNGAN LUAR KE LANDING PAGE */}
              <Link to="/" className="relative py-0.5 block group/item">
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-bold text-[11px] text-amber-700 hover:bg-amber-50/60 transition-colors duration-200 relative z-10">
                  <Home size={14} className="shrink-0" strokeWidth={2} />
                  <span className="tracking-tight truncate">Landing Page</span>
                </div>
              </Link>

              {/* Tombol Logout Sesuai Request Projek Kasir */}
              <motion.button 
                whileHover={{ x: 2 }}
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-bold text-[11px] text-red-500 hover:bg-red-50/50 transition-all mt-2 text-left w-full cursor-pointer"
              >
                <LogOut size={14} className="shrink-0" strokeWidth={2} />
                <span className="tracking-tight">Logout</span>
              </motion.button>
            </nav>
          </div>

          {/* QUICK ACTION: NEW ORDER */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            animate={{
              boxShadow: [
                "0 4px 12px rgba(49,49,49,0.05)",
                "0 4px 20px rgba(198,124,78,0.2)",
                "0 4px 12px rgba(49,49,49,0.05)"
              ]
            }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="relative overflow-hidden bg-[#313131] hover:bg-[#C67C4E] p-3 rounded-xl border-[0.5px] border-[#313131] hover:border-[#C67C4E] flex flex-col items-center gap-2 text-center group cursor-pointer transition-colors duration-300"
            onClick={() => navigate('/dashboard')}
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.2s_ease-in-out_infinite] pointer-events-none" />
            <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest relative z-10 transition-colors group-hover:text-white">New Order</p>
            <div className="w-7 h-7 bg-white/10 group-hover:bg-white text-white group-hover:text-[#C67C4E] rounded-full flex items-center justify-center font-bold transition-all duration-300 relative z-10 shadow-inner">
              <Plus size={14} strokeWidth={3} className="transition-transform duration-500 group-hover:rotate-180" />
              <span className="absolute inline-flex h-full w-full rounded-full bg-white/20 opacity-75 animate-ping pointer-events-none group-hover:bg-[#C67C4E]/30" />
            </div>
          </motion.div>
        </aside>

        {/* ========================================================= */}
        {/* MAIN WORKSPACE (10 KOLOM)                                 */}
        {/* ========================================================= */}
        <main className="col-span-10 flex flex-col h-full overflow-hidden">
          
          {/* Header Workspace */}
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
          </header>

          {/* Canvas Putih Utama */}
          <div className="flex-1 bg-white rounded-xl border-[0.5px] border-[#E3E3E3] p-4 overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="w-full h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

      </div>

      {/* CSS Injected Keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-4px) rotate(6deg); }
        }
        @keyframes leafSway {
          0%, 100% { transform: translateX(-50%) rotate(0deg); }
          50% { transform: translateX(-50%) rotate(8deg); }
        }
        @keyframes sparkle {
          0%, 100% { transform: scale(0.8); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default MainLayout;