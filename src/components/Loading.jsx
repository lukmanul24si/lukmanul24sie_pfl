import React from 'react';

const Loading = ({ message = "BOGENG POS..." }) => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#F8F9FD]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#6F4E37]"></div>
        <p className="font-shop font-bold text-[#6F4E37] animate-pulse text-sm uppercase tracking-widest">{message}</p>
      </div>
    </div>
  );
};

export default Loading;