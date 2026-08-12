import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const FeaturedProperties = () => {
  const navigate = useNavigate();
  const { properties } = useApp();
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
      y: shouldReduceMotion ? 0 : 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section className="py-24 md:py-28 lg:py-32 bg-[#F7F6F3] relative border-t border-[rgba(22,22,26,0.08)] font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="eyebrow"
            >
              PREMIER DEVELOPMENTS
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-5xl font-medium text-[#16161a] leading-tight tracking-tight"
              style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
            >
              Featured Luxury <br />
              <span className="font-normal text-[#4a4a4f]">Residences</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#4a4a4f] font-normal text-sm md:text-base max-w-md leading-relaxed"
          >
            A handpicked curation of luxury architecture, combining premier locations with masterfully crafted interiors and landscape designs.
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
            />
          ))}
        </motion.div>

        {/* View All Action */}
        <div className="mt-16 text-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/buy')}
            className="px-8 py-3.5 bg-[#16161a] hover:bg-[#A98A5B] text-white font-semibold text-xs uppercase tracking-wider rounded-full shadow-xs inline-flex items-center gap-3 cursor-pointer transition-all font-sans"
          >
            <span>VIEW ALL RESIDENCES</span>
            <ArrowRight className="w-4 h-4 text-[#A98A5B]" />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

const PropertyCard = ({ prop, cardVariants }) => {
  const navigate = useNavigate();
  const { wishlist, addToWishlist, openBookModal } = useApp();

  const propId = prop.id || prop._id;
  const propImg = prop.image || prop.imageUrl || (Array.isArray(prop.galleryUrls) && prop.galleryUrls[0]) || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

  const isLiked = Array.isArray(wishlist) && wishlist.some(item => item && ((item.id || item._id) === propId || item === propId));

  const [imgLoaded, setImgLoaded] = useState(false);

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
      onClick={handleCardClick}
      className="group relative flex flex-col bg-white border border-[rgba(201,169,110,0.30)] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] cursor-pointer transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(201,169,110,0.22)] hover:border-[#C9A96E]"
    >
      {/* Photo (Edge-to-Edge) with High-Visibility Rendering */}
      <div className="relative h-[290px] overflow-hidden bg-[#141416]">
        <img
          src={propImg}
          alt={prop.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />

        {/* Gradient Overlay for luxury depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/60 via-transparent to-transparent opacity-80 z-10 pointer-events-none" />

        {/* Gold Tag */}
        {prop.tag && (
          <span className="absolute top-4 left-4 z-20 px-3 py-1 bg-[#0B0B0B]/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-[#C9A96E] rounded-md border border-[rgba(201,169,110,0.4)] shadow-sm">
            {prop.tag}
          </span>
        )}

        {/* Wishlist Heart */}
        <button
          onClick={handleHeartClick}
          aria-label={isLiked ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/95 hover:bg-white text-[#0B0B0B] transition-all duration-300 cursor-pointer shadow-md hover:scale-110"
        >
          <Heart
            className="w-4 h-4 transition-colors"
            style={{
              fill: isLiked ? '#C9A96E' : 'transparent',
              color: isLiked ? '#C9A96E' : '#0B0B0B'
            }}
          />
        </button>
      </div>

      {/* Caption Block */}
      <div className="p-6 flex-1 flex flex-col justify-between font-sans bg-white">
        <div className="space-y-2">
          <span className="eyebrow-accent block text-[10px]">
            {prop.location}
          </span>

          {/* Title — Playfair Display Serif */}
          <h3
            className="text-xl font-bold text-[#0B0B0B] tracking-tight leading-snug group-hover:text-[#C6A66B] transition-colors"
            style={{ fontFamily: "'Playfair Display', 'Fraunces', serif" }}
          >
            {prop.title}
          </h3>

          {/* Price — Highlighted in Gold */}
          <p className="text-2xl font-extrabold text-[#C6A66B] tracking-tight pt-1 font-sans">
            {prop.price || prop.priceDisplay}
          </p>
        </div>

        {/* Specs Row & CTA Link */}
        <div className="pt-4 mt-4 border-t border-[rgba(198,166,107,0.15)] space-y-3">
          <div className="flex items-center gap-2 text-xs text-[#6B6B6B] font-medium">
            <span>{prop.beds > 0 ? `${prop.beds} Beds` : 'Commercial'}</span>
            <span>·</span>
            <span>{prop.baths} Baths</span>
            <span>·</span>
            <span>{prop.area}</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] uppercase tracking-[0.18em] font-bold text-[#0B0B0B] group-hover:text-[#C6A66B] transition-colors">
              Explore Property →
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openBookModal(prop.title);
              }}
              className="text-[11px] font-bold uppercase tracking-wider text-[#C6A66B] hover:text-[#0B0B0B] transition-colors"
            >
              Book Visit
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedProperties;
