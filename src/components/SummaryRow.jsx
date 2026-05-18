import React from 'react';

const SummaryRow = ({ label, value, isBold, isDiscount }) => {
  return (
    <div className={`flex justify-between items-center text-xs ${
      isDiscount 
        ? 'text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100 font-black' 
        : isBold 
        ? 'font-black text-base text-gray-900 pt-2 border-t border-dashed border-gray-200' 
        : 'font-bold text-gray-400'
    }`}>
      <span>{label}</span>
      <span className={isBold ? 'text-xl text-[#6F4E37]' : ''}>{value}</span>
    </div>
  );
};

export default SummaryRow;