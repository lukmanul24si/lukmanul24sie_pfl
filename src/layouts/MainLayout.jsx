import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard (POS)', path: '/dashboard', icon: '☕' },
    { name: 'Daftar Pesanan', path: '/orders', icon: '🧾' },
    { name: 'Customers (CRM)', path: '/customers', icon: '👤' },
  ];

  // FUNGSI LOGOUT
  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar dari sistem kasir?")) {
      navigate('/');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FD] font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 p-8 flex flex-col fixed h-screen z-20">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-[#6F4E37] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">B</div>
          <h1 className="font-shop font-extrabold text-xl tracking-tighter text-[#3C2A21] leading-none">
            BOGENG <br />
            <span className="text-[#6F4E37] text-sm tracking-normal">COFFEE SHOP</span>
          </h1>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-3">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                location.pathname === item.path 
                ? 'bg-[#6F4E37] text-white shadow-xl shadow-brown-200' 
                : 'text-gray-400 hover:bg-gray-50'
              }`}>
                <span>{item.icon}</span> <span className="text-sm">{item.name}</span>
              </div>
            </Link>
          ))}

          {/* TOMBOL LOGOUT (Red Accent) */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-400 hover:bg-red-50 transition-all mt-2 group"
          >
            <span className="group-hover:scale-110 transition-transform">🚪</span> 
            <span className="text-sm">Logout</span>
          </button>
        </nav>

        {/* Widget New Order */}
        <div className="mt-auto bg-[#F8F9FD] p-6 rounded-[2.5rem] border border-gray-100 flex flex-col items-center gap-3 text-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">New Order</p>
          <motion.button 
            onClick={() => navigate('/dashboard')}
            whileHover={{ scale: 1.1, rotate: 90 }}
            className="w-14 h-14 bg-white rounded-full shadow-md text-[#6F4E37] text-3xl flex items-center justify-center"
          >+</motion.button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-72 p-10 min-h-screen">
        {/* Header dengan Nama Admin */}
        <header className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-black tracking-tighter italic font-shop text-[#3C2A21]">
            Hello, Lukman 👋
          </h2>
          
          <div className="flex items-center gap-3 bg-white p-2 pr-5 rounded-2xl border border-gray-100 shadow-sm">
            {/* Avatar menggunakan Dark Brown sesuai Palet */}
            <div className="w-10 h-10 bg-[#3C2A21] text-white rounded-xl flex items-center justify-center font-bold text-xs">
              LH
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black uppercase tracking-tight text-gray-800 leading-none">
                Lukmanul Hakim
              </span>
              <span className="text-[10px] font-bold text-[#6F4E37]">Administrator</span>
            </div>
          </div>
        </header>

        {/* Render Page Content */}
        <div className="relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;