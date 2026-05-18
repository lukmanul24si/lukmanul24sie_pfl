import React, { lazy, Suspense, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Lazy Load Components Utama
const MainLayout = lazy(() => import("./layouts/MainLayout"));
const Dashboard = lazy(() => import("./pages/main/Dashboard"));
const Orders = lazy(() => import("./pages/main/Orders"));
const Customers = lazy(() => import("./pages/main/Customers"));

// Auth & Error Pages
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Forgot = lazy(() => import("./pages/auth/Forgot"));
const ErrorPage = lazy(() => import("./pages/main/ErrorPage")); // Pastikan file fisik ini ada di src/pages/ErrorPage.jsx

// Loading Animasi Aesthetic Sesuai Tema Kopi Figma
const Loading = () => (
  <div className="h-screen w-full flex items-center justify-center bg-[#F9F2ED]">
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-[#C67C4E]"></div>
      <p className="font-bold text-[#C67C4E] animate-pulse text-xs uppercase tracking-widest">BOGENG POS...</p>
    </div>
  </div>
);

function App() {
  const [user, setUser] = useState(localStorage.getItem('bogeng_user'));

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(localStorage.getItem('bogeng_user'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* ================= PUBLIC AREA ================= */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/forgot" element={!user ? <Forgot /> : <Navigate to="/dashboard" />} />

        {/* ================= PROTECTED AREA ================= */}
        {user ? (
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
            
            {/* JIKA SUDAH LOGIN TAPI KETIK URL CROSS-BORDER, LEMPAR KE ERROR PAGE */}
            <Route path="*" element={<ErrorPage />} />
          </Route>
        ) : (
          /* JIKA BELUM LOGIN TAPI KETIK URL ASAL-ASALAN, PAKSA KE LOGIN */
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Suspense>
  );
}

export default App;