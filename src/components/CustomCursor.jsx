import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
  // 1. Buat nilai motion untuk koordinat X dan Y kursor
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // 2. Tambahkan efek spring (pegas) biar gerakannya punya inersia/efek ekor yang smooth
  // stiffness: tingkat kekakuan pegas, damping: tingkat redaman/rem animasi
  const springConfig = { stiffness: 400, damping: 28 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // 3. Tangkap pergerakan mouse manusia secara real-time
    const moveCursor = (e) => {
      // Dikurangi 12 agar titik tengah lingkaran pas di ujung lancip kursor asli
      cursorX.set(e.clientX - 12);
      cursorY.set(e.clientY - 12);
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Lingkaran ekor kursor (Hanya muncul di perangkat desktop yang punya mouse) */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 rounded-full border-2 border-[#C67C4E]/40 bg-[#C67C4E]/5 pointer-events-none z-[9999] hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      />

      {/* Menghilangkan kursor default bawaan windows khusus di dalam aplikasi agar diganti total */}
      <style>{`
        body, button, input, a, [role="button"] {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='%23313131' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m4 4 7.07 18.29 2.51-7.39 7.39-2.51L4 4z'/%3E%3C/svg%3E"), auto !important;
        }
        button:hover, [role="button"]:hover, input:focus {
          /* Efek saat hover tombol, kursor asli sedikit berubah warna */
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='%23C67C4E' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m4 4 7.07 18.29 2.51-7.39 7.39-2.51L4 4z'/%3E%3C/svg%3E"), auto !important;
        }
      `}</style>
    </>
  );
};

export default CustomCursor;