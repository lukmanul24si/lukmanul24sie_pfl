import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/main/Dashboard";
import Orders from "./pages/main/Orders";
import Customers from "./pages/main/Customers";
import AddMenu from "./pages/main/AddMenu";
import ErrorPage from "./pages/main/ErrorPage";
import Login from "./pages/auth/Login";
import './App.css';

function App() {
  return (
    <Routes>
      {/* 1. Rute Login: Tanpa Sidebar */}
      <Route path="/login" element={<Login />} />

      {/* 2. Redirect awal: Dari / ke /login */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* 3. Rute Utama: Pakai Sidebar (MainLayout) */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/add-menu" element={<AddMenu />} />
      </Route>

      {/* 4. Halaman Error */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;