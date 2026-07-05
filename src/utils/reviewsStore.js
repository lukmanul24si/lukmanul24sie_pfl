// src/utils/reviewsStore.js
//
// Sumber data ulasan TUNGGAL yang dipakai bersama oleh:
//   - pages/main/BogengLandingPage.jsx (kirim ulasan tamu + tampilkan yang approved)
//   - pages/main/ReviewModeration.jsx  (admin approve/reject/hapus)
//   - pages/main/MemberPortal.jsx      (member kirim & lihat ulasan miliknya)
//
// Sekarang datanya betul-betul tersimpan di tabel "reviews" Supabase
// (bukan localStorage lagi), dan tetap live-sync antar tab/halaman lewat
// Supabase Realtime — makanya subscribeReviews(cb) tetap ada supaya
// komponen yang sudah ada tidak perlu diubah sama sekali.

import { supabase } from '../lib/supabase';

let cache = [];
let listeners = [];
let initialized = false;
let channel = null;

const notify = () => listeners.forEach((cb) => cb(cache));

const mapRow = (row) => ({
  id: row.id,
  customerId: row.customer_id,
  name: row.name,
  customerName: row.name,
  email: row.email,
  phone: row.phone,
  rating: row.rating,
  comment: row.comment,
  text: row.comment,
  tier: row.tier,
  status: row.status, // 'pending' | 'approved' | 'rejected'
  createdAt: row.created_at,
});

async function loadFromSupabase() {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Gagal mengambil reviews dari Supabase:', error.message);
    return;
  }
  cache = (data || []).map(mapRow);
  notify();
}

function ensureInitialized() {
  if (initialized) return;
  initialized = true;
  loadFromSupabase();

  channel = supabase
    .channel('public:reviews')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, loadFromSupabase)
    .subscribe();
}

// ── API PUBLIK (dipakai oleh komponen-komponen di atas) ─────────────────

export function getAllReviews() {
  ensureInitialized();
  return cache;
}

export function getApprovedReviews() {
  ensureInitialized();
  return cache.filter((r) => r.status === 'approved');
}

export function subscribeReviews(callback) {
  ensureInitialized();
  listeners.push(callback);
  // Kirim data yang sudah ada saat ini juga, biar komponen tidak nunggu kosong
  callback(cache);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

export async function addReview(reviewData) {
  ensureInitialized();
  const senderName = reviewData.customerName || reviewData.name || 'PELANGGAN SETIA';
  const reviewText = reviewData.comment || reviewData.text || '';

  const { error } = await supabase.from('reviews').insert([{
    name: senderName,
    email: reviewData.email || null,
    phone: reviewData.phone || null,
    rating: Number(reviewData.rating || 5),
    comment: reviewText,
    tier: reviewData.tier || 'MEMBER',
    status: 'pending',
    customer_id: reviewData.customerId || null,
  }]);

  if (error) console.error('Gagal mengirim ulasan ke Supabase:', error.message);
  // Realtime channel akan otomatis memanggil loadFromSupabase() & notify()
}

export async function approveReview(id) {
  const { error } = await supabase.from('reviews').update({ status: 'approved' }).eq('id', id);
  if (error) console.error('Gagal approve ulasan:', error.message);
}

export async function rejectReview(id) {
  const { error } = await supabase.from('reviews').update({ status: 'rejected' }).eq('id', id);
  if (error) console.error('Gagal menolak ulasan:', error.message);
}

export async function unpublishReview(id) {
  const { error } = await supabase.from('reviews').update({ status: 'pending' }).eq('id', id);
  if (error) console.error('Gagal menyembunyikan ulasan:', error.message);
}

export async function deleteReview(id) {
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) console.error('Gagal menghapus ulasan:', error.message);
  cache = cache.filter((r) => r.id !== id);
  notify();
}
