import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

const DEFAULT_STATUSES = [
  { id: 'PENDING', label: 'Pending', color: 'bg-amber-500', text: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'DONE', label: 'Done', color: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'CANCEL', label: 'Cancel', color: 'bg-rose-500', text: 'text-rose-600', bg: 'bg-rose-50' },
];

// ➕ prop `statuses` ditambahkan supaya dropdown ini bisa dipakai ulang
// di halaman lain yang punya daftar status berbeda (mis. Orders.jsx
// pakai PROCESS/DONE/CANCEL, bukan PENDING/DONE/CANCEL).
const DropdownStatus = ({ currentStatus, onStatusChange, statuses = DEFAULT_STATUSES }) => {
  const [isOpen, setIsOpen] = useState(false);

  const active = statuses.find(s => s.id === currentStatus) || statuses[0];

  return (
    <div className="relative inline-block text-left font-sans select-none z-30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg text-[11px] font-black tracking-tight border-[0.5px] border-[#E3E3E3] transition-all bg-white text-[#313131] min-w-25 shadow-sm hover:bg-gray-50`}
      >
        <span className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${active.color}`} />
          {active.label}
        </span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop untuk nutup dropdown pas klik di luar */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-1 w-32 bg-white border-[0.5px] border-[#E3E3E3] rounded-xl shadow-xl z-50 overflow-hidden p-1"
            >
              {statuses.map((status) => (
                <button
                  key={status.id}
                  onClick={() => {
                    onStatusChange(status.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 text-[11px] font-bold rounded-lg text-left transition-colors ${
                    currentStatus === status.id
                      ? `${status.bg} ${status.text}`
                      : 'text-[#9B9B9B] hover:bg-gray-50 hover:text-[#313131]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${status.color}`} />
                    {status.label}
                  </span>
                  {currentStatus === status.id && <Check size={12} strokeWidth={3} />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownStatus;