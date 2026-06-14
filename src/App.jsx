import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useApp } from "./context/AppContext";
import Logout from "./pages/main/Logout";

// LAZY LOADING LAYOUTS & PAGES
const MainLayout = lazy(() => import("./layouts/MainLayout"));
const Dashboard  = lazy(() => import("./pages/main/Dashboard"));
const Orders     = lazy(() => import("./pages/main/Orders"));
const Customers  = lazy(() => import("./pages/main/Customers"));
const AdminUsers = lazy(() => import("./pages/main/AdminUsers")); // 👈 IMPORT HALAMAN CRUD USER/STAF BARU LU DI SINI
const Login      = lazy(() => import("./pages/auth/Login"));
const Register   = lazy(() => import("./pages/auth/Register"));
const Forgot     = lazy(() => import("./pages/auth/Forgot"));
const ErrorPage  = lazy(() => import("./pages/main/ErrorPage"));

// LOADING SPINNER INTERAKTIF (BOGENG BRANDING)
const Loading = () => (
  <div className="h-screen w-full flex items-center justify-center bg-[#F9F2ED]">
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-[#C67C4E]" />
      <p className="font-bold text-[#C67C4E] animate-pulse text-xs uppercase tracking-widest">
        BOGENG POS...
      </p>
    </div>
  </div>
);

// 1. GUARD PUBLIC — Cegah user yang sudah login masuk ke area Auth kembali
const PublicRoute = () => {
  const { user } = useApp();
  
  // Jika token user terdeteksi aktif, langsung kunci & lempar ke dashboard tanpa ampun
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

// 2. GUARD PROTECTED — Kunci ketat area dashboard kasir utama
const ProtectedRoute = () => {
  const { user } = useApp();
  
  // Jika user null/tidak ada, langsung tendang ke login secara deklaratif
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>

        {/* REDIRECT ROOT UTAMA */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* ================= AREA PUBLIK (AUTH ROUTES) ================= */}
        {/* Bisa diakses bebas oleh user yang BELUM LOGIN */}
        <Route element={<PublicRoute />}>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot"   element={<Forgot />} />
        </Route>

        {/* ================= AREA TERPROTEKSI (KASIR UTAMA) ================= */}
        {/* Hanya bisa diakses setelah login, otomatis dapet Sidebar/Navbar Bogeng Coffee */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard"   element={<Dashboard />} />
            <Route path="/orders"      element={<Orders />} />
            <Route path="/customers"   element={<Customers />} />
            <Route path="/admin/users" element={<AdminUsers />} /> {/* 👈 RUTE KHUSUS CRUD DATA USER STAF SUPABASE */}
            
            {/* Jika ngetik url ngasal pas kondisi login, arahkan ke ErrorPage */}
            <Route path="*"            element={<ErrorPage />} />
          </Route>
        </Route>

        {/* ================= RUTE LOGOUT INDEPENDEN (ANTI-STUCK) ================= */}
        {/* Ditaruh di luar Guard agar proses pembersihan state & DOM berjalan lancar */}
        <Route path="/logout" element={<Logout />} />

        {/* ================= GLOBAL FALLBACK ================= */}
        {/* Jika url tidak dikenal sama sekali dan di luar kondisi login, tendang ke /login */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Suspense>
  );
}

export default App;