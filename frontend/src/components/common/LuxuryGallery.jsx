import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import ImageWithSkeleton from '../ImageWithSkeleton';

const LuxuryGallery = ({ images = [], roomImages = [], alt = "Luxury Estate" }) => {
  const [selectedRoomType, setSelectedRoomType] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
    <div className="space-y-4 w-full font-sans">
      {/* Filter Tabs */}
      {roomTypesAvailable.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          <button
            onClick={() => { setSelectedRoomType('all'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              selectedRoomType === 'all'
                ? 'bg-[#16161a] text-white shadow-xs'
                : 'bg-white border border-[rgba(22,22,26,0.10)] text-[#4a4a4f] hover:text-[#16161a]'
            }`}
          >
            All Views ({roomImages.length})
          </button>
          {roomTypesAvailable.map((t) => (
            <button
              key={t}
              onClick={() => { setSelectedRoomType(t); setCurrentIndex(0); }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                selectedRoomType === t
                  ? 'bg-[#16161a] text-white shadow-xs'
                  : 'bg-white border border-[rgba(22,22,26,0.10)] text-[#4a4a4f] hover:text-[#16161a]'
              }`}
            >
              {roomTabLabels[t] || t}
            </button>
          ))}
        </div>
      )}

      {/* Main Gallery Slideshow Container */}
      <div className="relative h-[400px] md:h-[500px] rounded-md overflow-hidden bg-[#F7F6F3] border border-[rgba(22,22,26,0.10)] shadow-[0_1px_2px_rgba(22,22,26,0.04),0_8px_24px_rgba(22,22,26,0.05)] group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
          >
            <ImageWithSkeleton
              src={displayImages[currentIndex]}
              alt={`${alt} view ${currentIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Counter Badge — Translucent Ink Pill */}
        <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-sm bg-[#16161a]/70 backdrop-blur-xs text-white text-[10px] font-semibold uppercase tracking-wider">
          {currentIndex + 1} / {displayImages.length}
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 text-[#16161a] hover:bg-[#16161a] hover:text-white transition-colors cursor-pointer shadow-xs"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Minimal White/Ink Navigation Arrows */}
        {displayImages.length > 1 && (
          <div className="absolute inset-y-0 inset-x-4 flex items-center justify-between z-20 pointer-events-none">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-full bg-white/90 text-[#16161a] hover:bg-[#16161a] hover:text-white transition-colors shadow-xs cursor-pointer pointer-events-auto"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-full bg-white/90 text-[#16161a] hover:bg-[#16161a] hover:text-white transition-colors shadow-xs cursor-pointer pointer-events-auto"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Thumbnails row */}
      {displayImages.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-2 custom-scrollbar">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-20 h-14 rounded-md overflow-hidden shrink-0 border transition-all cursor-pointer ${
                currentIndex === idx ? 'border-[#A98A5B] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt="thumb" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LuxuryGallery;
