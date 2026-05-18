import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, ShoppingBag, Users, LogOut, Plus } from 'lucide-react';

// Contoh dummy props/state, sesuaikan dengan logic routing asli lo bro (misal useNavigate / useLocation)
const Sidebar = ({ currentPath = '/dashboard', onNavigate }) => {
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: Coffee },
    { id: 'orders', label: 'Daftar Pesanan', path: '/orders', icon: ShoppingBag },
    { id: 'customers', label: 'Customers', path: '/customers', icon: Users },
  ];

  return (
    <div className="w-[240px] h-full bg-white border-r-[0.5px] border-[#E3E3E3] p-4 flex flex-col justify-between font-sans antialiased select-none">
      
      {/* BAGIAN ATAS: LOGO BOGENG COFFEE SHOP */}
      <div className="flex flex-col">
        <motion.div 
          className="flex items-center gap-3 p-2 mb-6 cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Logo Box Animasi Mengambang */}
          <motion.div 
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="w-10 h-10 bg-[#C67C4E] rounded-xl flex items-center justify-center text-white shadow-md shadow-[#C67C4E]/20 font-black text-lg"
          >
            B
          </motion.div>
          <div>
            <h2 className="text-sm font-black text-[#313131] tracking-tight uppercase leading-none">Bogeng</h2>
            <p className="text-[9px] font-bold text-[#B0B0B0] tracking-widest uppercase mt-0.5">Coffee Shop</p>
          </div>
        </motion.div>

        {/* BAGIAN TENGAH: NAVIGASI MENU UTAMA */}
        <nav className="space-y-1 relative">
          {menuItems.map((item) => {
            // Cek apakah tab sedang aktif berdasarkan path
            const isActive = currentPath === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate && onNavigate(item.path)}
                className={`w-full relative flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black tracking-tight transition-colors duration-200 z-10 ${
                  isActive ? 'text-white' : 'text-[#9B9B9B] hover:text-[#313131]'
                }`}
              >
                {/* Efek Background Meloncat/Meluncur Mengikuti Tab Aktif */}
                {isActive && (
                  <motion.div
                    layoutId="activeTrack"
                    className="absolute inset-0 bg-[#C67C4E] rounded-xl -z-10 shadow-md shadow-[#C67C4E]/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Icon Menu */}
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* BAGIAN BAWAH: LOGOUT & BUTTON NEW ORDER */}
      <div className="space-y-4">
        {/* Tombol Logout */}
        <motion.button 
          whileHover={{ x: 4, color: '#EF4444' }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="w-full flex items-center gap-3 px-4 py-2 text-xs font-black text-red-500 tracking-tight"
        >
          <LogOut size={16} strokeWidth={2.5} />
          <span>Logout</span>
        </motion.button>

        {/* TOMBOL NEW ORDER DENGAN BREATHING EFFECT */}
        <motion.button
          whileHover={{ scale: 1.03, shadow: "0 10px 20px rgba(49,49,49,0.15)" }}
          whileTap={{ scale: 0.97 }}
          animate={{
            boxShadow: [
              "0 4px 10px rgba(49,49,49,0.1)",
              "0 4px 20px rgba(198,124,78,0.25)",
              "0 4px 10px rgba(49,49,49,0.1)"
            ]
          }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="w-full bg-[#313131] hover:bg-[#C67C4E] rounded-2xl p-3 flex flex-col items-center justify-center gap-2 relative overflow-hidden transition-colors duration-300 group"
        >
          {/* Ornamen Kilatan Cahaya Pas di Hover */}
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