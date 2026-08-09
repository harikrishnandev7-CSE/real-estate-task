import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, X, Maximize2,
  BedDouble, Sofa, ChefHat, ShowerHead, Building2
} from 'lucide-react';
import ImageWithSkeleton from '../ImageWithSkeleton';

const ROOM_CONFIG = {
  entrance:  { label: 'Entrance View',       Icon: Building2,  order: 1, accent: 'bg-[#E0EEE9]/50 border-[rgba(93,100,114,0.15)] text-[#363C46]' },
  hall:      { label: 'Living Hall',         Icon: Sofa,       order: 2, accent: 'bg-[rgba(207,182,168,0.15)] border-[rgba(207,182,168,0.3)] text-[#363C46]' },
  kitchen:   { label: 'Kitchen',             Icon: ChefHat,    order: 3, accent: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
  bedroom:   { label: 'Bedrooms',            Icon: BedDouble,  order: 4, accent: 'bg-purple-50 border-purple-100 text-purple-700' },
  bedrooms:  { label: 'Bedrooms',            Icon: BedDouble,  order: 4, accent: 'bg-purple-50 border-purple-100 text-purple-700' },
  bathroom:  { label: 'Bathrooms',           Icon: ShowerHead, order: 5, accent: 'bg-teal-50 border-teal-100 text-teal-700' },
  bathrooms: { label: 'Bathrooms',           Icon: ShowerHead, order: 5, accent: 'bg-teal-50 border-teal-100 text-teal-700' },
  terrace:   { label: 'Terrace & Balcony',    Icon: Building2,  order: 6, accent: 'bg-sky-50 border-sky-100 text-sky-700' },
};

const Lightbox = ({ images, startIndex, onClose }) => {
  const [idx, setIdx] = useState(startIndex);

  const handlePrev = (e) => { e.stopPropagation(); setIdx((p) => (p - 1 + images.length) % images.length); };
  const handleNext = (e) => { e.stopPropagation(); setIdx((p) => (p + 1) % images.length); };

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') setIdx(p => (p - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setIdx(p => (p + 1) % images.length);
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
      className="fixed inset-0 z-[999] bg-black/95 flex flex-col items-center justify-center font-sans"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer z-10"
      >
        <X className="w-5 h-5" />
      </button>
      <p className="absolute top-6 left-1/2 -translate-x-1/2 text-white/60 text-xs font-sans font-bold uppercase tracking-widest">
        {idx + 1} / {images.length}
      </p>

      <div className="w-full max-w-5xl px-16 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.img
            key={idx}
            src={images[idx]}
            alt="Room view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
          />
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className="absolute inset-x-6 flex justify-between pointer-events-none">
          <button onClick={handlePrev} className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white pointer-events-auto cursor-pointer">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={handleNext} className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white pointer-events-auto cursor-pointer">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </motion.div>
  );
};

