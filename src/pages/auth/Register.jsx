import React, { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function MinimalistRegister() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [membershipLevel, setMembershipLevel] = useState("Bronze Member");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!fullName || !username || !phoneNumber) {
      setMessage({ type: "error", text: "Semua kolom wajib diisi, bro!" });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      // Membuat ID unik acak sederhana untuk keperluan demonstrasi CRM
      const uniqueId = "bgc-" + Math.random().toString(36).substring(2, 8);

      const { error } = await supabase.from("customers").insert([
        {
          id: uniqueId,
          nama_lengkap: fullName,
          username_akun: username.toLowerCase().replace(/\s+/g, ""),
          nomor_hp: phoneNumber,
          tanggal_daftar: new Date().toISOString().split("T")[0],
          status_member: "Aktif",
          level_membership: membershipLevel,
        },
      ]);

      if (error) throw error;

      setMessage({ type: "success", text: "Member baru berhasil terdaftar! 🎉" });
      // Reset Form
      setFullName("");
      setUsername("");
      setPhoneNumber("");
      setMembershipLevel("Bronze Member");
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: error.message || "Gagal menyimpan data ke database." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-50 p-4 font-sans selection:bg-amber-100">
      <div className="w-full max-w-md bg-white border border-stone-200 p-8 shadow-sm rounded-none">
        
        {/* Header Minimalis */}
        <div className="text-center mb-8">
          <p className="text-[11px] tracking-[0.2em] text-stone-400 font-bold uppercase mb-1">
            Bogeng Coffee Shop
          </p>
          <h2 className="text-xl font-semibold text-stone-800 tracking-tight">
            Registrasi CRM Member
          </h2>
        </div>

        {/* Notifikasi Minimalis */}
        {message.text && (
          <div
            className={`p-3 mb-6 text-xs font-medium text-center border ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form Input */}
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Contoh: Lukmanul Hakim"
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-400 focus:bg-white text-stone-800 transition-all rounded-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
              Username Akun
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="hakimganteng"
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-400 focus:bg-white text-stone-800 transition-all rounded-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
              Nomor Handphone
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="0812xxxxxxxx"
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-400 focus:bg-white text-stone-800 transition-all rounded-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
              Tingkat Keanggotaan
            </label>
            <select
              value={membershipLevel}
              onChange={(e) => setMembershipLevel(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-400 focus:bg-white text-stone-700 transition-all rounded-none appearance-none cursor-pointer"
              style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2378716c\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><polyline points=\'6 9 12 15 18 9\'></polyline></svg>")', backgroundPosition: 'right 10px center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
            >
              <option value="Member">Member (Default)</option>
              <option value="Loyal">Loyal</option>
              <option value="Vip">VIP</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 bg-stone-800 text-white text-xs font-bold uppercase tracking-widest hover:bg-stone-900 active:bg-stone-950 transition-colors disabled:bg-stone-400 rounded-none"
          >
            {loading ? "Memproses..." : "Daftarkan Member"}
          </button>
        </form>

      </div>
    </div>
  );
}