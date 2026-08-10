import React, { useEffect, useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const EASE_OUT = [0.16, 1, 0.3, 1];

const Preloader = ({ onComplete }) => {
  const shouldReduceMotion = useReducedMotion();
  const [phase, setPhase] = useState('logo'); // 'logo' | 'exit'
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (shouldReduceMotion) {
      const t = setTimeout(() => {
        onCompleteRef.current?.();
      }, 400);
      return () => clearTimeout(t);
    }

    const t1 = setTimeout(() => {
      setPhase('exit');
    }, 1200);

    const t2 = setTimeout(() => {
      onCompleteRef.current?.();
    }, 1700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) {
    return (
      <motion.div
        key="preloader-overlay"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[9999] bg-[#F7F6F3] flex items-center justify-center font-sans"
      >
        <div className="text-center space-y-2">
          <span
            className="text-2xl font-medium text-[#16161a] tracking-[0.25em]"
            style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
          >
            IMPERIA ESTATES
          </span>
          <div className="h-0.5 w-12 bg-[#A98A5B] mx-auto rounded-full" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="preloader-curtain"
      initial={{ opacity: 1 }}
      animate={phase === 'exit' ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      className="fixed inset-0 z-[9999] bg-[#F7F6F3] flex flex-col items-center justify-center font-sans overflow-hidden select-none pointer-events-auto"
    >
      <div className="relative flex flex-col items-center justify-center text-center px-6 space-y-3">
        {/* Brand Wordmark */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={phase === 'exit' ? { opacity: 0, y: -6 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="text-2xl sm:text-3xl md:text-4xl font-medium text-[#16161a] tracking-[0.25em]"
          style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
        >
          IMPERIA ESTATES
        </motion.span>
        
        {/* Thin Gold-Bronze Underline Drawing Left-To-Right */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={phase === 'exit' ? { opacity: 0 } : { scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE_OUT }}
          className="h-[1.5px] w-20 bg-[#A98A5B] origin-center rounded-full"
        />

        <motion.span
          initial={{ opacity: 0 }}
          animate={phase === 'exit' ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25, ease: EASE_OUT }}
          className="text-[10px] uppercase tracking-[0.3em] text-[#4a4a4f] font-semibold font-sans pt-1 block"
        >
          LUXURY REAL ESTATE & INVESTMENTS
        </motion.span>
      </div>
    </motion.div>
  );
};

export default Preloader;