const RoomSection = ({ roomType, images = [] }) => {
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const cfg = ROOM_CONFIG[roomType] || {
    label: roomType.charAt(0).toUpperCase() + roomType.slice(1),
    Icon: Building2,
    accent: 'bg-[#E0EEE9]/50 border-[rgba(93,100,114,0.15)] text-[#363C46]'
  };
  const { Icon, label, accent } = cfg;

  if (!images || images.length === 0) return null;

  return (
    <div className="space-y-4 font-sans">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg border ${accent} flex items-center justify-center shrink-0`}>
          <Icon className="w-4 h-4" />
        </div>
        <h4
          className="text-lg font-bold text-[#363C46] tracking-tight"
          style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
        >
          {label}
        </h4>
        <span className="text-xs text-[#5D6472] font-semibold">({images.length} {images.length === 1 ? 'Photo' : 'Photos'})</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((imgUrl, idx) => (
          <div
            key={idx}
            onClick={() => setLightboxIdx(idx)}
            className="group relative h-52 rounded-xl overflow-hidden bg-[#E0EEE9] border border-[rgba(93,100,114,0.15)] cursor-pointer shadow-xs"
          >
            <ImageWithSkeleton
              src={imgUrl}
              alt={`${label} photo ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-[#363C46]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="p-2.5 rounded-md bg-white/90 text-[#363C46] shadow-xs">
                <Maximize2 className="w-4 h-4" />
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

const RoomImagesSection = ({ rooms = {}, roomImages = [], furnishing = 'full', furnLevel: furnLevelProp }) => {
  const furnLevel = furnLevelProp || furnishing;
  const grouped = {};

  if (rooms && typeof rooms === 'object' && Object.keys(rooms).length > 0) {
    const ent = Array.isArray(rooms.entrance) ? rooms.entrance : rooms.entrance ? [rooms.entrance] : [];
    const hl  = Array.isArray(rooms.hall)     ? rooms.hall     : rooms.hall     ? [rooms.hall]     : [];
    const kt  = Array.isArray(rooms.kitchen)  ? rooms.kitchen  : rooms.kitchen  ? [rooms.kitchen]  : [];
    const bd  = Array.isArray(rooms.bedroom)  ? rooms.bedroom  : rooms.bedroom  ? [rooms.bedroom]  : Array.isArray(rooms.bedrooms) ? rooms.bedrooms : [];
    const bt  = Array.isArray(rooms.bathroom) ? rooms.bathroom : rooms.bathroom ? [rooms.bathroom] : Array.isArray(rooms.bathrooms) ? rooms.bathrooms : [];
    const tr  = Array.isArray(rooms.terrace)  ? rooms.terrace  : rooms.terrace  ? [rooms.terrace]  : [];

    if (ent.length > 0) grouped.entrance = ent;
    if (hl.length > 0) grouped.hall = hl;
    if (kt.length > 0) grouped.kitchen = kt;
    if (bd.length > 0) grouped.bedrooms = bd;
    if (bt.length > 0) grouped.bathrooms = bt;
    if (tr.length > 0) grouped.terrace = tr;
  }

  if (Array.isArray(roomImages) && roomImages.length > 0) {
    roomImages.forEach(img => {
      const t = String(img.type || 'other').toLowerCase();
      if (t === 'exterior') {
        if (!grouped.entrance) grouped.entrance = [];
        grouped.entrance.push(img.url || img);
        return;
      }
      const key = (t === 'bedroom' || t === 'bedrooms') ? 'bedrooms'
        : (t === 'bathroom' || t === 'bathrooms') ? 'bathrooms'
        : t;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(img.url || img);
    });
  }

  const defaultFallbacks = {
    entrance: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    hall:     'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    kitchen:  'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    bedrooms: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
    bathrooms:'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    terrace:  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
  };

  const categoriesOrder = ['entrance', 'hall', 'kitchen', 'bedrooms', 'bathrooms', 'terrace'];

  categoriesOrder.forEach(cat => {
    if (!grouped[cat] || grouped[cat].length === 0) {
      grouped[cat] = [defaultFallbacks[cat]];
    }
  });

  const sortedTypes = categoriesOrder.filter(cat => grouped[cat] && grouped[cat].length > 0);

  const furnBadge = furnLevel === 'full'
    ? { text: '✔ Fully Furnished Interior', cls: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
    : furnLevel === 'semi'
    ? { text: '⚡ Semi Furnished — Mixed Interior', cls: 'text-[#CFB6A8] bg-[rgba(207,182,168,0.12)] border-[rgba(207,182,168,0.25)]' }
    : { text: '○ Unfurnished — Empty Rooms', cls: 'text-[#5D6472] bg-stone-50 border-stone-200' };

  return (
    <div className="space-y-8 border-t border-[rgba(93,100,114,0.15)] pt-10 font-sans">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#CFB6A8] font-bold">Interior Tour</p>
          <h3
            className="text-2xl font-bold text-[#363C46] tracking-tight"
            style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
          >
            Inside the Property
          </h3>
          <p className="text-xs text-[#5D6472]">Room-by-room walkthrough</p>
        </div>
        <span className={`self-start sm:self-auto px-3 py-1.5 rounded-md border text-xs font-semibold font-sans ${furnBadge.cls}`}>
          {furnBadge.text}
        </span>
      </div>

      {/* Room Sections */}
      <div className="space-y-10">
        {sortedTypes.map(type => (
          <RoomSection key={type} roomType={type} images={grouped[type]} />
        ))}
      </div>
    </div>
  );
};

export default RoomImagesSection;
