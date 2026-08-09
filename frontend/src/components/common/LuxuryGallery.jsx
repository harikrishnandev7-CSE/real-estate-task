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
      {/* Room Category Filter Tabs */}
      {roomTypesAvailable.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          <button
            onClick={() => { setSelectedRoomType('all'); setCurrentIndex(0); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-sans uppercase tracking-wider transition-all cursor-pointer ${
              selectedRoomType === 'all'
                ? 'bg-[#363C46] text-white shadow-xs'
                : 'bg-white border border-[rgba(93,100,114,0.15)] text-[#5D6472] hover:text-[#363C46]'
            }`}
          >
            All Views ({roomImages.length})
          </button>
          {roomTypesAvailable.map((t) => (
            <button
              key={t}
              onClick={() => { setSelectedRoomType(t); setCurrentIndex(0); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-sans uppercase tracking-wider transition-all cursor-pointer ${
                selectedRoomType === t
                  ? 'bg-[#363C46] text-white shadow-xs'
                  : 'bg-white border border-[rgba(93,100,114,0.15)] text-[#5D6472] hover:text-[#363C46]'
              }`}
            >
              {roomTabLabels[t] || t}
            </button>
          ))}
        </div>
      )}

      {/* Main Slideshow Container */}
      <div className="relative h-[420px] md:h-[540px] rounded-xl overflow-hidden bg-[#E0EEE9] border border-[rgba(93,100,114,0.15)] shadow-[0_12px_32px_rgba(54,60,70,0.06)] group">
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

        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#363C46]/50 via-transparent to-transparent pointer-events-none" />

        {/* Counter badge */}
        <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-md bg-[#363C46]/80 backdrop-blur-xs text-white text-xs font-bold uppercase tracking-wider">
          {currentIndex + 1} / {displayImages.length}
        </div>

        {/* Fullscreen button */}
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-md bg-white/90 hover:bg-[#CFB6A8] hover:text-white text-[#363C46] transition-colors shadow-xs cursor-pointer"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Navigation arrows */}
        {displayImages.length > 1 && (
          <div className="absolute inset-y-0 inset-x-4 flex items-center justify-between z-20 pointer-events-none">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-white/90 hover:bg-[#CFB6A8] hover:text-white text-[#363C46] transition-colors shadow-xs cursor-pointer pointer-events-auto"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-white/90 hover:bg-[#CFB6A8] hover:text-white text-[#363C46] transition-colors shadow-xs cursor-pointer pointer-events-auto"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Thumbnails row */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                currentIndex === idx ? 'border-[#CFB6A8] opacity-100 shadow-xs' : 'border-transparent opacity-60 hover:opacity-100'
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
