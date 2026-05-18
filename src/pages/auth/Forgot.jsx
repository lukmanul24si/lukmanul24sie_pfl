import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Forgot = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleReset = (e) => {
    e.preventDefault();
    if (!email) return alert("Masukkan email akun kamu!");

    alert(`🔑 Link reset password telah dikirim ke ${email}`);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbf9f6] font-sans p-4">
      <div className="bg-white p-10 md:p-12 rounded-[3rem] w-full max-w-md shadow-xl border border-gray-100 flex flex-col text-center">
        
        {/* Header */}
        <div className="mb-8">
          <span className="text-5xl block mb-2">🔐</span>
          <h2 className="text-3xl font-black text-[#3C2A21] uppercase tracking-tighter italic font-shop">
            Reset Password
          </h2>
          <p className="text-xs font-semibold text-gray-400 mt-2 px-4 leading-relaxed">
            Masukkan email terdaftar untuk menerima link pemulihan kata sandi.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleReset} className="space-y-5 text-left">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-wider">Email Terdaftar</label>
            <input 
              type="email" 
              placeholder="Masukkan email kamu..." 
              className="w-full p-4 bg-[#fbf9f6] rounded-2xl outline-none border border-transparent focus:border-[#6F4E37] font-bold text-[#3C2A21] text-sm"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="w-full mt-4 py-4 bg-[#3C2A21] text-white rounded-2xl font-black text-xs tracking-widest uppercase shadow-lg shadow-brown-100 hover:bg-[#2d1e13] transition-all active:scale-95"
          >
            Kirim Link Pemulihan
          </button>
        </form>

        <div className="mt-8">
          <Link to="/login" className="text-xs font-black text-[#6F4E37] uppercase tracking-widest hover:underline">
            ← Kembali ke Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Forgot;