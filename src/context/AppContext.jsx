import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- 1. State Menu (Ambil dari LocalStorage) ---
  const [menuList, setMenuList] = useState(() => {
    const saved = localStorage.getItem('menus');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Cappuccino', price: 25000, category: 'Coffee', img: 'cappuccino.png' },
      { id: 2, name: 'Cireng Crispy', price: 15000, category: 'Cemilan', img: 'cire1.png' }
    ];
  });

  // --- 2. State Orders (Ambil dari LocalStorage) ---
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  // --- 3. Save ke LocalStorage otomatis ---
  useEffect(() => {
    localStorage.setItem('menus', JSON.stringify(menuList));
  }, [menuList]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  // --- 4. Fungsi Aksi ---
  const addMenu = (item) => setMenuList([...menuList, item]);

  const addOrder = (order) => setOrders([order, ...orders]);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  return (
    <AppContext.Provider value={{ menuList, addMenu, orders, addOrder, updateOrderStatus, deleteOrder }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);