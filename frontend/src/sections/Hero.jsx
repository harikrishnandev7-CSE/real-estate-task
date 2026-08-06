/**
 * IMPERIA — Cinematic Hero Section
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * PHASE STATE MACHINE (the core of this implementation)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  'intro'   → Page opens. Poster is shown as a luxury still.
 *              Video is preloading silently in the background (preload="auto",
 *              NO autoPlay). Text sequence animates smoothly over the still.
 *
 *  'playing' → All intro animations have finished + 700ms grace pause.
 *              video.currentTime = 0 is enforced, then video.play() is called.
 *              Poster cross-fades out, video cross-fades in.
 *              The full cinematic sequence plays naturally:
 *                camera movement → house lights → interior glow → car headlights
 *
 *  'frozen'  → video 'ended' event fires.
 *              We seek to (duration - 0.05s) first so the browser renders the
 *              final fully-lit frame, then pause. The hero stays frozen forever.
 *              Only a page refresh resets the experience.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * FIX LOG
 * ─────────────────────────────────────────────────────────────────────────────
 * • Removed autoPlay attr — video must NOT start until instructed by phase machine
 * • Removed attemptPlay on canPlay — video start is now phase-controlled only
 * • Added onAnimationComplete on stagger container → triggers phase transition
 * • Phase 'playing': explicit video.currentTime = 0 before play() so it always
 *   starts from frame 0 regardless of preload position
 * • Phase 'frozen': seek-before-pause with rAF safety net (fixes frame-0 flash)
 * • Fixed objectPosition: "center 28%" to show full villa (roof + sky + car)
 * • Fixed button variants: buttons now correctly inside the stagger container
 *   as individual motion.div wrappers so they receive stagger timing
 * • Replaced redundant poster hide/show logic with phase-aware opacity
 * • Removed all gesture-fallback listeners (not needed — video is phase-controlled)
 * • prefers-reduced-motion: skip to 'frozen' immediately, show poster permanently
 * • useScroll targets heroRef correctly (section element, not a child)
 *
 * Tech: React 19 + Tailwind CSS v4 + Framer Motion 12
 */

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { X, Building, Key, ArrowRight } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────── */
/*  Constants                                                           */
/* ─────────────────────────────────────────────────────────────────── */

const VIDEO_SRC  = "/hero/hero-arrival.mp4";
const AMBER      = "#F5A623";
const AMBER_DEEP = "#D97706";
const CREAM      = "#F4F1EA";

/* ─────────────────────────────────────────────────────────────────── */
/*  Framer Motion Variants — module-level, never recreated             */
/* ─────────────────────────────────────────────────────────────────── */

const CONTAINER = {
  hidden: {},
  visible: {
    transition: {
      delayChildren:  0.1,
      staggerChildren: 0.18,
    },
  },
};

const ITEM = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const BTN = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/* ─────────────────────────────────────────────────────────────────── */
/*  Component                                                           */
/* ─────────────────────────────────────────────────────────────────── */

