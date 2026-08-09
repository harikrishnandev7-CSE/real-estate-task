import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion, useInView, useMotionValue, animate } from 'framer-motion';
import { MapPin, BedDouble, Bath, Square, Heart, ArrowRight, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';

const FeaturedProperties = () => {
  const navigate = useNavigate();
  const { properties } = useApp();

  // Pick 3 featured properties
  const featuredList = properties.slice(0, 3);

  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 25,
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
      y: shouldReduceMotion ? 0 : -8,
      borderColor: "#CFB6A8",
      boxShadow: "0 20px 40px rgba(54, 60, 70, 0.1)",
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const badgeVariants = {
    hidden: { scale: 1 },
    visible: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const ctaTextVariants = {
    hidden: { color: "#5D6472" },
    visible: { color: "#5D6472" },
    hover: {
      color: "#363C46",
      transition: { duration: 0.3 }
    }
  };

  return (
    <section className="py-24 md:py-28 lg:py-32 bg-[#E0EEE9] relative border-t border-[rgba(93,100,114,0.15)] font-sans">
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
              PREMIER DEVELOPMENTS
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-5xl font-medium text-[#363C46] leading-tight tracking-tight"
              style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
            >
              Featured Luxury <br />
              <span className="font-normal text-[#5D6472]">Residences</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#5D6472] font-normal text-sm md:text-base max-w-md leading-relaxed font-sans"
          >
            A handpicked curation of luxury architecture, combining premium locations with masterfully crafted interiors and landscape designs.
          </motion.p>
        </div>

        {/* Properties Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuredList.map((prop, idx) => (
            <PropertyCard
              key={prop.id || prop._id || `prop-${idx}`}
              prop={prop}
              cardVariants={cardVariants}
              badgeVariants={badgeVariants}
              ctaTextVariants={ctaTextVariants}
              reduceMotion={shouldReduceMotion}
            />
          ))}
        </motion.div>

        {/* View All Properties Action */}
        <div className="mt-16 text-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/buy')}
            className="px-8 py-4 bg-[#363C46] hover:bg-[#1A1A1A] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm inline-flex items-center gap-3 cursor-pointer transition-all font-sans"
          >
            <span>VIEW ALL RESIDENCES</span>
            <ArrowRight className="w-4 h-4 text-[#CFB6A8]" />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

const PropertyCard = ({ prop, cardVariants, badgeVariants, ctaTextVariants, reduceMotion }) => {
  const navigate = useNavigate();
  const { wishlist, addToWishlist, openBookModal } = useApp();

  const propId = prop.id || prop._id;
  const propImg = prop.image || prop.imageUrl || (Array.isArray(prop.galleryUrls) && prop.galleryUrls[0]) || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

  const isLiked = Array.isArray(wishlist) && wishlist.some(item => item && ((item.id || item._id) === propId || item === propId));

  const revealRef = useRef(null);
  const isInView = useInView(revealRef, { once: true, amount: 0.15 });
  const scaleY = useMotionValue(reduceMotion ? 0 : 1);
  const [revealed, setRevealed] = useState(reduceMotion);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (reduceMotion || revealed) return;
    const failsafe = setTimeout(() => setRevealed(true), 1200);
    return () => clearTimeout(failsafe);
  }, [reduceMotion, revealed]);

  useEffect(() => {
    if (isInView) setRevealed(true);
  }, [isInView]);

  useEffect(() => {
    if (!revealed || reduceMotion) return;
    const controls = animate(scaleY, 0, { duration: 0.8, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [revealed, reduceMotion, scaleY]);

  const handleCardClick = () => {
    navigate(`/property/${propId}`);
  };

  const handleHeartClick = (e) => {
    e.stopPropagation();
    addToWishlist(prop);
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      onClick={handleCardClick}
      className="group relative flex flex-col bg-white border border-[rgba(93,100,114,0.15)] rounded-xl overflow-hidden shadow-[0_12px_32px_rgba(54,60,70,0.06)] cursor-pointer transition-all duration-300"
    >
      {/* Image Layer & Floating Badges */}
      <div ref={revealRef} className="relative h-[300px] overflow-hidden bg-[#E0EEE9]">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-[#E0EEE9] z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.6s_infinite]" />
          </div>
        )}

        <img
          src={propImg}
          alt={prop.title}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none" />

        {!reduceMotion && (
          <motion.div
            style={{ scaleY }}
            className="absolute inset-0 origin-bottom bg-[#E0EEE9] border-b-2 border-[#CFB6A8]/50 z-30 pointer-events-none"
          />
        )}

        {/* Floating Badges */}
        <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-20">
          <motion.span
            variants={badgeVariants}
            className="px-3.5 py-1.5 rounded-md bg-[#CFB6A8] text-[9px] font-bold uppercase tracking-[0.2em] text-white shadow-xs font-sans"
          >
            {prop.tag}
          </motion.span>
          <motion.button
            onClick={handleHeartClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.85 }}
            aria-pressed={isLiked}
            aria-label={isLiked ? 'Remove from wishlist' : 'Save to wishlist'}
            className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-[#363C46] hover:bg-[#CFB6A8] hover:text-white transition-colors duration-300 cursor-pointer shadow-xs"
          >
            <motion.span
              className="flex"
              animate={isLiked ? { scale: [1, 1.35, 1] } : { scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Heart
                className="w-4 h-4 stroke-[2] transition-colors duration-200"
                style={{
                  fill: isLiked ? '#CFB6A8' : 'transparent',
                  color: isLiked ? '#CFB6A8' : 'currentColor'
                }}
              />
            </motion.span>
          </motion.button>
        </div>

        {/* Floating Price */}
        <div className="absolute bottom-5 left-6 z-20">
          <p className="text-2xl font-bold text-white font-sans tracking-tight drop-shadow-xs">{prop.price}</p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between font-sans">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-[#5D6472] text-xs font-semibold mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#CFB6A8] shrink-0" />
            <span>{prop.location}</span>
          </div>

          {/* Title */}
          <h3
            className="text-xl font-bold text-[#363C46] tracking-tight mb-4 transition-colors duration-300 group-hover:text-[#CFB6A8]"
            style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
          >
            {prop.title}
          </h3>

          {/* Spec Row */}
          <div className="grid grid-cols-3 gap-2 border-t border-[rgba(93,100,114,0.15)] pt-4 pb-2 text-[11px] text-[#5D6472] font-semibold">
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-4 h-4 stroke-[2] text-[#CFB6A8]" />
              <span>{prop.beds > 0 ? `${prop.beds} BHK` : 'Commercial'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 stroke-[2] text-[#CFB6A8]" />
              <span>{prop.baths} Baths</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Square className="w-4 h-4 stroke-[2] text-[#CFB6A8]" />
              <span>{prop.area}</span>
            </div>
          </div>
        </div>

        {/* Action trigger footer */}
        <div className="mt-4 pt-4 border-t border-[rgba(93,100,114,0.15)] flex items-center justify-between gap-3">
          <motion.span
            variants={ctaTextVariants}
            className="text-[10px] uppercase tracking-[0.2em] font-bold font-sans shrink-0"
          >
            VIEW DETAILS
          </motion.span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openBookModal(prop.title);
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#363C46] hover:bg-[#CFB6A8] text-white text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0"
          >
            <Calendar className="w-3 h-3" />
            Book Visit
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedProperties;
