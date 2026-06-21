// src/pages/auth/Login.jsx
// Halaman login Bogeng — visual matching dengan landing page (cream + terracotta)
// Fix: tidak ada overlay gelap dari page-exit landing page
import logoImg from "../../assets/logo.png";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Coffee, ArrowRight, Sparkles } from "lucide-react";
import { useApp } from "../../context/AppContext";

// Gambar kafe untuk background kanan (sama vibe dengan spotlight di landing)
const BG_URL =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=85";

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  // Fade-in saat halaman pertama load — bukan overlay dari luar
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!credentials.email || !credentials.password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    // Demo credential check
    if (
      credentials.email !== "admin@bogeng.com" ||
      credentials.password !== "admin123"
    ) {
      setError("Email atau password salah. Cek info demo di bawah.");
      return;
    }

    setLoading(true);
    // Sedikit delay agar terasa "proses" lalu masuk
    await new Promise((r) => setTimeout(r, 700));
    login("admin");
    // PublicRoute akan otomatis redirect ke /dashboard setelah user terisi
  };

  const fillDemo = () => {
    setCredentials({ email: "admin@bogeng.com", password: "admin123" });
    setError("");
  };

  return (
    <div
      className="min-h-screen flex font-sans overflow-hidden"
      style={{
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.35s ease-out",
      }}
    >
      {/* ── KIRI: Form ─────────────────────────────────────────────── */}
      <div className="relative flex flex-col justify-center items-center w-full lg:w-[48%] bg-[#FAF7F2] px-8 sm:px-14 py-12 z-10">
        {/* Logo kiri atas */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-7 left-8 sm:left-14 flex items-center gap-2"
        >
          <img
            src={logoImg}
            alt="Logo Bogeng"
            className="w-7 h-7 rounded-lg object-cover shadow-md shadow-[#C67C4E]/20"
          />
          <span className="text-sm font-black tracking-tight font-serif italic text-[#2F2D2C]">
            Bogeng<span className="text-[#C67C4E]">.</span>
          </span>
        </motion.div>

        {/* Tombol kembali ke landing */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-7 right-8 sm:right-14"
        >
          <Link
            to="/"
            className="text-[11px] font-bold text-gray-400 hover:text-[#C67C4E] uppercase tracking-wider transition-colors flex items-center gap-1.5"
          >
            ← Kembali ke beranda
          </Link>
        </motion.div>

        {/* ── Form Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[400px]"
        >
          {/* Heading */}
          <div className="mb-8">
            <span className="inline-block text-[10px] font-black text-[#C67C4E] uppercase tracking-[0.3em] mb-3 bg-[#C67C4E]/10 px-3 py-1.5 rounded-full">
              Kasir & Admin
            </span>
            <h1 className="text-3xl sm:text-4xl font-black leading-[1.05] text-[#2F2D2C] mb-2">
              Selamat
              <br />
              <span className="font-serif italic text-[#C67C4E]">
                datang kembali.
              </span>
            </h1>
            <p className="text-sm text-gray-400">
              Masuk ke sistem kasir Bogeng Coffee untuk mulai melayani.
            </p>
          </div>

          {/* Error notice */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
                className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-xs font-bold text-red-500"
              >
                ⚠ {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block ml-1">
                Email
              </label>
              <input
                type="email"
                placeholder="admin@bogeng.com"
                value={credentials.email}
                onChange={(e) => {
                  setCredentials({ ...credentials, email: e.target.value });
                  setError("");
                }}
                autoComplete="email"
                className="w-full px-5 py-3.5 bg-white border-2 border-[#EFE6DC] hover:border-[#C67C4E]/40 focus:border-[#C67C4E] rounded-2xl outline-none font-bold text-sm text-[#2F2D2C] placeholder-gray-300 transition-all duration-200 shadow-sm"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1 mr-1">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot"
                  className="text-[11px] font-black text-[#C67C4E] hover:underline uppercase tracking-wider"
                >
                  Lupa?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={(e) => {
                    setCredentials({
                      ...credentials,
                      password: e.target.value,
                    });
                    setError("");
                  }}
                  autoComplete="current-password"
                  className="w-full px-5 py-3.5 bg-white border-2 border-[#EFE6DC] hover:border-[#C67C4E]/40 focus:border-[#C67C4E] rounded-2xl outline-none font-bold text-sm text-[#2F2D2C] placeholder-gray-300 transition-all duration-200 shadow-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#C67C4E] transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="w-full mt-2 py-4 bg-[#2F2D2C] hover:bg-[#C67C4E] text-white rounded-2xl font-black text-xs tracking-widest uppercase transition-colors duration-300 flex items-center justify-center gap-2 shadow-lg shadow-black/10 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memverifikasi…
                </>
              ) : (
                <>
                  Masuk ke Sistem <ArrowRight size={14} />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#EFE6DC]" />
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">
              atau
            </span>
            <div className="flex-1 h-px bg-[#EFE6DC]" />
          </div>

          {/* Demo Box — klik untuk isi otomatis */}
          <motion.button
            type="button"
            onClick={fillDemo}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-white border-2 border-[#EFE6DC] hover:border-[#C67C4E]/30 rounded-2xl p-4 text-left transition-all duration-200 shadow-sm group"
          >
            <div className="flex items-center gap-2 mb-2.5">
              <Sparkles size={13} className="text-[#C67C4E]" />
              <span className="text-[10px] font-black uppercase tracking-wider text-[#2F2D2C]">
                Akun Demo Kasir
              </span>
              <span className="ml-auto text-[9px] font-bold text-[#C67C4E] group-hover:underline uppercase tracking-wide">
                Klik untuk isi otomatis →
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#FAF7F2] px-3 py-1.5 rounded-xl border border-[#EFE6DC]">
                <p className="text-[9px] font-bold text-gray-400 uppercase mb-0.5">
                  Email
                </p>
                <code className="text-[11px] font-black text-[#2F2D2C]">
                  admin@bogeng.com
                </code>
              </div>
              <div className="bg-[#FAF7F2] px-3 py-1.5 rounded-xl border border-[#EFE6DC]">
                <p className="text-[9px] font-bold text-gray-400 uppercase mb-0.5">
                  Password
                </p>
                <code className="text-[11px] font-black text-[#2F2D2C]">
                  admin123
                </code>
              </div>
            </div>
          </motion.button>

          <p className="text-center text-xs text-gray-400 font-bold mt-5">
            Kamu pelanggan?{" "}
            <Link
              to="/member-login"
              className="text-[#C67C4E] font-black hover:underline"
            >
              Portal Member →
            </Link>
          </p>
        </motion.div>
      </div>

      {/* ── KANAN: Foto Kafe (desktop only) ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:block flex-1 relative overflow-hidden"
      >
        {/* Gambar kafe */}
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${BG_URL})` }}
        />
        {/* Overlay gradient kiri agar menyatu dengan form */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/10 to-transparent" />
        {/* Overlay gelap bawah untuk teks */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Quote di kanan bawah */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-12 left-10 right-10"
        >
          <p className="text-white/90 text-2xl font-black font-serif italic leading-snug mb-2">
            "Kopi yang diingat,
            <br />
            bukan cuma diminum."
          </p>
          <p className="text-white/50 text-xs font-bold uppercase tracking-widest">
            Bogeng Coffee — Pekanbaru
          </p>
        </motion.div>

        {/* Badge floating */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-10 right-10 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl px-4 py-3 text-white"
        >
          <div className="flex items-center gap-2">
            <Coffee size={14} className="text-[#C67C4E]" />
            <span className="text-xs font-black uppercase tracking-wider">
              Roasted Daily
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
