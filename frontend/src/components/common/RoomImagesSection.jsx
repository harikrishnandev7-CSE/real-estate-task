import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, X, Maximize2,
  BedDouble, Sofa, ChefHat, ShowerHead, Building2
} from 'lucide-react';
import ImageWithSkeleton from '../ImageWithSkeleton';

// ─── Room config ──────────────────────────────────────────────────────────────
const ROOM_CONFIG = {
  entrance:  { label: 'Entrance View',       Icon: Building2,  order: 1, accent: 'bg-[#F4F1EA] border-[#E8E4DA] text-[#1A1A1A]' },
  hall:      { label: 'Living Hall',         Icon: Sofa,       order: 2, accent: 'bg-amber-50 border-amber-100 text-amber-700' },
  kitchen:   { label: 'Kitchen',             Icon: ChefHat,    order: 3, accent: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
  bedroom:   { label: 'Bedrooms',            Icon: BedDouble,  order: 4, accent: 'bg-purple-50 border-purple-100 text-purple-700' },
  bedrooms:  { label: 'Bedrooms',            Icon: BedDouble,  order: 4, accent: 'bg-purple-50 border-purple-100 text-purple-700' },
  bathroom:  { label: 'Bathrooms',           Icon: ShowerHead, order: 5, accent: 'bg-teal-50 border-teal-100 text-teal-700' },
  bathrooms: { label: 'Bathrooms',           Icon: ShowerHead, order: 5, accent: 'bg-teal-50 border-teal-100 text-teal-700' },
  terrace:   { label: 'Terrace & Balcony',    Icon: Building2,  order: 6, accent: 'bg-sky-50 border-sky-100 text-sky-700' },
};

const getRoomOrder = (type) => ROOM_CONFIG[type]?.order ?? 99;

// ─── Lightbox ─────────────────────────────────────────────────────────────────
const Lightbox = ({ images, startIndex, onClose }) => {
  const [idx, setIdx] = useState(startIndex);

  const handlePrev = (e) => { e.stopPropagation(); setIdx((p) => (p - 1 + images.length) % images.length); };
  const handleNext = (e) => { e.stopPropagation(); setIdx((p) => (p + 1) % images.length); };

  // Keyboard
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
      className="fixed inset-0 z-[999] bg-black/95 flex flex-col items-center justify-center"
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
            alt={`View ${idx + 1}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
          />
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <>
          <button onClick={handlePrev} className="absolute left-5 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 hover:bg-[#F5A623] text-white transition-all cursor-pointer">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={handleNext} className="absolute right-5 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 hover:bg-[#F5A623] text-white transition-all cursor-pointer">
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 px-6 overflow-x-auto py-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setIdx(i); }}
            className={`w-14 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
              i === idx ? 'border-[#F5A623] opacity-100' : 'border-transparent opacity-40 hover:opacity-70'
            }`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </motion.div>
  );
};

// ─── Room Section — desktop grid, mobile scroll ───────────────────────────────
const RoomSection = ({ roomType, images }) => {
  const config = ROOM_CONFIG[roomType] || { label: roomType, Icon: Building2, accent: 'bg-stone-50 border-stone-100 text-stone-700' };
  const { Icon, label, accent } = config;
  const [lightbox, setLightbox] = useState(null);
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  if (!images || images.length === 0) return null;

  // Desktop: show images in a grid (up to 3 cols). Each card fills its cell.
  // Mobile: horizontal scroll strip.

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.45 }}
      className="space-y-4"
    >
      {/* Room Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${accent} bg-opacity-80`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-base font-bold text-[#1A1A1A] font-sans leading-tight">{label}</h4>
            <p className="text-[11px] text-[#8A8A85] font-sans">{images.length} photo{images.length > 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Mobile scroll arrows */}
        {images.length > 1 && (
          <div className="flex gap-1.5 md:hidden">
            <button onClick={() => scroll(-1)} className="p-2 rounded-full bg-white border border-[#E8E4DA] hover:border-[#F5A623] hover:text-[#F5A623] text-[#8A8A85] transition-all cursor-pointer shadow-sm">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => scroll(1)} className="p-2 rounded-full bg-white border border-[#E8E4DA] hover:border-[#F5A623] hover:text-[#F5A623] text-[#8A8A85] transition-all cursor-pointer shadow-sm">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* ── DESKTOP: Responsive grid ─────────────────────────────────── */}
      <div className="hidden md:grid gap-4" style={{
        gridTemplateColumns: images.length === 1
          ? '1fr'
          : images.length === 2
          ? 'repeat(2, 1fr)'
          : 'repeat(3, 1fr)'
      }}>
        {images.map((url, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.012 }}
            onClick={() => setLightbox(i)}
            className={`group relative overflow-hidden rounded-2xl border-2 border-transparent hover:border-[#F5A623] transition-all cursor-zoom-in shadow-sm hover:shadow-lg ${
              images.length === 1 ? 'h-[320px]' : 'h-[220px] lg:h-[260px]'
            }`}
          >
            <ImageWithSkeleton
              src={url}
              alt={`${label} ${i + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Dark overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
            {/* Expand icon */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="p-1.5 rounded-full bg-black/60 text-white">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>
            </div>
            {/* Photo number */}
            {images.length > 1 && (
              <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="px-2 py-1 rounded-full bg-black/60 text-white text-[10px] font-bold font-sans">
                  {i + 1}/{images.length}
                </div>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* ── MOBILE: Horizontal scroll strip ─────────────────────────── */}
      <div ref={scrollRef} className="md:hidden flex gap-3 overflow-x-auto pb-2 scroll-smooth" style={{ scrollbarWidth: 'none' }}>
        {images.map((url, i) => (
          <button
            key={i}
            onClick={() => setLightbox(i)}
            className="group relative shrink-0 w-[260px] h-[170px] rounded-2xl overflow-hidden border-2 border-transparent hover:border-[#F5A623] transition-all cursor-zoom-in shadow-sm"
          >
            <ImageWithSkeleton
              src={url}
              alt={`${label} ${i + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="p-1.5 rounded-full bg-black/60 text-white">
                <Maximize2 className="w-3 h-3" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox images={images} startIndex={lightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Main RoomImagesSection ───────────────────────────────────────────────────
const RoomImagesSection = ({ roomImages = [], images = null, furnishing = 'full', propertyType = 'Villa' }) => {
  const furnLevel = String(furnishing || 'full').toLowerCase();
  const grouped = {};

  const extract = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val.filter(Boolean);
    if (typeof val === 'object') return Object.values(val).flat().filter(Boolean);
    if (typeof val === 'string' && val.trim()) return [val];
    return [];
  };

  if (images && typeof images === 'object' && !Array.isArray(images)) {
    const ent = extract(images.entrance);
    const hl = extract(images.hall);
    const kt = extract(images.kitchen);
    const bd = extract(images.bedrooms);
    const bt = extract(images.bathrooms);
    const tr = extract(images.terrace);

    if (ent.length > 0) grouped.entrance = ent;
    if (hl.length > 0) grouped.hall = hl;
    if (kt.length > 0) grouped.kitchen = kt;
    if (bd.length > 0) grouped.bedrooms = bd;
    if (bt.length > 0) grouped.bathrooms = bt;
    if (tr.length > 0) grouped.terrace = tr;
  } else if (Array.isArray(roomImages) && roomImages.length > 0) {
    const filtered = roomImages.filter(img => {
      const type = String(img.type || '').toLowerCase();
      if (type === 'exterior') return true;
      if (furnLevel === 'full') return img.furnished === true;
      if (furnLevel === 'none') return img.furnished === false;
      if (furnLevel === 'semi') {
        if (type === 'bedroom' || type === 'hall') return img.furnished === true;
        if (type === 'kitchen' || type === 'bathroom') return img.furnished === false;
        return true;
      }
      return true;
    });

    filtered.forEach(img => {
      const t = String(img.type || 'other').toLowerCase();
      if (t === 'exterior') return;
      if (!grouped[t]) grouped[t] = [];
      grouped[t].push(img.url || img);
    });
  }

  const sortedTypes = Object.keys(grouped).sort((a, b) => getRoomOrder(a) - getRoomOrder(b));
  if (sortedTypes.length === 0) return null;

  const furnBadge = furnLevel === 'full'
    ? { text: '✔ Fully Furnished Interior', cls: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
    : furnLevel === 'semi'
    ? { text: '⚡ Semi Furnished — Mixed Interior', cls: 'text-amber-700 bg-amber-50 border-amber-200' }
    : { text: '○ Unfurnished — Empty Rooms', cls: 'text-stone-600 bg-stone-50 border-stone-200' };

  return (
    <div className="space-y-8 border-t border-[#E8E4DA] pt-10 font-sans">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#F5A623] font-bold">Interior Tour</p>
          <h3 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Inside the Property</h3>
          <p className="text-xs text-[#8A8A85]">Room-by-room walkthrough</p>
        </div>
        <span className={`self-start sm:self-auto px-3 py-1.5 rounded-full border text-xs font-semibold font-sans ${furnBadge.cls}`}>
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
