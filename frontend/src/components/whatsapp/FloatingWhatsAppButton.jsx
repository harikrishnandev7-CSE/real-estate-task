import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import WhatsAppPanel from './WhatsAppPanel';
import { useApp } from '../../context/AppContext';

const FloatingWhatsAppButton = () => {
  const { isWhatsAppOpen, openWhatsApp, closeWhatsApp, showToast } = useApp();
  const panelRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        closeWhatsApp();
      }
    };

    // Close on Escape key
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        closeWhatsApp();
      }
    };

    if (isWhatsAppOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isWhatsAppOpen, closeWhatsApp]);

  // Lock body scroll behind the panel when it is open
  useEffect(() => {
    if (isWhatsAppOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isWhatsAppOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-[999] font-sans">
      {/* Floating Toggle Button (visible only when panel is closed) */}
      <AnimatePresence>
        {!isWhatsAppOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={() => openWhatsApp()}
            type="button"
            className="w-16 h-16 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_8px_30px_rgba(37,211,102,0.25)] hover:shadow-[0_8px_35px_rgba(37,211,102,0.45)] border border-emerald-400/20 cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/50"
            aria-label="Chat on WhatsApp"
          >
            {/* Premium Custom SVG WhatsApp Monogram Logo */}
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.115-2.905-6.99C16.257 1.875 13.779.845 11.14.845 5.702.845 1.278 5.27 1.275 10.71c-.001 1.637.424 3.23 1.232 4.636L1.517 21.02l5.13-1.866zm12.353-6.55c-.298-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.15-.173.2-.297.298-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"/>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Contact Panel Card Overlay */}
      <AnimatePresence>
        {isWhatsAppOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-[84px] left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:top-[90px] sm:right-[20px] lg:top-[96px] lg:right-[24px] w-[92vw] sm:w-[420px] lg:w-[460px] bottom-auto h-auto text-[#8A8A8A] z-[100]"
          >
            <div className="relative rounded-[24px] border border-[#E8E4DA] p-[24px] sm:p-[28px] shadow-[0_25px_50px_rgba(0,0,0,0.15)] bg-white max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar text-left text-[#1A1A1A]">
              {/* Close Button on the Panel */}
              <button 
                onClick={closeWhatsApp}
                className="absolute top-6 right-6 p-1.5 rounded-full hover:bg-stone-100 text-[#8A8A85] hover:text-[#1A1A1A] transition-colors cursor-pointer outline-none"
                aria-label="Close panel"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Panel Content */}
              <WhatsAppPanel onShowToast={showToast} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingWhatsAppButton;
