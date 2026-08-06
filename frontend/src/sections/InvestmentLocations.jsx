import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion, useInView, animate } from 'framer-motion';
import { TrendingUp, ArrowRight, Building } from 'lucide-react';
import ImageWithSkeleton from '../components/ImageWithSkeleton';

// Small helper to merge classnames (same pattern as the gallery component)
function cn(...inputs) {
  return inputs.flat().filter(Boolean).join(' ');
}

// Counts a "+12.4% YoY" style growth figure up from 0 once its card has
// landed — mount/in-view triggered per card via useInView + imperative
// animate(), not dependent on deep variant propagation.
const GrowthBadge = ({ growth, reduceMotion }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const match = growth.match(/^([+-]?)(\d+(?:\.\d+)?)(.*)$/);
  const sign = match ? match[1] : '';
  const target = match ? parseFloat(match[2]) : null;
  const rest = match ? match[3] : '';

  const [display, setDisplay] = useState(reduceMotion || target === null ? target : 0);

  useEffect(() => {
    if (target === null) return;
    if (!isInView || reduceMotion) {
      setDisplay(target);
      return;
    }
    const controls = animate(0, target, {
      duration: 1.1,
      delay: 0.3,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [isInView, reduceMotion, target]);

  return (
    <span ref={ref} className="font-semibold tabular-nums">
      {target === null ? growth : `${sign}${display.toFixed(1)}${rest}`}
    </span>
  );
};

/**
 * CityCard
 *
 * Desktop (md+): behaves like the ExpandableGallery — every card sits in a
 * flex row at flex-1, and the hovered card grows to flex-[3] while its
 * siblings compress. The entrance animation (fade/slide-in on scroll) and
 * the image micro-zoom / content-reveal logic from the original card are
 * layered on top of that expand behaviour rather than replaced.
 *
 * Mobile (<md): flex-basis expansion is a poor touch UX, so cards fall
 * back to a plain stacked column at a fixed height.
 */
const CityCard = ({ city, index, shouldReduceMotion, isHovered, onHover, onLeave }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.25, margin: '0px 0px -80px 0px' });
  const fromLeft = index % 2 === 0;

  const hiddenX = shouldReduceMotion ? 0 : (fromLeft ? -56 : 56);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: hiddenX }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: hiddenX }}
      transition={{
        duration: 0.6,
        delay: shouldReduceMotion ? 0 : (index % 3) * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={() => navigate(`/buy?city=${encodeURIComponent(city.name)}`)}
      style={{ willChange: 'transform, opacity, flex-grow' }}
      className={cn(
        // Shared card chrome
        'group relative overflow-hidden rounded-3xl border border-[#E8E4DA] hover:border-[#F5A623]',
        'cursor-pointer bg-white shadow-[0_20px_40px_rgba(0,0,0,0.06)]',
        'transition-[flex-grow,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
        // Fixed identical heights for perfect horizontal baseline alignment
        'w-full h-[420px] md:h-[460px] md:flex-1',
        isHovered ? 'md:flex-[3]' : 'md:flex-[1]'
      )}
    >
      {/* 1. Full-size Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="w-full h-full"
          style={{ willChange: 'transform' }}
          initial={false}
          animate={shouldReduceMotion ? {} : { scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <ImageWithSkeleton
            src={city.image}
            alt={city.name}
            loading="lazy"
            className="w-full h-full object-cover opacity-100"
          />
        </motion.div>
      </div>

      {/* 2. Dark Gradient Overlay for text legibility */}
      <div
        className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-95"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.18) 35%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.92) 100%)'
        }}
      />

      {/* Top Bar Badges */}
      <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
          className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-xs font-bold text-[#F5A623] whitespace-nowrap shadow-md font-sans"
        >
          <span className="flex">
            <TrendingUp className="w-3.5 h-3.5" />
          </span>
          <GrowthBadge growth={city.growth} reduceMotion={shouldReduceMotion} />
        </motion.div>
        <div className="flex items-center gap-1.5 text-white text-xs font-semibold whitespace-nowrap bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 font-sans">
          <Building className="w-3.5 h-3.5 text-[#F5A623]" />
          <span className={cn('transition-opacity duration-300', !isHovered && 'md:opacity-0')}>
            {city.listings}
          </span>
        </div>
      </div>

      {/* 3. Bottom Content Container */}
      <div className="absolute bottom-[28px] left-[24px] right-[24px] z-20 flex flex-col items-center text-center">
        {/* City Name */}
        <h3 className="text-xl sm:text-2xl md:text-[24px] lg:text-[26px] font-bold text-white font-sans tracking-tight leading-none whitespace-nowrap group-hover:text-[#F5A623] transition-colors duration-300 text-center w-full">
          {city.name}
        </h3>

        {/* Subtitle / Description reveal on hover */}
        <div className="overflow-hidden w-full">
          <p
            className={cn(
              'text-[14px] text-stone-200 font-medium font-sans max-w-[90%] mx-auto text-center line-clamp-1',
              'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
              !isHovered ? 'md:max-h-0 md:opacity-0 md:mt-0' : 'md:max-h-12 md:opacity-100 md:mt-2'
            )}
          >
            {city.listings} • {city.desc}
          </p>
        </div>

        {/* CTA Explore Trigger */}
        <div
          className={cn(
            'flex items-center justify-center gap-1.5 text-[11px] text-[#F5A623] font-bold tracking-wider uppercase font-sans',
            'transition-all duration-300 ease-in-out',
            !isHovered ? 'opacity-0 max-h-0 overflow-hidden mt-0' : 'opacity-100 max-h-8 mt-2.5'
          )}
        >
          <span className="whitespace-nowrap">EXPLORE OUR PROPERTIES</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </motion.div>
  );
};

