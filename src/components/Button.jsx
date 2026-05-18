import React from 'react';

const Button = ({ children, variant = 'primary', onClick, disabled, className = '' }) => {
  const baseStyle = "px-6 py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all duration-200 outline-none w-full shadow-md";
  
  const variants = {
    primary: "bg-[#6F4E37] text-white hover:bg-[#5a3f2d] active:scale-95 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed",
    secondary: "bg-[#3C2A21] text-white hover:bg-[#281c16] active:scale-95",
    danger: "bg-red-50 text-red-500 hover:bg-red-100 active:scale-95",
    outline: "border border-gray-200 text-gray-500 bg-white hover:bg-gray-50"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;