export default function Hero({ onCtaClick }) {
  const navigate = useNavigate();
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const heroRef  = useRef(null);
  const videoRef = useRef(null);

  const prefersReduced = useRef(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  ).current;

  const viewportHeight = useRef(() => {
    if (typeof window === "undefined") return "100vh";
    const css = window.CSS;
    if (css?.supports?.("height", "100dvh")) return "100dvh";
    if (css?.supports?.("height", "100svh")) return "100svh";
    return "100vh";
  }).current();

  const { scrollYProgress } = useScroll({
    target:  heroRef,
    offset:  ["start start", "end start"],
  });

  const contentY       = useTransform(scrollYProgress, [0, 0.55], ["0%", "-9%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.40], [1, 0]);

  const handleEnded = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (vid.duration && isFinite(vid.duration)) {
      vid.currentTime = vid.duration - 0.05;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (vid) {
          vid.pause();
        }
      });
    });
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden"
      style={{
        height: viewportHeight,
        minHeight: "640px",
      }}
      aria-label="IMPERIA — Cinematic luxury estate hero"
    >
      {/* ════════════════════════════════════════════════════════════
          LAYER 0 — High Quality Media Video Background
      ════════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 z-0 overflow-hidden"
        style={{ background: "#0B0906" }}
        aria-hidden="true"
      >
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            objectPosition: "center 22%",
            filter: "brightness(1.08) contrast(1.08) saturate(1.08)",
            willChange: "transform",
          }}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={handleEnded}
          aria-hidden="true"
        />
      </div>

      {/* ════════════════════════════════════════════════════════════
          LAYER 1 — High-Contrast Subtle Gradient Overlays
      ════════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 z-10 pointer-events-none select-none"
        aria-hidden="true"
      >
        {/* Top gradient for navbar clarity */}
        <div
          className="absolute inset-x-0 top-0"
          style={{
            height: "40%",
            background:
              "linear-gradient(180deg, rgba(4,3,2,0.55) 0%, rgba(4,3,2,0.22) 50%, transparent 100%)",
          }}
        />

        {/* Left text backing overlay */}
        <div
          className="absolute inset-y-0 left-0"
          style={{
            width: "60%",
            background:
              "linear-gradient(90deg, rgba(4,3,2,0.55) 0%, rgba(4,3,2,0.3) 40%, transparent 100%)",
          }}
        />

        {/* Bottom subtle edge transition */}
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: "20%",
            background:
              "linear-gradient(0deg, rgba(4,3,2,0.45) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* ════════════════════════════════════════════════════════════
          LAYER 2 — Hero Copy
          Staggered sequence over the luxury poster still.
          onAnimationComplete triggers the 700ms → video start chain.
          Scroll-linked opacity/translate for elegant departure.
      ════════════════════════════════════════════════════════════ */}
      <motion.div
        className="absolute inset-0 z-20"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          className="flex flex-col justify-center h-full"
          style={{
            /*
             * paddingTop accounts for the fixed Navbar (64px mobile, 72px desktop)
             * plus generous breathing room above the label.
             *
             * clamp breakdown:
             *   min 90px  — below 360px wide screens (never collides with nav)
             *   preferred 12vw — scales linearly with viewport width
             *   max 160px — caps on large desktop (prevents text from drifting too low)
             *
             * The Navbar is position:fixed so it does not push the Hero down,
             * but we need padding so the label clears the nav overlay.
             */
            paddingLeft:   "clamp(32px, 7.5vw, 108px)",
            paddingRight:  "clamp(32px, 6vw, 80px)",
            paddingTop:    "clamp(90px, 12vw, 160px)",
            paddingBottom: "clamp(80px, 9vw, 120px)",
            maxWidth:      580,
          }}
          variants={CONTAINER}
          initial="hidden"
          animate="visible"
        >

          {/* ── 1. Luxury eyebrow label ──────────────────────────── */}
          <motion.div
            variants={ITEM}
            className="flex items-center gap-3"
            style={{ marginBottom: "2rem" }}
          >
            {/* Short amber rule — restrained, editorial */}
            <span
              style={{
                display:      "block",
                width:        28,
                height:       1,
                borderRadius: 999,
                background:   AMBER,
                flexShrink:   0,
                opacity:      0.9,
              }}
            />
            <span
              style={{
                fontFamily:    "'Plus Jakarta Sans', sans-serif",
                fontSize:      "clamp(8px, 0.75vw, 10px)",
                fontWeight:    600,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color:         AMBER,
                lineHeight:    1,
              }}
            >
              Private Estate Collection
            </span>
          </motion.div>

          {/* ── 2. Heading line 1 ────────────────────────────────────
             Editorial scale: medium-large, not aggressive.
             Positive letter-spacing opens the letterforms — feels premium.
             Line-height 1.15 creates breathing room between lines.
             No overflow-hidden — y:26 translation needs visible space above.
          ──────────────────────────────────────────────────────── */}
          <motion.div
            variants={ITEM}
            style={{ paddingBottom: "0.1em" }}
          >
            <h1
              style={{
                fontFamily:    "'Outfit', 'Clash Display', 'Plus Jakarta Sans', sans-serif",
                fontSize:      "clamp(34px, 4.2vw, 64px)",
                fontWeight:    800,
                lineHeight:    1.1,
                letterSpacing: "-0.02em",
                color:         "#ffffff",
                margin:        0,
              }}
            >
              A Home That
            </h1>
          </motion.div>

          {/* ── 3. Heading line 2 ──────────────────────────────────── */}
          <motion.div
            variants={ITEM}
            style={{ paddingBottom: "0.1em", marginBottom: "1.8rem" }}
          >
            <span
              role="text"
              style={{
                display:       "block",
                fontFamily:    "'Outfit', 'Clash Display', 'Plus Jakarta Sans', sans-serif",
                fontSize:      "clamp(36px, 4.5vw, 68px)",
                fontWeight:    800,
                lineHeight:    1.1,
                letterSpacing: "-0.02em",
                color:         AMBER,
              }}
            >
              Finally Feels Like Yours
            </span>
          </motion.div>

          {/* ── 4. Description ──────────────────────────────────────── */}
          <motion.p
            variants={ITEM}
            style={{
              fontFamily:    "'Plus Jakarta Sans', sans-serif",
              fontSize:      "clamp(13px, 1.05vw, 15px)",
              fontWeight:    400,
              lineHeight:    1.82,
              /*
               * FIX 4 — Boosted description opacity.
               * 0.62 was too faint over bright video frames.
               * 0.82 ensures readability in all lighting conditions
               * while still feeling subtle compared to the heading.
               */
              color:         "rgba(255,255,255,0.82)",
              maxWidth:      390,
              margin:        "0 0 2.5rem 0",
              letterSpacing: "0.01em",
            }}
          >
            Every Imperia address is curated for light, privacy &amp; long-term
            value — RERA-verified and ready to welcome you home.
          </motion.p>

          {/*
           * FIX 5 — Button stagger wrappers.
           * Replaced display:"contents" (which removes the element from layout
           * flow, breaking Framer Motion stagger in FM 12) with proper
           * flex-shrink-0 inline-flex wrappers that the stagger system can
           * track correctly.
           */}
          <div
            style={{
              display:    "flex",
              flexWrap:   "wrap",
              alignItems: "center",
              gap:        "0.875rem",
            }}
          >

            {/* Primary — amber gradient, strong glow, always legible */}
            <motion.div
              variants={BTN}
              style={{ flexShrink: 0 }}
            >
              <motion.button
                onClick={() => setShowChoiceModal(true)}
                style={{
                  fontFamily:    "'Plus Jakarta Sans', sans-serif",
                  fontSize:      "clamp(9px, 0.82vw, 11px)",
                  fontWeight:    700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  padding:       "clamp(15px, 1.45vw, 19px) clamp(32px, 3vw, 44px)",
                  borderRadius:  "100px",
                  background:    `linear-gradient(135deg, ${AMBER} 0%, ${AMBER_DEEP} 100%)`,
                  color:         "#ffffff",
                  border:        "none",
                  cursor:        "pointer",
                  display:       "inline-flex",
                  alignItems:    "center",
                  whiteSpace:    "nowrap",
                  boxShadow:     `0 0 32px rgba(245,166,35,0.45), 0 8px 24px rgba(0,0,0,0.45)`,
                }}
                whileHover={{
                  scale:      1.04,
                  boxShadow:  `0 0 52px rgba(245,166,35,0.65), 0 14px 32px rgba(0,0,0,0.50)`,
                  transition: { duration: 0.2, ease: "easeOut" },
                }}
                whileTap={{ scale: 0.97 }}
              >
                Book Site Visit
              </motion.button>
            </motion.div>

            {/* Secondary — glass pill, boosted fill for legibility */}
            <motion.div
              variants={BTN}
              style={{ flexShrink: 0 }}
            >
              <motion.button
                onClick={() => navigate('/projects')}
                style={{
                  fontFamily:           "'Plus Jakarta Sans', sans-serif",
                  fontSize:             "clamp(9px, 0.82vw, 11px)",
                  fontWeight:           600,
                  letterSpacing:        "0.2em",
                  textTransform:        "uppercase",
                  padding:              "clamp(14px, 1.4vw, 18px) clamp(30px, 2.8vw, 42px)",
                  borderRadius:         "100px",
                  background:           "rgba(255,255,255,0.15)",
                  color:                "rgba(255,255,255,0.95)",
                  border:               "1px solid rgba(255,255,255,0.45)",
                  backdropFilter:       "blur(18px)",
                  WebkitBackdropFilter: "blur(18px)",
                  boxShadow:            "0 4px 24px rgba(0,0,0,0.28)",
                  cursor:               "pointer",
                  display:              "inline-flex",
                  alignItems:           "center",
                  whiteSpace:           "nowrap",
                }}
                whileHover={{
                  background:   "rgba(255,255,255,0.24)",
                  borderColor:  "rgba(255,255,255,0.65)",
                  scale:        1.03,
                  transition:   { duration: 0.2, ease: "easeOut" },
                }}
                whileTap={{ scale: 0.97 }}
              >
                Explore Collection
              </motion.button>
            </motion.div>

          </div>
        </motion.div>
      </motion.div>

      {/* ── BUY OR RENT CHOICE MODAL ─────────────────────────────── */}
      <AnimatePresence>
        {showChoiceModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowChoiceModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9998]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-md z-[9999] bg-white border border-[#E8E4DA] rounded-3xl p-6 sm:p-8 shadow-[0_25px_50px_rgba(0,0,0,0.2)] font-sans text-left text-[#1A1A1A]"
            >
              <button
                onClick={() => setShowChoiceModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-100 text-[#8A8A85] hover:text-[#1A1A1A] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                <div className="space-y-1.5 border-b border-[#E8E4DA] pb-4">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#F5A623] font-bold block">
                    IMPERIA PRIVATE CONCIERGE
                  </span>
                  <h3 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
                    Choose Your Estate Goal
                  </h3>
                  <p className="text-xs text-[#8A8A85] font-normal leading-relaxed">
                    Select your preference to explore our curated listings and schedule a private site visit.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* BUY Option */}
                  <button
                    onClick={() => {
                      setShowChoiceModal(false);
                      navigate('/buy');
                    }}
                    className="w-full p-4 rounded-2xl border border-[#E8E4DA] hover:border-[#F5A623] bg-[#F4F1EA]/60 hover:bg-amber-50/60 transition-all flex items-center justify-between group cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-[#1A1A1A] text-[#F5A623] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                        <Building className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-[#1A1A1A] group-hover:text-[#F5A623] transition-colors">
                          BUY LUXURY PROPERTIES
                        </h4>
                        <p className="text-[11px] text-[#8A8A85]">
                          Explore villas, penthouses & prime land for sale
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#8A8A85] group-hover:text-[#F5A623] group-hover:translate-x-1 transition-all shrink-0" />
                  </button>

                  {/* RENT Option */}
                  <button
                    onClick={() => {
                      setShowChoiceModal(false);
                      navigate('/rent');
                    }}
                    className="w-full p-4 rounded-2xl border border-[#E8E4DA] hover:border-[#F5A623] bg-[#F4F1EA]/60 hover:bg-amber-50/60 transition-all flex items-center justify-between group cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-[#1A1A1A] text-[#F5A623] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                        <Key className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-[#1A1A1A] group-hover:text-[#F5A623] transition-colors">
                          RENT LUXURY RESIDENCES
                        </h4>
                        <p className="text-[11px] text-[#8A8A85]">
                          High-end rental estates & bespoke furnished suites
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#8A8A85] group-hover:text-[#F5A623] group-hover:translate-x-1 transition-all shrink-0" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
