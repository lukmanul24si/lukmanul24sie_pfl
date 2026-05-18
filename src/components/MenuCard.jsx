import React from 'react';
import { Plus } from 'lucide-react';

const MenuCard = ({ name, price, img }) => {
  return (
    <div className="bg-white rounded-xl p-2 border-[0.5px] border-[#E3E3E3] hover:border-[#C67C4E]/50 transition-all duration-200 flex flex-col justify-between h-full group hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] text-[#313131]">
      <div>
        {/* Gambar Kopi */}
        <div className="w-full aspect-square rounded-lg overflow-hidden bg-[#FBF8F6] relative mb-2">
          <img 
            src={img} 
            alt={name} 
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500";
            }}
          />
        </div>

        {/* Judul Menu */}
        <h4 className="font-bold text-[11px] text-[#313131] tracking-tight leading-tight mb-0.5 line-clamp-2">
          {name}
        </h4>
      </div>

      {/* Harga & Tombol Plus Vektor */}
      <div className="flex justify-between items-center mt-1.5">
        <span className="text-[10px] font-black text-[#C67C4E]">
          Rp {price.toLocaleString('id-ID')}
        </span>
        <div className="w-5 h-5 bg-[#C67C4E] text-white rounded-md flex items-center justify-center shadow-sm group-hover:bg-[#A65C2E] transition-colors select-none">
          <Plus size={10} strokeWidth={3} />
        </div>
      </div>
    </div>
  );
};

export default MenuCard;