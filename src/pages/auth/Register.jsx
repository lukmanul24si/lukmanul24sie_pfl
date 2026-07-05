// src/pages/auth/Register.jsx
//
// ⚠️ CATATAN MIGRASI:
// File ini sebelumnya adalah DUPLIKAT dari MemberRegister.jsx — isinya
// insert manual ke tabel "customers" pakai nomor HP, TANPA lewat
// Supabase Auth. Karena sekarang login member wajib email+password yang
// terverifikasi, akun yang dibuat lewat jalur ini tidak akan pernah bisa
// login (tidak punya baris di auth.users).
//
// Supaya tidak ada 2 jalur pendaftaran yang beda arsitektur, halaman ini
// sekarang hanya meneruskan ke /member-register (satu-satunya jalur resmi,
// email + password + verifikasi email). Kalau route ini memang tidak
// dipakai di App.jsx, file ini aman dihapus juga.
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export default function Register() {
  useEffect(() => {
    console.warn(
      '[Register.jsx] Halaman ini sudah tidak dipakai — diarahkan ke /member-register (registrasi email terverifikasi).'
    );
  }, []);

  return <Navigate to="/member-register" replace />;
}
