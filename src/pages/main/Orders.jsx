import React from 'react';
import { useApp } from '../../context/AppContext';

const Orders = () => {
  const { orders, updateStatus } = useApp();

  return (
    <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden p-6 border border-orange-50">
      <h2 className="text-2xl font-black mb-6">Manajemen Pesanan</h2>
      <table className="w-full text-left">
        <thead className="bg-orange-50 text-orange-900 text-xs font-black uppercase">
          <tr>
            <th className="p-4">Customer</th>
            <th className="p-4">Total</th>
            <th className="p-4">Status</th>
            <th className="p-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id} className="border-b hover:bg-orange-50/20 transition-all">
              <td className="p-4 font-bold">{order.customer}</td>
              <td className="p-4 font-black text-orange-700">Rp {order.total.toLocaleString()}</td>
              <td className="p-4">
                <span className={`px-4 py-1 rounded-full text-xs font-black ${order.status === 'Done' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {order.status}
                </span>
              </td>
              <td className="p-4">
                {order.status !== 'Done' && (
                  <button 
                    onClick={() => updateStatus(order.id, 'Done')}
                    className="bg-orange-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-orange-700"
                  >
                    Selesaikan
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;