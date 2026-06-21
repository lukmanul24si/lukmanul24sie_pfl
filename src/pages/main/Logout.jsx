// src/pages/main/Logout.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const Logout = () => {
  const { logout } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const triggerLogout = async () => {
      try {
        // 1. Eksekusi fungsi logout dari context untuk bersihkan state user admin
        await logout();
        
        // 2. 🟢 PERBAIKAN KRUSIAL: Hapus token autentikasi secara spesifik (TIDAK BOLEH MEMAKAI localStorage.clear())
        localStorage.removeItem('bogeng_user');             // Hapus sesi Admin/Kasir
        localStorage.removeItem('bogeng_member_session');    // Hapus sesi Member/Pelanggan
        sessionStorage.clear();                              // Aman karena hanya membersihkan temporary tab saja
        
        // 3. Hapus style overlay Radix UI yang berpotensi mengunci layar
        document.body.removeAttribute("style");
        document.documentElement.removeAttribute("style");
        document.body.style.pointerEvents = "auto";
        document.body.style.overflow = "auto";

      } catch (error) {
        console.error("Gagal memproses logout:", error);
      } finally {
        // 4. Setelah bersih, tendang kembali ke halaman login utama
        navigate("/login", { replace: true });
      }
    };

    triggerLogout();
  }, [logout, navigate]);

  // TAMPILAN LOADING INTERAKTIF SAAT PROSES BERLANGSUNG
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#F9F2ED]">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-[#C67C4E]" />
        <p className="font-bold text-[#C67C4E] animate-pulse text-xs uppercase tracking-widest">
          MEMBERSIHKAN SESI BOGENG POS...
        </p>
      </div>
    </div>
  );
};

export default Logout;