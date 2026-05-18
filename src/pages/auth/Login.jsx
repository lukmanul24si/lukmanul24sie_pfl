import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) return alert("Isi email dan password!");

    // Catatan Penting Agar Jalan (Sesuai Screenshot):
    localStorage.setItem('bogeng_user', 'admin'); // Set status login
    navigate('/dashboard');
    window.location.reload(); // Refresh kecil biar App.jsx baca status baru
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbf9f6] font-sans p-4">
      <div className="bg-white p-10 md:p-12 rounded-[3rem] w-full max-w-md shadow-xl border border-gray-100 flex flex-col text-center">
        
        {/* Logo / Brand */}
        <div className="mb-8">
          <span className="text-5xl block mb-2">☕</span>
          <h2 className="text-3xl font-black text-[#3C2A21] uppercase tracking-tighter italic font-shop">
            BOGENG
          </h2>
          <p className="text-xs font-black text-[#6F4E37] uppercase tracking-widest mt-1">
            Coffee Shop & CRM
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5 text-left">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-wider">Email Address</label>
            <input 
              type="email" 
              placeholder="admin@bogeng.com" 
              className="w-full p-4 bg-[#fbf9f6] rounded-2xl outline-none border border-transparent focus:border-[#6F4E37] font-bold text-[#3C2A21] text-sm"
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Password</label>
              <Link to="/forgot" className="text-[10px] font-black text-[#6F4E37] uppercase tracking-wider hover:underline">
                Forgot?
              </Link>
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full p-4 bg-[#fbf9f6] rounded-2xl outline-none border border-transparent focus:border-[#6F4E37] font-bold text-[#3C2A21] text-sm"
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
          </div>

          <button 
            type="submit" 
            className="w-full mt-4 py-4 bg-[#3C2A21] text-white rounded-2xl font-black text-xs tracking-widest uppercase shadow-lg shadow-brown-100 hover:bg-[#2d1e13] transition-all active:scale-95"
          >
            Masuk ke Sistem
          </button>
        </form>

        <p className="text-gray-400 text-xs font-bold mt-8">
          Belum punya akun barista?{' '}
          <Link to="/register" className="text-[#6F4E37] font-black hover:underline">
            Daftar Sekarang
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;