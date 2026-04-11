import React, { useState } from 'react';
// Import file 
import InputField from './components/InputField';
import SelectField from './components/SelectField';

export default function PendaftaranEsports() {
  const [formData, setFormData] = useState({ nama: '', umur: '', idTim: '', role: '', divisi: '' });
  const [errors, setErrors] = useState({ nama: 'Wajib diisi', umur: 'Wajib diisi', idTim: 'Wajib diisi', role: 'Wajib dipilih', divisi: 'Wajib dipilih' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateField = (name, value) => {
    let errorMsg = '';
    switch (name) {
      case 'nama':
        if (!value) errorMsg = 'Nickname wajib diisi.';
        else if (value.length < 3) errorMsg = 'Nickname minimal harus 3 karakter.';
        break;
      case 'umur':
        if (!value) errorMsg = 'Umur wajib diisi.';
        else if (isNaN(value)) errorMsg = 'Umur harus berupa angka.';
        else if (parseInt(value) < 16) errorMsg = 'Minimal umur pendaftaran adalah 16 tahun.';
        break;
      case 'idTim':
        if (!value) errorMsg = 'ID Tim wajib diisi.';
        else if (value.length !== 5) errorMsg = 'ID Tim harus tepat 5 karakter.';
        else if (!/^[A-Z0-9]+$/.test(value)) errorMsg = 'ID Tim hanya boleh huruf kapital dan angka.';
        break;
      case 'role':
        if (!value) errorMsg = 'Role In-Game wajib dipilih.';
        break;
      case 'divisi':
        if (!value) errorMsg = 'Divisi Game wajib dipilih.';
        break;
      default: break;
    }
    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    setIsSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const isFormValid = Object.values(errors).every((err) => err === '');

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ 
        width: '100%', maxWidth: '550px', background: '#ffffff', 
        borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', 
        borderTop: '6px solid #10B981', overflow: 'hidden' 
      }}>
        
        <div style={{ padding: '30px 30px 10px 30px', textAlign: 'center' }}>
          <h2 style={{ margin: 0, color: '#1F2937', fontSize: '24px' }}>🎮 Registrasi Turnamen E-Sports</h2>
          <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '8px' }}>Lengkapi data player untuk masuk ke roster tim utama.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '30px' }}>
          <InputField label="Nickname Player" type="text" name="nama" value={formData.nama} onChange={handleChange} error={errors.nama} placeholder="Masukkan in-game name" />
          
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <InputField label="Umur" type="text" name="umur" value={formData.umur} onChange={handleChange} error={errors.umur} placeholder="Min. 16 Tahun" />
            </div>
            <div style={{ flex: 1 }}>
              <InputField label="ID Tim (5 Karakter)" type="text" name="idTim" value={formData.idTim} onChange={handleChange} error={errors.idTim} placeholder="Contoh: EV0S1" />
            </div>
          </div>

          <SelectField label="Divisi Game" name="divisi" value={formData.divisi} onChange={handleChange} error={errors.divisi} options={['Mobile Legends', 'PUBG Mobile', 'Valorant', 'Free Fire']} />
          <SelectField label="Role In-Game" name="role" value={formData.role} onChange={handleChange} error={errors.role} options={['Jungler / Core', 'Gold Laner / Marksman', 'Mid Laner / Mage', 'Roamer / Support', 'EXP Laner / Fighter']} />

          <div style={{ marginTop: '30px' }}>
            {isFormValid ? (
              <button type="submit" style={{ 
                width: '100%', padding: '14px', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', 
                color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
              }}>
                Daftarkan Player
              </button>
            ) : (
              <div style={{ padding: '14px', background: '#F3F4F6', color: '#9CA3AF', textAlign: 'center', borderRadius: '8px', fontSize: '14px', border: '1px dashed #D1D5DB' }}>
                🔒 Selesaikan form untuk mendaftar.
              </div>
            )}
          </div>
        </form>

        {isSubmitted && (
          <div style={{ padding: '0 30px 30px 30px' }}>
            <div style={{ padding: '20px', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '8px' }}>
              <h3 style={{ marginTop: 0, color: '#065F46' }}>✅ Registrasi Berhasil!</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px', fontSize: '14px', color: '#047857' }}>
                <strong>Player:</strong> <span>{formData.nama}</span>
                <strong>Umur:</strong> <span>{formData.umur} Tahun</span>
                <strong>ID Tim:</strong> <span>{formData.idTim}</span>
                <strong>Divisi:</strong> <span>{formData.divisi}</span>
                <strong>Role:</strong> <span>{formData.role}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}