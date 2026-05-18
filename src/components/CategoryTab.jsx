import React from 'react';

const CategoryTab = ({ categories, activeTab, setActiveTab }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar select-none">
      {categories.map((cat) => {
        const isActive = activeTab === cat;
        return (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-bold tracking-tight transition-all duration-150 ${
              isActive
                ? 'bg-[#C67C4E] text-white shadow-sm'
                : 'bg-[#FBF8F6] text-[#313131] border-[0.5px] border-[#E3E3E3] hover:bg-[#F2ECE7]'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTab;