import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Validasi sederhana (Ganti sesuai kebutuhan)
    if (email === 'admin@mail.com' && password === 'admin123') {
      navigate('/dashboard'); // Jika berhasil, pindah ke dashboard
    } else {
      alert('Email atau Password salah! (Coba: admin@mail.com / admin123)');
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf7] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 border border-orange-50">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-[#1a120b] tracking-tighter">BEANS & CO.</h1>
          <p className="text-gray-400 font-medium mt-2">Login Kasir Gacor</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-xs font-black uppercase text-gray-400">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full mt-1 p-4 bg-orange-50/50 border border-orange-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="admin@mail.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-black uppercase text-gray-400">Password</label>
            <input 
              type="password" 
              required
              className="w-full mt-1 p-4 bg-orange-50/50 border border-orange-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-[#1a120b] text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-orange-800 transition-all"
          >
            MASUK
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;