import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Plus, Trash2 } from "lucide-react";

import DialogReceipt from "../../components/DialogReceipt";
import SwitchToggle from "../../components/SwitchToggle";

let globalAudioCtx = null;

const getAudioContext = () => {
  if (!globalAudioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      globalAudioCtx = new AudioContext();
    }
  }
  if (globalAudioCtx && globalAudioCtx.state === "suspended") {
    globalAudioCtx.resume();
  }
  return globalAudioCtx;
};

const playSoundEffect = (type) => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    if (type === "creamyKey") {
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      const randomPitch = 140 + Math.random() * 40;
      osc1.frequency.setValueAtTime(randomPitch, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(randomPitch * 0.4, ctx.currentTime + 0.04);
      
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(450, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.03);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(550, ctx.currentTime);

      osc1.connect(gain1);
      osc2.connect(gain2);
      gain1.connect(filter);
      gain2.connect(filter);
      filter.connect(ctx.destination);

      gain1.gain.setValueAtTime(0.4, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      
      gain2.gain.setValueAtTime(0.25, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.05);
      osc2.stop(ctx.currentTime + 0.05);
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === "clickMenu") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(580, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.06);
      } else if (type === "clickQty") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(460, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.04);
      } else if (type === "cashRegister") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(1050, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.12);
        
        setTimeout(() => {
          try {
            const ctx2 = getAudioContext();
            if (!ctx2) return;
            const osc2 = ctx2.createOscillator();
            const gain2 = ctx2.createGain();
            osc2.connect(gain2); gain2.connect(ctx2.destination);
            osc2.type = "sine"; osc2.frequency.setValueAtTime(1350, ctx2.currentTime);
            gain2.gain.setValueAtTime(0.1, ctx2.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.001, ctx2.currentTime + 0.15);
            osc2.start(ctx2.currentTime); osc2.stop(ctx2.currentTime + 0.15);
          } catch (e) {}
        }, 60);
      }
    }
  } catch (error) {
    console.log("Audio Engine Error:", error);
  }
};

