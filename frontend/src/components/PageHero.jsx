import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

const PageHero = ({ image, breadcrumbs = [], eyebrow, heading, description }) => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  };

  return (
    <div className="relative w-full h-[320px] sm:h-[360px] md:h-[420px] bg-[#F7F6F3] overflow-hidden font-sans border-b border-[rgba(22,22,26,0.08)]">
      {/* Hero Image with Clean Scrim */}
      {image && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={image}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F7F6F3] via-[#F7F6F3]/60 to-transparent" />
        </div>
      )}

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 h-full flex flex-col justify-end pb-10 md:pb-14">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3 max-w-3xl"
        >
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <motion.nav variants={itemVariants} aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#4a4a4f]">
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <ChevronRight className="w-3 h-3 text-[#4a4a4f]/50" />}
                  {crumb.href ? (
                    <Link to={crumb.href} className="hover:text-[#16161a] transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-[#A98A5B] font-bold">{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </motion.nav>
          )}

          {/* Eyebrow Label */}
          {eyebrow && (
            <motion.span variants={itemVariants} className="text-xs uppercase tracking-[0.25em] font-semibold text-[#4a4a4f] block">
              {eyebrow}
            </motion.span>
          )}

          {/* Serif Heading */}
          {heading && (
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl font-medium text-[#16161a] tracking-tight leading-tight"
              style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
            >
              {heading}
            </motion.h1>
          )}

          {/* Description */}
          {description && (
            <motion.p variants={itemVariants} className="text-sm text-[#4a4a4f] font-normal leading-relaxed max-w-2xl">
              {description}
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PageHero;
