import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Coffee, ShoppingBag, Users, UserCheck, LogOut, Plus } from 'lucide-react'; 

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useApp();

  // ARRAY NAVIGASI UTAMA (OTOMATIS TER-UPDATE)
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard',      path: '/dashboard', icon: Coffee      },
    { id: 'orders',    label: 'Daftar Pesanan', path: '/orders',    icon: ShoppingBag },
    { id: 'customers', label: 'Customers',      path: '/customers', icon: Users       },
  ];

  // ================= HANDLE LOGOUT FIX =================
  const handleLogout = () => {
    try {
      document.body.style.removeProperty("pointer-events");
      document.body.style.removeProperty("overflow");
      document.body.style.pointerEvents = "auto";
      document.body.style.overflow = "unset";

      document.documentElement.style.removeProperty("pointer-events");
      document.documentElement.style.removeProperty("overflow");
      document.documentElement.style.pointerEvents = "auto";
      document.documentElement.style.overflow = "unset";

      localStorage.clear();
      sessionStorage.clear();

      logout();
    } catch (error) {
      console.error("Error clearing session:", error);
    } // ❌ typo 'finaly' kemarin di baris ini sudah diubah menjadi 'finally' yang benar di bawah:
    finally {
      setTimeout(() => {
        window.location.replace("/login");
      }, 50);
    }
  };

  return (
    <div className="w-[240px] h-full bg-white border-r-[0.5px] border-[#E3E3E3] p-4 flex flex-col justify-between font-sans antialiased select-none">

      {/* LOGO BOGENG COFFEE */}
      <div className="flex flex-col">
        <motion.div
          className="flex items-center gap-3 p-2 mb-6 cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/dashboard')}
        >
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="w-10 h-10 bg-[#C67C4E] rounded-xl flex items-center justify-center text-white shadow-md shadow-[#C67C4E]/20 font-black text-lg"
          >
            B
          </motion.div>
          <div>
            <h2 className="text-sm font-black text-[#313131] tracking-tight uppercase leading-none">Bogeng</h2>
            <p className="text-[9px] font-bold text-[#B0B0B0] tracking-widest uppercase mt-0.5">Coffee Shop</p>
          </div>
        </motion.div>

        {/* NAVIGASI MENU UTAMA */}
        <nav className="space-y-1 relative">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full relative flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black tracking-tight transition-colors duration-200 z-10 cursor-pointer ${
                  isActive ? 'text-white' : 'text-[#9B9B9B] hover:text-[#313131]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTrack"
                    className="absolute inset-0 bg-[#C67C4E] rounded-xl -z-10 shadow-md shadow-[#C67C4E]/10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* FOOTER SIDEBAR: LOGOUT + NEW ORDER */}
      <div className="space-y-4">
        <motion.button
          onClick={handleLogout}
          whileHover={{ x: 4, color: '#EF4444' }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="w-full flex items-center gap-3 px-4 py-2 text-xs font-black text-red-500 tracking-tight cursor-pointer"
        >
          <LogOut size={16} strokeWidth={2.5} />
          <span>Logout</span>
        </motion.button>

        <motion.button
          onClick={() => navigate('/dashboard')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          animate={{
            boxShadow: [
              '0 4px 10px rgba(49,49,49,0.1)',
              '0 4px 20px rgba(198,124,78,0.25)',
              '0 4px 10px rgba(49,49,49,0.1)',
            ],
          }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="w-full bg-[#313131] hover:bg-[#C67C4E] rounded-2xl p-3 flex flex-col items-center justify-center gap-2 relative overflow-hidden transition-colors duration-300 group cursor-pointer"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
          <span className="text-[8px] font-black tracking-widest text-[#E3E3E3] uppercase">New Order</span>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#C67C4E] transition-colors duration-300">
            <Plus size={14} strokeWidth={3} />
          </div>
        </motion.button>
      </div>

    </div>
  );
};

export default Sidebar;