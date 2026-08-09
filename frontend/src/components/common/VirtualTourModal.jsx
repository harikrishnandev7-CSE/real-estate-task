import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronRight, ChevronLeft, Home, BedDouble, ChefHat,
  ShowerHead, Sofa, ArrowUp, Compass, Eye, RotateCcw, ZoomIn, ZoomOut, Map
} from 'lucide-react';

// ─── Scene icon map ───────────────────────────────────────────────────────────
const SCENE_ICONS = {
  entrance: Home,
  hall:     Sofa,
  kitchen:  ChefHat,
  bedroom:  BedDouble,
  bathroom: ShowerHead,
  stairs:   ArrowUp,
};

const SCENE_COLORS = {
  entrance: 'from-amber-900/80 to-stone-900/80',
  hall:     'from-blue-900/80 to-stone-900/80',
  kitchen:  'from-emerald-900/80 to-stone-900/80',
  bedroom:  'from-purple-900/80 to-stone-900/80',
  bathroom: 'from-teal-900/80 to-stone-900/80',
  stairs:   'from-orange-900/80 to-stone-900/80',
};

// ─── Build tour scenes from property roomImages ───────────────────────────────
function buildScenesFromProperty(property, furnishing) {
  const furnLevel = String(furnishing || 'full').toLowerCase();
  const roomImages = Array.isArray(property.roomImages) ? property.roomImages : [];

  const getImg = (type, wantFurnished) => {
    const matches = roomImages.filter(r =>
      String(r.type || '').toLowerCase() === type && r.furnished === wantFurnished
    );
    return matches[0]?.url || null;
  };

  // Decide what furnished means per room given furnishing level
  const isFurnished = (type) => {
    if (furnLevel === 'full') return true;
    if (furnLevel === 'none') return false;
    // semi: bedroom + hall → furnished; kitchen + bathroom → empty
    if (furnLevel === 'semi') return (type === 'bedroom' || type === 'hall');
    return true;
  };

  const exteriorUrls = property.gallery?.length > 0
    ? property.gallery
    : [property.image || property.imageUrl].filter(Boolean);

  const scenes = [];

  // ── Entrance ──
  scenes.push({
    id: 'entrance',
    name: 'Entrance',
    type: 'entrance',
    floor: 0,
    image: exteriorUrls[1] || exteriorUrls[0],
    hotspots: [{ id: 'h1', label: 'Enter Hall', targetSceneId: 'hall', x: 52, y: 55 }]
  });

  // ── Hall / Living ──
  const hallFurnished = isFurnished('hall');
  const hallImg = getImg('hall', hallFurnished);
  if (hallImg) {
    scenes.push({
      id: 'hall',
      name: 'Living Hall',
      type: 'hall',
      floor: 0,
      image: hallImg,
      hotspots: [
        { id: 'h2', label: 'Kitchen', targetSceneId: 'kitchen', x: 22, y: 55 },
        { id: 'h3', label: 'Bedroom', targetSceneId: 'bedroom', x: 75, y: 55 },
        { id: 'h4', label: 'Back to Entrance', targetSceneId: 'entrance', x: 50, y: 78 },
      ]
    });
  }

  // ── Kitchen ──
  const kitFurnished = isFurnished('kitchen');
  const kitImg = getImg('kitchen', kitFurnished);
  if (kitImg) {
    scenes.push({
      id: 'kitchen',
      name: 'Kitchen',
      type: 'kitchen',
      floor: 0,
      image: kitImg,
      hotspots: [
        { id: 'h5', label: 'Back to Hall', targetSceneId: 'hall', x: 50, y: 72 },
      ]
    });
  }

  // ── Bedroom ──
  const bedFurnished = isFurnished('bedroom');
  const bedImg = getImg('bedroom', bedFurnished);
  if (bedImg) {
    scenes.push({
      id: 'bedroom',
      name: 'Bedroom',
      type: 'bedroom',
      floor: 1,
      image: bedImg,
      hotspots: [
        { id: 'h6', label: 'Bathroom', targetSceneId: 'bathroom', x: 78, y: 57 },
        { id: 'h7', label: 'Back to Hall', targetSceneId: 'hall', x: 30, y: 72 },
      ]
    });
  }

  // ── Bathroom ──
  const bathFurnished = isFurnished('bathroom');
  const bathImg = getImg('bathroom', bathFurnished);
  if (bathImg) {
    scenes.push({
      id: 'bathroom',
      name: 'Bathroom',
      type: 'bathroom',
      floor: 1,
      image: bathImg,
      hotspots: [
        { id: 'h8', label: 'Back to Bedroom', targetSceneId: 'bedroom', x: 50, y: 73 },
      ]
    });
  }

  return scenes;
}

