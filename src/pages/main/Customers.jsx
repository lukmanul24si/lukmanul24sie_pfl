import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import CustomerDetail from './CustomerDetail';

const Customers = () => {
  const { customers, deleteCustomer } = useApp();
  const [selectedCust, setSelectedCust] = useState(null);
  const [search, setSearch] = useState("");

  const filteredCust = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm p-8">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-black text-xl italic text-[#3C2A21]">Database Pelanggan</h3>
        <input 
          type="text" 
          placeholder="Cari nama member..." 
          className="bg-gray-50 px-6 py-2 rounded-full text-xs outline-none border border-transparent focus:border-[#6F4E37] w-64 font-bold"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="w-full text-left">
        <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
          <tr>
            <th className="px-6 py-5">Nama Lengkap</th>
            <th className="px-6 py-5 text-center">Visits</th>
            <th className="px-6 py-5 text-center">Status</th>
            <th className="px-6 py-5 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {filteredCust.map(cust => (
            <tr key={cust.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-6 font-black uppercase text-gray-700">{cust.name}</td>
              <td className="px-6 py-6 text-center font-bold text-gray-400">{cust.visits} Kali</td>
              <td className="px-6 py-6 text-center">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black ${
                  cust.status === 'VIP' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {cust.status}
                </span>
              </td>
              <td className="px-6 py-6 flex justify-end gap-2">
                <button 
                  onClick={() => setSelectedCust(cust)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black hover:scale-105 transition-all"
                >
                  HISTORY
                </button>
                <button 
                  onClick={() => deleteCustomer(cust.id)}
                  className="bg-red-50 text-red-500 px-4 py-2 rounded-xl text-[10px] font-black hover:bg-red-500 hover:text-white transition-all"
                >
                  REMOVE
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedCust && (
        <CustomerDetail data={selectedCust} onClose={() => setSelectedCust(null)} />
      )}
    </div>
  );
};

export default Customers;