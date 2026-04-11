import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#ffffff', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      paddingTop: '10vh',
      fontFamily: 'sans-serif' 
    }}>
      
      {/* Judul dan Deskripsi - Dikunci warna hitam (#111827) biar gak dikerjain CSS Vite */}
      <h1 style={{ textAlign: 'center', marginBottom: '10px', padding: '0 20px', color: '#111827' }}>
        🌌 Markas Hakim Midnight Odyssey
      </h1>
      <p style={{ marginBottom: '30px', color: '#4b5563' }}>
        Pilih modul praktikum di bawah ini:
      </p>
      
      {/* Wadah Tombol-Tombol */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '15px', 
        width: '100%', 
        maxWidth: '300px' 
      }}>
        
        {/* Tombol Link ke Tugas 2 */}
        <Link to="/tugas2" style={{ 
          padding: '12px 20px', 
          backgroundColor: '#10B981', // Warna hijau biar beda
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '8px',
          textAlign: 'center',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          Modul 2: UI Biodata
        </Link>

        {/* Tombol Link ke Tugas 3 */}
        <Link to="/tugas3" style={{ 
          padding: '12px 20px', 
          backgroundColor: '#3B82F6', // Warna biru
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '8px',
          textAlign: 'center',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          Modul 3: Form Pendaftaran
        </Link>
        
        {/* Tombol Link ke Tugas 4 */}
        <Link to="/" style={{ 
          padding: '12px 20px', 
          backgroundColor: '#9CA3AF', // Warna abu-abu (Disabled)
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '8px',
          textAlign: 'center',
          fontWeight: 'bold',
          pointerEvents: 'none'
        }}>
          Modul 4: (Coming Soon)
        </Link>
        
      </div>
    </div>
  );
}