const InvestmentLocations = () => {
  const cities = [
    {
      name: 'Chennai',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=500&q=75',
      growth: '+12.4% YoY',
      listings: '42 Active Estates',
      desc: 'High-end ECR beach estates and OMR luxury high-rises.'
    },
    {
      name: 'Coimbatore',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=500&q=75',
      growth: '+9.8% YoY',
      listings: '18 Active Estates',
      desc: 'Exclusive luxury bungalows in RS Puram and Race Course.'
    },
    {
      name: 'Madurai',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=500&q=75',
      growth: '+8.2% YoY',
      listings: '12 Active Estates',
      desc: 'Heritage properties and gated villa communities.'
    },
    {
      name: 'Bangalore',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=500&q=75',
      growth: '+14.2% YoY',
      listings: '56 Active Estates',
      desc: 'High-capital sky penthouses in Indiranagar and Koramangala.'
    },
    {
      name: 'Hyderabad',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=500&q=75',
      growth: '+11.5% YoY',
      listings: '38 Active Estates',
      desc: 'Ultra-luxury modern villas in Jubilee Hills and Gachibowli.'
    },
    {
      name: 'Mumbai',
      image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=500&q=75',
      growth: '+15.6% YoY',
      listings: '64 Active Estates',
      desc: 'Exclusive sea-facing residences in Worli and Malabar Hill.'
    }
  ];

  const shouldReduceMotion = useReducedMotion();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="py-24 md:py-28 lg:py-32 bg-[#F4F1EA] relative border-t border-[#E8E4DA]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs uppercase tracking-[0.25em] text-[#F5A623] font-bold inline-block font-sans"
            >
              PRIME TARGETS
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-5xl font-bold text-[#1A1A1A] leading-tight font-sans tracking-tight"
            >
              High-Growth <br />
              <span className="font-normal text-[#8A8A85]">Investment Locations</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#8A8A85] font-normal text-sm md:text-base max-w-md leading-relaxed font-sans"
          >
            We target micro-markets across metropolitan hubs showcasing premium capital appreciation, infrastructural backbones, and solid developer pipelines.
          </motion.p>
        </div>

        {/* City Cards — stacked column on mobile, expandable flex-row gallery on desktop */}
        <div
          className="flex flex-col gap-6 md:flex-row md:gap-4 md:h-[460px]"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {cities.map((city, idx) => (
            <CityCard
              key={city.name}
              city={city}
              index={idx}
              shouldReduceMotion={shouldReduceMotion}
              isHovered={hoveredIndex === idx}
              onHover={() => setHoveredIndex(idx)}
              onLeave={() => { }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InvestmentLocations;
