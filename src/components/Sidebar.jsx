import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import logo from '../assets/logo.png';
import bgBeans from '../assets/bg-coffee-beans.jpg'; 

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Menu sekarang bersih, cuma buat navigasi
  const menus = [
    { name: 'Dashboard', path: '/dashboard', icon: '☕' },
    { name: 'Orders', path: '/orders', icon: '📝' },
    { name: 'Customers', path: '/customers', icon: '👥' },
    { name: 'Tambah Menu', path: '/add-menu', icon: '➕' }, 
  ];

  const handleLogout = () => {
    const confirmLogout = window.confirm("Apakah anda yakin ingin keluar?");
    if (confirmLogout) navigate('/login');
  };

  return (
    <aside 
      className="w-72 h-screen p-8 flex flex-col fixed left-0 top-0 z-50 overflow-hidden shadow-2xl border-r border-white/5"
      style={{
        backgroundImage: `linear-gradient(rgba(26, 18, 11, 0.85), rgba(26, 18, 11, 0.95)), url(${bgBeans})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Logo Section - Sekarang Bulat Sempurna & Rapi */}
<div className="mb-14 flex items-center gap-4">
  {/* Pembungkus Gambar (Container) */}
  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 shadow-lg bg-white/5 backdrop-blur-sm p-0.5 flex items-center justify-center shrink-0">
    <img 
      src={logo} 
      alt="Bogeng Logo" 
      className="w-full h-full rounded-full object-cover filter brightness-110" 
    />
  </div>
  
  {/* Teks Logo */}
  <div className="flex flex-col">
    <span className="text-xl font-black text-white tracking-tighter leading-none">BOGENG</span>
    <span className="text-[10px] font-bold text-gray-400 tracking-[0.3em] uppercase">Coffee Store</span>
  </div>
</div>

      {/* Navigation */}
      <nav className="flex-1 space-y-4">
        {menus.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className="relative block group"
          >
            <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 relative z-10 ${
              location.pathname === item.path ? 'text-[#1a120b]' : 'text-gray-400 hover:text-white'
            }`}>
              <span className="text-xl">{item.icon}</span>
              <span className="font-bold">{item.name}</span>
            </div>

            {/* Indikator Menu Aktif */}
            {location.pathname === item.path && (
              <motion.div 
                layoutId="activeTab"
                className="absolute inset-0 bg-[#fdfaf7] rounded-2xl shadow-xl shadow-black/20"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        ))}
      </nav>

      {/* Logout Section */}
      <button 
        onClick={handleLogout}
        className="flex items-center gap-4 px-6 py-4 rounded-2xl text-red-400 font-bold hover:bg-red-500/10 transition-all mt-auto border border-transparent hover:border-red-500/20"
      >
        <span>🚪</span>
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;