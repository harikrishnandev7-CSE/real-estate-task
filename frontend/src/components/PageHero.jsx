import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

/**
 * PageHero — Phase 2 restyled reusable sub-page banner.
 *
 * Changes: gradient overlay tones shifted to Azureish White (#E0EEE9),
 * eyebrow/breadcrumb/heading/description colors updated to new palette.
 * All parallax, tilt, and animation logic preserved unchanged.
 *
 * Props:
 *  image          string  — Unsplash CDN URL
 *  breadcrumbs    array   — [{ label, href? }]
 *  eyebrow        string  — ALL CAPS small label above heading
 *  heading        node    — JSX (can include <em> italic spans)
 *  description    string  — Body copy below heading
 */
const PageHero = ({ image, breadcrumbs = [], eyebrow, heading, description }) => {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef(null);

  // Scroll Parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const rawImgY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 40]);
  const rawContentY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -10]);
  const imgY = useSpring(rawImgY, { stiffness: 80, damping: 20, mass: 0.6 });
  const contentY = useSpring(rawContentY, { stiffness: 80, damping: 20, mass: 0.6 });

  // Mouse Tilt (desktop only)
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springTiltX = useSpring(tiltX, { stiffness: 120, damping: 18, mass: 0.4 });
  const springTiltY = useSpring(tiltY, { stiffness: 120, damping: 18, mass: 0.4 });

  const handleMouseMove = (e) => {
    if (shouldReduceMotion || !sectionRef.current) return;
    const isTouchDevice =
      typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;
    if (isTouchDevice) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tiltX.set(py * -3);
    tiltY.set(px * 3);
  };

  const handleMouseLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  // Text Entrance Variants
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
  };

  const eyebrowVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
  };

  return (
    <div
      ref={sectionRef}
      className="relative w-full h-[360px] sm:h-[400px] md:h-[460px] lg:h-[500px] overflow-hidden"
      style={{ background: '#E0EEE9' }}   /* Azureish White — matches page bg */
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000, background: '#E0EEE9' }}
    >
      {/* Background Image Container */}
      <motion.div
        className="absolute inset-x-2 sm:inset-x-4 md:inset-x-8 top-3 sm:top-4 bottom-0 z-0 overflow-hidden rounded-xl sm:rounded-2xl clip-notch shadow-md"
        style={{
          y: imgY,
          rotateX: springTiltX,
          rotateY: springTiltY,
          willChange: 'transform',
        }}
        initial={{ scale: shouldReduceMotion ? 1 : 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.4, ease: EASE }}
      >
        <img
          src={image}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover"
        />

        {/* Subtle dark scrim */}
        <div className="absolute inset-0 z-10" style={{ background: 'rgba(54,60,70,0.08)' }} />

        {/* Bottom gradient — Azureish White fade */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(224,238,233,0.08) 0%, transparent 42%, rgba(224,238,233,0.28) 78%, rgba(224,238,233,0.62) 100%)',
          }}
        />
        {/* Left gradient — Azureish White fade */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, rgba(224,238,233,0.70) 0%, rgba(224,238,233,0.40) 38%, transparent 82%)',
          }}
        />
      </motion.div>

      {/* Foreground Content */}
      <motion.div
        className="absolute inset-0 z-20 flex flex-col justify-end"
        style={{ y: contentY }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-16 w-full pb-6 sm:pb-10 md:pb-14">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3 max-w-3xl"
          >
            {/* Breadcrumb */}
            {breadcrumbs.length > 0 && (
              <motion.nav
                variants={eyebrowVariants}
                aria-label="Breadcrumb"
                className="flex items-center flex-wrap gap-1.5 text-xs font-bold mb-1"
                style={{
                  fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif",
                  color: '#363C46',
                }}
              >
                {breadcrumbs.map((crumb, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && (
                      <ChevronRight className="w-3 h-3 shrink-0" style={{ color: 'rgba(54,60,70,0.50)' }} />
                    )}
                    {crumb.href ? (
                      <Link
                        to={crumb.href}
                        className="transition-colors duration-200 hover:opacity-70"
                        style={{ color: '#363C46' }}
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span style={{ color: '#CFB6A8', fontWeight: 700 }}>{crumb.label}</span>
                    )}
                  </React.Fragment>
                ))}
              </motion.nav>
            )}

            {/* Eyebrow label — Dark Vanilla */}
            {eyebrow && (
              <motion.span
                variants={eyebrowVariants}
                className="text-xs uppercase tracking-[0.25em] font-extrabold block"
                style={{
                  fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif",
                  color: '#CFB6A8',
                }}
              >
                {eyebrow}
              </motion.span>
            )}

            {/* Editorial Serif Heading */}
            <motion.h1
              variants={itemVariants}
              className="tracking-tight leading-[1.12]"
              style={{
                fontFamily: "'Fraunces', 'Playfair Display', serif",
                fontSize: 'clamp(28px, 4.5vw, 60px)',
                fontWeight: 600,
                color: '#363C46',
              }}
            >
              {heading}
            </motion.h1>

            {/* Description */}
            {description && (
              <motion.p
                variants={itemVariants}
                className="text-sm md:text-[15px] max-w-2xl leading-relaxed pt-1"
                style={{
                  fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif",
                  fontWeight: 400,
                  color: '#5D6472',
                }}
              >
                {description}
              </motion.p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PageHero;