// ─── Hotspot component ────────────────────────────────────────────────────────
const Hotspot = ({ hotspot, onNavigate }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 400, damping: 15 }}
      onClick={() => onNavigate(hotspot.targetSceneId)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="absolute z-30 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
      aria-label={`Go to ${hotspot.label}`}
    >
      {/* Pulsing ring */}
      <span className="absolute inset-0 rounded-full bg-white/30 animate-ping" style={{ animationDuration: '2s' }} />
      
      {/* Button core */}
      <motion.div
        animate={{ scale: hovered ? 1.15 : 1 }}
        className="relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 shadow-xl"
      >
        <div className="w-7 h-7 rounded-full bg-[#F5A623] flex items-center justify-center shrink-0">
          <ChevronRight className="w-4 h-4 text-white" />
        </div>
        <span className="text-white text-xs font-bold tracking-wide font-sans whitespace-nowrap pr-1">
          {hotspot.label}
        </span>
      </motion.div>
    </motion.button>
  );
};

// ─── Floor Plan Mini Map ──────────────────────────────────────────────────────
const FloorPlan = ({ scenes, currentScene, onNavigate }) => {
  const floorScenes = scenes.filter(s => s.id !== 'entrance');
  return (
    <div className="flex flex-col gap-1.5 p-2 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
      {floorScenes.map(scene => {
        const Icon = SCENE_ICONS[scene.type] || Compass;
        const active = scene.id === currentScene;
        return (
          <button
            key={scene.id}
            onClick={() => onNavigate(scene.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer text-xs font-sans font-bold ${
              active
                ? 'bg-[#F5A623] text-white shadow-lg'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            }`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span>{scene.name}</span>
            {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
          </button>
        );
      })}
    </div>
  );
};

// ─── Main VirtualTourModal ────────────────────────────────────────────────────
const VirtualTourModal = ({ property, furnishing, onClose }) => {
  const scenes = buildScenesFromProperty(property, furnishing);
  
  const [currentSceneId, setCurrentSceneId] = useState(scenes[0]?.id || 'entrance');
  const [panX, setPanX] = useState(50);  // 0-100, center=50
  const [panY, setPanY] = useState(50);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [showMap, setShowMap] = useState(true);

  const containerRef = useRef(null);
  const dragStart = useRef(null);
  const hintTimer = useRef(null);

  const currentScene = scenes.find(s => s.id === currentSceneId) || scenes[0];

  // Dismiss drag hint after first drag or 4s
  useEffect(() => {
    hintTimer.current = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(hintTimer.current);
  }, []);

  // Reset pan when scene changes
  useEffect(() => {
    setPanX(50);
    setPanY(50);
    setZoom(1);
  }, [currentSceneId]);

  // Navigate to another scene with cinematic transition
  const navigateTo = useCallback((sceneId) => {
    if (transitioning || sceneId === currentSceneId) return;
    if (!scenes.find(s => s.id === sceneId)) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrentSceneId(sceneId);
      setTransitioning(false);
    }, 450);
  }, [transitioning, currentSceneId, scenes]);

  // ── Drag Controls ──────────────────────────────────────────────────────────
  const handleMouseDown = (e) => {
    if (e.target.closest('button')) return;
    setIsDragging(true);
    setShowHint(false);
    clearTimeout(hintTimer.current);
    dragStart.current = { x: e.clientX, y: e.clientY, panX, panY };
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !dragStart.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    const newPanX = Math.min(100, Math.max(0, dragStart.current.panX - (dx / rect.width) * 60));
    const newPanY = Math.min(70, Math.max(30, dragStart.current.panY - (dy / rect.height) * 30));
    setPanX(newPanX);
    setPanY(newPanY);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.userSelect = '';
  }, []);

  // Touch support
  const handleTouchStart = (e) => {
    if (e.target.closest('button')) return;
    const t = e.touches[0];
    setIsDragging(true);
    dragStart.current = { x: t.clientX, y: t.clientY, panX, panY };
  };

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || !dragStart.current || !containerRef.current) return;
    const t = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const dx = t.clientX - dragStart.current.x;
    const dy = t.clientY - dragStart.current.y;
    const newPanX = Math.min(100, Math.max(0, dragStart.current.panX - (dx / rect.width) * 60));
    const newPanY = Math.min(70, Math.max(30, dragStart.current.panY - (dy / rect.height) * 30));
    setPanX(newPanX);
    setPanY(newPanY);
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => setIsDragging(false), []);

  // Keyboard ESC to close
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Zoom
  const handleWheel = (e) => {
    e.preventDefault();
    setZoom(prev => Math.min(2, Math.max(1, prev - e.deltaY * 0.001)));
  };

  const furnLabel = furnishing === 'full' ? 'Fully Furnished'
    : furnishing === 'semi' ? 'Semi Furnished'
    : 'Unfurnished';

  const furnColor = furnishing === 'full' ? 'bg-emerald-500/80'
    : furnishing === 'semi' ? 'bg-amber-500/80'
    : 'bg-stone-500/80';

  if (!currentScene) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9999] bg-black flex flex-col select-none"
    >
      {/* ── TOP BAR ─────────────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2.5">
            <Compass className="w-4 h-4 text-[#F5A623]" />
            <div>
              <p className="text-[10px] text-white/50 font-sans uppercase tracking-widest leading-none">Virtual Tour</p>
              <p className="text-white text-xs font-bold font-sans leading-tight mt-0.5 max-w-[200px] truncate">{property.title}</p>
            </div>
          </div>
          <span className={`px-3 py-1.5 rounded-full ${furnColor} backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider font-sans border border-white/20`}>
            {furnLabel}
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          {/* Map toggle */}
          <button
            onClick={() => setShowMap(p => !p)}
            className={`p-2.5 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
              showMap ? 'bg-[#F5A623] border-[#F5A623] text-white' : 'bg-black/50 border-white/10 text-white/70 hover:text-white'
            }`}
            title="Room Map"
          >
            <Map className="w-4 h-4" />
          </button>
          {/* Reset view */}
          <button
            onClick={() => { setPanX(50); setPanY(50); setZoom(1); }}
            className="p-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          {/* Close */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/70 hover:bg-red-600 hover:border-red-600 hover:text-white transition-all cursor-pointer"
            title="Close Tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── PANORAMIC VIEWER ────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className={`flex-1 relative overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        {/* Panoramic background image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSceneId}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: transitioning ? 0 : 1, scale: transitioning ? 0.95 : 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="absolute inset-0 will-change-transform"
            style={{
              backgroundImage: `url(${currentScene.image})`,
              backgroundSize: `${250 * zoom}% auto`,
              backgroundPosition: `${panX}% ${panY}%`,
              backgroundRepeat: 'no-repeat',
              filter: transitioning ? 'brightness(0.3) blur(4px)' : 'brightness(1) blur(0px)',
              transition: isDragging ? 'none' : 'background-position 0.05s linear',
            }}
          />
        </AnimatePresence>

        {/* Scene gradient tint */}
        <div className={`absolute inset-0 bg-gradient-to-br ${SCENE_COLORS[currentScene.type] || 'from-stone-900/40 to-black/40'} opacity-30 pointer-events-none`} />

        {/* Vignette edges */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.65) 100%)'
        }} />

        {/* Hotspots */}
        <AnimatePresence>
          {!transitioning && currentScene.hotspots?.map(hotspot => (
            <Hotspot key={hotspot.id} hotspot={hotspot} onNavigate={navigateTo} />
          ))}
        </AnimatePresence>

        {/* Current room label — bottom-center of viewer */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <motion.div
            key={currentSceneId}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="flex items-center gap-2.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-5 py-2.5"
          >
            {(() => {
              const Icon = SCENE_ICONS[currentScene.type] || Compass;
              return <Icon className="w-4 h-4 text-[#F5A623]" />;
            })()}
            <span className="text-white text-sm font-bold font-sans tracking-wide">{currentScene.name}</span>
            {currentScene.floor > 0 && (
              <span className="text-white/50 text-[10px] font-sans font-bold uppercase tracking-widest border-l border-white/20 pl-2.5">
                Floor {currentScene.floor}
              </span>
            )}
          </motion.div>
        </div>

        {/* Zoom controls */}
        <div className="absolute right-5 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setZoom(p => Math.min(2, p + 0.2)); }}
            className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setZoom(p => Math.max(1, p - 0.2)); }}
            className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Drag hint */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.8 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
            >
              <div className="flex flex-col items-center gap-3">
                <motion.div
                  animate={{ x: [-20, 20, -20] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center"
                >
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.div>
                <p className="text-white/80 text-sm font-sans font-medium tracking-wide bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                  Drag to look around
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating room map */}
        <AnimatePresence>
          {showMap && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute left-5 top-1/2 -translate-y-1/2 z-40"
            >
              <FloorPlan scenes={scenes} currentScene={currentSceneId} onNavigate={navigateTo} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── BOTTOM ROOM NAVIGATOR ────────────────────────────────────── */}
      <div className="relative z-50 bg-gradient-to-t from-black/95 via-black/80 to-transparent px-4 pt-6 pb-5">
        <div className="flex items-center justify-center gap-2.5 flex-wrap">
          {scenes.map(scene => {
            const Icon = SCENE_ICONS[scene.type] || Compass;
            const active = scene.id === currentSceneId;
            return (
              <motion.button
                key={scene.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateTo(scene.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full cursor-pointer transition-all border font-sans text-xs font-bold ${
                  active
                    ? 'bg-[#F5A623] border-[#F5A623] text-white shadow-[0_0_20px_rgba(245,166,35,0.4)]'
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/15 hover:text-white hover:border-white/30'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : ''}`} />
                {scene.name}
                {active && (
                  <motion.span
                    layoutId="activeDot"
                    className="w-1.5 h-1.5 rounded-full bg-white"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Navigation arrows */}
        <div className="flex items-center justify-center gap-4 mt-3">
          <button
            onClick={() => {
              const idx = scenes.findIndex(s => s.id === currentSceneId);
              if (idx > 0) navigateTo(scenes[idx - 1].id);
            }}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/15 transition-all cursor-pointer disabled:opacity-30"
            disabled={scenes.findIndex(s => s.id === currentSceneId) === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-white/30 text-[10px] font-sans uppercase tracking-widest">
            {scenes.findIndex(s => s.id === currentSceneId) + 1} / {scenes.length} rooms
          </span>
          <button
            onClick={() => {
              const idx = scenes.findIndex(s => s.id === currentSceneId);
              if (idx < scenes.length - 1) navigateTo(scenes[idx + 1].id);
            }}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/15 transition-all cursor-pointer disabled:opacity-30"
            disabled={scenes.findIndex(s => s.id === currentSceneId) === scenes.length - 1}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default VirtualTourModal;
