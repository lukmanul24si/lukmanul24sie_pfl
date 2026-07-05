import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

// ➕ onClick & isBestSeller ditambahkan supaya kartu ini bisa dipakai
// langsung sebagai kartu "tambah ke keranjang" di Dashboard (POS Kasir).
const MenuCard = ({ name, price, img, category, isBestSeller = false, onClick }) => {
  return (
    <motion.div
      whileHover={{
        y: -5,
        boxShadow: "0 10px 20px rgba(198, 124, 78, 0.08)",
        borderColor: "#C67C4E",
      }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="bg-white rounded-xl p-2 border-[0.5px] border-[#E3E3E3] hover:border-[#C67C4E]/50 transition-colors duration-200 flex flex-col justify-between h-full group select-none text-[#313131] cursor-pointer"
    >
      <div>
        {/* Gambar Kopi */}
        <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-[#FBF8F6] relative mb-2">
          <motion.img
            src={img}
            alt={name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500";
            }}
          />
          {isBestSeller && (
            <div className="absolute top-1.5 right-1.5 bg-[#C67C4E] text-white text-[7px] font-black uppercase px-1.5 py-0.5 rounded shadow-sm tracking-wider">
              Best Seller
            </div>
          )}
        </div>

        {/* Judul Menu */}
        <h4 className="text-[11px] font-black text-[#313131] leading-tight group-hover:text-[#C67C4E] transition-colors line-clamp-1">
          {name}
        </h4>
        {category && (
          <p className="text-[8px] text-[#9B9B9B] font-bold uppercase tracking-wider">
            {category}
          </p>
        )}
      </div>

      {/* Harga & Tombol Plus Vektor */}
      <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-[#FBF8F6]">
        <span className="text-[11px] font-black text-[#313131]">
          Rp {price.toLocaleString('id-ID')}
        </span>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-5 h-5 rounded-md bg-[#C67C4E] text-white flex items-center justify-center shadow-sm shadow-[#C67C4E]/10"
        >
          <Plus size={10} strokeWidth={3} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MenuCard;