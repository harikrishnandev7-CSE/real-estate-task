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
 * PageHero — A single reusable sub-page banner that matches the homepage
 * hero quality bar.
 *
 * Features:
 *  - Full-bleed contextual background image
 *  - Scroll-triggered parallax (image slower than content)
 *  - Mount entrance: image scale 1.08 → 1.0 over 1.4 s
 *  - Desktop-only mouse tilt (±3°) with spring physics
 *  - Staggered text entrance: eyebrow → heading → description
 *  - Gradient overlay matching the homepage hero
 *  - Fully respects prefers-reduced-motion
 *
 * Props:
 *  image          string  — Unsplash CDN URL (use ?auto=format&fit=crop&w=1600&q=75)
 *  breadcrumbs    array   — [{ label, href? }]  (last item has no href → current page)
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
      className="relative w-full h-[360px] sm:h-[400px] md:h-[460px] lg:h-[500px] overflow-hidden bg-[#F4F1EA]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      {/* Background Image Container with Notch Cut-out + Mount Scale + Parallax + Tilt */}
      <motion.div
        className="absolute inset-x-2 sm:inset-x-4 md:inset-x-8 top-3 sm:top-4 bottom-0 z-0 overflow-hidden rounded-2xl sm:rounded-3xl clip-notch shadow-lg"
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

        {/* Vibrant backdrop overlay for maximum image clarity & text contrast */}
        <div className="absolute inset-0 bg-black/10 z-10" />
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(244,241,234,0.1) 0%, transparent 45%, rgba(244,241,234,0.3) 80%, rgba(244,241,234,0.65) 100%)',
          }}
        />
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, rgba(244,241,234,0.75) 0%, rgba(244,241,234,0.45) 40%, transparent 85%)',
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
                className="flex items-center flex-wrap gap-1.5 text-xs font-sans font-bold text-[#3A3732] mb-1"
              >
                {breadcrumbs.map((crumb, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <ChevronRight className="w-3 h-3 text-[#3A3732]/70 shrink-0" />}
                    {crumb.href ? (
                      <Link
                        to={crumb.href}
                        className="hover:text-[#F5A623] transition-colors duration-200"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-[#D97706] font-extrabold">{crumb.label}</span>
                    )}
                  </React.Fragment>
                ))}
              </motion.nav>
            )}

            {/* Eyebrow label */}
            {eyebrow && (
              <motion.span
                variants={eyebrowVariants}
                className="text-xs uppercase tracking-[0.25em] text-[#D97706] font-extrabold block font-sans"
              >
                {eyebrow}
              </motion.span>
            )}

            {/* Mixed-weight Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-sans text-[#1A1A1A] tracking-tight leading-[1.15] sm:leading-[1.1] [&_em]:font-normal [&_em]:text-[#4A4640] [&_em]:not-italic [&_span.light]:font-normal [&_span.light]:text-[#4A4640]"
            >
              {heading}
            </motion.h1>

            {/* Description */}
            {description && (
              <motion.p
                variants={itemVariants}
                className="text-[#2B2926] font-medium text-sm md:text-base max-w-2xl leading-relaxed font-sans pt-1 drop-shadow-xs"
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
