import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

/**
 * AdminModal — Admin Dialog & Drawer Primitive
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: function
 *  - title: string
 *  - subtitle: string
 *  - size: 'sm' (420px) | 'md' (600px) | 'lg' (760px) | 'drawer' (right slide-over)
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
      case 'drawer': return 'w-full max-w-lg md:max-w-xl h-full fixed right-0 top-0 rounded-l-3xl rounded-r-none';
      case 'md':
      default: return 'max-w-xl';
    }
  };

  const isDrawer = size === 'drawer';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9998]"
          />

          {/* Modal / Drawer Surface */}
          <motion.div
            initial={isDrawer ? { x: '100%' } : { opacity: 0, scale: 0.95, y: 20 }}
            animate={isDrawer ? { x: 0 } : { opacity: 0.99, scale: 1, y: 0 }}
            exit={isDrawer ? { x: '100%' } : { opacity: 0, scale: 0.95, y: 20 }}
            transition={isDrawer ? { duration: 0.25, ease: [0.16, 1, 0.3, 1] } : { type: 'spring', damping: 25, stiffness: 220 }}
            className={`z-[9999] bg-white border border-[#E8E4DA] p-6 sm:p-8 font-sans text-left text-[#1A1A1A] shadow-[0_25px_50px_rgba(0,0,0,0.15)] overflow-y-auto custom-scrollbar ${
              isDrawer
                ? getSizeClass()
                : `fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] ${getSizeClass()} rounded-3xl max-h-[90vh]`
            }`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-stone-100 text-[#8A8A85] hover:text-[#1A1A1A] transition-colors cursor-pointer outline-none z-10"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Modal Header */}
            {(title || subtitle) && (
              <div className="border-b border-[#E8E4DA] pb-4 mb-6 pr-8">
                <div className="flex items-center gap-3">
                  {isDestructive && (
                    <div className="w-10 h-10 rounded-full bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5 stroke-[2]" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl md:text-2xl font-extrabold text-[#1A1A1A] tracking-tight">
                      {title}
                    </h3>
                    {subtitle && (
                      <p className="text-xs text-[#8A8A85] mt-1 font-normal leading-relaxed">
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

            {/* Modal Footer (Action Buttons if onConfirm supplied) */}
            {onConfirm && (
              <div className="border-t border-[#E8E4DA] pt-6 mt-6 flex items-center justify-end gap-3 font-sans">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full border border-[#E8E4DA] bg-white hover:bg-[#F4F1EA] text-[#1A1A1A] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  {cancelText}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md ${
                    isDestructive
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-[#1A1A1A] hover:bg-black text-white'
                  }`}
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
