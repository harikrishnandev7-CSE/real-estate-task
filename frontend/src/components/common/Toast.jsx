import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

const Toast = ({ message, show, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 bg-[#1A1A1A] border border-neutral-700 text-white shadow-2xl rounded-full px-6 py-3.5 max-w-[90%] md:max-w-md pointer-events-auto"
        >
          <CheckCircle className="w-5 h-5 text-[#F5A623] shrink-0" />
          <span className="text-xs tracking-wide font-medium font-sans">{message}</span>
          <button 
            onClick={onClose}
            className="p-0.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors outline-none focus-visible:ring-1 focus-visible:ring-gold-400/50 cursor-pointer shrink-0"
            aria-label="Close alert"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
