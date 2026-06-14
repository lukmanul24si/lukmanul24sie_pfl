import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const Login = () => {
  // AMBIL FUNGSI login TERPUSAT (Bukan setUser lagi)
  const { login } = useApp(); 
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) return alert('Isi email dan password!');

    // Panggil fungsi login bawaan context. 
    // Ini otomatis nge-set state user dan mengunci localStorage detik ini juga!
    login('admin');
    
    // TIDAK perlu navigate() — PublicRoute otomatis redirect ke /dashboard
    // saat state 'user' berubah menjadi terisi.
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F5F0] font-sans p-6">
      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] w-full max-w-md shadow-[0_20px_50px_rgba(60,42,33,0.05)] border border-[#F2EAE1] flex flex-col">

        {/* Header Logo Area */}
        <div className="text-center mb-9">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F5EBE1] text-3xl mb-4 animate-bounce">
            ☕
          </div>
          <h2 className="text-3xl font-black text-[#3C2A21] tracking-tighter uppercase font-shop italic">
            BOGENG
          </h2>
          <div className="inline-block bg-[#EADBC8] text-[#3C2A21] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mt-1.5">
            Coffee Shop & CRM
          </div>
        </div>

        {/* Form Input Area */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#8B7E74] uppercase ml-1 tracking-wider block">
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@bogeng.com"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              className="w-full pl-5 pr-4 py-4 bg-[#FDFBF9] rounded-2xl outline-none border border-[#EADBC8] focus:border-[#3C2A21] focus:ring-1 focus:ring-[#3C2A21] font-bold text-[#3C2A21] text-sm transition-all placeholder-gray-300"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-[11px] font-bold text-[#8B7E74] uppercase tracking-wider">
                Password
              </label>
              <Link to="/forgot" className="text-[11px] font-black text-[#C67C4E] uppercase tracking-wider hover:underline">
                Forgot?
              </Link>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full pl-5 pr-4 py-4 bg-[#FDFBF9] rounded-2xl outline-none border border-[#EADBC8] focus:border-[#3C2A21] focus:ring-1 focus:ring-[#3C2A21] font-bold text-[#3C2A21] text-sm transition-all placeholder-gray-300"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-2 py-4 bg-[#3C2A21] text-white rounded-2xl font-black text-xs tracking-widest uppercase shadow-lg shadow-amber-900/10 hover:bg-[#2A1D16] transition-all active:scale-[0.98] cursor-pointer"
          >
            Masuk ke Sistem
          </button>
        </form>

        {/* Footer Link Daftar */}
        <div className="text-center mt-6 mb-5">
          <p className="text-[#8B7E74] text-xs font-bold">
            Belum punya akun barista?{' '}
            <Link to="/register" className="text-[#C67C4E] font-black hover:underline ml-1">
              Daftar Sekarang
            </Link>
          </p>
        </div>

        {/* ================= SECTION BOX AKUN DEMO KASIR ================= */}
        <div className="bg-[#FAF6F0] rounded-2xl p-4 border border-[#EADBC8]/60 flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs">💡</span>
            <h4 className="text-[11px] font-black uppercase tracking-wider text-[#3C2A21]">
              Informasi Login Kasir (Demo)
            </h4>
          </div>
          
          <div className="space-y-1.5 text-xs text-[#6B5E54]">
            <div className="flex justify-between items-center bg-white/70 px-3 py-2 rounded-xl border border-[#F2EAE1]">
              <span className="font-medium text-[11px] text-[#8B7E74]">ID / EMAIL :</span>
              <code className="font-mono font-bold text-[#3C2A21] text-[11px]">admin@bogeng.com</code>
            </div>
            <div className="flex justify-between items-center bg-white/70 px-3 py-2 rounded-xl border border-[#F2EAE1]">
              <span className="font-medium text-[11px] text-[#8B7E74]">PASSWORD :</span>
              <code className="font-mono font-bold text-[#3C2A21] text-[11px]">admin123</code>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;