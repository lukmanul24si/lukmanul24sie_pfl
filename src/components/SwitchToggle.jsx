import React from 'react';
import { motion } from 'framer-motion';

const SwitchToggle = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none font-sans">
      {/* Track Toggle */}
      <div 
        onClick={() => onChange(!checked)}
        className={`w-8 h-4.5 rounded-full p-0.5 transition-colors duration-300 relative ${
          checked ? 'bg-[#C67C4E]' : 'bg-[#E3E3E3]'
        }`}
      >
        {/* Tombol Bulat Meluncur */}
        <motion.div 
          className="w-3.5 h-3.5 bg-white rounded-full shadow-sm"
          animate={{ x: checked ? 14 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
      {label && <span className="text-[11px] font-black text-[#313131] tracking-tight">{label}</span>}
    </label>
  );
};

export default SwitchToggle;