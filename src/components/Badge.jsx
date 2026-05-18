import React from 'react';

const Badge = ({ status }) => {
  const styles = {
    PROCESS: "bg-amber-50 text-amber-600 border border-amber-100",
    DONE: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    CANCEL: "bg-red-50 text-red-600 border border-red-100"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${styles[status] || styles.PROCESS}`}>
      {status}
    </span>
  );
};

export default Badge;