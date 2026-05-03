import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/main/Dashboard';
import Orders from './pages/main/Orders';
import Customers from './pages/main/Customers';
import ErrorPage from './pages/main/ErrorPage';
import Login from './pages/auth/Login'; // Import halaman Login baru kamu

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Rute Login: ditaruh di luar MainLayout agar Sidebar tidak muncul */}
        <Route path="/login" element={<Login />} />

        {/* 2. Redirect awal: Jika buka root (/) langsung ke /login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* 3. Rute utama: Dibungkus MainLayout (Pakai Sidebar) */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
        </Route>

        {/* 4. Tangkap semua alamat salah ke ErrorPage */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;