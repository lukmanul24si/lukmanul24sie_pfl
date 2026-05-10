import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import './App.css';

// --- IMPLEMENTASI REACT LAZY (DAGING) ---
const MainLayout = lazy(() => import("./layouts/MainLayout"));
const Dashboard = lazy(() => import("./pages/main/Dashboard"));
const Orders = lazy(() => import("./pages/main/Orders"));
const OrderDetail = lazy(() => import("./pages/main/OrderDetail")); // Detail CRM 1
const Customers = lazy(() => import("./pages/main/Customers"));
const CustomerDetail = lazy(() => import("./pages/main/CustomerDetail")); // Detail CRM 2
const AddMenu = lazy(() => import("./pages/main/AddMenu"));
const ErrorPage = lazy(() => import("./pages/main/ErrorPage"));
const Login = lazy(() => import("./pages/auth/Login"));

// Loading screen sederhana saat pindah halaman
const Loading = () => (
  <div className="h-screen w-full flex items-center justify-center bg-[#fbf9f6]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#1a120b]"></div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* 1. Rute Login: Tanpa Sidebar */}
        <Route path="/login" element={<Login />} />

        {/* 2. Redirect awal: Dari / ke /login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* 3. Rute Utama: Pakai Sidebar (MainLayout) */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} /> {/* Detail Page 1 */}
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:name" element={<CustomerDetail />} /> {/* Detail Page 2 */}
          <Route path="/add-menu" element={<AddMenu />} />
        </Route>

        {/* 4. Halaman Error */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;