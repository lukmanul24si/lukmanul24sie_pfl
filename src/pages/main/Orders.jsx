import React from "react";
import { useNavigate } from "react-router-dom"; // Tambahkan ini
import { useApp } from "../../context/AppContext";

const Orders = () => {
  const { orders, updateOrderStatus, deleteOrder } = useApp();
  const navigate = useNavigate(); // Inisialisasi navigate

  return (
    <div className="max-w-5xl mx-auto p-4 animate-fade-in">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-black text-[#1a120b] uppercase tracking-tighter">
            Daftar Pesanan
          </h2>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
            Manajemen antrean pelanggan
          </p>
        </div>
        <div className="bg-[#1a120b] text-white px-4 py-2 rounded-2xl font-black text-xs">
          TOTAL: {orders.length}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
          <span className="text-5xl block mb-4">📝</span>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
            Belum ada pesanan masuk
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden flex flex-col"
            >
              {/* Header Card */}
              <div className="p-6 pb-0 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black text-[#8c6d52] uppercase tracking-[0.2em]">
                    {order.id}
                  </span>
                  <h3 className="text-2xl font-black text-[#1a120b] uppercase tracking-tighter mt-1">
                    {order.customer}
                  </h3>
                </div>
                <div
                  className={`px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest ${
                    order.status === "Done"
                      ? "bg-green-100 text-green-600"
                      : "bg-[#fbf9f6] text-[#8c6d52] animate-pulse"
                  }`}
                >
                  {order.status === "Done" ? "✅ Selesai" : "⏳ Proses"}
                </div>
              </div>

              {/* Items List */}
              <div className="p-6 flex-1">
                <div className="bg-[#fbf9f6] rounded-3xl p-5 space-y-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-[#1a120b] text-white text-[10px] font-black rounded-lg flex items-center justify-center">
                          {item.qty}
                        </span>
                        <span className="font-bold text-[#1a120b] text-sm">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-xs font-black text-gray-400">
                        Rp {(item.qty * item.price).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Total Bayar
                    </span>
                    <span className="text-lg font-black text-[#1a120b]">
                      Rp {order.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 pb-6 flex flex-wrap gap-3 items-center">
                {order.status !== "Done" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "Done")}
                    className="flex-[2] py-4 bg-[#1a120b] hover:bg-[#2d1e13] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-black/10"
                  >
                    Selesaikan Pesanan
                  </button>
                )}
                <button
                  onClick={() => deleteOrder(order.id)}
                  className="flex-1 py-4 bg-red-50 hover:bg-red-100 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                >
                  Hapus
                </button>

                {/* Tombol Detail CRM 1 */}
                <button
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="w-full mt-2 text-[10px] font-black uppercase text-[#8c6d52] hover:text-[#1a120b] transition-colors tracking-widest text-center"
                >
                  ─── Lihat Detail Invoice ───
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;