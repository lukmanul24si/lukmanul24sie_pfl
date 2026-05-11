import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Logic: Simpan status login di localStorage
    localStorage.setItem('bogeng_user', 'admin'); 
    navigate('/dashboard');
    window.location.reload(); 
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#3C2A21] via-[#6F4E37] to-[#A67B5B] font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-10 bg-white/95 backdrop-blur-sm rounded-[3rem] shadow-2xl border border-white/20"
      >
        <div className="text-center mb-10">
          <div className="inline-flex w-16 h-16 bg-[#6F4E37] rounded-2xl items-center justify-center text-white text-3xl font-black shadow-lg mb-4">
            B
          </div>
          <h1 className="font-shop font-extrabold text-3xl tracking-tighter text-[#3C2A21]">
            BOGENG <span className="text-[#6F4E37]">POS</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-2">Sistem Kasir Bogeng Coffee</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-4">Email</label>
            <input 
              type="email" 
              placeholder="admin@bogeng.com"
              className="w-full px-6 py-4 bg-gray-100 border border-transparent focus:border-[#6F4E37] rounded-full outline-none font-bold text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-4">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-6 py-4 bg-gray-100 border border-transparent focus:border-[#6F4E37] rounded-full outline-none font-bold text-sm"
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-[#6F4E37] text-white rounded-full font-black text-sm shadow-xl hover:bg-[#5a3f2d] transition-all uppercase tracking-widest"
          >
            Sign In
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;