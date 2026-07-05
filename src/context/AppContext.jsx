import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

import espressoImg from '../assets/espresso.png';
import caramelImg from '../assets/caramel_macchiato.png';
import palmSugarImg       from '../assets/palm_sugar_coffee.png';
import matchaImg          from '../assets/matcha_latte.png';
import chococreamylavaImg from '../assets/chococreamy_lava.png';
import redvelvetImg       from '../assets/redvelvet.png';
import nasigorengImg      from '../assets/nasigoreng.jpg';
import sandwichImg        from '../assets/sandwich.jpg';
import spagetiImg         from '../assets/spageti.jpg';
import dimsumImg          from '../assets/dimsum.jpg';
import cirengImg          from '../assets/cire1.png';
import frenchImg          from '../assets/french.jpg';

const AppContext = createContext();

// ============================================================
// MAPPER: baris Supabase (snake_case) -> shape yang dipakai
// komponen-komponen lama (camelCase), supaya Orders.jsx,
// Customers.jsx, CustomerDetail.jsx, Dashboard.jsx, dll TIDAK
// perlu diubah sama sekali.
// ============================================================
const mapCustomerRow = (row) => ({
  id: row.id,
  authUserId: row.auth_user_id,
  name: row.full_name,
  username: row.username,
  email: row.email,
  phone: row.phone,
  visits: row.visits ?? 0,
  totalSpend: row.total_spend ?? 0,
  points: row.points ?? 0,
  status: row.status || 'MEMBER',
  registeredAt: row.registered_at,
});

const mapOrderRow = (row) => ({
  id: row.id,
  customer: row.customer_name,
  customerId: row.customer_id,
  items: Array.isArray(row.items) ? row.items : [],
  subtotal: row.subtotal ?? 0,
  discount: row.discount ?? 0,
  total: row.total ?? 0,
  hasDiscount: !!row.has_discount,
  status: row.status,
  type: row.order_type,
  date: row.order_date,
  createdAt: row.created_at,
});

