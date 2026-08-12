import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Maximize2, BedDouble, Sofa, ChefHat, ShowerHead, Building2, Eye, Grid, Sun } from 'lucide-react';
import ImageWithSkeleton from '../ImageWithSkeleton';

const ROOM_CONFIG = {
  entrance:  { label: 'Entrance & Foyer',     Icon: Building2,  order: 1 },
  hall:      { label: 'Living Hall',          Icon: Sofa,       order: 2 },
  kitchen:   { label: 'Gourmet Kitchen',      Icon: ChefHat,    order: 3 },
  bedroom:   { label: 'Master Bedrooms',     Icon: BedDouble,  order: 4 },
  bedrooms:  { label: 'Master Bedrooms',     Icon: BedDouble,  order: 4 },
  bathroom:  { label: 'Luxury Bathrooms',     Icon: ShowerHead, order: 5 },
  bathrooms: { label: 'Luxury Bathrooms',     Icon: ShowerHead, order: 5 },
  terrace:   { label: 'Private Terrace & Rooftop', Icon: Sun,    order: 6 },
};

const Lightbox = ({ images, startIndex, onClose }) => {
  const [idx, setIdx] = useState(startIndex);

  const handlePrev = (e) => { e?.stopPropagation(); setIdx((p) => (p - 1 + images.length) % images.length); };
  const handleNext = (e) => { e?.stopPropagation(); setIdx((p) => (p + 1) % images.length); };

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [images.length, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-[#0E0E10]/95 backdrop-blur-md flex flex-col items-center justify-between p-6 font-sans"
      onClick={onClose}
    >
      <div className="w-full max-w-7xl flex justify-between items-center z-10" onClick={(e) => e.stopPropagation()}>
        <span className="text-xs font-bold text-[#C9A96E] uppercase tracking-widest">
          ROOM WALKTHROUGH · {idx + 1} of {images.length}
        </span>
        <button
          onClick={onClose}
          className="p-3 rounded-full bg-white/10 hover:bg-[#C9A96E] text-white hover:text-[#0B0B0B] transition-all cursor-pointer shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="w-full max-w-5xl my-auto px-4 sm:px-12 flex items-center justify-center relative" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.img
            key={idx}
            src={images[idx]}
            alt="Room view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl border border-[rgba(201,169,110,0.30)]"
          />
        </AnimatePresence>

        {images.length > 1 && (
          <div className="absolute inset-x-0 flex justify-between pointer-events-none px-2 sm:px-4">
            <button onClick={handlePrev} className="p-3.5 rounded-full bg-[#0B0B0B]/80 hover:bg-[#C9A96E] text-white hover:text-[#0B0B0B] transition-all pointer-events-auto cursor-pointer border border-[rgba(201,169,110,0.30)]">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={handleNext} className="p-3.5 rounded-full bg-[#0B0B0B]/80 hover:bg-[#C9A96E] text-white hover:text-[#0B0B0B] transition-all pointer-events-auto cursor-pointer border border-[rgba(201,169,110,0.30)]">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      <div className="w-full max-w-2xl flex gap-3 justify-center z-10 custom-scrollbar" onClick={(e) => e.stopPropagation()}>
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`w-14 h-11 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
              idx === i ? 'border-[#C9A96E] scale-105 shadow-md' : 'border-transparent opacity-50 hover:opacity-100'
            }`}
          >
            <img src={img} alt="thumb" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </motion.div>
  );
};

const RoomSection = ({ roomType, images = [] }) => {
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const cfg = ROOM_CONFIG[roomType] || {
    label: roomType.charAt(0).toUpperCase() + roomType.slice(1),
    Icon: Building2,
  };
  const { label, Icon } = cfg;

  if (!images || images.length === 0) return null;

  // Responsive Grid System:
  // 1 image = 100% full width hero card
  // 2 images = 50% / 50% 2-column grid
  // 3+ images = 3-column responsive grid
  const gridClasses = images.length === 1
    ? "w-full"
    : images.length === 2
    ? "grid grid-cols-1 sm:grid-cols-2 gap-5"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5";

  const cardHeight = images.length === 1 ? "h-[320px] sm:h-[380px]" : "h-64 sm:h-72";

  return (
    <div className="space-y-4 font-sans w-full">
      <div className="flex items-center justify-between border-b border-[rgba(201,169,110,0.20)] pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[rgba(201,169,110,0.15)] text-[#C9A96E] flex items-center justify-center shadow-xs">
            <Icon className="w-4.5 h-4.5 text-[#C9A96E]" />
          </div>
          <h4
            className="text-xl font-bold text-[#0B0B0B] tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {label}
          </h4>
        </div>
        
        <span className="text-xs font-bold text-[#C9A96E] uppercase tracking-wider bg-[rgba(201,169,110,0.12)] px-3 py-1 rounded-md border border-[rgba(201,169,110,0.30)] shadow-xs">
          {images.length} {images.length === 1 ? 'Photo' : 'Photos'}
        </span>
      </div>

      <div className={gridClasses}>
        {images.map((imgUrl, idx) => (
          <div
            key={idx}
            onClick={() => setLightboxIdx(idx)}
            className={`group relative ${cardHeight} rounded-xl overflow-hidden bg-[#141416] border border-[rgba(201,169,110,0.30)] cursor-pointer shadow-[0_6px_20px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(201,169,110,0.22)] hover:border-[#C9A96E] transition-all duration-300`}
          >
            <ImageWithSkeleton
              src={imgUrl}
              alt={`${label} photo ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/60 via-transparent to-transparent opacity-40 group-hover:opacity-80 transition-opacity" />

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
              <span className="px-4 py-2.5 rounded-full bg-white/95 text-[#0B0B0B] text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 group-hover:scale-105 transition-transform border border-[rgba(201,169,110,0.30)]">
                <Maximize2 className="w-4 h-4 text-[#C9A96E]" />
                <span>View Full HD Photo</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox
            images={images}
            startIndex={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const RoomImagesSection = ({ rooms = {}, roomImages = [], images = {}, furnishing = 'full' }) => {
  const [activeTab, setActiveTab] = useState('all');
  const grouped = {};

  const addCat = (catKey, rawVal) => {
    if (!rawVal) return;
    if (!grouped[catKey]) grouped[catKey] = [];

    if (typeof rawVal === 'string' && rawVal.trim()) {
      if (!grouped[catKey].includes(rawVal)) grouped[catKey].push(rawVal);
    } else if (Array.isArray(rawVal)) {
      rawVal.forEach(item => {
        const url = typeof item === 'string' ? item : item?.url || item?.secure_url;
        if (url && typeof url === 'string' && !grouped[catKey].includes(url)) {
          grouped[catKey].push(url);
        }
      });
    } else if (typeof rawVal === 'object') {
      Object.values(rawVal).flat().forEach(item => {
        const url = typeof item === 'string' ? item : item?.url || item?.secure_url;
        if (url && typeof url === 'string' && !grouped[catKey].includes(url)) {
          grouped[catKey].push(url);
        }
      });
    }
  };

  if (images && typeof images === 'object') {
    addCat('entrance', images.entrance);
    addCat('hall', images.hall);
    addCat('kitchen', images.kitchen);
    addCat('bedrooms', images.bedrooms || images.bedroom);
    addCat('bathrooms', images.bathrooms || images.bathroom);
    addCat('terrace', images.terrace);
  }

  if (rooms && typeof rooms === 'object' && Object.keys(rooms).length > 0) {
    addCat('entrance', rooms.entrance);
    addCat('hall', rooms.hall);
    addCat('kitchen', rooms.kitchen);
    addCat('bedrooms', rooms.bedrooms || rooms.bedroom);
    addCat('bathrooms', rooms.bathrooms || rooms.bathroom);
    addCat('terrace', rooms.terrace);
  }

  if (Array.isArray(roomImages) && roomImages.length > 0) {
    roomImages.forEach(img => {
      const t = String(img.type || 'other').toLowerCase();
      const key = (t === 'exterior' || t === 'entrance') ? 'entrance'
        : (t === 'bedroom' || t === 'bedrooms') ? 'bedrooms'
        : (t === 'bathroom' || t === 'bathrooms') ? 'bathrooms'
        : t;
      addCat(key, img.url || img);
    });
  }

  const hasAnyUploadedImages = Object.keys(grouped).some(k => grouped[k] && grouped[k].length > 0);

  if (!hasAnyUploadedImages) {
    const defaultFallbacks = {
      entrance: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      hall:     'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      kitchen:  'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
      bedrooms: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
      bathrooms:'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
      terrace:  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    };
    Object.keys(defaultFallbacks).forEach(cat => {
      grouped[cat] = [defaultFallbacks[cat]];
    });
  }

  const categoriesOrder = ['entrance', 'hall', 'kitchen', 'bedrooms', 'bathrooms', 'terrace'];
  const sortedTypes = categoriesOrder.filter(cat => grouped[cat] && grouped[cat].length > 0);

  const displayTypes = activeTab === 'all'
    ? sortedTypes
    : sortedTypes.filter(type => type === activeTab);

  return (
    <div className="space-y-8 border-t border-[rgba(201,169,110,0.20)] pt-10 font-sans w-full">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#C9A96E]">
            INTERIOR ARCHITECTURAL WALKTHROUGH
          </span>
          <h3
            className="text-2xl sm:text-3xl font-bold text-[#0B0B0B] tracking-tight leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Room-by-Room Gallery
          </h3>
          <p className="text-xs font-semibold text-[#555555]">Exploration of private quarters, living spaces, and luxury finishes</p>
        </div>
      </div>

      {/* Category Tab Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[#C9A96E] text-[#0B0B0B] shadow-sm font-extrabold'
              : 'bg-white border border-[rgba(22,22,26,0.12)] text-[#555555] hover:text-[#0B0B0B] hover:border-[#C9A96E]'
          }`}
        >
          All Quarters
        </button>
        {sortedTypes.map((type) => {
          const cfg = ROOM_CONFIG[type] || { label: type };
          return (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === type
                  ? 'bg-[#C9A96E] text-[#0B0B0B] shadow-sm font-extrabold'
                  : 'bg-white border border-[rgba(22,22,26,0.12)] text-[#555555] hover:text-[#0B0B0B] hover:border-[#C9A96E]'
              }`}
            >
              {cfg.label} ({grouped[type].length})
            </button>
          );
        })}
      </div>

      {/* Full-Width Room Sections */}
      <div className="space-y-10 w-full">
        {displayTypes.map(type => (
          <RoomSection key={type} roomType={type} images={grouped[type]} />
        ))}
      </div>
    </div>
  );
};

export default RoomImagesSection;