const Dashboard = () => {
  const { menuList = [], addOrder } = useApp();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");

  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  
  // 🔴 DIUBAH: Dari onlyShowMembers beralih ke state filter Best Seller
  const [showBestSellerOnly, setShowBestSellerOnly] = useState(false);
  const [lastOrderData, setLastOrderData] = useState(null);

  // 🔴 LOGIKA FILTER BARU: Menggabungkan Kategori, Pencarian, & Status Best Seller
  const filteredMenu = menuList.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBestSeller = !showBestSellerOnly || item.isBestSeller === true;
    
    return matchesCategory && matchesSearch && matchesBestSeller;
  });

  const addToCart = (item) => {
    playSoundEffect("clickMenu");
    setCart((prevCart) => {
      const existing = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, qty: cartItem.qty + 1 } : cartItem
        );
      }
      return [...prevCart, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    playSoundEffect("clickQty");
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQty = (id, newQty) => {
    playSoundEffect("clickQty");
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, qty: newQty } : item))
    );
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Keranjang masih kosong, bro!");
      return;
    }
    if (!customerName.trim()) {
      alert("Isi nama pelanggan dulu buat hitung tingkatan CRM loyalitasnya!");
      return;
    }

    const orderData = {
      id: `ORD-${Date.now().toString().slice(-10)}`,
      customer: customerName.trim().toUpperCase(),
      items: cart,
      total: subtotal,
      status: "PROCESS",
      date: new Date().toLocaleDateString("id-ID"),
    };

    playSoundEffect("cashRegister");
    setLastOrderData(orderData);
    addOrder(orderData);
    setIsReceiptOpen(true);
  };

  const handleCloseReceipt = () => {
    setIsReceiptOpen(false);
    setCart([]);
    setCustomerName("");
    setLastOrderData(null);
  };

  const categories = ["All", "Coffee", "Non-Coffee", "Food", "Snack"];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.04 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <div className="w-full h-full grid grid-cols-12 gap-4 text-[#313131]">
      
      {/* AREA KIRI */}
      <div className="col-span-9 flex flex-col h-full overflow-hidden">
        
        {/* Search Bar */}
        <div className="w-full relative flex items-center mb-3 shrink-0">
          <Search size={14} className="absolute left-3.5 text-[#9B9B9B]" strokeWidth={2.5} />
          <input
            type="text"
            placeholder="Cari menu favorit anak senja..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FBF8F6] border-[0.5px] border-[#E3E3E3] rounded-xl pl-9 pr-4 py-2 text-[11px] font-medium focus:outline-none focus:border-[#C67C4E] focus:bg-white transition-all placeholder:text-[#B0B0B0]"
          />
        </div>

        {/* Baris Filter */}
        <div className="flex justify-between items-center mb-4 shrink-0 select-none">
          <div className="flex gap-2 overflow-x-auto no-scrollbar relative">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    playSoundEffect("clickQty");
                    setActiveCategory(cat);
                  }}
                  className={`relative px-4 py-1.5 rounded-full text-[10px] font-black tracking-wide transition-colors duration-300 ${
                    isSelected ? "text-white" : "bg-[#FBF8F6] text-[#9B9B9B] hover:text-[#313131] border-[0.5px] border-[#E3E3E3]"
                  }`}
                >
                  <span className="relative z-10">{cat}</span>
                  {isSelected && (
                    <motion.div
                      layoutId="activeCategoryIndicator"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute inset-0 bg-[#C67C4E] rounded-full shadow-sm shadow-[#C67C4E]/20"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* 🔴 DIUBAH: Mengganti parameter prop ke Best Seller */}
          <div className="bg-white border-[0.5px] border-[#E3E3E3] px-3 py-1.5 rounded-xl shadow-sm">
            <SwitchToggle 
              checked={showBestSellerOnly} 
              onChange={(val) => {
                playSoundEffect("clickQty");
                setShowBestSellerOnly(val);
              }} 
              label="Menu Best Seller 🔥" 
            />
          </div>
        </div>

        {/* Grid Katalog */}
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
          <AnimatePresence mode="wait">
            {/* 🔴 DITAMBAH: Memasukkan state showBestSellerOnly ke key animate biar trigger refresh layout mulus */}
            <motion.div
              key={activeCategory + searchQuery + showBestSellerOnly}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-4 gap-3.5 pb-4"
            >
              {filteredMenu.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 20px rgba(198, 124, 78, 0.08)",
                    borderColor: "#C67C4E",
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => addToCart(item)}
                  className="bg-white rounded-xl border-[0.5px] border-[#E3E3E3] p-2.5 flex flex-col justify-between cursor-pointer group select-none transition-colors duration-200"
                >
                  <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-[#FBF8F6] relative">
                    <motion.img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                    
                    {/* 🔴 TAMBAHAN VISUAL: Badge penanda Best Seller otomatis di atas gambar */}
                    {item.isBestSeller && (
                      <div className="absolute top-1.5 right-1.5 bg-[#C67C4E] text-white text-[7px] font-black uppercase px-1.5 py-0.5 rounded shadow-sm tracking-wider">
                        Best Seller
                      </div>
                    )}
                  </div>

                  <div className="mt-2.5 flex flex-col gap-0.5 flex-1 justify-end">
                    <h4 className="text-[11px] font-black text-[#313131] leading-tight group-hover:text-[#C67C4E] transition-colors line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-[8px] text-[#9B9B9B] font-bold uppercase tracking-wider">
                      {item.category}
                    </p>

                    <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-[#FBF8F6]">
                      <span className="text-[11px] font-black text-[#313131]">
                        Rp {item.price.toLocaleString("id-ID")}
                      </span>

                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-5 h-5 rounded-md bg-[#C67C4E] text-white flex items-center justify-center shadow-sm shadow-[#C67C4E]/10"
                      >
                        <Plus size={10} strokeWidth={3} />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredMenu.length === 0 && (
            <div className="text-center py-24 text-[#9B9B9B] text-[10px] font-bold">
              Menu yang lo cari gak ketemu, bro! ☕
            </div>
          )}
        </div>
      </div>

      {/* AREA KANAN */}
      <div className="col-span-3 border-l border-[#E3E3E3] pl-4 flex flex-col h-full overflow-hidden select-none">
        <div className="flex justify-between items-center pb-2.5 border-b border-[#FBF8F6] shrink-0">
          <h3 className="text-[10px] font-black tracking-wider uppercase text-[#313131]">
            Current Order
          </h3>
          {cart.length > 0 && (
            <button
              onClick={() => {
                playSoundEffect("clickQty");
                setCart([]);
              }}
              className="text-[9px] font-black text-red-500 hover:underline uppercase tracking-wide"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto my-3 space-y-2 pr-1 custom-scrollbar">
          <AnimatePresence mode="wait">
            {cart.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center gap-2 text-center text-[#9B9B9B]"
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  className="w-12 h-12 bg-[#FBF8F6] rounded-full flex items-center justify-center text-[#C67C4E] border-[0.5px] border-[#E3E3E3] shadow-inner"
                >
                  <ShoppingBag size={20} strokeWidth={2} />
                </motion.div>
                <p className="text-[9px] font-black uppercase tracking-wider text-[#313131]/70">
                  Keranjang Masih Kosong
                </p>
                <p className="text-[8px] font-medium text-[#9B9B9B] max-w-[150px] leading-normal">
                  Klik pada menu kopi gacor di sebelah kiri untuk menambahkan pesanan.
                </p>
              </motion.div>
            ) : (
              cart.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  className="bg-[#FBF8F6] p-2 rounded-xl border-[0.5px] border-[#E3E3E3] flex justify-between items-center gap-2"
                >
                  <div className="truncate leading-tight">
                    <p className="text-[10px] font-black text-[#313131] truncate">
                      {item.name}
                    </p>
                    <p className="text-[9px] font-bold text-[#C67C4E] mt-0.5">
                      Rp {(item.price * item.qty).toLocaleString("id-ID")}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 bg-white border-[0.5px] border-[#E3E3E3] rounded-lg p-0.5">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="w-4 h-4 rounded text-[10px] font-black hover:bg-gray-100 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-[9px] font-black w-4 text-center">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-4 h-4 rounded text-[10px] font-black hover:bg-gray-100 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        <div className="pt-3 border-t border-[#E3E3E3]/60 space-y-3 shrink-0 bg-white">
          <div>
            <label className="text-[8px] font-black text-[#9B9B9B] uppercase tracking-wider block mb-1">
              Nama Customer (CRM)
            </label>
            <input
              type="text"
              placeholder="INPUT NAMA MEMBER..."
              value={customerName}
              onChange={(e) => {
                playSoundEffect("creamyKey");
                setCustomerName(e.target.value);
              }}
              className="w-full bg-[#FBF8F6] border-[0.5px] border-[#E3E3E3] text-[10px] font-black rounded-lg px-3 py-2 uppercase placeholder:normal-case focus:outline-none focus:border-[#C67C4E] focus:bg-white transition-all text-[#313131]"
            />
          </div>

          <div className="space-y-1 text-[11px] font-medium">
            <div className="flex justify-between text-[#9B9B9B]">
              <span>Subtotal</span>
              <span className="font-bold">Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between items-center pt-1 text-[#313131]">
              <span className="font-black text-[10px] uppercase tracking-wider">
                Total Bayar
              </span>
              <span className="font-black text-sm text-[#C67C4E]">
                Rp {subtotal.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <motion.button
            whileHover={cart.length > 0 ? { scale: 1.02 } : {}}
            whileTap={cart.length > 0 ? { scale: 0.98 } : {}}
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`w-full font-black text-[10px] tracking-widest uppercase py-2.5 rounded-xl transition-all shadow-sm ${
              cart.length > 0
                ? "bg-[#313131] hover:bg-[#C67C4E] text-white cursor-pointer shadow-lg shadow-[#C67C4E]/10"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Confirm & Print Receipt
          </motion.button>
        </div>

      </div>

      <DialogReceipt
        isOpen={isReceiptOpen}
        onClose={handleCloseReceipt}
        customerName={lastOrderData?.customer}
        totalAmount={lastOrderData?.total}
        orderId={lastOrderData?.id}
      />
    </div>
  );
};

export default Dashboard;