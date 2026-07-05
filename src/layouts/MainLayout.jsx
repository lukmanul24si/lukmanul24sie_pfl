import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// =========================================================================
// 🔴 CUSTOM CURSOR GLOBAL
// =========================================================================
import CustomCursor from "../components/CustomCursor";

// 🟢 KOMPONEN LAYOUT REUSABLE (sebelumnya di-copy manual di file ini)
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F9F2ED] p-4 flex justify-center items-center font-sans antialiased selection:bg-[#C67C4E]/20 text-[#313131]">

      {/* 🔴 AKTIVASI TAMPILAN CURSOR HUMANIZED */}
      <CustomCursor />

      <div className="w-full max-w-[1440px] h-[calc(100vh-2rem)] grid grid-cols-12 gap-4 relative overflow-hidden">

        {/* ========================================================= */}
        {/* SIDEBAR RAMPING & PRESISI (ANIMATED)                      */}
        {/* ========================================================= */}
        <Sidebar />

        {/* ========================================================= */}
        {/* MAIN WORKSPACE (10 KOLOM)                                 */}
        {/* ========================================================= */}
        <main className="col-span-10 flex flex-col h-full overflow-hidden">

          {/* Header Workspace */}
          <Topbar />

          {/* Canvas Putih Utama */}
          <div className="flex-1 bg-white rounded-xl border-[0.5px] border-[#E3E3E3] p-4 overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="w-full h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

      </div>
    </div>
  );
};

export default MainLayout;