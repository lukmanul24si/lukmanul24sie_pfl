import React from 'react';
import { useApp } from '../../context/AppContext';

const Customers = () => {
  const { customers } = useApp();

  return (
    <div className="animate-fade-in p-2">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-800">Pelanggan Loyal 🌟</h2>
        <p className="text-gray-500">Daftar member otomatis yang belanja di atas Rp 120.000.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.length > 0 ? customers.map((cust) => (
          <div key={cust.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-orange-100 flex items-center gap-5 hover:shadow-md transition-all">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg shadow-orange-200">
              👤
            </div>
            <div>
              <h4 className="font-bold text-xl text-gray-800">{cust.name}</h4>
              <div className="flex flex-col">
                <span className="text-xs font-black text-orange-600 uppercase tracking-widest">{cust.status}</span>
                <span className="text-sm text-gray-400 font-medium">Total: Rp {cust.totalSpent.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
            <p className="text-gray-400 italic font-medium">Belum ada pelanggan loyal terdeteksi...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;