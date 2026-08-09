import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion, useInView, animate } from 'framer-motion';
import { Layers, Home, Building2, Landmark, Tent, Sparkles, ArrowRight } from 'lucide-react';
import ImageWithSkeleton from '../components/ImageWithSkeleton';

const CountBadge = ({ count, reduceMotion }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const match = count.match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : count;

  useEffect(() => {
    if (!ref.current || target === null) return;
    if (!isInView || reduceMotion) {
      ref.current.textContent = `${target}${suffix}`;
      return;
    }
    const controls = animate(0, target, {
      duration: 1.0,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) {
          ref.current.textContent = `${Math.round(v)}${suffix}`;
        }
      },
    });
    return () => controls.stop();
  }, [isInView, reduceMotion, target, suffix]);

  return (
    <span ref={ref} className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#5D6472] tabular-nums">
      {count}
    </span>
  );
};

const Categories = () => {
  const navigate = useNavigate();
  const categories = [
    {
      title: 'Premium Plots',
      desc: 'Exclusive gated enclaves in fast-appreciating luxury zones.',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      icon: Tent,
      count: '42 listings',
      link: '/premium-plots'
    },
    {
      title: 'Architectural Villas',
      desc: 'Custom-built design masterpieces featuring infinity pools.',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
      icon: Home,
      count: '18 listings',
      link: '/architectural-villas'
    },
    {
      title: 'Sky Apartments',
      desc: 'Luxury penthouses with full-skyline glass and automation.',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      icon: Building2,
      count: '29 listings',
      link: '/sky-apartments'
    },
    {
      title: 'Commercial Assets',
      desc: 'High-yield corporate offices and upscale retail spaces.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      icon: Landmark,
      count: '12 listings',
      link: '/commercial-assets'
    },
    {
      title: 'Luxury Farm Lands',
      desc: 'Sprawling organic farms and private countryside retreats.',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      icon: Layers,
      count: '23 listings',
      link: '/luxury-farm-lands'
    },
    {
      title: 'Signature Collection',
      desc: 'Ultra-exclusive private islands and historic luxury estates.',
      image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80',
      icon: Sparkles,
      count: '8 listings',
      link: '/signature-collection'
    }
  ];

  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
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
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    hover: {
      y: shouldReduceMotion ? 0 : -6,
      borderColor: "#CFB6A8",
      boxShadow: "0 20px 40px rgba(54, 60, 70, 0.08)",
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 1, scale: 1 },
    visible: { opacity: 1, scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const titleVariants = {
    default: { color: "#363C46" },
    hover: {
      color: "#CFB6A8",
      transition: { duration: 0.3 }
    }
  };

  const descVariants = {
    default: { color: "#5D6472" },
    hover: {
      color: "#363C46",
      transition: { duration: 0.3 }
    }
  };

  const iconVariants = {
    default: { backgroundColor: "rgba(207, 182, 168, 0.15)", color: "#CFB6A8", scale: 1, rotate: 0 },
    hover: {
      scale: 1.08,
      rotate: -6,
      backgroundColor: "#CFB6A8",
      color: "#ffffff",
      transition: {
        duration: 0.35,
        ease: "easeOut"
      }
    }
  };

  const arrowVariants = {
    default: { x: 0 },
    hover: {
      x: 6,
      transition: { duration: 0.25, ease: "easeOut" }
    }
  };

  return (
    <section className="pt-12 md:pt-14 lg:pt-16 pb-24 md:pb-28 lg:pb-32 bg-[#E0EEE9] relative border-t border-[rgba(93,100,114,0.15)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs uppercase tracking-[0.25em] text-[#CFB6A8] font-bold inline-block font-sans"
            >
              COLLECTION SPECTRUM
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-5xl font-medium text-[#363C46] leading-tight tracking-tight"
              style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
            >
              Curated Asset <br />
              <span className="font-normal text-[#5D6472]">Portfolios</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#5D6472] font-normal text-sm md:text-base max-w-md leading-relaxed font-sans"
          >
            Explore diverse real estate categories tailored for private ownership, long-term capital preservation, and institutional yields.
          </motion.p>
        </div>

        {/* Grid of Categories */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.title}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, margin: '-40px' }}
                onClick={() => navigate(cat.link)}
                className="group relative flex flex-col-reverse md:flex-row bg-white border border-[rgba(93,100,114,0.15)] hover:border-[#CFB6A8] rounded-xl overflow-hidden shadow-[0_12px_32px_rgba(54,60,70,0.06)] cursor-pointer h-full transition-all duration-300"
              >
                {/* Left Content Column */}
                <div className="p-6 md:p-8 flex flex-col justify-between flex-grow w-full md:w-[65%] group-hover:md:w-[58%] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] z-20">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <motion.div
                        variants={iconVariants}
                        initial="default"
                        className="p-3.5 rounded-lg flex items-center justify-center shadow-xs"
                      >
                        <Icon className="w-5 h-5 stroke-[2]" />
                      </motion.div>
                      <CountBadge count={cat.count} reduceMotion={shouldReduceMotion} />
                    </div>

                    <div className="space-y-2">
                      <motion.h3
                        variants={titleVariants}
                        initial="default"
                        className="text-xl font-bold tracking-tight text-[#363C46]"
                        style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
                      >
                        {cat.title}
                      </motion.h3>
                      <motion.p
                        variants={descVariants}
                        initial="default"
                        className="text-xs leading-relaxed font-normal font-sans text-[#5D6472] max-w-[95%]"
                      >
                        {cat.desc}
                      </motion.p>
                    </div>
                  </div>

                  {/* CTA link with Dark Vanilla line animation */}
                  <div className="pt-4 flex items-center gap-1.5 text-xs text-[#CFB6A8] font-bold tracking-wider uppercase font-sans w-fit relative">
                    <span className="relative">
                      DISCOVER
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#CFB6A8] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    </span>
                    <motion.div
                      variants={arrowVariants}
                      initial="default"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </div>

                {/* Right Image Panel */}
                <div className="relative overflow-hidden w-full h-[180px] md:h-auto md:w-[35%] group-hover:md:w-[42%] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] m-4 md:m-3 md:ml-0 rounded-lg flex-shrink-0 z-10 bg-[#363C46]">
                  <motion.div
                    variants={imageVariants}
                    className="w-full h-full relative"
                  >
                    <ImageWithSkeleton
                      variants={imageVariants}
                      loading="lazy"
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[#363C46]/20 group-hover:bg-[#363C46]/10 transition-all duration-500 z-10 pointer-events-none" />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
