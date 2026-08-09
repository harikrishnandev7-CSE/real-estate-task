import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Landmark, Users, TrendingUp, ShieldCheck, Palette, FileText,
  Building, Compass, ArrowRight, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const AUTOPLAY_MS = 4200;
const VISIBLE_RADIUS = 2;
const STEP_X = 300;
const STEP_Z = -260;
const STEP_ROTATE = 38;
const SPRING = { type: 'spring', stiffness: 260, damping: 30, mass: 0.9 };

function circularOffset(index, active, length) {
  let diff = index - active;
  if (diff > length / 2) diff -= length;
  if (diff < -length / 2) diff += length;
  return diff;
}

const CarouselCard = ({ service, offset, isActive, onSelect, shouldReduceMotion }) => {
  const Icon = service.icon;
  const abs = Math.abs(offset);
  const hidden = abs > VISIBLE_RADIUS;

  const target = shouldReduceMotion
    ? { x: offset * 40, y: 0, z: 0, rotateY: 0, scale: isActive ? 1 : 0.9, opacity: hidden ? 0 : 1 }
    : {
      x: offset * STEP_X,
      z: abs === 0 ? 40 : offset === 0 ? 0 : STEP_Z * abs,
      rotateY: offset * -STEP_ROTATE,
      scale: Math.max(1 - abs * 0.16, 0.55),
      opacity: hidden ? 0 : abs === 0 ? 1 : abs === 1 ? 0.75 : 0.4,
    };

  return (
    <motion.div
      onClick={() => onSelect(offset)}
      style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        width: 320,
        marginLeft: -160,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        pointerEvents: hidden ? 'none' : 'auto',
        zIndex: 20 - abs,
      }}
      animate={{
        translateX: target.x,
        translateZ: target.z,
        rotateY: target.rotateY,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={SPRING}
      whileHover={!hidden && !isActive ? { scale: target.scale * 1.04 } : {}}
      className={`group bg-white border rounded-xl overflow-hidden flex flex-col justify-between min-h-[420px] font-sans transition-all duration-300
        ${isActive ? 'border-[#CFB6A8] shadow-[0_20px_40px_rgba(54,60,70,0.12)] cursor-pointer' : 'border-[rgba(93,100,114,0.15)] shadow-[0_12px_32px_rgba(54,60,70,0.06)] cursor-pointer'}`}
    >
      {/* Image */}
      <div className="relative w-full h-[170px] overflow-hidden shrink-0">
        <img
          src={service.image}
          alt={service.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
          draggable={false}
        />
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(180deg, rgba(54,60,70,0.1), rgba(54,60,70,0.35))',
            opacity: isActive ? 0.35 : 0.55,
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#CFB6A8] origin-left transition-transform duration-500"
          style={{ transform: isActive ? 'scaleX(1)' : 'scaleX(0.3)' }}
        />
      </div>

      {/* Body */}
      <div className="relative z-10 p-6 flex flex-col justify-between flex-1 gap-5">
        <div className="space-y-3">
          <div
            className="w-11 h-11 rounded-lg flex items-center justify-center bg-[#CFB6A8] text-white shadow-xs transition-transform duration-300"
            style={{ transform: isActive ? 'scale(1)' : 'scale(0.9)' }}
          >
            <Icon className="w-5 h-5 stroke-[2]" />
          </div>
          <div className="space-y-2">
            <h3
              className="text-base font-bold text-[#363C46] tracking-tight transition-colors group-hover:text-[#CFB6A8]"
              style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
            >
              {service.title}
            </h3>
            <p className="text-[#5D6472] text-xs leading-relaxed font-normal font-sans line-clamp-3">
              {service.desc}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-bold tracking-wider uppercase font-sans mt-auto pt-2">
          <span className="text-[#5D6472] transition-colors duration-300 group-hover:text-[#363C46]">
            {isActive ? 'ENGAGE ADVISORY' : 'VIEW'}
          </span>
          <span className="text-[#5D6472] group-hover:text-[#CFB6A8] transition-colors duration-300 flex">
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const Services = () => {
  const services = [
    {
      title: 'Bespoke Home Loans',
      desc: 'Access ultra-low interest mortgage structures through our direct collaborations with premier private banking networks.',
      icon: Landmark,
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500&q=75'
    },
    {
      title: 'Property Consultation',
      desc: 'One-on-one sessions with veteran luxury advisors to map locations, developer properties, and lifestyle criteria.',
      icon: Users,
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=500&q=75'
    },
    {
      title: 'Investment Guidance',
      desc: 'In-depth capital growth modeling, cash-yield calculations, and market cycle analysis to maximize property returns.',
      icon: TrendingUp,
      image: 'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?auto=format&fit=crop&w=500&q=75'
    },
    {
      title: 'Legal Verification',
      desc: 'Complete inspection of title deeds, layout approvals, encumbrance clearances, and regulatory compliance certificates.',
      icon: ShieldCheck,
      image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=500&q=75'
    },
    {
      title: 'Documentation & Registration',
      desc: 'Comprehensive management of draft agreements, sale deed registrations, patta transfers, and tax formalities.',
      icon: FileText,
      image: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&w=500&q=75'
    },
    {
      title: 'Interior Design',
      desc: 'Collaborative consultations with award-winning luxury interior designers to custom-tailor your acquired estate.',
      icon: Palette,
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=500&q=75'
    },
    {
      title: 'Property Management',
      desc: 'Ongoing oversight of tenant relations, building systems maintenance, and financial audits for yield assets.',
      icon: Building,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=500&q=75'
    },
    {
      title: 'Site Visit Concierge',
      desc: 'Bespoke private transport and guided tours of luxury listings with dedicated estate specialists.',
      icon: Compass,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=75'
    }
  ];

  const navigate = useNavigate();
  const { openBookModal } = useApp();
  const shouldReduceMotion = useReducedMotion();

  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const dragStartX = useRef(0);
  const dragging = useRef(false);
  const length = services.length;

  const goTo = useCallback((idx) => {
    setActive(((idx % length) + length) % length);
  }, [length]);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  // Autoplay
  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;
    const id = setInterval(() => setActive((a) => (a + 1) % length), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isPaused, shouldReduceMotion, length]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const handleSelect = (offset) => {
    if (offset === 0) {
      const service = services[active];
      if (service.title.includes('Legal')) {
        navigate('/services/legal-verification');
      } else if (service.title.includes('Home Loans') || service.title.includes('Financing')) {
        navigate('/services/home-financing');
      } else if (service.title.includes('Interior')) {
        navigate('/services/interior-design');
      } else if (service.title.includes('Site Visit')) {
        openBookModal();
      } else {
        navigate('/services');
      }
    } else {
      goTo(active + offset);
    }
  };

  const onPointerDown = (e) => {
    dragging.current = true;
    dragStartX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    setIsPaused(true);
  };
  const onPointerUp = (e) => {
    if (!dragging.current) return;
    dragging.current = false;
    const endX = e.clientX ?? e.changedTouches?.[0]?.clientX ?? dragStartX.current;
    const delta = endX - dragStartX.current;
    if (delta > 60) prev();
    else if (delta < -60) next();
    setTimeout(() => setIsPaused(false), 600);
  };

  return (
    <section
      className="py-24 md:py-28 lg:py-32 bg-[#E0EEE9] relative border-t border-[rgba(93,100,114,0.15)] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-[#CFB6A8] font-bold block font-sans">OUR CAPABILITIES</span>
            <h2
              className="text-3xl md:text-5xl font-medium text-[#363C46] leading-tight tracking-tight"
              style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
            >
              Comprehensive Real <br />
              <span className="font-normal text-[#5D6472]">Estate Services</span>
            </h2>
          </div>
          <p className="text-[#5D6472] font-normal text-sm md:text-base max-w-md leading-relaxed font-sans">
            From financial structuring and architectural customization to rigorous legal vetting, we streamline every facet of premium acquisitions.
          </p>
        </div>

        {/* 3D Carousel */}
        <div
          className="relative h-[460px] select-none"
          style={{ perspective: '1800px' }}
          onMouseDown={onPointerDown}
          onMouseUp={onPointerUp}
          onTouchStart={onPointerDown}
          onTouchEnd={onPointerUp}
        >
          <div
            className="relative w-full h-full"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {services.map((service, idx) => {
              const offset = circularOffset(idx, active, length);
              return (
                <CarouselCard
                  key={service.title}
                  service={service}
                  offset={offset}
                  isActive={offset === 0}
                  onSelect={handleSelect}
                  shouldReduceMotion={shouldReduceMotion}
                />
              );
            })}
          </div>

          {/* Arrow controls */}
          <button
            aria-label="Previous service"
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white border border-[rgba(93,100,114,0.15)] flex items-center justify-center text-[#363C46] hover:border-[#CFB6A8] hover:text-[#CFB6A8] transition-colors shadow-xs"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            aria-label="Next service"
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white border border-[rgba(93,100,114,0.15)] flex items-center justify-center text-[#363C46] hover:border-[#CFB6A8] hover:text-[#CFB6A8] transition-colors shadow-xs"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {services.map((service, idx) => (
            <button
              key={service.title}
              aria-label={`Go to ${service.title}`}
              onClick={() => goTo(idx)}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: idx === active ? 28 : 8,
                backgroundColor: idx === active ? '#CFB6A8' : 'rgba(93,100,114,0.25)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
