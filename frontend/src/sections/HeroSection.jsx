import React, { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './HeroSection.css';

const HERO_VIDEOS = [
  "https://res.cloudinary.com/hkrsplqg/video/upload/v1786323393/258708_medium_tlyw3b.mp4",
  "https://res.cloudinary.com/hkrsplqg/video/upload/v1786376477/17404328-uhd_3840_2160_24fps_bifnxc.mp4",
  "https://res.cloudinary.com/hkrsplqg/video/upload/v1786375223/352878_medium_tybknt.mp4"
];

const FADE_DURATION = 1200; // ms — crossfade duration

const EASE = [0.16, 1, 0.3, 1];

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.25 }
  }
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: EASE }
  }
};

const HeroSection = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { isIntroComplete } = useApp();

  // A/B double-buffer: slot 0 = currently visible, slot 1 = incoming
  const slotRefs = useRef([React.createRef(), React.createRef()]);
  const activeSlot = useRef(0);         // which slot is currently showing
  const currentIdx = useRef(0);         // which video index is active
  const isFading = useRef(false);       // guard against overlapping fades

  const [activeTab, setActiveTab] = React.useState('buy');
  const [searchQuery, setSearchQuery] = React.useState('');

  // Smoothly crossfade from the current slot to the next
  const crossfadeTo = useCallback((nextVideoIdx) => {
    if (isFading.current) return;
    isFading.current = true;

    const outSlot = activeSlot.current;
    const inSlot = 1 - outSlot;
    const outEl = slotRefs.current[outSlot]?.current;
    const inEl = slotRefs.current[inSlot]?.current;
    if (!outEl || !inEl) { isFading.current = false; return; }

    // ── 1. Prepare the incoming video silently ──
    inEl.src = HERO_VIDEOS[nextVideoIdx];
    inEl.muted = true;
    inEl.currentTime = 0;
    inEl.style.opacity = '0';
    inEl.style.zIndex = '2';          // on top but invisible
    outEl.style.zIndex = '1';

    const startPlay = () => {
      inEl.play().catch(() => {});

      // ── 2. Animate opacity: in=0→0.85, out=0.85→0 ──
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / FADE_DURATION, 1);
        // Ease-in-out cubic
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        inEl.style.opacity = (eased * 0.85).toString();
        outEl.style.opacity = ((1 - eased) * 0.85).toString();
        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          // ── 3. Finalize swap ──
          inEl.style.opacity = '0.85';
          outEl.style.opacity = '0';
          outEl.pause();
          outEl.src = '';             // free up GPU memory
          activeSlot.current = inSlot;
          currentIdx.current = nextVideoIdx;
          isFading.current = false;

          // Attach timeupdate to new active video
          inEl.ontimeupdate = () => handleTimeUpdate(inEl, nextVideoIdx);
        }
      };
      requestAnimationFrame(tick);
    };

    // Wait for canplay if not ready, else start immediately
    if (inEl.readyState >= 3) {
      startPlay();
    } else {
      inEl.oncanplay = () => {
        inEl.oncanplay = null;
        startPlay();
      };
      inEl.load();
    }
  }, []);

  // Called on every timeupdate of the active video
  const handleTimeUpdate = useCallback((vidEl, vidIdx) => {
    if (isFading.current) return;
    if (!vidEl.duration || vidEl.currentTime < vidEl.duration - 1.0) return;
    const nextIdx = (vidIdx + 1) % HERO_VIDEOS.length;
    crossfadeTo(nextIdx);
  }, [crossfadeTo]);

  // Bootstrap: load first video into slot 0 on mount
  useEffect(() => {
    const el = slotRefs.current[0]?.current;
    if (!el) return;
    el.src = HERO_VIDEOS[0];
    el.muted = true;
    el.style.opacity = '0.85';
    el.style.zIndex = '1';
    el.play().catch(() => {});
    el.ontimeupdate = () => handleTimeUpdate(el, 0);
    currentIdx.current = 0;
    activeSlot.current = 0;

    // Pre-load slot 1 with video 1 (silent, paused)
    const next = slotRefs.current[1]?.current;
    if (next) {
      next.src = HERO_VIDEOS[1];
      next.muted = true;
      next.preload = 'auto';
      next.style.opacity = '0';
      next.style.zIndex = '0';
      next.load();
    }
  }, [handleTimeUpdate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const route = activeTab === 'rent' ? '/rent' : '/buy';
    if (searchQuery.trim()) {
      navigate(`${route}?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate(route);
    }
  };

  return (
    <section className="hero-section">
      {/* ── A/B Double-Buffer Video Layer ── */}
      <div className="hero-bg-container">
        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="hero-video-wrapper relative z-10 w-full h-full"
        >
          {/* Slot A */}
          <video
            ref={slotRefs.current[0]}
            muted
            playsInline
            preload="auto"
            className="hero-bg-video absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0, zIndex: 1, transition: 'none' }}
          />
          {/* Slot B */}
          <video
            ref={slotRefs.current[1]}
            muted
            playsInline
            preload="auto"
            className="hero-bg-video absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0, zIndex: 0, transition: 'none' }}
          />
        </motion.div>

        {/* Cinematic gradient overlays */}
        <div className="hero-overlay-gradient z-20" />
        <div className="hero-overlay-bottom z-20" />
      </div>

      {/* ── Editorial Text Block ── */}
      <div className="hero-content-wrapper">
        <motion.div
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          animate="visible"
          className="hero-text-block"
        >
          <motion.h1 variants={ITEM_VARIANTS} className="hero-heading">
            <span className="block text-[#F4F1EA]">Refined Architectural</span>
            <span className="hero-heading-gold block">Estates</span>
          </motion.h1>

          <motion.p variants={ITEM_VARIANTS} className="hero-subtext">
            Curating private villas &amp; waterfront developments.
          </motion.p>
        </motion.div>
      </div>

      {/* ── Floating Luxury Search Panel ── */}
      <div className="hero-search-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.5, ease: EASE }}
          className="hero-search-panel"
        >
          <div className="hero-search-tabs">
            <button
              type="button"
              onClick={() => setActiveTab('buy')}
              className={`hero-search-tab ${activeTab === 'buy' ? 'active' : ''}`}
            >
              Buy
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('rent')}
              className={`hero-search-tab ${activeTab === 'rent' ? 'active' : ''}`}
            >
              Rental
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="hero-search-form">
            <div className="hero-search-input-box">
              <Search className="hero-search-icon" />
              <input
                type="text"
                placeholder={
                  activeTab === 'rent'
                    ? 'Search luxury rentals by city, neighborhood, or keyword...'
                    : 'Search buy listings, villas, or micro-markets...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="hero-search-input"
              />
            </div>
            <button type="submit" className="btn-hero-search">
              Search
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
