import React from 'react';
import Avatar from './Avatar';

const Header = ({ title, subtitle, userName, userRole, fallbackText }) => {
  return (
    <header className="flex justify-between items-center mb-10">
      <div>
        <h2 className="text-3xl font-black tracking-tighter italic font-shop text-[#3C2A21]">{title}</h2>
        {subtitle && <p className="text-xs font-bold text-gray-400 mt-1">{subtitle}</p>}
      </div>
      
      <Avatar name={userName} role={userRole} fallbackText={fallbackText} />
    </header>
  );
};

export default Header;