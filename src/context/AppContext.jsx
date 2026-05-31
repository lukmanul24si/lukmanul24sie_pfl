import React, { createContext, useContext, useState, useEffect } from 'react';

// IMPORT SESUAI ISI FOLDER ASSETS LO RIL:
import espressoImg from '../assets/espresso.png';
import caramelImg from '../assets/caramel_macchiato.png';
import palmSugarImg from '../assets/palm_sugar_coffee.png';
import matchaImg from '../assets/matcha_latte.png';
import chococreamylavaImg from '../assets/chococreamy_lava.png';
import redvelvetImg from '../assets/redvelvet.png';
import cappuccinoImg from '../assets/cappuccino.png';
import iceCafeLatteImg from '../assets/ice_cafe_latte.png';
import dimsumImg from '../assets/dimsum.jpg';
import nasigorengImg from '../assets/nasigoreng.jpg';
import sandwichImg from '../assets/sandwich.jpg';
import spagetiImg from '../assets/spageti.jpg';
import frenchImg from '../assets/french.jpg';
import cirengImg from '../assets/cire1.png'; 
import coffeeExtraImg from '../assets/coffe1.png'; 

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [menuList] = useState([
    // ================= COFFEE (3 Menu) =================
    { id: 101, name: 'Espresso Bold', price: 25000, category: 'Coffee', img: espressoImg, isBestSeller: true },
    { id: 102, name: 'Caramel Macchiato', price: 35000, category: 'Coffee', img: caramelImg, isBestSeller: true },
    { id: 103, name: 'Palm Sugar Coffee', price: 28000, category: 'Coffee', img: palmSugarImg, isBestSeller: false },
    
    // ================= NON-COFFEE (3 Menu) =================
    { id: 201, name: 'Matcha Latte Premium', price: 32000, category: 'Non-Coffee', img: matchaImg, isBestSeller: false },
    { id: 202, name: 'Choco Creamy Lava', price: 30000, category: 'Non-Coffee', img: chococreamylavaImg, isBestSeller: true },
    { id: 203, name: 'Red Velvet Milky', price: 30000, category: 'Non-Coffee', img: redvelvetImg, isBestSeller: true },
    
    // ================= FOOD (3 Menu) =================
    { id: 301, name: 'Nasi Goreng Gacor', price: 38000, category: 'Food', img: nasigorengImg, isBestSeller: true },
    { id: 302, name: 'Club Sandwich', price: 33000, category: 'Food', img: sandwichImg, isBestSeller: false },
    { id: 303, name: 'Spaghetti Carbonara', price: 42000, category: 'Food', img: spagetiImg, isBestSeller: true },
    
    // ================= SNACK (3 Menu) =================
    { id: 401, name: 'Dimsum Platter', price: 25000, category: 'Snack', img: dimsumImg, isBestSeller: true },
    { id: 402, name: 'Cireng Crispy Garing', price: 18000, category: 'Snack', img: cirengImg, isBestSeller: true }, 
    { id: 403, name: 'French Fries Cheese', price: 22000, category: 'Snack', img: frenchImg, isBestSeller: false }
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

  const addOrder = (order) => {
    setOrders(prev => [order, ...prev]);
    const earnedPoints = Math.floor((order.total || 0) / 10000);

    setCustomers(prevCust => {
      const exists = prevCust.find(c => c.name.toLowerCase() === order.customer.toLowerCase());
      
      if (exists) {
        const newVisits = exists.visits + 1;
        let newStatus = 'MEMBER';
        if (newVisits >= 5) {
          newStatus = 'VIP';
        } else if (newVisits >= 3) {
          newStatus = 'LOYAL';
        }

        return prevCust.map(c => 
          c.name.toLowerCase() === order.customer.toLowerCase() 
            ? { ...c, visits: newVisits, points: (c.points || 0) + earnedPoints, status: newStatus } 
            : c
        );
      } else {
        return [...prevCust, {
          id: Date.now(),
          name: order.customer.toUpperCase(),
          email: `${order.customer.toLowerCase().replace(/\s/g, '')}@mail.com`,
          visits: 1,
          points: earnedPoints,
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