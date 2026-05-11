import React from 'react';
import { useApp } from '../../context/AppContext';

const CustomerDetail = ({ data, onClose }) => {
  const { orders } = useApp();
  const myHistory = orders.filter(o => o.customer.toLowerCase() === data.name.toLowerCase());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white p-10 rounded-[3rem] w-full max-w-2xl shadow-2xl relative max-h-[85vh] overflow-hidden flex flex-col">
        <button onClick={onClose} className="absolute top-8 right-8 font-black text-gray-300 hover:text-red-500 text-xl">✕</button>
        
        <div className="flex items-center gap-6 mb-8">
          <div className="w-16 h-16 bg-[#6F4E37] rounded-3xl flex items-center justify-center text-white text-2xl font-black uppercase">
            {data.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-black italic text-[#3C2A21]">{data.name}</h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{data.status} MEMBER</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <h3 className="font-black text-sm mb-4 border-b pb-2">RIWAYAT TRANSAKSI</h3>
          <div className="space-y-4">
            {myHistory.length > 0 ? myHistory.map(order => (
              <div key={order.id} className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black text-blue-500">{order.id}</span>
                  <span className="text-[10px] font-black text-gray-400">{order.date}</span>
                </div>
                <div className="space-y-2 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs font-bold">
                      <span className="text-gray-700">{item.name} x{item.qty}</span>
                      <span>Rp {(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-200">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full ${order.status === 'DONE' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{order.status}</span>
                  <span className="font-black text-[#6F4E37]">Total Rp {order.total.toLocaleString()}</span>
                </div>
              </div>
            )) : <p className="text-center py-10 italic text-gray-400">Belum ada transaksi</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;