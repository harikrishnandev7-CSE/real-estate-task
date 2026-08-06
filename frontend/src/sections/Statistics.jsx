import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Award, Landmark, Smile, Calendar } from 'lucide-react';

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
      desc: 'Bespoke residential developments and commercial assets completed.',
      icon: Landmark
    },
    {
      label: 'Happy Families',
      value: '1200+',
      desc: 'Discerning buyers successfully placed in their signature estates.',
      icon: Smile
    },
    {
      label: 'Exclusive Listings',
      value: '450+',
      desc: 'Active verified plots, penthouses, villas, and commercial properties.',
      icon: Award
    },
    {
      label: 'Years Experience',
      value: '25+',
      desc: 'A quarter-century of legacy in high-end real estate brokerage.',
      icon: Calendar
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
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 20, 
      scale: 0.98 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      }
    },
    hover: {
      y: shouldReduceMotion ? 0 : -6,
      borderColor: "#F5A623",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section className="py-24 md:py-28 lg:py-32 bg-white relative border-t border-[#E8E4DA] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover="hover"
                className="group relative p-8 bg-[#F4F1EA] border border-[#E8E4DA] rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between min-h-[220px] transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Top Bar with Icon */}
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-amber-50 text-[#F5A623] group-hover:bg-[#F5A623] group-hover:text-white transition-all duration-300 shadow-xs">
                      <Icon className="w-4.5 h-4.5 stroke-[2]" />
                    </div>
                  </div>

                  {/* Counter Digit */}
                  <div className="text-4xl lg:text-5xl font-black text-[#1A1A1A] font-sans tracking-tight group-hover:text-[#F5A623] transition-colors">
                    <AnimatedCounter value={stat.value} duration={1200} />
                  </div>
                </div>

                {/* Metadata Description */}
                <div className="space-y-1 mt-6">
                  <h4 className="text-xs uppercase tracking-widest text-[#1A1A1A] font-bold font-sans">{stat.label}</h4>
                  <p className="text-[#8A8A85] text-[11px] leading-relaxed font-normal font-sans">{stat.desc}</p>
                </div>

                {/* Hover indicator line */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F5A623] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Statistics;
