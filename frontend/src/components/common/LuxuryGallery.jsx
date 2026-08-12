import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, X, Grid, Eye } from 'lucide-react';
import ImageWithSkeleton from '../ImageWithSkeleton';

const LightboxModal = ({ images, initialIndex = 0, onClose }) => {
  const [idx, setIdx] = useState(initialIndex);

  const handlePrev = (e) => {
    e?.stopPropagation();
    setIdx((p) => (p - 1 + images.length) % images.length);
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setIdx((p) => (p + 1) % images.length);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-[#0E0E10]/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-8 font-sans"
      onClick={onClose}
    >
      {/* Header Bar */}
      <div className="w-full max-w-7xl flex items-center justify-between z-10" onClick={(e) => e.stopPropagation()}>
        <span className="text-xs font-bold uppercase tracking-widest text-[#C9A96E]">
          IMPERIA GALLERY · {idx + 1} of {images.length}
        </span>
        <button
          onClick={onClose}
          className="p-3 rounded-full bg-white/10 hover:bg-[#C9A96E] text-white hover:text-[#0B0B0B] transition-all cursor-pointer shadow-lg"
          aria-label="Close Lightbox"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Container */}
      <div className="w-full max-w-5xl my-auto px-4 sm:px-12 flex items-center justify-center relative" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="max-h-[75vh] w-full flex items-center justify-center overflow-hidden rounded-xl shadow-2xl border border-[rgba(201,169,110,0.30)]"
          >
            <img
              src={images[idx]}
              alt={`Gallery image ${idx + 1}`}
              className="max-h-[75vh] max-w-full object-contain bg-[#0B0B0B]"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <div className="absolute inset-x-0 flex items-center justify-between pointer-events-none px-2 sm:px-4">
            <button
              onClick={handlePrev}
              className="p-3 sm:p-4 rounded-full bg-[#0B0B0B]/80 hover:bg-[#C9A96E] text-white hover:text-[#0B0B0B] transition-all cursor-pointer pointer-events-auto shadow-xl border border-[rgba(201,169,110,0.30)]"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="p-3 sm:p-4 rounded-full bg-[#0B0B0B]/80 hover:bg-[#C9A96E] text-white hover:text-[#0B0B0B] transition-all cursor-pointer pointer-events-auto shadow-xl border border-[rgba(201,169,110,0.30)]"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      {/* Footer Thumbnails Strip */}
      <div className="w-full max-w-4xl overflow-x-auto py-2 flex gap-3 justify-center z-10 custom-scrollbar" onClick={(e) => e.stopPropagation()}>
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
              idx === i ? 'border-[#C9A96E] scale-105 shadow-md' : 'border-transparent opacity-50 hover:opacity-100'
            }`}
          >
            <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </motion.div>
  );
};

const LuxuryGallery = ({ images = [], roomImages = [], alt = "Luxury Estate" }) => {
  const [selectedRoomType, setSelectedRoomType] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const activeImages = useMemo(() => {
    if (Array.isArray(roomImages) && roomImages.length > 0) {
      if (selectedRoomType === 'all') {
        return roomImages.map(r => r.url || r);
      }
      const filtered = roomImages.filter(r => String(r.type || '').toLowerCase() === selectedRoomType.toLowerCase());
      if (filtered.length > 0) return filtered.map(r => r.url || r);
    }
    return Array.isArray(images) && images.length > 0 
      ? images 
      : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];
  }, [roomImages, images, selectedRoomType]);

  const roomTypesAvailable = useMemo(() => {
    if (!Array.isArray(roomImages) || roomImages.length === 0) return [];
    const typesSet = new Set(roomImages.map(r => String(r.type || '').toLowerCase()));
    return Array.from(typesSet);
  }, [roomImages]);

  const roomTabLabels = {
    all: 'All Views',
    bedroom: 'Bedrooms',
    hall: 'Living Hall',
    kitchen: 'Kitchen',
    bathroom: 'Bathrooms',
    exterior: 'Exterior',
    entrance: 'Entrance'
  };

  const featuredImage = activeImages[0];
  const sideThumbnails = activeImages.slice(1, 5);
  const remainingCount = activeImages.length > 5 ? activeImages.length - 4 : 0;

  return (
    <div className="space-y-5 w-full font-sans">
      {/* 1. Category Filter Pill Bar */}
      {roomTypesAvailable.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          <button
            onClick={() => setSelectedRoomType('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedRoomType === 'all'
                ? 'bg-[#C9A96E] text-[#0B0B0B] shadow-sm font-extrabold'
                : 'bg-white border border-[rgba(22,22,26,0.12)] text-[#555555] hover:text-[#0B0B0B] hover:border-[#C9A96E]'
            }`}
          >
            All Views ({activeImages.length})
          </button>
          {roomTypesAvailable.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedRoomType(t)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedRoomType === t
                  ? 'bg-[#C9A96E] text-[#0B0B0B] shadow-sm font-extrabold'
                  : 'bg-white border border-[rgba(22,22,26,0.12)] text-[#555555] hover:text-[#0B0B0B] hover:border-[#C9A96E]'
              }`}
            >
              {roomTabLabels[t] || t}
            </button>
          ))}
        </div>
      )}

      {/* 2. Premium Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
        
        {/* Large Featured Hero Image (Left, Col-Span-7) */}
        <div
          onClick={() => setLightboxIndex(0)}
          className="group relative lg:col-span-7 h-[360px] sm:h-[440px] lg:h-[510px] rounded-xl overflow-hidden bg-[#141416] border border-[rgba(201,169,110,0.30)] shadow-[0_8px_30px_rgba(0,0,0,0.08)] cursor-pointer"
        >
          <ImageWithSkeleton
            src={featuredImage}
            alt={`${alt} main view`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/60 via-transparent to-transparent opacity-80 z-10 pointer-events-none" />

          {/* Top Left Badge */}
          <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-md bg-[#0E0E10]/85 backdrop-blur-md text-[#C9A96E] text-[10px] font-extrabold uppercase tracking-widest border border-[rgba(201,169,110,0.30)] shadow-sm">
            FEATURED RESIDENCE VIEW
          </div>

          {/* Fullscreen Icon Badge */}
          <button
            aria-label="Expand photo"
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 text-[#0B0B0B] hover:bg-[#C9A96E] hover:text-[#0B0B0B] transition-all cursor-pointer shadow-md group-hover:scale-110"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* 2x2 Side Thumbnails Grid (Right, Col-Span-5) */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4 h-full">
          {sideThumbnails.map((imgUrl, i) => {
            const actualIdx = i + 1;
            const isLast = i === sideThumbnails.length - 1 && remainingCount > 0;

            return (
              <div
                key={i}
                onClick={() => setLightboxIndex(actualIdx)}
                className="group relative h-[175px] sm:h-[210px] lg:h-[247px] rounded-xl overflow-hidden bg-[#141416] border border-[rgba(201,169,110,0.30)] shadow-[0_8px_30px_rgba(0,0,0,0.06)] cursor-pointer"
              >
                <ImageWithSkeleton
                  src={imgUrl}
                  alt={`${alt} thumbnail ${actualIdx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/50 via-transparent to-transparent opacity-60 z-10 pointer-events-none" />

                {/* Overlaid Count Badge on 4th Thumbnail */}
                {isLast && (
                  <div className="absolute inset-0 z-20 bg-[#0E0E10]/80 backdrop-blur-xs flex flex-col items-center justify-center text-center p-3 text-[#F4F1EA] group-hover:bg-[#0E0E10]/90 transition-all">
                    <Grid className="w-6 h-6 text-[#C9A96E] mb-1" />
                    <span className="text-sm font-extrabold text-white uppercase tracking-wider">
                      +{remainingCount} More
                    </span>
                    <span className="text-[10px] text-[#C9A96E] uppercase font-bold tracking-widest pt-1">
                      View Gallery
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* 3. Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <LightboxModal
            images={activeImages}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LuxuryGallery;
