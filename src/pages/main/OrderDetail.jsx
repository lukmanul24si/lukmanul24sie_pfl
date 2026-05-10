import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders } = useApp();
  
  const order = orders.find(o => o.id === id);

  if (!order) return <div className="p-10 font-black">Pesanan Tidak Ditemukan!</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-[3rem] p-10 shadow-xl">
      <button onClick={() => navigate(-1)} className="mb-6 text-sm font-black uppercase text-gray-400">← Kembali</button>
      
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black uppercase tracking-tighter">Invoice {order.id}</h2>
        <span className="bg-[#1a120b] text-white px-4 py-2 rounded-2xl text-xs font-black">{order.status}</span>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase">Pelanggan</p>
          <p className="font-bold text-lg">{order.customer}</p>
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase">Tanggal Transaksi</p>
          <p className="font-bold text-lg">{order.date}</p>
        </div>
      </div>

      <div className="bg-[#fbf9f6] rounded-[2rem] p-6 mb-6">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-200">
              <th className="pb-4 text-[10px] uppercase font-black text-gray-400">Item</th>
              <th className="pb-4 text-[10px] uppercase font-black text-gray-400 text-center">Qty</th>
              <th className="pb-4 text-[10px] uppercase font-black text-gray-400 text-right">Harga</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i}>
                <td className="py-4 font-bold text-sm">{item.name}</td>
                <td className="py-4 font-bold text-sm text-center">{item.qty}</td>
                <td className="py-4 font-bold text-sm text-right">Rp {(item.price * item.qty).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center px-6">
        <p className="font-black uppercase tracking-widest text-gray-400">Total Pembayaran</p>
        <p className="text-3xl font-black text-[#1a120b]">Rp {order.total.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default OrderDetail;