export const AppProvider = ({ children }) => {

  // ================= AUTH STATE (admin/kasir — demo, tidak berubah) =================
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bogeng_user');
    if (saved === 'null' || saved === 'undefined' || !saved) return null;
    return saved;
  });

  const login = (userData) => {
    localStorage.setItem('bogeng_user', userData);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('bogeng_user');
    setUser(null);
  };

  // ================= MENU LIST (katalog statis, tidak diminta pindah DB) =================
  const [menuList] = useState([
    { id: 101, name: 'Espresso Bold',        price: 25000, category: 'Coffee',     img: espressoImg,        isBestSeller: true  },
    { id: 102, name: 'Caramel Macchiato',    price: 35000, category: 'Coffee',     img: caramelImg,         isBestSeller: true  },
    { id: 103, name: 'Palm Sugar Coffee',    price: 28000, category: 'Coffee',     img: palmSugarImg,       isBestSeller: false },
    { id: 201, name: 'Matcha Latte Premium', price: 32000, category: 'Non-Coffee', img: matchaImg,          isBestSeller: false },
    { id: 202, name: 'Choco Creamy Lava',    price: 30000, category: 'Non-Coffee', img: chococreamylavaImg, isBestSeller: true  },
    { id: 203, name: 'Red Velvet Milky',     price: 30000, category: 'Non-Coffee', img: redvelvetImg,       isBestSeller: true  },
    { id: 301, name: 'Nasi Goreng Gacor',    price: 38000, category: 'Food',       img: nasigorengImg,      isBestSeller: true  },
    { id: 302, name: 'Club Sandwich',        price: 33000, category: 'Food',       img: sandwichImg,        isBestSeller: false },
    { id: 303, name: 'Spaghetti Carbonara',  price: 42000, category: 'Food',       img: spagetiImg,         isBestSeller: true  },
    { id: 401, name: 'Dimsum Platter',       price: 25000, category: 'Snack',      img: dimsumImg,          isBestSeller: true  },
    { id: 402, name: 'Cireng Crispy Garing', price: 18000, category: 'Snack',      img: cirengImg,          isBestSeller: true  },
    { id: 403, name: 'French Fries Cheese',  price: 22000, category: 'Snack',      img: frenchImg,          isBestSeller: false },
  ]);

  // ================= DATA DARI SUPABASE (orders & customers) =================
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const fetchOrders = useCallback(async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setOrders(data.map(mapOrderRow));
    if (error) console.error('Gagal mengambil orders dari Supabase:', error.message);
  }, []);

  const fetchCustomers = useCallback(async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setCustomers(data.map(mapCustomerRow));
    if (error) console.error('Gagal mengambil customers dari Supabase:', error.message);
  }, []);

  // 🟢 LOAD AWAL + REALTIME SYNC (biar admin & member portal selalu lihat data terbaru)
  useEffect(() => {
    (async () => {
      setLoadingData(true);
      await Promise.all([fetchOrders(), fetchCustomers()]);
      setLoadingData(false);
    })();

    const ordersChannel = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .subscribe();

    const customersChannel = supabase
      .channel('public:customers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'customers' }, fetchCustomers)
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(customersChannel);
    };
  }, [fetchOrders, fetchCustomers]);

  // ================= LOGIKA TIER MEMBER (tidak berubah) =================
  const getMemberTier = (visits, totalSpend) => {
    if (visits >= 25 || totalSpend >= 500000) return 'VIP';
    if (visits >= 10 || totalSpend >= 250000) return 'LOYAL';
    return 'MEMBER';
  };

  // ================= ORDER FUNCTIONS (sekarang tulis ke Supabase) =================
  const addOrder = async (order) => {
    let finalSubtotal  = order.total || 0;
    let discountAmount = 0;
    let appliedDiscount = false;

    if (finalSubtotal > 120000) {
      discountAmount  = finalSubtotal * 0.10;
      finalSubtotal   = finalSubtotal - discountAmount;
      appliedDiscount = true;
    }

    let finalizedItems = [];
    if (Array.isArray(order.items)) {
      finalizedItems = order.items;
    } else {
      finalizedItems = [{ id: Date.now(), name: String(order.items || 'Menu Pesanan'), qty: 1, price: finalSubtotal }];
    }

    // Cari customer yang sudah ada (case-insensitive by nama, sama seperti sebelumnya)
    const existing = customers.find(c => c.name.toLowerCase() === (order.customer || '').toLowerCase());
    const earnedPoints = Math.floor(finalSubtotal / 10000);

    let customerId = existing ? existing.id : null;

    if (existing) {
      const newVisits     = existing.visits + 1;
      const newTotalSpend = (existing.totalSpend || 0) + finalSubtotal;
      const newStatus     = getMemberTier(newVisits, newTotalSpend);

      const { error: custErr } = await supabase
        .from('customers')
        .update({
          visits: newVisits,
          total_spend: newTotalSpend,
          points: (existing.points || 0) + earnedPoints,
          status: newStatus,
        })
        .eq('id', existing.id);
      if (custErr) console.error('Gagal update customer:', custErr.message);
    } else {
      const { data: newCust, error: custErr } = await supabase
        .from('customers')
        .insert([{
          full_name:   (order.customer || 'GUEST').toUpperCase(),
          visits:      1,
          total_spend: finalSubtotal,
          points:      earnedPoints,
          status:      getMemberTier(1, finalSubtotal),
        }])
        .select()
        .single();
      if (custErr) console.error('Gagal membuat customer baru:', custErr.message);
      if (newCust) customerId = newCust.id;
    }

    const { error: orderErr } = await supabase.from('orders').insert([{
      id:            order.id || `ORD-${Date.now().toString().slice(-10)}`,
      customer_name: (order.customer || 'GUEST').toUpperCase(),
      customer_id:   customerId,
      items:         finalizedItems,
      subtotal:      order.total || 0,
      discount:      discountAmount,
      total:         finalSubtotal,
      has_discount:  appliedDiscount,
      status:        order.status || 'PROCESS',
      order_type:    order.type || null,
      order_date:    order.date || new Date().toLocaleDateString('id-ID'),
    }]);
    if (orderErr) console.error('Gagal menyimpan order ke Supabase:', orderErr.message);

    // Optimistic refresh (realtime juga akan menyusul)
    await Promise.all([fetchOrders(), fetchCustomers()]);
  };

  const updateOrderStatus = async (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o)); // optimistic
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) console.error('Gagal update status order:', error.message);
  };

  const deleteOrder = async (id) => {
    if (window.confirm('Yakin ingin menghapus riwayat pesanan ini?')) {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) console.error('Gagal menghapus order:', error.message);
      setOrders(prev => prev.filter(o => o.id !== id));
    }
  };

  const deleteCustomer = async (id) => {
    if (window.confirm('Hapus customer ini dari database?')) {
      const { error } = await supabase.from('customers').delete().eq('id', id);
      if (error) console.error('Gagal menghapus customer:', error.message);
      setCustomers(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <AppContext.Provider value={{
      user, login, logout,
      menuList, orders, customers, loadingData,
      addOrder, updateOrderStatus,
      deleteOrder, deleteCustomer,
      getMemberTier,
      refetch: () => Promise.all([fetchOrders(), fetchCustomers()]),
    }}>
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp harus digunakan di dalam komponen AppProvider!');
  }
  return context;
}
