import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brown-900" 
         style={{ backgroundImage: "url('/src/assets/bg.png')", backgroundSize: 'cover' }}>
      <div className="bg-white/90 p-8 rounded-xl shadow-2xl w-full max-w-md backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-center text-orange-800 mb-6">☕ Coffee Hub</h1>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;