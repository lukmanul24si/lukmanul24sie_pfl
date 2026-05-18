import React from 'react';

const Input = ({ type = 'text', placeholder, value, onChange, className = '', icon }) => {
  return (
    <div className={`relative w-full ${className}`}>
      {icon && <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full py-4 bg-gray-50 border border-transparent focus:border-[#6F4E37] focus:bg-white rounded-full outline-none font-bold text-sm transition-all ${icon ? 'pl-12 pr-6' : 'px-6'}`}
      />
    </div>
  );
};

export default Input;