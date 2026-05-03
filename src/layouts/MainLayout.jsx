// src/layouts/MainLayout.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#fdfaf7]">
      {/* Sidebar tetap di kiri dengan lebar tetap */}
      <Sidebar />

      {/* Area Konten Utama: Beri margin kiri sebesar lebar sidebar (w-72 = 18rem) */}
      <main className="flex-1 ml-72 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;