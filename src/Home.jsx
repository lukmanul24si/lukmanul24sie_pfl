import { useNavigate } from 'react-router-dom';
import './home.css';

// =====================================================
// SESUAIKAN ROUTE DI SINI KALAU BEDA
// '/modul2' → src/Tugas2/BiodataDiri.jsx
// '/modul3' → src/Tugas3/components/PendaftaranEsports.jsx
// '/tugas4' → src/Tugas4/WisataDashboard.jsx  (atau path lain)
// =====================================================
const modules = [
  {
    id: 2,
    label: 'Modul 2',
    title: 'UI Biodata',
    desc: 'Tampilkan data diri dalam tampilan modern & interaktif',
    icon: '👤',
    route: '/tugas2',
    color: 'mod-green',
    file: 'Tugas2/BiodataDiri.jsx',
  },
  {
    id: 3,
    label: 'Modul 3',
    title: 'Form Pendaftaran',
    desc: 'Form input data pendaftaran esports dengan validasi clean',
    icon: '📋',
    route: '/tugas3',
    color: 'mod-blue',
    file: 'Tugas3/components/PendaftaranEsports.jsx',
  },
  {
    id: 4,
    label: 'Modul 4',
    title: 'Wisata Dashboard',
    desc: 'Sistem informasi pariwisata dengan filter & tabel admin',
    icon: '🗺️',
    route: '/tugas4',
    color: 'mod-purple',
    file: 'Tugas4/WisataDashboard.jsx',
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-wrap">

      {/* ===== SIDEBAR KIRI ===== */}
      <aside className="home-sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">🌙</span>
          <span className="logo-text">
            Midnight<br />
            <strong>Odyssey</strong>
          </span>
        </div>

        <nav className="sidebar-nav">
          {modules.map((m) => (
            <button
              key={m.id}
              className={`sidebar-item ${m.color}-side`}
              onClick={() => navigate(m.route)}
            >
              <span className="sidebar-icon">{m.icon}</span>
              <span className="sidebar-label">{m.label}: {m.title}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p className="sidebar-footer-text">Praktikum React</p>
          <p className="sidebar-footer-sub">2024 / 2025</p>
        </div>
      </aside>

      {/* ===== KONTEN UTAMA ===== */}
      <main className="home-main">

        {/* Header */}
        <div className="home-header">
          <div>
            <h1 className="home-title">
              Markas <span className="home-accent">Hakim</span>
            </h1>
            <p className="home-sub">Pilih modul praktikum yang ingin kamu kerjakan</p>
          </div>
          <div className="home-badge">
            <span className="badge-dot"></span>
            <span className="badge-text">3 Modul Aktif</span>
          </div>
        </div>

        {/* Module Cards */}
        <div className="module-grid">
          {modules.map((m) => (
            <div
              key={m.id}
              className={`module-card ${m.color}`}
              onClick={() => navigate(m.route)}
            >
              <div className="module-top">
                <span className="module-label">{m.label}</span>
                <span className="module-icon">{m.icon}</span>
              </div>
              <h2 className="module-title">{m.title}</h2>
              <p className="module-desc">{m.desc}</p>
              <div className="module-footer">
                <code className="module-file">{m.file}</code>
                <span className="module-go">Buka →</span>
              </div>
            </div>
          ))}
        </div>

        {/* Info strip bawah */}
        <div className="home-info-strip">
          <div className="info-item">
            <span className="info-val">3</span>
            <span className="info-label">Total Modul</span>
          </div>
          <div className="info-divider"></div>
          <div className="info-item">
            <span className="info-val">React</span>
            <span className="info-label">Framework</span>
          </div>
          <div className="info-divider"></div>
          <div className="info-item">
            <span className="info-val">Vite</span>
            <span className="info-label">Build Tool</span>
          </div>
          <div className="info-divider"></div>
          <div className="info-item">
            <span className="info-val">2025</span>
            <span className="info-label">Semester</span>
          </div>
        </div>

      </main>
    </div>
  );
}
