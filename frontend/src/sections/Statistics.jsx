import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const AnimatedCounter = ({ value, duration = 1000 }) => {
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  const targetNumber = parseInt(value.replace(/[^0-9]/g, ''), 10);
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    if (!elementRef.current) return;

    if (shouldReduceMotion) {
      elementRef.current.textContent = `${targetNumber}${suffix}`;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTime = null;

          const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const current = Math.floor(progress * targetNumber);

            if (elementRef.current) {
              elementRef.current.textContent = `${current}${suffix}`;
            }

            if (progress < 1) {
              window.requestAnimationFrame(animate);
            } else if (elementRef.current) {
              elementRef.current.textContent = `${targetNumber}${suffix}`;
            }
          };
          window.requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [value, duration, shouldReduceMotion, targetNumber, suffix]);

  return <span ref={elementRef}>{value}</span>;
};

const Statistics = () => {
  const stats = [
    {
      label: 'Delivered Projects',
      value: '150+',
      desc: 'Bespoke residential developments and commercial assets completed.'
    },
    {
      label: 'Placed Families',
      value: '1200+',
      desc: 'Discerning buyers successfully placed in signature estates.'
    },
    {
      label: 'Exclusive Listings',
      value: '450+',
      desc: 'Active verified plots, penthouses, villas, and commercial assets.'
    },
    {
      label: 'Years Experience',
      value: '25+',
      desc: 'A quarter-century of legacy in high-end real estate advisory.'
    }
  ];

  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="py-20 md:py-24 bg-[#F7F6F3] text-[#16161a] border-t border-[rgba(22,22,26,0.08)] font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="p-8 bg-white border border-[rgba(22,22,26,0.10)] rounded-md shadow-[0_1px_2px_rgba(22,22,26,0.04),0_8px_24px_rgba(22,22,26,0.05)] space-y-4"
            >
              <div
                className="text-4xl lg:text-5xl font-medium text-[#16161a] tracking-tight"
                style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
              >
                <AnimatedCounter value={stat.value} duration={1200} />
              </div>

              <div className="space-y-1 pt-2 border-t border-[rgba(22,22,26,0.08)]">
                <h4 className="text-xs uppercase tracking-[0.2em] text-[#A98A5B] font-semibold">{stat.label}</h4>
                <p className="text-[#4a4a4f] text-xs leading-relaxed">{stat.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Statistics;
