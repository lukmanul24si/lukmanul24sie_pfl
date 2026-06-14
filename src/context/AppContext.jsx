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
    // Bersihkan nilai aneh hasil sisa debug jika ada
    if (saved === 'null' || saved === 'undefined' || !saved) return null;
    return saved;
  });

  // FUNGSI UTAMA UNTUK LOGIN BARISTA
  const login = (userData) => {
    localStorage.setItem('bogeng_user', userData);
    setUser(userData);
  };

  // FUNGSI UTAMA LOGOUT INSTAN (DIJAMIN LANGSUNG MENTAL KE LOGIN)
  const logout = () => {
    localStorage.removeItem('bogeng_user'); // Hapus detik ini juga!
    setUser(null);                          // State null detik ini juga!
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

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('bogeng_customers');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'CHARLEY SMITH', email: 'charley@mail.com', visits: 4, status: 'LOYAL',  points: 40  },
      { id: 2, name: 'JANE DOE',      email: 'jane@mail.com',    visits: 2, status: 'MEMBER', points: 15  },
      { id: 3, name: 'JOHN SMITH',    email: 'john@mail.com',    visits: 6, status: 'VIP',    points: 90  },
      { id: 4, name: 'LUKMAN HAKIM',  email: 'lukman@mail.com',  visits: 8, status: 'VIP',    points: 120 },
    ];
  });

  useEffect(() => {
    localStorage.setItem('bogeng_orders',    JSON.stringify(orders));
    localStorage.setItem('bogeng_customers', JSON.stringify(customers));
  }, [orders, customers]);

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
        const newVisits = exists.visits + 1;
        const newStatus = newVisits >= 5 ? 'VIP' : newVisits >= 3 ? 'LOYAL' : 'MEMBER';
        return prevCust.map(c =>
          c.name.toLowerCase() === order.customer.toLowerCase()
            ? { ...c, visits: newVisits, points: (c.points || 0) + earnedPoints, status: newStatus }
            : c
        );
      } else {
        return [...prevCust, {
          id:     Date.now(),
          name:   order.customer.toUpperCase(),
          email:  `${order.customer.toLowerCase().replace(/\s/g, '')}@mail.com`,
          visits: 1,
          points: earnedPoints,
          status: 'MEMBER',
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

  return (
    <AppContext.Provider value={{
      // Auth data & actions
      user, login, logout,
      // Data
      menuList, orders, customers,
      // Actions
      addOrder, updateOrderStatus,
      deleteOrder, deleteCustomer,
    }}>
      {children}
    </AppContext.Provider>
  );
};

// 🚨 PENYESUAIAN BARU: EXPORT NAMED FUNCTION KETAT AGAR VITE GAK SALAH BACA MODULE 🚨
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp harus digunakan di dalam komponen AppProvider, Bro!');
  }
  return context;
}