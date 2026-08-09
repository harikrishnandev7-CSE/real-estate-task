import React, { useEffect, useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const EASE_OUT = [0.16, 1, 0.3, 1];

const BUILDING_TIERS = [
  { id: 'podium', label: 'Plaza Podium', width: 140, height: 18, strokeWidth: 2, rx: 3 },
  { id: 'base', label: 'Lower Residences', width: 116, height: 26, strokeWidth: 1.8, rx: 2 },
  { id: 'mid', label: 'Mid Tower Suites', width: 92, height: 30, strokeWidth: 1.6, rx: 2 },
  { id: 'upper', label: 'Sky Villas', width: 72, height: 24, strokeWidth: 1.5, rx: 2 },
  { id: 'crown', label: 'Penthouse Crown', width: 48, height: 18, strokeWidth: 1.5, rx: 1.5 },
];

const Preloader = ({ onComplete }) => {
  const shouldReduceMotion = useReducedMotion();
  const [phase, setPhase] = useState('building'); // 'building' | 'logo' | 'exit'
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (shouldReduceMotion) {
      const t = setTimeout(() => {
        onCompleteRef.current?.();
      }, 500);
      return () => clearTimeout(t);
    }

    const t1 = setTimeout(() => {
      setPhase('logo');
    }, 1100);

    const t2 = setTimeout(() => {
      setPhase('exit');
    }, 1900);

    const t3 = setTimeout(() => {
      onCompleteRef.current?.();
    }, 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) {
    return (
      <motion.div
        key="preloader-overlay"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[9999] bg-[#E0EEE9] flex items-center justify-center font-sans"
      >
        <div className="text-center space-y-2">
          <span
            className="text-2xl font-bold text-[#363C46] tracking-[0.25em]"
            style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
          >
            IMPERIA ESTATES
          </span>
          <div className="h-0.5 w-12 bg-[#CFB6A8] mx-auto rounded-full" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="preloader-curtain"
      initial={{ opacity: 1 }}
      animate={phase === 'exit' ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.55, ease: EASE_OUT }}
      className="fixed inset-0 z-[9999] bg-[#E0EEE9] flex flex-col items-center justify-center font-sans overflow-hidden select-none pointer-events-auto"
    >
      <div className="relative flex flex-col items-center justify-center w-full max-w-sm px-6">
        
        {/* Architectural Tower Blueprint Drawing Animation */}
        <div className="relative w-48 h-44 flex flex-col-reverse items-center justify-start pb-2">
          {BUILDING_TIERS.map((tier, idx) => {
            const delayTime = idx * 0.12;
            return (
              <motion.div
                key={tier.id}
                initial={{ scaleX: 0, opacity: 0, y: 10 }}
                animate={
                  phase === 'exit'
                    ? { scaleX: 0, opacity: 0, y: -10 }
                    : { scaleX: 1, opacity: 1, y: 0 }
                }
                transition={{
                  duration: 0.5,
                  delay: phase === 'exit' ? (4 - idx) * 0.05 : delayTime,
                  ease: EASE_OUT,
                }}
                style={{
                  width: `${tier.width}px`,
                  height: `${tier.height}px`,
                  borderRadius: `${tier.rx}px`,
                }}
                className="my-[1.5px] border border-[#363C46]/40 bg-white/70 shadow-xs relative flex items-center justify-center overflow-hidden"
              >
                {/* Inner architectural grid line */}
                <div className="absolute inset-0 border-t border-[rgba(93,100,114,0.15)] pointer-events-none" />

                {/* Micro laser scan pulse line */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    ease: 'linear',
                    delay: delayTime + 0.3,
                  }}
                  className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-[#CFB6A8]/40 to-transparent pointer-events-none"
                />
              </motion.div>
            );
          })}

          {/* Vertical axis blueprint tracer line */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <motion.line
                x1="50%"
                y1="100%"
                x2="50%"
                y2="0%"
                stroke="#CFB6A8"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 0.8, 0.8, 0] }}
                transition={{ duration: 1.1, ease: 'easeInOut' }}
              />
            </svg>
          </div>
        </div>

        {/* Brand Wordmark & Underline Reveal Container */}
        <div className="relative mt-4 flex flex-col items-center gap-2">
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={
              phase === 'exit'
                ? { opacity: 0, y: -10, scale: 0.95 }
                : phase === 'logo'
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 12, scale: 0.96 }
            }
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className="flex flex-col items-center gap-2 text-center"
          >
            <span
              className="font-semibold text-2xl sm:text-3xl text-[#363C46] tracking-[0.25em]"
              style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
            >
              IMPERIA ESTATES
            </span>
            
            {/* Underline Drawing Left-To-Right */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={phase === 'logo' || phase === 'exit' ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.5, delay: 0.12, ease: EASE_OUT }}
              className="h-[2px] w-16 bg-[#CFB6A8] origin-center rounded-full"
            />

            <span className="text-[10px] uppercase tracking-[0.3em] text-[#5D6472] font-bold font-sans mt-0.5">
              LUXURY REAL ESTATE & INVESTMENTS
            </span>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
};

export default Preloader;
