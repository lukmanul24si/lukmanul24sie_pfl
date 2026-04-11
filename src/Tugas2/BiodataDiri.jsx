import React from "react";
import "../custom.css"; 

// Mengimpor file gambar untuk foto profil
import fotoProfil from "../assets/foto_hakim.jpg"; 
// --- CHILD COMPONENTS ---

const Header = () => (
  <header className="header">
    <h1>🚀 Hakim's Midnight Odyssey</h1>
    <p>Frontend Explorer | React Enthusiast</p>
  </header>
);

const ProfilePicture = () => (
  <div className="card profile">
    {/* Menampilkan foto profil yang sudah diimpor */}
    <img src={fotoProfil} alt="Foto Profil Hakim" />
  </div>
);

const Contact = () => (
  <div className="card contact">
    <h3>📡 Transmisi Kontak</h3>
    {/* Pisahkan ikon dan teks pakai span agar rapi */}
    <p>
      <span className="icon">📧</span> 
      <span className="email-text">lukmanul24si@mahasiswa.pcr.ac.id</span>
    </p>
    <p>
      <span className="icon">🐙</span> 
      <span className="email-text">Hakimwertu@gmail.com</span>
    </p>
  </div>
);

const AboutMe = () => (
  <div className="card about">
    <h3>🌌 Log Perjalanan (About Me)</h3>
    <p>Halo! perkenalkan semuanya aku Lukmanul Hakim 24sie. nah aku biasanya ngoding suka dimalam hari karna lebih fokus dan ide mulai berdatangan hehe.Fokusku saat ini adalah menaklukkan React.js dan merakit UI yang interaktif serta efisien.</p>
  </div>
);

const Skills = () => (
  <div className="card skills">
    <h3>⚡ Persenjataan (Skills)</h3>
    <ul className="skill-list">
      <li>HTML5, CSS3, JavaScript (ES6)</li>
      <li>React.js & Vite ecosystem</li>
      <li>Git & GitHub version control</li>
      <li>UI/Design Thinking</li>
    </ul>
  </div>
);

const Footer = () => (
  <footer className="footer">
    <p>© 2026 Hakim Midnight Odyssey. Sistem Berjalan Lancar.</p>
  </footer>
);

// --- PARENT COMPONENT ---

export default function BiodataDiri() {
  return (
    <div className="container">
      <Header />
      <div className="main-content">
        <div className="sidebar">
          <ProfilePicture />
          <Contact />
        </div>
        <div className="content">
          <AboutMe />
          <Skills />
        </div>
      </div>
      <Footer />
    </div>
  );
}