import React from 'react';
import { useApp } from '../../context/AppContext';

const Customers = () => {
  const { orders } = useApp(); // Pastikan orders di Context menyimpan data checkout

  return (
    <div className="animate-fade-in">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-[#1a120b] tracking-tighter uppercase">Riwayat <span className="text-[#8c6d52]">Customers</span></h1>
        <p className="text-gray-400 font-bold text-xs tracking-widest uppercase mt-1">Daftar transaksi yang telah selesai</p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#fbf9f6] border-b border-gray-100">
            <tr>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400">Customer</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400">Pesanan</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400">Tanggal</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 text-right">Total Bayar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.length > 0 ? orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#eae0d5] rounded-full flex items-center justify-center font-black text-[#8c6d52]">{order.customer[0]}</div>
                    <span className="font-bold text-[#1a120b]">{order.customer}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col gap-1">
                    {order.items.map((item, idx) => (
                      <span key={idx} className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md w-fit">
                        {item.qty}x {item.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-8 py-6 text-sm text-gray-400 font-bold">{order.date}</td>
                <td className="px-8 py-6 text-right font-black text-[#1a120b]">Rp {order.total.toLocaleString()}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="text-center py-20 text-gray-300 font-bold italic">Belum ada riwayat transaksi.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;