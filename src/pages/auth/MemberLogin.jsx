// src/pages/auth/MemberLogin.jsx
//
// ✅ UPDATE: Login sekarang pakai EMAIL + PASSWORD lewat
// supabase.auth.signInWithPassword(), bukan username+nomor HP lagi.
// Kalau email belum diverifikasi, Supabase menolak login dengan pesan
// "Email not confirmed" — kita tangani dengan tombol "Kirim ulang email".
// ✅ UPDATE: Tambah tombol Demo Credential Autofill (hakim@gmail.com / hakim123)
import logoImg from '../../assets/logo.png';
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Coffee, Mail, Lock, Eye, EyeOff, UserPlus, Sparkles, MailCheck } from "lucide-react";
import { supabase } from "../../lib/supabase";

const BG_URL =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=85";

export default function MemberLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) navigate("/member");
    });
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, [navigate]);

  useEffect(() => {
    const prevHtml = document.documentElement.style.backgroundColor;
    const prevBody = document.body.style.backgroundColor;
    document.documentElement.style.backgroundColor = "#FAF7F2";
    document.body.style.backgroundColor = "#FAF7F2";
    return () => {
      document.documentElement.style.backgroundColor = prevHtml;
      document.body.style.backgroundColor = prevBody;
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setNeedsConfirm(false);
    setResendMsg("");
    if (!form.email || !form.password) {
      setError("Email dan password wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      const { data, error: authErr } = await supabase.auth.signInWithPassword({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      if (authErr) {
        if (String(authErr.message || "").toLowerCase().includes("email not confirmed")) {
          setNeedsConfirm(true);
          setError("Email kamu belum diverifikasi. Cek inbox, atau kirim ulang di bawah.");
        } else if (String(authErr.message || "").toLowerCase().includes("invalid login")) {
          setError("Email atau password salah.");
        } else {
          setError(authErr.message || "Gagal login. Coba lagi.");
        }
        return;
      }

      // Ambil profil member dari tabel customers untuk disimpan sebagai sesi tampilan
      const { data: profile } = await supabase
        .from("customers")
        .select("id, full_name, username, email")
        .eq("auth_user_id", data.user.id)
        .maybeSingle();

      localStorage.setItem(
        "bogeng_member_session",
        JSON.stringify({
          id: profile?.id || data.user.id,
          name: profile?.full_name || profile?.username || data.user.email,
          username: profile?.username || "",
          email: data.user.email,
        })
      );

      navigate("/member");
    } catch (err) {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendMsg("");
    if (!form.email) {
      setResendMsg("Isi email dulu di atas.");
      return;
    }
    const { error: resendErr } = await supabase.auth.resend({
      type: "signup",
      email: form.email.trim().toLowerCase(),
    });
    setResendMsg(resendErr ? resendErr.message : "Email verifikasi baru sudah dikirim. Cek inbox kamu.");
  };

  const fillDemo = () => {
    setForm({ email: "hakim@gmail.com", password: "hakim123" });
    setError("");
    setNeedsConfirm(false);
    setResendMsg("");
  };

  return (
    <div
      className="min-h-screen w-full flex font-sans overflow-hidden bg-[#FAF7F2]"
      style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.35s ease-out" }}
    >
      {/* ── KIRI: Form ── */}
      <div className="relative flex flex-col justify-center items-center w-full lg:w-[48%] bg-[#FAF7F2] px-8 sm:px-14 py-12 z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-7 left-8 sm:left-14 flex items-center gap-2"
        >
          <img src={logoImg} alt="Logo Bogeng" className="w-7 h-7 rounded-lg object-cover shadow-md shadow-[#C67C4E]/20" />
          <span className="text-sm font-black tracking-tight font-serif italic text-[#2F2D2C]">
            Bogeng<span className="text-[#C67C4E]">.</span>
          </span>
        </motion.div>

        {/* Nav kanan atas */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-7 right-8 sm:right-14 flex items-center gap-3"
        >
          <Link to="/login" className="text-[11px] font-bold text-gray-400 hover:text-[#C67C4E] uppercase tracking-wider transition-colors">
            Login Admin
          </Link>
          <Link to="/" className="text-[11px] font-bold text-gray-400 hover:text-[#C67C4E] uppercase tracking-wider transition-colors">
            ← Beranda
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[400px]"
        >
          {/* Heading */}
          <div className="mb-8">
            <span className="inline-block text-[10px] font-black text-[#C67C4E] uppercase tracking-[0.3em] mb-3 bg-[#C67C4E]/10 px-3 py-1.5 rounded-full">
              Portal Member
            </span>
            <h1 className="text-3xl sm:text-4xl font-black leading-[1.05] text-[#2F2D2C] mb-2">
              Masuk ke
              <br />
              <span className="font-serif italic text-[#C67C4E]">akun member.</span>
            </h1>
            <p className="text-sm text-gray-400 leading-relaxed">
              Gunakan email &amp; password yang kamu daftarkan.
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
                {needsConfirm && (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="mt-2 flex items-center gap-1.5 text-[#C67C4E] font-black hover:underline"
                  >
                    <MailCheck size={12} /> Kirim ulang email verifikasi
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {resendMsg && (
            <p className="mb-5 text-[11px] font-bold text-emerald-600">{resendMsg}</p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block ml-1">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="email"
                  placeholder="kamu@email.com"
                  value={form.email}
                  onChange={(e) => { setForm((p) => ({ ...p, email: e.target.value })); setError(""); setNeedsConfirm(false); }}
                  className="w-full pl-10 pr-5 py-3.5 bg-white border-2 border-[#EFE6DC] hover:border-[#C67C4E]/40 focus:border-[#C67C4E] rounded-2xl outline-none font-bold text-sm text-[#2F2D2C] placeholder-gray-300 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block ml-1">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => { setForm((p) => ({ ...p, password: e.target.value })); setError(""); setNeedsConfirm(false); }}
                  className="w-full pl-10 pr-11 py-3.5 bg-white border-2 border-[#EFE6DC] hover:border-[#C67C4E]/40 focus:border-[#C67C4E] rounded-2xl outline-none font-bold text-sm text-[#2F2D2C] placeholder-gray-300 transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#C67C4E]"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="w-full mt-2 py-4 bg-[#2F2D2C] hover:bg-[#C67C4E] text-white rounded-2xl font-black text-xs tracking-widest uppercase transition-colors duration-300 flex items-center justify-center gap-2 shadow-lg shadow-black/10 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Memverifikasi…</>
              ) : (
                <>Masuk ke Portal <ArrowRight size={14} /></>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#EFE6DC]" />
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">atau</span>
            <div className="flex-1 h-px bg-[#EFE6DC]" />
          </div>

          {/* Demo Box — klik untuk isi otomatis */}
          <motion.button
            type="button"
            onClick={fillDemo}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-white border-2 border-[#EFE6DC] hover:border-[#C67C4E]/30 rounded-2xl p-4 text-left transition-all duration-200 shadow-sm group mb-4"
          >
            <div className="flex items-center gap-2 mb-2.5">
              <Sparkles size={13} className="text-[#C67C4E]" />
              <span className="text-[10px] font-black uppercase tracking-wider text-[#2F2D2C]">
                Akun Demo Member
              </span>
              <span className="ml-auto text-[9px] font-bold text-[#C67C4E] group-hover:underline uppercase tracking-wide">
                Klik untuk isi otomatis →
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#FAF7F2] px-3 py-1.5 rounded-xl border border-[#EFE6DC]">
                <p className="text-[9px] font-bold text-gray-400 uppercase mb-0.5">Email</p>
                <code className="text-[11px] font-black text-[#2F2D2C]">hakim@gmail.com</code>
              </div>
              <div className="bg-[#FAF7F2] px-3 py-1.5 rounded-xl border border-[#EFE6DC]">
                <p className="text-[9px] font-bold text-gray-400 uppercase mb-0.5">Password</p>
                <code className="text-[11px] font-black text-[#2F2D2C]">hakim123</code>
              </div>
            </div>
          </motion.button>

          {/* Info daftar member */}
          <div className="bg-[#FAF7F2] border-2 border-[#EFE6DC] rounded-2xl p-4">
            <p className="text-[10px] font-black text-[#2F2D2C] mb-2 flex items-center gap-1.5">
              <Coffee size={12} className="text-[#C67C4E]" /> Belum terdaftar sebagai member?
            </p>
            <p className="text-[11px] text-gray-400 font-bold leading-relaxed mb-3">
              Daftarkan dirimu sekarang, gratis! Nikmati keuntungan member eksklusif Bogeng.
            </p>
            <Link
              to="/member-register"
              className="inline-flex items-center gap-1.5 bg-[#C67C4E] hover:bg-[#A05C32] text-white font-black text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-xl transition-colors duration-200 w-full justify-center"
            >
              <UserPlus size={12} /> Daftar Member Sekarang
            </Link>
          </div>

          <p className="text-center text-xs text-gray-400 font-bold mt-5">
            Kamu admin/kasir?{" "}
            <Link to="/login" className="text-[#C67C4E] font-black hover:underline">Login Admin</Link>
          </p>
        </motion.div>
      </div>

      {/* ── KANAN: Foto ── */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:block flex-1 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-center bg-cover" style={{ backgroundImage: `url(${BG_URL})` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-12 left-10 right-10"
        >
          <p className="text-white/90 text-2xl font-black font-serif italic leading-snug mb-2">
            "Makin sering mampir,<br />makin banyak untungnya."
          </p>
          <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Bogeng Coffee — Pekanbaru</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-10 right-10 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl px-4 py-3 text-white"
        >
          <div className="flex items-center gap-2">
            <Coffee size={14} className="text-[#C67C4E]" />
            <span className="text-xs font-black uppercase tracking-wider">Member Exclusive</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}