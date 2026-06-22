import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('kasir');
  const [status, setStatus] = useState('aktif');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // READ: Ambil seluruh data user staf dari tabel public.users
  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // UPDATE: Simpan perubahan data staf (Nama, Role, Status)
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!fullName || !editingId) return;

    const { error } = await supabase
      .from('users')
      .update({ full_name: fullName, role, status })
      .eq('id', editingId);

    if (!error) {
      alert("Data user berhasil diperbarui!");
      setEditingId(null);
      setFullName('');
      fetchUsers();
    }
  };

  // DELETE: Hapus data user staf
  const handleDelete = async (id) => {
    if (window.confirm("Apakah lu yakin ingin menghapus user ini dari sistem?")) {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (!error) fetchUsers();
    }
  };

  const startEdit = (u) => {
    setEditingId(u.id);
    setFullName(u.full_name);
    setRole(u.role);
    setStatus(u.status);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans">
      <div className="mb-6">
        <h1 className="text-xl font-black text-[#313131] uppercase">Manajemen Staf / User POS</h1>
        <p className="text-xs text-gray-400">CRUD Data Pengguna Aplikasi Kasir Langsung ke Database Supabase</p>
      </div>

      {/* FORM UPDATE DATA USER */}
      {editingId && (
        <form onSubmit={handleUpdate} className="bg-white p-4 rounded-2xl border border-[#E3E3E3] mb-6 space-y-3">
          <h3 className="text-xs font-black uppercase text-[#C67C4E]">Mode Edit User</h3>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Nama Staf</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-2 border rounded-xl text-xs" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border rounded-xl text-xs bg-white">
                <option value="kasir">Kasir</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2 border rounded-xl text-xs bg-white">
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Non-Aktif</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setEditingId(null)} className="px-3 py-1.5 text-xs font-bold border rounded-xl">Batal</button>
            <button type="submit" className="px-4 py-1.5 text-xs font-black bg-[#C67C4E] text-white rounded-xl uppercase">Simpan</button>
          </div>
        </form>
      )}

      {/* TABEL VIEW USER */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase">
              <th className="p-3">Nama Lengkap</th>
              <th className="p-3">Email Akun</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-xs">
            {loading ? (
              <tr><td colSpan="5" className="p-4 text-center text-gray-400 animate-pulse">Menghubungi Supabase...</td></tr>
            ) : users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50/50">
                <td className="p-3 font-bold text-gray-800">{u.full_name}</td>
                <td className="p-3 text-gray-500">{u.email}</td>
                <td className="p-3"><span className="px-2 py-0.5 bg-amber-50 text-[#C67C4E] font-bold rounded text-[10px] uppercase">{u.role}</span></td>
                <td className="p-3"><span className={`px-2 py-0.5 font-bold rounded text-[10px] uppercase ${u.status === 'aktif' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>{u.status}</span></td>
                <td className="p-3 text-right space-x-2">
                  <button onClick={() => startEdit(u)} className="text-blue-600 font-bold hover:underline">Edit</button>
                  <button onClick={() => handleDelete(u.id)} className="text-red-500 font-bold hover:underline">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
