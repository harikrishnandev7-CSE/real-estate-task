import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import ImageWithSkeleton from '../ImageWithSkeleton';

const LuxuryGallery = ({ images = [], roomImages = [], alt = "Luxury Estate" }) => {
  const [selectedRoomType, setSelectedRoomType] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Compute active image list based on selected room tab
  const activeImages = React.useMemo(() => {
    if (Array.isArray(roomImages) && roomImages.length > 0) {
      if (selectedRoomType === 'all') {
        return roomImages.map(r => r.url || r);
      }
      const filtered = roomImages.filter(r => String(r.type || '').toLowerCase() === selectedRoomType.toLowerCase());
      if (filtered.length > 0) return filtered.map(r => r.url || r);
    }
    return Array.isArray(images) ? images : [];
  }, [roomImages, images, selectedRoomType]);

  if (!activeImages || activeImages.length === 0) return null;

  const displayImages = activeImages;

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const roomTypesAvailable = React.useMemo(() => {
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
    exterior: 'Exterior'
  };

  return (
    <div className="space-y-4 w-full">
      {/* Room Category Filter Tabs (Optional Room-Wise Display) */}
      {roomTypesAvailable.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          <button
            onClick={() => { setSelectedRoomType('all'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold font-sans uppercase tracking-wider transition-all cursor-pointer ${
              selectedRoomType === 'all'
                ? 'bg-[#1A1A1A] text-white shadow-sm'
                : 'bg-white text-[#8A8A85] border border-[#E8E4DA] hover:text-[#1A1A1A]'
            }`}
          >
            All Views ({roomImages.length})
          </button>
          {roomTypesAvailable.map((rt) => (
            <button
              key={rt}
              onClick={() => { setSelectedRoomType(rt); setCurrentIndex(0); }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold font-sans uppercase tracking-wider transition-all cursor-pointer ${
                selectedRoomType === rt
                  ? 'bg-[#F5A623] text-white shadow-sm'
                  : 'bg-white text-[#8A8A85] border border-[#E8E4DA] hover:text-[#1A1A1A]'
              }`}
            >
              {roomTabLabels[rt] || rt}
            </button>
          ))}
        </div>
      )}

      {/* Primary Display Viewport */}
      <div 
        className="relative h-[360px] md:h-[500px] rounded-3xl overflow-hidden bg-neutral-950 group cursor-zoom-in"
        onClick={() => setIsFullscreen(true)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full h-full relative"
          >
            {/* Zoom on hover styling */}
            <ImageWithSkeleton 
              src={displayImages[currentIndex % displayImages.length]} 
              alt={`${alt} - View ${currentIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Layer Overlays */}
        <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-neutral-950/15 transition-all duration-500 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent pointer-events-none z-10" />

        {/* Carousel Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-gold-500 hover:text-neutral-950 text-white transition-all opacity-0 group-hover:opacity-100 z-20 cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-gold-500 hover:text-neutral-950 text-white transition-all opacity-0 group-hover:opacity-100 z-20 cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Fullscreen Maximize Action */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFullscreen(true);
          }}
          className="absolute right-6 bottom-6 p-3 rounded-full bg-black/60 text-white hover:bg-gold-500 hover:text-neutral-950 transition-all opacity-0 group-hover:opacity-100 z-20 cursor-pointer"
          aria-label="Fullscreen Preview"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Thumbnail Nav Slider */}
      {displayImages.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
          {displayImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-[120px] h-[80px] rounded-2xl overflow-hidden shrink-0 border-2 transition-all relative bg-neutral-950 cursor-pointer ${
                currentIndex === index ? 'border-gold-500' : 'border-white/5 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* LIGHTBOX FULLSCREEN OVERLAY MODAL */}
      <AnimatePresence>
        {isFullscreen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFullscreen(false)}
              className="fixed inset-0 bg-black/95 z-[9999] cursor-zoom-out"
            />
            {/* Lightbox Wrapper */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="fixed inset-6 md:inset-12 z-[10000] flex flex-col items-center justify-center pointer-events-none"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsFullscreen(false)}
                className="absolute right-4 top-4 p-3 rounded-full bg-neutral-900/60 hover:bg-gold-500 hover:text-neutral-950 text-white pointer-events-auto transition-all cursor-pointer"
                aria-label="Close Fullscreen"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Large Image */}
              <div className="max-w-5xl max-h-[80vh] relative pointer-events-auto rounded-3xl overflow-hidden border border-white/10 select-none shadow-2xl">
                <img 
                  src={images[currentIndex]} 
                  alt={`${alt} - Fullscreen View`} 
                  className="w-full max-h-[80vh] object-contain bg-neutral-950" 
                />
                
                {/* Overlay Next/Prev */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-gold-500 hover:text-neutral-950 text-white transition-all cursor-pointer"
                      aria-label="Previous Slide"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-gold-500 hover:text-neutral-950 text-white transition-all cursor-pointer"
                      aria-label="Next Slide"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Slide Counter Info */}
              <div className="mt-6 text-xs text-neutral-400 font-sans tracking-widest font-semibold uppercase pointer-events-auto">
                VIEW {currentIndex + 1} OF {images.length}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LuxuryGallery;
