import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const { menuList, addOrder } = useApp();
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Kategori Menu
  const categories = ["All", "Coffee", "Non-Coffee", "Food", "Snack"];

  // Filter Menu Berdasarkan Tab & Search
  const filteredMenu = menuList.filter(item => {
    const matchesTab = activeTab === "All" || item.category === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    const item = cart.find(c => c.id === id);
    if (item.qty > 1) {
      setCart(cart.map(c => c.id === id ? { ...c, qty: c.qty - 1 } : c));
    } else {
      setCart(cart.filter(c => c.id !== id));
    }
  };

  // Logic: Perhitungan Harga & Diskon (Loyalty CRM)
  const subtotal = cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
  const isDiscount = subtotal > 100000;
  const discountAmount = isDiscount ? subtotal * 0.1 : 0;
  const totalFinal = subtotal - discountAmount;

  const handleConfirmOrder = () => {
    if (!customerName || cart.length === 0) return alert("Pilih menu dan isi nama pelanggan!");

    const newOrder = {
      id: `ORD-${Date.now()}`,
      customer: customerName,
      items: [...cart],
      subtotal: subtotal,
      discount: discountAmount,
      total: totalFinal,
      status: 'PROCESS',
      date: new Date().toLocaleString('id-ID'),
    };

    addOrder(newOrder);
    setCart([]);
    setCustomerName("");
    alert("🚀 Pesanan berhasil dikirim ke dapur!");
  };

  return (
    <div className="flex gap-8 h-[calc(100vh-160px)] font-sans">
      
      {/* BAGIAN KIRI: MENU EXPLORER */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        
        {/* Search & Tabs */}
        <div className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Cari menu favorit..." 
            className="w-full p-4 bg-white rounded-2xl border border-gray-100 shadow-sm outline-none focus:border-[#6F4E37] font-bold text-sm"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-2 rounded-full text-xs font-black transition-all whitespace-nowrap ${
                  activeTab === cat ? 'bg-[#6F4E37] text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Menu: Dibuat 4-5 Kolom agar kartu lebih kecil & ringkas */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 overflow-y-auto pr-2 custom-scrollbar">
          {filteredMenu.map((menu) => (
            <motion.div 
              layout
              key={menu.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => addToCart(menu)}
              className="bg-white p-3 rounded-[1.5rem] border border-gray-100 shadow-sm cursor-pointer hover:border-[#6F4E37] transition-all group flex flex-col"
            >
              {/* Gambar Square 1:1 */}
              <div className="w-full aspect-square bg-gray-50 rounded-[1rem] overflow-hidden mb-2 flex items-center justify-center group-hover:bg-amber-50 transition-colors">
                <img 
                  src={menu.img} 
                  alt={menu.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Teks Nama Menu (Font Kecil & Rapat) */}
              <h3 className="font-black text-gray-800 text-[11px] leading-tight h-7 line-clamp-2 mb-1">
                {menu.name}
              </h3>
              
              {/* Harga & Action */}
              <div className="flex justify-between items-center mt-auto">
                <p className="text-[#6F4E37] font-black text-[10px]">
                  Rp {menu.price.toLocaleString()}
                </p>
                <span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold text-[10px] group-hover:bg-[#6F4E37] group-hover:text-white">
                  +
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* BAGIAN KANAN: CHECKOUT PANEL */}
      <div className="w-[380px] bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-xl flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-black text-xl italic font-shop">Current Order</h3>
          <button onClick={() => setCart([])} className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:underline">Clear All</button>
        </div>
        
        {/* Order List */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-2 custom-scrollbar">
          <AnimatePresence>
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-300 italic text-sm">
                <span className="text-4xl mb-2">🛒</span>
                Keranjang kosong
              </div>
            ) : (
              cart.map((item) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  key={item.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl"
                >
                  <div className="flex-1">
                    <p className="font-bold text-xs text-gray-800">{item.name}</p>
                    <p className="text-[10px] text-[#6F4E37] font-black">Rp {item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 bg-white rounded-lg shadow-sm font-black text-gray-400">-</button>
                    <span className="text-xs font-black">{item.qty}</span>
                    <button onClick={() => addToCart(item)} className="w-6 h-6 bg-white rounded-lg shadow-sm font-black text-[#6F4E37]">+</button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Summary & CRM Section */}
        <div className="border-t border-dashed pt-6 space-y-3">
          <input 
            type="text" 
            placeholder="Input Nama Member..." 
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-[#6F4E37] text-xs font-black uppercase tracking-widest mb-4"
          />

          <div className="flex justify-between text-xs font-bold text-gray-400">
            <span>Subtotal</span>
            <span>Rp {subtotal.toLocaleString()}</span>
          </div>
          
          {isDiscount && (
            <div className="flex justify-between text-xs font-black text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
              <span>Loyalty Discount (10%)</span>
              <span>- Rp {discountAmount.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <span className="font-black italic text-lg font-shop">Total Final</span>
            <span className="text-2xl font-black text-[#6F4E37]">Rp {totalFinal.toLocaleString()}</span>
          </div>

          <button 
            onClick={handleConfirmOrder}
            disabled={cart.length === 0}
            className={`w-full mt-4 py-5 rounded-[2rem] font-black text-sm shadow-xl transition-all ${
              cart.length > 0 ? 'bg-[#6F4E37] text-white hover:scale-[1.02] active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            CONFIRM & PRINT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;