// src/utils/reviewsStore.js
//
// Penyimpanan ulasan pelanggan secara lokal (localStorage) supaya bisa dibaca
// bersama oleh:
//   1. Landing Page  -> pelanggan kirim ulasan baru (status: 'pending')
//   2. Halaman Admin -> approve / tolak ulasan sebelum tayang ke publik
//
// Belum butuh backend/API dulu, semua disimpan di browser. Kalau nanti udah
// ada backend, tinggal ganti isi fungsi-fungsi di bawah ini jadi fetch() ke API,
// nama fungsi & cara pakainya di komponen lain gak perlu diubah.

const STORAGE_KEY = 'bogeng_reviews_v1';
const EVENT_NAME = 'bogeng-reviews-updated';

// Beberapa ulasan contoh biar landing page gak kosong waktu pertama dibuka
const SEED_REVIEWS = [
  {
    id: 'seed-1',
    name: 'James L.',
    rating: 5,
    text: 'Palm Sugar Coffee-nya juara parah, tempatnya tenang banget buat nugas akhir.',
    tier: 'VIP',
    status: 'approved',
    createdAt: '2026-01-12T10:00:00.000Z',
  },
  {
    id: 'seed-2',
    name: 'Sarah M.',
    rating: 4,
    text: 'Baristanya ramah, pelayanan cepat, diskon member langsung kepotong otomatis pas bayar.',
    tier: 'Loyal Member',
    status: 'approved',
    createdAt: '2026-02-03T10:00:00.000Z',
  },
  {
    id: 'seed-3',
    name: 'Alex K.',
    rating: 5,
    text: 'Gak pernah kecewa sama Bogeng Coffee, espresso-nya tebal dan nendang.',
    tier: 'VIP',
    status: 'approved',
    createdAt: '2026-02-20T10:00:00.000Z',
  },
];

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_REVIEWS));
      return SEED_REVIEWS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Gagal membaca data ulasan dari localStorage:', err);
    return [];
  }
}

function writeAll(reviews) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    // beritahu komponen lain (di tab yang sama) kalau data berubah
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (err) {
    console.error('Gagal menyimpan data ulasan ke localStorage:', err);
  }
}

/** Ambil semua ulasan (pending, approved, rejected), terbaru di atas */
export function getAllReviews() {
  return readAll().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/** Ulasan yang sudah disetujui admin -> ini yang tampil di landing page */
export function getApprovedReviews() {
  return getAllReviews().filter((r) => r.status === 'approved');
}

/** Ulasan yang masih menunggu ditinjau admin */
export function getPendingReviews() {
  return getAllReviews().filter((r) => r.status === 'pending');
}

/** Dipanggil dari form ulasan di landing page. Selalu masuk sebagai 'pending' dulu */
export function addReview({ name, rating, text, tier = 'Pelanggan' }) {
  const reviews = readAll();
  const newReview = {
    id: `rv-${Date.now()}`,
    name: name?.trim() || 'Pelanggan Bogeng',
    rating: Math.min(5, Math.max(1, Number(rating) || 5)),
    text: text.trim(),
    tier,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  writeAll([newReview, ...reviews]);
  return newReview;
}

/** Dipanggil dari halaman admin -> ulasan langsung tayang di landing page */
export function approveReview(id) {
  const reviews = readAll().map((r) => (r.id === id ? { ...r, status: 'approved' } : r));
  writeAll(reviews);
}

/** Dipanggil dari halaman admin -> ulasan ditandai ditolak, gak tayang */
export function rejectReview(id) {
  const reviews = readAll().map((r) => (r.id === id ? { ...r, status: 'rejected' } : r));
  writeAll(reviews);
}

/** Hapus ulasan permanen dari sistem */
export function deleteReview(id) {
  const reviews = readAll().filter((r) => r.id !== id);
  writeAll(reviews);
}

/** Turunkan lagi ulasan yang sudah tayang jadi pending (sembunyikan dari publik) */
export function unpublishReview(id) {
  const reviews = readAll().map((r) => (r.id === id ? { ...r, status: 'pending' } : r));
  writeAll(reviews);
}

/**
 * Subscribe ke perubahan data ulasan. Dipakai di landing page & halaman admin
 * supaya keduanya selalu nampilin data paling baru tanpa perlu refresh manual.
 * Return function untuk unsubscribe (panggil di cleanup useEffect).
 */
export function subscribeReviews(callback) {
  const handler = () => callback(getAllReviews());
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener('storage', handler); // sinkron antar-tab browser
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
}
