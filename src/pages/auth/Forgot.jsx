// src/pages/auth/Forgot.jsx — visual matching dengan Login.jsx (Bogeng style)

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Coffee, MailCheck } from 'lucide-react';

const BG_URL = 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200&q=85';

export default function Forgot() {
  const navigate = useNavigate();
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const prevHtml = document.documentElement.style.backgroundColor;
    const prevBody = document.body.style.backgroundColor;
    document.documentElement.style.backgroundColor = '#FAF7F2';
    document.body.style.backgroundColor = '#FAF7F2';
    return () => {
      document.documentElement.style.backgroundColor = prevHtml;
      document.body.style.backgroundColor = prevBody;
    };
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Masukkan alamat email kamu dulu.'); return; }

    setLoading(true);
    // Simulasi kirim email
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSent(true);
    // Kembali ke login otomatis setelah 3 detik
    setTimeout(() => navigate('/login'), 3000);
  };

  return (
    <div
      className="min-h-screen w-full flex font-sans overflow-hidden bg-[#FAF7F2]"
      style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.35s ease-out' }}
    >
      {/* ── KIRI: Form ─────────────────────────────────────────────── */}
      <div className="relative flex flex-col justify-center items-center w-full lg:w-[48%] bg-[#FAF7F2] px-8 sm:px-14 py-12 z-10">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-7 left-8 sm:left-14 flex items-center gap-2"
        >
          <div className="w-7 h-7 bg-[#C67C4E] rounded-lg flex items-center justify-center text-white font-black text-xs shadow-md shadow-[#C67C4E]/20">
            B
          </div>
          <span className="text-sm font-black tracking-tight font-serif italic text-[#2F2D2C]">
            Bogeng<span className="text-[#C67C4E]">.</span>
          </span>
        </motion.div>

        {/* Kembali ke login */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-7 right-8 sm:right-14"
        >
          <Link
            to="/login"
            className="text-[11px] font-bold text-gray-400 hover:text-[#C67C4E] uppercase tracking-wider transition-colors"
          >
            ← Kembali ke login
          </Link>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[400px]"
        >
          <AnimatePresence mode="wait">
            {!sent ? (
              /* ── STATE: Input email ── */
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                {/* Heading */}
                <div className="mb-8">
                  <span className="inline-block text-[10px] font-black text-[#C67C4E] uppercase tracking-[0.3em] mb-3 bg-[#C67C4E]/10 px-3 py-1.5 rounded-full">
                    Lupa Password
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-black leading-[1.05] text-[#2F2D2C] mb-2">
                    Reset<br />
                    <span className="font-serif italic text-[#C67C4E]">kata sandi.</span>
                  </h1>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Masukkan email terdaftar dan kami akan kirimkan link pemulihan.
                  </p>
                </div>

                {/* Error */}
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

                <form onSubmit={handleReset} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block ml-1">
                      Email Terdaftar
                    </label>
                    <input
                      type="email"
                      placeholder="admin@bogeng.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      autoComplete="email"
                      className="w-full px-5 py-3.5 bg-white border-2 border-[#EFE6DC] hover:border-[#C67C4E]/40 focus:border-[#C67C4E] rounded-2xl outline-none font-bold text-sm text-[#2F2D2C] placeholder-gray-300 transition-all duration-200 shadow-sm"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="w-full mt-2 py-4 bg-[#2F2D2C] hover:bg-[#C67C4E] text-white rounded-2xl font-black text-xs tracking-widest uppercase transition-colors duration-300 flex items-center justify-center gap-2 shadow-lg shadow-black/10 disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Mengirim…
                      </>
                    ) : (
                      <>
                        Kirim Link Pemulihan <ArrowRight size={14} />
                      </>
                    )}
                  </motion.button>
                </form>

                <p className="text-center text-xs text-gray-400 font-bold mt-6">
                  Ingat passwordnya?{' '}
                  <Link to="/login" className="text-[#C67C4E] font-black hover:underline">
                    Masuk Sekarang
                  </Link>
                </p>
              </motion.div>

            ) : (
              /* ── STATE: Email terkirim ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                {/* Ikon sukses */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
                  className="w-20 h-20 bg-[#C67C4E]/10 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <MailCheck size={34} className="text-[#C67C4E]" />
                </motion.div>

                <h2 className="text-2xl font-black text-[#2F2D2C] mb-2">
                  Email Terkirim!
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed mb-2">
                  Link pemulihan sudah dikirim ke
                </p>
                <p className="text-sm font-black text-[#2F2D2C] mb-6 bg-[#EFE6DC] px-4 py-2 rounded-xl inline-block">
                  {email}
                </p>
                <p className="text-xs text-gray-400 font-bold mb-8">
                  Cek inbox atau folder spam kamu. Kamu akan diarahkan ke halaman login dalam beberapa detik…
                </p>

                {/* Progress bar otomatis */}
                <div className="w-full h-1 bg-[#EFE6DC] rounded-full overflow-hidden mb-6">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3, ease: 'linear' }}
                    className="h-full bg-[#C67C4E] rounded-full"
                  />
                </div>

                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-[#C67C4E] font-black text-xs uppercase tracking-wider hover:underline"
                >
                  Kembali ke Login <ArrowRight size={12} />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── KANAN: Foto Kafe (desktop only) ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:block flex-1 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${BG_URL})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-12 left-10 right-10"
        >
          <p className="text-white/90 text-2xl font-black font-serif italic leading-snug mb-2">
            "Setiap tegukan<br />punya ceritanya."
          </p>
          <p className="text-white/50 text-xs font-bold uppercase tracking-widest">
            Bogeng Coffee — Pekanbaru
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-10 right-10 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl px-4 py-3 text-white"
        >
          <div className="flex items-center gap-2">
            <Coffee size={14} className="text-[#C67C4E]" />
            <span className="text-xs font-black uppercase tracking-wider">Roasted Daily</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
