import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleRegister = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return alert("Semua data wajib diisi!");
    
    alert("Akun Barista Berhasil Dibuat! Silakan login.");
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbf9f6] font-sans p-4">
      <div className="bg-white p-10 md:p-12 rounded-[3rem] w-full max-w-md shadow-xl border border-gray-100 flex flex-col text-center">
        
        {/* Header */}
        <div className="mb-8">
          <span className="text-5xl block mb-2">📋</span>
          <h2 className="text-3xl font-black text-[#3C2A21] uppercase tracking-tighter italic font-shop">
            Join Barista
          </h2>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">
            Buat akun kelola Bogeng POS
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-5 text-left">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-wider">Nama Lengkap</label>
            <input 
              type="text" 
              placeholder="Masukkan nama lengkap..." 
              className="w-full p-4 bg-[#fbf9f6] rounded-2xl outline-none border border-transparent focus:border-[#6F4E37] font-bold text-[#3C2A21] text-sm"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-wider">Email Kerja</label>
            <input 
              type="email" 
              placeholder="barista@bogeng.com" 
              className="w-full p-4 bg-[#fbf9f6] rounded-2xl outline-none border border-transparent focus:border-[#6F4E37] font-bold text-[#3C2A21] text-sm"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-wider">Password Baru</label>
            <input 
              type="password" 
              placeholder="Minim 6 karakter" 
              className="w-full p-4 bg-[#fbf9f6] rounded-2xl outline-none border border-transparent focus:border-[#6F4E37] font-bold text-[#3C2A21] text-sm"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button 
            type="submit" 
            className="w-full mt-4 py-4 bg-[#6F4E37] text-white rounded-2xl font-black text-xs tracking-widest uppercase shadow-lg shadow-brown-100 hover:bg-[#5a3f2d] transition-all active:scale-95"
          >
            Daftarkan Akun
          </button>
        </form>

        <p className="text-gray-400 text-xs font-bold mt-8">
          Sudah terdaftar?{' '}
          <Link to="/login" className="text-[#3C2A21] font-black hover:underline">
            Masuk Di Sini
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;