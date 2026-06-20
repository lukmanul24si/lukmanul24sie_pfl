import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useApp } from "./context/AppContext";
import Logout from "./pages/main/Logout";

// LAZY LOADING LAYOUTS & PAGES
const MainLayout        = lazy(() => import("./layouts/MainLayout"));
const BogengLandingPage = lazy(() => import("./pages/main/BogengLandingPage"));
const Dashboard         = lazy(() => import("./pages/main/Dashboard"));
const Orders            = lazy(() => import("./pages/main/Orders"));
const Customers         = lazy(() => import("./pages/main/Customers"));
const MembersPage       = lazy(() => import("./pages/main/MembersPage"));
const ReviewModeration  = lazy(() => import("./pages/main/ReviewModeration"));
const AdminUsers        = lazy(() => import("./pages/main/AdminUsers"));
const Login             = lazy(() => import("./pages/auth/Login"));
const Register          = lazy(() => import("./pages/auth/Register"));
const Forgot            = lazy(() => import("./pages/auth/Forgot"));
const ErrorPage         = lazy(() => import("./pages/main/ErrorPage"));

// ─── LOADING SPINNER BOGENG ────────────────────────────────────────────────
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

// ─── GUARD: hanya untuk yang BELUM login ──────────────────────────────────
// Jika sudah login → tendang ke /dashboard
const PublicRoute = () => {
  const { user } = useApp();
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

// ─── GUARD: hanya untuk yang SUDAH login ──────────────────────────────────
// Jika belum login → tendang ke /login
const ProtectedRoute = () => {
  const { user } = useApp();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>

        {/* ── LANDING PAGE (publik, selalu bisa diakses) ─────────────── */}
        <Route path="/" element={<BogengLandingPage />} />

        {/* ── AUTH ROUTES (redirect ke /dashboard kalau sudah login) ─── */}
        <Route element={<PublicRoute />}>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot"   element={<Forgot />} />
        </Route>

        {/* ── AREA TERPROTEKSI (kasir/admin) ─────────────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard"   element={<Dashboard />} />
            <Route path="/orders"      element={<Orders />} />
            <Route path="/customers"   element={<Customers />} />
            <Route path="/members"     element={<MembersPage />} />
            <Route path="/reviews"     element={<ReviewModeration />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="*"            element={<ErrorPage />} />
          </Route>
        </Route>

        {/* ── LOGOUT INDEPENDEN ───────────────────────────────────────── */}
        <Route path="/logout" element={<Logout />} />

        {/* ── GLOBAL FALLBACK: URL tak dikenal → login ───────────────── */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Suspense>
  );
}

export default App;
