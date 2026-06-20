// src/pages/main/ReviewModeration.jsx
//
// Halaman admin untuk meninjau ulasan yang dikirim pelanggan dari landing page.
// Admin bisa:
//   - "Tayangkan" ulasan pending -> langsung muncul di landing page
//   - "Tolak" ulasan yang gak layak tayang
//   - "Sembunyikan" ulasan yang sebelumnya udah tayang (turun jadi pending lagi)
//   - "Hapus" ulasan permanen
//
// Taruh file ini di src/pages/main/ReviewModeration.jsx, lalu daftarkan
// sebagai rute terproteksi di App.jsx (lihat catatan di bawah).

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Check, X, Trash2, EyeOff, Inbox, BadgeCheck } from 'lucide-react';
import {
  getAllReviews,
  approveReview,
  rejectReview,
  deleteReview,
  unpublishReview,
  subscribeReviews,
} from '../../utils/reviewsStore';

const TABS = [
  { key: 'pending', label: 'Menunggu Tinjauan' },
  { key: 'approved', label: 'Tayang di Landing Page' },
  { key: 'rejected', label: 'Ditolak' },
];

function TierBadge({ tier }) {
  const colors = {
    VIP: 'bg-amber-100 text-amber-700',
    'VIP Member': 'bg-amber-100 text-amber-700',
    'Loyal Member': 'bg-emerald-100 text-emerald-700',
  };
  return (
    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${colors[tier] || 'bg-gray-100 text-gray-600'}`}>
      {tier}
    </span>
  );
}

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
  const [reviews, setReviews] = useState([]);
  const [tab, setTab] = useState('pending');

  useEffect(() => {
    setReviews(getAllReviews());
    const unsubscribe = subscribeReviews(setReviews);
    return unsubscribe;
  }, []);

  const filtered = reviews.filter((r) => r.status === tab);
  const pendingCount = reviews.filter((r) => r.status === 'pending').length;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h2 className="text-base font-black text-[#2F2D2C] tracking-tight">Moderasi Ulasan Pelanggan</h2>
          <p className="text-[11px] text-[#9B9B9B] font-bold mt-0.5">
            Pilih ulasan mana yang layak tayang di landing page tamu.
          </p>
        </div>
        {pendingCount > 0 && (
          <span className="flex items-center gap-1.5 bg-[#C67C4E]/10 text-[#C67C4E] text-[11px] font-bold px-3 py-1.5 rounded-full">
            <Inbox size={12} /> {pendingCount} menunggu
          </span>
        )}
      </div>

      <div className="flex gap-1 bg-[#F9F2ED] p-1 rounded-full w-fit mb-4 shrink-0">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-colors ${
              tab === t.key ? 'bg-[#2F2D2C] text-white' : 'text-[#9B9B9B] hover:text-[#2F2D2C]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-[#9B9B9B] text-xs font-bold"
            >
              Belum ada ulasan di kategori ini.
            </motion.div>
          )}
          {filtered.map((r) => (
            <motion.div
              key={r.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="bg-white border border-[#E3E3E3] rounded-2xl p-4 flex items-start gap-4"
            >
              <div className="w-9 h-9 rounded-full bg-[#C67C4E] text-white font-black text-xs flex items-center justify-center shrink-0">
                {r.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-black text-[#2F2D2C]">{r.name}</span>
                  <TierBadge tier={r.tier} />
                  <Stars count={r.rating} />
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{r.text}</p>
                <p className="text-[9px] text-gray-300 font-bold mt-1.5 uppercase tracking-wide">
                  {new Date(r.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                {r.status === 'pending' && (
                  <>
                    <button
                      onClick={() => approveReview(r.id)}
                      className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-[10px] font-bold px-3 py-1.5 rounded-full transition-colors"
                    >
                      <Check size={12} /> Tayangkan
                    </button>
                    <button
                      onClick={() => rejectReview(r.id)}
                      className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-500 text-[10px] font-bold px-3 py-1.5 rounded-full transition-colors"
                    >
                      <X size={12} /> Tolak
                    </button>
                  </>
                )}
                {r.status === 'approved' && (
                  <button
                    onClick={() => unpublishReview(r.id)}
                    className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-600 text-[10px] font-bold px-3 py-1.5 rounded-full transition-colors"
                  >
                    <EyeOff size={12} /> Sembunyikan
                  </button>
                )}
                {r.status === 'rejected' && (
                  <button
                    onClick={() => approveReview(r.id)}
                    className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-[10px] font-bold px-3 py-1.5 rounded-full transition-colors"
                  >
                    <BadgeCheck size={12} /> Tayangkan
                  </button>
                )}
                <button
                  onClick={() => deleteReview(r.id)}
                  className="flex items-center gap-1 text-gray-400 hover:text-red-500 text-[10px] font-bold px-3 py-1 transition-colors"
                >
                  <Trash2 size={12} /> Hapus
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
