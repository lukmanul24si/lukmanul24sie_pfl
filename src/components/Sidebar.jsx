<aside 
  className="w-72 h-screen fixed left-0 top-0 z-50 p-8 flex flex-col shadow-2xl"
  style={{
    backgroundImage: `linear-gradient(rgba(26, 18, 11, 0.85), rgba(26, 18, 11, 0.95)), url(${bgBeans})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  {/* Isi Sidebar Kamu */}
</aside>
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Untuk animasi smooth
import { useApp } from '../context/AppContext';
import logo from '../assets/logo.png';
import bgBeans from '../assets/bg-coffee-beans.jpg'; // Pastikan file ini ada di assets

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addMenu } = useApp();
  
  const [showModal, setShowModal] = useState(false);
  const [newMenu, setNewMenu] = useState({ 
    name: '', 
    price: '', 
    category: 'Hot', 
    img: null 
  });

  const menus = [
    { name: 'Dashboard', path: '/dashboard', icon: '☕' },
    { name: 'Orders', path: '/orders', icon: '📝' },
    { name: 'Customers', path: '/customers', icon: '👥' },
  ];

  const handleLogout = () => {
    const confirmLogout = window.confirm("Apakah anda yakin ingin keluar?");
    if (confirmLogout) navigate('/login');
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) setNewMenu({ ...newMenu, img: URL.createObjectURL(file) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMenu.name || !newMenu.price || !newMenu.img) return alert("Lengkapi data menu!");
    addMenu({ id: Date.now(), ...newMenu, price: parseInt(newMenu.price) });
    setShowModal(false);
    setNewMenu({ name: '', price: '', category: 'Hot', img: null });
  };

  return (
    <>
      <aside 
        className="w-72 min-h-screen p-8 flex flex-col fixed h-full z-10 overflow-hidden shadow-2xl border-r border-white/5"
        style={{
          // Trik Background: Pakai gradasi gelap agar gambar biji kopi tidak menutupi teks
          backgroundImage: `linear-gradient(rgba(26, 18, 11, 0.85), rgba(26, 18, 11, 0.95)), url(${bgBeans})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Logo Section - Clean & Minimalist */}
        <div className="mb-14 flex items-center gap-4">
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain filter brightness-110" />
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

              {/* Animasi Background Menu Aktif (Warna Cream) */}
              {location.pathname === item.path && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[#fdfaf7] rounded-2xl shadow-xl shadow-black/20"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
          
          <button 
            onClick={() => setShowModal(true)}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[#d4a373] hover:bg-white/5 transition-all border border-dashed border-[#d4a373]/30 mt-10 group"
          >
            <span className="group-hover:rotate-90 transition-transform duration-300">➕</span>
            <span className="font-bold">Tambah Menu</span>
          </button>
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

      {/* MODAL TAMBAH MENU - Disesuaikan Warnanya */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#1a120b]/80 backdrop-blur-md p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-[3rem] p-10 text-gray-800 shadow-2xl border border-gray-100"
            >
              <h3 className="text-3xl font-black mb-2 text-[#1a120b]">Produk Baru ☕</h3>
              <p className="text-gray-400 text-sm mb-8 font-medium uppercase tracking-widest">Tambahkan menu terbaikmu</p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <input type="text" placeholder="Nama Menu" className="w-full p-4 bg-[#fbf9f6] border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#eae0d5] font-bold" onChange={e => setNewMenu({...newMenu, name: e.target.value})} />
                <input type="number" placeholder="Harga (Rp)" className="w-full p-4 bg-[#fbf9f6] border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#eae0d5] font-bold" onChange={e => setNewMenu({...newMenu, price: e.target.value})} />
                
                <select 
                  className="w-full p-4 bg-[#fbf9f6] border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#eae0d5] font-bold appearance-none cursor-pointer" 
                  onChange={e => setNewMenu({...newMenu, category: e.target.value})}
                >
                  <option value="Hot">Hot Coffee</option>
                  <option value="Ice">Ice Coffee</option>
                  <option value="Non-Coffee">Non-Coffee</option>
                  <option value="Cemilan">Cemilan</option>
                  <option value="Makanan">Makanan</option>
                </select>

                <div className="h-40 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center relative bg-[#fbf9f6] overflow-hidden group">
                  {newMenu.img ? (
                    <img src={newMenu.img} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="text-center">
                      <span className="text-3xl block mb-2 opacity-30">📸</span>
                      <span className="text-gray-400 font-black text-xs uppercase tracking-widest">Upload Foto</span>
                    </div>
                  )}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImage} />
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 font-black text-gray-400 uppercase tracking-widest text-xs">Batal</button>
                  <button type="submit" className="flex-[2] py-4 bg-[#1a120b] text-white rounded-2xl font-black shadow-xl hover:bg-[#2d1e13] transition-all active:scale-95">SIMPAN MENU</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;