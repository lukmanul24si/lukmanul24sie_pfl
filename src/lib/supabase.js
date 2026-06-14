import { createClient } from '@supabase/supabase-js'; // <-- Di sini udah gua hapus kata "-base" ya!

// 1. Ambil URL dan Anon Key dari file environment (.env) projek lu
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. Validasi pencegahan agar sistem tidak crash jika key lupa dimasukkan
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("⚠️ Error: Supabase URL atau Anon Key belum dikonfigurasi di file .env!");
}

// 3. Inisialisasi client instance Supabase untuk dipakai di seluruh aplikasi
export const supabase = createClient(supabaseUrl, supabaseAnonKey);