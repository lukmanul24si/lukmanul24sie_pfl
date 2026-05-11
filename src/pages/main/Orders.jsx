import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import OrderDetail from './OrderDetail';

const Orders = () => {
  const { orders, deleteOrder } = useApp();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter(o => 
    o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search)
  );

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm p-8">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-black text-xl italic text-[#3C2A21]">Riwayat Pesanan</h3>
        <input 
          type="text" 
          placeholder="Cari Order ID / Nama..." 
          className="bg-gray-50 px-6 py-2 rounded-full text-xs outline-none border border-transparent focus:border-[#6F4E37] w-64 font-bold"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="w-full text-left">
        <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
          <tr>
            <th className="px-6 py-5">Order ID</th>
            <th className="px-6 py-5">Pelanggan</th>
            <th className="px-6 py-5 text-center">Status</th>
            <th className="px-6 py-5 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {filteredOrders.map(order => (
            <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
              <td className="px-6 py-6 text-[10px] font-bold text-blue-500">{order.id}</td>
              <td className="px-6 py-6 font-black uppercase text-gray-700">{order.customer}</td>
              <td className="px-6 py-6 text-center">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black ${
                  order.status === 'DONE' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-6 flex justify-end gap-2">
                <button 
                  onClick={() => setSelectedOrder(order)}
                  className="bg-[#6F4E37] text-white px-4 py-2 rounded-xl text-[10px] font-black hover:scale-105 transition-all"
                >
                  DETAIL
                </button>
                <button 
                  onClick={() => deleteOrder(order.id)}
                  className="bg-red-50 text-red-500 px-4 py-2 rounded-xl text-[10px] font-black hover:bg-red-500 hover:text-white transition-all"
                >
                  HAPUS
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedOrder && (
        <OrderDetail data={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
};

export default Orders;