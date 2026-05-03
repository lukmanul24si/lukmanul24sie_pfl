import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => (
  <div className="h-screen flex flex-col items-center justify-center text-center p-6 bg-orange-50">
    <span className="text-9xl mb-4">☕️💥</span>
    <h1 className="text-6xl font-black text-orange-900">404</h1>
    <p className="text-2xl font-bold text-gray-700 mt-2">Waduh, Kopinya Tumpah!</p>
    <p className="text-gray-500 mb-8 max-w-md">Halaman yang kamu cari tidak ada di menu kami. Mungkin kamu salah ketik alamat?</p>
    <Link to="/dashboard" className="bg-orange-800 text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:bg-orange-900 transition-all">
      Kembali ke Dashboard
    </Link>
  </div>
);

export default ErrorPage;