import React, { useState, useEffect } from 'react';
import wisataData from './wisata.json'; // Pastikan path file JSON lu bener wak

export default function WisataDashboard() {
  const [data, setData] = useState([]);
  const [viewMode, setViewMode] = useState('guest'); // 'guest' (default) atau 'admin'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [filterProvinsi, setFilterProvinsi] = useState('');

  useEffect(() => {
    // Simulasi fetch data
    setData(wisataData);
  }, []);

  // Logika untuk Search dan 2 Filter (Pastiin teksnya nggak nyatu lagi wak)
  const filteredData = data.filter((item) => {
    const matchSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchKategori = filterKategori === '' || item.kategori === filterKategori;
    // Perbaikan: Pastikan lokasi.kota dan lokasi.provinsi digabung dengan benar sebelum dicari
    const lokasiString = `${item.lokasi.kota}, ${item.lokasi.provinsi}`.toLowerCase();
    const matchProvinsi = filterProvinsi === '' || item.lokasi.provinsi === filterProvinsi;
    return matchSearch && matchKategori && matchProvinsi;
  });

  // Extract unik kategori & provinsi untuk dropdown filter
  const categories = [...new Set(data.map((item) => item.kategori))];
  const provinces = [...new Set(data.map((item) => item.lokasi.provinsi))];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-manrope"> {/* Ganti font biar lebih modern */}
      <div className="max-w-screen-2xl mx-auto">
        
        {/* Header & Toggle Button Modern */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">🌍 Jelajahi Nusantara</h1>
            <p className="text-gray-600 mt-2 text-lg">Temukan direktori destinasi wisata terbaik di Indonesia.</p>
          </div>
          <div className="mt-6 md:mt-0 flex gap-1 bg-gray-100 p-2 rounded-xl">
            <button 
              onClick={() => setViewMode('guest')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all text-sm md:text-base ${viewMode === 'guest' ? 'bg-blue-600 text-white shadow-xl scale-105' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
              Guest View (Cards)
            </button>
            <button 
              onClick={() => setViewMode('admin')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all text-sm md:text-base ${viewMode === 'admin' ? 'bg-blue-600 text-white shadow-xl scale-105' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75c.621 0 1.125.504 1.125 1.125v12.75c0 .621-.504 1.125-1.125 1.125H5.625a1.125 1.125 0 01-1.125-1.125V5.625c0-.621.504-1.125 1.125-1.125z" /></svg>
              Admin View (Table)
            </button>
          </div>
        </div>

        {/* Form Pencarian & Filter Modern (Ga Kaku Lagi Wak) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 bg-white p-7 rounded-2xl shadow-lg border border-gray-100">
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-800 mb-2">Cari Destinasi</label>
            <input 
              type="text" 
              placeholder="Ketik nama wisata..." 
              className="w-full border border-gray-200 rounded-xl p-4 pl-12 text-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 absolute left-4 top-[54px] text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Filter Kategori</label>
            <select 
              className="w-full border border-gray-200 rounded-xl p-4 text-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:outline-none cursor-pointer"
              onChange={(e) => setFilterKategori(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Filter Provinsi</label>
            <select 
              className="w-full border border-gray-200 rounded-xl p-4 text-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:outline-none cursor-pointer"
              onChange={(e) => setFilterProvinsi(e.target.value)}
            >
              <option value="">Semua Provinsi</option>
              {provinces.map((prov, idx) => <option key={idx} value={prov}>{prov}</option>)}
            </select>
          </div>
        </div>

        {/* Kondisional Rendering berdasarkan Role */}
        {viewMode === 'guest' ? (
          <GuestView data={filteredData} />
        ) : (
          <AdminView data={filteredData} />
        )}

      </div>
    </div>
  );
}

// ==========================================
// GUEST VIEW: TAMPILAN CARD GACOR (RESPONSIVE GRID)
// ==========================================
function GuestView({ data }) {
  if (data.length === 0) return (
    <div className="text-center bg-white p-16 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center gap-4 py-20">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-24 h-24 text-gray-300"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
      <p className="text-2xl font-bold text-gray-800">Ups, Destinasi Tidak Ditemukan!</p>
      <p className="text-gray-500">Coba ganti kata kunci pencarian atau filter lu.</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {data.map((item) => (
        <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col">
          {/* Bagian Gambar + Overlay Rating */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img src={item.gambar} alt={item.nama} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-yellow-600 text-sm font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>
              {item.rating.toFixed(1)}
            </div>
          </div>
          
          {/* Bagian Konten */}
          <div className="p-6 flex-1 flex flex-col">
            <div className="mb-4 flex-1">
              <span className="bg-blue-50 text-blue-700 text-xs font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider mb-2.5 inline-block">{item.kategori}</span>
              <h3 className="text-2xl font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors">{item.nama}</h3>
              <div className="text-gray-600 text-lg mt-3 flex items-start gap-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                <p>{item.lokasi.kota}, {item.lokasi.provinsi}</p>
              </div>
            </div>
            
            {/* Bagian Bawah / Tiket */}
            <div className="pt-6 border-t border-gray-100 mt-auto flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Harga Tiket Lokal</p>
                <p className="text-2xl font-extrabold text-green-600 mt-0.5">
                  {item.tiket.lokal === 0 ? "GRATIS!" : `Rp ${item.tiket.lokal.toLocaleString('id-ID')}`}
                </p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3.5 rounded-full transition shadow hover:shadow-lg scale-100 group-hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// ADMIN VIEW: TAMPILAN TABEL MODERN (CLEAN & RESPONSIVE)
// ==========================================
function AdminView({ data }) {
  if (data.length === 0) return <div className="text-center bg-white p-16 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center gap-4 py-20"><p className="text-xl text-gray-500">Data tidak ditemukan.</p></div>;

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 text-left text-lg">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-7 py-6 font-semibold text-gray-700 uppercase text-xs tracking-wider">#ID</th>
              <th className="px-7 py-6 font-semibold text-gray-700 uppercase text-xs tracking-wider">Nama Destinasi</th>
              <th className="px-7 py-6 font-semibold text-gray-700 uppercase text-xs tracking-wider">Kategori & Rating</th>
              <th className="px-7 py-6 font-semibold text-gray-700 uppercase text-xs tracking-wider">Lokasi</th>
              <th className="px-7 py-6 font-semibold text-gray-700 uppercase text-xs tracking-wider">Jam Buka</th>
              <th className="px-7 py-6 font-semibold text-gray-700 uppercase text-xs tracking-wider">Tiket Lokal</th>
              <th className="px-7 py-6 font-semibold text-gray-700 uppercase text-xs tracking-wider">Tiket Asing</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                <td className="px-7 py-6 font-mono text-gray-900">#{item.id}</td>
                <td className="px-7 py-6">
                  <div className="flex items-center gap-4">
                    <img src={item.gambar} alt="thumb" className="w-16 h-12 rounded-xl object-cover shadow-inner flex-shrink-0" />
                    <span className="font-extrabold text-gray-900 text-xl">{item.nama}</span>
                  </div>
                </td>
                <td className="px-7 py-6">
                  <span className="bg-blue-50 text-blue-700 text-xs font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider block mb-1.5 w-max">{item.kategori}</span>
                  <span className="text-lg text-yellow-600 font-extrabold flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>
                    {item.rating.toFixed(1)}
                  </span>
                </td>
                <td className="px-7 py-6 text-gray-800">
                  <span className="block font-semibold text-lg">{item.lokasi.kota}</span>
                  <span className="block text-sm text-gray-500">{item.lokasi.provinsi}</span>
                </td>
                <td className="px-7 py-6 text-gray-800 font-semibold">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {item.operasional.buka} - {item.operasional.tutup}
                  </div>
                </td>
                <td className="px-7 py-6 font-extrabold text-green-600 text-lg">
                  Rp {item.tiket.lokal.toLocaleString('id-ID')}
                </td>
                <td className="px-7 py-6 font-extrabold text-red-600 text-lg">
                  Rp {item.tiket.asing.toLocaleString('id-ID')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}