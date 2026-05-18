import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          
          {/* Modal Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl relative z-10 border border-gray-50"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-gray-800 uppercase tracking-wide">{title}</h3>
              <button onClick={onClose} className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 font-bold hover:bg-gray-100">×</button>
            </div>
            <div className="text-sm text-gray-600">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;