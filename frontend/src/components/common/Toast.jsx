import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

/**
 * Toast — Phase 2 restyled
 * Minimal dark pill using Arsenic + Dark Vanilla accent.
 * All logic (duration, onClose, show) is preserved.
 */
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
          initial={{ opacity: 0, y: -16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.96 }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 pointer-events-auto"
          style={{
            background: '#363C46',            /* Arsenic */
            border: '1px solid rgba(93,100,114,0.35)',
            borderRadius: '9999px',
            padding: '10px 20px 10px 16px',
            boxShadow: '0 8px 32px rgba(54,60,70,0.22)',
            maxWidth: 'min(92vw, 440px)',
          }}
        >
          {/* Dark Vanilla check icon */}
          <CheckCircle
            className="shrink-0"
            style={{ width: 17, height: 17, color: '#CFB6A8', strokeWidth: 2.2 }}
          />
          {/* Message */}
          <span
            style={{
              fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '0.02em',
              color: '#E0EEE9',              /* Azureish White */
              lineHeight: 1.45,
            }}
          >
            {message}
          </span>
          {/* Dismiss button */}
          <button
            onClick={onClose}
            className="shrink-0 cursor-pointer outline-none rounded-full p-0.5 transition-opacity hover:opacity-70 focus-visible:ring-1 focus-visible:ring-[#CFB6A8]"
            aria-label="Dismiss notification"
            style={{ color: 'rgba(224,238,233,0.55)' }}
          >
            <X style={{ width: 14, height: 14 }} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
