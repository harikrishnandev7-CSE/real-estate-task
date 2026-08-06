import React, { useEffect, useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const EASE_OUT = [0.16, 1, 0.3, 1];

// 5 Architectural Tiers representing a luxury rising tower
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

    // Phase 1 -> Phase 2 (Building built, reveal logo at 1.1s)
    const t1 = setTimeout(() => {
      setPhase('logo');
    }, 1100);

    // Phase 2 -> Phase 3 (Reverse collapse & exit curtain at 1.9s)
    const t2 = setTimeout(() => {
      setPhase('exit');
    }, 1900);

    // Final completion trigger at 2.5s
    const t3 = setTimeout(() => {
      onCompleteRef.current?.();
    }, 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [shouldReduceMotion]);

  // Reduced motion accessible fallback
  if (shouldReduceMotion) {
    return (
      <motion.div
        key="preloader-overlay"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="fixed inset-0 bg-[#F4F1EA] z-[9999] flex flex-col items-center justify-center font-sans"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-3"
        >
          <span className="font-bold text-3xl md:text-4xl text-[#1A1A1A] tracking-[0.3em]">
            IMPERIA ESTATES
          </span>
          <div className="h-[2px] w-12 bg-[#F5A623]" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#8A8A85] font-semibold">
            LUXURY REAL ESTATE & INVESTMENTS
          </span>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="preloader-overlay"
      initial={{ y: '0%' }}
      animate={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 bg-[#F4F1EA] z-[9999] flex flex-col items-center justify-center overflow-hidden font-sans select-none"
    >
      <div className="relative flex flex-col items-center justify-center p-6">
        
        {/* 3D Perspective Scene Container */}
        <div
          className="relative w-64 h-56 flex flex-col items-center justify-end pb-2"
          style={{
            perspective: 900,
            perspectiveOrigin: '50% 85%',
          }}
        >
          {/* 3D Rotated Isometric Building Assembly Frame */}
          <div
            className="relative flex flex-col-reverse items-center justify-start gap-1.5"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'rotateX(20deg) rotateY(-12deg)',
            }}
          >
            {BUILDING_TIERS.map((tier, idx) => {
              const isExit = phase === 'exit';

              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, rotateX: -30, y: 24, scale: 0.85 }}
                  animate={
                    isExit
                      ? { opacity: 0, scale: 0.8, y: 12 }
                      : { opacity: 1, rotateX: 0, y: 0, scale: 1 }
                  }
                  transition={{
                    duration: isExit ? 0.35 : 0.65,
                    delay: isExit ? (BUILDING_TIERS.length - 1 - idx) * 0.05 : idx * 0.12,
                    ease: EASE_OUT,
                  }}
                  className="relative flex items-center justify-center"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <svg
                    width={tier.width}
                    height={tier.height}
                    viewBox={`0 0 ${tier.width} ${tier.height}`}
                    className="overflow-visible"
                  >
                    {/* Outer Floor Plate Border */}
                    <rect
                      x="1"
                      y="1"
                      width={tier.width - 2}
                      height={tier.height - 2}
                      rx={tier.rx}
                      fill="rgba(255, 255, 255, 0.95)"
                      stroke="#1A1A1A"
                      strokeWidth={tier.strokeWidth}
                      className="shadow-xs"
                    />
                    {/* Internal Architectural Façade Grid Lines */}
                    <line
                      x1={tier.width * 0.33}
                      y1="2"
                      x2={tier.width * 0.33}
                      y2={tier.height - 2}
                      stroke="#8A8A85"
                      strokeWidth="0.8"
                      strokeDasharray="2 2"
                      opacity="0.5"
                    />
                    <line
                      x1={tier.width * 0.66}
                      y1="2"
                      x2={tier.width * 0.66}
                      y2={tier.height - 2}
                      stroke="#8A8A85"
                      strokeWidth="0.8"
                      strokeDasharray="2 2"
                      opacity="0.5"
                    />
                  </svg>
                </motion.div>
              );
            })}

            {/* Amber Blueprint Tracer Guideline Drawing Upward */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20"
              style={{ transform: 'translateZ(12px)' }}
            >
              <motion.line
                x1="12%"
                y1="100%"
                x2="12%"
                y2="0%"
                stroke="#F5A623"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
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
            className="flex flex-col items-center gap-2"
          >
            <span className="font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#1A1A1A] tracking-[0.3em] font-sans">
              IMPERIA ESTATES
            </span>
            
            {/* Amber Underline Drawing Left-To-Right */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={phase === 'logo' || phase === 'exit' ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.5, delay: 0.12, ease: EASE_OUT }}
              className="h-[2.5px] w-20 bg-[#F5A623] origin-center rounded-full"
            />

            <span className="text-[10px] uppercase tracking-[0.35em] text-[#8A8A85] font-extrabold font-sans mt-0.5">
              LUXURY REAL ESTATE & INVESTMENTS
            </span>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
};

export default Preloader;
