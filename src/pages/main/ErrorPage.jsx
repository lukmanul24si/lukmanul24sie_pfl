import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F9F2ED] flex flex-col items-center justify-center p-6 text-center font-sans antialiased">
      <motion.div 
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-xs bg-white p-6 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-[#E6E6E6]/60 flex flex-col items-center"
      >
        <span className="text-4xl mb-3 block">☕⚠️</span>
        <h1 className="text-2xl font-extrabold text-[#2F2D2C] tracking-tight">404</h1>
        <h2 className="text-xs font-bold text-[#C67C4E] mt-0.5">Halaman Tidak Ditemukan</h2>
        <p className="text-[10px] text-[#9B9B9B] mt-2 leading-relaxed font-medium">
          URL kasir yang lo akses salah arah nih bro. Yuk balik ke halaman penjualan utama.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-5 w-full py-2.5 bg-[#C67C4E] text-white rounded-xl text-[11px] font-bold shadow-sm hover:bg-[#A65C2E] transition-colors"
        >
          Kembali ke POS
        </button>
      </motion.div>
    </div>
  );
};

export default ErrorPage;