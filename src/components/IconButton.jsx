import React from 'react';

const IconButton = ({ icon, onClick, variant = 'default', className = '' }) => {
  const baseStyle = "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all active:scale-95 shadow-sm";
  
  const variants = {
    default: "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50",
    primary: "bg-[#6F4E37] text-white hover:bg-[#5a3f2d]",
    danger: "bg-red-50 text-red-500 hover:bg-red-100"
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {icon}
    </button>
  );
};

export default IconButton;