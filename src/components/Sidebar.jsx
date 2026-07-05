import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Coffee, Receipt, Users, LogOut, Plus, Home } from 'lucide-react';
import { MessageSquareText } from 'lucide-react';

// =========================================================================
// 🟢 SIDEBAR BOGENG COFFEE — dipakai bareng di MainLayout.jsx
// (sebelumnya markup ini di-copy manual di dalam MainLayout, sekarang
// disatukan di sini biar satu-satunya sumber kebenaran/reusable)
// =========================================================================
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useApp();

  const menuItems = [
    { name: 'Dashboard',        path: '/dashboard', icon: Coffee },
    { name: 'Daftar Pesanan',   path: '/orders',     icon: Receipt },
    { name: 'Customers',        path: '/customers',  icon: Users },
    { name: 'Ulasan Pelanggan', path: '/reviews',    icon: MessageSquareText },
  ];

  // ================= HANDLE LOGOUT FIX (ANTI-STUCK) =================
  const handleLogout = () => {
    if (confirm("Keluar dari aplikasi POS Bogeng Coffee?")) {
      try {
        document.body.style.removeProperty("pointer-events");
        document.body.style.removeProperty("overflow");
        document.body.style.pointerEvents = "auto";
        document.body.style.overflow = "unset";

        document.documentElement.style.removeProperty("pointer-events");
        document.documentElement.style.removeProperty("overflow");
        document.documentElement.style.pointerEvents = "auto";
        document.documentElement.style.overflow = "unset";

        localStorage.removeItem('bogeng_user');
        localStorage.removeItem('bogeng_member_session');
        sessionStorage.clear();

        logout();
      } catch (error) {
        console.error("Gagal membersihkan sesi login:", error);
      } finally {
        setTimeout(() => {
          window.location.replace("/login");
        }, 50);
      }
    }
  };

  return (
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

          {/* Akses ke Landing Page */}
          <Link to="/" className="relative py-0.5 block group/item">
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-bold text-[11px] text-amber-700 hover:bg-amber-50/60 transition-colors duration-200 relative z-10">
              <Home size={14} className="shrink-0" strokeWidth={2} />
              <span className="tracking-tight truncate">Landing Page</span>
            </div>
          </Link>

          {/* Tombol Logout */}
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

      {/* Keyframes khusus Sidebar */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
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
    </aside>
  );
};

export default Sidebar;