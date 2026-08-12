import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];
const DEFAULT_HERO_IMAGE = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85";

const PageHero = ({ image, breadcrumbs = [], eyebrow, heading, description }) => {
  const shouldReduceMotion = useReducedMotion();
  const bgImage = image || DEFAULT_HERO_IMAGE;

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  };

  return (
    <div className="relative w-full h-[360px] sm:h-[420px] md:h-[480px] bg-[#0B0B0B] overflow-hidden font-sans border-b border-[rgba(201,169,110,0.20)]">
      {/* High Clarity Hero Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={bgImage}
          alt={heading || "Luxury Estate Header"}
          className="w-full h-full object-cover opacity-85 scale-105 transition-transform duration-1000"
        />
        {/* Subtle Dark Gradient Overlay for Maximum Image Clarity & Readable Content */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/40 to-[#0B0B0B]/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B]/70 via-transparent to-[#0B0B0B]/30" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 h-full flex flex-col justify-end pb-10 md:pb-14 pt-[90px]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3 max-w-3xl"
        >
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <motion.nav variants={itemVariants} aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#C9A96E]">
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <ChevronRight className="w-3 h-3 text-[#F4F1EA]/50" />}
                  {crumb.href ? (
                    <Link to={crumb.href} className="text-[#F4F1EA]/80 hover:text-[#C9A96E] transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-[#C9A96E] font-bold">{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </motion.nav>
          )}

          {/* Eyebrow Label */}
          {eyebrow && (
            <motion.span variants={itemVariants} className="text-xs uppercase tracking-[0.25em] font-semibold text-[#C9A96E] block">
              {eyebrow}
            </motion.span>
          )}

          {/* Serif Heading */}
          {heading && (
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl font-medium text-[#F4F1EA] tracking-tight leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {heading}
            </motion.h1>
          )}

          {/* Description */}
          {description && (
            <motion.p variants={itemVariants} className="text-sm sm:text-base text-[rgba(244,241,234,0.85)] font-normal leading-relaxed max-w-2xl">
              {description}
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PageHero;