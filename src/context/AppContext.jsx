import React, { createContext, useState, useContext, useEffect } from 'react';
import { menuCoffee as initialMenu, ordersData } from '../data/dummyData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 1. Ambil data dari LocalStorage saat pertama kali Load
  // Jika kosong, pakai data default (initialMenu/ordersData)
  const [menuList, setMenuList] = useState(() => {
    const saved = localStorage.getItem('beans_menu');
    return saved ? JSON.parse(saved) : initialMenu;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('beans_orders');
    return saved ? JSON.parse(saved) : ordersData;
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('beans_customers');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Lukman', status: 'Loyal Member', totalSpent: 150000 }
    ];
  });

  // 2. Simpan ke LocalStorage setiap kali ada perubahan data (useEffect)
  useEffect(() => {
    localStorage.setItem('beans_menu', JSON.stringify(menuList));
  }, [menuList]);

  useEffect(() => {
    localStorage.setItem('beans_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('beans_customers', JSON.stringify(customers));
  }, [customers]);

  // --- FUNGSI LOGIKA (Masih sama seperti sebelumnya) ---

  const addMenu = (newMenu) => {
    setMenuList([newMenu, ...menuList]);
  };

  const addOrder = (newOrder) => {
    setOrders([newOrder, ...orders]);
  };

  const updateStatus = (id, newStatus) => {
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(o => o.id === id ? { ...o, status: newStatus } : o);
      
      if (newStatus === 'Done') {
        const finishedOrder = updatedOrders.find(o => o.id === id);
        if (finishedOrder && finishedOrder.total >= 120000) {
          setCustomers(prevCust => {
            const isExist = prevCust.find(c => c.name.toLowerCase() === finishedOrder.customer.toLowerCase());
            if (!isExist) {
              return [...prevCust, {
                id: Date.now(),
                name: finishedOrder.customer,
                status: 'Loyal Member',
                totalSpent: finishedOrder.total,
                joinedAt: new Date().toLocaleDateString()
              }];
            } else {
              return prevCust.map(c => c.name.toLowerCase() === finishedOrder.customer.toLowerCase() 
                ? { ...c, totalSpent: c.totalSpent + finishedOrder.total } 
                : c);
            }
          });
        }
      }
      return updatedOrders;
    });
  };

  return (
    <AppContext.Provider value={{ 
      orders, 
      customers, 
      addOrder, 
      updateStatus, 
      menuList, 
      addMenu 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);