import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const AddMenu = () => {
  const { addMenu } = useApp();
  const navigate = useNavigate();
  // Kategori default jadi Coffee agar sinkron
const [newMenu, setNewMenu] = useState({ name: '', price: '', category: 'Coffee', img: null });

// Fungsi handleImage baru (Base64 agar permanen)
const handleImage = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Hasilnya adalah string teks panjang yang bisa disimpan di localStorage
      setNewMenu({ ...newMenu, img: reader.result }); 
    };
    reader.readAsDataURL(file);
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMenu.name || !newMenu.price || !newMenu.img) return alert("Lengkapi data!");
    
    addMenu({ 
      id: Date.now(), 
      ...newMenu, 
      price: parseInt(newMenu.price) 
    });
    
    alert("Menu Berhasil Ditambahkan!");
    navigate('/dashboard'); 
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-[3rem] p-10 shadow-xl border border-gray-100 animate-fade-in">
      <h2 className="text-3xl font-black text-[#1a120b] mb-8 uppercase tracking-tighter text-center">Tambah Menu Baru ☕</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Nama Produk */}
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase ml-2">Nama Produk</label>
          <input 
            type="text" 
            placeholder="Masukkan nama menu..." 
            className="w-full p-4 bg-[#fbf9f6] rounded-2xl outline-none focus:ring-2 focus:ring-[#eae0d5] font-bold text-[#1a120b]" 
            onChange={e => setNewMenu({...newMenu, name: e.target.value})} 
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Harga */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase ml-2">Harga</label>
            <input 
              type="number" 
              placeholder="Rp" 
              className="w-full p-4 bg-[#fbf9f6] rounded-2xl outline-none focus:ring-2 focus:ring-[#eae0d5] font-bold text-[#1a120b]" 
              onChange={e => setNewMenu({...newMenu, price: e.target.value})} 
            />
          </div>

          {/* Kategori - Sekarang sudah ada Cemilan */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase ml-2">Kategori</label>
            <div className="relative">
              <select 
                className="w-full p-4 bg-[#fbf9f6] rounded-2xl outline-none focus:ring-2 focus:ring-[#eae0d5] font-bold text-[#1a120b] appearance-none cursor-pointer" 
                onChange={e => setNewMenu({...newMenu, category: e.target.value})}
              >
                <option value="Coffee">Coffee</option>
                <option value="Non-Coffee">Non-Coffee</option>
                <option value="Cemilan">Cemilan</option> {/* Tambahan Baru */}
                <option value="Makanan">Makanan</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Upload Gambar */}
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase ml-2">Foto Produk</label>
          <div className="h-52 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center relative bg-[#fbf9f6] overflow-hidden group hover:border-[#8c6d52] transition-colors">
            {newMenu.img ? (
              <img src={newMenu.img} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center">
                <span className="text-3xl block mb-2">📸</span>
                <span className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Klik untuk Upload</span>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={handleImage} 
            />
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-4 pt-4">
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="flex-1 py-4 font-black text-gray-400 uppercase text-xs hover:text-red-500 transition-colors"
          >
            Batal
          </button>
          <button 
            type="submit" 
            className="flex-[2] py-4 bg-[#1a120b] text-white rounded-2xl font-black shadow-xl hover:bg-[#2d1e13] transition-all active:scale-95"
          >
            SIMPAN KE KATALOG
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMenu;