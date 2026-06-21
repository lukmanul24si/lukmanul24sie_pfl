// src/pages/auth/Register.jsx — visual matching dengan Login.jsx (Bogeng style)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Coffee, UserPlus, ChevronDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const BG_URL = 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=85';

export default function Register() {
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    phoneNumber: '',
    membershipLevel: 'Member',
  });
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');
  const [mounted,  setMounted]  = useState(false);

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

  const set = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.fullName || !form.username || !form.phoneNumber) {
      setError('Semua kolom wajib diisi.');
      return;
    }

    try {
      setLoading(true);
      const uniqueId = 'bgc-' + Math.random().toString(36).substring(2, 8);

      const { error: dbErr } = await supabase.from('customers').insert([{
        id:                uniqueId,
        nama_lengkap:      form.fullName,
        username_akun:     form.username.toLowerCase().replace(/\s+/g, ''),
        nomor_hp:          form.phoneNumber,
        tanggal_daftar:    new Date().toISOString().split('T')[0],
        status_member:     'Aktif',
        level_membership:  form.membershipLevel,
      }]);

      if (dbErr) throw dbErr;

      setSuccess('Member baru berhasil terdaftar! Silakan login.');
      setForm({ fullName: '', username: '', phoneNumber: '', membershipLevel: 'Member' });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Gagal menyimpan data ke database.');
    } finally {
      setLoading(false);
    }
  };

  const TIER_OPTIONS = [
    { value: 'Member', label: 'Member (Default)' },
    { value: 'Loyal',  label: 'Loyal Member' },
    { value: 'Vip',    label: 'VIP Member' },
  ];

  return (
    <div
      className="min-h-screen w-full flex font-sans overflow-hidden bg-[#FAF7F2]"
      style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.35s ease-out' }}
    >
      {/* ── KIRI: Foto Kafe (desktop only) ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:block w-[45%] relative overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${BG_URL})` }}
        />
        {/* Overlay kanan menyatu ke form */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#FAF7F2] via-[#FAF7F2]/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

        {/* Quote kiri bawah */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-12 left-10 right-10"
        >
          <p className="text-white/90 text-2xl font-black font-serif italic leading-snug mb-2">
            "Mulai perjalanan<br />rasa kamu di sini."
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
          className="absolute top-10 left-10 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl px-4 py-3 text-white"
        >
          <div className="flex items-center gap-2">
            <UserPlus size={14} className="text-[#C67C4E]" />
            <span className="text-xs font-black uppercase tracking-wider">Daftar Member</span>
          </div>
        </motion.div>
      </motion.div>

      {/* ── KANAN: Form ─────────────────────────────────────────────── */}
      <div className="relative flex flex-col justify-center items-center flex-1 bg-[#FAF7F2] px-8 sm:px-14 py-12 z-10">

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

        {/* Sudah punya akun? */}
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
            ← Sudah punya akun?
          </Link>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[400px]"
        >
          {/* Heading */}
          <div className="mb-7">
            <span className="inline-block text-[10px] font-black text-[#C67C4E] uppercase tracking-[0.3em] mb-3 bg-[#C67C4E]/10 px-3 py-1.5 rounded-full">
              Daftar Member
            </span>
            <h1 className="text-3xl sm:text-4xl font-black leading-[1.05] text-[#2F2D2C] mb-2">
              Bergabung<br />
              <span className="font-serif italic text-[#C67C4E]">bersama kami.</span>
            </h1>
            <p className="text-sm text-gray-400">
              Daftarkan diri sebagai member Bogeng dan nikmati keuntungan eksklusif.
            </p>
          </div>

          {/* Notifikasi */}
          <AnimatePresence>
            {(error || success) && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
                className={`mb-5 px-4 py-3 rounded-2xl text-xs font-bold border ${
                  error
                    ? 'bg-red-50 border-red-100 text-red-500'
                    : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                }`}
              >
                {error ? `⚠ ${error}` : `✓ ${success}`}
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
                onChange={set('fullName')}
                className="w-full px-5 py-3.5 bg-white border-2 border-[#EFE6DC] hover:border-[#C67C4E]/40 focus:border-[#C67C4E] rounded-2xl outline-none font-bold text-sm text-[#2F2D2C] placeholder-gray-300 transition-all duration-200 shadow-sm"
              />
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block ml-1">
                Username
              </label>
              <input
                type="text"
                placeholder="hakimganteng"
                value={form.username}
                onChange={set('username')}
                className="w-full px-5 py-3.5 bg-white border-2 border-[#EFE6DC] hover:border-[#C67C4E]/40 focus:border-[#C67C4E] rounded-2xl outline-none font-bold text-sm text-[#2F2D2C] placeholder-gray-300 transition-all duration-200 shadow-sm"
              />
            </div>

            {/* Nomor HP */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block ml-1">
                Nomor Handphone
              </label>
              <input
                type="tel"
                placeholder="0812xxxxxxxx"
                value={form.phoneNumber}
                onChange={set('phoneNumber')}
                className="w-full px-5 py-3.5 bg-white border-2 border-[#EFE6DC] hover:border-[#C67C4E]/40 focus:border-[#C67C4E] rounded-2xl outline-none font-bold text-sm text-[#2F2D2C] placeholder-gray-300 transition-all duration-200 shadow-sm"
              />
            </div>

            {/* Submit */}
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
                  Menyimpan…
                </>
              ) : (
                <>
                  Daftarkan Member <ArrowRight size={14} />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-xs text-gray-400 font-bold mt-5">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-[#C67C4E] font-black hover:underline">
              Masuk Sekarang
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
