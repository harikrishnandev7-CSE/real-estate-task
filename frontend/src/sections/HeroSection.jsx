import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './HeroSection.css';

// ── Cloudinary transformation: auto quality, mp4, max 1920px wide, ~2Mbps bitrate ──
// This reduces 4K/UHD file sizes by ~65-70%, dramatically improving buffering speed.
const CL_OPT = 'q_auto:low,f_mp4,w_1920,br_2m';

const HERO_VIDEOS = [
  `https://res.cloudinary.com/hkrsplqg/video/upload/${CL_OPT}/v1786323393/258708_medium_tlyw3b.mp4`,
  `https://res.cloudinary.com/hkrsplqg/video/upload/${CL_OPT}/v1786376477/17404328-uhd_3840_2160_24fps_bifnxc.mp4`,
  `https://res.cloudinary.com/hkrsplqg/video/upload/${CL_OPT}/v1786375223/352878_medium_tybknt.mp4`,
];

// Static poster: Cloudinary auto-generates a JPEG thumbnail from the first video's first frame.
// Loads in <1s and shows immediately — completely eliminates the black screen.
const HERO_POSTER =
  'https://res.cloudinary.com/hkrsplqg/video/upload/so_0,w_1920,q_auto,f_jpg/v1786323393/258708_medium_tlyw3b.jpg';

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

  const [activeTab, setActiveTab] = useState('buy');
  const [searchQuery, setSearchQuery] = useState('');
  // Poster is visible until the first video can play — no black screen
  const [posterVisible, setPosterVisible] = useState(true);

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
    // Start crossfade 3s before end — gives next video more time to buffer
    if (!vidEl.duration || vidEl.currentTime < vidEl.duration - 3.0) return;
    const nextIdx = (vidIdx + 1) % HERO_VIDEOS.length;
    crossfadeTo(nextIdx);
  }, [crossfadeTo]);

  // Bootstrap: load first video into slot 0 on mount.
  // Only reveal video AFTER canplay fires — poster covers the black screen until then.
  useEffect(() => {
    const el = slotRefs.current[0]?.current;
    if (!el) return;

    el.src = HERO_VIDEOS[0];
    el.muted = true;
    el.preload = 'auto';
    el.style.opacity = '0';
    el.style.zIndex = '1';
    currentIdx.current = 0;
    activeSlot.current = 0;

    const handleCanPlay = () => {
      el.removeEventListener('canplay', handleCanPlay);
      el.play().catch(() => {});

      // Animate video in over 1 second, then hide poster
      const start = performance.now();
      const REVEAL_MS = 1000;
      const revealTick = (now) => {
        const t = Math.min((now - start) / REVEAL_MS, 1);
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        el.style.opacity = (eased * 0.85).toString();
        if (t < 1) {
          requestAnimationFrame(revealTick);
        } else {
          el.style.opacity = '0.85';
          // Poster fades out via CSS transition (no hard cut)
          setPosterVisible(false);
          el.ontimeupdate = () => handleTimeUpdate(el, 0);
        }
      };
      requestAnimationFrame(revealTick);
    };

    el.addEventListener('canplay', handleCanPlay);
    el.load();

    // ── Slot 1 intentionally NOT preloaded on mount ──
    // crossfadeTo() will load it lazily when slot 0 is 3s from ending.
    // This gives all available bandwidth to Video 0 for faster first play.

    return () => {
      el.removeEventListener('canplay', handleCanPlay);
    };
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

        {/* ── Static Poster Image ──
             Shows INSTANTLY from Cloudinary (JPEG thumbnail of video frame 0).
             Fades out smoothly once the first video is ready to play.
             This completely eliminates the black screen on initial load. */}
        <div
          className="hero-poster"
          style={{ opacity: posterVisible ? 1 : 0 }}
        />

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
            className="hero-bg-video absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0, zIndex: 1 }}
          />
          {/* Slot B — loaded lazily by crossfadeTo(), not on mount */}
          <video
            ref={slotRefs.current[1]}
            muted
            playsInline
            className="hero-bg-video absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0, zIndex: 0 }}
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
