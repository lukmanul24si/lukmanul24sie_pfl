import React from 'react';

const SummaryRow = ({ label, value, isBold, isDiscount }) => {
  return (
    <div className={`flex justify-between items-center text-[11px] ${
      isDiscount
        ? 'text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100 font-black'
        : isBold
        ? 'font-black text-[#313131] pt-1 items-center'
        : 'font-medium text-[#9B9B9B]'
    }`}>
      <span className={isBold ? 'text-[10px] uppercase tracking-wider' : ''}>{label}</span>
      <span className={isBold ? 'text-sm text-[#C67C4E] font-black' : 'font-bold'}>{value}</span>
    </div>
  );
};

export default SummaryRow;