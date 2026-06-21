import React, { createContext, useContext, useState, useEffect } from 'react';

import espressoImg from '../assets/espresso.png';
import caramelImg from '../assets/caramel_macchiato.png';
import palmSugarImg from '../assets/palm_sugar_coffee.png';
import matchaImg from '../assets/matcha_latte.png';
import chococreamylavaImg from '../assets/chococreamy_lava.png';
import redvelvetImg from '../assets/redvelvet.png';
import nasigorengImg from '../assets/nasigoreng.jpg';
import sandwichImg from '../assets/sandwich.jpg';
import spagetiImg from '../assets/spageti.jpg';
import dimsumImg from '../assets/dimsum.jpg';
import cirengImg from '../assets/cire1.png';
import frenchImg from '../assets/french.jpg';

const AppContext = createContext();

export const AppProvider = ({ children }) => {

  // ================= AUTH STATE TEROPTIMALISASI =================
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

  // ================= MENU LIST DATA =================
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

  // ================= PERSISTENT STORAGE =================
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('bogeng_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // 🟢 UPDATE: customer sekarang bisa punya field `phone` (no HP) — dipakai
  // sebagai kredensial login Member Portal. Customer yang dibuat otomatis dari
  // kasir (Dashboard) belum punya `phone` sampai pelanggannya "klaim" lewat
  // halaman /member-register.
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('bogeng_customers');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'CHARLEY SMITH', email: 'charley@mail.com', phone: null, visits: 4, totalSpend: 400000,  status: 'MEMBER', points: 40  },
      { id: 2, name: 'JANE DOE',      email: 'jane@mail.com',    phone: null, visits: 2, totalSpend: 150000,  status: 'MEMBER', points: 15  },
      { id: 3, name: 'JOHN SMITH',    email: 'john@mail.com',    phone: null, visits: 6, totalSpend: 900000,  status: 'VIP',    points: 90  },
      { id: 4, name: 'LUKMAN HAKIM',  email: 'lukman@mail.com',  phone: null, visits: 8, totalSpend: 1200000, status: 'VIP',    points: 120 },
    ];
  });

  useEffect(() => {
    localStorage.setItem('bogeng_orders',    JSON.stringify(orders));
    localStorage.setItem('bogeng_customers', JSON.stringify(customers));
  }, [orders, customers]);

  // ================= LOGIKA TIER MEMBER ==============================
  const getMemberTier = (visits, totalSpend) => {
    if (visits >= 25 || totalSpend >= 500000) return 'VIP';
    if (visits >= 10) return 'LOYAL';
    return 'MEMBER';
  };

  // ================= ORDER FUNCTIONS =================
  const addOrder = (order) => {
    let finalSubtotal  = order.total || 0;
    let discountAmount = 0;
    let appliedDiscount = false;

    if (finalSubtotal > 120000) {
      discountAmount  = finalSubtotal * 0.10;
      finalSubtotal   = finalSubtotal - discountAmount;
      appliedDiscount = true;
    }

    const processedOrder = {
      ...order,
      discount:    discountAmount,
      total:       finalSubtotal,
      hasDiscount: appliedDiscount,
    };

    setOrders(prev => [processedOrder, ...prev]);

    const earnedPoints = Math.floor(finalSubtotal / 10000);

    setCustomers(prevCust => {
      const exists = prevCust.find(c =>
        c.name.toLowerCase() === order.customer.toLowerCase()
      );

      if (exists) {
        const newVisits     = exists.visits + 1;
        const newTotalSpend = (exists.totalSpend || 0) + finalSubtotal;
        const newStatus     = getMemberTier(newVisits, newTotalSpend);

        return prevCust.map(c =>
          c.name.toLowerCase() === order.customer.toLowerCase()
            ? {
                ...c,
                visits:     newVisits,
                totalSpend: newTotalSpend,
                points:     (c.points || 0) + earnedPoints,
                status:     newStatus,
              }
            : c
        );
      } else {
        const newTotalSpend = finalSubtotal;
        return [...prevCust, {
          id:         Date.now(),
          name:       order.customer.toUpperCase(),
          email:      `${order.customer.toLowerCase().replace(/\s/g, '')}@mail.com`,
          phone:      null,
          visits:     1,
          totalSpend: newTotalSpend,
          points:     earnedPoints,
          status:     getMemberTier(1, newTotalSpend),
        }];
      }
    });
  };

  const updateOrderStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const deleteOrder = (id) => {
    if (window.confirm('Yakin ingin menghapus riwayat pesanan ini?')) {
      setOrders(prev => prev.filter(o => o.id !== id));
    }
  };

  const deleteCustomer = (id) => {
    if (window.confirm('Hapus customer ini dari database?')) {
      setCustomers(prev => prev.filter(c => c.id !== id));
    }
  };

  // ================= 🟢 BARU: REGISTRASI MEMBER (Self Sign-up) ================
  // Dipanggil dari halaman /member-register. Logikanya:
  //   1. Cari dulu apakah nama ini SUDAH ada di data customer (mungkin pernah
  //      dicatat kasir lewat Dashboard tapi belum punya nomor HP/akun member).
  //   2a. Kalau ada & belum punya phone -> "klaim" record itu, tempelkan
  //       nomor HP-nya. Histori transaksi & tier lama otomatis kebawa, gak
  //       reset ke nol. Ini behavior yang paling adil buat pelanggan lama.
  //   2b. Kalau ada & phone-nya BEDA -> nama ini udah dipakai orang lain,
  //       tolak (suruh pakai nama lain atau ke /member-login).
  //   3. Kalau belum ada sama sekali -> bikin customer baru dari nol.
  // Return: { customer, error } — error null kalau sukses.
  const registerMember = ({ name, phone }) => {
    const cleanName  = name.trim();
    const cleanPhone = phone.trim();
    if (!cleanName || !cleanPhone) {
      return { customer: null, error: 'Nama dan nomor HP wajib diisi.' };
    }

    const existing = customers.find(
      (c) => c.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (existing) {
      if (existing.phone && existing.phone !== cleanPhone) {
        return {
          customer: null,
          error: 'Nama ini sudah terdaftar dengan nomor HP lain. Coba /member-login atau hubungi kasir.',
        };
      }
      // Klaim record lama (atau phone-nya sama persis, re-register aman)
      let claimed = existing;
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === existing.id) {
            claimed = { ...c, phone: cleanPhone };
            return claimed;
          }
          return c;
        })
      );
      return { customer: { ...existing, phone: cleanPhone }, error: null };
    }

    // Cek juga: nomor HP yang sama gak boleh dipakai 2 nama berbeda
    const phoneTaken = customers.find((c) => c.phone === cleanPhone);
    if (phoneTaken) {
      return {
        customer: null,
        error: 'Nomor HP ini sudah terdaftar atas nama lain. Coba /member-login.',
      };
    }

    const newCustomer = {
      id:         Date.now(),
      name:       cleanName.toUpperCase(),
      email:      `${cleanName.toLowerCase().replace(/\s/g, '')}@mail.com`,
      phone:      cleanPhone,
      visits:     0,
      totalSpend: 0,
      points:     0,
      status:     'MEMBER',
    };
    setCustomers((prev) => [...prev, newCustomer]);
    return { customer: newCustomer, error: null };
  };

  // ================= 🟢 BARU: LOGIN MEMBER (validasi nama + no HP) =========
  const loginMember = ({ name, phone }) => {
    const cleanName  = name.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const found = customers.find(
      (c) => c.name.toLowerCase() === cleanName && c.phone === cleanPhone
    );
    if (!found) {
      return { customer: null, error: 'Nama atau nomor HP gak ketemu di sistem kami. Belum daftar? Klik Daftar Member Baru.' };
    }
    return { customer: found, error: null };
  };

  return (
    <AppContext.Provider value={{
      user, login, logout,
      menuList, orders, customers,
      addOrder, updateOrderStatus,
      deleteOrder, deleteCustomer,
      getMemberTier,
      registerMember, loginMember, // 🟢 BARU
    }}>
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp harus digunakan di dalam komponen AppProvider, Bro!');
  }
  return context;
}
