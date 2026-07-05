import React from 'react';

const IconButton = ({ icon, onClick, variant = 'default', size = 'default', className = '' }) => {
  const baseStyle = "flex items-center justify-center font-bold transition-all active:scale-95";

  const sizes = {
    default: "w-10 h-10 rounded-xl text-sm shadow-sm",
    compact: "p-1 rounded"
  };

  const variants = {
    default: "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50",
    primary: "bg-[#6F4E37] text-white hover:bg-[#5a3f2d]",
    danger: "bg-red-50 text-red-500 hover:bg-red-100",
    ghost: "text-[#9B9B9B] hover:bg-gray-100 hover:text-[#313131]",
    ghostDanger: "text-[#9B9B9B] hover:text-red-500 hover:bg-red-50"
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${className}`}>
      {icon}
    </button>
  );
};

export default IconButton;