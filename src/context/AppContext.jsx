import React, { createContext, useContext, useState, useEffect } from 'react';
import espressoImg from '../assets/espresso.png';
import caramelImg from '../assets/caramel_macchiato.png';
import palmSugarImg from '../assets/palm_sugar_coffee.png';
import matchaImg from '../assets/matcha_latte.png';
import cappuccinoImg from '../assets/cappuccino.png';
import iceCafeLatteImg from '../assets/ice_cafe_latte.png';
import dimsumImg from '../assets/dimsum.jpg';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [menuList] = useState([
    { id: 1, name: 'Espresso Bold', price: 25000, category: 'Coffee', img: espressoImg },
    { id: 2, name: 'Caramel Macchiato', price: 35000, category: 'Coffee', img: caramelImg },
    { id: 3, name: 'Palm Sugar Coffee', price: 28000, category: 'Coffee', img: palmSugarImg },
    { id: 4, name: 'Matcha Latte Premium', price: 32000, category: 'Non-Coffee', img: matchaImg },
    { id: 5, name: 'Cappuccino Hot', price: 30000, category: 'Coffee', img: cappuccinoImg },
    { id: 6, name: 'Ice Cafe Latte', price: 28000, category: 'Coffee', img: iceCafeLatteImg },
    { id: 7, name: 'Dimsum Platter', price: 25000, category: 'Snack', img: dimsumImg }
  ]);

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('bogeng_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('bogeng_customers');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'CHARLEY SMITH', email: 'charley@mail.com', visits: 4, status: 'LOYAL', points: 40 },
      { id: 2, name: 'JANE DOE', email: 'jane@mail.com', visits: 2, status: 'MEMBER', points: 15 },
      { id: 3, name: 'JOHN SMITH', email: 'john@mail.com', visits: 6, status: 'VIP', points: 90 },
      { id: 4, name: 'LUKMAN HAKIM', email: 'lukman@mail.com', visits: 8, status: 'VIP', points: 120 }
    ];
  });

  useEffect(() => {
    localStorage.setItem('bogeng_orders', JSON.stringify(orders));
    localStorage.setItem('bogeng_customers', JSON.stringify(customers));
  }, [orders, customers]);

  // ================= RE-LOGIC CRM: AUTOMATIC TIERING SYSTEM BY ORDER COUNT =================
  const addOrder = (order) => {
    setOrders(prev => [order, ...prev]);

    // Setiap belanja kelipatan Rp 10.000 dapet 1 Poin Reward resmi
    const earnedPoints = Math.floor((order.total || 0) / 10000);

    setCustomers(prevCust => {
      const exists = prevCust.find(c => c.name.toLowerCase() === order.customer.toLowerCase());
      
      if (exists) {
        const newVisits = exists.visits + 1;
        // JIKA 3 KALI PESAN -> LOYAL, JIKA >= 5 KALI PESAN -> VIP (TERTINGGI)
        let newStatus = 'MEMBER';
        if (newVisits >= 5) {
          newStatus = 'VIP';
        } else if (newVisits >= 3) {
          newStatus = 'LOYAL';
        }

        return prevCust.map(c => 
          c.name.toLowerCase() === order.customer.toLowerCase() 
            ? { 
                ...c, 
                visits: newVisits, 
                points: (c.points || 0) + earnedPoints,
                status: newStatus
              } 
            : c
        );
      } else {
        // Pelanggan Baru pertama kali input nama di kasir
        return [...prevCust, {
          id: Date.now(),
          name: order.customer.toUpperCase(),
          email: `${order.customer.toLowerCase().replace(/\s/g, '')}@mail.com`,
          visits: 1,
          points: earnedPoints,
          status: 'MEMBER' // Awal join status member biasa
        }];
      }
    });
  };

  const updateOrderStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const deleteOrder = (id) => {
    if (window.confirm("Yakin ingin menghapus riwayat pesanan ini?")) {
      setOrders(prev => prev.filter(o => o.id !== id));
    }
  };

  const deleteCustomer = (id) => {
    if (window.confirm("Hapus customer ini dari database?")) {
      setCustomers(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <AppContext.Provider value={{ 
      menuList, orders, customers, 
      addOrder, updateOrderStatus, 
      deleteOrder, deleteCustomer 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);