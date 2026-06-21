// src/pages/auth/MemberRegister.jsx
// Halaman daftar member baru — untuk pelanggan Bogeng Coffee
// Visual matching dengan MemberLogin & Login (cream + terracotta)
import logoImg from '../../assets/logo.png';
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Coffee,
  User,
  Phone,
  ChevronDown,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

const BG_URL =
  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=85";

const TIER_OPTIONS = [
  {
    value: "Member",
    label: "Member (Default)",
    desc: "Mulai kumpulkan poin dari transaksi pertama",
  },
  {
    value: "Loyal",
    label: "Loyal Member",
    desc: "Min. 10× transaksi — diskon 5% otomatis",
  },
  {
    value: "Vip",
    label: "VIP Member",
    desc: "Min. 25× transaksi — diskon 15% + akses eksklusif",
  },
];

export default function MemberRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    phoneNumber: "",
    membershipLevel: "Member",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Sudah ada session member → langsung ke portal
    const saved = localStorage.getItem("bogeng_member_session");
    if (saved) {
      navigate("/member");
      return;
    }
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

  const set = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.fullName.trim() ||
      !form.username.trim() ||
      !form.phoneNumber.trim()
    ) {
      setError("Semua kolom wajib diisi.");
      return;
    }
    if (form.username.includes(" ")) {
      setError("Username tidak boleh mengandung spasi.");
      return;
    }
    if (!/^08\d{8,11}$/.test(form.phoneNumber.trim())) {
      setError("Nomor HP tidak valid. Contoh: 081234567890");
      return;
    }

    setLoading(true);
    try {
      // Cek apakah username sudah dipakai
      const { data: existing } = await supabase
        .from("customers")
        .select("id")
        .eq("username_akun", form.username.toLowerCase().trim())
        .maybeSingle();

      if (existing) {
        setError("Username sudah dipakai. Pilih username lain.");
        setLoading(false);
        return;
      }

      const uniqueId = "bgc-" + Math.random().toString(36).substring(2, 8);

      const { error: dbErr } = await supabase.from("customers").insert([
        {
          id: uniqueId,
          nama_lengkap: form.fullName.trim(),
          username_akun: form.username.toLowerCase().trim(),
          nomor_hp: form.phoneNumber.trim(),
          tanggal_daftar: new Date().toISOString().split("T")[0],
          status_member: "Aktif",
          level_membership: form.membershipLevel,
        },
      ]);

      if (dbErr) throw dbErr;

      setSuccess(true);
      // Auto-login: simpan session lalu redirect ke portal setelah 2.5 detik
      localStorage.setItem(
        "bogeng_member_session",
        JSON.stringify({
          username: form.username.toLowerCase().trim(),
          id: uniqueId,
        }),
      );
      setTimeout(() => navigate("/member"), 2500);
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal mendaftar. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex font-sans overflow-hidden bg-[#FAF7F2]"
      style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.35s ease-out" }}
    >
      {/* ── KIRI: Foto kafe (desktop only) ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:block w-[42%] relative overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${BG_URL})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-[#FAF7F2] via-[#FAF7F2]/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Quote kiri bawah */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-12 left-10 right-10"
        >
          <p className="text-white/90 text-2xl font-black font-serif italic leading-snug mb-2">
            "Mulai perjalanan
            <br />
            rasa kamu di sini."
          </p>
          <p className="text-white/50 text-xs font-bold uppercase tracking-widest">
            Bogeng Coffee — Pekanbaru
          </p>
        </motion.div>

        {/* Badge tier */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-10 left-10 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl px-4 py-3"
        >
          <div className="flex items-center gap-2 text-white">
            <Sparkles size={14} className="text-[#C67C4E]" />
            <span className="text-xs font-black uppercase tracking-wider">
              Daftar Gratis
            </span>
          </div>
          <p className="text-[10px] text-white/60 font-bold mt-1">
            Reguler → Loyal → VIP
          </p>
        </motion.div>
      </motion.div>

      {/* ── KANAN: Form ─────────────────────────────────────────────── */}
      <div className="relative flex flex-col justify-center items-center flex-1 bg-[#FAF7F2] px-8 sm:px-14 py-12 z-10 overflow-y-auto">
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

        {/* Link kanan atas */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-7 right-8 sm:right-14 flex items-center gap-3"
        >
          <Link
            to="/member-login"
            className="text-[11px] font-bold text-gray-400 hover:text-[#C67C4E] uppercase tracking-wider transition-colors"
          >
            ← Sudah punya akun?
          </Link>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[420px] pt-14 pb-4"
        >
          <AnimatePresence mode="wait">
            {/* ── STATE: Sukses ── */}
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 18,
                    delay: 0.1,
                  }}
                  className="w-20 h-20 bg-[#C67C4E]/10 rounded-full flex items-center justify-center mx-auto mb-5"
                >
                  <CheckCircle2 size={36} className="text-[#C67C4E]" />
                </motion.div>
                <h2 className="text-2xl font-black text-[#2F2D2C] mb-2">
                  Pendaftaran Berhasil!
                </h2>
                <p className="text-sm text-gray-400 font-bold mb-1">
                  Selamat datang,{" "}
                  <span className="text-[#C67C4E]">{form.fullName}</span>!
                </p>
                <p className="text-xs text-gray-400 mb-6">
                  Kamu sudah terdaftar sebagai member Bogeng. Kamu akan
                  diarahkan ke portal member…
                </p>
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-[#EFE6DC] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.5, ease: "linear" }}
                    className="h-full bg-[#C67C4E] rounded-full"
                  />
                </div>
                <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-wider">
                  Mengarahkan ke Portal Member…
                </p>
              </motion.div>
            ) : (
              /* ── STATE: Form pendaftaran ── */
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* Heading */}
                <div className="mb-7">
                  <span className="inline-block text-[10px] font-black text-[#C67C4E] uppercase tracking-[0.3em] mb-3 bg-[#C67C4E]/10 px-3 py-1.5 rounded-full">
                    Daftar Member
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-black leading-[1.05] text-[#2F2D2C] mb-2">
                    Bergabung
                    <br />
                    <span className="font-serif italic text-[#C67C4E]">
                      bersama kami.
                    </span>
                  </h1>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Daftar gratis dan nikmati keuntungan eksklusif member Bogeng
                    Coffee.
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

                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Nama Lengkap */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block ml-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Lukmanul Hakim"
                      value={form.fullName}
                      onChange={set("fullName")}
                      className="w-full px-5 py-3.5 bg-white border-2 border-[#EFE6DC] hover:border-[#C67C4E]/40 focus:border-[#C67C4E] rounded-2xl outline-none font-bold text-sm text-[#2F2D2C] placeholder-gray-300 transition-all duration-200 shadow-sm"
                    />
                  </div>

                  {/* Username */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block ml-1">
                      Username{" "}
                      <span className="text-gray-300 normal-case font-bold">
                        (dipakai untuk login)
                      </span>
                    </label>
                    <div className="relative">
                      <User
                        size={14}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                      />
                      <input
                        type="text"
                        placeholder="hakimganteng"
                        value={form.username}
                        onChange={set("username")}
                        className="w-full pl-10 pr-5 py-3.5 bg-white border-2 border-[#EFE6DC] hover:border-[#C67C4E]/40 focus:border-[#C67C4E] rounded-2xl outline-none font-bold text-sm text-[#2F2D2C] placeholder-gray-300 transition-all duration-200 shadow-sm"
                      />
                    </div>
                    <p className="text-[10px] text-gray-300 font-bold ml-1">
                      Tanpa spasi. Ini yang kamu pakai untuk login ke portal.
                    </p>
                  </div>

                  {/* Nomor HP */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block ml-1">
                      Nomor HP{" "}
                      <span className="text-gray-300 normal-case font-bold">
                        (dipakai untuk login)
                      </span>
                    </label>
                    <div className="relative">
                      <Phone
                        size={14}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                      />
                      <input
                        type="tel"
                        placeholder="081234567890"
                        value={form.phoneNumber}
                        onChange={set("phoneNumber")}
                        className="w-full pl-10 pr-5 py-3.5 bg-white border-2 border-[#EFE6DC] hover:border-[#C67C4E]/40 focus:border-[#C67C4E] rounded-2xl outline-none font-bold text-sm text-[#2F2D2C] placeholder-gray-300 transition-all duration-200 shadow-sm"
                      />
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
                        Mendaftarkan…
                      </>
                    ) : (
                      <>
                        Daftar & Masuk Portal <ArrowRight size={14} />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Info keuntungan singkat */}
                <div className="mt-6 grid grid-cols-3 gap-2">
                  {[
                    { emoji: "☕", text: "Pesan menu langsung" },
                    { emoji: "🎁", text: "Diskon tier otomatis" },
                    { emoji: "📋", text: "Riwayat transaksi" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="bg-white border border-[#EFE6DC] rounded-xl p-2.5 text-center"
                    >
                      <span className="text-lg block mb-1">{item.emoji}</span>
                      <p className="text-[9px] font-black text-gray-400 leading-tight">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="text-center text-xs text-gray-400 font-bold mt-5">
                  Sudah punya akun?{" "}
                  <Link
                    to="/member-login"
                    className="text-[#C67C4E] font-black hover:underline"
                  >
                    Masuk Sekarang
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
