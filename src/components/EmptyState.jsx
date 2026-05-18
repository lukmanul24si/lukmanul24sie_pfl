import React from 'react';

const EmptyState = ({ icon = "🔍", title = "Data Tidak Ditemukan", message }) => {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center text-center bg-white rounded-[2.5rem] border border-gray-100 border-dashed p-8">
      <span className="text-5xl mb-4 animate-bounce duration-1000">{icon}</span>
      <h4 className="font-black text-gray-800 text-base mb-1">{title}</h4>
      {message && <p className="text-xs font-bold text-gray-400 max-w-xs">{message}</p>}
    </div>
  );
};

export default EmptyState;