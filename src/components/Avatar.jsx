import React from 'react';

const Avatar = ({ name = "Admin", role = "Staff", fallbackText = "LH" }) => {
  return (
    <div className="flex items-center gap-3 bg-white p-2 pr-5 rounded-2xl border border-gray-100 shadow-sm">
      <div className="w-10 h-10 bg-[#3C2A21] text-white rounded-xl flex items-center justify-center font-black text-xs shadow-inner">
        {fallbackText}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-black uppercase tracking-tight text-gray-800 leading-none">{name}</span>
        <span className="text-[10px] font-bold text-[#6F4E37] mt-1">{role}</span>
      </div>
    </div>
  );
};

export default Avatar;