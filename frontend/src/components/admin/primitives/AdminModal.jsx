import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';

/**
 * AdminModal — Admin Dialog & Drawer Primitive (Phase 2 restyled)
 *
 * Chrome updated to Arsenic/Black Coral/Dark Vanilla/Azureish White palette.
 * All props, logic (scroll lock, escape key, size variants, confirm footer) unchanged.
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: function
 *  - title: string
 *  - subtitle: string
 *  - size: 'sm' | 'md' | 'lg' | 'drawer'
 *  - isDestructive: boolean
 *  - confirmText: string
 *  - cancelText: string
 *  - onConfirm: function
 *  - children: node
 */
const AdminModal = ({
  isOpen = false,
  onClose,
  title,
  subtitle,
  size = 'md',
  isDestructive = false,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  children
}) => {
  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'max-w-md';
      case 'lg': return 'max-w-3xl';
      case 'drawer': return 'w-full max-w-lg md:max-w-xl h-full fixed right-0 top-0';
      case 'md':
      default: return 'max-w-xl';
    }
  };

  const isDrawer = size === 'drawer';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — Arsenic-tinted blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9998]"
            style={{
              background: 'rgba(54,60,70,0.72)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          />

          {/* Modal / Drawer Surface */}
          <motion.div
            initial={isDrawer ? { x: '100%' } : { opacity: 0, scale: 0.96, y: 18 }}
            animate={isDrawer ? { x: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={isDrawer ? { x: '100%' } : { opacity: 0, scale: 0.96, y: 18 }}
            transition={
              isDrawer
                ? { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
                : { type: 'spring', damping: 28, stiffness: 220 }
            }
            className={`z-[9999] overflow-y-auto custom-scrollbar text-left font-sans ${
              isDrawer
                ? getSizeClass()
                : `fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] ${getSizeClass()} max-h-[90vh]`
            }`}
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(93,100,114,0.15)',
              borderRadius: isDrawer ? '8px 0 0 8px' : 8,
              padding: '2rem',
              boxShadow: '0 25px 60px rgba(54,60,70,0.14)',
              color: '#363C46',
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full transition-colors cursor-pointer outline-none z-10 hover:bg-[#E0EEE9]"
              style={{ color: '#5D6472' }}
              aria-label="Close modal"
            >
              <X className="w-5 h-5 stroke-2" />
            </button>

            {/* Modal Header */}
            {(title || subtitle) && (
              <div
                className="pb-4 mb-6 pr-8"
                style={{ borderBottom: '1px solid rgba(93,100,114,0.15)' }}
              >
                <div className="flex items-center gap-3">
                  {isDestructive && (
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}
                    >
                      <AlertTriangle className="w-5 h-5 stroke-2" />
                    </div>
                  )}
                  <div>
                    <h3
                      className="text-xl font-medium tracking-tight"
                      style={{
                        fontFamily: "'Fraunces', 'Playfair Display', serif",
                        color: '#363C46',
                      }}
                    >
                      {title}
                    </h3>
                    {subtitle && (
                      <p className="text-xs font-normal mt-1 leading-relaxed" style={{ color: '#5D6472' }}>
                        {subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Modal Body */}
            <div className="space-y-4">
              {children}
            </div>

            {/* Modal Footer */}
            {onConfirm && (
              <div
                className="pt-6 mt-6 flex items-center justify-end gap-3"
                style={{ borderTop: '1px solid rgba(93,100,114,0.15)' }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  style={{
                    borderRadius: 6,
                    border: '1px solid rgba(93,100,114,0.20)',
                    background: '#FFFFFF',
                    color: '#363C46',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#E0EEE9'}
                  onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
                >
                  {cancelText}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  style={{
                    borderRadius: 6,
                    background: isDestructive ? '#DC2626' : '#363C46',
                    color: '#FFFFFF',
                    boxShadow: isDestructive
                      ? '0 4px 12px rgba(220,38,38,0.25)'
                      : '0 4px 12px rgba(54,60,70,0.18)',
                  }}
                >
                  {confirmText}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AdminModal;
