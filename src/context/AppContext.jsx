import React, { createContext, useContext, useState, useEffect } from 'react';

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

export const AppProvider = ({ children }) => {

  // ================= AUTH STATE =================
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bogeng_user');
    if (saved === 'null' || saved === 'undefined' || !saved) return null;
    return saved;
  });

  const login = (userData) => {
    localStorage.setItem('bogeng_user', userData);
    setUser(userData);
  };

  // 🟢 PERBAIKAN: Pastikan logout admin HANYA menghapus key usernya saja, TIDAK MENGHAPUS database orders/customers!
  const logout = () => {
    localStorage.removeItem('bogeng_user');
    setUser(null);
  };

  // ================= MENU LIST =================
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

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('bogeng_customers');
    if (saved) return JSON.parse(saved);
    
    // Default awal jika local storage benar-benar kosong pertama kali aplikasi dijalankan
    return [
      { id: 1, name: 'CHARLEY SMITH', email: 'charley@mail.com', phone: '08123456789', visits: 4, totalSpend: 400000,  status: 'MEMBER', points: 40  },
      { id: 2, name: 'JANE DOE',      email: 'jane@mail.com',    phone: '08234567890', visits: 2, totalSpend: 150000,  status: 'MEMBER', points: 15  },
      { id: 3, name: 'JOHN SMITH',    email: 'john@mail.com',    phone: '08345678901', visits: 6, totalSpend: 900000,  status: 'VIP',    points: 90  },
      { id: 4, name: 'LUKMAN HAKIM',  email: 'lukman@mail.com',  phone: '08456789012', visits: 8, totalSpend: 1200000, status: 'VIP',    points: 120 },
    ];
  });

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('bogeng_reviews');
    return saved ? JSON.parse(saved) : [];
  });

  // 🟢 SINKRONISASI DATA MANDIRI (Saling mengawasi tanpa merusak satu sama lain)
  useEffect(() => {
    localStorage.setItem('bogeng_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('bogeng_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('bogeng_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // ================= LOGIKA TIER MEMBER =================
  const getMemberTier = (visits, totalSpend) => {
    if (visits >= 25 || totalSpend >= 500000) return 'VIP';
    if (visits >= 10 || totalSpend >= 250000) return 'LOYAL';
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

    // 🟢 PERBAIKAN SENSITIF: Memastikan items yang disave SELALU berwujud array of objects
    // Jika order.items dikirim dari portal berupa array, gunakan langsung. 
    // Jika berupa string/lainnya, bungkus dengan aman agar riwayat pesanan member ke-1 tidak error saat member ke-2 login.
    let finalizedItems = [];
    if (Array.isArray(order.items)) {
      finalizedItems = order.items;
    } else {
      finalizedItems = [{ id: Date.now(), name: String(order.items || 'Menu Pesanan'), qty: 1, price: finalSubtotal }];
    }

    const processedOrder = {
      ...order,
      id: order.id || Date.now(),
      items: finalizedItems,
      discount:    discountAmount,
      total:       finalSubtotal,
      hasDiscount: appliedDiscount,
      createdAt:   order.createdAt || new Date().toISOString()
    };

    setOrders(prevOrders => {
      const isExist = prevOrders.some(o => o.id === processedOrder.id);
      if (isExist) return prevOrders;
      return [processedOrder, ...prevOrders];
    });

    const earnedPoints = Math.floor(finalSubtotal / 10000);

    setCustomers(prevCust => {
      const exists = prevCust.find(c =>
        c.name.toLowerCase() === order.customer.toLowerCase() || (order.phone && c.phone === order.phone)
      );

      if (exists) {
        const newVisits     = exists.visits + 1;
        const newTotalSpend = (exists.totalSpend || 0) + finalSubtotal;
        const newStatus     = getMemberTier(newVisits, newTotalSpend);

        return prevCust.map(c =>
          c.id === exists.id
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
          id:         Date.now() + Math.floor(Math.random() * 1000),
          name:       order.customer.toUpperCase(),
          email:      `${order.customer.toLowerCase().replace(/\s/g, '')}@mail.com`,
          phone:      order.phone || null,
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

  // ================= REVIEWS FUNCTIONS =================
  const addReview = (reviewData) => {
    // 🟢 PERBAIKAN SENSITIF: Petakan nama pengirim (`name` atau `customerName`) & ulasan (`text` atau `comment`)
    // agar ulasan dari MemberPortal tidak lagi terbaca "ANONIM" di admin moderasi.
    const senderName = reviewData.customerName || reviewData.name || 'PELANGGAN SETIA';
    const reviewText = reviewData.comment || reviewData.text || '';

    const newReview = {
      id: Date.now(),
      customerName: senderName,
      name: senderName, // Simpan kedua key untuk kompatibilitas dashboard
      phone: reviewData.phone || '',
      rating: Number(reviewData.rating || 5),
      comment: reviewText,
      text: reviewText, // Simpan kedua key untuk kompatibilitas rendering
      status: 'PENDING',
      tier: reviewData.tier || 'MEMBER',
      createdAt: new Date().toISOString()
    };
    setReviews(prev => [newReview, ...prev]);
  };

  const updateReviewStatus = (id, status) => {
    // Memastikan status diubah secara konsisten kapital (APPROVED / REJECTED / PENDING)
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: status.toUpperCase() } : r));
  };

  const deleteReview = (id) => {
    if (window.confirm('Hapus ulasan ini secara permanen?')) {
      setReviews(prev => prev.filter(r => r.id !== id));
    }
  };

  // ================= REGISTRASI MEMBER =================
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
        return { customer: null, error: 'Nama ini sudah terdaftar dengan nomor HP lain. Coba login atau hubungi kasir.' };
      }
      setCustomers((prev) =>
        prev.map((c) => c.id === existing.id ? { ...c, phone: cleanPhone } : c)
      );
      return { customer: { ...existing, phone: cleanPhone }, error: null };
    }

    const phoneTaken = customers.find((c) => c.phone === cleanPhone);
    if (phoneTaken) {
      return { customer: null, error: 'Nomor HP ini sudah terdaftar atas nama lain.' };
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

  // ================= LOGIN MEMBER =================
  const loginMember = ({ name, phone }) => {
    const cleanName  = name.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const found = customers.find(
      (c) => c.name.toLowerCase() === cleanName && c.phone === cleanPhone
    );
    if (!found) {
      return { customer: null, error: 'Nama atau nomor HP tidak terdaftar.' };
    }
    return { customer: found, error: null };
  };

  return (
    <AppContext.Provider value={{
      user, login, logout,
      menuList, orders, customers,
      reviews,
      addOrder, updateOrderStatus,
      deleteOrder, deleteCustomer,
      getMemberTier,
      registerMember, loginMember,
      addReview, updateReviewStatus, deleteReview
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