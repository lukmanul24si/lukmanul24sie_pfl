import React, { lazy, Suspense, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import './App.css';

// 1. Lazy Load Components
const MainLayout = lazy(() => import("./layouts/MainLayout"));
const Dashboard = lazy(() => import("./pages/main/Dashboard"));
const Orders = lazy(() => import("./pages/main/Orders"));
const Customers = lazy(() => import("./pages/main/Customers"));
const Login = lazy(() => import("./pages/auth/Login"));

// 2. Loading Component
const Loading = () => (
  <div className="h-screen w-full flex items-center justify-center bg-[#F8F9FD]">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#6F4E37]"></div>
      <p className="font-shop font-bold text-[#6F4E37] animate-pulse text-sm">BOGENG POS...</p>
    </div>
  </div>
);

function App() {
  // Gunakan state agar React tahu kapan harus re-render saat login/logout
  const [user, setUser] = useState(localStorage.getItem('bogeng_user'));

  // Sinkronisasi status login setiap kali ada perubahan di localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(localStorage.getItem('bogeng_user'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AppProvider>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Public Route: Login */}
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to="/dashboard" />} 
          />

          {/* Protected Routes Area */}
          {user ? (
            <Route element={<MainLayout />}>
              {/* Redirect root (/) ke dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/customers" element={<Customers />} />
              
              {/* Fallback untuk rute aneh-aneh pas sudah login */}
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Route>
          ) : (
            /* Jika belum login, paksa ke halaman login */
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Suspense>
    </AppProvider>
  );
}

export default App;