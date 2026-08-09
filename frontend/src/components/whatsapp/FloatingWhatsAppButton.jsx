import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import WhatsAppPanel from './WhatsAppPanel';
import { useApp } from '../../context/AppContext';

/**
 * FloatingWhatsAppButton — Phase 2 restyled
 * WhatsApp green FAB preserved (functionally distinct brand color).
 * Panel chrome (card, border, close button) updated to new minimal palette.
 * All click-outside, escape, scroll-lock logic preserved unchanged.
 */
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
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {!isWhatsAppOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={() => openWhatsApp()}
            type="button"
            className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer outline-none"
            style={{
              background: '#25D366',                  /* WhatsApp brand green — kept for recognition */
              boxShadow: '0 6px 24px rgba(37,211,102,0.28)',
              border: '1px solid rgba(37,211,102,0.25)',
              /* Minimal chrome ring using new palette instead of heavy amber ring */
              outline: 'none',
            }}
            aria-label="Chat on WhatsApp"
            onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 3px rgba(93,100,114,0.20), 0 6px 24px rgba(37,211,102,0.28)'}
            onBlur={e => e.currentTarget.style.boxShadow = '0 6px 24px rgba(37,211,102,0.28)'}
          >
            <svg className="w-7 h-7 fill-current text-white" viewBox="0 0 24 24">
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
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed top-[80px] left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:top-[88px] sm:right-[20px] lg:top-[94px] lg:right-[24px] w-[92vw] sm:w-[420px] lg:w-[448px] z-[100]"
          >
            {/* Panel card — minimal luxury chrome */}
            <div
              className="relative overflow-y-auto custom-scrollbar text-left max-h-[calc(100vh-112px)]"
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(93,100,114,0.15)',
                borderRadius: 10,
                padding: '1.75rem',
                boxShadow: '0 20px 48px rgba(54,60,70,0.12)',
                color: '#363C46',
              }}
            >
              {/* Close Button */}
              <button
                onClick={closeWhatsApp}
                className="absolute top-5 right-5 p-1.5 rounded-full transition-colors cursor-pointer outline-none hover:bg-[#E0EEE9]"
                style={{ color: '#5D6472' }}
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
