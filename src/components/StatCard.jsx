import React from 'react';

const StatCard = ({ title, value, icon, description, trend }) => {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-[#6F4E37] transition-all">
      <div className="space-y-1">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-black text-gray-800">{value}</h3>
        {description && (
          <p className="text-[11px] font-bold text-gray-400">
            {trend && <span className="text-emerald-500 mr-1">{trend}</span>}
            {description}
          </p>
        )}
      </div>
      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-amber-50 transition-colors">
        {icon}
      </div>
    </div>
  );
};

export default StatCard;