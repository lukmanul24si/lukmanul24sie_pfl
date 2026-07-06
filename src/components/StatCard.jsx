import React from 'react';
import { motion } from 'framer-motion';

// 🔧 FIX:
// 1. Ukuran dikecilin total (padding, radius, font) biar konsisten sama
//    tema compact di Orders.jsx/Customers.jsx (border-[0.5px] #E3E3E3,
//    teks kecil #9B9B9B/#313131, rounded-xl bukan rounded-[2rem]).
// 2. Prop `iconBg`, `iconColor`, `valueColor`, `delay` sebelumnya dikirim
//    dari Customers.jsx tapi TIDAK PERNAH dipakai di sini — makanya semua
//    card kelihatan sama warnanya. Sekarang beneran diterapkan.
// 3. Ditambahin entrance animation pakai `delay` (dulu prop-nya ada tapi
//    nganggur karena masih plain <div>, sekarang motion.div beneran
//    stagger sesuai delay yang dikirim).
const StatCard = ({
  title,
  value,
  icon,
  description,
  trend,
  iconBg = 'bg-[#FBF8F6]',
  iconColor = 'text-[#C67C4E]',
  valueColor = 'text-[#313131]',
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25, delay }}
      whileHover={{ borderColor: '#C67C4E' }}
      className="bg-white p-3.5 rounded-xl border-[0.5px] border-[#E3E3E3] shadow-sm flex items-center justify-between transition-colors"
    >
      <div className="space-y-1 min-w-0">
        <p className="text-[9px] font-black text-[#9B9B9B] uppercase tracking-wider truncate">
          {title}
        </p>
        <h3 className={`text-lg font-black tracking-tight ${valueColor}`}>{value}</h3>
        {description && (
          <p className="text-[9px] font-bold text-[#9B9B9B]">
            {trend && <span className="text-emerald-500 mr-1">{trend}</span>}
            {description}
          </p>
        )}
      </div>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ml-3 ${iconBg} ${iconColor}`}>
        {icon}
      </div>
    </motion.div>
  );
};

export default StatCard;