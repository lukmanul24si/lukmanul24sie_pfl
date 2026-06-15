import React, { useState, useEffect } from 'react';
// Kita import langsung dari package resmi supabase-js karena AppContext tidak mengekspor instance supabase
import { createClient } from '@supabase/supabase-js'; 
import { 
  UserPlus, 
  Search, 
  UserCheck, 
  ShieldAlert, 
  CreditCard, 
  RefreshCw 
} from 'lucide-react';

// =========================================================================
// INISIALISASI SUPABASE CLIENT (MENGGUNAKAN VARIABEL .ENV VITE)
// =========================================================================
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function MembersPage() {
  // State untuk data dari database
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // State untuk form input member baru
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fungsi mengambil data member dari Supabase
  const fetchMembers = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      
      const { data, error } = await supabase
        .from('customers')
        .select('*');

      if (error) throw error;
      setMembers(data || []);
    } catch (err) {
      console.error("Gagal mengambil data:", err.message);
      setErrorMsg(`Gagal memuat data pelanggan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Fungsi pendaftaran member baru (SOLUSI: MEMBUAT ID MANUAL UNTUK MENGHINDARI VIOLATES NOT-NULL CONSTRAINT)
  const handleRegisterMember = async (e) => {
    e.preventDefault();
    if (!fullName || !phoneNumber) {
      alert("Nama lengkap dan Nomor HP wajib diisi!");
      return;
    }

    try {
      setErrorMsg(null);
      
      // Pembuatan ID Cadangan Unik (Coba UUID string, jika kolom database bertipe Integer/Number otomatis pakai Date.now())
      let generatedId;
      try {
        generatedId = crypto.randomUUID(); // Menghasilkan format UUID String
      } catch (idErr) {
        generatedId = Date.now(); // Fallback jika browser lama atau tipe data ID di DB berupa angka (BigInt/Integer)
      }

      const insertData = {
        id: generatedId, // 👈 INI KUNCI PERBAIKANNYA: Mengisi kolom 'id' secara eksplisit agar tidak dianggap null oleh Supabase
        nama_lengkap: fullName,
        nomor_hp: phoneNumber
      };

      if (username) {
        insertData.username_akun = username;
      }

      const { error } = await supabase
        .from('customers')
        .insert([insertData]);

      if (error) {
        // Jika gagal karena tipe data id berupa angka (int), coba timpa ulang dengan format angka murni
        if (error.message.includes("invalid input syntax for type") || error.message.includes("integer")) {
          insertData.id = Math.floor(Math.random() * 1000000); 
          const retryResult = await supabase.from('customers').insert([insertData]);
          if (retryResult.error) throw retryResult.error;
        } else {
          throw error;
        }
      }

      // Reset Form input jika sukses
      setFullName('');
      setUsername('');
      setPhoneNumber('');
      
      alert("Member baru berhasil terdaftar di Bogeng Coffee!");
      fetchMembers(); 
    } catch (err) {
      console.error("Gagal register:", err.message);
      setErrorMsg(`Gagal mendaftarkan member: ${err.message}`);
    }
  };

  // Sistem filter pencarian lokal
  const filteredMembers = members.filter(member => {
    const name = member.nama_lengkap || member.name || "";
    const phone = member.nomor_hp || member.phone || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase()) || phone.includes(searchTerm);
  });

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      
      {/* HEADER UTAMA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">CRM & Database Membership</h1>
          <p className="text-slate-500 text-sm">Kelola data pelanggan setia Bogeng Coffee Shop.</p>
        </div>
        <button 
          onClick={fetchMembers}
          className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 transition cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {/* BANNER ERROR */}
      {errorMsg && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-3 text-sm">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* GRID PANEL KONTROL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* PANEL FORM REGISTRASI */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <UserPlus className="w-5 h-5" />
            </div>
            <h2 className="font-semibold text-slate-800">Registrasi Member Baru</h2>
          </div>

          <form onSubmit={handleRegisterMember} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Nama Lengkap *</label>
              <input 
                type="text"
                placeholder="Contoh: Lukmanul Hakim"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Username Akun (Opsional)</label>
              <input 
                type="text"
                placeholder="Contoh: hakim s kennedy"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Nomor Handphone *</label>
              <input 
                type="tel"
                placeholder="Contoh: 081267459123"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full border border-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium text-sm py-2.5 rounded-lg shadow-sm transition flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              Simpan ke Database CRM
            </button>
          </form>
        </div>

        {/* PANEL TABEL MEMBER */}
        <div className="lg:grid-cols-1 lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Cari member berdasarkan nama atau nomor HP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-slate-200 pl-9 pr-4 py-2 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto flex-grow">
            {loading ? (
              <div className="p-12 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
                <p>Sedang memuat data dari Supabase...</p>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm">
                Tidak ada data member yang ditemukan.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase border-b border-slate-100">
                    <th className="p-4">Profil Pelanggan</th>
                    <th className="p-4">Kontak</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {filteredMembers.map((member, index) => (
                    <tr key={member.id || index} className="hover:bg-slate-50/80 transition">
                      <td className="p-4">
                        <div className="font-medium text-slate-900">
                          {member.nama_lengkap || member.name || "Tanpa Nama"}
                        </div>
                        <div className="text-xs text-slate-400">
                          @{member.username_akun || member.username || 'user'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                          {member.nomor_hp || member.phone || "-"}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 text-xs rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                          {member.status_member || "Aktif"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
            <div>Menampilkan <b>{filteredMembers.length}</b> pelanggan.</div>
            <div className="flex items-center gap-1 text-emerald-600 font-medium">
              <UserCheck className="w-3.5 h-3.5" /> Jaringan Berhasil Diperbaiki
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}