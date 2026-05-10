import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const CustomerDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { orders } = useApp();

  // Filter semua pesanan milik customer ini
  const customerOrders = orders.filter(o => o.customer === name);
  const totalSpend = customerOrders.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button onClick={() => navigate(-1)} className="mb-6 text-sm font-black uppercase text-gray-400">← List Customer</button>
      
      <div className="bg-[#1a120b] rounded-[3rem] p-10 text-white mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter">{name}</h2>
          <p className="text-gray-400 font-bold uppercase text-xs tracking-[0.2em] mt-2">Loyal Customer Bogeng Coffee</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase text-gray-400">Total Kontribusi</p>
          <p className="text-3xl font-black text-yellow-500">Rp {totalSpend.toLocaleString()}</p>
        </div>
      </div>

      <h3 className="text-xl font-black mb-6 uppercase tracking-tight">Riwayat Kunjungan</h3>
      <div className="grid gap-4">
        {customerOrders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-[2rem] flex justify-between items-center shadow-sm border border-gray-50">
            <div>
              <p className="font-black text-[#1a120b]">{order.date}</p>
              <p className="text-xs text-gray-400 font-bold">{order.items.length} Menu dipesan</p>
            </div>
            <p className="font-black text-lg text-[#1a120b]">Rp {order.total.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerDetail;