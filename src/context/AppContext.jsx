import React, { createContext, useContext, useState, useEffect } from 'react';
// IMPORT SEMUA GAMBAR DARI ASSETS
import espressoImg from '../assets/espresso.png';
import caramelImg from '../assets/caramel_macchiato.png';
import palmSugarImg from '../assets/palm_sugar_coffee.png';
import matchaImg from '../assets/matcha_latte.png';
import cappuccinoImg from '../assets/cappuccino.png';
import iceCafeLatteImg from '../assets/ice_cafe_latte.png';
import dimsumImg from '../assets/dimsum.jpg';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // DATA MENU DISESUAIKAN DENGAN GAMBAR DI ASSETS
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
      { id: 1, name: 'CHARLEY SMITH', email: 'charley@mail.com', visits: 12, status: 'LOYAL' },
      { id: 2, name: 'JANE DOE', email: 'jane@mail.com', visits: 5, status: 'MEMBER' },
      { id: 3, name: 'JOHN SMITH', email: 'john@mail.com', visits: 23, status: 'VIP' },
      { id: 4, name: 'LUKMAN HAKIM', email: 'lukman@mail.com', visits: 45, status: 'VIP' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('bogeng_orders', JSON.stringify(orders));
    localStorage.setItem('bogeng_customers', JSON.stringify(customers));
  }, [orders, customers]);

  const addOrder = (order) => {
    setOrders(prev => [order, ...prev]);

    setCustomers(prevCust => {
      const exists = prevCust.find(c => c.name.toLowerCase() === order.customer.toLowerCase());
      if (exists) {
        return prevCust.map(c => 
          c.name.toLowerCase() === order.customer.toLowerCase() 
          ? { 
              ...c, 
              visits: c.visits + 1, 
              status: (c.visits + 1) > 20 ? 'VIP' : (c.visits + 1) > 10 ? 'LOYAL' : 'MEMBER' 
            } 
          : c
        );
      } else {
        return [...prevCust, {
          id: Date.now(),
          name: order.customer.toUpperCase(),
          email: `${order.customer.toLowerCase().replace(/\s/g, '')}@mail.com`,
          visits: 1,
          status: 'MEMBER'
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
    if (window.confirm("Hapus customer ini?")) {
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