import React from 'react';

const Loading = () => (
  <div className="h-screen w-full flex flex-col items-center justify-center bg-orange-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-600 border-opacity-50"></div>
    <p className="mt-4 text-orange-800 font-medium italic">Menyeduh Kopi Anda...</p>
  </div>
);

export default Loading;