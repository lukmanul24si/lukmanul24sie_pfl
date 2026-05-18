import React from 'react';

const CartItem = ({ name, price, qty, onAdd, onRemove }) => {
  return (
    <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border-[0.5px] border-[#EAEAEA]/80 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
      <div className="flex flex-col min-w-0 flex-1 pr-2">
        <span className="font-bold text-[11px] text-[#2F2D2C] tracking-tight truncate">
          {name}
        </span>
        <span className="text-[10px] font-medium text-[#C67C4E] mt-0.5">
          Rp {(price * qty).toLocaleString('id-ID')}
        </span>
      </div>

      {/* Controller Kuantitas Item */}
      <div className="flex items-center gap-2 bg-[#F9F2ED]/70 px-2 py-1 rounded-lg border-[0.5px] border-[#F0EAE5] shrink-0 select-none">
        <button 
          onClick={onRemove}
          className="w-4 h-4 rounded flex items-center justify-center text-[10px] font-extrabold text-[#9B9B9B] hover:text-[#2F2D2C] transition-colors"
        >
          -
        </button>
        <span className="text-[10px] font-extrabold text-[#2F2D2C] min-w-[12px] text-center">
          {qty}
        </span>
        <button 
          onClick={onAdd}
          className="w-4 h-4 rounded flex items-center justify-center text-[10px] font-extrabold text-[#C67C4E] hover:text-[#A65C2E] transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default CartItem;