import React, { useState } from 'react';
import './dashboard.css';   // ← TAMBAH INI
import dataWisata from './wisata.json';

const catClass = {
  Pantai: 'cat-pantai',
  Gunung: 'cat-gunung',
  Budaya: 'cat-budaya',
  'Air Terjun': 'cat-air',
};

const catEmoji = {
  Pantai: '🏖️',
  Gunung: '⛰️',
  Budaya: '🏛️',
  'Air Terjun': '💦',
};

function fmtHarga(h) {
  return h === 0 ? 'Gratis' : 'Rp ' + h.toLocaleString('id-ID');
}

export default function WisataDashboard() {
  const [view, setView] = useState('guest');
  const [search, setSearch] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [filterProvinsi, setFilterProvinsi] = useState('');

  const filteredData = dataWisata.filter((item) => {
    const matchSearch = item.nama.toLowerCase().includes(search.toLowerCase());
    const matchKategori = filterKategori === '' || item.kategori === filterKategori;
    const matchProvinsi = filterProvinsi === '' || item.lokasi.provinsi === filterProvinsi;
    return matchSearch && matchKategori && matchProvinsi;
  });

  const totalGratis = dataWisata.filter((d) => d.harga === 0).length;
  const totalProvinsi = [...new Set(dataWisata.map((d) => d.lokasi.provinsi))].length;

  // Ambil semua kategori & provinsi unik dari data
  const allKategori = [...new Set(dataWisata.map((d) => d.kategori))];
  const allProvinsi = [...new Set(dataWisata.map((d) => d.lokasi.provinsi))];

  return (
    <div className="dashboard-wrap">
      {/* ===== HEADER ===== */}
      <div className="header-card">
        <div className="brand">
          <h1 className="brand-title">
            Eksplor<span className="brand-accent">Wisata</span>
          </h1>
          <p className="brand-sub">Sistem Informasi Pariwisata Modern</p>
        </div>
        <div className="tab-group">
          <button
            className={`tab-btn ${view === 'guest' ? 'tab-active' : ''}`}
            onClick={() => setView('guest')}
          >
            Guest Card
          </button>
          <button
            className={`tab-btn ${view === 'admin' ? 'tab-active' : ''}`}
            onClick={() => setView('admin')}
          >
            Admin Table
          </button>
        </div>
      </div>

      {/* ===== STAT CARDS ===== */}
      <div className="stat-row">
        <div className="stat-card">
          <p className="stat-label">Total Destinasi</p>
          <p className="stat-val">{dataWisata.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Gratis</p>
          <p className="stat-val">{totalGratis}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Provinsi</p>
          <p className="stat-val">{totalProvinsi}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Ditampilkan</p>
          <p className="stat-val stat-shown">{filteredData.length}</p>
        </div>
      </div>

      {/* ===== FILTERS ===== */}
      <div className="filters">
        <input
          type="text"
          placeholder="🔍 Cari nama wisata..."
          className="filter-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterKategori}
          onChange={(e) => setFilterKategori(e.target.value)}
        >
          <option value="">Semua Kategori</option>
          {allKategori.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
        <select
          className="filter-select"
          value={filterProvinsi}
          onChange={(e) => setFilterProvinsi(e.target.value)}
        >
          <option value="">Semua Provinsi</option>
          {allProvinsi.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* ===== KONTEN ===== */}
      {filteredData.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🏝️</span>
          <h3 className="empty-title">Destinasi tidak ditemukan</h3>
          <p className="empty-sub">Coba sesuaikan filter pencarian kamu.</p>
        </div>
      ) : view === 'guest' ? (
        /* ====== GUEST CARD VIEW ====== */
        <div className="card-grid">
          {filteredData.map((item) => {
            const cc = catClass[item.kategori] || 'cat-default';
            const em = catEmoji[item.kategori] || '📍';
            return (
              <div key={item.id} className="wisata-card">
                <div className="card-img-wrap">
                  {item.gambar ? (
                    <img src={item.gambar} alt={item.nama} className="card-img" />
                  ) : (
                    <div className="card-img-fallback">
                      <span className="fallback-emoji">{em}</span>
                    </div>
                  )}
                  <span className={`cat-badge ${cc}`}>{item.kategori}</span>
                </div>
                <div className="card-body">
                  <h2 className="card-name">{item.nama}</h2>
                  <p className="card-loc">📍 {item.lokasi.kota}, {item.lokasi.provinsi}</p>
                  <div className="price-box">
                    <span className="price-val">{fmtHarga(item.harga)}</span>
                  </div>
                  <div className="fasi-wrap">
                    {item.fasilitas.slice(0, 3).map((f, i) => (
                      <span key={i} className="fasi-tag">{f}</span>
                    ))}
                  </div>
                  <p className="card-phone">☎ {item.kontak.telepon}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ====== ADMIN TABLE VIEW ====== */
        <div className="table-wrap">
          <div className="table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Visual</th>
                  <th>Info Wisata</th>
                  <th>Lokasi</th>
                  <th>Harga</th>
                  <th>Kontak</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => {
                  const cc = catClass[item.kategori] || 'cat-default';
                  const em = catEmoji[item.kategori] || '📍';
                  return (
                    <tr key={item.id}>
                      <td className="td-id">#{item.id}</td>
                      <td>
                        <div className="thumb">
                          {item.gambar ? (
                            <img src={item.gambar} alt={item.nama} className="thumb-img" />
                          ) : (
                            <span className="thumb-emoji">{em}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <p className="td-name">{item.nama}</p>
                        <span className={`cat-badge ${cc}`}>{item.kategori}</span>
                      </td>
                      <td className="td-loc">
                        {item.lokasi.kota}
                        <br />
                        <span className="td-prov">{item.lokasi.provinsi}</span>
                      </td>
                      <td>
                        <span className="price-chip">{fmtHarga(item.harga)}</span>
                      </td>
                      <td className="td-web">{item.kontak.website}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
