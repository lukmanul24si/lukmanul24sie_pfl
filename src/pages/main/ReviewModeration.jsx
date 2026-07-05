// src/pages/main/ReviewModeration.jsx
//
// Halaman admin untuk meninjau ulasan yang dikirim pelanggan dari landing page.
//
// PENTING (perbaikan): halaman ini sekarang baca/tulis ulasan lewat
// utils/reviewsStore.js — SUMBER DATA YANG SAMA dengan landing page.
// Sebelumnya admin pakai useApp()/AppContext sehingga ulasan dari landing
// tidak pernah muncul di sini, dan approve dari sini tidak terbaca di landing.
//
// useApp() tetap dipakai HANYA untuk ambil daftar customers (lookup tier).

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Check, X, Trash2, EyeOff, Inbox, BadgeCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Badge from '../../components/Badge';
import {
  getAllReviews,
  subscribeReviews,
  approveReview,
  rejectReview,
  unpublishReview,
  deleteReview as removeReview,
} from '../../utils/reviewsStore';

// Status di reviewsStore.js memakai huruf kecil: pending / approved / rejected
const TABS = [
  { key: 'pending', label: 'Menunggu Tinjauan' },
  { key: 'approved', label: 'Tayang di Landing Page' },
  { key: 'rejected', label: 'Ditolak' },
];

function Stars({ count }) {
  return (
    <div className="flex gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} fill={i < count ? 'currentColor' : 'none'} strokeWidth={1.5} />
      ))}
    </div>
  );
}

export default function ReviewModeration() {
  // customers cuma buat lookup tier — aman kalau AppContext belum punya
  const app = useApp();
  const customers = app?.customers || [];

  const [reviews, setReviews] = useState([]);
  const [tab, setTab] = useState('pending');

  // Sinkron dengan reviewsStore: muat awal + subscribe perubahan
  useEffect(() => {
    setReviews(getAllReviews());
    const unsubscribe = subscribeReviews((all) => setReviews(all));
    return unsubscribe;
  }, []);

  const filtered = reviews.filter((r) => r.status === tab);
  const pendingCount = reviews.filter((r) => r.status === 'pending').length;

  // Cari tier & nama resmi dari database customer; fallback ke data ulasan
  const getCustomerDetails = (review) => {
    const rawName = review.name || review.customerName || review.customer || '';
    const cleanName = rawName.trim().toUpperCase();

    const found = customers.find((c) => {
      const matchPhone = review.phone && c.phone === review.phone;
      const matchName = c.name && c.name.trim().toUpperCase() === cleanName;
      return matchPhone || matchName;
    });

    return {
      displayName: found ? found.name : (rawName || 'ANONIM'),
      tier: found ? found.status : (review.tier || 'Member'),
    };
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h2 className="text-base font-black text-[#2F2D2C] tracking-tight">Moderasi Ulasan Pelanggan</h2>
          <p className="text-[11px] text-[#9B9B9B] font-bold mt-0.5">
            Pilih ulasan mana yang layak tayang di landing page atau beranda utama tamu.
          </p>
        </div>
        {pendingCount > 0 && (
          <span className="flex items-center gap-1.5 bg-[#C67C4E]/10 text-[#C67C4E] text-[11px] font-bold px-3 py-1.5 rounded-full animate-pulse">
            <Inbox size={12} /> {pendingCount} menunggu
          </span>
        )}
      </div>

      <div className="flex gap-1 bg-[#F9F2ED] p-1 rounded-full w-fit mb-4 shrink-0 border border-[#E3E3E3]">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-full text-[11px] font-black transition-all ${
              tab === t.key ? 'bg-[#2F2D2C] text-white shadow-sm' : 'text-[#9B9B9B] hover:text-[#2F2D2C]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 text-[#9B9B9B] text-xs font-bold bg-[#F9F2ED]/30 rounded-2xl border border-dashed border-[#E3E3E3]"
            >
              Belum ada ulasan di kategori ini.
            </motion.div>
          )}

          {filtered.map((r) => {
            const { displayName, tier } = getCustomerDetails(r);
            const text = r.text || r.comment || '';

            return (
              <motion.div
                key={r.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-[#E3E3E3] rounded-2xl p-4 flex items-start gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow"
              >
                <div className="w-9 h-9 rounded-full bg-[#C67C4E] text-white font-black text-xs flex items-center justify-center shrink-0 border border-[#A05C32] shadow-sm">
                  {displayName.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-black text-[#2F2D2C]">{displayName}</span>
                    <Badge status={tier} size="pill" />
                    <Stars count={r.rating} />
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed font-medium break-words">{text}</p>

                  <p className="text-[9px] text-gray-400 font-bold mt-2 uppercase tracking-wide">
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
                      : 'Baru Saja'}
                  </p>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0 select-none">
                  {r.status === 'pending' && (
                    <>
                      <button
                        onClick={() => approveReview(r.id)}
                        className="flex items-center justify-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-[10px] font-black px-3 py-1.5 rounded-full transition-colors cursor-pointer border border-emerald-200"
                      >
                        <Check size={11} strokeWidth={3} /> Tayangkan
                      </button>
                      <button
                        onClick={() => rejectReview(r.id)}
                        className="flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-500 text-[10px] font-black px-3 py-1.5 rounded-full transition-colors cursor-pointer border border-red-200"
                      >
                        <X size={11} strokeWidth={3} /> Tolak
                      </button>
                    </>
                  )}

                  {r.status === 'approved' && (
                    <button
                      onClick={() => unpublishReview(r.id)}
                      className="flex items-center justify-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-600 text-[10px] font-black px-3 py-1.5 rounded-full transition-colors cursor-pointer border border-amber-200"
                    >
                      <EyeOff size={11} strokeWidth={2.5} /> Sembunyikan
                    </button>
                  )}

                  {r.status === 'rejected' && (
                    <button
                      onClick={() => approveReview(r.id)}
                      className="flex items-center justify-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-[10px] font-black px-3 py-1.5 rounded-full transition-colors cursor-pointer border border-emerald-200"
                    >
                      <BadgeCheck size={11} strokeWidth={2.5} /> Tayangkan
                    </button>
                  )}

                  <button
                    onClick={() => removeReview(r.id)}
                    className="flex items-center justify-center gap-1 text-gray-400 hover:text-red-500 hover:bg-red-50/50 text-[10px] font-black px-3 py-1 rounded-full transition-colors cursor-pointer mt-0.5"
                  >
                    <Trash2 size={11} /> Hapus
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}