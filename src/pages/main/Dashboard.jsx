import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const Dashboard = () => {
  // Ambil data dan fungsi dari Global Context
  const { menuList, addOrder } = useApp();

  // State Lokal
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // --- LOGIKA FILTER & SEARCH ---
  const filteredMenu = menuList.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // --- LOGIKA KERANJANG ---
  const addToCart = (item) => {
    const exist = cart.find((x) => x.id === item.id);
    if (exist) {
      setCart(cart.map((x) => (x.id === item.id ? { ...exist, qty: exist.qty + 1 } : x)));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((x) => x.id !== id));
  };

  // --- LOGIKA HARGA & DISKON ---
  const subtotal = cart.reduce((acc, curr) => acc + curr.price * curr.qty, 0);
  const isEligibleForDiscount = subtotal >= 120000;
  const discount = isEligibleForDiscount ? subtotal * 0.1 : 0;
  const totalFinal = subtotal - discount;

  // --- PROSES CHECKOUT ---
  const handleCheckout = () => {
    if (!customerName) return alert("Masukkan nama pelanggan terlebih dahulu!");
    if (cart.length === 0) return alert("Keranjang masih kosong!");

    const newOrder = {
      id: `ORD-${Date.now()}`,
      customer: customerName,
      total: totalFinal,
      status: 'Process',
      date: new Date().toLocaleDateString(),
      items: cart
    };

    addOrder(newOrder);
    setCart([]);
    setCustomerName('');
    alert(isEligibleForDiscount ? "Pesanan Berhasil! (Diskon 10% diterapkan)" : "Pesanan Berhasil!");
  };

  const getImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/150";
    if (img.startsWith('blob:') || img.startsWith('http')) return img;
    return new URL(`../../assets/${img}`, import.meta.url).href;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fade-in min-h-screen p-2">
      
      {/* BAGIAN KIRI: SELECTION MENU */}
      <div className="flex-1">
        {/* Search Bar */}
        <div className="relative mb-6">
          <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
          <input 
            type="text"
            placeholder="Cari menu favoritmu..."
            className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-gray-100 shadow-sm focus:ring-2 focus:ring-[#eae0d5] outline-none transition-all font-bold text-[#1a120b]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Kategori */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {['All', 'Hot', 'Ice', 'Non-Coffee', 'Cemilan', 'Makanan'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-xl font-bold whitespace-nowrap transition-all uppercase text-[11px] tracking-widest ${
                activeCategory === cat 
                ? 'bg-[#1a120b] text-white shadow-lg' 
                : 'bg-white text-gray-400 border border-gray-100 hover:bg-[#fbf9f6]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Menu */}
        {filteredMenu.length > 0 ? (
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredMenu.map((item) => (
              <div 
                key={item.id} 
                onClick={() => addToCart(item)}
                className="bg-white p-4 rounded-[2.5rem] shadow-sm border border-transparent hover:border-[#eae0d5] hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div className="bg-[#fbf9f6] h-44 rounded-[2rem] mb-4 overflow-hidden">
                  <img 
                    src={getImageUrl(item.img)} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="px-2">
                  <span className="text-[9px] font-black text-[#8c6d52] uppercase tracking-[0.2em]">{item.category}</span>
                  <h3 className="font-bold text-[#1a120b] text-lg mb-1 line-clamp-1">{item.name}</h3>
                  <p className="text-[#1a120b] font-black text-xl tracking-tighter">Rp {item.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <span className="text-5xl block mb-4">😿</span>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Menu tidak ditemukan</p>
          </div>
        )}
      </div>

      {/* BAGIAN KANAN: BILLING (Sesuai Request: Ramping & Pro) */}
      <div className="w-full lg:w-[320px] shrink-0">
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-50 p-6 sticky top-6 flex flex-col h-[calc(100vh-100px)]">
          
          <h3 className="text-lg font-black mb-6 text-[#1a120b] tracking-tighter uppercase flex justify-between items-center">
            Detail Pesanan <span className="bg-[#1a120b] text-white text-[9px] px-2 py-0.5 rounded-full animate-pulse tracking-widest">LIVE</span>
          </h3>

          <div className="mb-6">
            <label className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 ml-1">Nama Pelanggan</label>
            <input 
              type="text"
              placeholder="Contoh: Lukman"
              className="w-full mt-1.5 p-3.5 bg-[#fbf9f6] border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#eae0d5]/50 transition-all font-bold text-sm text-[#1a120b]"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-5 pr-1 mb-6 scrollbar-hide">
            {cart.length === 0 ? (
              <div className="text-center py-14 opacity-20">
                <span className="text-3xl block mb-2">🛒</span>
                <p className="text-[10px] font-bold italic tracking-widest uppercase">Belum ada pesanan</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex justify-between items-start group animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-[#1a120b] text-white rounded-xl flex items-center justify-center font-black text-[10px] shadow-lg shadow-black/10">
                      {item.qty}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1a120b] text-[13px] leading-tight">{item.name}</h4>
                      <p className="text-[9px] text-gray-400 font-bold uppercase mt-1 tracking-tight">Rp {item.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-[#1a120b] text-[12px]">Rp {(item.qty * item.price).toLocaleString()}</span>
                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      className="text-gray-300 hover:text-red-500 transition-colors text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-5 border-t border-dashed border-gray-100 space-y-3">
            <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString()}</span>
            </div>
            
            {isEligibleForDiscount && (
              <div className="flex justify-between text-[10px] font-black text-green-600 uppercase">
                <span>Loyalty Disc 10%</span>
                <span>- Rp {discount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between text-2xl font-black text-[#1a120b] pt-2">
              <span className="text-xs self-center tracking-widest">TOTAL</span>
              <span className="text-[#8c6d52] tracking-tighter">Rp {totalFinal.toLocaleString()}</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full bg-[#1a120b] hover:bg-[#2d1e13] text-white py-4.5 rounded-[1.5rem] font-black text-xs tracking-[0.2em] mt-4 shadow-xl shadow-black/5 transition-all active:scale-95 disabled:bg-gray-100 disabled:text-gray-300 disabled:shadow-none uppercase"
            >
              Konfirmasi Pesanan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;