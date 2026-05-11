import React from 'react';
import { useApp } from '../../context/AppContext';

const OrderDetail = ({ data, onClose }) => {
  const { updateOrderStatus } = useApp();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white p-10 rounded-[3rem] w-full max-w-md shadow-2xl relative">
        <button onClick={onClose} className="absolute top-8 right-8 font-black text-gray-300 hover:text-red-500">✕</button>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black italic text-[#3C2A21]">{data.id}</h2>
          <p className="text-gray-400 text-xs font-bold uppercase">{data.customer}</p>
        </div>

        <div className="space-y-3 mb-8 max-h-40 overflow-y-auto pr-2">
          {data.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-xs font-bold">
              <span>{item.name} x{item.qty}</span>
              <span>Rp {(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-6 rounded-3xl mb-8">
          <div className="flex justify-between font-black text-lg text-[#6F4E37]">
            <span>TOTAL</span>
            <span>Rp {data.total.toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => {updateOrderStatus(data.id, 'PROCESS'); onClose();}}
            className={`py-4 rounded-2xl font-black text-[10px] transition-all ${data.status === 'PROCESS' ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'bg-gray-100 text-gray-400'}`}
          >
            SET PROCESS
          </button>
          <button 
            onClick={() => {updateOrderStatus(data.id, 'DONE'); onClose();}}
            className={`py-4 rounded-2xl font-black text-[10px] transition-all ${data.status === 'DONE' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-gray-100 text-gray-400'}`}
          >
            SET DONE
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;